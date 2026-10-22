# `@neup/components` theme setup

The UI components use Tailwind utility classes and semantic color names. A consuming app must make those utilities available by defining the theme variables and mapping them into Tailwind’s theme. The components do not provide a default palette.

This repository uses Tailwind CSS v4. Its `app/globals.css` already scans the shared source folders with `@source "../@neup/components"` and `@source "../@neup/core"`. Keep these directives in the stylesheet imported by the app so utilities used only inside shared components are generated.

## Required semantic colors

Define these CSS custom properties in HSL channel form (three space-separated values, without `hsl()`):

| Variable | Used for |
| --- | --- |
| `--primary` | Main action and brand color |
| `--primary-foreground` | Text/icons on the primary color |
| `--primary-hover` | Hover state of solid primary actions |
| `--primary-active` | Pressed state of solid primary actions |
| `--foreground` | Default text and icons |
| `--background` | Main surface and focus-ring offset |
| `--muted` | Quiet surfaces |
| `--muted-foreground` | Secondary text |
| `--border` | Default borders and separators |
| `--input` | Input borders and unchecked controls |
| `--ring` | Keyboard focus ring |
| `--destructive` | Error and destructive action color |
| `--destructive-foreground` | Text/icons on destructive surfaces |
| `--secondary` | Secondary surface |
| `--secondary-foreground` | Text/icons on secondary surfaces |
| `--accent` | Highlighted or selected surface |
| `--accent-foreground` | Text/icons on accent surfaces |
| `--popover` | Menu, popover, and floating surface |
| `--popover-foreground` | Text/icons on floating surfaces |
| `--card` | Card surface |
| `--card-foreground` | Text/icons on cards |
| `--sidebar` | Sidebar surface |
| `--sidebar-foreground` | Sidebar text/icons |

The app can choose the actual palette. Keep foreground values readable against their matching surface values. Supply hover and active colors for the primary action explicitly; the solid button variant uses them.

## Define variables and Tailwind color names

Place the variables in the global stylesheet, then map them in `@theme inline`. HSL channels allow Tailwind opacity modifiers such as `bg-primary/10` and `border-primary/20` to work.

```css
@import "tailwindcss";

@source "../@neup/components";
@source "../@neup/core";

:root {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  --popover: 0 0% 100%;
  --popover-foreground: 222 47% 11%;
  --primary: 160 45% 22%;
  --primary-foreground: 0 0% 100%;
  --primary-hover: 160 45% 18%;
  --primary-active: 160 45% 15%;
  --secondary: 210 25% 96%;
  --secondary-foreground: 222 35% 18%;
  --muted: 210 25% 96%;
  --muted-foreground: 215 16% 45%;
  --accent: 210 25% 94%;
  --accent-foreground: 222 35% 18%;
  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 100%;
  --border: 214 20% 88%;
  --input: 214 20% 88%;
  --ring: 160 45% 22%;
  --sidebar: 210 25% 98%;
  --sidebar-foreground: 222 35% 18%;
}

@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-primary-hover: hsl(var(--primary-hover));
  --color-primary-active: hsl(var(--primary-active));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-sidebar: hsl(var(--sidebar));
  --color-sidebar-foreground: hsl(var(--sidebar-foreground));
}
```

For dark mode, override the same variables under the app’s dark-mode selector (for example, `.dark { --background: ...; }`). The Tailwind color mappings stay in place and automatically use the overridden values.

## Additional variables and styles

- `@neup/components/layout/RootLayout` uses `--primary` directly as HSL channels for the page progress indicator. Keep `--primary` in the format shown above.
- The sidebar component sets `--sidebar-width` and `--sidebar-width-icon` itself. Apps do not need to define those sizing values.
- The chart component creates `--color-{series}` values from its chart config. Pass each series a `color` or light/dark theme colors.
- Components that accept `className` can be styled with app-specific classes. Colors in a site's own CSS (for example, the portfolio palette) are separate from the semantic variables required by the shared UI.
- A component may also use fixed utility colors or a third-party primitive. Those do not require extra theme variables.

## Tailwind versions

The example uses Tailwind v4 CSS-first configuration (`@import "tailwindcss"`, `@source`, and `@theme inline`). In Tailwind v3, include the shared component and core paths in `tailwind.config`’s `content` array, define equivalent theme colors in `theme.extend.colors`, and keep the same CSS custom properties. Do not use the v4 directives in a v3 project.
