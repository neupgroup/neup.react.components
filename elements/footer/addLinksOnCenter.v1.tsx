import type { ReactNode } from 'react';
import { Footer } from './footer';

export type FooterAddLinksOnCenterV1Props = {
  children?: ReactNode;
  links: ReactNode;
};

// Center supplied links while keeping optional content at the left.
export function FooterAddLinksOnCenterV1({ children, links }: FooterAddLinksOnCenterV1Props) {
  return (
    <Footer>
      <div className="flex min-w-0 flex-1 items-center">{children}</div>
      <nav aria-label="Footer links" className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2">{links}</nav>
      <div aria-hidden="true" className="hidden md:flex md:flex-1" />
    </Footer>
  );
}
