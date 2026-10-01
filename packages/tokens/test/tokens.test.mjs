import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { before, test } from "node:test";
import { build } from "../scripts/build.mjs";
import { isSwitch } from "../scripts/parse.mjs";

const css = await readFile(new URL("../../react/styles/tokens.css", import.meta.url), "utf8");
const cssNames = new Set(
  [...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/(--mrd-[\w-]+)\s*:/g)].map((m) => m[1]),
);
const readJson = async (file) => JSON.parse(await readFile(new URL(`../dist/${file}`, import.meta.url), "utf8"));

function collect(node, out = []) {
  if (!node || typeof node !== "object") return out;
  if ("$value" in node) return [...out, node];
  return Object.entries(node)
    .filter(([key]) => !key.startsWith("$"))
    .reduce((acc, [, child]) => collect(child, acc), out);
}

before(async () => {
  await build();
});

test("every CSS variable in tokens.css appears in tokens.json", async () => {
  const tokens = collect(await readJson("tokens.json"));
  const jsonNames = new Set(tokens.map((t) => t.$extensions["com.merid"].cssVariable));
  assert.ok(cssNames.size > 100);
  for (const name of cssNames) {
    // --mrd-if-light / --mrd-if-dark are mode switches (empty or `initial`), not tokens.
    if (isSwitch(name)) continue;
    assert.ok(jsonNames.has(name), `${name} missing from tokens.json`);
  }
  for (const t of tokens) {
    assert.ok(t.$type, "token has $type");
    assert.ok(t.$value, `token ${t.$extensions["com.merid"].cssVariable} has a $value`);
    assert.doesNotMatch(t.$value, /var\(/, "values are fully resolved");
  }
});

test("theme, accent and density are exposed as modes", async () => {
  const json = await readJson("tokens.json");
  const accent = json.color.accent;
  assert.equal(accent.$value, "#b20965");
  assert.equal(accent.$extensions["com.merid"].modes.dark, "#ef86ae");
  assert.equal(accent.$extensions["com.merid"].modes.violet, "#6e4ef0");
  assert.equal(accent.$extensions["com.merid"].modes.petrol, "#035f73");
  // Brass moves the warning tone to orange so a warning never reads as the accent.
  const warning = json.color["warning-strong"].$extensions["com.merid"].modes;
  assert.equal(warning.brass, "#9e4500");
  assert.equal(warning["brass-dark"], "#f9a870");
  assert.equal(warning.petrol, undefined);
  assert.equal(json.size["control-md"].$extensions["com.merid"].modes["pointer-coarse"], "40px");
  assert.equal(json.size["control-md"].$extensions["com.merid"].modes.compact, "28px");
});

test("JS module and Tokens Studio file", async () => {
  const mod = await import("../dist/index.js");
  assert.equal(mod.tokens.light.accent, "#b20965");
  assert.equal(mod.tokens.dark.accent, "#ef86ae");
  assert.equal(mod.tokens.dark.bg, "#0d0e10");
  assert.equal(mod.cssVar.space4, "var(--mrd-space-4)");
  const studio = await readJson("figma-tokens.json");
  assert.equal(studio.core.color.accent.value, "#b20965");
  assert.equal(studio.dark.color.accent.value, "#ef86ae");
  assert.ok(studio.$metadata.tokenSetOrder.includes("accent-violet"));
  assert.equal(studio.$themes.length, 14);
});
