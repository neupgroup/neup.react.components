import Link from 'next/link';
import type { ReactNode } from 'react';
import { Userbar } from '@neup/components/element/userbar';
import { Footer } from './footer';

export type FooterUserbarInfo = {
  href: string;
  username: string;
  name: string;
  image?: string | null;
};

export type FooterAddUserbarV1Props = {
  children?: ReactNode;
  profileBarInfo: FooterUserbarInfo;
};

// Render the supplied profile details as the footer's right-side userbar.
export function FooterAddUserbarV1({ children, profileBarInfo }: FooterAddUserbarV1Props) {
  return (
    <Footer>
      <div className="flex min-w-0 flex-1 items-center">{children}</div>
      <div className="flex min-w-0 flex-1 md:justify-end">
        <Link href={profileBarInfo.href} className="block">
          <Userbar displayName={profileBarInfo.name} displayImage={profileBarInfo.image} neupid={profileBarInfo.username.replace(/^@/, '')} />
        </Link>
      </div>
    </Footer>
  );
}
