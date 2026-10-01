<p align="center">
  <a href="https://meridui.dev"><img src="https://raw.githubusercontent.com/ahmetcantryk/merid/main/apps/docs/public/brand/logo-light.svg" alt="Merid" width="200"></a>
</p>

# @meridui/cli

Sets up [Merid](https://www.npmjs.com/package/@meridui/react), the React component library, in a Next.js, Vite or React Router project. Run it in the project folder:

```bash
npx meridui init
```

`npx @meridui/cli init` is the same command under its full name; once the package is installed, the binary is `merid`.

The CLI shows every file change as a unified diff before it writes anything, never overwrites a file without a yes, and changes nothing with `--dry-run`. Running it twice changes nothing the second time. It has no runtime dependencies and makes no network requests of its own; only your package manager does, when it installs.

## init

1. Detects the framework (Next.js App Router, Vite, React Router framework mode) and the package manager (npm, pnpm, Yarn, Bun).
2. Installs `@meridui/react`, unless it is already a dependency.
3. Adds `import "@meridui/react/styles.css"` to the app entry: `app/layout.tsx`, `src/main.tsx` or `app/root.tsx`.
4. Removes the global CSS your project template wrote that would override Merid.
5. Asks whether to add AI rules (`AGENTS.md`, `.cursor/rules/merid.mdc`, `CLAUDE.md`) and the MCP server config (`.mcp.json`, `.cursor/mcp.json`, `.vscode/mcp.json`).

Step 4 exists because the stylesheets that `create-vite`, `create-next-app` and `create-react-router` start you with sit outside any cascade layer, so they beat Merid's layered rules: the older Vite template gives every `button` a grey background, Next.js puts Arial on `body`, and its template without Tailwind sets `* { padding: 0; margin: 0 }`. `init` recognises these rules by comparing them with what each generator writes, so a rule you have edited is left alone, and it keeps harmless ones such as `body { margin: 0 }`.

When your stylesheet loads Tailwind v4, as the default Next.js and React Router templates do, `init` also adds this line to it and imports Merid after it, so that Tailwind's Preflight cannot strip the padding and borders off Merid's buttons and inputs:

```css
@layer theme, base, merid, components, utilities;
```

## Other commands

| Command | What it does |
| :-- | :-- |
| `npx meridui add <pattern>` | Copies a page pattern from the docs into your project and offers to install what it imports: `app-shell`, `settings`, `auth`, `data-table`, `forms`, `confirmations`, `empty-and-loading`. The files are yours to edit; running it again shows a diff against your copy. |
| `npx meridui mcp` | Writes only the MCP config for [`@meridui/mcp`](https://www.npmjs.com/package/@meridui/mcp). |
| `npx meridui doctor` | Checks the install, React version, stylesheet import, AI rules and MCP config, and warns about template CSS or a Tailwind layer order that overrides Merid. Exits with 1 when a required check fails, so it can run in CI. |

## Options

| Option | Effect |
| :-- | :-- |
| `-y`, `--yes` | Answer yes to every prompt, including file changes. Diffs are still printed. |
| `--dry-run` | Print the diffs and commands; write and run nothing. |
| `--rules`, `--no-rules` | `init`: add or skip the AI rules without asking. |
| `--mcp`, `--no-mcp` | `init`: add or skip the MCP config without asking. |
| `--client <list>` | `init`, `mcp`: `claude`, `cursor`, `vscode` or `all` (default), comma-separated. |
| `--dir <path>` | `add`: target folder (default `components/merid`, `src/components/merid` or `app/components/merid`). |
| `--no-install` | Print the install command instead of running it. |
| `--cwd <path>` | Run in another folder. |

In CI:

```bash
npx @meridui/cli init --yes --no-install --rules --no-mcp
npx @meridui/cli doctor
```

Requires Node.js 20 or newer.

## Links

- CLI docs: [meridui.dev/docs/cli](https://meridui.dev/docs/cli), in Turkish at [meridui.dev/tr/docs/cli](https://meridui.dev/tr/docs/cli)
- Installation guide: [meridui.dev/docs/installation](https://meridui.dev/docs/installation)
- Components: [`@meridui/react`](https://www.npmjs.com/package/@meridui/react)
- Source and issues: [github.com/ahmetcantryk/merid](https://github.com/ahmetcantryk/merid)

## License

MIT © 2026 Ahmet Can Tiryaki
