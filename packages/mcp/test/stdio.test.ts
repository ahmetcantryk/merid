// End-to-end: spawns the built server (dist/index.js) and talks to it with the official MCP client over stdio.
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

const entry = fileURLToPath(new URL("../dist/index.js", import.meta.url));

interface TextResult {
  content: { type: string; text?: string }[];
  isError?: boolean;
}

const textOf = (res: unknown) => ((res as TextResult).content[0]?.text ?? "");

describe("stdio server", () => {
  const client = new Client({ name: "merid-mcp-test", version: "0.0.0" });
  const transport = new StdioClientTransport({ command: process.execPath, args: [entry], stderr: "pipe" });

  beforeAll(async () => {
    await client.connect(transport);
  }, 20_000);

  afterAll(async () => {
    await client.close();
  });

  it("lists the seven read-only tools", async () => {
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual([
      "get_component",
      "get_design_contract",
      "get_pattern",
      "get_setup",
      "get_tokens",
      "list_components",
      "search_docs",
    ]);
    for (const tool of tools) expect(tool.annotations?.readOnlyHint, tool.name).toBe(true);
  });

  it("calls every tool", async () => {
    expect(textOf(await client.callTool({ name: "list_components", arguments: {} }))).toContain("## Overlay");
    expect(textOf(await client.callTool({ name: "get_component", arguments: { name: "Button" } }))).toContain("leadingIcon");
    expect(textOf(await client.callTool({ name: "search_docs", arguments: { query: "dark mode" } }))).toContain("Dark mode");
    expect(textOf(await client.callTool({ name: "get_tokens", arguments: { category: "space" } }))).toContain("--mrd-space-4");
    expect(textOf(await client.callTool({ name: "get_design_contract", arguments: { section: "Principles" } }))).toContain("One accent");
    expect(textOf(await client.callTool({ name: "get_pattern", arguments: { name: "settings" } }))).toContain("SettingsPageExample");
    expect(textOf(await client.callTool({ name: "get_setup", arguments: { framework: "vite" } }))).toContain("Vite");
  });

  it("reports unknown names as tool errors", async () => {
    const res = (await client.callTool({ name: "get_component", arguments: { name: "Carousel" } })) as TextResult;
    expect(res.isError).toBe(true);
  });

  it("rejects invalid arguments", async () => {
    const res = (await client
      .callTool({ name: "get_setup", arguments: { framework: "angular" } })
      .catch((error: unknown) => ({ content: [{ type: "text", text: String(error) }], isError: true }))) as TextResult;
    expect(res.isError).toBe(true);
  });
});
