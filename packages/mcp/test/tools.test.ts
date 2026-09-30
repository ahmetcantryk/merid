import { describe, expect, it } from "vitest";
import { loadData } from "../src/data.js";
import {
  findComponent,
  getComponent,
  getDesignContract,
  getPattern,
  getSetup,
  getTokens,
  listComponents,
  searchDocs,
} from "../src/tools.js";

const data = loadData(new URL("../dist/data.json", import.meta.url));

describe("bundled data", () => {
  it("covers every catalog component, every token and every pattern", () => {
    expect(data.components.length).toBeGreaterThanOrEqual(46);
    expect(data.tokens.some((t) => t.name === "--mrd-accent")).toBe(true);
    expect(data.patterns.map((p) => p.slug)).toEqual(
      expect.arrayContaining(["app-shell", "settings", "auth", "data-table", "forms"]),
    );
    expect(data.setups.map((s) => s.framework)).toEqual(["next", "vite", "react-router"]);
  });

  it("contains no leftover JSX outside code fences", () => {
    for (const page of data.pages) {
      const prose = page.markdown.replace(/```[\s\S]*?```/g, "");
      expect(prose, page.href).not.toMatch(/^\s*<(ComponentPreview|PropsTable|KeyboardTable|DoDont|Callout|StatusBadge)\b/m);
      expect(prose, page.href).not.toMatch(/^import\s/m);
    }
  });

  it("rejects data with the wrong shape", () => {
    expect(() => loadData(new URL("../package.json", import.meta.url))).toThrow(/unexpected shape/);
    expect(() => loadData(new URL("./missing.json", import.meta.url))).toThrow(/not found/);
  });
});

describe("list_components", () => {
  it("groups by category", () => {
    const { text } = listComponents(data);
    expect(text).toContain("## Inputs");
    expect(text).toContain("**Button** (`button`)");
  });

  it("filters one category case-insensitively", () => {
    const { text } = listComponents(data, "overlay");
    expect(text).toContain("**Dialog**");
    expect(text).not.toContain("**Button**");
  });

  it("errors on an unknown category", () => {
    const res = listComponents(data, "Charts");
    expect(res.isError).toBe(true);
    expect(res.text).toContain("Available:");
  });
});

describe("get_component", () => {
  it("returns import, examples, props, keyboard and accessibility", () => {
    const { text, isError } = getComponent(data, "Dialog");
    expect(isError).toBeUndefined();
    expect(text).toContain('import { Dialog } from "@meridui/react";');
    expect(text).toContain("## Examples");
    expect(text).toContain("| `defaultOpen` | `boolean` | `false` |");
    expect(text).toContain("## Keyboard");
    expect(text).toContain("`Esc`");
    expect(text).toContain("## Accessibility");
  });

  it("accepts slugs, parts and JSX-ish names", () => {
    expect(findComponent(data, "dropdown-menu")?.name).toBe("DropdownMenu");
    expect(findComponent(data, "Select.Item")?.name).toBe("Select");
    expect(findComponent(data, "<Button />")?.name).toBe("Button");
  });

  it("returns one section only", () => {
    const { text } = getComponent(data, "Button", "props");
    expect(text).toContain("## Props");
    expect(text).not.toContain("## Examples");
  });

  it("suggests close names when not found", () => {
    const res = getComponent(data, "Dialo");
    expect(res.isError).toBe(true);
    expect(res.text).toContain("Dialog");
  });
});

describe("search_docs", () => {
  it("ranks the relevant section first and links to its anchor", () => {
    const { text } = searchDocs(data, "focus trap dialog", 3);
    expect(text).toMatch(/1\. \*\*Dialog/);
    expect(text).toContain("https://meridui.dev/docs/components/dialog");
  });

  it("handles no results and empty queries", () => {
    expect(searchDocs(data, "zzqxv").text).toContain("No results");
    expect(searchDocs(data, "  ").isError).toBe(true);
  });
});

describe("get_tokens", () => {
  it("returns light and dark values", () => {
    const { text } = getTokens(data, "color");
    expect(text).toContain("| `--mrd-accent` | `#3f63f5` | `#6b8aff` |");
  });

  it("returns a single theme", () => {
    const { text } = getTokens(data, "color", "dark");
    expect(text).toContain("| `--mrd-accent` | `#6b8aff` |");
  });

  it("errors on an unknown category", () => {
    expect(getTokens(data, "gradients").isError).toBe(true);
  });
});

describe("get_design_contract", () => {
  it("returns DESIGN.md plus the AI rules", () => {
    const { text } = getDesignContract(data);
    expect(text).toContain("# Merid design contract");
    expect(text).toContain("# Merid UI rules");
  });

  it("returns one section or the rules", () => {
    expect(getDesignContract(data, "principles").text).toMatch(/^## Principles/);
    expect(getDesignContract(data, "rules").text).toMatch(/^# Merid UI rules/);
    expect(getDesignContract(data, "nope").isError).toBe(true);
  });
});

describe("get_pattern", () => {
  it("lists patterns without a name", () => {
    expect(getPattern(data).text).toContain("**settings**");
  });

  it("returns guide, source and CSS", () => {
    const { text } = getPattern(data, "navigation");
    expect(text).toContain("export function AppShellExample");
    expect(text).toContain(".pattern-shell {");
    expect(text).toContain("`lucide-react`");
  });
});

describe("get_setup", () => {
  it("includes the CLI and the stylesheet import", () => {
    const { text } = getSetup(data, "next");
    expect(text).toContain("npx @meridui/cli init");
    expect(text).toContain('import "@meridui/react/styles.css"');
  });
});
