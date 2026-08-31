'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import { cn } from '#/core/utils';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, ...props }, ref) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as Node | null;
      const element = target instanceof Element ? target : target?.parentElement;
      const link = element?.closest('a');
      if (!link || link.target === '_blank' || link.hasAttribute('download') || link.getAttribute('aria-disabled') === 'true') return;

      const href = link.href;
      if (!href || new URL(href, window.location.href).origin !== window.location.origin) return;

      const nextUrl = new URL(href, window.location.href);
      const currentUrl = new URL(window.location.href);
      if (nextUrl.pathname === currentUrl.pathname && nextUrl.search === currentUrl.search && nextUrl.hash === currentUrl.hash) return;

      startedAt.current = Date.now();
      NProgress.set(0.12);
      NProgress.start();
    };

    document.addEventListener('click', handleLinkClick, true);
    return () => document.removeEventListener('click', handleLinkClick, true);
  }, []);

  useEffect(() => {
    const elapsed = startedAt.current === null ? 0 : Date.now() - startedAt.current;
    const remaining = Math.max(0, 250 - elapsed);
    const timeout = window.setTimeout(() => {
      NProgress.done();
      startedAt.current = null;
    }, remaining);

    return () => window.clearTimeout(timeout);
  }, [pathname, searchParams]);

    if (value === undefined) return null;

    const progress = Math.min(100, Math.max(0, value));

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className={cn(
          'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
          className
        )}
        {...props}
      >
        <div
          className="h-full w-full flex-1 bg-primary transition-all"
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';
