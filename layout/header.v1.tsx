import type { ReactNode } from "react";

type HeaderV1Props = {
  children: ReactNode;
};

export function HeaderV1({ children }: HeaderV1Props) {
  return (
    <header
      className="sticky top-0 z-[var(--layer-header)] h-[var(--site-header-height)] w-full shrink-0 bg-[var(--background)] shadow-[0_2px_8px_color-mix(in_srgb,var(--foreground)_12%,transparent)]"
    >
      {children}
    </header>
  );
}
