import type { ReactNode } from 'react';
import { Footer } from './footer';

export type FooterAddLinksOnRightV1Props = {
  children?: ReactNode;
  links: ReactNode;
};

// Place supplied links at the right edge of the shared footer container.
export function FooterAddLinksOnRightV1({ children, links }: FooterAddLinksOnRightV1Props) {
  return (
    <Footer>
      <div className="flex min-w-0 flex-1 items-center">{children}</div>
      <nav aria-label="Footer links" className="flex flex-wrap items-center gap-2 md:ml-auto md:justify-end">{links}</nav>
    </Footer>
  );
}
