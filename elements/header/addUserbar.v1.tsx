import Link from 'next/link';
import type { ReactNode } from 'react';
import { Userbar } from '@neup/components/element/userbar';
import { Header } from './header';

// External packages required by this component or page.
const requiredPackages = [
  "next:^16.2.2",
  "react:^19.2.4"
] as const;

export type HeaderUserbarInfo = {
  href: string;
  username: string;
  name: string;
  image?: string | null;
};

export type HeaderAddUserbarV1Props = {
  children?: ReactNode;
  profileBarInfo: HeaderUserbarInfo;
};

// Render the supplied profile details as the header's right-side userbar.
export function HeaderAddUserbarV1({ children, profileBarInfo }: HeaderAddUserbarV1Props) {
  return (
    <Header>
      <div className="flex min-w-0 flex-1 items-center">{children}</div>
      <div className="ml-auto">
        <Link href={profileBarInfo.href} className="block">
          <Userbar displayName={profileBarInfo.name} displayImage={profileBarInfo.image} neupid={profileBarInfo.username.replace(/^@/, '')} />
        </Link>
      </div>
    </Header>
  );
}
