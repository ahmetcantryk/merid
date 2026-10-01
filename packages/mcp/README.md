<p align="center">
  <a href="https://meridui.dev"><img src="https://raw.githubusercontent.com/ahmetcantryk/merid/main/apps/docs/public/brand/logo-light.svg" alt="Merid" width="200"></a>
</p>

# @meridui/mcp

A Model Context Protocol server for [Merid](https://www.npmjs.com/package/@meridui/react), the React component library. It lets Claude Code, Cursor, VS Code and other MCP clients look up Merid's real API while they write code: components, props, examples, keyboard and accessibility notes, `--mrd-*` tokens with light and dark values, page patterns and framework setup. An agent that can call `get_component` for `Select` does not have to guess its prop names.

The server is read-only and works offline. The docs are compiled into the package when it is built, so it makes no network requests and writes no files. It runs over stdio with `npx`, so there is nothing to install globally.

## Set up

### Claude Code

```bash
claude mcp add --scope project --transport stdio merid -- npx -y @meridui/mcp
```

This writes `.mcp.json` in the project, which you can also create by hand:

```json
{
  "mcpServers": {
    "merid": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@meridui/mcp"]
    }
  }
}
```

### Cursor

`.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "merid": {
      "command": "npx",
      "args": ["-y", "@meridui/mcp"]
    }
  }
}
```

### VS Code

`.vscode/mcp.json` (VS Code uses `servers`, not `mcpServers`):

```json
{
  "servers": {
    "merid": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@meridui/mcp"]
    }
  }
}
```

### Windsurf and other clients

Most clients accept the Cursor format above; in Windsurf it goes in `mcp_config.json`.

To write the Claude Code, Cursor and VS Code files in one go, run `npx meridui mcp` in the project. It keeps any other servers already in those files.

## Tools

| Tool | Input | Returns |
| :-- | :-- | :-- |
| `list_components` | `category?` | Components grouped by category |
| `get_component` | `name`, `section?` | Import line, examples, props, keyboard and accessibility notes |
| `search_docs` | `query`, `limit?` | Ranked docs sections with links |
| `get_tokens` | `category?`, `theme?` | `--mrd-*` tokens with light and dark values |
| `get_design_contract` | `section?` | Merid's design rules and the rules for AI agents |
| `get_pattern` | `name?` | A page pattern's guide and full source |
| `get_setup` | `framework` | Setup steps for `next`, `vite` or `react-router` |

Requires Node.js 20 or newer.

## Without MCP

The same content is published for any tool that reads plain text: [meridui.dev/llms.txt](https://meridui.dev/llms.txt) and [llms-full.txt](https://meridui.dev/llms-full.txt). [`@meridui/cli`](https://www.npmjs.com/package/@meridui/cli) can add an `AGENTS.md` section and a Cursor rule with the same design rules.

## Links

- Using Merid with AI: [meridui.dev/docs/ai](https://meridui.dev/docs/ai)
- Components: [`@meridui/react`](https://www.npmjs.com/package/@meridui/react)
- Source and issues: [github.com/ahmetcantryk/merid](https://github.com/ahmetcantryk/merid)

## License

MIT © 2026 Ahmet Can Tiryaki
