import * as React from 'react'
import { buttonVariants, type ButtonStyleProps } from '@neup/components/styles/button'

// External packages required by this component or page.
const requiredPackages = [
  "react:^19.2.4"
] as const;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleProps { htmlType?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']; preIcon?: React.ReactNode; postIcon?: React.ReactNode; asChild?: boolean; href?: string }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'tinted', convey = 'none', htmlType, type: legacyType, size = 'default', alignment = 'center', preIcon, postIcon, children, asChild: _asChild, href: _href, ...props }, ref) => {
  const classes = buttonVariants({ variant, convey, size, alignment, className })
  return <button ref={ref} type={htmlType ?? legacyType ?? 'button'} className={classes} {...props}>{preIcon}{children}{postIcon}</button>
})
Button.displayName = 'Button'
export { Button, buttonVariants }
