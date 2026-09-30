import Link from "next/link";
import { Alert } from "@meridui/react";
import { OnThisPage } from "@/components/OnThisPage";
import { formatDate } from "@/lib/content/format";
import { relatedPosts, type PublishedEntry } from "@/lib/content";
import { renderContent } from "@/lib/content/render";
import { getDictionary, htmlLang, localizePath, type Locale } from "@/lib/i18n";
import { JsonLd, article, breadcrumb, softwareSourceCode } from "@/lib/seo/jsonld";
import { site } from "@/lib/site";
import { ContentCta } from "./ContentCta";
import { EntryBreadcrumb } from "./EntryBreadcrumb";
import { PostCard } from "./PostCard";

const OTHER_LANGUAGE: Record<Locale, { label: string; lang: Locale }> = {
  en: { label: "Bu yazının Türkçesi", lang: "tr" },
  tr: { label: "Read this in English", lang: "en" },
};

/** A blog post or a compare page: header, MDX body with breakout tables and code, TOC, CTA, related posts. */
export async function EntryPage({ entry }: { readonly entry: PublishedEntry }) {
  const locale = entry.locale;
  const dict = getDictionary(locale);
  const t = dict.launch.blog;
  const isPost = entry.kind === "post";
  const section = isPost
    ? { name: t.title, path: localizePath("/blog", locale) }
    : { name: dict.launch.compare.title, path: localizePath("/compare", locale) };
  const trail = [{ name: t.home, path: localizePath("/", locale) }, section, { name: entry.title, path: entry.url }];
  const content = await renderContent(entry.body, entry.file, locale);
  const related = isPost ? relatedPosts(entry) : [];
  const other = OTHER_LANGUAGE[locale];

  const schema = isPost
    ? [
        article({
          title: entry.title,
          description: entry.description,
          path: entry.url,
          lang: htmlLang[locale],
          date: entry.date,
          updated: entry.updated,
          image: `${entry.url}/og.png`,
          keywords: entry.keywords,
        }),
        breadcrumb(trail),
      ]
    : [softwareSourceCode(dict.meta.description), breadcrumb(trail)];

  return (
    <div className="entry-shell">
      <JsonLd data={schema} />
      <article className="entry" data-kind={entry.kind}>
        <header className="entry__header">
          <EntryBreadcrumb label={t.breadcrumb} trail={trail} />

          {entry.tags.length ? (
            <ul className="entry__tags" aria-label={t.tagsLabel}>
              {entry.tags.map((tag) => (
                <li key={tag}>
                  <Link href={localizePath(`/blog/tag/${tag}`, locale)} className="tag-link">
                    {dict.launch.tags[tag]}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <h1 className="entry__title">{entry.title}</h1>
          <p className="entry__lead">{entry.description}</p>
          <p className="entry__meta">
            <span>{entry.author}</span>
            <time dateTime={entry.date}>{formatDate(entry.date, locale)}</time>
            <span>{t.minutes(entry.readingMinutes)}</span>
            {entry.lastReviewed && entry.lastReviewed !== entry.date ? (
              <span>
                {t.lastReviewed} <time dateTime={entry.lastReviewed}>{formatDate(entry.lastReviewed, locale)}</time>
              </span>
            ) : null}
            {entry.translation ? (
              <a href={entry.translation} hrefLang={htmlLang[other.lang]} lang={htmlLang[other.lang]} className="entry__translation">
                {other.label}
              </a>
            ) : null}
          </p>
          {entry.scheduled ? (
            <Alert tone="warning" title={t.scheduled} className="entry__scheduled">
              {t.scheduledNote(formatDate(entry.date, locale))}
            </Alert>
          ) : null}
          {!isPost ? (
            <p className="entry__disclosure">
              {dict.launch.compare.disclosure}{" "}
              <a href={`${site.repo}/issues/new?title=${encodeURIComponent(`Compare page: ${entry.url}`)}`}>
                {dict.launch.compare.reportIssue}
              </a>
            </p>
          ) : null}
        </header>

        <div className="entry__body doc-article">{content}</div>

        <footer className="entry__footer">
          <ContentCta />
          {related.length ? (
            <section className="entry__related" aria-labelledby="related-title">
              <h2 id="related-title" className="entry__related-title">
                {t.related}
              </h2>
              <div className="post-grid">
                {related.map((p) => (
                  <PostCard key={p.url} entry={p} />
                ))}
              </div>
            </section>
          ) : null}
        </footer>
      </article>
      <OnThisPage />
    </div>
  );
}

