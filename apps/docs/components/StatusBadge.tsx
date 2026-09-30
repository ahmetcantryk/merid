"use client";

import { useDictionary } from "@/lib/i18n/client";

export type ComponentStatus = "stable" | "beta" | "planned" | "deprecated";

export function StatusBadge({ status }: { readonly status: ComponentStatus }) {
  const labels = useDictionary().status;
  return (
    <span className="status-badge" data-status={status}>
      {labels[status]}
    </span>
  );
}
