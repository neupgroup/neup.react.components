import { cn } from '@neup/core/utils'

// Keep the legacy names accepted while callers migrate to the new style API.
export type variant = 'solid' | 'tinted' | 'outlined' | 'plain' | 'text' | (string & {})
export type size = 'default' | 'sm' | 'lg' | 'icon'
export type convey = 'danger' | 'warning' | 'success' | 'info' | 'none'
export type alignment = 'left' | 'right' | 'center'

export interface ButtonStyleProps { variant?: variant; convey?: convey; size?: size; alignment?: alignment; className?: string }

const variants: Record<variant, string> = {
  solid: 'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-press',
  tinted: 'border border-primary/20 bg-primary/10 text-primary hover:bg-interaction-hover active:bg-interaction-press',
  outlined: 'border border-primary bg-transparent text-primary hover:bg-interaction-hover active:bg-interaction-press',
  plain: 'border border-transparent bg-transparent text-foreground hover:bg-interaction-hover hover:text-primary-hover active:bg-interaction-press active:text-primary-active',
  text: 'border border-transparent bg-transparent text-foreground hover:bg-interaction-hover hover:text-primary-hover active:bg-interaction-press active:text-primary-active',
}
const sizes: Record<size, string> = { default: 'h-10 px-4 py-2', sm: 'h-9 rounded-md px-3', lg: 'h-11 rounded-md px-8', icon: 'h-10 w-10' }
const alignments: Record<alignment, string> = { left: 'justify-start', center: 'justify-center', right: 'justify-end' }
const conveys: Record<string, string> = { danger: 'bg-danger text-danger-foreground hover:bg-danger-hover active:bg-danger-press', warning: 'bg-warning text-warning-foreground hover:bg-warning-hover active:bg-warning-press', success: 'bg-success text-success-foreground hover:bg-success-hover active:bg-success-press', info: 'bg-informatic text-informatic-foreground hover:bg-informatic-hover active:bg-informatic-press' }

export function buttonVariants({ variant = 'tinted', convey = 'none', size = 'default', alignment = 'center', className }: ButtonStyleProps = {}) { return cn('inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors duration-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0', variants[variant as keyof typeof variants] ?? variants.tinted, convey !== 'none' && variant === 'solid' ? conveys[convey] : undefined, sizes[size], alignments[alignment], className) }
