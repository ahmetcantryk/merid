import type { Metadata } from "next";
import { getDictionary, localizePath, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo/metadata";
import { TAG_IDS, getEntries, getEntry, type TagId } from "./index";
import type { ContentKind } from "./types";

/**
 * Shared route logic for `/blog`, `/compare` and their Turkish twins. Each `app/**` route file is a
 * thin wrapper that passes its locale, so both languages render from the same components.
 */
export function entryParams(kind: ContentKind, locale: Locale): { slug: string }[] {
  return getEntries(kind, locale).map((e) => ({ slug: e.name }));
}

export function entryMetadata(kind: ContentKind, locale: Locale, slug: string): Metadata {
  const entry = getEntry(kind, locale, slug);
  if (!entry) return {};
  return buildMetadata({
    title: entry.title,
    description: entry.description,
    path: entry.url,
    locale,
    translation: entry.translation,
    type: kind === "post" ? "article" : "website",
    publishedTime: entry.date,
    modifiedTime: entry.updated,
    tags: entry.keywords,
    noindex: entry.scheduled,
    image: `${entry.url}/og.png`,
  });
}

export function blogIndexMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale).launch.blog;
  return buildMetadata({
    title: t.metaTitle,
    description: t.description,
    path: localizePath("/blog", locale),
    locale,
    translation: localizePath("/blog", locale === "en" ? "tr" : "en"),
  });
}

export function compareIndexMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale).launch.compare;
  return buildMetadata({
    title: t.metaTitle,
    description: t.description,
    path: localizePath("/compare", locale),
    locale,
    translation: localizePath("/compare", locale === "en" ? "tr" : "en"),
  });
}

export function tagParams(): { tag: TagId }[] {
  return TAG_IDS.map((tag) => ({ tag }));
}

export function isTag(value: string): value is TagId {
  return (TAG_IDS as readonly string[]).includes(value);
}

/** Tag pages are thin lists: crawlable for links, kept out of the index and the sitemap. */
export function tagMetadata(locale: Locale, tag: string): Metadata {
  if (!isTag(tag)) return {};
  const dict = getDictionary(locale);
  const label = dict.launch.tags[tag];
  return buildMetadata({
    title: dict.launch.blog.tagTitle(label),
    description: dict.launch.blog.tagDescription(label),
    path: localizePath(`/blog/tag/${tag}`, locale),
    locale,
    translation: localizePath(`/blog/tag/${tag}`, locale === "en" ? "tr" : "en"),
    noindex: true,
  });
}
