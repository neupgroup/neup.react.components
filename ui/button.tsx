import * as React from 'react'

import { cn } from '#/core/utils'

type ButtonType = 'solid' | 'tinted' | 'outlined' | 'plain'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type?: ButtonType
  name?: string
  id?: string
  preIcon?: React.ReactNode
  postIcon?: React.ReactNode
  htmlType?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
  size?: ButtonSize
  asChild?: boolean
}

const buttonTypes: Record<ButtonType, string> = {
  solid: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
  tinted: 'border border-primary/20 bg-primary/10 text-primary hover:border-primary/40 hover:bg-primary/25 hover:text-primary active:border-primary/60 active:bg-primary/35',
  outlined: 'border border-primary/25 bg-transparent text-primary hover:border-primary/40 hover:bg-primary/10 hover:text-primary active:border-primary/60 active:bg-primary/20',
  plain: 'border border-transparent bg-transparent text-foreground hover:bg-primary/10 hover:text-primary active:bg-primary/20 active:text-primary',
}

const buttonSizes: Record<ButtonSize, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    type = 'tinted',
    htmlType = 'button',
    size = 'default',
    asChild = false,
    preIcon,
    postIcon,
    children,
    ...props
  }, ref) => {
    const buttonClassName = cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      buttonTypes[type],
      buttonSizes[size],
      className,
    )

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>

      return React.cloneElement(child, {
        ...props,
        className: cn(child.props.className, buttonClassName),
        children: <>{preIcon}{child.props.children}{postIcon}</>,
        ref,
      })
    }

    return (
      <button
        ref={ref}
        type={htmlType}
        className={buttonClassName}
        {...props}
      >
        {preIcon}
        {children}
        {postIcon}
      </button>
    )
  },
)

Button.displayName = 'Button'

export { Button }
