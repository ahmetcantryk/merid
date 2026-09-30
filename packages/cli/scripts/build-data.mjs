// Embeds the AI rules and the docs patterns into dist/data.json. Same source as @meridui/mcp and the docs site.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildAiData } from "../../../ai/lib/data.mjs";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const data = await buildAiData();
const embedded = {
  schema: 1,
  rules: data.rules,
  patterns: data.patterns.map(({ slug, aliases, title, description, url, file, source, css, dependencies }) => ({
    slug,
    aliases,
    title,
    description,
    url,
    file,
    source,
    css,
    dependencies,
  })),
};
await mkdir(dist, { recursive: true });
await writeFile(path.join(dist, "data.json"), JSON.stringify(embedded));
console.log(`[cli] data.json: rules + ${embedded.patterns.length} patterns`);
