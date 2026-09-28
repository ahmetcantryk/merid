# Northwind Cloud console (Vite + Merid)

A single-page SaaS dashboard for the fictional **Northwind Cloud**, built with `@merid/react`, React 19 and Vite. No router or state library: a ~30-line hash router and a React context stand in for them.

## Run

From the repository root (npm workspaces link `@merid/react` automatically):

```bash
npm install
npm run build -w @merid/react        # the example consumes the built package
npm run dev -w merid-example-vite-dashboard   # http://localhost:3220
```

Other scripts: `npm run typecheck -w merid-example-vite-dashboard`, `npm run build -w merid-example-vite-dashboard`.

## What this example demonstrates

- **App shell**: `SidebarNav` with active state, a sticky header with global search (`/` focuses it, Enter jumps to filtered Projects), a `Drawer` holding the same nav below 860px, a skip link and focus moved to `<main>` on navigation.
- **Account menu**: `Avatar` as a `DropdownMenu.Trigger`, with `Label`, `Group`, `Separator` and items that route or raise a `Toast`.
- **Theme toggle**: sets `<html data-theme>` and persists it; defaults to `prefers-color-scheme`.
- **Overview**: stat tiles (`Card`, `Badge`, numeric `Text`), `Progress` usage meters, an `EmptyState` for incidents, and a `Table` with sortable headers (`aria-sort` + real buttons), `Checkbox` row selection with an indeterminate select-all, a bulk-archive bar and `Pagination`.
- **Projects**: `SegmentedControl` status filter, `Select` region filter, search `Input`, responsive `Grid` of cards, `EmptyState` with a reset action, and a **create-project `Dialog`** validated with react-hook-form (`register` for `Input`/`Textarea`, `Controller` for `Select`) that surfaces errors through `Field`.
- **Settings**: `Tabs` (General / Members / Billing, deep-linkable with `#/settings?tab=billing`), `Switch` preferences, a destructive `AlertDialog`, a `RadioGroup` plan picker, an `Alert`, and `Toast` feedback throughout.
- Light and dark themes, usable at 390px, fully keyboard operable.

## Structure

```
src/
  app/        App, shell, header, account menu, nav
  pages/      one file per route (+ settings/ tabs)
  features/   overview table and tiles, project card and dialog
  lib/        router, theme, mock data, projects store
  app.css     layout only, built from Merid tokens
```

Note: no app-level reset is needed; Merid's base layer sets `box-sizing` and the document font and colours at zero specificity.
