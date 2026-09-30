import type { Metadata } from "next";
import { htmlLang, localizePath, ogLocale, type Locale } from "@/lib/i18n/config";
import { site } from "@/lib/site";

export interface PageSeo {
  readonly title: string;
  readonly description: string;
  /** Site-relative URL of this page; becomes the canonical. */
  readonly path: string;
  readonly locale: Locale;
  /** Site-relative URL of the same page in the other locale, when one exists. */
  readonly translation?: string;
  readonly type?: "website" | "article";
  readonly publishedTime?: string;
  readonly modifiedTime?: string;
  readonly tags?: readonly string[];
  readonly noindex?: boolean;
  /** Site-relative Open Graph image; defaults to the locale's site-wide image. */
  readonly image?: string;
}

const FEEDS: Record<Locale, { title: string; url: string }> = {
  en: { title: "Merid blog", url: "/blog/rss.xml" },
  tr: { title: "Merid blog (Türkçe)", url: "/tr/blog/rss.xml" },
};

/**
 * Metadata for pages outside the MDX docs tree (blog, compare, privacy): canonical, hreflang
 * (only for real counterparts, `x-default` = English), Open Graph, Twitter and the RSS link.
 * Relative URLs resolve against `metadataBase` from the root layout.
 */
export function buildMetadata(p: PageSeo): Metadata {
  const other: Locale = p.locale === "en" ? "tr" : "en";
  const languages: Record<string, string> = { [htmlLang[p.locale]]: p.path };
  if (p.translation) languages[htmlLang[other]] = p.translation;
  const english = p.locale === "en" ? p.path : p.translation;
  if (english) languages["x-default"] = english;
  const feed = FEEDS[p.locale];
  return {
    title: p.title,
    description: p.description,
    alternates: {
      canonical: p.path,
      languages,
      types: { "application/rss+xml": [{ url: feed.url, title: feed.title }] },
    },
    openGraph: {
      type: p.type ?? "website",
      url: p.path,
      title: p.title,
      description: p.description,
      siteName: site.name,
      locale: ogLocale[p.locale],
      images: [{ url: p.image ?? localizePath("/og.png", p.locale), width: 1200, height: 630, alt: p.title }],
      alternateLocale: p.translation ? [ogLocale[other]] : undefined,
      ...(p.type === "article" && {
        publishedTime: p.publishedTime,
        modifiedTime: p.modifiedTime,
        authors: [site.author.name],
        tags: p.tags ? [...p.tags] : undefined,
      }),
    },
    twitter: { card: "summary_large_image", title: p.title, description: p.description, images: [p.image ?? localizePath("/og.png", p.locale)] },
    robots: p.noindex ? { index: false, follow: true } : undefined,
  };
}
