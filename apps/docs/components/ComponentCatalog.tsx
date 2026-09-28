import { Fragment } from "react";
import { componentCatalog } from "@/lib/components-catalog";
import { slugify } from "@/lib/slug";
import { StatusBadge } from "./StatusBadge";

export function ComponentCatalog() {
  return (
    <>
      {componentCatalog.map((group) => (
        <Fragment key={group.group}>
          <h2 id={slugify(group.group)}>{group.group}</h2>
          <div className="component-group">
            {group.items.map((item) => (
              // TODO(component-pages): link each row to /docs/components/<slug> when its page is generated.
              <div key={item.name} className="component-row">
                <span className="component-row__name">{item.name}</span>
                <span className="component-row__desc">{item.description}</span>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </Fragment>
      ))}
    </>
  );
}
