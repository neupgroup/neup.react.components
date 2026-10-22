//to be remade

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@neup/core/utils'
import { Button, type ButtonProps } from '@neup/components/ui/button'
import { LinkButton } from '@neup/components/ui/link-button'

const navButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors duration-600 ease-out hover:bg-interaction-hover hover:text-primary-hover active:bg-interaction-press active:text-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      active: {
        false: '',
        true: 'bg-interaction-active text-primary hover:bg-interaction-active-hover hover:text-primary-hover active:bg-interaction-active-press active:text-primary-active',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

export type NavButtonProps = ButtonProps & VariantProps<typeof navButtonVariants> & {
  isActive?: boolean
  tooltip?: React.ReactNode
}

const NavButton = React.forwardRef<HTMLButtonElement, NavButtonProps>(
  ({ className, active, isActive, tooltip: _tooltip, variant, href, ...props }, ref) => {
    const isCurrent = active ?? isActive ?? false
    const navigationClassName = cn(navButtonVariants({ active: isCurrent, className }), isCurrent && 'active')
    if (href) {
      return <LinkButton href={href} variant={variant ?? 'plain'} className={navigationClassName} {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)} />
    }
    return (
      <Button
        ref={ref}
        variant={variant ?? 'plain'}
        data-active={isCurrent || undefined}
        className={navigationClassName}
        {...props}
      />
    )
  }
)
NavButton.displayName = 'NavButton'

export { NavButton, navButtonVariants }
