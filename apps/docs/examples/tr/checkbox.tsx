"use client";

import { useState } from "react";
import { Checkbox } from "@meridui/react";

const col = { display: "grid", gap: 14 } as const;

export function CheckboxDemo() {
  return <Checkbox defaultChecked>Ürün güncellemelerini e-postayla gönder</Checkbox>;
}

export function CheckboxDescription() {
  return (
    <Checkbox description="Faturalar, makbuzlar ve plan değişiklikleri dahil.">Faturalandırma bildirimleri</Checkbox>
  );
}

export function CheckboxControlled() {
  const [checked, setChecked] = useState(false);
  return (
    <div style={col}>
      <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>
        Koşulları kabul ediyorum
      </Checkbox>
      <span style={{ fontSize: 13, color: "var(--mrd-muted)" }}>checked: {String(checked)}</span>
    </div>
  );
}

const ITEMS = ["Tasarım", "Mühendislik", "Pazarlama"];

export function CheckboxIndeterminate() {
  const [selected, setSelected] = useState<string[]>(["Tasarım"]);
  const all = selected.length === ITEMS.length;
  const some = selected.length > 0 && !all;
  return (
    <div style={col}>
      <Checkbox
        checked={all}
        indeterminate={some}
        onChange={() => setSelected(all ? [] : ITEMS)}
      >
        Tüm ekipler
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
      <Checkbox disabled>Devre dışı</Checkbox>
      <Checkbox disabled defaultChecked>
        Devre dışı ve işaretli
      </Checkbox>
      <Checkbox invalid required>
        Veri işleme sözleşmesini kabul et
      </Checkbox>
    </div>
  );
}

export function CheckboxBare() {
  return <Checkbox aria-label="Satırı seç" />;
}
