import type { ReactNode } from 'react';
import { Header } from './header';

// External packages required by this component or page.
const requiredPackages = [
  "react:^19.2.4"
] as const;

export type HeaderAddLinksOnCenterV1Props = {
  children?: ReactNode;
  links: ReactNode;
};

// Center supplied links while keeping optional content at the left.
export function HeaderAddLinksOnCenterV1({ children, links }: HeaderAddLinksOnCenterV1Props) {
  return (
    <Header>
      <div className="flex min-w-0 flex-1 items-center">{children}</div>
      <nav aria-label="Header links" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">{links}</nav>
      <div aria-hidden="true" className="flex flex-1" />
    </Header>
  );
}
