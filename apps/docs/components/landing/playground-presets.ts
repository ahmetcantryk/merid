/**
 * Playground presets. Colours come from the library's `data-accent` presets and
 * density from `data-density` (see @merid/react/styles/tokens.css); nothing is defined here.
 */
export const ACCENTS = [
  { id: "blue", key: "1" },
  { id: "violet", key: "2" },
  { id: "green", key: "3" },
  { id: "graphite", key: "4" },
] as const;

export const DENSITIES = [
  { id: "compact" },
  { id: "default" },
  { id: "comfortable" },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];
export type DensityId = (typeof DENSITIES)[number]["id"];
