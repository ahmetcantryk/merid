<p align="center">
  <a href="https://meridui.dev"><img src="https://raw.githubusercontent.com/ahmetcantryk/merid/main/apps/docs/public/brand/logo-light.svg" alt="Merid" width="200"></a>
</p>

# @meridui/tokens

The design tokens of [Merid](https://www.npmjs.com/package/@meridui/react), the React component library, for code that cannot read Merid's CSS: W3C Design Tokens (DTCG) JSON, typed JavaScript, a Tokens Studio file for Figma and the source CSS. Colour, spacing, radius, type, shadow, motion, sizes and layers, with the values for every theme, accent and density.

If you use Merid's React components you already have the tokens as `--mrd-*` CSS custom properties through `@meridui/react/styles.css`. Install this package when you need the same values somewhere else: an email template, a canvas chart, a native app, a Style Dictionary pipeline or a Figma library.

```bash
npm i @meridui/tokens
```

## JavaScript

```ts
import { cssVar, tokens } from "@meridui/tokens";

tokens.light.accent;           // "#3f63f5"
tokens.dark.accent;            // "#6b8aff"
tokens["violet-dark"].accent;  // "#9d85ff"
cssVar.space4;                 // "var(--mrd-space-4)"
```

`tokens` has one complete set of values per mode, with camelCase keys: `light`, `dark`, the accent presets (`violet`, `green`, `graphite` and their `-dark` variants), the densities (`compact`, `comfortable`), `viewport-md`, `viewport-sm` and `pointer-coarse`. Everything is typed.

In the browser, prefer `cssVar`: `var(--mrd-accent)` follows the active theme, a raw hex value does not. Use the raw values where CSS variables cannot reach.

## Files

| Import | Contents |
| :-- | :-- |
| `@meridui/tokens` | `tokens` and `cssVar`, as above, with type declarations. |
| `@meridui/tokens/tokens.json` | DTCG format (`$value`, `$type`), grouped as `palette`, `color`, `space`, `radius`, `typography`, `shadow`, `motion`, `size` and `z`. `$value` is resolved for the default mode (light, blue accent, default density); the other modes are under `$extensions["com.merid"].modes`. Each token also records its CSS variable name. |
| `@meridui/tokens/figma-tokens.json` | Tokens Studio for Figma: a `core` set, sets for dark, each accent and each density, and eight themes (four accents in light and dark). |
| `@meridui/tokens/tokens.css` | A copy of Merid's token stylesheet. |

The copied `tokens.css` loads the Geist fonts with `../fonts/…`, which only resolves inside `@meridui/react`. With the React components, import `@meridui/react/tokens.css` instead.

## Tailwind

To use Merid's colours and radii as Tailwind utilities, map the CSS variables with `@theme inline`; `cssVar` gives you the same names if you generate the theme in JavaScript. See the [Tailwind guide](https://meridui.dev/docs/integrations/tailwind).

## Links

- Token reference and usage: [meridui.dev/docs/integrations/design-tokens](https://meridui.dev/docs/integrations/design-tokens)
- Components: [`@meridui/react`](https://www.npmjs.com/package/@meridui/react)
- Source and issues: [github.com/ahmetcantryk/merid](https://github.com/ahmetcantryk/merid)

The tokens are generated from `packages/react/styles/tokens.css` in the repository, which is the single source of truth; the build fails if the light and dark blocks drift apart.

## License

MIT © 2026 Ahmet Can Tiryaki
