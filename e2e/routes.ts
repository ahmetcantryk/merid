import { readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
/** English pages live in the `(en)` route group; Turkish pages mirror them under `app/tr`. */
const docsApp = join(here, "..", "apps", "docs", "app", "(en)", "docs");

function childRoutes(section: string): string[] {
  const dir = join(docsApp, section);
  return readdirSync(dir)
    .filter((name) => statSync(join(dir, name)).isDirectory())
    .sort()
    .map((name) => `/docs/${section}/${name}`);
}

/** Every docs page, locale-neutral (`/docs/...`). */
function allDocRoutes(dir = docsApp, base = "/docs"): string[] {
  return readdirSync(dir)
    .filter((name) => statSync(join(dir, name)).isDirectory())
    .sort()
    .flatMap((name) => {
      const child = join(dir, name);
      const route = `${base}/${name}`;
      const self = readdirSync(child).includes("page.mdx") ? [route] : [];
      return [...self, ...allDocRoutes(child, route)];
    });
}

export const componentRoutes = childRoutes("components");
export const foundationRoutes = ["/docs/foundations", ...childRoutes("foundations")];
/** Launch pages: blog, comparisons, privacy. Posts published on launch day; later ones are scheduled. */
export const contentRoutes = [
  "/blog",
  "/blog/best-react-component-libraries-ai-coding-2026",
  "/blog/tag/comparisons",
  "/compare",
  "/compare/shadcn-ui-vs-merid",
  "/compare/mui-vs-merid",
] as const;
export const contentRoutesTr = ["/tr/blog", "/tr/compare", "/tr/compare/shadcn-ui-vs-merid", "/tr/gizlilik"] as const;

export const a11yRoutes = ["/", "/docs/components", ...componentRoutes, ...foundationRoutes, ...contentRoutes, "/privacy"];

export function toTurkish(route: string): string {
  return route === "/" ? "/tr" : `/tr${route}`;
}

/** The same pages in Turkish: the a11y suite runs both locales. */
export const a11yRoutesTr = [
  ...a11yRoutes.filter((r) => !(contentRoutes as readonly string[]).includes(r) && r !== "/privacy").map(toTurkish),
  ...contentRoutesTr,
];

export const docRoutes = allDocRoutes();
