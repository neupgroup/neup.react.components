import * as React from 'react'

import { cn } from '#/core/utils'

type ButtonType = 'solid' | 'tinted' | 'outlined' | 'plain' | 'text'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'
type ButtonConvey = 'danger' | 'warning' | 'success' | 'info' | 'none'

interface CommonButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  name?: string
  id?: string
  preIcon?: React.ReactNode
  postIcon?: React.ReactNode
  htmlType?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
  size?: ButtonSize
  asChild?: boolean
}

type ButtonProps = CommonButtonProps &
  ({
    type?: Exclude<ButtonType, 'plain' | 'text'>
    convey?: ButtonConvey
  } | {
    type: 'plain' | 'text'
    convey?: never
  })

const buttonTypes: Record<ButtonType, string> = {
  solid: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
  tinted: 'border border-primary/20 bg-primary/10 text-primary hover:border-primary/40 hover:bg-primary/25 hover:text-primary active:border-primary/60 active:bg-primary/35',
  outlined: 'border border-primary/25 bg-transparent text-primary hover:border-primary/40 hover:bg-primary/10 hover:text-primary active:border-primary/60 active:bg-primary/20',
  plain: 'border border-transparent bg-transparent text-foreground hover:bg-primary/10 hover:text-primary active:bg-primary/20 active:text-primary',
  text: 'border border-transparent bg-transparent text-foreground hover:bg-transparent hover:text-primary active:bg-transparent active:text-primary',
}

const conveyTypes: Record<Exclude<ButtonType, 'plain' | 'text'>, Record<Exclude<ButtonConvey, 'none'>, string>> = {
  solid: {
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    warning: 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
    info: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
  },
  tinted: {
    danger: 'border-red-200 bg-red-50 text-red-700 hover:border-red-400 hover:bg-red-100 active:border-red-500 active:bg-red-200',
    warning: 'border-orange-200 bg-orange-50 text-orange-700 hover:border-orange-400 hover:bg-orange-100 active:border-orange-500 active:bg-orange-200',
    success: 'border-green-200 bg-green-50 text-green-700 hover:border-green-400 hover:bg-green-100 active:border-green-500 active:bg-green-200',
    info: 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-400 hover:bg-blue-100 active:border-blue-500 active:bg-blue-200',
  },
  outlined: {
    danger: 'border-red-300 bg-transparent text-red-700 hover:border-red-500 hover:bg-red-50 active:border-red-600 active:bg-red-100',
    warning: 'border-orange-600 bg-transparent text-orange-700 hover:border-orange-700 hover:bg-orange-50 hover:text-orange-800 active:border-orange-800 active:bg-orange-100 active:text-orange-900',
    success: 'border-green-300 bg-transparent text-green-700 hover:border-green-500 hover:bg-green-50 active:border-green-600 active:bg-green-100',
    info: 'border-blue-300 bg-transparent text-blue-700 hover:border-blue-500 hover:bg-blue-50 active:border-blue-600 active:bg-blue-100',
  },
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
    convey = 'none',
    htmlType = 'button',
    size = 'default',
    asChild = false,
    preIcon,
    postIcon,
    children,
    ...props
  }, ref) => {
    const conveyClassName = convey !== 'none' && type !== 'plain' && type !== 'text'
      ? conveyTypes[type as Exclude<ButtonType, 'plain' | 'text'>][convey as Exclude<ButtonConvey, 'none'>]
      : undefined
    const buttonClassName = cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
          buttonTypes[type],
          conveyClassName,
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

export { Button, type ButtonProps }
