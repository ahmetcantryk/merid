import type { Locale } from "@/lib/i18n/config";
import type { TagId } from "./schema";

export type ContentKind = "post" | "compare";

export interface ContentEntry {
  readonly kind: ContentKind;
  readonly locale: Locale;
  /** File name without extension; the last URL segment. */
  readonly name: string;
  /** Site-relative URL, e.g. `/blog/cursor-ui-consistency` or `/tr/compare/mui-vs-merid`. */
  readonly url: string;
  /** Source path for error messages. */
  readonly file: string;
  readonly title: string;
  readonly description: string;
  readonly keywords: readonly string[];
  readonly tags: readonly TagId[];
  readonly date: string;
  readonly updated: string;
  readonly lastReviewed?: string;
  readonly author: string;
  readonly draft: boolean;
  /** Path of the English counterpart as written in a Turkish entry's frontmatter. */
  readonly alternatePath?: string;
  readonly readingMinutes: number;
  /** MDX body without frontmatter and without the leading h1. */
  readonly body: string;
}

export interface PublishedEntry extends ContentEntry {
  /** True when the publish date is still ahead and the entry is only shown because of `BLOG_SHOW_SCHEDULED=1`. */
  readonly scheduled: boolean;
  /** URL of the same entry in the other locale, when both are visible. Always reciprocal. */
  readonly translation?: string;
}
