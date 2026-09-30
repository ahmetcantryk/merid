import { getDictionary, htmlLang, localizePath, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { getIndexable } from "./index";

const ESCAPES: Record<string, string> = { "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" };
const esc = (value: string) => value.replace(/[<>&'"]/g, (c) => ESCAPES[c] ?? c);
const rfc822 = (iso: string) => new Date(`${iso}T06:00:00Z`).toUTCString();

/** RSS 2.0 feed of published posts, with an Atom self link. Scheduled previews are never included. */
export function rssFeed(locale: Locale): Response {
  const t = getDictionary(locale).launch.blog;
  const blog = `${site.url}${localizePath("/blog", locale)}`;
  const posts = getIndexable("post", locale);
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${site.url}${p.url}</link>
      <guid isPermaLink="true">${site.url}${p.url}</guid>
      <description>${esc(p.description)}</description>
      <pubDate>${rfc822(p.date)}</pubDate>
${p.tags.map((tag) => `      <category>${esc(tag)}</category>`).join("\n")}
    </item>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(locale === "tr" ? "Merid blog (Türkçe)" : "Merid blog")}</title>
    <link>${blog}</link>
    <description>${esc(t.description)}</description>
    <language>${htmlLang[locale]}</language>
    <atom:link href="${blog}/rss.xml" rel="self" type="application/rss+xml"/>
${posts[0] ? `    <lastBuildDate>${rfc822(posts[0].updated)}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
