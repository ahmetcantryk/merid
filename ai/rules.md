# Merid UI rules

This project uses Merid (`@meridui/react`) for its UI. Follow these rules when you write or change interface code. Docs: https://meridui.dev/docs · full text for LLMs: https://meridui.dev/llms-full.txt

## Imports

- Import components from the package root only: `import { Button, Dialog, Field, Input } from "@meridui/react";`. Never deep-import from `@meridui/react/dist/...` or copy component source into the project.
- Import the stylesheet once, at the app entry (root layout, `main.tsx`): `import "@meridui/react/styles.css";`. Do not import it per component.
- Compound components use dot parts (`Dialog.Root`, `Dialog.Content`, `Select.Item`). In React Server Component files use the flat exports (`DialogRoot`, `DialogContent`, …).
- For router links use `asChild`: `<Button asChild><Link href="/x">…</Link></Button>`.

## Compose before you create

1. Check whether a Merid component already does the job (Button, IconButton, Link, Field, Input, Textarea, Select, NativeSelect, Checkbox, Radio, Switch, SegmentedControl, Card, Stack, Grid, Container, Section, Heading, Text, Table, Badge, Avatar, Tabs, Accordion, Alert, `ToastProvider` + `useToast`, Progress, Spinner, Skeleton, EmptyState, Dialog, AlertDialog, Drawer, Popover, Tooltip, DropdownMenu, Breadcrumb, Pagination, Stepper, SidebarNav, Separator, Kbd, Code, VisuallyHidden).
2. If not, compose existing components (for example a settings row is `Section` + `Field` + `Switch`; a toolbar is `Stack direction="row"` + `Button`/`IconButton`).
3. Only then write a new component, and style it with Merid tokens as below. Do not wrap Merid components just to rename them or restyle them with overrides.
4. Look up props before using them (docs page or the `get_component` MCP tool). Do not invent props, variants or sizes.

## Styling: tokens only

- Colours come only from semantic `--mrd-*` tokens: `--mrd-ink`, `--mrd-body`, `--mrd-muted` for text; `--mrd-bg`, `--mrd-surface`, `--mrd-tray`, `--mrd-subtle` for surfaces; `--mrd-line` for borders; `--mrd-accent*` for interactive and selected states; `--mrd-danger*`, `--mrd-warning-*`, `--mrd-success*` for status.
- No raw hex, `rgb()`, `hsl()` or named colours in components or CSS. No primitive palette tokens (`--mrd-blue-500`) either; they do not follow themes or accent presets.
- Spacing comes from the scale (`--mrd-space-1` … `--mrd-space-28`, or the `gap`/`padding` props of `Stack`, `Grid`, `Card`, `Section`). No arbitrary pixel values such as `margin: 13px` or Tailwind arbitrary values like `p-[13px]`.
- Radius from `--mrd-radius-*`, shadows from `--mrd-shadow-*`, type from `--mrd-text-*` / `--mrd-leading-*` / `--mrd-weight-*`, motion from `--mrd-duration*` / `--mrd-ease`.
- No inline `style={{ … }}` for colour, spacing, radius or typography. Use component props, a CSS class that reads tokens, or `data-*` attributes. (Setting a single CSS variable inline, such as `style={{ "--mrd-button-height": "32px" }}`, is the one allowed exception.)
- Borders are 1px `--mrd-line`. Never 2px, never dark borders. Separate regions by surface (`--mrd-tray`) before adding a border.
- One `variant="primary"` button per view. No gradients. Font weight 700 is never used.
- Theme, accent and density are attributes, not classes: `data-theme="dark"`, `data-accent="violet"`, `data-density="compact"` on `<html>` or any subtree.
- Write your own CSS outside Merid's layers (or in a later layer). Never use `!important` to beat Merid; its rules live in `@layer merid.*` and lose to unlayered CSS.

## Accessibility

- Every form control has a visible label: wrap it in `Field label="…"` (which wires `id`, `aria-describedby`, invalid and required) or use `Label`.
- Icon-only actions use `IconButton` with a `label`. Never a bare `<button>` with only an icon.
- Use `Button` for actions and `Link` for navigation. Do not put `onClick` on a `div` or `span`.
- Every `Dialog` and `AlertDialog` has a `Dialog.Title` (use `VisuallyHidden` if it must not show). Destructive confirmations use `AlertDialog`, not `Dialog`.
- Do not remove focus outlines. Do not set `tabIndex` greater than 0. Let Merid manage focus in overlays.
- Show errors with `Field`'s `error` prop, in text, not with colour alone.
- Keep headings in order (`Heading level`), and give images meaningful `alt` (empty `alt=""` for decoration).
- Respect `prefers-reduced-motion`; do not add animations that ignore it.

## When unsure

Ask the Merid MCP server (`npx -y @meridui/mcp`): `list_components`, `get_component`, `get_tokens`, `get_pattern`, `get_design_contract`, `search_docs`. Or read https://meridui.dev/llms.txt.
