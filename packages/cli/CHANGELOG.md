# @meridui/cli

## 0.1.1

### Patch Changes

- `init` now cleans up the CSS your project template came with. The stylesheets from `create-vite`, `create-next-app` and `create-react-router` sit outside any cascade layer, so they beat Merid: the Vite template sets its own font, heading sizes and (before create-vite 9) button styles, Next.js puts Arial on `body`, and its template without Tailwind zeroes every element's padding. `init` shows the diff and removes those rules after a yes, or with `--yes`. It only touches rules that still match what the generator wrote, so anything you edited stays, and it keeps `body { margin: 0 }`.
  
  With Tailwind v4, as in the default Next.js and React Router templates, Preflight ended up layered above Merid because `init` imported Merid first, and buttons and inputs lost their padding, borders and background. `init` now imports Merid after the Tailwind stylesheet and adds `@layer theme, base, merid, components, utilities;` to it. If you set up a project with 0.1.0, run `npx meridui init` again to fix it.
  
  `doctor` warns about both. It also no longer reports `@meridui/react` as an old package name, the import it adds follows your file's quotes and semicolons, and a `CLAUDE.md` that already imports `AGENTS.md` does not get the rules a second time.

## 0.1.0

### Minor Changes

- First release of the Merid CLI (`npx @meridui/cli`, command `merid`). `init` detects Next.js, Vite or React Router and npm, pnpm, Yarn or Bun, installs `@meridui/react`, imports the stylesheet and optionally adds AI rules (AGENTS.md, `.cursor/rules/merid.mdc`, CLAUDE.md) and MCP config. `add <pattern>` copies docs patterns, `mcp` writes MCP config, `doctor` checks the setup. Every change is shown as a diff first; `--dry-run` writes nothing.
