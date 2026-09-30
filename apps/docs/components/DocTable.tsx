"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useDictionary } from "@/lib/i18n/client";

/** Markdown tables: a focusable, labelled scroll region so wide tables stay keyboard-reachable. */
export function DocTable(props: ComponentPropsWithoutRef<"table">) {
  const t = useDictionary().table;
  return (
    <div className="table-wrap" tabIndex={0} role="region" aria-label={t.region}>
      <table className="doc-table" {...props} />
    </div>
  );
}
