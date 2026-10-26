import type { ReactNode } from "react";

type SidebarProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

export function Sidebar({ sidebar, children }: SidebarProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-var(--site-header-height))] w-full max-w-[1440px] items-start px-4 md:px-8">
      {/* If sidebar links need active selection, review ../scripts/activelinkselection.ts before adding that behavior. */}
      <aside
        className="sticky top-[var(--site-header-height)] z-[var(--layer-sidebar)] hidden h-[calc(100dvh-var(--site-header-height))] basis-[248px] shrink-0 overflow-y-auto overscroll-y-contain border-r border-[var(--border)] bg-[var(--background)] pr-4 md:block"
        aria-label="Sidebar navigation"
      >
        {sidebar}
      </aside>
      <main id="main-content" className="relative z-[var(--layer-content)] min-w-0 flex-1 py-8 md:py-10 md:pl-10" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
