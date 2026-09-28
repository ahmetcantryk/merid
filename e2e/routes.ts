import { readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const docsApp = join(here, "..", "apps", "docs", "app", "docs");

function childRoutes(section: string): string[] {
  const dir = join(docsApp, section);
  return readdirSync(dir)
    .filter((name) => statSync(join(dir, name)).isDirectory())
    .sort()
    .map((name) => `/docs/${section}/${name}`);
}

export const componentRoutes = childRoutes("components");
export const foundationRoutes = ["/docs/foundations", ...childRoutes("foundations")];
export const a11yRoutes = ["/", "/docs/components", ...componentRoutes, ...foundationRoutes];
