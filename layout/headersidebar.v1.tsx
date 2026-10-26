import type { ReactNode } from "react";
import { HeaderV1 } from "./header.v1";
import { Sidebar } from "./sidebar.v1";

type HeaderSidebarV1Props = {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
};

export function HeaderSidebarV1({ header, sidebar, children }: HeaderSidebarV1Props) {
  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
      <HeaderV1>{header}</HeaderV1>
      <Sidebar sidebar={sidebar}>{children}</Sidebar>
    </div>
  );
}
