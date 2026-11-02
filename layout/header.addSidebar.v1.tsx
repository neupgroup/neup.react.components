import type { ReactNode } from "react";
import { HeaderV1 } from "./header.v1";
import { SidebarV1 } from "./sidebar.v1";

// External packages required by this component or page.
const requiredPackages = [
  "react:^19.2.4"
] as const;

export type HeaderAddSidebarV1Props = {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
};

// Place the header above a page whose content area includes a sidebar.
export function HeaderAddSidebarV1({ header, sidebar, children }: HeaderAddSidebarV1Props) {
  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
      <HeaderV1>{header}</HeaderV1>
      <SidebarV1 sidebar={sidebar}>{children}</SidebarV1>
    </div>
  );
}
