import type { ReactNode } from "react";

type Tone = "info" | "warning" | "danger" | "success";

interface CalloutProps {
  readonly tone?: Tone;
  readonly title?: string;
  readonly children: ReactNode;
}

const LABEL: Record<Tone, string> = { info: "Note", warning: "Warning", danger: "Important", success: "Tip" };

export function Callout({ tone = "info", title, children }: CalloutProps) {
  const heading = title ?? LABEL[tone];
  return (
    <aside className="callout" data-tone={tone} aria-label={heading}>
      <span className="callout__dot" aria-hidden="true" />
      <div className="callout__body">
        <p className="callout__title">{heading}</p>
        <div className="callout__content">{children}</div>
      </div>
    </aside>
  );
}
