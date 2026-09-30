"use client";

import type { ReactNode } from "react";
import { useDictionary } from "@/lib/i18n/client";

interface DoDontProps {
  readonly do: ReactNode;
  readonly dont: ReactNode;
  readonly doTitle?: string;
  readonly dontTitle?: string;
}

export function DoDont({ do: good, dont: bad, doTitle, dontTitle }: DoDontProps) {
  const t = useDictionary().doDont;
  return (
    <div className="do-dont">
      <section className="do-dont__item" data-kind="do">
        <p className="do-dont__label">{doTitle ?? t.do}</p>
        <div className="do-dont__content">{good}</div>
      </section>
      <section className="do-dont__item" data-kind="dont">
        <p className="do-dont__label">{dontTitle ?? t.dont}</p>
        <div className="do-dont__content">{bad}</div>
      </section>
    </div>
  );
}
