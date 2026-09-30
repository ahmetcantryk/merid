"use client";

import { Button, IconButton, Tooltip } from "@meridui/react";

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 10V4a1 1 0 0 1 1-1h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function TooltipDemo() {
  return (
    <Tooltip content="Linki panoya kopyalar">
      <IconButton label="Linki kopyala" icon={<CopyIcon />} variant="secondary" />
    </Tooltip>
  );
}

const PLACEMENTS = ["top", "right", "bottom", "left"] as const;

const PLACEMENT_LABELS: Record<(typeof PLACEMENTS)[number], string> = {
  top: "Üstte",
  right: "Sağda",
  bottom: "Altta",
  left: "Solda",
};

export function TooltipPlacementDemo() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {PLACEMENTS.map((placement) => (
        <Tooltip key={placement} content={PLACEMENT_LABELS[placement]} placement={placement}>
          <Button variant="secondary" size="sm">
            {placement}
          </Button>
        </Tooltip>
      ))}
    </div>
  );
}
