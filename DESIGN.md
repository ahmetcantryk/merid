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

## Principles

1. **One accent, used sparingly.** A single cool blue carries interactivity and selection. Everything else is ink-tinted neutrals.
2. **Separate by surface before border.** Cards sit on `--mrd-tray` over the page; on a tray section they flip to surface + soft shadow. Borders are the last resort.
3. **Hairlines only.** Every border is 1px `--mrd-line`. Selection is a 1.5px accent ring. Never 2px, never dark borders.
4. **Soft, long, faint shadows**, always tinted with ink `rgba(15,18,25,…)`, never black. The only saturated shadow is the primary button glow.
5. **Generous, consistent rounding** that steps down when nested: 20 → 14 → 12 → 8.
6. **Tight large headings, relaxed body.** Headings 600 with negative tracking and `text-wrap: balance`; body 1.6. Weight 700 is never used.
7. **Three text tones** — `ink`, `body`, `muted`. Hierarchy from tone and weight, not colour.
8. **Quiet interaction.** Hover = background tint or 2–3px lift; press = `scale(.97)`; 150–200ms. `prefers-reduced-motion` removes all motion.
9. **Air.** Big section padding, wide gaps, content capped at 1160px, reading width ≤ 720px.
10. **At most one filled colour block per page.** No gradients (skeleton shimmer is the only exception).

## Tokens

### Colour — light (default) / dark (`[data-theme="dark"]` and `prefers-color-scheme: dark` unless `[data-theme="light"]`)

| Token | Light | Dark | Role |
|---|---|---|---|
| `--mrd-accent` | `#3f63f5` | `#6b8aff` | interactive, selection, focus |
| `--mrd-accent-hover` | `#3355e6` | `#8aa2ff` | hover of accent and links |
| `--mrd-accent-soft` | `#eef1ff` | `rgba(107,138,255,.14)` | tint: selected row, icon tile, info |
| `--mrd-accent-strong` | `#2c46b8` | `#a9bbff` | text on accent-soft |
| `--mrd-accent-solid` / `-hover` | `#3f63f5` / `#3355e6` | `#4466f0` / `#3a58dc` | fills that carry on-accent text (AA ≥ 4.5:1) |
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
| `--mrd-muted` | `#6b7280` | `#858c98` | meta, icons |
| `--mrd-placeholder` | `#b0b5be` | `#565d69` | input placeholder |
| `--mrd-control-off` | `#d7dbe2` | `#343a46` | switch off |
| `--mrd-danger` | `#e5484d` | `#ff6369` | invalid border, danger fill |
| `--mrd-danger-soft` / `-strong` | `#fff0f0` / `#b42318` | `rgba(229,72,77,.12)` / `#ff8a8e` | error notice |
| `--mrd-warning-soft` / `-strong` | `#fff8eb` / `#93580a` | `rgba(245,166,35,.12)` / `#f5c46b` | warning notice |
| `--mrd-success` | `#1f9d63` | `#3ecf8e` | success icon/dot only |
| `--mrd-success-soft` / `-strong` | `#ecf8f1` / `#17744a` | `rgba(62,207,142,.12)` / `#7ee2b0` | success notice |
| `--mrd-tooltip-bg` / `-fg` | `#0f1219` / `#ffffff` | `#eef0f4` / `#0f1219` | tooltip |

### Radius
`--mrd-radius-xs 6px` (focus ring, skeleton, inline code) · `--mrd-radius-sm 8px` · `--mrd-radius-md 10px` (icon button, menu item, nav link) · `--mrd-radius-lg 12px` (button, input, alert, row) · `--mrd-radius-xl 14px` (window frame, popover) · `--mrd-radius-2xl 16px` (menu, mobile card) · `--mrd-radius-card 20px` (card, panel, dialog) · `--mrd-radius-3xl 24px` (CTA block) · `--mrd-radius-full 999px` (pill, badge, switch, avatar).

### Shadow (all ink-tinted)
| Token | Value |
|---|---|
| `--mrd-shadow-xs` | `0 1px 3px rgba(15,18,25,.10)` — selected pill chip |
| `--mrd-shadow-sm` | `0 2px 6px rgba(15,18,25,.05)` — icon tile |
| `--mrd-shadow-md` | `0 12px 32px rgba(15,18,25,.06)` — card lift |
| `--mrd-shadow-lg` | `0 10px 28px rgba(15,18,25,.10)` — popover, toast, tooltip |
| `--mrd-shadow-xl` | `0 16px 40px rgba(15,18,25,.10)` — menu |
| `--mrd-shadow-2xl` | `0 24px 64px rgba(15,18,25,.18)` — dialog |
| `--mrd-shadow-accent` | `0 8px 20px rgba(71,108,255,.28)` — primary button |
| `--mrd-focus-ring` | `0 0 0 4px rgba(71,108,255,.12)` — input focus halo |

In dark mode shadows become `rgba(0,0,0,.4–.6)` and elevated surfaces add `0 0 0 1px var(--mrd-line)`.

### Typography
Font: Inter Variable (bundled, OFL), `font-feature-settings: "cv11","ss01"`, antialiased, `tabular-nums` on every number. Mono: `ui-monospace, SFMono-Regular, Menlo, monospace`.

| Token | Size / line-height / tracking | Use |
|---|---|---|
| `--mrd-text-display` | `clamp(40px,6vw,72px)` / 1.05 / -0.04em | hero h1 |
| `--mrd-text-h2` | `clamp(30px,3.6vw,40px)` / 1.1 / -0.03em | section title |
| `--mrd-text-h3` | 20px / 1.3 / -0.015em | card title |
| `--mrd-text-lg` | 18px / 1.6 | lead |
| `--mrd-text-md` | 16px / 1.6 | body |
| `--mrd-text-sm` | 15px / 1.5 | button, input, nav, list |
| `--mrd-text-xs` | 14px / 1.45 | small button, label, pill |
| `--mrd-text-2xs` | 13px / 1.4 | meta, helper, notes |
| `--mrd-text-3xs` | 12px / 1.3 | badge, caption |

Weights: `--mrd-weight-regular 400`, `--mrd-weight-medium 500` (all UI), `--mrd-weight-semibold 600` (headings, prices).

### Spacing (4/8 base)
`--mrd-space-1 4px` · `2 8px` · `3 12px` · `4 16px` · `5 20px` · `6 24px` · `7 28px` · `8 32px` · `10 40px` · `14 56px` · `16 64px` · `18 72px` · `28 112px`.
Layout: `--mrd-container 1160px`, `--mrd-gutter 24px` (20px ≤ 640px), `--mrd-section 112px` (80px ≤ 920px, 64px ≤ 640px), `--mrd-prose 720px`.

### Control sizes
| | sm | md (default) | lg |
|---|---|---|---|
| Button height / padding / font | 36 / 0 14px / 14 | 44 / 0 18px / 15 | 50 / 0 22px / 16 |
| Input height | 36 | 46 | 50 |
| Icon button | 32 | 36 | 40 |
| Pill (segmented) | — | 34 | — |
On coarse pointers (`@media (pointer: coarse)`) md button → 48, input → 50, pill → 40.

### Motion
`--mrd-duration-fast 100ms` (press) · `--mrd-duration 150ms` (colour/border/shadow) · `--mrd-duration-slow 200ms` (lift, rotate, overlay) · `--mrd-ease cubic-bezier(.2,0,0,1)`. Enter animation `fade`: opacity 0 → 1, `translateY(4px)` → 0, 220ms.

### Breakpoints and layers
Breakpoints (used in CSS only): 640 (mobile pass), 920 (layout collapse). Z-index: `--mrd-z-sticky 50` · `--mrd-z-overlay 100` · `--mrd-z-toast 110` · `--mrd-z-tooltip 120`.

## Component specifics (the signature details)

- **Button**: variants `primary` (accent fill + accent shadow), `secondary` (surface + 1px line, hover tray), `ghost` (transparent, hover tray), `danger`, `link`. Press `scale(.97)`. Loading shows spinner and keeps width.
- **Focus**: `outline: 2px solid var(--mrd-accent); outline-offset: 3px; border-radius: var(--mrd-radius-xs)` on `:focus-visible`. Inputs use border-accent + `--mrd-focus-ring` instead.
- **Input**: surface fill, 1px line, radius lg, `aria-invalid` → danger border.
- **Checkbox**: 18px, radius 5px, 1px line; checked = accent fill + white 1.6-stroke check. **Radio**: 18px circle, accent dot. **Switch**: 34×20, off `--mrd-control-off`, on accent, knob shadow-xs.
- **SegmentedControl**: tray track radius full, padding 4px; selected chip = surface + shadow-xs, ink text.
- **Tabs (line)**: 1px line baseline; active = ink text + 1.5px accent underline.
- **Card**: tray fill, radius card, padding 28px; `variant="elevated"` = surface + shadow-md; interactive cards lift 3px on hover.
- **Selectable row / card**: selected = `box-shadow: inset 0 0 0 1.5px var(--mrd-accent)`.
- **Badge**: 22px tall, radius full, 12px/500; tones `neutral` (tray/body), `accent` (accent-soft/accent-strong), `success`, `warning`, `danger`, `solid` (accent/on-accent).
- **Menu / Popover / Select list**: surface, 1px line, radius 2xl (menu) or xl (popover), padding 8px, shadow-xl; items 10px 12px radius md, hover tray.
- **Tooltip**: tooltip-bg/fg, 13px, radius sm, padding 6px 10px, shadow-lg, 150ms fade, no arrow.
- **Dialog**: surface, radius card, padding 32px, shadow-2xl, backdrop `rgba(15,18,25,.4)`; ≤ 640px becomes a bottom sheet (radius on top corners only).
- **Toast**: surface, 1px line, radius lg, shadow-lg, leading status dot, bottom-right stack.
- **Table**: 1px line ring radius lg, header `--mrd-subtle` 12px/500 muted, 1px row lines, tabular nums, row hover tray, selected accent-soft.
- **Skeleton**: tray → tray-2 → tray gradient, radius xs, 1.4s shimmer (none under reduced motion).
- **Accordion**: rows split by 1px line, plus icon rotates 45° and turns accent when open.

## Accessibility baseline
WCAG 2.2 AA. Every interactive component: correct role/ARIA per WAI-ARIA APG, full keyboard support, visible focus, 24×24 minimum target, works at 200% zoom, respects reduced motion. Text contrast ≥ 4.5:1 (muted on bg is for meta ≥ 13px only).
