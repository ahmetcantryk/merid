import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const stylesDir = join(__dirname, "..", "..", "styles");
const tokens = readFileSync(join(stylesDir, "tokens.css"), "utf8");
const componentDir = join(stylesDir, "components");
const componentCss = readdirSync(componentDir)
  .filter((f) => f.endsWith(".css"))
  .map((f) => ({ file: f, css: readFileSync(join(componentDir, f), "utf8") }));
const allComponents = componentCss.map((c) => c.css).join("\n");

/** Returns the declarations of the first rule whose selector list matches exactly. */
function block(css: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s*");
  const match = new RegExp(String.raw`(^|[}\n])\s*${escaped}\s*\{([^}]*)\}`).exec(css);
  if (!match) throw new Error(`no rule for ${selector}`);
  return match[2] ?? "";
}

describe("theme tokens", () => {
  it("scopes light to :root and any [data-theme=light] subtree", () => {
    const light = block(tokens, ':root,\n  [data-theme="light"]');
    expect(light).toMatch(/--mrd-bg:\s*#fff/);
    expect(light).toMatch(/color-scheme:\s*light/);
    expect(light).toMatch(/--mrd-if-light:\s*;/);
  });

  it("scopes dark to any [data-theme=dark] subtree and follows prefers-color-scheme on :root", () => {
    const dark = block(tokens, '[data-theme="dark"]');
    expect(dark).toMatch(/--mrd-bg:\s*#0b0d12/);
    expect(dark).toMatch(/color-scheme:\s*dark/);
    expect(tokens).toMatch(/@media \(prefers-color-scheme: dark\)\s*\{\s*:root:not\(\[data-theme="light"\]\)/);
  });

  it("light and dark blocks define the same neutral tokens", () => {
    const names = (css: string) => [...css.matchAll(/(--mrd-[a-z0-9-]+):/g)].map((m) => m[1]).sort();
    expect(names(block(tokens, '[data-theme="dark"]'))).toEqual(names(block(tokens, ':root,\n  [data-theme="light"]')));
  });

  it("re-resolves accent tokens wherever theme or accent changes", () => {
    const resolver = block(tokens, ":root,\n  [data-theme],\n  [data-accent]");
    for (const token of ["accent", "accent-hover", "accent-soft", "accent-strong", "accent-solid", "accent-solid-hover", "focus-ring", "shadow-accent"]) {
      expect(resolver).toContain(`--mrd-${token}:`);
    }
  });
});

describe("accent presets", () => {
  it.each(["violet", "green", "graphite"])("defines [data-accent=%s] with light and dark values", (name) => {
    const preset = block(tokens, `[data-accent="${name}"]`);
    expect(preset).toContain(`--mrd-accent-light: var(--mrd-${name}-600)`);
    expect(preset).toContain("--mrd-accent-dark:");
    expect(preset).toContain("--mrd-accent-fill:");
    expect(tokens).toContain(`--mrd-${name}-50:`);
  });

  it("blue is the default preset", () => {
    expect(block(tokens, ':root,\n  [data-accent="blue"]')).toContain("var(--mrd-blue-600)");
  });
});

describe("density", () => {
  it.each([
    ["compact", "28px"],
    ["default", "32px"],
    ["comfortable", "36px"],
  ])("[data-density=%s] sets md controls to %s", (name, height) => {
    const density = block(tokens, `[data-density="${name}"]`);
    expect(density).toContain(`--mrd-control-md: ${height}`);
    expect(density).toContain("--mrd-control-pad-md:");
    expect(density).toContain("--mrd-text-sm:");
  });
});

describe("direction, forced colours and print", () => {
  it("component CSS uses no physical left/right properties", () => {
    const offenders = componentCss.filter(({ css }) =>
      /(^|[\s;{])(margin|padding)-(left|right)\s*:|(^|[\s;{])(left|right)\s*:|text-align:\s*(left|right)|border-(top|bottom)-(left|right)-radius/m.test(css),
    );
    expect(offenders.map((o) => o.file)).toEqual([]);
  });

  it("flips directional affordances under :dir(rtl)", () => {
    expect(allComponents).toMatch(/\.mrd-pagination__control:dir\(rtl\)/);
    expect(allComponents).toMatch(/\.mrd-switch__track:dir\(rtl\)/);
  });

  it("has forced-colors and print media blocks", () => {
    expect(allComponents).toContain("@media (forced-colors: active)");
    expect(allComponents).toContain("@media print");
  });
});
