# @meridui/cli

Set up [Merid](https://meridui.dev) in a Next.js, Vite or React Router project.

```bash
npx @meridui/cli init
```

- `init`: detects the framework and package manager (npm, pnpm, Yarn, Bun), installs `@meridui/react`, imports the stylesheet, and optionally adds the AI rules file (`AGENTS.md`, `.cursor/rules/merid.mdc`, `CLAUDE.md`) and MCP config (`.mcp.json`, `.cursor/mcp.json`, `.vscode/mcp.json`).
- `add <pattern>`: copies a docs pattern into your project: `app-shell`, `settings`, `auth`, `data-table`, `forms`, `confirmations`, `empty-and-loading`.
- `mcp`: writes the MCP config only.
- `doctor`: checks the setup; exits 1 when a required check fails.

Every file change is printed as a diff first, existing files are never overwritten without a yes, and `--dry-run` writes and runs nothing. No runtime dependencies.

Options: `--yes`, `--dry-run`, `--rules` / `--no-rules`, `--mcp` / `--no-mcp`, `--client claude,cursor,vscode`, `--dir <path>`, `--no-install`, `--cwd <path>`.

Docs: https://meridui.dev/docs/cli

## License

MIT
