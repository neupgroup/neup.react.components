'use client';

import NextLink from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { APP_BASE_PATH } from '#/core/appconfig';

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  takesTo?: string;
  href?: string;
  backsTo?: string;
  backs?: string;
  children?: ReactNode;
};

function isExternalUrl(value: string) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value);
}

function makeHref(destination: string, backsTo?: string) {
  const raw = destination || '#';
  let result = raw;

  if (raw.startsWith('/') && !raw.startsWith('//')) {
    result = `${APP_BASE_PATH}${raw}`.replace(/\/+/g, '/');
  }

  if (!backsTo) return result;

  const hashIndex = result.indexOf('#');
  const hash = hashIndex >= 0 ? result.slice(hashIndex) : '';
  const withoutHash = hashIndex >= 0 ? result.slice(0, hashIndex) : result;
  const separator = withoutHash.includes('?') ? '&' : '?';
  return `${withoutHash}${separator}backsTo=${encodeURIComponent(backsTo)}${hash}`;
}

export function Link({ takesTo, href, backsTo, backs, children, ...props }: LinkProps) {
  const destination = takesTo ?? href ?? '#';
  const resolvedHref = makeHref(destination, backsTo ?? backs);

  if (isExternalUrl(resolvedHref) || resolvedHref.startsWith('mailto:') || resolvedHref.startsWith('tel:')) {
    return <a href={resolvedHref} {...props}>{children}</a>;
  }

  return <NextLink href={resolvedHref} {...props}>{children}</NextLink>;
}
