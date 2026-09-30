"use client";

import { CopyButton } from "@/components/CopyButton";
import type { Dictionary } from "@/lib/i18n";
import { tokenCss, tokenDiff, type StudioTokens } from "./tokens";

interface StudioDiffProps {
  readonly t: Dictionary["playground"];
  readonly tokens: StudioTokens;
  readonly attrs: string;
}

/** The CSS the current settings amount to, as a diff against the defaults, ready to copy. */
export function StudioDiff({ t, tokens, attrs }: StudioDiffProps) {
  const diff = tokenDiff(tokens);
  const css = tokenCss(tokens);
  return (
    <div className="studio-diff">
      <div className="studio-diff__bar">
        <span className="studio-diff__title">{t.diffTitle}</span>
        <span className="studio-diff__count" aria-live="polite">
          {diff.length ? t.diffChanged(diff.length) : ""}
        </span>
        {css ? <CopyButton value={css} label={t.copyCss} className="copy-btn studio-diff__copy" /> : null}
      </div>
      <div className="studio-diff__body" tabIndex={0} role="region" aria-label={t.diffTitle}>
        <p className="studio-diff__attrs">
          <span className="studio-diff__muted">{t.diffAttrs}:</span> <code>{attrs}</code>
        </p>
        {diff.length === 0 ? (
          <p className="studio-diff__empty">{t.diffNone}</p>
        ) : (
          <pre className="studio-diff__code">
            <code>
              <span className="studio-diff__line">{":root {"}</span>
              {diff.map((line) => (
                <span key={line.name} className="studio-diff__pair">
                  <span className="studio-diff__line" data-sign="-">
                    {`  ${line.name}: ${line.from};`}
                  </span>
                  <span className="studio-diff__line" data-sign="+">
                    {`  ${line.name}: ${line.to};`}
                  </span>
                </span>
              ))}
              <span className="studio-diff__line">{"}"}</span>
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}
