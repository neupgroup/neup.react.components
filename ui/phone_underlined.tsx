'use client';

import * as React from 'react';
import { PhoneInput, type PhoneInputProps } from '@neup/components/ui/phone-input';
import { cn } from '@neup/core/utils';

const underlinedPhoneClassName = 'rounded-none border-0 border-b border-dashed border-muted-foreground/50 bg-transparent px-1 shadow-none focus-within:ring-0 focus-within:ring-offset-0';

// Render the shared phone country selector with a compact underline treatment.
const PhoneUnderlined = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, ...props }, ref) => (
    <PhoneInput {...props} ref={ref} className={cn(underlinedPhoneClassName, className)} />
  )
);

PhoneUnderlined.displayName = 'PhoneUnderlined';

export { PhoneUnderlined };
