import type { MetadataRoute } from "next";
import { getIndexable, type PublishedEntry } from "@/lib/content";
import { defaultLocale, htmlLang, localizePath, locales } from "@/lib/i18n/config";
import { flatNav } from "@/lib/nav";
import { site } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

const abs = (path: string) => `${site.url}${path === "/" ? "" : path}`;

/** A page that exists in both locales under the same locale-neutral path. */
function bilingual(path: string, lastModified: Date): Entry[] {
  const languages: Record<string, string> = {};
  for (const locale of locales) languages[htmlLang[locale]] = abs(localizePath(path, locale));
  languages["x-default"] = abs(localizePath(path, defaultLocale));
  return locales.map((locale) => ({ url: abs(localizePath(path, locale)), lastModified, alternates: { languages } }));
}

/** A pair of pages with different paths per locale (e.g. /privacy and /tr/gizlilik). */
function pair(en: string, tr: string, lastModified: Date): Entry[] {
  const languages = { en: abs(en), tr: abs(tr), "x-default": abs(en) };
  return [en, tr].map((path) => ({ url: abs(path), lastModified, alternates: { languages } }));
}

/** Blog posts and comparisons. hreflang only where a published counterpart exists. */
function content(entry: PublishedEntry): Entry {
  const languages: Record<string, string> = { [htmlLang[entry.locale]]: abs(entry.url) };
  if (entry.translation) {
    languages[entry.locale === "en" ? "tr" : "en"] = abs(entry.translation);
  }
  const english = entry.locale === "en" ? entry.url : entry.translation;
  if (english) languages["x-default"] = abs(english);
  return { url: abs(entry.url), lastModified: new Date(entry.updated), alternates: { languages } };
}

function latest(entries: readonly PublishedEntry[], fallback: Date): Date {
  const times = entries.map((e) => Date.parse(e.updated));
  return times.length ? new Date(Math.max(...times)) : fallback;
}

/**
 * Every indexable page in every locale, each with its translations. Scheduled posts, drafts,
 * tag pages (noindex) and search are left out. `priority` and `changefreq` are omitted:
 * Google ignores them.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const released = new Date(site.releaseDate);
  const entries = (["post", "compare"] as const).flatMap((kind) => locales.flatMap((locale) => getIndexable(kind, locale)));
  const posts = entries.filter((e) => e.kind === "post");
  const compares = entries.filter((e) => e.kind === "compare");

  return [
    ...bilingual("/", released),
    ...flatNav.flatMap((item) => bilingual(item.href, released)),
    ...bilingual("/blog", latest(posts, released)),
    ...bilingual("/compare", latest(compares, released)),
    ...pair("/privacy", "/tr/gizlilik", new Date("2026-09-30")),
    ...entries.map(content),
  ];
}
