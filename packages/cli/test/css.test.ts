import { describe, expect, it } from "vitest";
import { editStatements, normalizeCss, topLevelStatements } from "../src/css.js";
import { stylesImportLine } from "../src/content.js";
import { addLayerOrder, cssImports, hasLayerOrder, placeStylesAfter } from "../src/stylesheets.js";
import { findTemplateRules, listSelectors, removeTemplateRules } from "../src/templates.js";

describe("topLevelStatements", () => {
  it("splits rules and at-rules, keeping nested blocks whole", () => {
    const css = `@import "tailwindcss";\n/* a { } */\n:root {\n  --x: 1;\n  @media (width < 1px) { --x: 2; }\n}\n@media (prefers-color-scheme: dark) {\n  a { color: red; }\n}\n`;
    expect(topLevelStatements(css).map((s) => s.text.split("\n")[0])).toEqual(['@import "tailwindcss";', ":root {", "@media (prefers-color-scheme: dark) {"]);
  });

  it("ignores braces inside strings and comments", () => {
    const css = `a::before { content: "}"; }\n/* } */\nb { color: red }`;
    expect(topLevelStatements(css).map((s) => s.text)).toEqual(['a::before { content: "}"; }', "b { color: red }"]);
  });
});

describe("normalizeCss", () => {
  it("ignores whitespace, comments, quote style and the last semicolon", () => {
    expect(normalizeCss("h1,\nh2 {\n  font-family: 'A B', sans-serif; /* x */\n}")).toBe(normalizeCss('h1, h2 { font-family: "A B",sans-serif }'));
    expect(normalizeCss("a { color: red }")).not.toBe(normalizeCss("a { color: blue }"));
  });
});

describe("editStatements", () => {
  it("removes whole lines, collapses blank lines and keeps CRLF", () => {
    const css = "a {\r\n  x: 1;\r\n}\r\n\r\nb {\r\n  y: 2;\r\n}\r\n\r\nc {\r\n  z: 3;\r\n}\r\n";
    const [, b] = topLevelStatements(css);
    expect(editStatements(css, b ? [{ statement: b }] : [])).toBe("a {\r\n  x: 1;\r\n}\r\n\r\nc {\r\n  z: 3;\r\n}\r\n");
  });

  it("replaces a statement in place", () => {
    const css = "a { x: 1; }\nb { y: 2; }\n";
    const [a] = topLevelStatements(css);
    expect(editStatements(css, a ? [{ statement: a, replacement: "a { x: 0; }" }] : [])).toBe("a { x: 0; }\nb { y: 2; }\n");
  });
});

describe("template rules", () => {
  it("finds a rule however it is formatted", () => {
    const css = `button{border-radius:8px;border:1px solid transparent;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:#1a1a1a;cursor:pointer;transition:border-color .25s}`;
    // `.6em` is not `0.6em`: only formatting is ignored, not values.
    expect(findTemplateRules(css, "vite")).toHaveLength(0);
    const formatted = css.replace(".6em", "0.6em").replace(".25s", "0.25s").replace(/;/g, ";\n");
    expect(findTemplateRules(formatted, "vite").map((m) => m.selector)).toEqual(["button"]);
  });

  it("leaves a rule the user has edited", () => {
    const css = "a {\n  color: inherit;\n  text-decoration: underline;\n}\n";
    expect(removeTemplateRules(css, "next")).toBe(css);
  });

  it("only knows the rules of the detected framework", () => {
    const css = "a {\n  color: inherit;\n  text-decoration: none;\n}\n";
    expect(findTemplateRules(css, "vite")).toHaveLength(0);
    expect(removeTemplateRules(css, "next")).toBe("");
  });

  it("lists selectors for messages", () => {
    const matches = findTemplateRules("a {\n  color: inherit;\n  text-decoration: none;\n}\n* {\n  box-sizing: border-box;\n  padding: 0;\n  margin: 0;\n}\n", "next");
    expect(listSelectors(matches)).toBe("`a` and `*`");
  });
});

describe("Tailwind layer order", () => {
  it("adds the layer statement before @import, once", () => {
    const css = '@import "tailwindcss";\n';
    const once = addLayerOrder(css);
    expect(once).toBe('@layer theme, base, merid, components, utilities;\n\n@import "tailwindcss";\n');
    expect(hasLayerOrder(once)).toBe(true);
    expect(addLayerOrder(once)).toBe(once);
    expect(addLayerOrder('@charset "utf-8";\n@import "tailwindcss";\n')).toMatch(/^@charset "utf-8";\n@layer theme/);
  });

  it("only accepts an order that puts merid after base", () => {
    expect(hasLayerOrder("@layer merid, theme, base, components, utilities;")).toBe(false);
    expect(hasLayerOrder("@layer reset, theme, base, merid, components, utilities;")).toBe(true);
    expect(hasLayerOrder("@layer theme, base, components, utilities;")).toBe(false);
  });

  it("puts the Merid import after the Tailwind stylesheet, moving one that sits above it", () => {
    const layout = 'import type { Metadata } from "next";\nimport "@meridui/react/styles.css";\nimport "./globals.css";\n';
    expect(placeStylesAfter(layout, "./globals.css")).toBe('import type { Metadata } from "next";\nimport "./globals.css";\nimport "@meridui/react/styles.css";\n');
    const fixed = placeStylesAfter(layout, "./globals.css");
    expect(placeStylesAfter(fixed, "./globals.css")).toBe(fixed);
  });

  it("reads relative CSS imports in order", () => {
    expect(cssImports("import './index.css'\nimport x from 'y'\nimport \"../a/b.css\";\nimport 'pkg/c.css'\n")).toEqual(["./index.css", "../a/b.css"]);
  });
});

describe("stylesImportLine", () => {
  it("follows the file's quotes and semicolons", () => {
    expect(stylesImportLine("import { a } from 'b'\n")).toBe("import '@meridui/react/styles.css'");
    expect(stylesImportLine('import type { A } from "b";\n')).toBe('import "@meridui/react/styles.css";');
    expect(stylesImportLine("export {};\n")).toBe('import "@meridui/react/styles.css";');
  });
});
