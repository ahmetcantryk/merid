import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { loadData, type MeridData } from "./data.js";
import {
  FRAMEWORKS,
  componentCategories,
  getComponent,
  getDesignContract,
  getPattern,
  getSetup,
  getTokens,
  listComponents,
  searchDocs,
  tokenCategories,
  type ToolText,
} from "./tools.js";

export type { MeridData } from "./data.js";
export { loadData } from "./data.js";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as { version: string };
export const VERSION = pkg.version;

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } as const;

const result = ({ text, isError }: ToolText) => ({ content: [{ type: "text" as const, text }], ...(isError ? { isError: true } : {}) });

/** A Merid MCP server with every tool registered. Pass `data` in tests; the default reads the bundled data.json. */
export function createMeridServer(data: MeridData = loadData()): McpServer {
  const server = new McpServer(
    { name: "merid", version: VERSION },
    {
      capabilities: { tools: {} },
      instructions:
        "Merid is a React component library (@meridui/react) with plain CSS and --mrd-* design tokens. Before writing UI, call list_components and get_component; use only documented props; style with --mrd-* tokens (get_tokens), never raw hex, arbitrary spacing or inline styles. get_design_contract returns the binding design rules.",
    },
  );

  server.registerTool(
    "list_components",
    {
      title: "List Merid components",
      description: "Lists every @meridui/react component grouped by category (Inputs, Layout, Overlay, …) with a one-line description.",
      inputSchema: z.object({
        category: z.string().optional().describe(`Only this category. One of: ${componentCategories(data).join(", ")}.`),
      }),
      annotations: READ_ONLY,
    },
    async ({ category }) => result(listComponents(data, category)),
  );

  server.registerTool(
    "get_component",
    {
      title: "Get a Merid component",
      description: "Import line, example code, props tables, keyboard interaction and accessibility notes for one component.",
      inputSchema: z.object({
        name: z.string().min(1).describe('Component name or slug, e.g. "Dialog", "dropdown-menu", "Select.Item".'),
        section: z.enum(["all", "props", "examples", "accessibility"]).default("all").describe("Return only part of the page."),
      }),
      annotations: READ_ONLY,
    },
    async ({ name, section }) => result(getComponent(data, name, section)),
  );

  server.registerTool(
    "search_docs",
    {
      title: "Search Merid docs",
      description: "Full-text search over every Merid docs page (components, foundations, integrations, patterns). Returns ranked sections with URLs.",
      inputSchema: z.object({
        query: z.string().min(1).describe('Words to search for, e.g. "dark mode toggle" or "form validation zod".'),
        limit: z.number().int().min(1).max(20).default(8),
      }),
      annotations: READ_ONLY,
    },
    async ({ query, limit }) => result(searchDocs(data, query, limit)),
  );

  const tokenCats = tokenCategories(data) as [string, ...string[]];
  server.registerTool(
    "get_tokens",
    {
      title: "Get Merid design tokens",
      description: "The --mrd-* CSS custom properties with resolved light and dark values, by category.",
      inputSchema: z.object({
        category: z.enum(tokenCats).optional().describe("Only this category. Omit for all."),
        theme: z.enum(["light", "dark", "both"]).default("both"),
      }),
      annotations: READ_ONLY,
    },
    async ({ category, theme }) => result(getTokens(data, category, theme)),
  );

  server.registerTool(
    "get_design_contract",
    {
      title: "Get the Merid design contract",
      description: "DESIGN.md (naming, colour, radius, shadow, typography and motion rules) plus the official AI rules. Pass a section heading for one part, or \"rules\" for the AI rules only.",
      inputSchema: z.object({
        section: z.string().optional().describe('An h2 of DESIGN.md such as "Principles" or "Tokens", or "rules".'),
      }),
      annotations: READ_ONLY,
    },
    async ({ section }) => result(getDesignContract(data, section)),
  );

  server.registerTool(
    "get_pattern",
    {
      title: "Get a Merid page pattern",
      description: "Guide and complete, copyable source for a page pattern: app-shell, settings, auth, data-table, forms, confirmations, empty-and-loading. Omit name to list them.",
      inputSchema: z.object({
        name: z.string().optional().describe('Pattern name, e.g. "settings" or "data-table".'),
      }),
      annotations: READ_ONLY,
    },
    async ({ name }) => result(getPattern(data, name)),
  );

  server.registerTool(
    "get_setup",
    {
      title: "Get Merid setup steps",
      description: "Install and configure @meridui/react in a Next.js (App Router), Vite or React Router project.",
      inputSchema: z.object({ framework: z.enum(FRAMEWORKS) }),
      annotations: READ_ONLY,
    },
    async ({ framework }) => result(getSetup(data, framework)),
  );

  return server;
}
