<div align="center">

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="apps/docs/public/brand/logo-dark.svg">
  <img src="apps/docs/public/brand/logo-light.svg" alt="Merid" width="220">
</picture>

<h3>React components that don’t fight your CSS.</h3>

<p>
  <a href="https://github.com/ahmetcantryk/merid/actions/workflows/ci.yml"><img src="https://github.com/ahmetcantryk/merid/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-b20965?style=flat-square" alt="MIT licence"></a>
  <img src="https://img.shields.io/badge/React-18%20%7C%2019-b20965?style=flat-square" alt="React 18 and 19">
  <img src="https://img.shields.io/badge/WCAG-2.2%20AA-b20965?style=flat-square" alt="WCAG 2.2 AA">
  <img src="https://img.shields.io/badge/TypeScript-strict-b20965?style=flat-square" alt="TypeScript">
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

Merid is an open source React component library. Its 60+ components are styled with one **plain CSS** file, and every rule sits in a cascade layer, so your own CSS overrides it without `!important`. The design rules, from the 1px borders to the corners that get smaller as surfaces nest, are written down in [DESIGN.md](DESIGN.md). The docs at [meridui.dev](https://meridui.dev) are complete in English and [Turkish](https://meridui.dev/tr).

The name comes from ***meridian***, a thin reference line.

<br>

## Decisions

**The stylesheet stays out of your way.** One file, three cascade layers (`merid.tokens`, `merid.base`, `merid.components`). Anything you write outside them wins, so a component is restyled with ordinary CSS. There is no runtime styling and no build plugin.

**Every value is a token.** Colours, spacing, radii, type and motion are `--mrd-*` custom properties with light and dark values. `@meridui/tokens` publishes the same values as CSS and typed JS.

**Themes are attributes.** Dark mode, the accent preset, density and text direction are `data-*` attributes and `dir`, so they apply to a whole app or to one panel. Portalled overlays keep the scope they were opened from.

**Server components work as they are.** Static parts render on the server and interactive modules carry `"use client"`, so any component can be imported straight into a React Server Component.

**Accessibility is checked on every change.** Interactive parts follow the WAI-ARIA keyboard patterns, focus is always visible and reduced motion is respected. An axe suite runs in CI on every pull request, in light and dark, in English and Turkish. Logical properties make right-to-left layouts work, and Windows contrast themes get system-colour borders and focus outlines.

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

One stylesheet import and no theme provider. Only toasts need a <code>ToastProvider</code>.

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

Every component has a page with live examples, props and accessibility notes at **[meridui.dev](https://meridui.dev)**, in English and [Turkish](https://meridui.dev/tr).

## Use it with AI

```bash
npx meridui init
```

Installs `@meridui/react`, imports the stylesheet, and can add an AI rules file (`AGENTS.md`, Cursor rules) and the Merid MCP server config for Claude Code, Cursor and VS Code. The docs also ship [`llms.txt`](https://meridui.dev/llms.txt). See [Using Merid with AI](https://meridui.dev/docs/ai).

<br>

## Theming

Themes are plain attributes, so they scope to any subtree.

```tsx
<div data-theme="dark" data-accent="petrol" data-density="compact" dir="rtl">
  {/* everything in here, including portaled overlays, follows */}
</div>
```

To go further, override tokens in your own CSS. It always wins over Merid's layers:

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
| [`@meridui/react`](packages/react) | React components, stylesheet and bundled Archivo and Chivo Mono fonts |
| [`@meridui/tokens`](packages/tokens) | Design tokens as CSS custom properties and typed JS |
| [`@meridui/cli`](packages/cli) | `npx meridui init`: install, stylesheet, AI rules, MCP config and page patterns |
| [`@meridui/mcp`](packages/mcp) | Read-only MCP server so AI agents can look up components, tokens and the design contract |

<br>

## Works with

**Next.js** (App Router & RSC) · **Vite** · **React Router** · **Tailwind** · **React Hook Form** · **Zod**. The [`examples/`](examples) folder has a Next.js app and a Vite dashboard.

**Browsers:** Chrome & Edge 111+ · Firefox 113+ · Safari 16.4+ &nbsp;·&nbsp; **React:** 18.2 and 19

<br>

## Development

```bash
npm install
npm run dev        # docs at http://localhost:3210
npm test           # unit + SSR
npm run test:e2e   # a11y, interactions, playground
```

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md) first. Report security issues privately, as described in [SECURITY.md](SECURITY.md).

<br>

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="apps/docs/public/brand/mark-dark.svg">
  <img src="apps/docs/public/brand/mark-light.svg" alt="" width="40">
</picture>

<sub>[MIT](LICENSE) © 2026 Ahmet Can Tiryaki · Archivo and Chivo Mono are bundled under the SIL OFL 1.1, see [NOTICE](NOTICE)</sub>

</div>
