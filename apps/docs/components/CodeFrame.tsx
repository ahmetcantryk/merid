"use client";

import { useDictionary } from "@/lib/i18n/client";
import { CopyButton } from "./CopyButton";

interface CodeFrameProps {
  /** Highlighted markup from shiki (server-rendered, trusted). */
  readonly html: string;
  readonly code: string;
  /** Language of the code; names the scroll region for screen readers. */
  readonly lang: string;
  /** File name, shown in the bar when the code is a specific file. */
  readonly title?: string;
}

/** Chrome around a highlighted code block; client-side only so its labels follow the page locale. */
export function CodeFrame({ html, code, lang, title }: CodeFrameProps) {
  const t = useDictionary().code;
  return (
    <figure className="code-block">
      <div className="code-block__bar">
        {title ? <span className="code-block__title">{title}</span> : null}
        <CopyButton value={code} />
      </div>
      <div
        className="code-block__body"
        tabIndex={0}
        role="region"
        aria-label={t.regionLabel(title ?? lang)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
