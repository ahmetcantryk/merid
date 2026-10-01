<div align="center">

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="apps/docs/public/brand/logo-dark.svg">
  <img src="apps/docs/public/brand/logo-light.svg" alt="Merid" width="220">
</picture>

<h3>React components that don’t fight your CSS.</h3>

<p>
  <a href="https://github.com/ahmetcantryk/merid/actions/workflows/ci.yml"><img src="https://github.com/ahmetcantryk/merid/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-476cff?style=flat-square" alt="MIT licence"></a>
  <img src="https://img.shields.io/badge/React-18%20%7C%2019-476cff?style=flat-square" alt="React 18 and 19">
  <img src="https://img.shields.io/badge/WCAG-2.2%20AA-476cff?style=flat-square" alt="WCAG 2.2 AA">
  <img src="https://img.shields.io/badge/TypeScript-strict-476cff?style=flat-square" alt="TypeScript">
</p>

<p>
  <a href="#install"><b>Install</b></a> &nbsp;·&nbsp;
  <a href="#gallery"><b>Gallery</b></a> &nbsp;·&nbsp;
  <a href="#components"><b>Components</b></a> &nbsp;·&nbsp;
  <a href="#theming"><b>Theming</b></a> &nbsp;·&nbsp;
  <a href="https://meridui.dev"><b>Docs</b></a>
</p>

<br>

</div>

Merid is an open source React component library. Its 60+ components are styled by one **plain CSS** file, and every rule in it sits in a cascade layer, so the CSS you write overrides Merid without `!important`. The design rules behind it, down to the 1px borders and the corners that get smaller as surfaces nest, are written up in [DESIGN.md](DESIGN.md). The docs at [meridui.dev](https://meridui.dev) are complete in English and [Turkish](https://meridui.dev/tr).

The name comes from ***meridian***, a thin reference line.

<br>

## Decisions

**Your stylesheet wins.** Merid ships one stylesheet split into three cascade layers (`merid.tokens`, `merid.base`, `merid.components`). Anything you write outside those layers takes precedence, so restyling a component is ordinary CSS. Nothing is generated at runtime and there is no build plugin to configure.

**The look stays in the background.** Type is set in Geist, with Geist Mono for code. One cool blue marks what can be clicked and what is selected; apart from the status colours, the rest of the interface is grey. Regions are separated by grey trays before a border is reached for, and borders are always 1px. The aim is an interface that leaves the attention to your content.

**Every value is a token.** Colour, spacing, radius, type and motion are `--mrd-*` custom properties with light and dark values. `@meridui/tokens` publishes the same values as CSS and as typed JS, for code that needs them outside a stylesheet.

**Themes are attributes.** Dark mode, the accent preset, density and text direction are set with `data-*` attributes and `dir`, on the whole app or on a single panel. Overlays rendered in a portal keep the theme of the place they were opened from.

**Server components need no wrapper.** Static parts render on the server and interactive modules carry `"use client"`, so a React Server Component can import any of them directly.

**Accessibility is tested on every change.** Interactive parts follow the WAI-ARIA keyboard patterns, focus is always visible and reduced motion is respected. An axe suite runs in CI on every pull request against light and dark themes, in English and Turkish. Layouts use logical properties so right-to-left works, and in Windows contrast themes controls switch to system colours for their borders.

<br>

## Install

```bash
npm i @meridui/react
```

```tsx
import "@meridui/react/styles.css";
import { AlertDialog, Button } from "@meridui/react";

export function DeleteProject({ onDelete }: { onDelete: () => void }) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="danger">Delete project</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>Delete this project?</AlertDialog.Title>
        <AlertDialog.Description>This removes all of its files. It cannot be undone.</AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action tone="danger" onClick={onDelete}>
            Delete
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
```

Import the stylesheet once. There is no theme provider; only toasts need a <code>ToastProvider</code>.

<br>

## Gallery

<sub>Real renders from the visual regression suite. They follow your GitHub theme.</sub>

<table>
  <tr>
    <td align="center" width="50%">
      <picture><source media="(prefers-color-scheme: dark)" srcset=".github/assets/button-dark.png"><img src=".github/assets/button-light.png" alt="Button variants"></picture>
      <br><sub><b>Button</b></sub>
    </td>
    <td align="center" width="50%">
      <picture><source media="(prefers-color-scheme: dark)" srcset=".github/assets/field-dark.png"><img src=".github/assets/field-light.png" alt="Field with label and hint"></picture>
      <br><sub><b>Field</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <picture><source media="(prefers-color-scheme: dark)" srcset=".github/assets/select-dark.png"><img src=".github/assets/select-light.png" alt="Select"></picture>
      <br><sub><b>Select</b></sub>
    </td>
    <td align="center">
      <picture><source media="(prefers-color-scheme: dark)" srcset=".github/assets/tabs-dark.png"><img src=".github/assets/tabs-light.png" alt="Tabs"></picture>
      <br><sub><b>Tabs</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <picture><source media="(prefers-color-scheme: dark)" srcset=".github/assets/segmented-control-dark.png"><img src=".github/assets/segmented-control-light.png" alt="Segmented control"></picture>
      <br><sub><b>Segmented control</b></sub>
    </td>
    <td align="center">
      <picture><source media="(prefers-color-scheme: dark)" srcset=".github/assets/switch-dark.png"><img src=".github/assets/switch-light.png" alt="Switch"></picture>
      <br><sub><b>Switch</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <picture><source media="(prefers-color-scheme: dark)" srcset=".github/assets/alert-dark.png"><img src=".github/assets/alert-light.png" alt="Alert"></picture>
      <br><sub><b>Alert</b></sub>
    </td>
    <td align="center">
      <picture><source media="(prefers-color-scheme: dark)" srcset=".github/assets/stepper-dark.png"><img src=".github/assets/stepper-light.png" alt="Stepper"></picture>
      <br><sub><b>Stepper</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <picture><source media="(prefers-color-scheme: dark)" srcset=".github/assets/table-dark.png"><img src=".github/assets/table-light.png" alt="Sortable table"></picture>
      <br><sub><b>Table</b></sub>
    </td>
    <td align="center">
      <picture><source media="(prefers-color-scheme: dark)" srcset=".github/assets/dialog-open-dark.png"><img src=".github/assets/dialog-open-light.png" alt="Open dialog"></picture>
      <br><sub><b>Dialog</b></sub>
    </td>
  </tr>
</table>

<br>

## Components

| Category | Components |
| :-- | :-- |
| **Actions** | Button · IconButton · Link · Toggle · ToggleGroup · Toolbar · DropdownMenu · ContextMenu · Command · SegmentedControl |
| **Forms** | Field · Label · Input · Textarea · NumberInput · PinInput · Select · NativeSelect · Combobox · DatePicker · Calendar · Slider · Checkbox · Radio · Switch · FileUpload |
| **Overlays** | Dialog · AlertDialog · Drawer · Popover · HoverCard · Tooltip · Toast · Portal |
| **Navigation** | Tabs · NavigationMenu · Breadcrumb · Pagination · Stepper · SidebarNav |
| **Feedback** | Alert · Progress · Spinner · Skeleton · EmptyState · Badge |
| **Data display** | Table · DataTable · Card · Avatar · Accordion · Collapsible · Code · Kbd · Shortcut |
| **Layout** | Container · Section · Stack · Grid · ScrollArea · Separator |
| **Typography** | Heading · Text · VisuallyHidden |

Each component has a page at **[meridui.dev](https://meridui.dev)** with live examples, props and accessibility notes, plus a keyboard map for the interactive ones. Every page is also in [Turkish](https://meridui.dev/tr).

## Use it with AI

```bash
npx meridui init
```

This installs `@meridui/react`, imports the stylesheet and removes the CSS your project template ships that would override Merid, such as the Vite starter's `:root` font or Next.js's Arial `body`; with Tailwind it also puts Merid's layers after Preflight. If you want, it also adds an AI rules file (`AGENTS.md` or Cursor rules) and the config for the Merid MCP server in Claude Code, Cursor or VS Code. The docs publish [`llms.txt`](https://meridui.dev/llms.txt) as well. More in [Using Merid with AI](https://meridui.dev/docs/ai).

<br>

## Theming

Themes are plain attributes, so they can be scoped to any part of the page.

```tsx
<div data-theme="dark" data-accent="violet" data-density="compact" dir="rtl">
  {/* everything in here, including portalled overlays, follows */}
</div>
```

To change a value everywhere, override its token in your own CSS. Rules outside Merid's layers always win:

```css
:root {
  --mrd-radius-md: 8px;
  --mrd-radius-card: 12px;
}
```

<br>

## Packages

| Package | Description |
| :-- | :-- |
| [`@meridui/react`](packages/react) | React components, stylesheet and bundled Geist fonts |
| [`@meridui/tokens`](packages/tokens) | Design tokens as CSS custom properties and typed JS |
| [`@meridui/cli`](packages/cli) | `npx meridui init`: installs the package and stylesheet, and can add AI rules, MCP config and page patterns |
| [`@meridui/mcp`](packages/mcp) | Read-only MCP server that lets AI agents look up components, tokens and the design contract |
| [`meridui`](packages/meridui) | Short name for the CLI, so `npx meridui init` works |

<br>

## Works with

**Next.js** (App Router and RSC) · **Vite** · **React Router** · **Tailwind** · **React Hook Form** · **Zod**. The [`examples/`](examples) folder has a Next.js app and a Vite dashboard.

**Browsers:** Chrome and Edge 111+ · Firefox 113+ · Safari 16.4+ &nbsp;·&nbsp; **React:** 18.2 and 19

<br>

## Development

```bash
npm install
npm run dev        # docs at http://localhost:3210
npm test           # unit + SSR
npm run test:e2e   # a11y, interactions, playground
```

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md) first, and report security issues through [SECURITY.md](SECURITY.md) instead of a public issue.

<br>

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="apps/docs/public/brand/mark-dark.svg">
  <img src="apps/docs/public/brand/mark-light.svg" alt="" width="40">
</picture>

<sub>[MIT](LICENSE) © 2026 Ahmet Can Tiryaki · Geist and Geist Mono © Vercel, bundled under the SIL OFL 1.1 (see [NOTICE](NOTICE))</sub>

</div>
