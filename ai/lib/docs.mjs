// Reads the docs site (nav, catalog, MDX pages) into plain data. Build-time only, Node built-ins only.
// The nav and catalog are TypeScript modules in apps/docs/lib; they are read as text so this code
// runs without a TS toolchain, and every regex failure throws so a nav refactor breaks the build loudly.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evalLiteral, mdxToMarkdown, publishedNames } from "./mdx.mjs";

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const docsRoot = path.join(repoRoot, "apps/docs");
export const SITE_URL = "https://meridui.dev";

const read = (rel) => readFileSync(path.join(repoRoot, rel), "utf8");

function literalAfter(source, marker, file) {
  const at = source.indexOf(marker);
  if (at === -1) throw new Error(`[ai] ${file}: "${marker}" not found`);
  const open = source.indexOf("=", at) + 1;
  const ends = [source.indexOf("\n];", open), source.indexOf("\n};", open)].filter((n) => n !== -1);
  if (ends.length === 0) throw new Error(`[ai] ${file}: end of ${marker} not found`);
  const end = Math.min(...ends);
  const value = evalLiteral(source.slice(open, end + 2).trim());
  if (value === undefined) throw new Error(`[ai] ${file}: could not evaluate ${marker}`);
  return value;
}

/** `[{ title, items: [{ title, href }] }]` from apps/docs/lib/nav.ts. */
export function readNav() {
  return literalAfter(read("apps/docs/lib/nav.ts"), "export const docsNav", "nav.ts");
}

/** Turkish nav titles keyed by English group title and by href. */
export function readNavTr() {
  const src = read("apps/docs/lib/i18n/nav.tr.ts");
  return {
    groups: literalAfter(src, "export const navGroupTitlesTr", "nav.tr.ts"),
    items: literalAfter(src, "export const navTitlesTr", "nav.tr.ts"),
  };
}

/** `[{ group, items: [{ name, slug, description, status }] }]` from apps/docs/lib/components-catalog.ts. */
export function readCatalog() {
  return literalAfter(read("apps/docs/lib/components-catalog.ts"), "export const componentCatalog", "components-catalog.ts");
}

/** Source file of a locale-neutral href in a locale, or undefined when the page does not exist. */
export function pageFile(href, locale) {
  const dir = locale === "tr" ? path.join("app/tr", href) : path.join("app/(en)", href);
  const file = path.join(docsRoot, dir, "page.mdx");
  return existsSync(file) ? file : undefined;
}

export const localize = (href, locale) => (locale === "tr" ? `/tr${href}` : href);

/**
 * Every docs page in nav order for one locale:
 * `{ href, url, mdPath, group, navTitle, title, description, markdown }`.
 * `href` is locale-neutral; `url` and `mdPath` are localized.
 */
export function readPages(locale = "en") {
  const nav = readNav();
  const tr = locale === "tr" ? readNavTr() : undefined;
  const pages = [];
  for (const group of nav) {
    for (const item of group.items) {
      const file = pageFile(item.href, locale);
      if (!file) continue;
      const { title, description, markdown } = mdxToMarkdown(publishedNames(readFileSync(file, "utf8")), locale);
      const localHref = localize(item.href, locale);
      pages.push({
        href: item.href,
        url: `${SITE_URL}${localHref}`,
        mdPath: `${localHref}.md`,
        group: tr ? (tr.groups[group.title] ?? group.title) : group.title,
        navTitle: tr ? (tr.items[item.href] ?? item.title) : item.title,
        title: title || item.title,
        description,
        // Absolute links: these files are read outside the site (llms.txt, MCP).
        markdown: markdown.replace(/\]\(\//g, `](${SITE_URL}/`),
      });
    }
  }
  return pages;
}

/** The official AI rules file (single source for the CLI, docs and MCP server). */
export function readRules() {
  return read("ai/rules.md");
}

export function readDesignContract() {
  return read("DESIGN.md");
}
