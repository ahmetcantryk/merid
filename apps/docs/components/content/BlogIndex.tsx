import Link from "next/link";
import { getEntries, getTags, type TagId } from "@/lib/content";
import { getDictionary, localizePath, type Locale } from "@/lib/i18n";
import { JsonLd, breadcrumb } from "@/lib/seo/jsonld";
import { PostCard } from "./PostCard";

interface BlogIndexProps {
  readonly locale: Locale;
  /** Filters the list to one topic. */
  readonly tag?: TagId;
}

/** Blog index and tag pages: featured post, a two-column grid, and topic filters. */
export function BlogIndex({ locale, tag }: BlogIndexProps) {
  const dict = getDictionary(locale);
  const t = dict.launch.blog;
  const posts = getEntries("post", locale).filter((p) => !tag || p.tags.includes(tag));
  const tags = getTags(locale);
  const [featured, ...rest] = tag ? [undefined, ...posts] : posts;
  const title = tag ? t.tagTitle(dict.launch.tags[tag]) : t.title;
  const blogPath = localizePath("/blog", locale);
  const other: Locale = locale === "en" ? "tr" : "en";

  return (
    <div className="container blog-index">
      <JsonLd
        data={breadcrumb([
          { name: t.home, path: localizePath("/", locale) },
          { name: t.title, path: blogPath },
          ...(tag ? [{ name: dict.launch.tags[tag], path: localizePath(`/blog/tag/${tag}`, locale) }] : []),
        ])}
      />
      <header className="blog-index__head">
        <h1>{title}</h1>
        <p>{t.lead}</p>
        <a className="blog-index__rss" href={`${blogPath}/rss.xml`} type="application/rss+xml">
          {t.rss}
        </a>
      </header>

      {tags.length ? (
        <nav className="tag-filter" aria-label={t.tagsLabel}>
          <Link href={blogPath} className="tag-link" aria-current={tag ? undefined : "page"}>
            {t.allPosts}
          </Link>
          {tags.map((id) => (
            <Link
              key={id}
              href={localizePath(`/blog/tag/${id}`, locale)}
              className="tag-link"
              aria-current={id === tag ? "page" : undefined}
            >
              {dict.launch.tags[id]}
            </Link>
          ))}
        </nav>
      ) : null}

      {posts.length === 0 ? (
        <div className="blog-index__empty">
          <p>{t.empty}</p>
          <p>
            {t.emptyOther}{" "}
            <Link href={localizePath("/blog", other)} hrefLang={other} lang={other}>
              {t.otherBlog}
            </Link>
          </p>
        </div>
      ) : (
        <>
          {featured ? (
            <div className="blog-index__featured">
              <PostCard entry={featured} featured />
            </div>
          ) : null}
          {rest.length ? (
            <div className="post-grid">
              {rest.map((p) => (p ? <PostCard key={p.url} entry={p} level={featured ? 3 : 2} /> : null))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
