"use client";

import { useDictionary } from "@/lib/i18n/client";

export interface PropRow {
  readonly name: string;
  readonly type: string;
  readonly default?: string;
  readonly required?: boolean;
  readonly description: string;
}

export function PropsTable({ rows }: { readonly rows: readonly PropRow[] }) {
  const t = useDictionary().props;
  return (
    <div className="table-wrap" tabIndex={0} role="region" aria-label={t.region}>
      <table className="doc-table">
        <thead>
          <tr>
            <th scope="col">{t.prop}</th>
            <th scope="col">{t.type}</th>
            <th scope="col">{t.default}</th>
            <th scope="col">{t.description}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <code>{row.name}</code>
                {row.required ? <span className="req">{t.required}</span> : null}
              </td>
              <td>
                <code className="type">{row.type}</code>
              </td>
              <td>{row.default ? <code>{row.default}</code> : <span className="muted">–</span>}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
