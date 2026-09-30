// Compiles the Merid docs, tokens, patterns and rules into dist/data.json, which ships in the package.
// The server reads only this file at runtime: no network, no writes.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildAiData } from "../../../ai/lib/data.mjs";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const data = await buildAiData();
await mkdir(dist, { recursive: true });
await writeFile(path.join(dist, "data.json"), JSON.stringify(data));
console.log(
  `[mcp] data.json: ${data.components.length} components, ${data.tokens.length} tokens, ${data.patterns.length} patterns, ${data.pages.length} pages`,
);
