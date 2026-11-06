'use client';

import { useEffect, useState, type ComponentType, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink, Menu, X } from 'lucide-react';
import { cn } from '@neup/core/utils';
import RootLayout from '@neup/components/layout/RootLayout';
import { Button } from '@neup/components/ui/button';
import { NavLink } from '@neup/components/ui/nav-link';
import { ScrollArea } from '@neup/components/ui/scroll-area';
import { Sidebar, SidebarProvider } from '@neup/components/ui/sidebar';
import { Userbar } from '@neup/components/element/userbar';

// External packages required by this component or page.
const requiredPackages = [
  "lucide-react:^0.475.0",
  "next:^16.2.2",
  "react:^19.2.4"
] as const;

export type SidebarLink = {
  href: string;
  label: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  external?: boolean;
};

export type SidebarLinkGroup = {
  label?: string;
  links: readonly SidebarLink[];
};

export type ProfileBarInfo = {
  href: string;
  displayName: string | null;
  displayImage?: string | null;
  neupid: string | null;
};

export type HeaderSidebarLayoutProps = {
  children: ReactNode;
  sidebarlinks: readonly (SidebarLink | SidebarLinkGroup)[];
  pofileBarInfo: ProfileBarInfo;
  /** Rendered in the original logo position. Pass branded links or other header links. */
  headerLinks: readonly ReactNode[];
};

// Keep adjacent ungrouped links together using the app's original group spacing.
function groupSidebarLinks(items: HeaderSidebarLayoutProps['sidebarlinks']): SidebarLinkGroup[] {
  const groups: SidebarLinkGroup[] = [];
  let ungrouped: SidebarLink[] = [];
  for (const item of items) {
    if ('links' in item) {
      if (ungrouped.length) groups.push({ links: ungrouped });
      ungrouped = [];
      groups.push(item);
    } else {
      ungrouped.push(item);
    }
  }
  if (ungrouped.length) groups.push({ links: ungrouped });
  return groups;
}

// Match the most specific route, ignoring query strings and external destinations.
function findActiveHref(groups: SidebarLinkGroup[], pathname: string): string | undefined {
  return groups.flatMap(group => group.links)
    .filter(link => !link.external && link.href.startsWith('/') && !link.href.startsWith('//'))
    .filter(link => {
      const path = link.href.split(/[?#]/)[0];
      return pathname === path || (path !== '/' && pathname.startsWith(`${path}/`));
    })
    .sort((a, b) => b.href.split(/[?#]/)[0].length - a.href.split(/[?#]/)[0].length)[0]?.href;
}

// Render the same navigation markup for desktop and mobile.
function SidebarNavigation({ groups, pathname, onLinkClick }: {
  groups: SidebarLinkGroup[];
  pathname: string;
  onLinkClick?: () => void;
}) {
  const activeHref = findActiveHref(groups, pathname);
  return (
    <nav className="flex flex-col gap-4">
      {groups.map((group, index) => (
        <div key={index} className="space-y-2">
          {group.label && (
            <div className="px-3 text-xs font-semibold uppercase text-muted-foreground pt-4">
              {group.label}
            </div>
          )}
          {group.links.map(({ href, label, icon: Icon, external }) => (
            <NavLink
              key={href}
              href={href}
              active={activeHref === href}
              variant="plain"
              className="h-auto min-h-9 w-full gap-2 rounded-md px-3 py-2 text-sm font-semibold"
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              onClick={onLinkClick}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{label}</span>
              {external && <ExternalLink className="h-3.5 w-3.5" aria-label="External link" />}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
}

// Extend RootLayout with the app's unchanged header, sidebar, and content geometry.
export default function HeaderSidebarLayout({ children, sidebarlinks, pofileBarInfo, headerLinks }: HeaderSidebarLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const groups = groupSidebarLinks(sidebarlinks);

  // Restore the previous body scroll setting when the mobile menu closes.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isMobileMenuOpen]);

  // Toggle navigation from the header's mobile control.
  function toggleMobileMenu() {
    setIsMobileMenuOpen(open => !open);
  }

  // Close navigation after choosing a destination.
  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <RootLayout>
      <header className="sticky top-0 z-40 flex h-16 items-center bg-primary-1000 shadow-[0_16px_40px_rgba(15,23,42,0.10)]">
        <div className="mx-auto flex w-full max-w-[1440px] items-center px-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-4 lg:hidden">
            <Button variant="plain" size="icon" onClick={toggleMobileMenu} aria-label="Toggle navigation" aria-expanded={isMobileMenuOpen}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
          <div className="hidden lg:flex">{headerLinks}</div>
          <div className="flex w-full items-center lg:hidden">
            <div className="mx-auto">{headerLinks}</div>
          </div>
          <div className="ml-auto">
            <Link href={pofileBarInfo.href} className="block">
              <Userbar displayName={pofileBarInfo.displayName ?? 'My Account'} displayImage={pofileBarInfo.displayImage} neupid={pofileBarInfo.neupid?.replace(/^@/, '') ?? ''} />
            </Link>
          </div>
        </div>
      </header>
      <div
        inert={!isMobileMenuOpen}
        className={cn(
          'fixed top-16 left-0 right-0 bottom-0 z-30 bg-primary-1000 backdrop-blur-sm transition-all duration-300 ease-in-out lg:hidden',
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        )}
      >
        <ScrollArea className="h-full">
          <div className="p-4 sm:p-6">
            <SidebarNavigation groups={groups} pathname={pathname} onLinkClick={closeMobileMenu} />
          </div>
        </ScrollArea>
      </div>
      <div className="mx-auto grid w-full max-w-[1440px] lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <SidebarProvider className="h-[calc(100vh-4rem)] min-h-0 w-full">
            <Sidebar collapsible="none" className="fixed top-16 z-20 h-[calc(100vh-4rem)] w-[260px] border-r bg-primary-1000" style={{ left: 'max(0px, calc((100vw - 1440px) / 2))' }}>
              <ScrollArea className="flex-1">
                <div className="p-6"><SidebarNavigation groups={groups} pathname={pathname} /></div>
              </ScrollArea>
            </Sidebar>
          </SidebarProvider>
        </div>
        <main className="min-h-[calc(100vh-4rem)] min-w-0 p-6 md:p-10">
          <div className="min-w-0 w-full">{children}</div>
        </main>
      </div>
    </RootLayout>
  );
}
