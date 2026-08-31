import { cn } from '#/core/utils'

export type type = 'solid' | 'tinted' | 'outlined' | 'plain' | 'text'
export type size = 'default' | 'sm' | 'lg' | 'icon'
export type convey = 'danger' | 'warning' | 'success' | 'info' | 'none'
export type alignment = 'left' | 'right' | 'center'

export interface ButtonStyleProps { type?: type; convey?: convey; size?: size; alignment?: alignment; className?: string }

const types: Record<type, string> = { solid: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80', tinted: 'border border-primary/20 bg-primary/10 text-primary hover:border-primary/40 hover:bg-primary/25 hover:text-primary active:border-primary/60 active:bg-primary/35', outlined: 'border border-primary/25 bg-transparent text-primary hover:border-primary/40 hover:bg-primary/10 hover:text-primary active:border-primary/60 active:bg-primary/20', plain: 'border border-transparent bg-transparent text-foreground hover:bg-primary/10 hover:text-primary active:bg-primary/20 active:text-primary', text: 'border border-transparent bg-transparent text-foreground hover:bg-transparent hover:text-primary active:bg-transparent active:text-primary' }
const sizes: Record<size, string> = { default: 'h-10 px-4 py-2', sm: 'h-9 rounded-md px-3', lg: 'h-11 rounded-md px-8', icon: 'h-10 w-10' }
const alignments: Record<alignment, string> = { left: 'justify-start', center: 'justify-center', right: 'justify-end' }
const conveys: Record<string, string> = { danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800', warning: 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700', success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800', info: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800' }

export function buttonVariants({ type = 'tinted', convey = 'none', size = 'default', alignment = 'center', className }: ButtonStyleProps = {}) { return cn('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0', types[type], convey !== 'none' && type === 'solid' ? conveys[convey] : undefined, sizes[size], alignments[alignment], className) }