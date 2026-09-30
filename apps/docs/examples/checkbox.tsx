"use client";

import { useState } from "react";
import { Checkbox } from "@meridui/react";

const col = { display: "grid", gap: 14 } as const;

export function CheckboxDemo() {
  return <Checkbox defaultChecked>Email me about product updates</Checkbox>;
}

export function CheckboxDescription() {
  return (
    <Checkbox description="Includes invoices, receipts and plan changes.">Billing notifications</Checkbox>
  );
}

export function CheckboxControlled() {
  const [checked, setChecked] = useState(false);
  return (
    <div style={col}>
      <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>
        I agree to the terms
      </Checkbox>
      <span style={{ fontSize: 13, color: "var(--mrd-muted)" }}>checked: {String(checked)}</span>
    </div>
  );
}

const ITEMS = ["Design", "Engineering", "Marketing"];

export function CheckboxIndeterminate() {
  const [selected, setSelected] = useState<string[]>(["Design"]);
  const all = selected.length === ITEMS.length;
  const some = selected.length > 0 && !all;
  return (
    <div style={col}>
      <Checkbox
        checked={all}
        indeterminate={some}
        onChange={() => setSelected(all ? [] : ITEMS)}
      >
        All teams
      </Checkbox>
      <div style={{ ...col, paddingInlineStart: 28 }}>
        {ITEMS.map((item) => (
          <Checkbox
            key={item}
            checked={selected.includes(item)}
            onChange={(e) =>
              setSelected(e.target.checked ? [...selected, item] : selected.filter((s) => s !== item))
            }
          >
            {item}
          </Checkbox>
        ))}
      </div>
    </div>
  );
}

export function CheckboxStates() {
  return (
    <div style={col}>
      <Checkbox disabled>Disabled</Checkbox>
      <Checkbox disabled defaultChecked>
        Disabled and checked
      </Checkbox>
      <Checkbox invalid required>
        Accept the data processing agreement
      </Checkbox>
    </div>
  );
}

export function CheckboxBare() {
  return <Checkbox aria-label="Select row" />;
}
