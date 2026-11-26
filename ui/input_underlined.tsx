'use client';

import * as React from 'react';
import { Input, type InputProps } from '@neup/components/ui/input';
import { cn } from '@neup/core/utils';

const underlinedInputClassName = 'h-9 min-w-0 rounded-none border-0 border-b border-dashed border-muted-foreground/50 bg-transparent px-1 shadow-none focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0';

// Render the shared Neup input with a compact underline treatment.
const InputUnderlined = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input {...props} ref={ref} className={cn(underlinedInputClassName, className)} />
  )
);

InputUnderlined.displayName = 'InputUnderlined';

export { InputUnderlined, underlinedInputClassName };
