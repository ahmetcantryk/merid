export interface PropRow {
  readonly name: string;
  readonly type: string;
  readonly default?: string;
  readonly required?: boolean;
  readonly description: string;
}

export function PropsTable({ rows }: { readonly rows: readonly PropRow[] }) {
  return (
    <div className="table-wrap" tabIndex={0} role="region" aria-label="Props">
      <table className="doc-table">
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <code>{row.name}</code>
                {row.required ? <span className="req">Required</span> : null}
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
