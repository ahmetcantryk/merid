import { z } from "zod";

/** Tag ids used in post frontmatter. Labels are localized in the dictionary (`launch.tags`). */
export const TAG_IDS = [
  "comparisons",
  "ai-coding",
  "css",
  "accessibility",
  "theming",
  "design-tokens",
  "server-components",
] as const;
export type TagId = (typeof TAG_IDS)[number];

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD");
const path = z.string().startsWith("/");

/**
 * Frontmatter as written in `content/**`. Titles and descriptions are length-checked so that
 * search snippets are not truncated; a violation fails the build.
 * `alternate` is either a path or `{ en: path }` (both forms exist in the imported posts).
 */
export const Frontmatter = z.object({
  title: z.string().min(1).max(60),
  description: z.string().min(50).max(155),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  lang: z.enum(["en", "tr"]).optional(),
  canonical: path.optional(),
  alternate: z.union([path, z.object({ en: path })]).optional(),
  keywords: z.array(z.string()).min(1),
  tags: z.array(z.enum(TAG_IDS)).default([]),
  date: isoDate,
  updated: isoDate,
  lastReviewed: isoDate.optional(),
  author: z.string().min(1),
  draft: z.boolean().optional(),
});

export type FrontmatterData = z.infer<typeof Frontmatter>;
