"use client";

import { Button, EmptyState } from "@meridui/react";
import { InboxIcon, PlusIcon, SearchIcon } from "./icons";

const wrap = { width: "100%", maxWidth: 560 } as const;

export function EmptyStateDemo() {
  return (
    <div style={wrap}>
      <EmptyState
        icon={<InboxIcon />}
        title="No invoices yet"
        description="Invoices you create or receive will show up here."
        action={
          <Button variant="primary" leadingIcon={<PlusIcon />}>
            New invoice
          </Button>
        }
      />
    </div>
  );
}

export function EmptyStatePlain() {
  return (
    <div style={wrap}>
      <EmptyState
        variant="plain"
        icon={<SearchIcon />}
        title="No results for “quarterly”"
        description="Try a shorter search or check the spelling."
        action={<Button>Clear search</Button>}
        titleLevel={2}
      />
    </div>
  );
}

export function EmptyStateMinimal() {
  return (
    <div style={wrap}>
      <EmptyState title="Nothing to review" />
    </div>
  );
}
