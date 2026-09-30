# @meridui/tokens

Merid's design tokens, generated from `@meridui/react/styles/tokens.css` (the single source of truth).

```bash
npm i @meridui/tokens
```

| File | Import | Contents |
|---|---|---|
| `dist/tokens.json` | `@meridui/tokens/tokens.json` | W3C Design Tokens (DTCG) format: `$value` / `$type`, grouped by `palette`, `color`, `space`, `radius`, `typography`, `shadow`, `motion`, `size`, `z`. `$value` is fully resolved for the default (light theme, blue accent, default density). Overrides for `dark`, each accent preset (`violet`, `violet-dark`, `green`, …), density (`compact`, `comfortable`), `viewport-md`, `viewport-sm` and `pointer-coarse` are in `$extensions["com.merid"].modes`. Every token carries its CSS variable name in `cssVariable`, and its source expression in `css` when it references other tokens. |
| `dist/figma-tokens.json` | `@meridui/tokens/figma-tokens.json` | Tokens Studio for Figma: sets `core`, `dark`, `accent-*`, `accent-*-dark`, `compact`, `comfortable`, `pointer-coarse`, and eight `$themes` (4 accents × light/dark). |
| `dist/index.js` + `index.d.ts` | `@meridui/tokens` | `tokens.light.accent`, `tokens.dark.accent`, `tokens["violet-dark"].accent`, … (camelCase keys, every mode complete) and `cssVar.accent === "var(--mrd-accent)"`. Fully typed. |
| `dist/tokens.css` | `@meridui/tokens/tokens.css` | Copy of the source CSS. |

```ts
import { tokens, cssVar } from "@meridui/tokens";

tokens.light.accent; // "#3f63f5"
tokens.dark.accent; // "#6b8aff"
cssVar.space4; // "var(--mrd-space-4)"
```

Prefer `cssVar` in the browser: it follows the active theme. Use the raw values for places that cannot read CSS variables (emails, native apps, canvas, Figma).

The copied `tokens.css` references the Geist fonts with `../fonts/…`, which only resolve inside `@meridui/react`. If you use React components, import `@meridui/react/tokens.css` instead.

## Scripts

- `npm run build` — parses the CSS and writes `dist/`. Fails if the `[data-theme="dark"]` and `prefers-color-scheme: dark` blocks drift apart, or a token appears in an unknown scope.
- `npm test` — `node:test`: every `--mrd-*` variable in the CSS must appear in `tokens.json`.
- `npm run typecheck` — builds, then type-checks `index.d.ts`.
