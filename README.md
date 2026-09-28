<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="apps/docs/public/brand/logo-dark.svg">
    <img src="apps/docs/public/brand/logo-light.svg" alt="Merid" width="148" height="32">
  </picture>
</p>

<p align="center">Quiet, precise components for React.</p>

<p align="center">
  <!-- Badges: enable once the package is published and CI has run on main. -->
  <!-- <a href="https://www.npmjs.com/package/@merid/react"><img src="https://img.shields.io/npm/v/@merid/react" alt="npm version"></a> -->
  <!-- <a href="https://github.com/merid-ui/merid/actions/workflows/ci.yml"><img src="https://github.com/merid-ui/merid/actions/workflows/ci.yml/badge.svg" alt="CI"></a> -->
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-476cff" alt="MIT licence"></a>
</p>

---

Merid is an accessible React component library written in plain CSS and a small set of design tokens. Hairline borders, one cool accent, soft grey trays and calm motion — so your product reads as considered, not decorated.

The name comes from *meridian*: a thin, precise reference line.

## Install

```bash
npm i @merid/react
```

## Quick example

```tsx
import "@merid/react/styles.css";
import { AlertDialog, Button } from "@merid/react";

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

> The exact component APIs are documented per component on the docs site.

## Features

- **Accessible by default** — WCAG 2.2 AA target, WAI-ARIA patterns, full keyboard support, visible focus, reduced-motion support.
- **Plain CSS** — one stylesheet in three cascade layers. Your CSS wins without `!important`. No runtime styling, no build plugin.
- **Design tokens** — every value is a `--mrd-*` custom property with light and dark values.
- **Dark mode** — follows the system or a `data-theme` attribute, on any subtree.
- **Server-component friendly** — static components render on the server; interactive modules carry `"use client"`, so every component can be imported straight into a server component.
- **Small surface** — a focused set of components held to one design contract.

## Browser support

Chrome and Edge 111+, Firefox 113+, Safari 16.4+. React 18.2 and 19.

## Documentation

Read the documentation at **[merid.dev](https://merid.dev)**, or run it locally:

```bash
npm install
npm run dev   # http://localhost:3210
```

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md) first. Security issues go through [SECURITY.md](SECURITY.md), not public issues.

## License

[MIT](LICENSE) © 2026 Ahmet Can Tiryaki. Inter Variable is bundled under the SIL Open Font License 1.1 — see [NOTICE](NOTICE).
