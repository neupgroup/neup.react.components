"use client"

import * as React from "react"

export type ChevronDirection = "up" | "down" | "left" | "right"

interface ChevronProps extends React.HTMLAttributes<HTMLSpanElement> {
  direction: ChevronDirection
}

export function Chevron({ direction, className, ...props }: ChevronProps) {
  return (
    <span
      aria-hidden="true"
      className={[
        "inline-block h-2 w-2 border-current",
        direction === "left"
          ? "rotate-45 border-b-2 border-l-2"
          : direction === "right"
            ? "-rotate-45 border-r-2 border-t-2"
            : direction === "up"
              ? "rotate-45 border-l-2 border-t-2"
              : "-rotate-45 border-b-2 border-r-2",
        className,
      ].filter(Boolean).join(" ")}
      {...props}
    />
  )
}
