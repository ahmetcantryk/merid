import { describe, expect, it } from "vitest";
import {
  InvalidConfigError,
  MARK_END,
  MARK_START,
  addStylesImport,
  cursorRule,
  hasMcpServer,
  mergeMcpConfig,
  patternSource,
  upsertSection,
} from "../src/content.js";
import { unifiedDiff } from "../src/diff.js";
import { parseArgs, UsageError } from "../src/args.js";

const IMPORT = 'import "@meridui/react/styles.css";';

describe("addStylesImport", () => {
  it("goes before the first CSS import so app CSS still wins", () => {
    const out = addStylesImport('import type { X } from "y";\nimport "./globals.css";\n');
    expect(out).toBe(`import type { X } from "y";\n${IMPORT}\nimport "./globals.css";\n`);
  });

  it("goes after the last import, including multi-line imports", () => {
    const out = addStylesImport('import {\n  a,\n  b,\n} from "x";\n\nexport const c = 1;\n');
    expect(out).toBe(`import {\n  a,\n  b,\n} from "x";\n${IMPORT}\n\nexport const c = 1;\n`);
  });

  it("goes after a use client directive, or first", () => {
    expect(addStylesImport('"use client";\nexport {};\n')).toBe(`"use client";\n\n${IMPORT}\nexport {};\n`);
    expect(addStylesImport("export {};\n")).toBe(`${IMPORT}\nexport {};\n`);
  });

  it("is idempotent and keeps CRLF", () => {
    const once = addStylesImport('import "./a.css";\r\n');
    expect(once).toBe(`${IMPORT}\r\nimport "./a.css";\r\n`);
    expect(addStylesImport(once)).toBe(once);
    expect(addStylesImport('import "@meridui/react/components.css";')).toBe('import "@meridui/react/components.css";');
  });
});

describe("upsertSection", () => {
  it("creates, appends and replaces between markers", () => {
    expect(upsertSection(undefined, "A")).toBe(`${MARK_START}\nA\n${MARK_END}\n`);
    const appended = upsertSection("# Notes\n\nmine\n", "A");
    expect(appended).toBe(`# Notes\n\nmine\n\n${MARK_START}\nA\n${MARK_END}\n`);
    const replaced = upsertSection(appended, "B");
    expect(replaced).toBe(`# Notes\n\nmine\n\n${MARK_START}\nB\n${MARK_END}\n`);
    expect(upsertSection(replaced, "B")).toBe(replaced);
  });
});

describe("cursorRule", () => {
  it("has Cursor rule frontmatter", () => {
    const rule = cursorRule("# Rules\n");
    expect(rule.startsWith("---\ndescription: ")).toBe(true);
    expect(rule).toContain("globs: ");
    expect(rule).toContain("alwaysApply: false\n---\n\n# Rules\n");
  });
});

describe("mergeMcpConfig", () => {
  it("writes each client's format", () => {
    expect(JSON.parse(mergeMcpConfig(undefined, "claude"))).toEqual({
      mcpServers: { merid: { type: "stdio", command: "npx", args: ["-y", "@meridui/mcp"] } },
    });
    expect(JSON.parse(mergeMcpConfig(undefined, "cursor"))).toEqual({ mcpServers: { merid: { command: "npx", args: ["-y", "@meridui/mcp"] } } });
    expect(JSON.parse(mergeMcpConfig("", "vscode"))).toEqual({
      servers: { merid: { type: "stdio", command: "npx", args: ["-y", "@meridui/mcp"] } },
    });
  });

  it("keeps other servers and keys", () => {
    const merged = JSON.parse(mergeMcpConfig('{"inputs":[],"servers":{"github":{"url":"x"}}}', "vscode")) as Record<string, Record<string, unknown>>;
    expect(merged.inputs).toEqual([]);
    expect(Object.keys(merged.servers ?? {})).toEqual(["github", "merid"]);
  });

  it("refuses JSON with comments instead of rewriting it", () => {
    expect(() => mergeMcpConfig('{ // comment\n "servers": {} }', "vscode")).toThrow(InvalidConfigError);
    expect(() => mergeMcpConfig("[]", "claude")).toThrow(InvalidConfigError);
  });

  it("detects an existing server", () => {
    expect(hasMcpServer(mergeMcpConfig(undefined, "cursor"), "cursor")).toBe(true);
    expect(hasMcpServer('{"mcpServers":{}}', "claude")).toBe(false);
    expect(hasMcpServer(undefined, "claude")).toBe(false);
  });
});

describe("patternSource", () => {
  it("adds the CSS import after use client", () => {
    expect(patternSource('"use client";\n\nimport x from "y";\n', "app-shell.css")).toBe('"use client";\n\nimport "./app-shell.css";\nimport x from "y";\n');
    expect(patternSource("export {};\n", undefined)).toBe("export {};\n");
  });
});

describe("unifiedDiff", () => {
  it("marks added and removed lines with context", () => {
    const diff = unifiedDiff("a\nb\nc\n", "a\nB\nc\n", "f.txt");
    expect(diff).toContain("--- a/f.txt");
    expect(diff).toContain("-b");
    expect(diff).toContain("+B");
    expect(unifiedDiff("same", "same", "f")).toBe("");
    expect(unifiedDiff("", "new\n", "n.txt")).toContain("--- /dev/null");
  });
});

describe("parseArgs", () => {
  it("parses commands, flags and values", () => {
    const p = parseArgs(["add", "settings", "--dir=src/ui", "-y", "--dry-run", "--no-mcp", "--client", "claude,cursor"]);
    expect(p.command).toBe("add");
    expect(p.positionals).toEqual(["settings"]);
    expect(p.flags).toMatchObject({ dir: "src/ui", yes: true, dryRun: true, mcp: false, clients: ["claude", "cursor"] });
  });

  it("rejects unknown options and missing values", () => {
    expect(() => parseArgs(["init", "--force"])).toThrow(UsageError);
    expect(() => parseArgs(["add", "--dir"])).toThrow(UsageError);
  });
});
