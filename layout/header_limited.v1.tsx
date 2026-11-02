'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@neup/core/utils';
import { Link } from '@neup/components/ui/link';
import { LetterImage } from '@neup/components/ui/letterImage';
import { Header } from '@neup/components/elements/header/header';

// External packages required by this component or page.
const requiredPackages = [
  "next:^16.2.2",
  "react:^19.2.4"
] as const;

export type HeaderLimitedNavLink = {
  href: string;
  label: string;
};

export type HeaderLimitedProfileBarInfo = {
  href: string;
  username: string;
  name: string;
  image?: string | null;
};

export type HeaderLimitedV1Props = {
  appName: string;
  appNameHref: string;
  appLogo?: string | null;
  navLinks: readonly HeaderLimitedNavLink[];
  profileBarInfo: HeaderLimitedProfileBarInfo;
  className?: string;
};

// Render the app name and optional logo as the header's home link.
function AppIdentity({ appName, appNameHref, appLogo }: Pick<HeaderLimitedV1Props, 'appName' | 'appNameHref' | 'appLogo'>) {
  return (
    <Link takesTo={appNameHref} className="flex min-w-0 items-center gap-2 text-[var(--foreground)]">
      {appLogo && <img src={appLogo} alt="" className="h-8 w-8 shrink-0 object-contain" />}
      <span className="truncate font-semibold">{appName}</span>
    </Link>
  );
}

// Render the profile link with a photo or the shared initials image fallback.
function ProfileBar({ profileBarInfo }: { profileBarInfo: HeaderLimitedProfileBarInfo }) {
  const initials = profileBarInfo.name.trim() || profileBarInfo.username.trim() || 'U';
  return (
    <Link
      takesTo={profileBarInfo.href}
      className="group flex min-w-0 items-center gap-3 rounded-full px-2 py-1 transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)]"
    >
      <span className="hidden min-w-0 text-right sm:block">
        <span className="block max-w-40 truncate text-sm font-medium leading-tight">{profileBarInfo.name}</span>
        <span className="block max-w-40 truncate text-xs text-muted-foreground">@{profileBarInfo.username.replace(/^@/, '')}</span>
      </span>
      <LetterImage
        src={profileBarInfo.image}
        initials={initials}
        alt={profileBarInfo.name || profileBarInfo.username}
        className="h-9 w-9 rounded-full"
        fontSize="0.8rem"
      />
    </Link>
  );
}

// Create a compact header with a fixed structure and configurable app navigation.
export default function HeaderLimitedV1({ appName, appNameHref, appLogo, navLinks, profileBarInfo, className }: HeaderLimitedV1Props) {
  const pathname = usePathname();
  return (
    <Header className={cn('border-[var(--border)] bg-[var(--background)]', className)}>
      <div className="flex h-full w-full items-center gap-6">
        <AppIdentity appName={appName} appNameHref={appNameHref} appLogo={appLogo} />
        <nav aria-label="Main navigation" className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
            return (
              <Link
                key={href}
                takesTo={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'shrink-0 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)] hover:text-[var(--foreground)]',
                  isActive && 'bg-[color-mix(in_srgb,var(--foreground)_7%,transparent)] text-[var(--foreground)]',
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <ProfileBar profileBarInfo={profileBarInfo} />
      </div>
    </Header>
  );
}
