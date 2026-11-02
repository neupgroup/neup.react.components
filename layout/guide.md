# Layout usage guide

The layout components live in `@neup/components/layout/`, not `layouts/`.
Import them using `@neup/components/layout/<filename>`. This guide describes
the current local implementations.

## Choose a layout

| File | Import | Purpose and props |
| --- | --- | --- |
| `RootLayout.tsx` | Default `BaseLayout` | Base surface, progress bar, and toast viewport. Requires `children`; does not render `html` or `body`. |
| `header.v1.tsx` | Named `HeaderV1` | Sticky header surface. Put custom header content in `children`. Does not wrap page content. |
| `sidebar.v1.tsx` | Named `SidebarV1` | Sidebar and main content area. Requires `sidebar` and `children`. Also exports the alias `Sidebar`. |
| `header.addSidebar.v1.tsx` | Named `HeaderAddSidebarV1` | Combines `HeaderV1` and `SidebarV1`. Requires `header`, `sidebar`, and `children`. |
| `headersidebar.v1.tsx` | Named `HeaderSidebarV1` | Delegates to `HeaderAddSidebarV1` with the same props and behavior. |
| `header_limited.v1.tsx` | Default `HeaderLimitedV1` | Complete header with branding, navigation, and profile. No page-content slot. |
| `header-sidebar-layout.tsx` | Default `HeaderSidebarLayout` | Complete app shell with header, profile, desktop sidebar, mobile menu, and its own `RootLayout`. |

The V1 composition components accept React nodes for their slots. Supply rendered
elements such as `<Navigation />`, not component functions such as `Navigation`.
They do not expose general `className` props. `HeaderLimitedV1` does expose one.

## Use a layout in `layout.tsx`

The Next.js document layout owns `html`, `body`, and the global stylesheet.
The shared `RootLayout` is a UI wrapper, despite its name. Here is a minimal
document layout for an application using the V1 layouts:

```tsx
// app/layout.tsx
import type { ReactNode } from 'react';
import BaseLayout from '@neup/components/layout/RootLayout';
import './globals.css';

// Render the document and shared progress/toast UI once.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BaseLayout>{children}</BaseLayout>
      </body>
    </html>
  );
}
```

This is an illustrative setup, not a replacement for this repository's
`app/layout.tsx`, which also supplies branding and `LayoutServer`.

Use a route-group layout to share a shell across pages:

```tsx
// app/(workspace)/layout.tsx
import type { ReactNode } from 'react';
import Link from 'next/link';
import { HeaderSidebarV1 } from '@neup/components/layout/headersidebar.v1';

// Render the workspace's sidebar links.
function WorkspaceNavigation() {
  return (
    <nav aria-label="Workspace" className="space-y-3 py-6">
      <Link href="/home" className="block">Home</Link>
      <Link href="/settings" className="block">Settings</Link>
    </nav>
  );
}

// Share a header and sidebar across this route group's pages.
export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <HeaderSidebarV1
      header={<Link href="/home">Neup.Cloud</Link>}
      sidebar={<WorkspaceNavigation />}
    >
      {children}
    </HeaderSidebarV1>
  );
}
```

`children` is the page or nested layout that Next.js supplies. Group names such as
`(workspace)` do not become URL segments. This example assumes the parent does
not already render a header and sidebar. These example links are static; the V1
sidebar does not add active-link behavior for supplied content.

## Merge two layouts through composition

### Custom header + sidebar

`HeaderSidebarV1` and `HeaderAddSidebarV1` already implement this combination.
Use either one, not both nested together. Their composition is equivalent to:

```tsx
import type { ReactNode } from 'react';
import { HeaderV1 } from '@neup/components/layout/header.v1';
import { SidebarV1 } from '@neup/components/layout/sidebar.v1';

// Combine a header surface with a sidebar/content region.
export default function CombinedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
      <HeaderV1><a href="/home">Neup.Cloud</a></HeaderV1>
      <SidebarV1 sidebar={<nav aria-label="Workspace"><a href="/settings">Settings</a></nav>}>
        {children}
      </SidebarV1>
    </div>
  );
}
```

The header and sidebar region are siblings: putting the sidebar or page inside
`HeaderV1` would place them inside the header's fixed-height surface.

### Configured header + sidebar

`HeaderLimitedV1` already renders a header surface. Render it directly beside
`SidebarV1`; do not pass it into the `header` prop of `HeaderSidebarV1`, since
that prop is wrapped in another header.

```tsx
import type { ReactNode } from 'react';
import Link from 'next/link';
import HeaderLimitedV1 from '@neup/components/layout/header_limited.v1';
import { SidebarV1 } from '@neup/components/layout/sidebar.v1';

// Combine the configured header with custom sidebar content.
export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeaderLimitedV1
        appName="Neup.Cloud"
        appNameHref="/home"
        navLinks={[{ href: '/home', label: 'Home' }]}
        profileBarInfo={{ href: '/profile', username: 'demo', name: 'Demo User' }}
      />
      <SidebarV1 sidebar={<nav aria-label="Account"><Link href="/settings">Settings</Link></nav>}>
        {children}
      </SidebarV1>
    </>
  );
}
```

For a header-only page, replace `SidebarV1` with your own `<main>{children}</main>`.
For a sidebar-only page, use `SidebarV1` directly and set the header-height CSS
variable to `0px` on a wrapper if no header is present.

`HeaderLimitedV1` requires `appName`, `appNameHref`, `navLinks`, and
`profileBarInfo`. Optional props are `appLogo` (image URL or null) and `className`.
Each navigation item has `href` and `label`. Its profile uses `href`, `username`,
`name`, and optional `image`. Navigation highlights exact paths and descendants;
use pathname-only navigation URLs for its matching logic. On narrow screens,
navigation scrolls horizontally and profile text is hidden below `sm`.

## Use the complete responsive app shell

`HeaderSidebarLayout` provides its own navigation rendering, active selection,
profile UI, mobile menu, and base progress/toast UI. For icons, define navigation
inside a client module so component functions do not cross the server/client
boundary as props:

```tsx
// components/workspace-shell.tsx
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Home, Settings } from 'lucide-react';
import HeaderSidebarLayout, {
  type ProfileBarInfo,
  type SidebarLinkGroup,
} from '@neup/components/layout/header-sidebar-layout';

const sidebarGroups: SidebarLinkGroup[] = [
  {
    label: 'Workspace',
    links: [
      { href: '/home', label: 'Home', icon: Home },
      { href: '/settings', label: 'Settings', icon: Settings },
      { href: 'https://neupgroup.com', label: 'Website', external: true },
    ],
  },
];

// Render client-side navigation around server-provided page content.
export default function WorkspaceShell({ children, profile }: {
  children: ReactNode;
  profile: ProfileBarInfo;
}) {
  return (
    <HeaderSidebarLayout
      sidebarlinks={sidebarGroups}
      pofileBarInfo={profile}
      headerLinks={[<Link key="brand" href="/home">Neup.Cloud</Link>]}
    >
      {children}
    </HeaderSidebarLayout>
  );
}
```

```tsx
// app/(workspace)/layout.tsx
import type { ReactNode } from 'react';
import WorkspaceShell from '@/components/workspace-shell';

// Pass profile data to the interactive shell.
export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <WorkspaceShell profile={{ href: '/profile', displayName: 'Demo User', neupid: '@demo' }}>
      {children}
    </WorkspaceShell>
  );
}
```

Replace the example profile with data loaded on the server. Keep cookies,
credentials, and database access in the server module; pass only the needed
profile values into the client shell. Server-rendered page content can still be
passed through `children`.

Prop details:

- `sidebarlinks` is required and accepts a readonly array of individual links,
  groups, or a mixture. A group has an optional `label` and required `links`.
- A link requires `href` and `label` (a React node); `icon` is an optional
  component accepting `className`, and `external` enables a new tab with
  `noopener noreferrer`.
- `pofileBarInfo` is the exact current spelling, including the missing `r`.
  It requires `href`, `displayName: string | null`, and `neupid: string | null`;
  `displayImage` is optional and may be null. Do not use the limited header's
  differently shaped `profileBarInfo` here.
- `headerLinks` is a required readonly array of React nodes. Give array elements
  stable keys. The shell renders these in separate desktop and mobile containers,
  so avoid elements with duplicate fixed HTML IDs.
- `children` is required and renders inside the shell's existing `<main>`.

The shell uses a 64px sticky header, a 260px desktop sidebar, and a 1440px maximum
width. At `lg` and above the sidebar is visible; below `lg`, the header button
opens the mobile navigation. Choosing a navigation link closes the menu, and
opening the menu locks body scrolling. Active selection uses the most specific
matching internal path and ignores query strings and hashes for matching.

## Nested route layouts

Next.js nests layouts automatically. Let the outer layout own the app shell and
use inner layouts for section content, tabs, or toolbars:

```tsx
// app/(workspace)/settings/layout.tsx
import type { ReactNode } from 'react';
import Link from 'next/link';

// Add section navigation inside the existing app shell.
export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <section aria-label="Settings" className="space-y-6">
      <nav aria-label="Settings sections">
        <Link href="/settings">Overview</Link>
      </nav>
      {children}
    </section>
  );
}
```

Avoid nesting two shell components: that duplicates navigation, main landmarks,
padding, and sometimes providers. `SidebarV1` also supplies `id="main-content"`,
so rendering it twice creates duplicate IDs. Use a section or div inside its
content instead of adding another main element.

## Styling and responsive requirements

The current `tailwind.config.ts` already scans
`./@neup/components/**/*.{js,ts,jsx,tsx,mdx}`. Preserve that entry when reusing
these layouts. Load the application theme and Tailwind stylesheet from the
document layout.

`SidebarV1` depends on CSS variables that are not currently declared in this
repository's `app/globals.css`. When adopting the V1 sidebar, define these in
the global theme (the layer values below are suggested values):

```css
:root {
  --site-header-height: 4rem;
  --layer-content: 0;
  --layer-sidebar: 20;
}
```

The `4rem` height matches the shared header's `h-16`. Without these variables,
the sidebar's calculated height, sticky offset, and stacking declarations may
not work as intended. The theme must also provide the background, foreground,
border, primary, and other color tokens referenced by the shared components.

`SidebarV1` uses a 248px sidebar, a 1440px maximum container, and hides the sidebar
below `md`. It does **not** provide mobile navigation. Supply an accessible mobile
navigation component in your custom header, or choose `HeaderSidebarLayout`
when you need its built-in mobile menu. The V1 compositions do not mount the
base progress/toast UI; use one `BaseLayout` ancestor when that UI is needed.

## How this repository currently composes layouts

The current rendering chain is:

```text
app/layout.tsx (html/body + BaseLayout)
  app/layout.server.tsx (profile and server selection data)
    app/layout.client.tsx (interactive route-dependent shell)
      HeaderSidebarLayout (includes another BaseLayout internally)
        route layout and page
```

`app/(main)/layout.tsx` and `app/(plain)/layout.tsx` currently pass through their
children. The client layout explicitly skips `HeaderSidebarLayout` for
`/pipeline/editor` and its descendants; the `(plain)` group name alone does not
disable the outer shell.

The current root and full shell both mount `BaseLayout`, so the existing setup
duplicates its progress/toast UI on shell routes. The client layout also renders
an app-specific progress component. For a new composition, give the base UI one
owner: either use `BaseLayout` around V1 components, or let the complete shell
provide it. If some routes bypass that shell, provide their base UI separately.
Do not copy the minimal examples over the existing root without preserving its
branding, data loading, and route-specific behavior.
