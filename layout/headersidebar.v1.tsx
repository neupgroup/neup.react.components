import type { ReactNode } from "react";
import { HeaderAddSidebarV1 } from "./header.addSidebar.v1";

// External packages required by this component or page.
const requiredPackages = [
  "react:^19.2.4"
] as const;

export type HeaderSidebarV1Props = {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
};

// Compose the header and sidebar layouts into one page layout.
export function HeaderSidebarV1({ header, sidebar, children }: HeaderSidebarV1Props) {
  return (
    <HeaderAddSidebarV1 header={header} sidebar={sidebar}>
      {children}
    </HeaderAddSidebarV1>
  );
}
