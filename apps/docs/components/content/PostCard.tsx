import Link from "next/link";
import { Badge } from "@meridui/react";
import type { PublishedEntry } from "@/lib/content";
import { formatDate } from "@/lib/content/format";
import { getDictionary } from "@/lib/i18n";

interface PostCardProps {
  readonly entry: PublishedEntry;
  /** The lead post on the index: larger title, full description. */
  readonly featured?: boolean;
  /** Heading level inside the page outline; defaults to 2 when featured, otherwise 3. */
  readonly level?: 2 | 3;
}

/** A post in a list. The whole card is one link; tags are plain text so there are no nested links. */
export function PostCard({ entry, featured = false, level }: PostCardProps) {
  const t = getDictionary(entry.locale).launch;
  const Heading = (level ?? (featured ? 2 : 3)) === 2 ? "h2" : "h3";
  return (
    <article className="post-card" data-featured={featured || undefined}>
      <p className="post-card__meta">
        <time dateTime={entry.date}>{formatDate(entry.date, entry.locale)}</time>
        <span>{t.blog.minutes(entry.readingMinutes)}</span>
        {entry.scheduled ? <Badge tone="warning">{t.blog.scheduled}</Badge> : null}
      </p>
      <Heading className="post-card__title">
        <Link href={entry.url} className="post-card__link">
          {entry.title}
        </Link>
      </Heading>
      <p className="post-card__text">{entry.description}</p>
      {entry.tags.length ? (
        <p className="post-card__tags">{entry.tags.map((tag) => t.tags[tag]).join(" · ")}</p>
      ) : null}
    </article>
  );
}
