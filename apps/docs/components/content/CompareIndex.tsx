import { getEntries } from "@/lib/content";
import { getDictionary, localizePath, type Locale } from "@/lib/i18n";
import { JsonLd, breadcrumb } from "@/lib/seo/jsonld";
import { PostCard } from "./PostCard";

/** `/compare` and `/tr/compare`: every published comparison. */
export function CompareIndex({ locale }: { readonly locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.launch.compare;
  const entries = getEntries("compare", locale);
  return (
    <div className="container blog-index">
      <JsonLd
        data={breadcrumb([
          { name: dict.launch.blog.home, path: localizePath("/", locale) },
          { name: t.title, path: localizePath("/compare", locale) },
        ])}
      />
      <header className="blog-index__head">
        <h1>{t.title}</h1>
        <p>{t.lead}</p>
      </header>
      <p className="blog-index__disclosure">{t.disclosure}</p>
      {entries.length === 0 ? (
        <p className="blog-index__empty">{t.empty}</p>
      ) : (
        <div className="post-grid">
          {entries.map((e) => (
            <PostCard key={e.url} entry={e} level={2} />
          ))}
        </div>
      )}
    </div>
  );
}
