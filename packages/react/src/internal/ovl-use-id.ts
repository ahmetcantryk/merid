"use client";

import { useId as useReactId } from "react";

/** Returns `provided` when given, otherwise a stable `mrd-` prefixed id. */
export function useId(provided?: string, prefix = "mrd"): string {
  const generated = useReactId().replace(/[^a-zA-Z0-9_-]/g, "");
  return provided ?? `${prefix}-${generated}`;
}
