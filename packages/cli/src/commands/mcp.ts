import { applyChanges, readIfExists, type Change } from "../changes.js";
import { InvalidConfigError, MCP_CLIENTS, MCP_CLIENT_NAMES, MCP_FILES, mergeMcpConfig, type McpClient } from "../content.js";
import { MCP_PACKAGE } from "../data.js";
import type { Context } from "./context.js";

export function parseClients(values: readonly string[] | undefined): McpClient[] {
  if (!values || values.length === 0 || values.includes("all")) return [...MCP_CLIENTS];
  const aliases: Record<string, McpClient> = { claude: "claude", "claude-code": "claude", cursor: "cursor", vscode: "vscode", "vs-code": "vscode", code: "vscode" };
  return values.map((v) => {
    const client = aliases[v.toLowerCase()];
    if (!client) throw new Error(`Unknown MCP client "${v}". Use claude, cursor, vscode or all.`);
    return client;
  });
}

/** Planned MCP config changes; configs that cannot be parsed are reported and left alone. */
export function mcpChanges(ctx: Context, clients: readonly McpClient[]): Change[] {
  const changes: Change[] = [];
  for (const client of clients) {
    const file = MCP_FILES[client];
    try {
      const after = mergeMcpConfig(readIfExists(ctx.cwd, file), client);
      changes.push({ file, after, reason: `${MCP_CLIENT_NAMES[client]} MCP server (npx -y ${MCP_PACKAGE})` });
    } catch (error) {
      if (!(error instanceof InvalidConfigError)) throw error;
      ctx.io.warn(error.message);
    }
  }
  return changes;
}

export function printOtherClients(ctx: Context): void {
  ctx.io.log(
    [
      "",
      "Other clients:",
      `  Claude Code (user scope): claude mcp add --transport stdio merid -- npx -y ${MCP_PACKAGE}`,
      `  Windsurf: add { "mcpServers": { "merid": { "command": "npx", "args": ["-y", "${MCP_PACKAGE}"] } } } to its mcp_config.json`,
    ].join("\n"),
  );
}

export async function mcpCommand(ctx: Context): Promise<number> {
  const clients = parseClients(ctx.flags.clients);
  ctx.io.log(`Writing the Merid MCP server for ${clients.map((c) => MCP_CLIENT_NAMES[c]).join(", ")}.`);
  await applyChanges(mcpChanges(ctx, clients), { root: ctx.cwd, io: ctx.io, yes: ctx.flags.yes, dryRun: ctx.flags.dryRun });
  printOtherClients(ctx);
  if (ctx.flags.dryRun) ctx.io.log("\nDry run: nothing was written.");
  return 0;
}
