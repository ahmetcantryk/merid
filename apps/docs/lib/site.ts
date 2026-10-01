import reactPackage from "@meridui/react/package.json";

export const site = {
  name: "Merid",
  tagline: "Quiet, precise React components.",
  description:
    "Merid is an accessible React component library built on plain CSS and a small set of design tokens: 1px hairlines, one cool accent, soft grey trays and calm motion.",
  url: "https://meridui.dev",
  repo: "https://github.com/ahmetcantryk/merid",
  docsSourcePath: "apps/docs/app",
  version: reactPackage.version,
  releaseDate: "2026-09-30",
  install: "npm i @meridui/react",
  packageName: "@meridui/react",
  npm: "https://www.npmjs.com/package/@meridui/react",
  author: { name: "Ahmet Can Tiryaki", url: "https://github.com/ahmetcantryk" },
} as const;

/**
 * Source folder of a page, relative to `app/`. English pages live in the `(en)` route group,
 * Turkish pages under `tr/`, so `/docs/usage` maps to `(en)/docs/usage` and `/tr/docs/usage` to `tr/docs/usage`.
 */
export function pageSourceDir(pathname: string): string {
  const clean = pathname.replace(/\/$/, "");
  return clean === "/tr" || clean.startsWith("/tr/") ? clean : `/(en)${clean}`;
}

export function editUrl(pathname: string): string {
  return `${site.repo}/edit/main/${site.docsSourcePath}${pageSourceDir(pathname)}/page.mdx`;
}
