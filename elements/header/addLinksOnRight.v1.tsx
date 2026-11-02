import type { ReactNode } from 'react';
import { Header } from './header';

// External packages required by this component or page.
const requiredPackages = [
  "react:^19.2.4"
] as const;

export type HeaderAddLinksOnRightV1Props = {
  children?: ReactNode;
  links: ReactNode;
};

// Place supplied links at the right edge of the shared header container.
export function HeaderAddLinksOnRightV1({ children, links }: HeaderAddLinksOnRightV1Props) {
  return (
    <Header>
      <div className="flex min-w-0 flex-1 items-center">{children}</div>
      <nav aria-label="Header links" className="ml-auto flex shrink-0 items-center gap-2">{links}</nav>
    </Header>
  );
}
