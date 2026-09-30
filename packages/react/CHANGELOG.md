# @meridui/react

## 0.2.0

### Minor Changes

- e21a258: New navigation, overlay and data components.
  
  - `Command` (with `Command.Dialog` for a ⌘K palette): searchable, grouped commands with arrow-key navigation, item shortcuts and a live result count.
  - `ContextMenu`: right-click menu that shares DropdownMenu's items, keyboard model and styles. `DropdownMenu` now exports its menu internals for this; its public API is unchanged.
  - `HoverCard`, `Collapsible`, `ScrollArea` (native scrolling, keyboard-reachable when needed), `NavigationMenu` (disclosure navigation with mega-menu panels) and `Toolbar` (roving tabindex).
  - `DataTable` + `useDataTable`: sorting, global and column filters, pagination, checkbox row selection and column visibility on top of `Table`, with no new dependencies. The pure helpers (`sortRows`, `filterRows`, `paginate`, …) are exported too.
  - `Shortcut` plus `formatShortcut` / `matchesShortcut`: platform-aware key combinations (`mod` is ⌘ on macOS, Ctrl elsewhere) built from `Kbd`.
  
  Every screen-reader string is a prop with an English default, and every compound part has a flat export for server components.
- 7987cbd: Form and input components, and translatable screen reader text.
  
  - New components: `Combobox` (searchable, single or multiple, async options), `Calendar` (keyboard grid, min/max, disabled days, `Intl` locales with the locale's week start), `DatePicker` (typed field + calendar popover, single day or range), `Slider` (single or range, steps, keyboard, RTL), `NumberInput` (steppers, min/max/step, `Intl.NumberFormat` formatting and parsing), `Toggle`, `ToggleGroup` / `ToggleGroupItem`, `PinInput` (one-time codes, paste and autofill) and `FileUpload` (accessible dropzone with validation).
  - Every screen reader string in the new components can be replaced through props (e.g. `previousMonthLabel`, `incrementLabel`, `getCellLabel`, `getRemoveLabel`, `getStatusText`).
  - `ToastProvider` `dismissLabel`, `Link` `externalLabel` and `AvatarGroup` `formatOverflowLabel` replace hard-coded English text. Defaults are unchanged.
- a6a31d2: Layering, server components, router links and accessibility.
  
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

### Patch Changes

- 0a289da: Breadcrumb renders in server components again: the internal ref helper no longer carries a `"use client"` boundary.
