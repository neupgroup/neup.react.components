'use client';

import * as React from 'react';
import { cn } from '@neup/core/utils';
import { buttonVariants, type ButtonStyleProps } from '@neup/components/styles/button';
import { Link } from '@neup/components/ui/link';

export type NavLinkProps = React.ComponentPropsWithoutRef<typeof Link> & ButtonStyleProps & { active?: boolean };

export function NavLink({ active = false, className, variant = 'plain', ...props }: NavLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        buttonVariants({ variant, alignment: 'left', className }),
        'text-muted-foreground transition-colors duration-200 hover:text-primary',
        active && 'bg-primary/20 text-primary hover:bg-primary/30',
      )}
      aria-current={active ? 'page' : undefined}
    />
  );
}
