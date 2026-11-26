import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { buttonVariants, type ButtonStyleProps } from '@neup/components/styles/button'

// External packages required by this component or page.
const requiredPackages = [
  "react:^19.2.4"
] as const;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleProps { htmlType?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']; preIcon?: React.ReactNode; postIcon?: React.ReactNode; asChild?: boolean; href?: string }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'outlined', htmlType, type: legacyType, size = 'default', alignment = 'center', preIcon, postIcon, children, asChild = false, href: _href, ...props }, ref) => {
  const classes = buttonVariants({ variant, size, alignment, className })
  const Component = asChild ? Slot : 'button'
  return <Component ref={ref} type={asChild ? undefined : htmlType ?? legacyType ?? 'button'} className={classes} {...props}>{preIcon}{children}{postIcon}</Component>
})
Button.displayName = 'Button'
export { Button, buttonVariants }
