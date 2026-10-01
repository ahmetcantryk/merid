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
  assert.equal(accent.$value, "#3f63f5");
  assert.equal(accent.$extensions["com.merid"].modes.dark, "#6b8aff");
  assert.equal(accent.$extensions["com.merid"].modes.violet, "#6e4ef0");
  assert.equal(json.size["control-md"].$extensions["com.merid"].modes["pointer-coarse"], "40px");
  assert.equal(json.size["control-md"].$extensions["com.merid"].modes.compact, "28px");
});

test("JS module and Tokens Studio file", async () => {
  const mod = await import("../dist/index.js");
  assert.equal(mod.tokens.light.accent, "#3f63f5");
  assert.equal(mod.tokens.dark.accent, "#6b8aff");
  assert.equal(mod.tokens.dark.bg, "#0b0d12");
  assert.equal(mod.cssVar.space4, "var(--mrd-space-4)");
  const studio = await readJson("figma-tokens.json");
  assert.equal(studio.core.color.accent.value, "#3f63f5");
  assert.equal(studio.dark.color.accent.value, "#6b8aff");
  assert.ok(studio.$metadata.tokenSetOrder.includes("accent-violet"));
  assert.equal(studio.$themes.length, 8);
});
