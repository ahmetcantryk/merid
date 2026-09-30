"use client";

import { useState } from "react";
import { Switch } from "@meridui/react";

const col = { display: "grid", gap: 14 } as const;

export function SwitchDemo() {
  return <Switch defaultChecked>Koyu tema</Switch>;
}

export function SwitchControlled() {
  const [on, setOn] = useState(false);
  return (
    <div style={col}>
      <Switch checked={on} onCheckedChange={setOn}>
        Taslakları otomatik kaydet
      </Switch>
      <span style={{ fontSize: 13, color: "var(--mrd-muted)" }}>checked: {String(on)}</span>
    </div>
  );
}

export function SwitchLabelPosition() {
  return (
    <div style={col}>
      <Switch labelPosition="start">Etiket başta</Switch>
      <Switch labelPosition="end">Etiket sonda</Switch>
    </div>
  );
}

export function SwitchStates() {
  return (
    <div style={col}>
      <Switch disabled>Devre dışı, kapalı</Switch>
      <Switch disabled defaultChecked>
        Devre dışı, açık
      </Switch>
      <Switch aria-label="Bildirimler" />
    </div>
  );
}

export function SwitchForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Switch name="newsletter" value="yes" defaultChecked>
        Bültene abone ol
      </Switch>
    </form>
  );
}
