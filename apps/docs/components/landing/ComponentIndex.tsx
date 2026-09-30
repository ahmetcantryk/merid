import Link from "next/link";
import { catalogFor } from "@/lib/components-catalog";
import { localizePath, type Locale } from "@/lib/i18n/config";

/** Every component as a dense typographic index, one column per group. */
export function ComponentIndex({ locale }: { readonly locale: Locale }) {
  return (
    <div className="cindex">
      {catalogFor(locale).map((group) => (
        <section key={group.group} className="cindex__group" aria-label={group.group}>
          <h3 className="cindex__heading">
            {group.group}
            <span className="cindex__count">{String(group.items.length).padStart(2, "0")}</span>
          </h3>
          <ul>
            {group.items.map((item) => (
              <li key={item.slug}>
                <Link href={localizePath(`/docs/components/${item.slug}`, locale)} title={item.description}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
