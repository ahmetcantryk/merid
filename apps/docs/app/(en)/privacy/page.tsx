import Privacy from "@/content/pages/privacy.en.mdx";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo/metadata";

const t = getDictionary("en").launch.privacy;

export const metadata = buildMetadata({
  title: t.title,
  description: t.description,
  path: "/privacy",
  locale: "en",
  translation: "/tr/gizlilik",
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
