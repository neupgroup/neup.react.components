import type { ReactNode } from "react";

type HeaderV1Props = {
  children: ReactNode;
};

export function HeaderV1({ children }: HeaderV1Props) {
  return (
    // If this header needs active-link selection, review the organization and usage notes in ../scripts/activelinkselection.ts.
    <header
      className="sticky top-0 z-[var(--layer-header)] h-[var(--site-header-height)] w-full shrink-0 bg-[var(--background)] shadow-[0_2px_5px_color-mix(in_srgb,var(--foreground)_18%,transparent),0_8px_20px_color-mix(in_srgb,var(--foreground)_12%,transparent)]"
    >
      <div className="mx-auto h-full w-full max-w-[1440px] px-4 md:px-8">
        {children}
      </div>
    </header>
  );
}
