"use client";

import type { ReactNode } from "react";
import { Button, Kbd, SegmentedControl } from "@meridui/react";
import type { Dictionary } from "@/lib/i18n";
import { ACCENTS, DENSITIES, RADII, SCALES, THEMES, type StudioTokens } from "./tokens";

type Strings = Dictionary["playground"];
export type ControlName = keyof StudioTokens;

interface StudioControlsProps {
  readonly t: Strings;
  readonly tokens: StudioTokens;
  readonly onChange: (control: ControlName, value: string) => void;
  readonly onReset: () => void;
  readonly canReset: boolean;
}

function Row({ label, hint, id, children }: { label: string; hint?: ReactNode; id?: string; children: ReactNode }) {
  return (
    <div className="studio-ctl">
      <div className="studio-ctl__head">
        <span className="studio-ctl__label" id={id}>
          {label}
        </span>
        {hint ? (
          <span className="studio-ctl__hint" aria-hidden="true">
            {hint}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

/** Left panel: every control is a stock @meridui/react component except the accent swatches (a radio group). */
export function StudioControls({ t, tokens, onChange, onReset, canReset }: StudioControlsProps) {
  const themeLabel = { light: t.themeLight, dark: t.themeDark, split: t.themeSplit } as const;
  return (
    <div className="studio-controls" role="group" aria-label={t.settings}>
      <div className="studio-controls__head">
        <p className="studio-controls__title">{t.editorTitle}</p>
        <Button variant="ghost" size="sm" onClick={onReset} disabled={!canReset}>
          {t.reset}
        </Button>
      </div>

      <Row label={t.theme} hint={<Kbd size="sm">T</Kbd>}>
        <SegmentedControl
          aria-label={t.theme}
          fullWidth
          options={THEMES.map((v) => ({ value: v, label: themeLabel[v] }))}
          value={tokens.theme}
          onValueChange={(v) => onChange("theme", v)}
        />
      </Row>

      <Row
        label={t.accent}
        id="studio-accent-label"
        hint={
          <>
            <Kbd size="sm">1</Kbd>–<Kbd size="sm">4</Kbd>
          </>
        }
      >
        <div className="studio-swatches" role="radiogroup" aria-labelledby="studio-accent-label">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              role="radio"
              aria-checked={tokens.accent === a.id}
              aria-label={t.accents[a.id]}
              title={t.accents[a.id]}
              className="studio-swatch"
              data-accent={a.id}
              onClick={() => onChange("accent", a.id)}
            />
          ))}
        </div>
      </Row>

      <Row label={t.radius} hint={<Kbd size="sm">R</Kbd>}>
        <SegmentedControl
          aria-label={t.radius}
          fullWidth
          options={RADII.map((v) => ({ value: v, label: t.radii[v] }))}
          value={tokens.radius}
          onValueChange={(v) => onChange("radius", v)}
        />
      </Row>

      <Row label={t.density} hint={<Kbd size="sm">D</Kbd>}>
        <SegmentedControl
          aria-label={t.density}
          fullWidth
          options={DENSITIES.map((v) => ({ value: v, label: t.densities[v] }))}
          value={tokens.density}
          onValueChange={(v) => onChange("density", v)}
        />
      </Row>

      <Row label={t.scale}>
        <SegmentedControl
          aria-label={t.scale}
          fullWidth
          options={SCALES.map((v) => ({ value: v, label: `${v}%` }))}
          value={tokens.scale}
          onValueChange={(v) => onChange("scale", v)}
        />
      </Row>

      <p className="studio-controls__note">{t.editorNote}</p>
    </div>
  );
}
