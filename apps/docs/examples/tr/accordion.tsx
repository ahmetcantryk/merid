"use client";

import { useState } from "react";
import { Accordion } from "@meridui/react";

const wrap = { width: "100%", maxWidth: 520 } as const;

export function AccordionBasic() {
  return (
    <Accordion.Root type="single" defaultValue="billing" style={wrap}>
      <Accordion.Item value="billing">
        <Accordion.Trigger>Faturalandırma nasıl işliyor?</Accordion.Trigger>
        <Accordion.Content>Her aktif kullanıcı için aylık ödeme yaparsın. Kullanılmayan kullanıcılar hesabına kredi olarak geçer.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="export">
        <Accordion.Trigger>Verilerimi dışa aktarabilir miyim?</Accordion.Trigger>
        <Accordion.Content>Evet. Herhangi bir çalışma alanını Ayarlar'dan CSV ya da JSON olarak dışa aktarabilirsin.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="sso" disabled>
        <Accordion.Trigger>SSO desteği var mı? (Enterprise)</Accordion.Trigger>
        <Accordion.Content>Enterprise planında SAML ve OIDC destekleniyor.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}


export function AccordionMultiple() {
  const [open, setOpen] = useState<string[]>(["a"]);
  return (
    <div style={{ ...wrap, display: "grid", gap: 12 }}>
      <Accordion.Root type="multiple" value={open} onValueChange={setOpen} headingLevel={4}>
        <Accordion.Item value="a">
          <Accordion.Trigger>Kargo</Accordion.Trigger>
          <Accordion.Content>Siparişler iki iş günü içinde kargoya verilir.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="b">
          <Accordion.Trigger>İade</Accordion.Trigger>
          <Accordion.Content>Kullanılmamış ürünleri 30 gün içinde iade edebilirsin.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="c">
          <Accordion.Trigger>Garanti</Accordion.Trigger>
          <Accordion.Content>Tüm donanımlarda iki yıl garanti.</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
      <span style={{ fontSize: 14, color: "var(--mrd-muted)" }}>Açık: {open.length ? open.join(", ") : "yok"}</span>
    </div>
  );
}


export function AccordionNonCollapsible() {
  return (
    <Accordion.Root type="single" defaultValue="one" collapsible={false} style={wrap}>
      <Accordion.Item value="one">
        <Accordion.Trigger>Birinci adım: bağla</Accordion.Trigger>
        <Accordion.Content>Repository'ni bağla.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="two">
        <Accordion.Trigger>İkinci adım: deploy et</Accordion.Trigger>
        <Accordion.Content>Deploy için main'e push et.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
