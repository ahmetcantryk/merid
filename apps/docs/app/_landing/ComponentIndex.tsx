import Link from "next/link";
import { componentCatalog } from "@/lib/components-catalog";

/** Every component as a dense typographic index, one column per group. */
export function ComponentIndex() {
  return (
    <div className="cindex">
      {componentCatalog.map((group) => (
        <section key={group.group} className="cindex__group" aria-label={group.group}>
          <h3 className="cindex__heading">
            {group.group}
            <span className="cindex__count">{String(group.items.length).padStart(2, "0")}</span>
          </h3>
          <ul>
            {group.items.map((item) => (
              <li key={item.slug}>
                <Link href={`/docs/components/${item.slug}`} title={item.description}>
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

export const componentCount = componentCatalog.reduce((sum, group) => sum + group.items.length, 0);
