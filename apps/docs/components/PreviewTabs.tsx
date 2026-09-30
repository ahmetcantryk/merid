"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { useDictionary } from "@/lib/i18n/client";
import { CopyButton } from "./CopyButton";

interface PreviewTabsProps {
  /** Live example; when omitted a "coming soon" note renders. */
  readonly preview?: ReactNode;
  readonly codeHtml: string;
  readonly code: string;
  readonly align: "center" | "start";
}

const TABS = ["preview", "code"] as const;
type Tab = (typeof TABS)[number];

export function PreviewTabs({ preview, codeHtml, code, align }: PreviewTabsProps) {
  const [tab, setTab] = useState<Tab>("preview");
  const id = useId();
  const t = useDictionary().preview;

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
        <div role="tablist" aria-label={t.tablist} className="preview__tabs" onKeyDown={onKeyDown}>
          {TABS.map((tabId) => (
            <button
              key={tabId}
              id={`${id}-tab-${tabId}`}
              type="button"
              role="tab"
              aria-selected={tab === tabId}
              aria-controls={`${id}-panel-${tabId}`}
              tabIndex={tab === tabId ? 0 : -1}
              className="preview__tab"
              onClick={() => setTab(tabId)}
            >
              {tabId === "preview" ? t.preview : t.code}
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
        {preview ?? <p className="preview-pending">{t.pending}</p>}
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
