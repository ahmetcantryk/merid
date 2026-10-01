import reactPackage from "@meridui/react/package.json";

export const site = {
  name: "Merid",
  tagline: "Accessible React components in plain CSS.",
  description:
    "Open source React component library with 60+ accessible components in plain CSS. Your styles override it without !important. Docs in English and Turkish.",
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
