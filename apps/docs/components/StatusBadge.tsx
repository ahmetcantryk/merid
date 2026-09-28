export type ComponentStatus = "stable" | "beta" | "planned" | "deprecated";

const LABEL: Record<ComponentStatus, string> = {
  stable: "Stable",
  beta: "Beta",
  planned: "Planned",
  deprecated: "Deprecated",
};

export function StatusBadge({ status }: { readonly status: ComponentStatus }) {
  return (
    <span className="status-badge" data-status={status}>
      {LABEL[status]}
    </span>
  );
}
