export const site = {
  name: "Merid",
  tagline: "Quiet, precise React components.",
  description:
    "Merid is an accessible React component library built on plain CSS and a small set of design tokens: 1px hairlines, one cool accent, soft grey trays and calm motion.",
  url: "https://merid.dev",
  repo: "https://github.com/ahmetcantryk/merid",
  docsSourcePath: "apps/docs/app",
  version: "0.1.0",
  releaseDate: "2026-09-28",
  install: "npm i @merid/react",
} as const;

export function editUrl(pathname: string): string {
  const clean = pathname.replace(/\/$/, "");
  return `${site.repo}/edit/main/${site.docsSourcePath}${clean}/page.mdx`;
}
