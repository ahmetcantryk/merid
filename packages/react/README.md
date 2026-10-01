<p align="center">
  <a href="https://meridui.dev"><img src="https://raw.githubusercontent.com/ahmetcantryk/merid/main/apps/docs/public/brand/logo-light.svg" alt="Merid" width="200"></a>
</p>

<p align="center"><b>React components that don’t fight your CSS.</b></p>

<p align="center">
  <a href="https://www.npmjs.com/package/@meridui/react"><img src="https://img.shields.io/npm/v/@meridui/react?style=flat-square&color=476cff&label=npm" alt="npm version"></a>
  <a href="https://github.com/ahmetcantryk/merid/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-476cff?style=flat-square" alt="MIT licence"></a>
  <img src="https://img.shields.io/badge/React-18%20%7C%2019-476cff?style=flat-square" alt="React 18 and 19">
  <img src="https://img.shields.io/badge/WCAG-2.2%20AA-476cff?style=flat-square" alt="WCAG 2.2 AA">
  <img src="https://img.shields.io/badge/TypeScript-strict-476cff?style=flat-square" alt="TypeScript">
</p>

<p align="center">
  <a href="https://meridui.dev"><b>Docs</b></a> &nbsp;·&nbsp;
  <a href="https://meridui.dev/docs/components"><b>Components</b></a> &nbsp;·&nbsp;
  <a href="https://meridui.dev/tr"><b>Türkçe</b></a> &nbsp;·&nbsp;
  <a href="https://github.com/ahmetcantryk/merid"><b>GitHub</b></a>
</p>

Merid is an open source React component library. Its 60+ components are styled by one plain CSS file, and every rule in that file sits in a cascade layer, so the CSS you write overrides Merid without `!important` or specificity tricks. There is no runtime styling, no build plugin and no theme provider. The docs at [meridui.dev](https://meridui.dev) are complete in English and [Turkish](https://meridui.dev/tr).

## Install

```bash
npm i @meridui/react
```

In a Next.js, Vite or React Router project you can let the CLI do the setup instead:

```bash
npx meridui init
```

It installs the package, imports the stylesheet and removes the global styles your project template ships that would override Merid, such as the Vite starter's `:root` font or Next.js's Arial `body`. Every change is shown as a diff before it is written. Merid needs React 18.2 or 19.

## Usage

Import the stylesheet once, at the app entry, and use the components:

```tsx
import "@meridui/react/styles.css";
import { Button, Card, Field, Heading, Input, Stack, Switch } from "@meridui/react";

export function Profile() {
  return (
    <Card>
      <Stack gap={4}>
        <Heading level={2} size="h3">Profile</Heading>
        <Field label="Display name" description="Shown on your public page.">
          <Input defaultValue="Ada Lovelace" />
        </Field>
        <Switch defaultChecked>Email me about new comments</Switch>
        <Button variant="primary">Save</Button>
      </Stack>
    </Card>
  );
}
```

`Field` wires the label, description and error to the control it wraps, including `aria-describedby` and `aria-invalid`. Compound components use dot parts (`Dialog.Root`, `Tabs.Panel`, `Select.Item`). Only toasts need a provider, `ToastProvider`.

<table>
  <tr>
    <td align="center" width="50%"><img src="https://raw.githubusercontent.com/ahmetcantryk/merid/main/.github/assets/button-light.png" alt="Button variants"><br><sub>Button</sub></td>
    <td align="center" width="50%"><img src="https://raw.githubusercontent.com/ahmetcantryk/merid/main/.github/assets/field-light.png" alt="Field with label and description"><br><sub>Field</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="https://raw.githubusercontent.com/ahmetcantryk/merid/main/.github/assets/select-light.png" alt="Open Select"><br><sub>Select</sub></td>
    <td align="center"><img src="https://raw.githubusercontent.com/ahmetcantryk/merid/main/.github/assets/dialog-open-light.png" alt="Open Dialog"><br><sub>Dialog</sub></td>
  </tr>
</table>

<sub>Renders from the visual regression suite. More in the <a href="https://github.com/ahmetcantryk/merid#gallery">gallery</a>, in light and dark.</sub>

## Components

| Category | Components |
| :-- | :-- |
| Actions | Button, IconButton, Link, Toggle, ToggleGroup, Toolbar, DropdownMenu, ContextMenu, Command, SegmentedControl |
| Forms | Field, Label, Input, Textarea, NumberInput, PinInput, Select, NativeSelect, Combobox, DatePicker, Calendar, Slider, Checkbox, Radio, Switch, FileUpload |
| Overlays | Dialog, AlertDialog, Drawer, Popover, HoverCard, Tooltip, Toast, Portal |
| Navigation | Tabs, NavigationMenu, Breadcrumb, Pagination, Stepper, SidebarNav |
| Feedback | Alert, Progress, Spinner, Skeleton, EmptyState, Badge |
| Data display | Table, DataTable, Card, Avatar, Accordion, Collapsible, Code, Kbd, Shortcut |
| Layout | Container, Section, Stack, Grid, ScrollArea, Separator |
| Typography | Heading, Text, VisuallyHidden |

Each one has a page with live examples, the props table, keyboard behaviour and accessibility notes: [meridui.dev/docs/components](https://meridui.dev/docs/components). The package ships ES modules and CommonJS with types, and its only runtime dependency is Floating UI, which positions menus, popovers and selects.

## Styling and theming

Merid's stylesheet has three layers: `merid.tokens`, `merid.base` and `merid.components`. CSS outside them always wins, so restyling a component is ordinary CSS. Every value is a `--mrd-*` custom property with a light and a dark value; override one and it changes everywhere:

```css
:root {
  --mrd-radius-md: 8px;
  --mrd-radius-card: 12px;
}
```

Dark mode follows the system by default. Theme, accent colour, density and text direction are attributes, so they work on the whole page or on one panel, and overlays opened from that panel keep its theme:

```tsx
<div data-theme="dark" data-accent="violet" data-density="compact" dir="rtl">
  {/* everything in here follows, including portalled overlays */}
</div>
```

Type is set in Geist and Geist Mono, which are bundled in the package. Point `--mrd-font-sans` at your own font and the bundled files are never downloaded. The tokens are also published as JSON and typed JS in [`@meridui/tokens`](https://www.npmjs.com/package/@meridui/tokens). With Tailwind v4, declare `@layer theme, base, merid, components, utilities;` so Preflight stays below Merid; the [Tailwind guide](https://meridui.dev/docs/integrations/tailwind) has the details.

## Server components

Interactive components carry their own `"use client"` directive and static ones render on the server, so a React Server Component can import from `@meridui/react` directly. In server component files, use the flat part names (`DialogRoot`, `DialogContent`, `TabsList`) and `asChild` for router links:

```tsx
import Link from "next/link";
import { Button } from "@meridui/react";

<Button asChild variant="primary">
  <Link href="/projects/new">New project</Link>
</Button>
```

No `transpilePackages` entry is needed in Next.js. See [Server components](https://meridui.dev/docs/server-components).

## Accessibility

Interactive components follow the WAI-ARIA keyboard patterns, focus is always visible, and overlays trap and return focus. An axe suite runs in CI on every pull request, in light and dark themes and in English and Turkish. Layouts use logical properties, so right-to-left works without extra CSS, reduced motion is respected, and in Windows contrast themes controls switch to system colours. Text that only screen readers hear, such as close labels and live announcements, comes from props with English defaults, so you can translate it. Details per component are on each docs page and in the [accessibility overview](https://meridui.dev/docs/accessibility).

## AI coding tools

`npx meridui init` can also add an `AGENTS.md` section, a Cursor rule and the config for [`@meridui/mcp`](https://www.npmjs.com/package/@meridui/mcp), a read-only MCP server that gives Claude Code, Cursor or VS Code the real props and tokens. The docs publish [llms.txt](https://meridui.dev/llms.txt). More in [Using Merid with AI](https://meridui.dev/docs/ai).

## Browser support

Chrome and Edge 111+, Firefox 113+, Safari 16.4+. React 18.2 and 19.

## Links

- Documentation: [meridui.dev](https://meridui.dev), in Turkish at [meridui.dev/tr](https://meridui.dev/tr)
- Changelog: [meridui.dev/docs/changelog](https://meridui.dev/docs/changelog)
- Source and issues: [github.com/ahmetcantryk/merid](https://github.com/ahmetcantryk/merid)
- Related packages: [`@meridui/tokens`](https://www.npmjs.com/package/@meridui/tokens), [`@meridui/cli`](https://www.npmjs.com/package/@meridui/cli), [`@meridui/mcp`](https://www.npmjs.com/package/@meridui/mcp)

## License

MIT © 2026 Ahmet Can Tiryaki. Geist and Geist Mono are © Vercel and bundled under the SIL Open Font License 1.1; the licence text ships next to the font files.
