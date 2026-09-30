// Pure text transforms: stylesheet import, rules sections and MCP config merges. No I/O.
import { MCP_PACKAGE, STYLES_IMPORT } from "./data.js";

export const MARK_START = "<!-- merid:start -->";
export const MARK_END = "<!-- merid:end -->";

const EOL = (text: string) => (text.includes("\r\n") ? "\r\n" : "\n");

/** True when the file already imports Merid's stylesheet (any entry: styles, components or tokens). */
export function hasStylesImport(source: string): boolean {
  return /["']@meridui\/react\/(styles|components|tokens)\.css["']/.test(source);
}

/**
 * Adds `import "@meridui/react/styles.css";` before the first CSS import (so app CSS keeps winning in
 * source order), otherwise after the last import, otherwise after a "use client" directive, otherwise first.
 */
export function addStylesImport(source: string): string {
  if (hasStylesImport(source)) return source;
  const eol = EOL(source);
  const line = `import "${STYLES_IMPORT}";`;
  const lines = source.split(/\r?\n/);
  const isImport = (l: string) => /^import\s/.test(l);
  const cssAt = lines.findIndex((l) => isImport(l) && /\.css["'];?\s*$/.test(l));
  if (cssAt !== -1) return [...lines.slice(0, cssAt), line, ...lines.slice(cssAt)].join(eol);
  let lastImport = -1;
  for (let i = 0; i < lines.length; i += 1) {
    const l = lines[i] ?? "";
    if (isImport(l)) {
      // multi-line import: advance to the line with `from "…"` or the closing quote
      let j = i;
      while (j < lines.length && !/["'];?\s*$/.test(lines[j] ?? "")) j += 1;
      lastImport = j;
      i = j;
    }
  }
  if (lastImport !== -1) return [...lines.slice(0, lastImport + 1), line, ...lines.slice(lastImport + 1)].join(eol);
  const directive = lines.findIndex((l) => /^["']use (client|server)["'];?\s*$/.test(l));
  if (directive !== -1) return [...lines.slice(0, directive + 1), "", line, ...lines.slice(directive + 1)].join(eol);
  return [line, ...lines].join(eol);
}

/** Inserts or replaces the Merid section (between markers) in a Markdown file such as AGENTS.md or CLAUDE.md. */
export function upsertSection(existing: string | undefined, body: string): string {
  const section = `${MARK_START}\n${body.trim()}\n${MARK_END}`;
  if (existing === undefined || existing.trim() === "") return `${section}\n`;
  const eol = EOL(existing);
  const start = existing.indexOf(MARK_START);
  const end = existing.indexOf(MARK_END);
  const normalized = section.replace(/\n/g, eol);
  if (start !== -1 && end > start) return existing.slice(0, start) + normalized + existing.slice(end + MARK_END.length);
  const trimmed = existing.replace(/\s+$/, "");
  return `${trimmed}${eol}${eol}${normalized}${eol}`;
}

/** Cursor project rule (.cursor/rules/merid.mdc): attached for UI files. */
export function cursorRule(rules: string): string {
  return [
    "---",
    "description: Merid UI rules. Use @meridui/react components and --mrd-* tokens; no raw hex, arbitrary spacing or inline styles.",
    'globs: "**/*.{tsx,jsx,ts,js,css,scss,mdx}"',
    "alwaysApply: false",
    "---",
    "",
    rules.trim(),
    "",
  ].join("\n");
}

export type McpClient = "claude" | "cursor" | "vscode";
export const MCP_CLIENTS: readonly McpClient[] = ["claude", "cursor", "vscode"];

export const MCP_FILES: Readonly<Record<McpClient, string>> = {
  claude: ".mcp.json",
  cursor: ".cursor/mcp.json",
  vscode: ".vscode/mcp.json",
};

export const MCP_CLIENT_NAMES: Readonly<Record<McpClient, string>> = {
  claude: "Claude Code",
  cursor: "Cursor",
  vscode: "VS Code",
};

const NPX_ARGS = ["-y", MCP_PACKAGE];

/** The server entry each client expects. Claude Code and VS Code take `type: "stdio"`; Cursor infers it. */
export function mcpEntry(client: McpClient): Record<string, unknown> {
  return client === "cursor" ? { command: "npx", args: NPX_ARGS } : { type: "stdio", command: "npx", args: NPX_ARGS };
}

const rootKey = (client: McpClient) => (client === "vscode" ? "servers" : "mcpServers");

export class InvalidConfigError extends Error {}

/** Merges the `merid` server into an existing config (other servers and keys are kept). Throws InvalidConfigError on unparsable JSON. */
export function mergeMcpConfig(existing: string | undefined, client: McpClient): string {
  let config: Record<string, unknown> = {};
  if (existing !== undefined && existing.trim() !== "") {
    try {
      const parsed: unknown = JSON.parse(existing);
      if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
      config = parsed as Record<string, unknown>;
    } catch (error) {
      throw new InvalidConfigError(
        `${MCP_FILES[client]} is not plain JSON (${error instanceof Error ? error.message : "parse error"}). Add the server by hand: ${JSON.stringify({ [rootKey(client)]: { merid: mcpEntry(client) } })}`,
      );
    }
  }
  const key = rootKey(client);
  const servers = (config[key] && typeof config[key] === "object" ? config[key] : {}) as Record<string, unknown>;
  const next = { ...config, [key]: { ...servers, merid: mcpEntry(client) } };
  return `${JSON.stringify(next, null, 2)}\n`;
}

/** True when a config file already registers the Merid server. */
export function hasMcpServer(text: string | undefined, client: McpClient): boolean {
  if (!text) return false;
  try {
    const parsed = JSON.parse(text) as Record<string, Record<string, unknown> | undefined>;
    return Boolean(parsed[rootKey(client)]?.merid);
  } catch {
    return text.includes(MCP_PACKAGE);
  }
}

/** Pattern source with its CSS import added when the pattern ships CSS. */
export function patternSource(source: string, cssFile: string | undefined): string {
  if (!cssFile) return source;
  const lines = source.split("\n");
  let at = /^["']use client["'];?\s*$/.test(lines[0] ?? "") ? 1 : 0;
  while (at > 0 && at < lines.length && lines[at]?.trim() === "") at += 1;
  const head = lines.slice(0, at);
  return [...head, ...(at > 0 && head.at(-1)?.trim() !== "" ? [""] : []), `import "./${cssFile}";`, ...lines.slice(at)].join("\n");
}
