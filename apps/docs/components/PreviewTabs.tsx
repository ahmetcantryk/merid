"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { CopyButton } from "./CopyButton";

interface PreviewTabsProps {
  readonly preview: ReactNode;
  readonly codeHtml: string;
  readonly code: string;
  readonly align: "center" | "start";
}

const TABS = ["preview", "code"] as const;
type Tab = (typeof TABS)[number];

export function PreviewTabs({ preview, codeHtml, code, align }: PreviewTabsProps) {
  const [tab, setTab] = useState<Tab>("preview");
  const id = useId();

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next: Tab = tab === "preview" ? "code" : "preview";
    setTab(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  }

  return (
    <div className="preview">
      <div className="preview__bar">
        <div role="tablist" aria-label="Example" className="preview__tabs" onKeyDown={onKeyDown}>
          {TABS.map((t) => (
            <button
              key={t}
              id={`${id}-tab-${t}`}
              type="button"
              role="tab"
              aria-selected={tab === t}
              aria-controls={`${id}-panel-${t}`}
              tabIndex={tab === t ? 0 : -1}
              className="preview__tab"
              onClick={() => setTab(t)}
            >
              {t === "preview" ? "Preview" : "Code"}
            </button>
          ))}
        </div>
        <CopyButton value={code} />
      </div>
      <div
        id={`${id}-panel-preview`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-preview`}
        hidden={tab !== "preview"}
        className="preview__stage"
        data-align={align}
      >
        {preview}
      </div>
      <div
        id={`${id}-panel-code`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-code`}
        hidden={tab !== "code"}
        className="preview__code"
        tabIndex={0}
        dangerouslySetInnerHTML={{ __html: codeHtml }}
      />
    </div>
  );
}
