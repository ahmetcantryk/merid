---
"@meridui/react": minor
"@meridui/tokens": minor
---

Merid has a new look, called Pafta after the Turkish word for a map sheet. Nothing in the component API changes, but almost every screen will look different after the upgrade, so read this before you bump.

- **Type.** Archivo replaces Geist and Chivo Mono replaces Geist Mono. Both are OFL and ship in the package as latin and latin-ext files, cut down to weight 400–600 (and width 100–125% for Archivo). The four files total 120 KB, down from 141 KB. If you linked `@meridui/react/fonts/Geist-Variable.woff2` or `GeistMono-Variable.woff2` directly, those files are gone; the new ones are `Archivo-latin.woff2`, `Archivo-latin-ext.woff2`, `ChivoMono-latin.woff2` and `ChivoMono-latin-ext.woff2`.
- **Colour.** The default accent is now magenta (`#b20965` light, `#ef86ae` dark). The neutrals lose their blue cast, and danger moves to a vermilion so it never reads as the accent. To keep the old accent, set `data-accent="blue"` on `<html>`. Blue's 600 step is a touch darker (`#3d61f2`) so it still passes AA on the new tray.
- **Two new presets**, `petrol` and `brass`. Under `brass` the warning tone moves to orange so it doesn't blend into the amber accent. Every preset passes 4.5:1 in both themes, and `contrast.mjs` now checks all seven.
- **Shape.** Corners are square-cut: 2px on controls, 3px on cards, 4px on dialogs. Badges are rectangular, avatars are square, and only the radio, switch, slider thumb and status dots stay round. To bring rounder corners back, override the `--mrd-radius-*` tokens.
- **Lines and shadows.** Tables are closed by an ink rule at the top and bottom (new `--mrd-rule` token) and their column headings are set wide in capitals at 12px. Shadows are only used on floating surfaces, and the primary button is flat.
- **Focus and press are tokens.** Every focus outline reads `--mrd-focus-color`, `--mrd-focus-width`, `--mrd-focus-style` and `--mrd-focus-offset`; fields get a 2px bottom edge through `--mrd-focus-ring` instead of a halo, and invalid fields use the new `--mrd-focus-ring-invalid`. The press effect is `--mrd-press` (down 1px) instead of a hard-coded `scale(.97)`.
- **Other new tokens:** `--mrd-font-display`, `--mrd-display-stretch`, `--mrd-title-stretch` and the `--mrd-label-*` set. Motion is a little shorter (80 / 120 / 160ms).
- **Turkish capitals.** Table headings use `text-transform: uppercase`, which follows the `lang` attribute. Set `lang="tr"` on Turkish content to get İ rather than I.

`@meridui/tokens` follows the stylesheet: the default mode is magenta, the new presets appear as modes and as Tokens Studio sets (14 themes), and focus tokens are grouped under `focus`.
