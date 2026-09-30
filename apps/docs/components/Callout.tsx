"use client";

import type { ReactNode } from "react";
import { useDictionary } from "@/lib/i18n/client";

type Tone = "info" | "warning" | "danger" | "success";

interface CalloutProps {
  readonly tone?: Tone;
  readonly title?: string;
  readonly children: ReactNode;
}


export function Callout({ tone = "info", title, children }: CalloutProps) {
  const labels = useDictionary().callout;
  const heading = title ?? labels[tone];
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
