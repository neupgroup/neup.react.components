import type { ReactNode } from 'react';
import Link from 'next/link';
import { Userbar } from '@neup/components/element/userbar';
import { Footer } from './footer';
import type { FooterUserbarInfo } from './addUserbar.v1';

export type FooterAddLinksOnCenterAddUserbarV1Props = {
  children?: ReactNode;
  links: ReactNode;
  profileBarInfo: FooterUserbarInfo;
};

// Center the supplied links and keep the profile userbar aligned at the right.
export function FooterAddLinksOnCenterAddUserbarV1({ children, links, profileBarInfo }: FooterAddLinksOnCenterAddUserbarV1Props) {
  return (
    <Footer>
      <div className="flex min-w-0 flex-1 items-center">{children}</div>
      <nav aria-label="Footer links" className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2">{links}</nav>
      <div className="flex min-w-0 flex-1 md:justify-end">
        <Link href={profileBarInfo.href} className="block">
          <Userbar displayName={profileBarInfo.name} displayImage={profileBarInfo.image} neupid={profileBarInfo.username.replace(/^@/, '')} />
        </Link>
      </div>
    </Footer>
  );
}
