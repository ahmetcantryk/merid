# Merid design contract

This file is binding for every component, doc page and the landing site.
If a value is not here, derive it from an existing one — do not invent a new colour, radius or shadow.

## Naming

| Thing | Rule | Example |
|---|---|---|
| npm package | `@merid/react` (components + CSS) | `import { Button } from "@merid/react"` |
| CSS entry | `@merid/react/styles.css` | one import, all components |
| Class prefix | `mrd-` + BEM-ish | `.mrd-button`, `.mrd-button__icon` |
| State / variant hooks | data attributes, never modifier classes | `data-variant="primary" data-size="sm" data-state="open"` |
| CSS variables | `--mrd-` + tier | primitive `--mrd-blue-500`, semantic `--mrd-accent`, component `--mrd-button-height` |
| Cascade | every rule inside `@layer merid.tokens, merid.base, merid.components` | user CSS wins without `!important` |

## Brand

- **Logo**: the mark is a **wave** whose two crests form an M, a signal riding the meridian. The wave is the accent (`#3f63f5` light / `#6b8aff` dark); where the line passes under itself it drops into shadow (ink `#0f1219` light / `#1a2a6e` dark). The outlined lowercase wordmark sits to its right, with the wave sitting on its x-height. Clean sources in `apps/docs/public/brand/src/` (`wave-21/`, `wordmark.svg`); `node apps/docs/scripts/build-brand.mjs` generates `logo-light.svg` / `logo-dark.svg` (lockup), `mark-light.svg` / `mark-dark.svg` / `mark-mono.svg` (mark only), `logo-mono*.svg` (single colour), `app/icon.svg` and `lib/brand-paths.ts`. Never recolour the wave or its shadows, never add effects; keep clear space ≥ half the wave's height.
- **Type**: Geist and Geist Mono (see Typography).
- **Docs motif — the drawing board**: the landing page is a drawing board. The content column has hairline rails, every band ends on a full-width hairline, registration crosses (11px) mark where rails and hairlines meet, and a single accent segment (the *meridian*) rides the hero's bottom hairline from the left rail. No cards and no fills on the landing except the playground stage.

## Subtree attributes (public API)

All three work on `<html>` or any element and nest freely; each resolves against the nearest ancestor that sets it.

| Attribute | Values | Default |
|---|---|---|
| `data-theme` | `"light"` · `"dark"` | `prefers-color-scheme` on `:root`; also sets `color-scheme` |
| `data-accent` | `"blue"` · `"violet"` · `"green"` · `"graphite"` | `blue` |
| `data-density` | `"compact"` · `"default"` · `"comfortable"` | `default` (fine pointers only; coarse pointers keep touch sizes) |

`dir="rtl"` is honoured by all component CSS (logical properties; directional icons flip via `:dir(rtl)`).

## Principles

1. **One accent, used sparingly.** A single accent (cool blue by default; violet, green or graphite presets) carries interactivity and selection. Everything else is ink-tinted neutrals.
2. **Separate by surface before border.** Cards sit on `--mrd-tray` over the page; on a tray section they flip to surface + soft shadow. Borders are the last resort.
3. **Hairlines only.** Every border is 1px `--mrd-line`. Selection is a 1.5px accent ring. Never 2px, never dark borders.
4. **Soft, long, faint shadows**, always tinted with ink `rgba(15,18,25,…)`, never black. Buttons are crisp, not glowing: a 1px top highlight plus a 1–2px contact shadow.
5. **Compact, consistent rounding** that steps down when nested: 16 (dialog) → 14 (card) → 12 (menu) → 8 (control) → 6 (item).
6. **Tight large headings, relaxed body.** Headings 600 with negative tracking and `text-wrap: balance`; body 1.6. Weight 700 is never used.
7. **Three text tones** — `ink`, `body`, `muted`. Hierarchy from tone and weight, not colour.
8. **Quiet interaction.** Hover = background tint or 2–3px lift; press = `scale(.97)` at 100ms; 150–200ms otherwise. `prefers-reduced-motion` removes all motion.
9. **Compact controls, airy layout.** Controls are dense (32px default, like Geist / Linear / Radix Themes); sections keep big padding, wide gaps, content capped at 1160px, reading width ≤ 720px.
10. **At most one filled colour block per page.** No gradients (skeleton shimmer is the only exception).

## Tokens

### Colour — light (`:root`, `[data-theme="light"]`) / dark (`[data-theme="dark"]`, and `:root` under `prefers-color-scheme: dark` unless `[data-theme="light"]`)

Both themes are fully scoped: a `data-theme="light"` card inside a dark page gets every light token and `color-scheme: light`, and vice versa. Accent rows below show the default `blue` preset.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--mrd-accent` | `#3f63f5` | `#6b8aff` | interactive, selection, focus |
| `--mrd-accent-hover` | `#3355e6` | `#8aa2ff` | hover of accent and links |
| `--mrd-accent-soft` | `#eef1ff` | `rgba(107,138,255,.14)` | tint: selected row, icon tile, info |
| `--mrd-accent-strong` | `#2c46b8` | `#a9bbff` | text on accent-soft |
| `--mrd-accent-solid` / `-hover` | `#3f63f5` / `#3355e6` | `#3f63f5` / `#3355e6` | fills that carry on-accent text (AA ≥ 4.5:1) |
| `--mrd-on-accent` | `#ffffff` | `#ffffff` | text on accent fill |
| `--mrd-bg` | `#ffffff` | `#0b0d12` | page |
| `--mrd-surface` | `#ffffff` | `#12151c` | cards on tray, dialogs, inputs, menus |
| `--mrd-tray` | `#f5f6f8` | `#161a22` | recessed: alt sections, cards on page, hover bg, pill track |
| `--mrd-tray-2` | `#eceef2` | `#1d222c` | track on a tray, shimmer |
| `--mrd-subtle` | `#fbfbfc` | `#10131a` | table header, window bar, detail pane |
| `--mrd-line` | `#e6e8ec` | `#262b35` | every hairline |
| `--mrd-line-strong` | `#cfd4dc` | `#3a404c` | dashed dropzone, switch-off border |
| `--mrd-ink` | `#0f1219` | `#eef0f4` | headings, strong text |
| `--mrd-body` | `#535a67` | `#a3a9b5` | body text |
| `--mrd-muted` | `#646b78` | `#858c98` | meta, icons (≥ 4.5:1 on bg, surface, subtle and tray) |
| `--mrd-placeholder` | `#6e7581` | `#7c8390` | input placeholder (≥ 4.5:1 on surface) |
| `--mrd-control-off` | `#d7dbe2` | `#343a46` | switch off |
| `--mrd-danger` | `#e5484d` | `#ff6369` | invalid border, status dot (never behind text) |
| `--mrd-danger-solid` / `-hover` | `#c92a30` / `#b42318` | `#c92a30` / `#b42318` | fills that carry white text: danger button (AA ≥ 4.5:1) |
| `--mrd-danger-soft` / `-strong` | `#fff0f0` / `#b42318` | `rgba(229,72,77,.12)` / `#ff8a8e` | error notice |
| `--mrd-warning-soft` / `-strong` | `#fff8eb` / `#93580a` | `rgba(245,166,35,.12)` / `#f5c46b` | warning notice |
| `--mrd-success` | `#1f9d63` | `#3ecf8e` | success icon/dot only |
| `--mrd-success-soft` / `-strong` | `#ecf8f1` / `#17744a` | `rgba(62,207,142,.12)` / `#7ee2b0` | success notice |
| `--mrd-tooltip-bg` / `-fg` | `#0f1219` / `#ffffff` | `#eef0f4` / `#0f1219` | tooltip |

### Accent presets

Primitive palettes `--mrd-{blue,violet,green,graphite}-{50,100,…,900}` live on `:root`. `data-accent` picks one; the public tokens (`--mrd-accent`, `-hover`, `-soft`, `-strong`, `-solid`, `-solid-hover`, `--mrd-focus-ring`, `--mrd-shadow-accent`) are resolved on every element that sets `data-theme` or `data-accent`, so presets and themes nest independently. Consumers only ever read the public tokens.

| Preset | Light: accent / hover / strong / soft | Dark: accent / hover / strong / soft | Solid / hover (both modes) |
|---|---|---|---|
| `blue` | 600 `#3f63f5` / 700 / 800 / 50 | 500 `#6b8aff` / 400 / 300 / 500 @ 14% | 600 `#3f63f5` / 700 `#3355e6` |
| `violet` | 600 `#6e4ef0` / 700 / 800 / 50 | 500 `#9d85ff` / 400 / 300 / 500 @ 14% | 600 `#6e4ef0` / 700 `#5f3fdc` |
| `green` | 600 `#13804d` / 700 / 800 / 50 | 500 `#3ecf8e` / 400 / 300 / 500 @ 12% | 600 `#13804d` / 700 `#0f6e42` |
| `graphite` | 600 `#3d4350` / 700 / 800 / 50 | 300 `#c9cdd4` / 200 / 100 / 300 @ 12% | 600 `#3d4350` / 700 `#2e333d` |

Focus ring = `0 0 0 3px` accent at 18% (light) / 28% (dark). `--mrd-shadow-accent` = inset white highlight + a 1×2px contact shadow tinted 30% with the preset's solid. `--mrd-on-accent` is always `#fff`.

Contrast (WCAG 2.x, computed by `packages/react/scripts/contrast.mjs`, which exits non-zero below 4.5:1):

| Preset | Mode | white / solid | white / solid-hover | accent / bg | accent / surface | accent / tray | strong / soft (light) or surface (dark) |
|---|---|---|---|---|---|---|---|
| blue | light | 4.87 | 5.86 | 4.87 | 4.87 | 4.50 | 6.98 |
| blue | dark | 4.87 | 5.86 | 6.20 | 5.83 | 5.56 | 9.78 |
| violet | light | 5.24 | 6.50 | 5.24 | 5.24 | 4.84 | 8.11 |
| violet | dark | 5.24 | 6.50 | 6.69 | 6.29 | 6.00 | 10.18 |
| green | light | 4.97 | 6.31 | 4.97 | 4.97 | 4.60 | 7.89 |
| green | dark | 4.97 | 6.31 | 9.74 | 9.15 | 8.73 | 11.65 |
| graphite | light | 9.92 | 12.67 | 9.92 | 9.92 | 9.17 | 13.28 |
| graphite | dark | 9.92 | 12.67 | 12.19 | 11.45 | 10.93 | 14.62 |

Neutral and status pairs (dark soft fills composited over the surface / tray they sit on):

| Pair | Light | Dark |
|---|---|---|
| placeholder / surface | 4.64 | 4.79 |
| muted / bg · surface · tray · subtle | 5.36 · 5.36 · 4.96 · 5.19 | 5.74 · 5.39 · 5.15 · 5.49 |
| body / tray | 6.42 | 7.39 |
| white / danger-solid · danger-solid-hover | 5.44 · 6.57 | 5.44 · 6.57 |
| danger-strong / danger-soft (surface · tray) | 5.94 · 5.94 | 7.23 · 6.84 |
| warning-strong / warning-soft (surface · tray) | 5.46 · 5.46 | 9.24 · 8.66 |
| success-strong / success-soft (surface · tray) | 5.30 · 5.30 | 9.46 · 8.87 |

### Radius
`--mrd-radius-xs 4px` (focus ring, skeleton, inline code) · `--mrd-radius-sm 6px` (small button, tooltip, toast action) · `--mrd-radius-md 6px` (icon button, menu item, nav link) · `--mrd-radius-lg 8px` (button, input, select, alert, table, toast) · `--mrd-radius-xl 10px` (popover) · `--mrd-radius-2xl 12px` (menu, select list, mobile card) · `--mrd-radius-card 14px` (card, panel, drawer, empty state) · `--mrd-radius-3xl 16px` (dialog, CTA block) · `--mrd-radius-full 999px` (pill, badge, switch, avatar).

### Shadow (all ink-tinted)
| Token | Value |
|---|---|
| `--mrd-shadow-xs` | `0 1px 3px rgba(15,18,25,.10)` — selected pill chip |
| `--mrd-shadow-sm` | `0 2px 6px rgba(15,18,25,.05)` — icon tile |
| `--mrd-shadow-md` | `0 12px 32px rgba(15,18,25,.06)` — card lift |
| `--mrd-shadow-lg` | `0 10px 28px rgba(15,18,25,.10)` — popover, toast, tooltip |
| `--mrd-shadow-xl` | `0 16px 40px rgba(15,18,25,.10)` — menu |
| `--mrd-shadow-2xl` | `0 24px 64px rgba(15,18,25,.18)` — dialog |
| `--mrd-shadow-accent` | `inset 0 1px 0 rgba(255,255,255,.12), 0 1px 2px rgba(15,18,25,.12)` — primary button (crisp, no glow) |
| `--mrd-focus-ring` | `0 0 0 3px rgba(71,108,255,.18)` — input focus halo (dark `.28`) |

In dark mode shadows become `rgba(0,0,0,.4–.6)` and elevated surfaces add `0 0 0 1px var(--mrd-line)`.

### Typography
Font: **Geist** (bundled variable woff2, wght 100–900, OFL © Vercel), `--mrd-font-sans: "Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`. Mono: **Geist Mono** (bundled), `--mrd-font-mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace`. `font-display: swap`, antialiased, no stylistic-set features, `tabular-nums` on every number. UI text defaults to 14px.

| Token | Size / line-height / tracking | Use |
|---|---|---|
| `--mrd-text-display` | `clamp(36px,5vw,60px)` / 1.05 / -0.045em | hero h1 |
| `--mrd-text-h2` | `clamp(26px,3vw,34px)` / 1.15 / -0.035em | section title |
| `--mrd-text-h3` | 17px / 1.35 / -0.015em | card title |
| `--mrd-text-lg` | 17px / 1.6 | lead |
| `--mrd-text-md` | 15px / 1.6 | body copy (base default on `:root` / `.mrd-root`) |
| `--mrd-text-sm` | 14px / 1.5 | UI default: button, input, menu item, nav, list |
| `--mrd-text-xs` | 13px / 1.45 | small button, label, pill |
| `--mrd-text-2xs` | 12.5px / 1.4 | meta, helper, notes |
| `--mrd-text-3xs` | 12px / 1.3 | badge, tooltip, caption |

Fixed exceptions: table cells and alert text are 13.5px; dialog title is 16px/600.

Weights: `--mrd-weight-regular 400`, `--mrd-weight-medium 500` (all UI), `--mrd-weight-semibold 600` (headings, prices).

### Spacing (4/8 base)
`--mrd-space-1 4px` · `2 8px` · `3 12px` · `4 16px` · `5 20px` · `6 24px` · `7 28px` · `8 32px` · `10 40px` · `14 56px` · `16 64px` · `18 72px` · `28 112px`.
Layout: `--mrd-container 1160px`, `--mrd-gutter 24px` (20px ≤ 640px), `--mrd-section 112px` (80px ≤ 920px, 64px ≤ 640px), `--mrd-prose 720px`.

### Control sizes
| | sm | md (default) | lg |
|---|---|---|---|
| Button height / padding / font | 28 / 0 10px / 13 | 32 / 0 12px / 14 | 40 / 0 16px / 15 |
| Button radius | 6 | 8 | 8 |
| Input / NativeSelect / Select trigger height (padding 0 10px, font 14) | 28 | 32 | 40 |
| Icon button | 24 | 28 | 32 |
| Pill (segmented, track padding 2) | — | 28 | — |
| Tabs trigger | — | 32 | — |
| Menu / Select item (padding 6px 8px, radius 6) | — | 30 | — |
| Checkbox / Radio | — | 16 | — |
| Switch | — | 28×16 | — |
| Badge (12px text) | — | 20 | — |
On coarse pointers (`@media (pointer: coarse)`) md button → 40, input / select trigger → 44, md icon button → 40, pill → 36, menu / nav items → 44.

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
`--mrd-duration-fast 100ms` (press) · `--mrd-duration 150ms` (colour/border/shadow) · `--mrd-duration-slow 200ms` (lift, rotate, overlay) · `--mrd-ease cubic-bezier(.2,0,0,1)`. Enter animation `fade`: opacity 0 → 1, `translateY(4px)` → 0, 220ms.

### Breakpoints and layers
Breakpoints (used in CSS only): 640 (mobile pass), 920 (layout collapse). Z-index: `--mrd-z-sticky 50` · `--mrd-z-overlay 100` (dialog, drawer + backdrop) · `--mrd-z-popover 105` (popover, menu, select list — above overlays so they work inside a dialog) · `--mrd-z-toast 110` · `--mrd-z-tooltip 120`. Portalled overlays copy the nearest ancestor `data-theme` / `data-accent` / `data-density` / `dir` of their trigger onto a `display: contents` `.mrd-portal` wrapper.

## Component specifics (the signature details)

- **Button**: variants `primary` (accent fill + crisp `--mrd-shadow-accent`: inset top highlight + 1px contact shadow), `secondary` (surface + 1px line + shadow-xs, hover tray), `ghost` (transparent, hover tray), `danger` (`--mrd-danger-solid`, hover `-solid-hover`), `link`. `asChild` renders a router link with the same styling. Press `scale(.97)` over `--mrd-duration-fast`. Loading shows spinner and keeps width.
- **Focus**: `outline: 2px solid var(--mrd-accent); outline-offset: 3px; border-radius: var(--mrd-radius-xs)` on `:focus-visible`. Inputs use border-accent + `--mrd-focus-ring` instead.
- **Input**: surface fill, 1px line, radius lg (8px), padding 0 10px, 3px focus halo, `aria-invalid` → danger border.
- **Checkbox**: 16px, radius 4px, 1px line; checked = accent fill + white 1.6-stroke check. **Radio**: 16px circle, 6px accent dot. **Switch**: 28×16 (12px knob), off `--mrd-control-off`, on accent, knob shadow-xs.
- **SegmentedControl**: tray track radius full, padding 2px, 28px chips; selected chip = surface + shadow-xs, ink text.
- **Tabs (line)**: 32px triggers, 1px line baseline; active = ink text + 1.5px accent underline.
- **Card**: tray fill, radius card (14px), padding 20px (sm 16, lg 24); `variant="elevated"` = surface + shadow-md; interactive cards lift 3px on hover.
- **Selectable row / card**: selected = `box-shadow: inset 0 0 0 1.5px var(--mrd-accent)`.
- **Badge**: 20px tall, radius full, 12px/500; tones `neutral` (tray/body), `accent` (accent-soft/accent-strong), `success`, `warning`, `danger`, `solid` (accent/on-accent).
- **Menu / Popover / Select list**: surface, 1px line, radius 2xl (menu) or xl (popover), padding 4px, shadow-xl; items 30px tall, 14px text, padding 6px 8px, radius md (6px), hover tray.
- **Tooltip**: tooltip-bg/fg, 12px, radius sm, padding 4px 8px, shadow-lg, 150ms fade, no arrow.
- **Dialog**: surface, radius 3xl (16px), padding 24px, title 16px/600, shadow-2xl, backdrop `rgba(15,18,25,.4)`; ≤ 640px becomes a bottom sheet (radius on top corners only).
- **Toast**: surface, 1px line, radius lg, padding 12px 14px, shadow-lg, leading status dot, bottom-right stack.
- **Table**: 1px line ring radius lg, cells 8px 12px at 13.5px, header `--mrd-subtle` 12px/500 muted, 1px row lines, tabular nums, row hover tray, selected accent-soft. Sortable headers (`sortDirection`) hold a 24px-tall ghost button with a 12px chevron pair; the active column's label turns ink.
- **Stepper**: horizontal steppers are their own container; below 560px of stepper width only the current step keeps its title and the rest collapse to markers on the hairline.
- **Box sizing**: every `.mrd-*` element (and its pseudo-elements) is `border-box` from the components layer, so components do not depend on a reset; `merid.base` also sets it globally at zero specificity.
- **Skeleton**: tray → tray-2 → tray gradient, radius xs, 1.4s shimmer (none under reduced motion).
- **Alert**: radius lg, padding 12px 14px, 13.5px text, 16px icon. Title and body both use the tone's `-strong` colour at full opacity.
- **Accordion**: rows split by 1px line, plus icon rotates 45° and turns accent when open.

## Direction, forced colours and print
Shared rules live in `packages/react/styles/components/_adapt.css`.

- **RTL**: component CSS uses logical properties only (`margin-inline`, `padding-inline`, `inset-inline-*`, `border-start-*-radius`, `text-align: start/end`); a test forbids physical `left`/`right`. Under `:dir(rtl)` the pagination chevrons mirror and the switch thumb travels the other way. Select/accordion chevrons are vertical and do not flip; the breadcrumb `/` is direction-neutral. `Drawer side="left|right"` stays physical by design.
- **Forced colours** (`@media (forced-colors: active)`): buttons, icon buttons, inputs, selects, segmented items and pagination get a 1px `ButtonText` border; checkbox / radio / switch draw with `Canvas` / `ButtonText` and fill `Highlight` when on; focus is a 2px `Highlight` outline; selected tab / page / segment get a `Highlight` outline; floating surfaces (card, dialog, drawer, popover, menu, select list, toast, tooltip) get a `CanvasText` border.
- **Print**: backdrops, toasts, tooltips, popovers and menus are hidden; all shadows are removed; cards get a hairline and avoid page breaks.

## Accessibility baseline
WCAG 2.2 AA. Every interactive component: correct role/ARIA per WAI-ARIA APG, full keyboard support, visible focus, 24×24 minimum target, works at 200% zoom, respects reduced motion, usable in forced colours and RTL. Text contrast ≥ 4.5:1 (muted on bg is for meta ≥ 13px only); every accent preset is verified by `scripts/contrast.mjs`.
