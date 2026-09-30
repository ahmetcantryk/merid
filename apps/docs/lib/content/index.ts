import type { Locale } from "@/lib/i18n/config";
import { validateLinks } from "./links";
import { readEntries } from "./load";
import type { TagId } from "./schema";
import type { ContentEntry, ContentKind, PublishedEntry } from "./types";

export type { ContentEntry, PublishedEntry } from "./types";
export { TAG_IDS, type TagId } from "./schema";

/** Today in Europe/Istanbul as YYYY-MM-DD: publish dates in the editorial calendar use that zone. */
export function today(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(now);
}

/** `BLOG_SHOW_SCHEDULED=1` renders future-dated entries (marked and noindexed) for previewing. */
export function showScheduled(): boolean {
  return process.env.BLOG_SHOW_SCHEDULED === "1";
}

function keywordOverlap(a: ContentEntry, b: ContentEntry): number {
  const words = (e: ContentEntry) => new Set(e.keywords.join(" ").toLowerCase().split(/\W+/).filter((w) => w.length > 2));
  const left = words(a);
  return [...words(b)].filter((w) => left.has(w)).length;
}

/**
 * Pairs English and Turkish entries for hreflang. A Turkish post names its English counterpart;
 * when several claim the same one, the closest by keywords wins so the pair stays reciprocal.
 * Compare pages pair by file name.
 */
function pairTranslations(en: readonly ContentEntry[], tr: readonly ContentEntry[]): Map<string, string> {
  const pairs = new Map<string, string>();
  for (const target of en) {
    const claimants = tr.filter((t) => (t.kind === "compare" ? t.name === target.name : t.alternatePath === target.url));
    const best = [...claimants].sort((a, b) => keywordOverlap(target, b) - keywordOverlap(target, a) || a.date.localeCompare(b.date))[0];
    if (!best) continue;
    pairs.set(target.url, best.url);
    pairs.set(best.url, target.url);
  }
  return pairs;
}

interface ContentIndex {
  /** Every entry on disk, visible or not: used by the link checker and to unlink pending targets. */
  readonly all: readonly ContentEntry[];
  /** Entries that get a page in this build. */
  readonly visible: readonly PublishedEntry[];
}

let cache: ContentIndex | undefined;

function build(): ContentIndex {
  const all = (["post", "compare"] as const).flatMap((kind: ContentKind) =>
    (["en", "tr"] as const).flatMap((locale) => readEntries(kind, locale)),
  );
  const now = today();
  const preview = showScheduled();
  const shown = all.filter((e) => !e.draft && (e.date <= now || preview));
  const pairs = pairTranslations(
    shown.filter((e) => e.locale === "en"),
    shown.filter((e) => e.locale === "tr"),
  );
  const visible = shown.map((e) => ({ ...e, scheduled: e.date > now, translation: pairs.get(e.url) }));
  validateLinks(all);
  return { all, visible };
}

function index(): ContentIndex {
  cache ??= build();
  return cache;
}

export function getEntries(kind: ContentKind, locale: Locale): readonly PublishedEntry[] {
  return index().visible.filter((e) => e.kind === kind && e.locale === locale);
}

export function getEntry(kind: ContentKind, locale: Locale, name: string): PublishedEntry | undefined {
  return getEntries(kind, locale).find((e) => e.name === name);
}

/** Entries that are indexable: visible and not a scheduled preview. */
export function getIndexable(kind: ContentKind, locale: Locale): readonly PublishedEntry[] {
  return getEntries(kind, locale).filter((e) => !e.scheduled);
}

export function getTags(locale: Locale): readonly TagId[] {
  return [...new Set(getEntries("post", locale).flatMap((e) => e.tags))].sort();
}

/** Site-relative URLs that currently render a page; links to anything else in the content set are unlinked. */
export function visibleUrls(): ReadonlySet<string> {
  return new Set(index().visible.map((e) => e.url));
}

/** Up to `limit` other posts sharing a tag, most shared tags first. */
export function relatedPosts(entry: PublishedEntry, limit = 3): readonly PublishedEntry[] {
  return getEntries("post", entry.locale)
    .filter((e) => e.url !== entry.url)
    .map((e) => ({ e, score: e.tags.filter((t) => entry.tags.includes(t)).length }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.e.date.localeCompare(a.e.date))
    .slice(0, limit)
    .map((r) => r.e);
}
