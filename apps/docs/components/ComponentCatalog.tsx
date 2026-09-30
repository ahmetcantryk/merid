import Link from "next/link";
import { Fragment } from "react";
import { catalogFor } from "@/lib/components-catalog";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { slugify } from "@/lib/slug";
import { StatusBadge } from "./StatusBadge";

/** Used from MDX: `<ComponentCatalog />` on the English page, `<ComponentCatalog locale="tr" />` on the Turkish one. */
export function ComponentCatalog({ locale = "en" }: { readonly locale?: Locale }) {
  return (
    <>
      {catalogFor(locale).map((group) => (
        <Fragment key={group.group}>
          <h2 id={slugify(group.group)}>{group.group}</h2>
          <div className="component-group">
            {group.items.map((item) => (
              <Link key={item.name} href={localizePath(`/docs/components/${item.slug}`, locale)} className="component-row">
                <span className="component-row__name">{item.name}</span>
                <span className="component-row__desc">{item.description}</span>
                <StatusBadge status={item.status} />
              </Link>
            ))}
          </div>
        </Fragment>
      ))}
    </>
  );
}
