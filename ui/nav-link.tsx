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
        'text-muted-foreground transition-colors duration-600 hover:text-primary-hover active:text-primary-active',
        active && 'bg-interaction-active text-primary hover:bg-interaction-active-hover hover:text-primary-hover active:bg-interaction-active-press active:text-primary-active',
      )}
      aria-current={active ? 'page' : undefined}
    />
  );
}
