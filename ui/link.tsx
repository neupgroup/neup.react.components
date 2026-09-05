'use client';

import NextLink from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  takesTo?: string;
  href?: string;
  backsTo?: string;
  backs?: string;
  children?: ReactNode;
};

function external(value: string) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value);
}

class LinkBuilder {
  private target = '#';
  private params = new URLSearchParams();
  private removed = new Set<string>();
  private kept = new Set<string>();
  private backParam?: string;

  takesTo(value: string) { this.target = value; return this; }
  backsTo(value: string) { this.backParam = value; return this; }
  addParam(key: string, value: string) { this.params.set(key, value); return this; }
  lessParam(key: string) { this.params.delete(key); this.removed.add(key); return this; }
  keepParam(key: string) { this.kept.add(key); return this; }
  get() { return build(this.target, this.backParam, this.params, this.removed, this.kept); }
}

function build(target: string, backsTo?: string, params = new URLSearchParams(), removed = new Set<string>(), kept = new Set<string>()) {
  let result = target || '#';
  const isFull = external(result) || result.startsWith('mailto:') || result.startsWith('tel:');
  const hash = result.indexOf('#');
  const suffix = hash >= 0 ? result.slice(hash) : '';
  const url = new URL(hash >= 0 ? result.slice(0, hash) : result, 'https://link.local');
  if (typeof window !== 'undefined') {
    const current = new URLSearchParams(window.location.search);
    kept.forEach((key) => { if (current.has(key)) url.searchParams.set(key, current.get(key)!); });
  }
  removed.forEach((key) => url.searchParams.delete(key));
  params.forEach((value, key) => url.searchParams.set(key, value));
  if (backsTo) url.searchParams.set('backsTo', backsTo);
  const query = url.searchParams.toString();
  const path = isFull ? `${url.protocol === 'https:' && url.hostname === 'link.local' ? '' : url.origin}${url.pathname}` : `${url.pathname}`;
  return `${path}${query ? `?${query}` : ''}${suffix}`.replace('https://link.local', '');
}

export function Link({ takesTo, href, backsTo, backs, children, className, ...props }: LinkProps) {
  const target = takesTo ?? href ?? '#';
  const resolved = build(target, backsTo ?? backs);
  return external(resolved) || resolved.startsWith('mailto:') || resolved.startsWith('tel:')
    ? <a href={resolved} className={className} {...props}>{children}</a>
    : <NextLink href={resolved} className={className} {...props}>{children}</NextLink>;
}

Link.addParam = (key: string, value: string) => new LinkBuilder().addParam(key, value);
Link.lessParam = (key: string) => new LinkBuilder().lessParam(key);
Link.keepParam = (key: string) => new LinkBuilder().keepParam(key);
Link.backsTo = (value: string) => new LinkBuilder().backsTo(value);
Link.takesTo = (value: string) => new LinkBuilder().takesTo(value);
