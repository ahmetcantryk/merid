"use client";

import { useState } from "react";
import { Switch } from "@merid/react";

const col = { display: "grid", gap: 14 } as const;

export function SwitchDemo() {
  return <Switch defaultChecked>Dark mode</Switch>;
}

export function SwitchControlled() {
  const [on, setOn] = useState(false);
  return (
    <div style={col}>
      <Switch checked={on} onCheckedChange={setOn}>
        Auto-save drafts
      </Switch>
      <span style={{ fontSize: 13, color: "var(--mrd-muted)" }}>checked: {String(on)}</span>
    </div>
  );
}

export function SwitchLabelPosition() {
  return (
    <div style={col}>
      <Switch labelPosition="start">Label at start</Switch>
      <Switch labelPosition="end">Label at end</Switch>
    </div>
  );
}

export function SwitchStates() {
  return (
    <div style={col}>
      <Switch disabled>Disabled off</Switch>
      <Switch disabled defaultChecked>
        Disabled on
      </Switch>
      <Switch aria-label="Notifications" />
    </div>
  );
}

export function SwitchForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Switch name="newsletter" value="yes" defaultChecked>
        Subscribe to newsletter
      </Switch>
    </form>
  );
}
