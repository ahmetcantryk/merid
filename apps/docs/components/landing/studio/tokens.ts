/**
 * Token tables for the landing token studio, mirrored from @meridui/react `styles/tokens.css`
 * (the CSS stays the source of truth; e2e checks that the stage's computed values follow the controls).
 * The studio applies theme, accent and density through the library's own subtree attributes,
 * and radius and type scale as custom-property overrides. The diff shows every `--mrd-*` value
 * the current settings resolve to that differs from the defaults.
 */
export const ACCENTS = [
  { id: "magenta", key: "1" },
  { id: "petrol", key: "2" },
  { id: "brass", key: "3" },
  { id: "graphite", key: "4" },
] as const;
export const DENSITIES = ["compact", "default", "comfortable"] as const;
export const RADII = ["none", "default", "soft", "round"] as const;
export const SCALES = ["90", "100", "110"] as const;
export const THEMES = ["light", "dark", "split"] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];
export type DensityId = (typeof DENSITIES)[number];
export type RadiusId = (typeof RADII)[number];
export type ScaleId = (typeof SCALES)[number];
export type ThemeMode = (typeof THEMES)[number];

export interface StudioTokens {
  readonly theme: ThemeMode;
  readonly accent: AccentId;
  readonly density: DensityId;
  readonly radius: RadiusId;
  readonly scale: ScaleId;
}

export const DEFAULT_TOKENS: StudioTokens = { theme: "light", accent: "magenta", density: "default", radius: "default", scale: "100" };

type VarMap = Readonly<Record<string, string>>;

const NEUTRAL_DARK: VarMap = {
  "--mrd-bg": "#0d0e10",
  "--mrd-surface": "#141518",
  "--mrd-tray": "#181a1d",
  "--mrd-tray-2": "#202225",
  "--mrd-subtle": "#111214",
  "--mrd-line": "#292b2f",
  "--mrd-line-strong": "#3f4348",
  "--mrd-ink": "#eef0f3",
  "--mrd-body": "#b7bbc1",
  "--mrd-muted": "#9a9fa6",
  "--mrd-placeholder": "#989ca2",
  "--mrd-control-off": "#35383d",
  "--mrd-rule": "#eef0f3",
};
const NEUTRAL_LIGHT: VarMap = {
  "--mrd-bg": "#ffffff",
  "--mrd-surface": "#ffffff",
  "--mrd-tray": "#f4f6f8",
  "--mrd-tray-2": "#ebedf0",
  "--mrd-subtle": "#f9fafc",
  "--mrd-line": "#dde0e3",
  "--mrd-line-strong": "#babec3",
  "--mrd-ink": "#121417",
  "--mrd-body": "#474b51",
  "--mrd-muted": "#5f636a",
  "--mrd-placeholder": "#64686d",
  "--mrd-control-off": "#ced1d5",
  "--mrd-rule": "#121417",
};

/** Resolved `--mrd-accent*` per preset and mode. */
const ACCENT_VALUES: Record<AccentId, { light: VarMap; dark: VarMap }> = {
  magenta: {
    light: { "--mrd-accent": "#b20965", "--mrd-accent-hover": "#990155", "--mrd-accent-strong": "#830549", "--mrd-accent-soft": "#fef0f4", "--mrd-accent-solid": "#b20965" },
    dark: { "--mrd-accent": "#ef86ae", "--mrd-accent-hover": "#f7a0bf", "--mrd-accent-strong": "#fcbfd3", "--mrd-accent-soft": "rgb(239 134 174 / 16%)", "--mrd-accent-solid": "#b20965" },
  },
  petrol: {
    light: { "--mrd-accent": "#035f73", "--mrd-accent-hover": "#025061", "--mrd-accent-strong": "#044553", "--mrd-accent-soft": "#e9f6f9", "--mrd-accent-solid": "#035f73" },
    dark: { "--mrd-accent": "#75c4d2", "--mrd-accent-hover": "#95d3df", "--mrd-accent-strong": "#b6e0e8", "--mrd-accent-soft": "rgb(117 196 210 / 14%)", "--mrd-accent-solid": "#035f73" },
  },
  brass: {
    light: { "--mrd-accent": "#855c01", "--mrd-accent-hover": "#744e01", "--mrd-accent-strong": "#624003", "--mrd-accent-soft": "#f9f5eb", "--mrd-accent-solid": "#855c01" },
    dark: { "--mrd-accent": "#d9b165", "--mrd-accent-hover": "#e5c68a", "--mrd-accent-strong": "#ecd9ae", "--mrd-accent-soft": "rgb(217 177 101 / 14%)", "--mrd-accent-solid": "#855c01" },
  },
  graphite: {
    light: { "--mrd-accent": "#3d4350", "--mrd-accent-hover": "#2e333d", "--mrd-accent-strong": "#22262e", "--mrd-accent-soft": "#eef0f3", "--mrd-accent-solid": "#3d4350" },
    dark: { "--mrd-accent": "#c9cdd4", "--mrd-accent-hover": "#d6d9df", "--mrd-accent-strong": "#e4e6ea", "--mrd-accent-soft": "rgb(201 205 212 / 12%)", "--mrd-accent-solid": "#3d4350" },
  },
};

const DENSITY_VALUES: Record<DensityId, Readonly<Record<string, number>>> = {
  compact: { "--mrd-control-md": 28, "--mrd-input-md": 28, "--mrd-icon-button-md": 24, "--mrd-pill": 24, "--mrd-control-pad-md": 10, "--mrd-input-pad": 8, "--mrd-text-sm": 13, "--mrd-text-xs": 12 },
  default: { "--mrd-control-md": 32, "--mrd-input-md": 32, "--mrd-icon-button-md": 28, "--mrd-pill": 28, "--mrd-control-pad-md": 12, "--mrd-input-pad": 10, "--mrd-text-sm": 14, "--mrd-text-xs": 13 },
  comfortable: { "--mrd-control-md": 36, "--mrd-input-md": 36, "--mrd-icon-button-md": 32, "--mrd-pill": 32, "--mrd-control-pad-md": 14, "--mrd-input-pad": 12, "--mrd-text-sm": 14.5, "--mrd-text-xs": 13.5 },
};

const RADIUS_NAMES = [
  "--mrd-radius-xs",
  "--mrd-radius-sm",
  "--mrd-radius-md",
  "--mrd-radius-lg",
  "--mrd-radius-xl",
  "--mrd-radius-2xl",
  "--mrd-radius-card",
  "--mrd-radius-3xl",
] as const;
/** Radius steps per option, xs to 3xl. `default` is the library's own scale. */
const RADIUS_STEPS: Record<RadiusId, readonly number[]> = {
  none: [0, 0, 0, 0, 0, 0, 0, 0],
  default: [2, 2, 2, 2, 2, 3, 3, 4],
  soft: [4, 6, 6, 8, 10, 12, 14, 16],
  round: [6, 10, 10, 12, 14, 18, 20, 24],
};
const radiusMap = (id: RadiusId): Record<string, number> =>
  Object.fromEntries(RADIUS_NAMES.map((name, i) => [name, RADIUS_STEPS[id][i] ?? 0]));

/** Sizes the type scale multiplies; `--mrd-text-sm` / `-xs` come from the density table. */
const TEXT_BASE: Readonly<Record<string, number>> = {
  "--mrd-text-h3": 17,
  "--mrd-text-lg": 17,
  "--mrd-text-md": 15,
  "--mrd-text-2xs": 12.5,
  "--mrd-text-3xs": 12,
};

const px = (n: number) => `${Math.round(n * 100) / 100}px`;

/** Overrides set inline on the stage: radius and type scale (theme, accent, density use attributes). */
export function stageStyle(t: StudioTokens): Record<string, string> {
  const style: Record<string, string> = {};
  if (t.radius !== "default") {
    for (const [name, value] of Object.entries(radiusMap(t.radius))) style[name] = px(value);
  }
  if (t.scale !== "100") {
    const factor = Number(t.scale) / 100;
    for (const [name, value] of Object.entries(TEXT_BASE)) style[name] = px(value * factor);
    for (const name of ["--mrd-text-sm", "--mrd-text-xs"]) style[name] = px((DENSITY_VALUES[t.density][name] ?? 14) * factor);
  }
  return style;
}

/** Every token value the settings resolve to, for one mode. */
function resolve(t: StudioTokens, mode: "light" | "dark"): Record<string, string> {
  const out: Record<string, string> = {};
  Object.assign(out, mode === "dark" ? NEUTRAL_DARK : NEUTRAL_LIGHT, ACCENT_VALUES[t.accent][mode]);
  for (const [name, value] of Object.entries(DENSITY_VALUES[t.density])) out[name] = px(value);
  for (const [name, value] of Object.entries(radiusMap("default"))) out[name] = px(value);
  for (const [name, value] of Object.entries(TEXT_BASE)) out[name] = px(value);
  return { ...out, ...stageStyle(t) };
}

export interface DiffLine {
  readonly name: string;
  readonly from: string;
  readonly to: string;
}

/** Tokens whose value differs from the defaults. Split mode keeps both themes, so it diffs the light half. */
export function tokenDiff(t: StudioTokens): readonly DiffLine[] {
  const mode = t.theme === "dark" ? "dark" : "light";
  const base = resolve(DEFAULT_TOKENS, "light");
  const next = resolve(t, mode);
  return Object.keys(next)
    .filter((name) => next[name] !== base[name])
    .map((name) => ({ name, from: base[name] ?? "", to: next[name] ?? "" }));
}

/** Copyable CSS for the current settings. */
export function tokenCss(t: StudioTokens): string {
  const lines = tokenDiff(t).map((l) => `  ${l.name}: ${l.to};`);
  return lines.length ? `:root {\n${lines.join("\n")}\n}\n` : "";
}
