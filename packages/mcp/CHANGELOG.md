# @meridui/mcp

## 0.1.1

### Patch Changes

- The README has configs you can paste for Claude Code, Cursor and VS Code. The setup guides that `get_setup` returns now explain which template styles override Merid and how to order Tailwind's layers, because they are built from the updated installation docs.

## 0.1.0

### Minor Changes

- First release of the Merid MCP server. Run it with `npx -y @meridui/mcp` from Claude Code, Cursor, VS Code, Windsurf or any stdio MCP client. Seven read-only tools (`list_components`, `get_component`, `search_docs`, `get_tokens`, `get_design_contract`, `get_pattern`, `get_setup`) answer from docs compiled into the package: no network access, no file writes.
