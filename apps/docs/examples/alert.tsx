"use client";

import { useState } from "react";
import { Alert, Button, IconButton } from "@meridui/react";
import { CloseIcon } from "./icons";

const wrap = { width: "100%", maxWidth: 560, display: "grid", gap: 12 } as const;

export function AlertDemo() {
  return (
    <div style={wrap}>
      <Alert title="New version available">Reload the page to get the latest features.</Alert>
    </div>
  );
}

export function AlertTones() {
  return (
    <div style={wrap}>
      <Alert tone="info" title="Heads up">Maintenance is scheduled for Sunday 02:00 UTC.</Alert>
      <Alert tone="success" title="Payment received">Your invoice has been marked as paid.</Alert>
      <Alert tone="warning" title="Storage almost full">You have used 92% of your quota.</Alert>
      <Alert tone="danger" title="Sync failed">We could not reach the server. Check your connection.</Alert>
    </div>
  );
}

export function AlertAction() {
  const [open, setOpen] = useState(true);
  return (
    <div style={wrap}>
      {open ? (
        <Alert
          tone="warning"
          title="Trial ends in 3 days"
          action={
            <IconButton size="sm" label="Dismiss" icon={<CloseIcon />} onClick={() => setOpen(false)} />
          }
        >
          Add a payment method to keep your workspace.
        </Alert>
      ) : (
        <Button onClick={() => setOpen(true)}>Show alert</Button>
      )}
      <Alert tone="info" action={<Button size="sm">Review</Button>}>
        2 members are waiting for approval.
      </Alert>
    </div>
  );
}

export function AlertNoIcon() {
  return (
    <div style={wrap}>
      <Alert icon={null} live="off">
        Plain note without an icon or live region.
      </Alert>
    </div>
  );
}
