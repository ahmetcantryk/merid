/** A solid hex colour, or a translucent `[rgb, alpha]` fill composited over the surface it sits on. */
export type Fill = string | readonly [readonly [number, number, number], number];

export interface PresetMode {
  readonly accent: string;
  readonly solid: string;
  readonly solidHover: string;
  readonly strong: string;
  readonly soft: Fill;
  /** Only for presets that move the warning tone: `[strong, soft]`. */
  readonly warning?: readonly [string, Fill];
}

export interface NeutralMode {
  readonly bg: string;
  readonly surface: string;
  readonly tray: string;
  readonly subtle: string;
  readonly ink: string;
  readonly muted: string;
  readonly placeholder: string;
  readonly body: string;
  readonly dangerSolid: string;
  readonly dangerSolidHover: string;
  readonly danger: readonly [string, Fill];
  readonly warning: readonly [string, Fill];
  readonly success: readonly [string, Fill];
}

export interface Row {
  readonly group: string;
  readonly mode: "light" | "dark";
  readonly cells: Readonly<Record<string, number>>;
}

export const AA: number;
export function ratio(a: string, b: string): number;
export const PRESETS: Readonly<Record<string, { readonly light: PresetMode; readonly dark: PresetMode }>>;
export const NEUTRALS: { readonly light: NeutralMode; readonly dark: NeutralMode };
export function measure(): Row[];
export function failures(rows?: readonly Row[]): Row[];
