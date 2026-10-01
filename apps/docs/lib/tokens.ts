/** Token values mirrored from DESIGN.md for documentation tables. The CSS in @meridui/react is the source of truth. */

export interface ColorToken {
  readonly name: string;
  readonly light: string;
  readonly dark: string;
  readonly role: string;
}

export const colorGroups: readonly { readonly title: string; readonly tokens: readonly ColorToken[] }[] = [
  {
    title: "Accent",
    tokens: [
      { name: "--mrd-accent", light: "#b20965", dark: "#ef86ae", role: "Interactive elements, selection, focus" },
      { name: "--mrd-accent-hover", light: "#990155", dark: "#f7a0bf", role: "Hover state of accent and links" },
      { name: "--mrd-accent-soft", light: "#fef0f4", dark: "rgba(239,134,174,.16)", role: "Selected row, icon tile, info tint" },
      { name: "--mrd-accent-strong", light: "#830549", dark: "#fcbfd3", role: "Text on accent-soft" },
      { name: "--mrd-on-accent", light: "#ffffff", dark: "#ffffff", role: "Text on accent fill" },
    ],
  },
  {
    title: "Surfaces",
    tokens: [
      { name: "--mrd-bg", light: "#ffffff", dark: "#0d0e10", role: "Page background" },
      { name: "--mrd-surface", light: "#ffffff", dark: "#141518", role: "Cards on a tray, dialogs, inputs, menus" },
      { name: "--mrd-tray", light: "#f4f6f8", dark: "#181a1d", role: "Recessed sections, cards on page, hover" },
      { name: "--mrd-tray-2", light: "#ebedf0", dark: "#202225", role: "Track on a tray, shimmer" },
      { name: "--mrd-subtle", light: "#f9fafc", dark: "#111214", role: "Window bar, detail pane, code block" },
    ],
  },
  {
    title: "Lines",
    tokens: [
      { name: "--mrd-line", light: "#dde0e3", dark: "#292b2f", role: "Every hairline" },
      { name: "--mrd-line-strong", light: "#babec3", dark: "#3f4348", role: "Dashed dropzone, checkbox and field hover border" },
      { name: "--mrd-rule", light: "#121417", dark: "#eef0f3", role: "Ink rule: top and bottom of a table, under its headings" },
    ],
  },
  {
    title: "Text",
    tokens: [
      { name: "--mrd-ink", light: "#121417", dark: "#eef0f3", role: "Headings, strong text" },
      { name: "--mrd-body", light: "#474b51", dark: "#b7bbc1", role: "Body text" },
      { name: "--mrd-muted", light: "#5f636a", dark: "#9a9fa6", role: "Meta, icons" },
      { name: "--mrd-placeholder", light: "#64686d", dark: "#989ca2", role: "Input placeholder" },
    ],
  },
  {
    title: "Status",
    tokens: [
      { name: "--mrd-danger", light: "#de3f20", dark: "#f96c4a", role: "Invalid border, status dot" },
      { name: "--mrd-danger-solid", light: "#c12b09", dark: "#c12b09", role: "Danger button fill (white text, AA)" },
      { name: "--mrd-danger-solid-hover", light: "#a52205", dark: "#a52205", role: "Danger button hover" },
      { name: "--mrd-danger-soft", light: "#fef2ee", dark: "rgba(222,63,32,.14)", role: "Error notice background" },
      { name: "--mrd-danger-strong", light: "#a52205", dark: "#fea387", role: "Error notice text" },
      { name: "--mrd-warning-soft", light: "#fff8eb", dark: "rgba(245,166,35,.12)", role: "Warning notice background" },
      { name: "--mrd-warning-strong", light: "#93580a", dark: "#f5c46b", role: "Warning notice text" },
      { name: "--mrd-success", light: "#1f9d63", dark: "#3ecf8e", role: "Success icon or dot only" },
      { name: "--mrd-success-soft", light: "#ecf8f1", dark: "rgba(62,207,142,.12)", role: "Success notice background" },
      { name: "--mrd-success-strong", light: "#17744a", dark: "#7ee2b0", role: "Success notice text" },
      { name: "--mrd-control-off", light: "#ced1d5", dark: "#35383d", role: "Switch off track" },
      { name: "--mrd-tooltip-bg", light: "#121417", dark: "#eef0f3", role: "Tooltip background" },
      { name: "--mrd-tooltip-fg", light: "#ffffff", dark: "#0d0e10", role: "Tooltip text" },
    ],
  },
];

export const typeScale = [
  { name: "--mrd-text-display", spec: "clamp(36px, 5vw, 60px) / 1 / -0.035em, width 125%", use: "Hero heading", size: "56px", lh: 1, track: "-0.035em", weight: 600, stretch: "125%" },
  { name: "--mrd-text-h2", spec: "clamp(26px, 3vw, 34px) / 1.15 / -0.025em, width 112%", use: "Section title", size: "32px", lh: 1.15, track: "-0.025em", weight: 600, stretch: "112%" },
  { name: "--mrd-text-h3", spec: "17px / 1.35 / -0.015em", use: "Card title", size: "17px", lh: 1.35, track: "-0.015em", weight: 600, stretch: "100%" },
  { name: "--mrd-text-lg", spec: "17px / 1.6", use: "Lead paragraph", size: "17px", lh: 1.6, track: "0", weight: 400, stretch: "100%" },
  { name: "--mrd-text-md", spec: "15px / 1.6", use: "Body", size: "15px", lh: 1.6, track: "0", weight: 400, stretch: "100%" },
  { name: "--mrd-text-sm", spec: "14px / 1.5", use: "Button, input, nav, list", size: "14px", lh: 1.5, track: "0", weight: 500, stretch: "100%" },
  { name: "--mrd-text-xs", spec: "13px / 1.45", use: "Small button, label, segment", size: "13px", lh: 1.45, track: "0", weight: 500, stretch: "100%" },
  { name: "--mrd-text-2xs", spec: "12.5px / 1.4", use: "Meta, helper, notes", size: "12.5px", lh: 1.4, track: "0", weight: 400, stretch: "100%" },
  { name: "--mrd-text-3xs", spec: "12px / 1.3", use: "Badge, tooltip, table heading", size: "12px", lh: 1.3, track: "0", weight: 500, stretch: "100%" },
] as const;

export const spacing = [
  ["--mrd-space-1", 4], ["--mrd-space-2", 8], ["--mrd-space-3", 12], ["--mrd-space-4", 16],
  ["--mrd-space-5", 20], ["--mrd-space-6", 24], ["--mrd-space-7", 28], ["--mrd-space-8", 32],
  ["--mrd-space-10", 40], ["--mrd-space-14", 56], ["--mrd-space-16", 64], ["--mrd-space-18", 72],
  ["--mrd-space-28", 112],
] as const;

export const radii = [
  { name: "--mrd-radius-xs", value: "2px", use: "Focus outline, skeleton, inline code, badge, checkbox" },
  { name: "--mrd-radius-sm", value: "2px", use: "Small button, tooltip, avatar" },
  { name: "--mrd-radius-md", value: "2px", use: "Icon button, menu item, nav link" },
  { name: "--mrd-radius-lg", value: "2px", use: "Button, input, select, alert, toast" },
  { name: "--mrd-radius-xl", value: "2px", use: "Popover" },
  { name: "--mrd-radius-2xl", value: "3px", use: "Menu, select list" },
  { name: "--mrd-radius-card", value: "3px", use: "Card, panel, drawer, empty state" },
  { name: "--mrd-radius-3xl", value: "4px", use: "Dialog" },
  { name: "--mrd-radius-full", value: "999px", use: "Radio, switch, slider thumb, progress" },
] as const;

export const shadows = [
  { name: "--mrd-shadow-md", value: "0 1px 0 rgba(18,20,23,.06)", use: "Card lift" },
  { name: "--mrd-shadow-lg", value: "0 18px 36px -18px rgba(18,20,23,.28)", use: "Popover, toast, tooltip" },
  { name: "--mrd-shadow-xl", value: "0 18px 36px -18px rgba(18,20,23,.28)", use: "Menu" },
  { name: "--mrd-shadow-2xl", value: "0 32px 64px -24px rgba(18,20,23,.34)", use: "Dialog" },
  { name: "--mrd-elevated-ring", value: "0 0 0 1px var(--mrd-line)", use: "Hairline around every floating surface" },
] as const;

export const motion = [
  { name: "--mrd-duration-fast", value: "80ms", use: "Press feedback" },
  { name: "--mrd-duration", value: "120ms", use: "Colour, border and shadow changes" },
  { name: "--mrd-duration-slow", value: "160ms", use: "Rotate, overlay" },
  { name: "--mrd-duration-enter", value: "180ms", use: "Overlay entering" },
  { name: "--mrd-ease", value: "cubic-bezier(.25, 0, 0, 1)", use: "Every transition" },
  { name: "--mrd-press", value: "translateY(1px)", use: "Pressed controls sink by one pixel" },
] as const;
