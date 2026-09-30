"use client";

import { useDictionary } from "@/lib/i18n/client";

export interface KeyRow {
  readonly keys: readonly string[];
  readonly action: string;
}

export function KeyboardTable({ rows }: { readonly rows: readonly KeyRow[] }) {
  const t = useDictionary().keyboard;
  return (
    <div className="table-wrap" tabIndex={0} role="region" aria-label={t.region}>
      <table className="doc-table">
        <thead>
          <tr>
            <th scope="col">{t.key}</th>
            <th scope="col">{t.action}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.keys.join("+")}:${row.action}`}>
              <td className="keys">
                {row.keys.map((key) => (
                  <kbd key={key}>{key}</kbd>
                ))}
              </td>
              <td>{row.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
