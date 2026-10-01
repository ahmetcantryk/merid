import { Button } from "@meridui/react";
import { colorGroups, motion, radii, shadows, spacing, typeScale } from "@/lib/tokens";
import type { Locale } from "@/lib/i18n/config";
import { colorGroupTitlesTr, colorRolesTr, foundationsUiTr, tokenUsesTr, type FoundationsUi } from "@/lib/i18n/tokens.tr";

interface LocaleProps {
  readonly locale?: Locale;
}

const foundationsUiEn: FoundationsUi = {
  token: "Token",
  light: "Light",
  dark: "Dark",
  role: "Role",
  value: "Value",
  use: "Use",
  groupTokens: (title: string) => `${title} tokens`,
  motionTokens: "Motion tokens",
  specimen: "Precise by default",
  lift: "Hover to lift 3px",
  press: "Press to sink 1px",
  tint: "Hover to tint",
};

const uiText = (locale: Locale) => (locale === "tr" ? foundationsUiTr : foundationsUiEn);

/** Returns the Turkish text for `key` when the locale is Turkish, falling back to English. */
function localized(locale: Locale, map: Readonly<Record<string, string>>, key: string, english: string): string {
  return locale === "tr" ? (map[key] ?? english) : english;
}

function Swatch({ value, theme }: { readonly value: string; readonly theme: "light" | "dark" }) {
  return (
    <span className="swatch" data-swatch-theme={theme}>
      <span className="swatch__chip" style={{ background: value }} />
      <code>{value}</code>
    </span>
  );
}

export function ColorTables({ locale = "en" }: LocaleProps = {}) {
  const ui = uiText(locale);
  return (
    <>
      {colorGroups.map((group) => {
        const title = localized(locale, colorGroupTitlesTr, group.title, group.title);
        return (
          <section key={group.title} className="token-group">
            <h3 id={`color-${group.title.toLowerCase()}`}>{title}</h3>
            <div className="table-wrap" tabIndex={0} role="region" aria-label={ui.groupTokens(title)}>
              <table className="doc-table">
                <thead>
                  <tr>
                    <th scope="col">{ui.token}</th>
                    <th scope="col">{ui.light}</th>
                    <th scope="col">{ui.dark}</th>
                    <th scope="col">{ui.role}</th>
                  </tr>
                </thead>
                <tbody>
                  {group.tokens.map((t) => (
                    <tr key={t.name}>
                      <td><code>{t.name}</code></td>
                      <td><Swatch value={t.light} theme="light" /></td>
                      <td><Swatch value={t.dark} theme="dark" /></td>
                      <td>{localized(locale, colorRolesTr, t.name, t.role)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </>
  );
}

export function TypeSpecimen({ locale = "en" }: LocaleProps = {}) {
  const ui = uiText(locale);
  return (
    <div className="type-specimen">
      {typeScale.map((t) => (
        <div key={t.name} className="type-specimen__row">
          <p
            className="type-specimen__sample"
            style={{ fontSize: t.size, lineHeight: t.lh, letterSpacing: t.track, fontWeight: t.weight, fontStretch: t.stretch }}
          >
            {ui.specimen}
          </p>
          <p className="type-specimen__meta">
            <code>{t.name}</code>
            <span>{t.spec}</span>
            <span>{localized(locale, tokenUsesTr, t.name, t.use)}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

/** Has no prose to translate; accepts `locale` for a uniform API. */
export function SpacingScale(_props: LocaleProps = {}) {
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

export function RadiusScale({ locale = "en" }: LocaleProps = {}) {
  return (
    <div className="token-tiles">
      {radii.map((r) => (
        <figure key={r.name} className="token-tile">
          <span className="token-tile__shape" style={{ borderRadius: r.value }} />
          <figcaption>
            <code>{r.name}</code>
            <span>{r.value} · {localized(locale, tokenUsesTr, r.name, r.use)}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function ShadowScale({ locale = "en" }: LocaleProps = {}) {
  return (
    <div className="token-tiles" data-surface="tray">
      {shadows.map((s) => (
        <figure key={s.name} className="token-tile">
          <span className="token-tile__shape" data-shadow style={{ boxShadow: `var(${s.name})` }} />
          <figcaption>
            <code>{s.name}</code>
            <span>{localized(locale, tokenUsesTr, s.name, s.use)}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function MotionTable({ locale = "en" }: LocaleProps = {}) {
  const ui = uiText(locale);
  return (
    <div className="table-wrap" tabIndex={0} role="region" aria-label={ui.motionTokens}>
      <table className="doc-table">
        <thead>
          <tr>
            <th scope="col">{ui.token}</th>
            <th scope="col">{ui.value}</th>
            <th scope="col">{ui.use}</th>
          </tr>
        </thead>
        <tbody>
          {motion.map((m) => (
            <tr key={m.name}>
              <td><code>{m.name}</code></td>
              <td><code>{m.value}</code></td>
              <td>{localized(locale, tokenUsesTr, m.name, m.use)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MotionDemo({ locale = "en" }: LocaleProps = {}) {
  const ui = uiText(locale);
  return (
    <div className="motion-demo">
      <button type="button" className="motion-demo__target" data-kind="lift">{ui.lift}</button>
      {/* The real Button, so the demo shows the --mrd-press token rather than a copy of it. */}
      <Button variant="secondary">{ui.press}</Button>
      <button type="button" className="motion-demo__target" data-kind="tint">{ui.tint}</button>
    </div>
  );
}
