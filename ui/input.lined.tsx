"use client";

import * as React from "react";
import { cn } from "@neup/core/utils";
import { navigateAdjacentField } from "@neup/components/ui/field-navigation";

export interface LinedInputProps extends React.ComponentProps<"textarea"> {
  autoGrow?: boolean;
  type?: "text" | "date" | "datetime-local";
}

const LinedInput = React.forwardRef<
  HTMLTextAreaElement | HTMLInputElement,
  LinedInputProps
>(({ className, autoGrow = false, onChange, onKeyDown, type = "text", ...props }, ref) => {
  const linedClassName = cn(
    "w-full border-0 bg-transparent p-0 text-lg leading-6 text-[#111827] outline-none placeholder:text-[#94A3B8] focus-visible:outline-none sm:text-xl",
    className
  );

  if (type !== "text") {
    return (
      <input
        {...props}
        ref={ref as React.Ref<HTMLInputElement>}
        type={type}
        onKeyDown={(event) => {
          onKeyDown?.(event as React.KeyboardEvent<HTMLTextAreaElement>);
          navigateAdjacentField(event);
        }}
        className={linedClassName}
      />
    );
  }

  return (
    <textarea
      {...props}
      ref={ref as React.Ref<HTMLTextAreaElement>}
      onChange={(event) => {
        if (autoGrow) {
          event.currentTarget.style.height = "auto";
          event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
        }
        onChange?.(event);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        navigateAdjacentField(event);
      }}
      className={cn("resize-none overflow-hidden", linedClassName)}
    />
  );
});

LinedInput.displayName = "LinedInput";

export { LinedInput };
