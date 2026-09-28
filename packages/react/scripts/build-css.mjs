// Concatenates the plain-CSS sources into dist/styles.css and dist/tokens.css.
// Source files wrap their own rules in @layer blocks; this script only fixes the
// layer order up front and joins tokens -> base -> components (alphabetical).
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stylesDir = join(root, "styles");
const distDir = join(root, "dist");
const LAYER_ORDER = "@layer merid.tokens, merid.base, merid.components;\n";

async function read(path) {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    throw new Error(`build-css: cannot read ${path}: ${error.message}`);
  }
}

async function main() {
  const componentDir = join(stylesDir, "components");
  const componentFiles = (await readdir(componentDir)).filter((f) => f.endsWith(".css"))
    // Shared partials (`_*.css`, e.g. _motion.css keyframes) come first, then components A-Z.
    .sort((a, b) => Number(!a.startsWith("_")) - Number(!b.startsWith("_")) || a.localeCompare(b));
  const tokens = await read(join(stylesDir, "tokens.css"));
  const base = await read(join(stylesDir, "base.css"));
  const components = await Promise.all(
    componentFiles.map(async (f) => `/* ${f} */\n${await read(join(componentDir, f))}`),
  );

  await mkdir(distDir, { recursive: true });
  await writeFile(join(distDir, "tokens.css"), LAYER_ORDER + tokens);
  await writeFile(join(distDir, "styles.css"), [LAYER_ORDER, tokens, base, ...components].join("\n"));
  console.log(`build-css: wrote dist/styles.css (${componentFiles.length} component files) and dist/tokens.css`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
