"use client";

import * as React from "react";
import { cn } from "@neup/core/utils";
import { navigateAdjacentField } from "@neup/components/ui/field-navigation";

type TextareaLinedInputProps = Omit<
  React.ComponentProps<"textarea">,
  "type"
> & {
  autoGrow?: boolean;
  type?: "text";
};

type DateLinedInputProps = Omit<
  React.ComponentProps<"input">,
  "type" | "onKeyDown"
> & {
  autoGrow?: never;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  type: "date" | "datetime-local";
};

export type LinedInputProps =
  | TextareaLinedInputProps
  | DateLinedInputProps;

const LinedInput = React.forwardRef<
  HTMLTextAreaElement | HTMLInputElement,
  LinedInputProps
>((props, ref) => {
  const linedClassName = cn(
    "w-full border-0 bg-transparent p-0 text-lg leading-6 text-[#111827] outline-none placeholder:text-[#94A3B8] focus-visible:outline-none sm:text-xl",
    props.className
  );

  if (props.type === "date" || props.type === "datetime-local") {
    const { className: _className, autoGrow: _autoGrow, onKeyDown, ...inputProps } = props;
    return (
      <input
        {...inputProps}
        ref={ref as React.Ref<HTMLInputElement>}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          navigateAdjacentField(event);
        }}
        className={linedClassName}
      />
    );
  }

  const textareaInputProps = props as TextareaLinedInputProps;
  const {
    className: _className,
    autoGrow = false,
    onChange,
    onKeyDown,
    ...textareaProps
  } = textareaInputProps;

  return (
    <textarea
      {...textareaProps}
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
