import { cn } from '@neup/core/utils'

// External packages required by this component or page.
const requiredPackages = [] as const;

export type variant = 'solid' | 'tinted' | 'outlined' | 'text' | 'sem.danger' | 'sem.warning' | 'sem.success' | 'sem.informative'
export type size = 'default' | 'sm' | 'lg' | 'icon'
export type alignment = 'left' | 'right' | 'center'

export interface ButtonStyleProps { variant?: variant; size?: size; alignment?: alignment; className?: string }

const variants: Record<variant, string> = {
  solid: 'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-press',
  tinted: 'border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 active:bg-primary/15',
  outlined: 'border border-primary bg-transparent text-primary hover:bg-interaction-hover active:bg-interaction-press',
  text: 'border border-transparent bg-transparent text-foreground hover:bg-interaction-hover hover:text-primary-hover active:bg-interaction-press active:text-primary-active',
  'sem.danger': 'bg-danger text-danger-foreground hover:bg-danger-hover active:bg-danger-press',
  'sem.warning': 'bg-warning text-warning-foreground hover:bg-warning-hover active:bg-warning-press',
  'sem.success': 'bg-success text-success-foreground hover:bg-success-hover active:bg-success-press',
  'sem.informative': 'bg-informatic text-informatic-foreground hover:bg-informatic-hover active:bg-informatic-press',
}

const sizes: Record<size, string> = { default: 'h-10 px-4 py-2', sm: 'h-9 rounded-md px-3', lg: 'h-11 rounded-md px-8', icon: 'h-10 w-10' }
const alignments: Record<alignment, string> = { left: 'justify-start', center: 'justify-center', right: 'justify-end' }

// Build the common interaction and sizing classes for buttons and button links.
export function buttonVariants({ variant = 'outlined', size = 'default', alignment = 'center', className }: ButtonStyleProps = {}) {
  return cn(
    'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    variants[variant],
    sizes[size],
    alignments[alignment],
    className,
  )
}
