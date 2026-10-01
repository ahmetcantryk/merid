import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { NEUTRALS, PRESETS, failures, measure, type Fill } from "../../scripts/contrast.mjs";

const tokens = readFileSync(join(__dirname, "..", "..", "styles", "tokens.css"), "utf8");

/** The `--mrd-*` declarations of the first rule whose selector list matches exactly. */
function declarations(selector: string): Record<string, string> {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s*");
  const match = new RegExp(String.raw`(^|[}\n])\s*${escaped}\s*\{([^}]*)\}`).exec(tokens);
  if (!match) throw new Error(`no rule for ${selector}`);
  return Object.fromEntries([...(match[2] ?? "").matchAll(/(--mrd-[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2]?.trim()]));
}

const palette = declarations(":root");
const long = (hex: string) => (/^#[0-9a-f]{3}$/i.test(hex) ? `#${[...hex.slice(1)].map((c) => c + c).join("")}` : hex.toLowerCase());

/** Resolves `var(--mrd-x)` against the primitive palette and normalises colours to the forms contrast.mjs uses. */
function value(raw: string | undefined): Fill {
  if (!raw) throw new Error("missing declaration");
  const ref = /^var\((--mrd-[\w-]+)\)$/.exec(raw);
  if (ref) return value(palette[ref[1] ?? ""]);
  const rgb = /^rgb\((\d+) (\d+) (\d+) \/ (\d+)%\)$/.exec(raw);
  if (rgb) return [[Number(rgb[1]), Number(rgb[2]), Number(rgb[3])], Number(rgb[4]) / 100];
  return long(raw);
}

const presetSelector = (name: string) => (name === "magenta" ? ':root,\n  [data-accent="magenta"]' : `[data-accent="${name}"]`);

describe("contrast.mjs mirrors tokens.css", () => {
  it.each(Object.keys(PRESETS))("preset %s", (name) => {
    const d = declarations(presetSelector(name));
    const p = PRESETS[name];
    expect(p).toBeDefined();
    expect(p?.light).toMatchObject({
      accent: value(d["--mrd-accent-light"]),
      solid: value(d["--mrd-accent-fill"]),
      solidHover: value(d["--mrd-accent-fill-hover"]),
      strong: value(d["--mrd-accent-light-strong"]),
      soft: value(d["--mrd-accent-light-soft"]),
    });
    expect(p?.dark).toMatchObject({
      accent: value(d["--mrd-accent-dark"]),
      solid: value(d["--mrd-accent-fill"]),
      solidHover: value(d["--mrd-accent-fill-hover"]),
      strong: value(d["--mrd-accent-dark-strong"]),
      soft: value(d["--mrd-accent-dark-soft"]),
    });
    if (d["--mrd-warning-light-strong"]) {
      expect(p?.light.warning).toEqual([value(d["--mrd-warning-light-strong"]), value(d["--mrd-warning-light-soft"])]);
      expect(p?.dark.warning).toEqual([value(d["--mrd-warning-dark-strong"]), value(d["--mrd-warning-dark-soft"])]);
    }
  });

  it.each([
    ["light", ':root,\n  [data-theme="light"]'],
    ["dark", '[data-theme="dark"]'],
  ] as const)("%s neutrals and status tones", (mode, selector) => {
    const d = declarations(selector);
    const warning = declarations(":root,\n  [data-accent]");
    expect(NEUTRALS[mode]).toEqual({
      bg: value(d["--mrd-bg"]),
      surface: value(d["--mrd-surface"]),
      tray: value(d["--mrd-tray"]),
      subtle: value(d["--mrd-subtle"]),
      ink: value(d["--mrd-ink"]),
      muted: value(d["--mrd-muted"]),
      placeholder: value(d["--mrd-placeholder"]),
      body: value(d["--mrd-body"]),
      dangerSolid: value(d["--mrd-danger-solid"]),
      dangerSolidHover: value(d["--mrd-danger-solid-hover"]),
      danger: [value(d["--mrd-danger-strong"]), value(d["--mrd-danger-soft"])],
      warning: [value(warning[`--mrd-warning-${mode}-strong`]), value(warning[`--mrd-warning-${mode}-soft`])],
      success: [value(d["--mrd-success-strong"]), value(d["--mrd-success-soft"])],
    });
  });
});

describe("contrast", () => {
  it("every preset and neutral pair meets WCAG AA (4.5:1) in light and dark", () => {
    expect(failures()).toEqual([]);
    expect(measure()).toHaveLength(Object.keys(PRESETS).length * 2 + 2);
  });

  it("reports only the pairs that fall short", () => {
    const rows = [{ group: "x", mode: "light" as const, cells: { low: 4.49, ok: 7 } }];
    expect(failures(rows)).toEqual([{ group: "x", mode: "light", cells: { low: 4.49 } }]);
  });
});
