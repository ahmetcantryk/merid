# @meridui/cli

## 0.1.0

### Minor Changes

- First release of the Merid CLI (`npx @meridui/cli`, command `merid`). `init` detects Next.js, Vite or React Router and npm, pnpm, Yarn or Bun, installs `@meridui/react`, imports the stylesheet and optionally adds AI rules (AGENTS.md, `.cursor/rules/merid.mdc`, CLAUDE.md) and MCP config. `add <pattern>` copies docs patterns, `mcp` writes MCP config, `doctor` checks the setup. Every change is shown as a diff first; `--dry-run` writes nothing.
