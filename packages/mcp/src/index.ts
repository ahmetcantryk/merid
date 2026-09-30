#!/usr/bin/env node
// stdio entry: `npx -y @meridui/mcp`. Logs go to stderr; stdout carries only MCP messages.
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createMeridServer, loadData } from "./server.js";

try {
  const data = loadData();
  serveStdio(() => createMeridServer(data), {
    onerror: (error) => console.error("[merid-mcp]", error.message),
  });
} catch (error) {
  console.error("[merid-mcp] failed to start:", error instanceof Error ? error.message : error);
  process.exit(1);
}
