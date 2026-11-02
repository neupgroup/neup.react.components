import type { ReactNode } from 'react';
import { Header } from './header';

// External packages required by this component or page.
const requiredPackages = [
  "react:^19.2.4"
] as const;

export type HeaderAddRawHtmlV1Props = {
  children: ReactNode;
};

// Render caller-provided React content directly inside the shared header shell.
export function HeaderAddRawHtmlV1({ children }: HeaderAddRawHtmlV1Props) {
  return <Header>{children}</Header>;
}
