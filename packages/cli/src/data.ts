import { readFileSync } from "node:fs";

export interface Pattern {
  readonly slug: string;
  readonly aliases: readonly string[];
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly file: string;
  readonly source: string;
  readonly css: string;
  readonly dependencies: readonly string[];
}

export interface CliData {
  readonly schema: number;
  readonly rules: string;
  readonly patterns: readonly Pattern[];
}

export const REACT_PACKAGE = "@meridui/react";
export const MCP_PACKAGE = "@meridui/mcp";
export const STYLES_IMPORT = `${REACT_PACKAGE}/styles.css`;

/** Rules and patterns compiled into the package at build time. */
export function loadData(url: URL = new URL("./data.json", import.meta.url)): CliData {
  let raw: string;
  try {
    raw = readFileSync(url, "utf8");
  } catch (error) {
    throw new Error(`bundled data not found at ${url.pathname}; reinstall @meridui/cli`, { cause: error });
  }
  const data = JSON.parse(raw) as CliData;
  if (data.schema !== 1 || typeof data.rules !== "string" || !Array.isArray(data.patterns)) {
    throw new Error("bundled data has an unexpected shape; reinstall @meridui/cli");
  }
  return data;
}

const norm = (s: string) => s.toLowerCase().replace(/[\s_.-]+/g, "");

export function findPattern(data: CliData, name: string): Pattern | undefined {
  const key = norm(name);
  return data.patterns.find((p) => norm(p.slug) === key || p.aliases.some((a) => norm(a) === key));
}
