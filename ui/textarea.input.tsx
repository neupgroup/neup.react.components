"use client";

import * as React from "react";
import { cn } from "@neup/core/utils";
import { navigateAdjacentField } from "@neup/components/ui/field-navigation";

export interface TextareaInputProps
  extends React.ComponentProps<"textarea"> {
  autoGrow?: boolean;
}

const TextareaInput = React.forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  ({ className, autoGrow = false, onChange, onKeyDown, ...props }, ref) => {
    return (
      <textarea
        {...props}
        ref={ref}
        onChange={(event) => {
          if (autoGrow) {
            event.currentTarget.style.height = "auto";
            event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
          }
          onChange?.(event);
        }}
        onKeyDown={(event) => {
          navigateAdjacentField(event);
          onKeyDown?.(event);
        }}
        className={cn(
          "w-full resize-none border-0 bg-transparent p-0 text-base leading-7 text-[#64748B] outline-none placeholder:text-[#94A3B8] focus-visible:outline-none",
          className
        )}
      />
    );
  }
);

TextareaInput.displayName = "TextareaInput";

export { TextareaInput };
