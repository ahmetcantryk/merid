import { readFileSync } from "node:fs";

export interface CodeExample {
  readonly lang: string;
  readonly code: string;
}

export interface ComponentDoc {
  readonly name: string;
  readonly slug: string;
  readonly category: string;
  readonly status: string;
  readonly description: string;
  readonly summary: string;
  readonly url: string;
  readonly import: string;
  readonly api: string;
  readonly examples: readonly CodeExample[];
  readonly keyboard: string;
  readonly accessibility: string;
  readonly styling: string;
  readonly guidelines: string;
  readonly markdown: string;
}

export interface TokenDoc {
  readonly name: string;
  readonly category: string;
  readonly type: string;
  readonly light: string;
  readonly dark: string;
}

export interface PatternDoc {
  readonly slug: string;
  readonly aliases: readonly string[];
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly file: string;
  readonly source: string;
  readonly css: string;
  readonly dependencies: readonly string[];
  readonly markdown: string;
}

export interface SetupDoc {
  readonly framework: string;
  readonly title: string;
  readonly url: string;
  readonly markdown: string;
  readonly installation: string;
}

export interface PageDoc {
  readonly href: string;
  readonly url: string;
  readonly group: string;
  readonly navTitle: string;
  readonly title: string;
  readonly description: string;
  readonly markdown: string;
}

export interface MeridData {
  readonly schema: number;
  readonly site: string;
  readonly reactVersion: string;
  readonly rules: string;
  readonly designContract: string;
  readonly components: readonly ComponentDoc[];
  readonly tokens: readonly TokenDoc[];
  readonly patterns: readonly PatternDoc[];
  readonly setups: readonly SetupDoc[];
  readonly pages: readonly PageDoc[];
}

/** Reads the data compiled into the package at build time (dist/data.json next to this file). */
export function loadData(url: URL = new URL("./data.json", import.meta.url)): MeridData {
  let raw: string;
  try {
    raw = readFileSync(url, "utf8");
  } catch (error) {
    throw new Error(`@meridui/mcp: bundled data not found at ${url.pathname}. Reinstall the package or run "npm run build".`, {
      cause: error,
    });
  }
  const data = JSON.parse(raw) as MeridData;
  if (data.schema !== 1 || !Array.isArray(data.components)) {
    throw new Error("@meridui/mcp: bundled data has an unexpected shape.");
  }
  return data;
}
