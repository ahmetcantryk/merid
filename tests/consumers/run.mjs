#!/usr/bin/env node
// Package consumer checks against the BUILT @merid/react (run `npm run build -w @merid/react` first).
// 1. CJS require and ESM import resolve through the package name and expose the same API.
// 2. Type resolution (attw --pack) and package.json lint (publint).
// 3. CSS subpath exports resolve and every font url() in the CSS points at a shipped file.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const pkgDir = join(repo, "packages", "react");
const isWindows = process.platform === "win32";
const results = [];

async function check(name, fn) {
  try {
    const note = await fn();
    results.push({ name, ok: true, note });
  } catch (error) {
    results.push({ name, ok: false, note: error instanceof Error ? error.message : String(error) });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function run(cmd, args) {
  return execFileSync(cmd, args, { cwd: repo, encoding: "utf8", stdio: "pipe", shell: isWindows });
}

function runNode(code, type) {
  return execFileSync(process.execPath, [`--input-type=${type}`, "-e", code], { cwd: repo, encoding: "utf8" }).trim();
}

const EXPECTED = ["Button", "Dialog", "Select", "Tabs", "ToastProvider", "useToast", "cx"];

await check("dist is built", () => {
  for (const f of ["index.js", "index.cjs", "index.d.ts", "index.d.cts", "styles.css", "components.css", "tokens.css"]) {
    assert(existsSync(join(pkgDir, "dist", f)), `missing dist/${f}; run npm run build -w @merid/react`);
  }
});

await check("CJS require('@merid/react')", () => {
  const out = runNode(`const m = require("@merid/react"); console.log(JSON.stringify(Object.keys(m).sort()))`, "commonjs");
  const keys = JSON.parse(out);
  for (const k of EXPECTED) assert(keys.includes(k), `CJS export ${k} missing`);
  return `${keys.length} exports`;
});

await check("ESM import('@merid/react')", () => {
  const out = runNode(`const m = await import("@merid/react"); console.log(JSON.stringify(Object.keys(m).sort()))`, "module");
  const keys = JSON.parse(out).filter((k) => k !== "default" && k !== "module.exports");
  for (const k of EXPECTED) assert(keys.includes(k), `ESM export ${k} missing`);
  const cjs = JSON.parse(runNode(`console.log(JSON.stringify(Object.keys(require("@merid/react")).sort()))`, "commonjs"));
  assert(JSON.stringify(keys) === JSON.stringify(cjs), `ESM and CJS export lists differ`);
  return `${keys.length} exports, identical to CJS`;
});

await check("both builds start with the \"use client\" directive", () => {
  for (const f of ["index.js", "index.cjs"]) {
    assert(readFileSync(join(pkgDir, "dist", f), "utf8").startsWith('"use client";'), `${f} lacks "use client"`);
  }
});

await check("attw --pack packages/react", () => {
  // CSS entry points carry no types by design; attw would report them as unresolvable modules.
  const args = ["--no-install", "attw", "--pack", "packages/react", "--format", "ascii"];
  const out = run("npx", [...args, "--exclude-entrypoints", "./styles.css", "./components.css", "./tokens.css"]);
  assert(out.includes("No problems found"), out);
  return "No problems found";
});

await check("publint packages/react", () => {
  const out = run("npx", ["--no-install", "publint", "packages/react", "--strict"]);
  const plain = out.replace(/\x1b\[[0-9;]*m/g, "").trim();
  assert(/All good/.test(plain), plain);
  return "All good";
});

const require = createRequire(join(repo, "package.json"));

await check("CSS subpath exports resolve", () => {
  const files = ["@merid/react/styles.css", "@merid/react/components.css", "@merid/react/tokens.css", "@merid/react/package.json"].map((id) => {
    const file = require.resolve(id);
    assert(existsSync(file), `${id} resolved to missing ${file}`);
    return id;
  });
  return files.join(", ");
});

await check("font url()s in shipped CSS resolve to packaged files", () => {
  const found = [];
  for (const css of ["styles.css", "components.css", "tokens.css"]) {
    const file = require.resolve(`@merid/react/${css}`);
    const urls = [...readFileSync(file, "utf8").matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((m) => m[1]);
    for (const url of urls.filter((u) => !u.startsWith("data:"))) {
      const target = resolve(dirname(file), url);
      assert(existsSync(target), `${css}: ${url} -> ${target} does not exist`);
      found.push(url);
    }
  }
  const fontExport = require.resolve("@merid/react/fonts/Geist-Variable.woff2");
  assert(existsSync(fontExport), "fonts/* export does not resolve");
  const pkg = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
  assert(pkg.files.includes("fonts"), "fonts/ not listed in package files");
  return `${new Set(found).size} font urls ok`;
});

for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.note ? `  (${r.note})` : ""}`);
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
