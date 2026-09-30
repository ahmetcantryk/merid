import Privacy from "@/content/pages/privacy.tr.mdx";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo/metadata";

const t = getDictionary("tr").launch.privacy;

export const metadata = buildMetadata({
  title: t.title,
  description: t.description,
  path: "/tr/gizlilik",
  locale: "tr",
  translation: "/privacy",
});

export default function Page() {
  return (
    <div className="container prose-page">
      <article className="doc-article">
        <Privacy />
      </article>
    </div>
  );
}
