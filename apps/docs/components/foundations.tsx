import { colorGroups, motion, radii, shadows, spacing, typeScale } from "@/lib/tokens";

function Swatch({ value, theme }: { readonly value: string; readonly theme: "light" | "dark" }) {
  return (
    <span className="swatch" data-swatch-theme={theme}>
      <span className="swatch__chip" style={{ background: value }} />
      <code>{value}</code>
    </span>
  );
}

export function ColorTables() {
  return (
    <>
      {colorGroups.map((group) => (
        <section key={group.title} className="token-group">
          <h3 id={`color-${group.title.toLowerCase()}`}>{group.title}</h3>
          <div className="table-wrap">
            <table className="doc-table">
              <thead>
                <tr>
                  <th scope="col">Token</th>
                  <th scope="col">Light</th>
                  <th scope="col">Dark</th>
                  <th scope="col">Role</th>
                </tr>
              </thead>
              <tbody>
                {group.tokens.map((t) => (
                  <tr key={t.name}>
                    <td><code>{t.name}</code></td>
                    <td><Swatch value={t.light} theme="light" /></td>
                    <td><Swatch value={t.dark} theme="dark" /></td>
                    <td>{t.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </>
  );
}

export function TypeSpecimen() {
  return (
    <div className="type-specimen">
      {typeScale.map((t) => (
        <div key={t.name} className="type-specimen__row">
          <p
            className="type-specimen__sample"
            style={{ fontSize: t.size, lineHeight: t.lh, letterSpacing: t.track, fontWeight: t.weight }}
          >
            Precise by default
          </p>
          <p className="type-specimen__meta">
            <code>{t.name}</code>
            <span>{t.spec}</span>
            <span>{t.use}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

export function SpacingScale() {
  return (
    <div className="scale-list">
      {spacing.map(([name, px]) => (
        <div key={name} className="scale-list__row">
          <code>{name}</code>
          <span className="scale-list__value">{px}px</span>
          <span className="scale-list__bar" style={{ width: px }} />
        </div>
      ))}
    </div>
  );
}

export function RadiusScale() {
  return (
    <div className="token-tiles">
      {radii.map((r) => (
        <figure key={r.name} className="token-tile">
          <span className="token-tile__shape" style={{ borderRadius: r.value }} />
          <figcaption>
            <code>{r.name}</code>
            <span>{r.value} · {r.use}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function ShadowScale() {
  return (
    <div className="token-tiles" data-surface="tray">
      {shadows.map((s) => (
        <figure key={s.name} className="token-tile">
          <span className="token-tile__shape" data-shadow style={{ boxShadow: `var(${s.name})` }} />
          <figcaption>
            <code>{s.name}</code>
            <span>{s.use}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function MotionTable() {
  return (
    <div className="table-wrap">
      <table className="doc-table">
        <thead>
          <tr>
            <th scope="col">Token</th>
            <th scope="col">Value</th>
            <th scope="col">Use</th>
          </tr>
        </thead>
        <tbody>
          {motion.map((m) => (
            <tr key={m.name}>
              <td><code>{m.name}</code></td>
              <td><code>{m.value}</code></td>
              <td>{m.use}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MotionDemo() {
  return (
    <div className="motion-demo">
      <button type="button" className="motion-demo__target" data-kind="lift">Hover to lift 3px</button>
      <button type="button" className="motion-demo__target" data-kind="press">Press to scale .97</button>
      <button type="button" className="motion-demo__target" data-kind="tint">Hover to tint</button>
    </div>
  );
}
