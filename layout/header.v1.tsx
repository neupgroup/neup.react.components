import type { ReactNode } from "react";
import { Header } from "@neup/components/elements/header/header";

// External packages required by this component or page.
const requiredPackages = [
  "react:^19.2.4"
] as const;

type HeaderV1Props = {
  children: ReactNode;
};

export function HeaderV1({ children }: HeaderV1Props) {
  return <Header>{children}</Header>;
}
