import type { ReactNode } from 'react';
import { Footer } from './footer';

export type FooterAddRawHtmlV1Props = {
  children: ReactNode;
};

// Render caller-provided React content directly inside the shared footer shell.
export function FooterAddRawHtmlV1({ children }: FooterAddRawHtmlV1Props) {
  return <Footer><div className="w-full min-w-0">{children}</div></Footer>;
}
