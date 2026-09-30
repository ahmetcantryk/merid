"use client";

import { useDictionary } from "@/lib/i18n/client";
import { CopyButton } from "./CopyButton";

interface CodeFrameProps {
  /** Highlighted markup from shiki (server-rendered, trusted). */
  readonly html: string;
  readonly code: string;
  /** File name or language shown in the bar. */
  readonly name: string;
}

/** Chrome around a highlighted code block; client-side only so its labels follow the page locale. */
export function CodeFrame({ html, code, name }: CodeFrameProps) {
  const t = useDictionary().code;
  return (
    <figure className="code-block">
      <div className="code-block__bar">
        <span className="code-block__title">{name}</span>
        <CopyButton value={code} />
      </div>
      <div
        className="code-block__body"
        tabIndex={0}
        role="region"
        aria-label={t.regionLabel(name)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
