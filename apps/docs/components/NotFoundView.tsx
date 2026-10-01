import Link from "next/link";
import { getDictionary, localizePath, type Locale } from "@/lib/i18n";

export function NotFoundView({ locale }: { readonly locale: Locale }) {
  const t = getDictionary(locale).notFound;
  return (
    <section className="not-found">
      <div className="container">
        <p className="not-found__code">404</p>
        <h1>{t.heading}</h1>
        <p>{t.body}</p>
        <div className="not-found__actions">
          <Link href={localizePath("/docs/introduction", locale)} className="btn" data-variant="primary">
            {t.docs}
          </Link>
          <Link href={localizePath("/", locale)} className="btn" data-variant="secondary">
            {t.home}
          </Link>
        </div>
      </div>
    </section>
  );
}
