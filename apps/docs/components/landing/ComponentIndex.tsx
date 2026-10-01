import Link from "next/link";
import { catalogFor } from "@/lib/components-catalog";
import { localizePath, type Locale } from "@/lib/i18n/config";

/** Every component as a typographic index: one ruled column per group, names only. */
export function ComponentIndex({ locale }: { readonly locale: Locale }) {
  return (
    <div className="cindex">
      {catalogFor(locale).map((group) => (
        <div key={group.group} className="cindex__group">
          <h3 className="cindex__heading">
            {group.group}
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
        </div>
      ))}
    </div>
  );
}
