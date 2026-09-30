# @meridui/mcp

MCP server for [Merid](https://meridui.dev), the React component library. It gives coding agents the real docs: components, props, examples, keyboard and accessibility notes, `--mrd-*` tokens, page patterns and setup steps.

Read-only and offline: the docs are compiled into the package at build time, so the server makes no network requests and writes no files.

## Set up

Claude Code:

```bash
claude mcp add --scope project --transport stdio merid -- npx -y @meridui/mcp
```

Cursor (`.cursor/mcp.json`), Windsurf (`mcp_config.json`) and most clients:

```json
{ "mcpServers": { "merid": { "command": "npx", "args": ["-y", "@meridui/mcp"] } } }
```

VS Code (`.vscode/mcp.json`):

```json
{ "servers": { "merid": { "type": "stdio", "command": "npx", "args": ["-y", "@meridui/mcp"] } } }
```

Or let the CLI write them: `npx @meridui/cli mcp`.

## Tools

| Tool | Input | Returns |
| --- | --- | --- |
| `list_components` | `category?` | Components grouped by category |
| `get_component` | `name`, `section?` | Import, examples, props, keyboard, accessibility |
| `search_docs` | `query`, `limit?` | Ranked docs sections with links |
| `get_tokens` | `category?`, `theme?` | `--mrd-*` tokens with light and dark values |
| `get_design_contract` | `section?` | The design contract and the AI rules |
| `get_pattern` | `name?` | Pattern guide and full source |
| `get_setup` | `framework` | Setup for `next`, `vite` or `react-router` |

Requires Node.js 20 or newer. Docs: https://meridui.dev/docs/ai

## License

MIT
