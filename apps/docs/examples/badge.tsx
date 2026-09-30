"use client";

import { Badge } from "@meridui/react";

export function BadgeDemo() {
  return (
    <Badge tone="success" dot>
      Active
    </Badge>
  );
}

export function BadgeTones() {
  return (
    <>
      <Badge>Neutral</Badge>
      <Badge tone="accent">Accent</Badge>
      <Badge tone="success">Success</Badge>
      <Badge tone="warning">Warning</Badge>
      <Badge tone="danger">Danger</Badge>
      <Badge tone="solid">Solid</Badge>
    </>
  );
}

export function BadgeDots() {
  return (
    <>
      <Badge tone="success" dot>Online</Badge>
      <Badge tone="warning" dot>Degraded</Badge>
      <Badge tone="danger" dot>Down</Badge>
    </>
  );
}

export function BadgeCount() {
  return <Badge tone="accent">12</Badge>;
}
