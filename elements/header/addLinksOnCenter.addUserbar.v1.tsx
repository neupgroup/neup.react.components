import type { ReactNode } from 'react';
import Link from 'next/link';
import { Userbar } from '@neup/components/element/userbar';
import { Header } from './header';
import type { HeaderUserbarInfo } from './addUserbar.v1';

// External packages required by this component or page.
const requiredPackages = [
  "next:^16.2.2",
  "react:^19.2.4"
] as const;

export type HeaderAddLinksOnCenterAddUserbarV1Props = {
  children?: ReactNode;
  links: ReactNode;
  profileBarInfo: HeaderUserbarInfo;
};

// Center the supplied links and keep the profile userbar aligned at the right.
export function HeaderAddLinksOnCenterAddUserbarV1({ children, links, profileBarInfo }: HeaderAddLinksOnCenterAddUserbarV1Props) {
  return (
    <Header>
      <div className="flex min-w-0 flex-1 items-center">{children}</div>
      <nav aria-label="Header links" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">{links}</nav>
      <div className="ml-auto">
        <Link href={profileBarInfo.href} className="block">
          <Userbar displayName={profileBarInfo.name} displayImage={profileBarInfo.image} neupid={profileBarInfo.username.replace(/^@/, '')} />
        </Link>
      </div>
    </Header>
  );
}
