import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/lib/site";
import { TAG_IDS } from "./schema";
import type { ContentEntry } from "./types";

/** Routes that are not docs pages or content entries but exist in both locales. */
export const STATIC_ROUTES = [
  "/",
  "/tr",
  "/blog",
  "/tr/blog",
  "/blog/rss.xml",
  "/tr/blog/rss.xml",
  "/compare",
  "/tr/compare",
  "/privacy",
  "/tr/gizlilik",
] as const;

const PAGE_FILES = ["page.mdx", "page.tsx"];

function pageRoutes(dir: string, base: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => !name.startsWith("[") && !name.startsWith("(") && statSync(join(dir, name)).isDirectory())
    .flatMap((name) => {
      const child = join(dir, name);
      const route = `${base}/${name}`;
      const self = PAGE_FILES.some((f) => existsSync(join(child, f))) ? [route] : [];
      return [...self, ...pageRoutes(child, route)];
    });
}

/** Every docs page in both locales, read from the app directory so new pages are picked up without a list. */
function docsRoutes(): string[] {
  const app = join(process.cwd(), "app");
  return [...pageRoutes(join(app, "(en)", "docs"), "/docs"), ...pageRoutes(join(app, "tr", "docs"), "/tr/docs")];
}

/**
 * Site-relative path of an internal link, or undefined for external links and in-page anchors.
 * Absolute links to the production origin count as internal.
 */
export function internalPath(href: string): string | undefined {
  let path = href;
  if (path.startsWith(site.url)) path = path.slice(site.url.length) || "/";
  if (!path.startsWith("/") || path.startsWith("//")) return undefined;
  const clean = path.split(/[?#]/)[0] ?? "/";
  return clean.length > 1 ? clean.replace(/\/$/, "") : clean;
}

const LINK = /\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)|href=["']([^"']+)["']/g;

function linksIn(body: string): string[] {
  const prose = body.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
  return [...prose.matchAll(LINK)].map((m) => m[1] ?? m[2] ?? "").filter(Boolean);
}

/**
 * Fails the build when a content entry links to an internal route that does not exist.
 * Links to entries that exist but are not published yet are allowed: they render as plain
 * text until the target's publish date (see `renderContent`).
 */
export function validateLinks(entries: readonly ContentEntry[]): void {
  const tagRoutes = TAG_IDS.flatMap((t) => [`/blog/tag/${t}`, `/tr/blog/tag/${t}`]);
  const known = new Set<string>([...STATIC_ROUTES, ...docsRoutes(), ...tagRoutes, ...entries.map((e) => e.url)]);
  const broken = entries.flatMap((entry) =>
    linksIn(entry.body)
      .map((href) => ({ href, path: internalPath(href) }))
      .filter((l) => l.path !== undefined && !known.has(l.path))
      .map((l) => `  ${entry.file}: ${l.href}`),
  );
  if (broken.length > 0) {
    throw new Error(`[content] ${broken.length} broken internal link(s):\n${broken.join("\n")}`);
  }
}
