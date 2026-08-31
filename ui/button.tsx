import * as React from 'react'
import { buttonVariants, type ButtonStyleProps } from '#/components/styles/button'
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>, ButtonStyleProps { htmlType?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']; preIcon?: React.ReactNode; postIcon?: React.ReactNode }
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, type = 'tinted', convey = 'none', htmlType = 'button', size = 'default', alignment = 'center', preIcon, postIcon, children, ...props }, ref) => {
  const classes = buttonVariants({ type, convey, size, alignment, className })
  return <button ref={ref} type={htmlType} className={classes} {...props}>{preIcon}{children}{postIcon}</button>
})
Button.displayName = 'Button'
export { Button, buttonVariants }
