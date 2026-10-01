# Merid design contract

This file is binding for every component, doc page and the landing site.
If a value is not here, derive it from an existing one — do not invent a new colour, radius or shadow.

## Naming

| Thing | Rule | Example |
|---|---|---|
| npm package | `@meridui/react` (components + CSS) | `import { Button } from "@meridui/react"` |
| CSS entry | `@meridui/react/styles.css` | one import, all components |
| Class prefix | `mrd-` + BEM-ish | `.mrd-button`, `.mrd-button__icon` |
| State / variant hooks | data attributes, never modifier classes | `data-variant="primary" data-size="sm" data-state="open"` |
| CSS variables | `--mrd-` + tier | primitive `--mrd-magenta-500`, semantic `--mrd-accent`, component `--mrd-button-height` |
| Cascade | every rule inside `@layer merid.tokens, merid.base, merid.components` | user CSS wins without `!important` |

## Brand

The identity is called **Pafta**, after the Turkish word for a map sheet. A meridian is a line on a map, so the most honest reference for Merid is cartography. Pafta takes only the parts of a printed map sheet that do real work in an interface. Tables close on an ink rule the way a ledger does, badges are drawn like the keys in a map legend, and the accent is magenta, the colour nautical and aeronautical charts keep for the information that matters most.

- **Logo**: the mark is a **wave** whose two crests form an M, a signal riding the meridian. The wave is the accent (`#b20965` light / `#ef86ae` dark); where the line passes under itself it drops into shadow (ink `#121417` light / deep magenta `#671d3e` dark). The outlined lowercase wordmark sits to its right, with the wave sitting on its x-height. Clean sources in `apps/docs/public/brand/src/` (`wave-21/`, `wordmark.svg`); `node apps/docs/scripts/build-brand.mjs` generates `logo-light.svg` / `logo-dark.svg` (lockup), `mark-light.svg` / `mark-dark.svg` / `mark-mono.svg` (mark only), `logo-mono*.svg` (single colour), `app/icon.svg` and `lib/brand-paths.ts`. The wave and its shadows only ever use the four colours above; never add effects, and keep clear space ≥ half the wave's height.
- **Type**: Archivo for interface text and headings, Chivo Mono for code (see Typography).
- **Docs motif — the drawing board**: the landing page is a drawing board. The content column has hairline rails, every band ends on a full-width hairline, registration crosses (11px) mark where rails and hairlines meet, and a single accent segment (the *meridian*) rides the hero's bottom hairline from the left rail. No cards and no fills on the landing except the playground stage.

## Subtree attributes (public API)

All three work on `<html>` or any element and nest freely; each resolves against the nearest ancestor that sets it.

| Attribute | Values | Default |
|---|---|---|
| `data-theme` | `"light"` · `"dark"` | `prefers-color-scheme` on `:root`; also sets `color-scheme` |
| `data-accent` | `"magenta"` · `"blue"` · `"violet"` · `"green"` · `"graphite"` · `"petrol"` · `"brass"` | `magenta` |
| `data-density` | `"compact"` · `"default"` · `"comfortable"` | `default` (fine pointers only; coarse pointers keep touch sizes) |

`dir="rtl"` is honoured by all component CSS (logical properties; directional icons and leading-edge rules flip via `:dir(rtl)`).

`lang` is not a Merid attribute, but the library depends on it: the one place Merid uppercases text (table column headings) uses `text-transform`, which follows the element's language. Put `lang="tr"` on Turkish content, or "Müşteri" becomes "MÜŞTERI" instead of "MÜŞTERİ". Merid never generates text of its own, so the page's `lang` is the whole fix.

## Principles

1. **One accent, used sparingly.** A single accent carries interactivity and selection. The default is map magenta; blue, violet, green, graphite, petrol and brass are presets for products that need a quieter or more familiar hue. Everything else is ink-tinted neutrals.
2. **Surfaces and rules before shadows.** Regions separate by tone first (`--mrd-tray` under the page), then by a line. A shadow means the thing floats above the page, so only menus, popovers, toasts, tooltips and dialogs have one.
3. **Two line weights.** Every border is a 1px `--mrd-line` hairline. The ink rule (`--mrd-rule`, 1px in the ink colour) closes a table at the top and the bottom and sits under its column headings. Selection is a 1.5px accent ring around a card, or a 2px accent rule on the leading edge of a row or nav item.
4. **Shadows only for floating surfaces.** They are long and faint with a negative spread, so they fall below the surface rather than haloing it, and the surface always has a 1px hairline of its own (a border, or `--mrd-elevated-ring` where it has none). Buttons have no shadow.
5. **Square-cut corners.** Controls, menus and tooltips are 2px; cards 3px; dialogs 4px, so a container is never sharper than what it holds. Full rounding is kept where the round shape is the meaning: the radio, the switch, the slider thumb, step markers and status dots.
6. **Wide headings, plain body.** Display headings use Archivo's wide cut (125%) at 600 with negative tracking; section titles and dialog titles use 112%. Body is 400 at a 1.6 line height. Weight 700 is never used, and the bundled faces stop at 600.
7. **Three text tones** — `ink`, `body`, `muted`. Hierarchy from tone and weight, not colour.
8. **Quiet interaction.** Hover is a background tint. A pressed control sinks 1px (`--mrd-press`) over 80ms; everything else takes 120–160ms on one curve. `prefers-reduced-motion` removes all motion.
9. **Compact controls, airy layout.** Controls are dense (32px default, like Linear or Radix Themes); sections keep big padding, wide gaps, content capped at 1160px, reading width ≤ 720px.
10. **At most one filled colour block per page.** No gradients (skeleton shimmer is the only exception).
11. **No decorative small print.** Components never add eyebrows or decorative mono captions. Table column headings are the only uppercase text, at 12px with 0.04em tracking, because a ledger heading is the one place capitals help you scan.

## Tokens

### Colour — light (`:root`, `[data-theme="light"]`) / dark (`[data-theme="dark"]`, and `:root` under `prefers-color-scheme: dark` unless `[data-theme="light"]`)

Both themes are fully scoped: a `data-theme="light"` card inside a dark page gets every light token and `color-scheme: light`, and vice versa. Accent rows below show the default `magenta` preset.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--mrd-accent` | `#b20965` | `#ef86ae` | interactive, selection, focus |
| `--mrd-accent-hover` | `#990155` | `#f7a0bf` | hover of accent and links |
| `--mrd-accent-soft` | `#fef0f4` | `rgba(239,134,174,.16)` | tint: selected row, icon tile, info |
| `--mrd-accent-strong` | `#830549` | `#fcbfd3` | text on accent-soft |
| `--mrd-accent-solid` / `-hover` | `#b20965` / `#990155` | `#b20965` / `#990155` | fills that carry on-accent text (AA ≥ 4.5:1) |
| `--mrd-on-accent` | `#ffffff` | `#ffffff` | text on accent fill |
| `--mrd-bg` | `#ffffff` | `#0d0e10` | page |
| `--mrd-surface` | `#ffffff` | `#141518` | cards on tray, dialogs, inputs, menus |
| `--mrd-tray` | `#f4f6f8` | `#181a1d` | recessed: alt sections, cards on page, hover bg, segment track |
| `--mrd-tray-2` | `#ebedf0` | `#202225` | track on a tray, shimmer |
| `--mrd-subtle` | `#f9fafc` | `#111214` | code block, read-only input, window bar, detail pane |
| `--mrd-line` | `#dde0e3` | `#292b2f` | every hairline |
| `--mrd-line-strong` | `#babec3` | `#3f4348` | dashed dropzone, checkbox border, field hover |
| `--mrd-rule` | `#121417` | `#eef0f3` | ink rule: table top and bottom, under column headings |
| `--mrd-ink` | `#121417` | `#eef0f3` | headings, strong text |
| `--mrd-body` | `#474b51` | `#b7bbc1` | body text |
| `--mrd-muted` | `#5f636a` | `#9a9fa6` | meta, icons (≥ 4.5:1 on bg, surface, subtle and tray) |
| `--mrd-placeholder` | `#64686d` | `#989ca2` | input placeholder (≥ 4.5:1 on surface) |
| `--mrd-control-off` | `#ced1d5` | `#35383d` | switch off |
| `--mrd-danger` | `#de3f20` | `#f96c4a` | invalid border, status dot (never behind text) |
| `--mrd-danger-solid` / `-hover` | `#c12b09` / `#a52205` | `#c12b09` / `#a52205` | fills that carry white text: danger button (AA ≥ 4.5:1) |
| `--mrd-danger-soft` / `-strong` | `#fef2ee` / `#a52205` | `rgba(222,63,32,.14)` / `#fea387` | error notice |
| `--mrd-warning-soft` / `-strong` | `#fff8eb` / `#93580a` | `rgba(245,166,35,.12)` / `#f5c46b` | warning notice (orange under `brass`, see below) |
| `--mrd-success` | `#1f9d63` | `#3ecf8e` | success icon/dot only |
| `--mrd-success-soft` / `-strong` | `#ecf8f1` / `#17744a` | `rgba(62,207,142,.12)` / `#7ee2b0` | success notice |
| `--mrd-tooltip-bg` / `-fg` | `#121417` / `#ffffff` | `#eef0f3` / `#0d0e10` | tooltip |

Danger is a vermilion, deliberately pulled towards orange. Magenta sits about 30° from a pure red, and an error that looked like the accent would read as a link or a selection; the shift keeps the two apart without giving up the urgency of red.

### Accent presets

Primitive palettes `--mrd-{magenta,blue,violet,green,graphite,petrol,brass}-{50,100,…,900}` live on `:root`. `data-accent` picks one; the public tokens (`--mrd-accent`, `-hover`, `-soft`, `-strong`, `-solid`, `-solid-hover`, `--mrd-warning-soft`, `--mrd-warning-strong`, `--mrd-focus-color`, `--mrd-focus-ring`, `--mrd-focus-ring-invalid`, `--mrd-shadow-accent`) are resolved on every element that sets `data-theme` or `data-accent`, so presets and themes nest independently. Consumers only ever read the public tokens.

| Preset | Light: accent / hover / strong / soft | Dark: accent / hover / strong / soft | Solid / hover (both modes) |
|---|---|---|---|
| `magenta` (default) | 600 `#b20965` / 700 / 800 / 50 | 400 `#ef86ae` / 300 / 200 / 400 @ 16% | 600 `#b20965` / 700 `#990155` |
| `blue` | 600 `#3d61f2` / 700 / 800 / 50 | 500 `#6b8aff` / 400 / 300 / 500 @ 14% | 600 `#3d61f2` / 700 `#3355e6` |
| `violet` | 600 `#6e4ef0` / 700 / 800 / 50 | 500 `#9d85ff` / 400 / 300 / 500 @ 14% | 600 `#6e4ef0` / 700 `#5f3fdc` |
| `green` | 600 `#13804d` / 700 / 800 / 50 | 500 `#3ecf8e` / 400 / 300 / 500 @ 12% | 600 `#13804d` / 700 `#0f6e42` |
| `graphite` | 600 `#3d4350` / 700 / 800 / 50 | 300 `#c9cdd4` / 200 / 100 / 300 @ 12% | 600 `#3d4350` / 700 `#2e333d` |
| `petrol` | 600 `#035f73` / 700 / 800 / 50 | 400 `#75c4d2` / 300 / 200 / 400 @ 14% | 600 `#035f73` / 700 `#025061` |
| `brass` | 600 `#855c01` / 700 / 800 / 50 | 400 `#d9b165` / 300 / 200 / 400 @ 14% | 600 `#855c01` / 700 `#744e01` |

Blue's 600 moved from `#3f63f5` to `#3d61f2` in this release: the new tray is a shade darker, and the old blue fell to 4.49:1 on it.

Brass is the one preset that changes a status colour. Its accent is an amber, close enough to the warning tone that a warning badge would read as an accent badge, so under `data-accent="brass"` the warning moves to orange: `--mrd-warning-strong` `#9e4500` / `#f9a870`, `--mrd-warning-soft` `#fff3e9` / `rgba(239,121,38,.13)`. The defaults are declared on `:root, [data-accent]` before the presets, so any other preset nested inside brass gets the amber back.

`--mrd-on-accent` is always `#fff`. `--mrd-shadow-accent` is `none`: a primary button is a flat block of ink colour.

Contrast (WCAG 2.x, computed by `packages/react/scripts/contrast.mjs`, which exits non-zero below 4.5:1; `src/components/Contrast.css.test.tsx` fails if the script's colours drift from `tokens.css`). Dark soft fills are composited over the surface they sit on.

| Preset | Mode | white / solid | white / solid-hover | accent / bg | accent / surface | accent / tray | strong / soft |
|---|---|---|---|---|---|---|---|
| magenta | light | 6.73 | 8.43 | 6.73 | 6.73 | 6.21 | 9.11 |
| magenta | dark | 6.73 | 8.43 | 7.99 | 7.56 | 7.22 | 9.05 |
| blue | light | 5.01 | 5.86 | 5.01 | 5.01 | 4.63 | 6.98 |
| blue | dark | 5.01 | 5.86 | 6.17 | 5.83 | 5.57 | 8.13 |
| violet | light | 5.24 | 6.50 | 5.24 | 5.24 | 4.83 | 8.11 |
| violet | dark | 5.24 | 6.50 | 6.65 | 6.29 | 6.01 | 8.31 |
| green | light | 4.97 | 6.31 | 4.97 | 4.97 | 4.59 | 7.89 |
| green | dark | 4.97 | 6.31 | 9.67 | 9.15 | 8.74 | 9.47 |
| graphite | light | 9.92 | 12.67 | 9.92 | 9.92 | 9.16 | 13.28 |
| graphite | dark | 9.92 | 12.67 | 12.11 | 11.45 | 10.93 | 11.32 |
| petrol | light | 7.27 | 9.04 | 7.27 | 7.27 | 6.71 | 9.60 |
| petrol | dark | 7.27 | 9.04 | 9.73 | 9.20 | 8.79 | 9.85 |
| brass | light | 5.95 | 7.41 | 5.95 | 5.95 | 5.49 | 8.56 |
| brass | dark | 5.95 | 7.41 | 9.59 | 9.07 | 8.66 | 10.10 |

Brass's own warning pair (strong on soft, over surface · tray): 5.82 · 5.82 light, 7.93 · 7.53 dark.

Neutral and status pairs:

| Pair | Light | Dark |
|---|---|---|
| ink / bg | 18.45 | 16.92 |
| body / bg · tray | 8.77 · 8.10 | 10.02 · 9.04 |
| placeholder / surface | 5.61 | 6.62 |
| muted / bg · surface · tray · subtle | 6.04 · 6.04 · 5.57 · 5.78 | 7.25 · 6.85 · 6.55 · 7.04 |
| white / danger-solid · danger-solid-hover | 5.81 · 7.42 | 5.81 · 7.42 |
| danger-strong / danger-soft (surface · tray) | 6.76 · 6.76 | 8.33 · 7.94 |
| warning-strong / warning-soft (surface · tray) | 5.46 · 5.46 | 9.20 · 8.63 |
| success-strong / success-soft (surface · tray) | 5.30 · 5.30 | 9.47 · 8.87 |

### Focus

| Token | Value | Use |
|---|---|---|
| `--mrd-focus-color` | `var(--mrd-accent)` | colour of every focus indicator |
| `--mrd-focus-width` | `2px` | outline width |
| `--mrd-focus-style` | `solid` | outline style |
| `--mrd-focus-offset` | `2px` | gap between control and outline |
| `--mrd-focus-ring` | `inset 0 -1px 0 var(--mrd-accent)` | fields: added to the accent border, so the bottom edge reads 2px |
| `--mrd-focus-ring-invalid` | `inset 0 -1px 0 var(--mrd-danger)` | the same line on an invalid field, so it never mixes accent and danger |

Every component focus outline is `outline: var(--mrd-focus-width) var(--mrd-focus-style) var(--mrd-focus-color); outline-offset: var(--mrd-focus-offset)`. Tightly packed controls (calendar days, the date-picker trigger, table sort buttons, toolbar items, navigation-menu links) use half the offset, and tab triggers draw the outline inside (`calc(var(--mrd-focus-width) * -1)`) so a scrolling tab list never clips it. A test fails if a component hard-codes an outline.

### Radius
`--mrd-radius-xs 2px` (focus outline, skeleton, inline code, badge, checkbox, segment) · `--mrd-radius-sm 2px` (small button, tooltip, avatar) · `--mrd-radius-md 2px` (icon button, menu item, nav link) · `--mrd-radius-lg 2px` (button, input, select, alert, toast) · `--mrd-radius-xl 2px` (popover) · `--mrd-radius-2xl 3px` (menu, select list) · `--mrd-radius-card 3px` (card, panel, drawer, empty state) · `--mrd-radius-3xl 4px` (dialog) · `--mrd-radius-full 999px` (radio, switch, slider thumb, progress, step marker, status dot).

The scale keeps all nine steps even though most of them are now 2px. Components still name the role they need, so a product that wants rounder corners overrides a handful of tokens and gets a consistent result.

### Shadow (all ink-tinted)
| Token | Light | Use |
|---|---|---|
| `--mrd-shadow-xs` / `-sm` | `0 0 0 0 transparent` | flat in this identity; kept so overrides have a hook |
| `--mrd-shadow-md` | `0 1px 0 rgba(18,20,23,.06)` | card lift |
| `--mrd-shadow-lg` | `0 18px 36px -18px rgba(18,20,23,.28)` | popover, toast, tooltip |
| `--mrd-shadow-xl` | `0 18px 36px -18px rgba(18,20,23,.28)` | menu |
| `--mrd-shadow-2xl` | `0 32px 64px -24px rgba(18,20,23,.34)` | dialog |
| `--mrd-elevated-ring` | `0 0 0 1px var(--mrd-line)` | hairline around every floating surface, in both themes |
| `--mrd-shadow-accent` | `none` | primary button |

In dark mode the same shapes use black at 30–80% opacity.

### Typography
Font: **Archivo** (Omnibus-Type, SIL OFL 1.1) for interface text and headings, `--mrd-font-sans: "Archivo", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`. Mono: **Chivo Mono** (Omnibus-Type, SIL OFL 1.1), `--mrd-font-mono: "Chivo Mono", ui-monospace, SFMono-Regular, Menlo, monospace`. `--mrd-font-display` (defaults to the sans) is the face of the display heading. `font-display: swap`, antialiased, no stylistic-set features, `tabular-nums` on every number. UI text defaults to 14px.

We chose Archivo because it has a real width axis. One file gives both the wide headings of a map sheet and an ordinary 14px interface text, so the identity doesn't split into a display face and a text face that never quite agree. Its Turkish letters and the lira sign are drawn glyphs, not composed accents. Chivo Mono comes from the same foundry and shares its proportions.

The bundled files are cut down to what Merid uses: weight 400–600 for both families, width 100–125% for Archivo, and the latin and latin-ext subsets, picked by `unicode-range` (ı is in latin; ğ, ş, İ and ₺ are in latin-ext). The four woff2 files weigh 120 KB together, against 141 KB for the Geist pair they replaced. A request for bold renders at 600. `packages/react/test/fonts.test.tsx` reads the shipped files and fails if a Turkish letter or ₺ is missing from the face that `unicode-range` selects, or if the axes and the `@font-face` descriptors disagree.

Width is a token, not a second family:

| Token | Value | Use |
|---|---|---|
| `--mrd-display-stretch` | `125%` | display heading |
| `--mrd-title-stretch` | `112%` | h2, dialog title |
| `--mrd-label-stretch` | `112%` | badge, table column heading |
| `--mrd-label-size` / `-tracking` / `-transform` | `12px` / `0.04em` / `uppercase` | table column heading |

| Token | Size / line-height / tracking | Use |
|---|---|---|
| `--mrd-text-display` | `clamp(36px,5vw,60px)` / 1 / -0.035em, width 125% | hero h1 |
| `--mrd-text-h2` | `clamp(26px,3vw,34px)` / 1.15 / -0.025em, width 112% | section title |
| `--mrd-text-h3` | 17px / 1.35 / -0.015em | card title |
| `--mrd-text-lg` | 17px / 1.6 | lead |
| `--mrd-text-md` | 15px / 1.6 | body copy (base default on `:root` / `.mrd-root`) |
| `--mrd-text-sm` | 14px / 1.5 | UI default: button, input, menu item, nav, list |
| `--mrd-text-xs` | 13px / 1.45 | small button, label, segment |
| `--mrd-text-2xs` | 12.5px / 1.4 | meta, helper, notes |
| `--mrd-text-3xs` | 12px / 1.3 | badge, tooltip, table column heading |

Fixed exceptions: table cells and alert text are 13.5px; dialog title is 16px/600 at 112%.

Weights: `--mrd-weight-regular 400`, `--mrd-weight-medium 500` (all UI), `--mrd-weight-semibold 600` (headings, prices).

### Spacing (4/8 base)
`--mrd-space-1 4px` · `2 8px` · `3 12px` · `4 16px` · `5 20px` · `6 24px` · `7 28px` · `8 32px` · `10 40px` · `14 56px` · `16 64px` · `18 72px` · `28 112px`.
Layout: `--mrd-container 1160px`, `--mrd-gutter 24px` (20px ≤ 640px), `--mrd-section 112px` (80px ≤ 920px, 64px ≤ 640px), `--mrd-prose 720px`.

### Control sizes
| | sm | md (default) | lg |
|---|---|---|---|
| Button height / padding / font | 28 / 0 10px / 13 | 32 / 0 12px / 14 | 40 / 0 16px / 15 |
| Button radius | 2 | 2 | 2 |
| Input / NativeSelect / Select trigger height (padding 0 10px, font 14) | 28 | 32 | 40 |
| Icon button | 24 | 28 | 32 |
| Segment (segmented control, track padding 2) | — | 28 | — |
| Tabs trigger | — | 32 | — |
| Menu / Select item (padding 6px 8px, radius 2) | — | 30 | — |
| Checkbox / Radio | — | 16 | — |
| Switch | — | 28×16 | — |
| Badge (12px text) | — | 20 | — |
On coarse pointers (`@media (pointer: coarse)`) md button → 40, input / select trigger → 44, md icon button → 40, segment → 36, menu / nav items → 44.

Horizontal padding is tokenised: `--mrd-control-pad-sm/md/lg` (10/12/16, buttons) and `--mrd-input-pad` (10, input / select / native select).

### Density
`data-density` rescales the control tokens for a subtree (fine pointers only — coarse pointers keep the touch sizes above):

| | compact | default | comfortable |
|---|---|---|---|
| `--mrd-control-sm / md / lg` (button) | 24 / **28** / 32 | 28 / **32** / 40 | 32 / **36** / 44 |
| `--mrd-input-sm / md / lg` | 24 / 28 / 32 | 28 / 32 / 40 | 32 / 36 / 44 |
| `--mrd-icon-button-sm / md / lg` | 20 / 24 / 28 | 24 / 28 / 32 | 28 / 32 / 36 |
| `--mrd-pill` | 24 | 28 | 32 |
| `--mrd-control-pad-sm / md / lg` · `--mrd-input-pad` | 8 / 10 / 12 · 8 | 10 / 12 / 16 · 10 | 12 / 14 / 18 · 12 |
| `--mrd-text-sm` / `--mrd-text-xs` | 13 / 12 | 14 / 13 | 14.5 / 13.5 |

### Motion
`--mrd-duration-fast 80ms` (press) · `--mrd-duration 120ms` (colour/border/shadow) · `--mrd-duration-slow 160ms` (rotate, overlay) · `--mrd-duration-enter 180ms` (overlay enter) · `--mrd-ease cubic-bezier(.25,0,0,1)` · `--mrd-press translateY(1px)`. Enter animation `fade`: opacity 0 → 1, `translateY(4px)` → 0. Overlays only ever move vertically.

### Breakpoints and layers
Breakpoints (used in CSS only): 640 (mobile pass), 920 (layout collapse). Z-index: `--mrd-z-sticky 50` · `--mrd-z-overlay 100` (dialog, drawer + backdrop) · `--mrd-z-popover 105` (popover, menu, select list — above overlays so they work inside a dialog) · `--mrd-z-toast 110` · `--mrd-z-tooltip 120`. Portalled overlays copy the nearest ancestor `data-theme` / `data-accent` / `data-density` / `dir` of their trigger onto a `display: contents` `.mrd-portal` wrapper.

## Component specifics (the signature details)

- **Button**: variants `primary` (flat accent fill, no shadow), `secondary` (surface + 1px line, hover tray), `ghost` (transparent, hover tray), `danger` (`--mrd-danger-solid`, hover `-solid-hover`), `link`. `asChild` renders a router link with the same styling. Press is `--mrd-press` (down 1px) over `--mrd-duration-fast`; icon buttons, the dialog close button, pagination, toggles and the file-upload button use the same token. Loading shows spinner and keeps width.
- **Focus**: the square 2px accent outline described under Focus. Fields use border-accent + `--mrd-focus-ring` instead; invalid fields use `--mrd-focus-ring-invalid`. The slider thumb takes the outline, because a line under a round thumb would not read as focus.
- **Input**: surface fill, 1px line, radius lg (2px), padding 0 10px; on focus the border turns accent and the bottom edge thickens to 2px; `aria-invalid` → danger border.
- **Checkbox**: 16px, radius xs (2px), 1px line-strong; checked = accent fill + white 1.6-stroke check. **Radio**: 16px circle, 6px accent dot. **Switch**: 28×16 (12px knob), off `--mrd-control-off`, on accent.
- **SegmentedControl**: tray track radius xs, padding 2px, 28px segments; the selected segment is surface with a 1px `--mrd-line` ring and ink text, like a drafting tab rather than a floating pill.
- **Tabs (line)**: 32px triggers, 1px line baseline; active = ink text + 1.5px accent underline.
- **Card**: tray fill, radius card (3px), padding 20px (sm 16, lg 24); `variant="elevated"` = surface + shadow-md + elevated ring; interactive cards lift 3px on hover.
- **Selectable row / card**: selected card = `box-shadow: inset 0 0 0 1.5px var(--mrd-accent)`.
- **Badge**: a legend key, not a pill. 20px tall, radius xs, padding 0 6px, 12px/500 at `--mrd-label-stretch`; the optional dot is a 7px square. Tones `neutral` (tray/body), `accent` (accent-soft/accent-strong), `success`, `warning`, `danger`, `solid` (accent/on-accent).
- **Avatar**: square with radius sm (2px), tray-2 fill, initials at 38% of the size.
- **Menu / Popover / Select list**: surface, 1px line, radius 2xl (menu, 3px) or xl (popover, 2px), padding 4px, shadow-xl; items 30px tall, 14px text, padding 6px 8px, radius md, hover tray.
- **Tooltip**: tooltip-bg/fg, 12px, radius sm, padding 4px 8px, shadow-lg, fade, no arrow.
- **Dialog**: surface, radius 3xl (4px), padding 24px, title 16px/600 at `--mrd-title-stretch`, shadow-2xl + elevated ring, backdrop `rgba(18,20,23,.36)`; the close button is a transparent square with a 1px line ring. ≤ 640px becomes a bottom sheet (radius on top corners only).
- **Toast**: surface, 1px line, radius lg, padding 12px 14px, shadow-lg, leading status dot, bottom-right stack.
- **Table**: a ledger. No side walls and no radius: the frame has an ink rule (`--mrd-rule`) at the top and the bottom, column headings sit over a second ink rule, and rows are split by 1px hairlines. Cells 8px 12px at 13.5px, tabular nums. Column headings are 12px/500 muted, uppercase at `--mrd-label-stretch` with 0.04em tracking; row headers in the body keep normal case. Row hover tray; the selected row is accent-soft with a 2px accent rule on its leading edge. Sortable headers (`sortDirection`) hold a 24px-tall ghost button with a 12px chevron pair; the active column's label turns ink.
- **SidebarNav**: items 30px, radius md, hover tray. The current page has no fill: ink text, an accent icon and a 2px accent rule on the leading edge.
- **Stepper**: horizontal steppers are their own container; below 560px of stepper width only the current step keeps its title and the rest collapse to markers on the hairline.
- **Box sizing**: every `.mrd-*` element (and its pseudo-elements) is `border-box` from the components layer, so components do not depend on a reset; `merid.base` also sets it globally at zero specificity.
- **Skeleton**: tray → tray-2 → tray gradient, radius xs, 1.4s shimmer (none under reduced motion).
- **Alert**: radius lg, padding 12px 14px, 13.5px text, 16px icon. Title and body both use the tone's `-strong` colour at full opacity.
- **Accordion**: rows split by 1px line, plus icon rotates 45° and turns accent when open.

## Direction, forced colours and print
Shared rules live in `packages/react/styles/components/_adapt.css`.

- **RTL**: component CSS uses logical properties only (`margin-inline`, `padding-inline`, `inset-inline-*`, `border-start-*-radius`, `text-align: start/end`); a test forbids physical `left`/`right`. Under `:dir(rtl)` the pagination chevrons mirror, the switch thumb travels the other way, and the leading-edge rules of the selected table row and the current sidebar item move to the right. Select/accordion chevrons are vertical and do not flip; the breadcrumb `/` is direction-neutral. `Drawer side="left|right"` stays physical by design.
- **Forced colours** (`@media (forced-colors: active)`): buttons, icon buttons, inputs, selects, segmented items and pagination get a 1px `ButtonText` border; checkbox / radio / switch draw with `Canvas` / `ButtonText` and fill `Highlight` when on; focus is a 2px `Highlight` outline; selected tab / page / segment and the current sidebar item get a `Highlight` outline; floating surfaces (card, dialog, drawer, popover, menu, select list, toast, tooltip) get a `CanvasText` border; the table frame draws its top and bottom rules as `CanvasText` borders, since box-shadows are dropped.
- **Print**: backdrops, toasts, tooltips, popovers and menus are hidden; all shadows are removed; cards get a hairline and avoid page breaks; the table keeps its ink rules as real borders.

## Accessibility baseline
WCAG 2.2 AA. Every interactive component: correct role/ARIA per WAI-ARIA APG, full keyboard support, visible focus, 24×24 minimum target, works at 200% zoom, respects reduced motion, usable in forced colours and RTL. Text contrast ≥ 4.5:1 for every text tone on every surface, in both themes and all seven presets, verified by `scripts/contrast.mjs`. Uppercase text depends on the content's `lang` attribute (see Subtree attributes).
