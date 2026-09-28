/**
 * Playground presets. Colours come from the library's `data-accent` presets and
 * density from `data-density` (see @merid/react/styles/tokens.css); nothing is defined here.
 */
export const ACCENTS = [
  { id: "blue", label: "Blue (default)", key: "1" },
  { id: "violet", label: "Violet", key: "2" },
  { id: "green", label: "Green", key: "3" },
  { id: "graphite", label: "Graphite", key: "4" },
] as const;

export const DENSITIES = [
  { id: "compact", label: "Compact" },
  { id: "default", label: "Default" },
  { id: "comfortable", label: "Roomy" },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];
export type DensityId = (typeof DENSITIES)[number]["id"];
