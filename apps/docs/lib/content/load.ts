import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import type { Locale } from "@/lib/i18n/config";
import { Frontmatter } from "./schema";
import type { ContentEntry, ContentKind } from "./types";

const ROOT = join(process.cwd(), "content");
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const LEADING_H1 = /^\s*#\s+[^\n]*\n+/;

function urlFor(kind: ContentKind, locale: Locale, name: string): string {
  const prefix = locale === "tr" ? "/tr" : "";
  return kind === "post" ? `${prefix}/blog/${name}` : `${prefix}/compare/${name}`;
}

/** Words in the body, ignoring fenced code, for a reading-time estimate (220 wpm). */
function readingMinutes(body: string): number {
  const prose = body.replace(/```[\s\S]*?```/g, "");
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function parseFile(kind: ContentKind, locale: Locale, file: string): ContentEntry {
  const where = `content/${kind === "post" ? "blog" : "compare"}/${locale}/${file}`;
  const source = readFileSync(join(ROOT, kind === "post" ? "blog" : "compare", locale, file), "utf8");
  const match = FRONTMATTER.exec(source);
  if (!match) throw new Error(`[content] ${where}: missing frontmatter`);
  const parsed = Frontmatter.safeParse(parseYaml(match[1] ?? ""));
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`[content] ${where}: invalid frontmatter (${issues})`);
  }
  const fm = parsed.data;
  if (fm.lang && fm.lang !== locale) throw new Error(`[content] ${where}: lang "${fm.lang}" does not match its folder`);

  const name = file.replace(/\.mdx$/, "");
  // Posts are addressed by their slug; compare pages by file name (their frontmatter slug is the source post's).
  if (kind === "post" && fm.slug !== name) throw new Error(`[content] ${where}: slug "${fm.slug}" must match the file name`);
  const url = urlFor(kind, locale, name);
  if (fm.canonical && fm.canonical !== url) {
    throw new Error(`[content] ${where}: canonical "${fm.canonical}" does not match its route "${url}"`);
  }

  // The page header renders the title as the only h1, so a leading "# Title" line is dropped.
  const body = source.slice(match[0].length).replace(LEADING_H1, "");
  if (/^#\s/m.test(body.replace(/```[\s\S]*?```/g, ""))) {
    throw new Error(`[content] ${where}: body contains a second h1; use ## for sections`);
  }

  const alternate = typeof fm.alternate === "string" ? fm.alternate : fm.alternate?.en;
  return {
    kind,
    locale,
    name,
    url,
    file: where,
    title: fm.title,
    description: fm.description,
    keywords: fm.keywords,
    tags: fm.tags,
    date: fm.date,
    updated: fm.updated,
    lastReviewed: fm.lastReviewed,
    author: fm.author,
    draft: fm.draft ?? false,
    alternatePath: alternate,
    readingMinutes: readingMinutes(body),
    body,
  };
}

/** Every entry of a kind and locale on disk, newest first, regardless of publish date. */
export function readEntries(kind: ContentKind, locale: Locale): ContentEntry[] {
  const dir = join(ROOT, kind === "post" ? "blog" : "compare", locale);
  let files: string[];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  } catch (error) {
    throw new Error(`[content] cannot read ${dir}: ${(error as Error).message}`);
  }
  return files
    .map((file) => parseFile(kind, locale, file))
    .sort((a, b) => b.date.localeCompare(a.date) || a.name.localeCompare(b.name));
}
