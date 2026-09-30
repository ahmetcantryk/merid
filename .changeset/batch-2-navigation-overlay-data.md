---
"@meridui/react": minor
---

New navigation, overlay and data components.

- `Command` (with `Command.Dialog` for a ⌘K palette): searchable, grouped commands with arrow-key navigation, item shortcuts and a live result count.
- `ContextMenu`: right-click menu that shares DropdownMenu's items, keyboard model and styles. `DropdownMenu` now exports its menu internals for this; its public API is unchanged.
- `HoverCard`, `Collapsible`, `ScrollArea` (native scrolling, keyboard-reachable when needed), `NavigationMenu` (disclosure navigation with mega-menu panels) and `Toolbar` (roving tabindex).
- `DataTable` + `useDataTable`: sorting, global and column filters, pagination, checkbox row selection and column visibility on top of `Table`, with no new dependencies. The pure helpers (`sortRows`, `filterRows`, `paginate`, …) are exported too.
- `Shortcut` plus `formatShortcut` / `matchesShortcut`: platform-aware key combinations (`mod` is ⌘ on macOS, Ctrl elsewhere) built from `Kbd`.

Every screen-reader string is a prop with an English default, and every compound part has a flat export for server components.
