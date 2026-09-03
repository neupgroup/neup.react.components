import type { HTMLAttributes } from 'react';
import { cn } from '#/core/utils';

export function H1({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={cn('text-4xl font-bold tracking-tight', className)} {...props} />;
}

export function H2({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-3xl font-semibold tracking-tight', className)} {...props} />;
}

export function H3({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-2xl font-semibold tracking-tight', className)} {...props} />;
}

export function H4({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h4 className={cn('text-xl font-semibold tracking-tight', className)} {...props} />;
}

export function H5({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn('text-lg font-semibold', className)} {...props} />;
}

export function H6({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h6 className={cn('text-base font-semibold', className)} {...props} />;
}

export function P({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-base leading-7', className)} {...props} />;
}

export function Caption({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-xs text-muted-foreground', className)} {...props} />;
}

export function Subtitle({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-lg text-muted-foreground', className)} {...props} />;
}

export function Kicker({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-xs font-semibold uppercase tracking-wider text-muted-foreground', className)} {...props} />;
}
