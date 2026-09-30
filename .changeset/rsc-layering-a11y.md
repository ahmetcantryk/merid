---
"@meridui/react": minor
---

Layering, server components, router links and accessibility.

- Floating content (Popover, DropdownMenu, Select) now uses a new `--mrd-z-popover` (105) above `--mrd-z-overlay` (100), so it works inside Dialog and Drawer.
- Flat exports for every compound part (`DialogRoot`, `DialogContent`, `TabsList`, `StepperRoot`, `StepperStep`, …) for use in React Server Component files.
- `asChild` on `Button`, `Link` and `Breadcrumb.Link` to render router links; `Pagination` `renderLink`.
- `Select.Trigger` reads `Field` context (id, label, `aria-describedby`, invalid, required, disabled).
- Tabs (and every roving group) follow RTL for horizontal arrow keys.
- Portalled overlays inherit `data-theme` / `data-accent` / `data-density` / `dir` from where they were opened.
- Horizontal `Stepper` goes compact below 560px of its own width (container query).
- `box-sizing: border-box` on every Merid element; the base layer now applies to `:root` without `.mrd-root`; new `@meridui/react/components.css` entry without the base layer.
- `showClose` / `closeLabel` on Dialog, Drawer (default on) and AlertDialog (default off) content; `Placement` type export.
- `TableHeader` `sortDirection` / `onSort` for sortable columns.
- Contrast: darker `--mrd-muted` and `--mrd-placeholder`, new `--mrd-danger-solid` / `--mrd-danger-solid-hover` for danger buttons, alert body text at full strength.
