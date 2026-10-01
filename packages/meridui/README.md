<p align="center">
  <a href="https://meridui.dev"><img src="https://raw.githubusercontent.com/ahmetcantryk/merid/main/apps/docs/public/brand/logo-light.svg" alt="Merid" width="200"></a>
</p>

# meridui

The short name for [`@meridui/cli`](https://www.npmjs.com/package/@meridui/cli), so that setting up [Merid](https://www.npmjs.com/package/@meridui/react) is one short command. Run it in a Next.js, Vite or React Router project:

```bash
npx meridui init
```

It installs `@meridui/react`, imports its stylesheet, removes the CSS your project template ships that would override Merid, and can add AI rules and the MCP server config. Every file change is shown as a diff and needs a yes; `--dry-run` writes nothing.

Every command of the CLI works the same way here:

```bash
npx meridui add settings   # copy a page pattern from the docs
npx meridui mcp            # write the MCP config for Claude Code, Cursor and VS Code
npx meridui doctor         # check the setup
```

This package contains nothing but a small bin that runs `@meridui/cli`. If you only want the components, install them directly:

```bash
npm i @meridui/react
```

## Links

- Merid: [meridui.dev](https://meridui.dev), in Turkish at [meridui.dev/tr](https://meridui.dev/tr)
- CLI reference: [meridui.dev/docs/cli](https://meridui.dev/docs/cli)
- Source and issues: [github.com/ahmetcantryk/merid](https://github.com/ahmetcantryk/merid)

## License

MIT © 2026 Ahmet Can Tiryaki
