"use client";

import { useState } from "react";
import { Tabs } from "@merid/react";

const panel = { padding: "16px 0", color: "var(--mrd-body)", fontSize: 14 } as const;
const root = { width: "100%", maxWidth: 480 } as const;

export function TabsBasic() {
  return (
    <Tabs.Root defaultValue="overview" style={root}>
      <Tabs.List aria-label="Proje">
        <Tabs.Trigger value="overview">Genel bakış</Tabs.Trigger>
        <Tabs.Trigger value="activity">Aktivite</Tabs.Trigger>
        <Tabs.Trigger value="settings">Ayarlar</Tabs.Trigger>
        <Tabs.Trigger value="billing" disabled>
          Faturalandırma
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="overview" style={panel}>
        Bu hafta üç deploy yapıldı, hepsi sağlıklı.
      </Tabs.Panel>
      <Tabs.Panel value="activity" style={panel}>
        Northwind 4 pull request merge etti.
      </Tabs.Panel>
      <Tabs.Panel value="settings" style={panel}>
        Projeyi yeniden adlandır ya da bölgesini değiştir.
      </Tabs.Panel>
    </Tabs.Root>
  );
}

const RANGE_LABELS: Record<string, string> = { day: "Günlük", week: "Haftalık", month: "Aylık" };

export function TabsControlled() {
  const [tab, setTab] = useState("week");
  return (
    <Tabs.Root value={tab} onValueChange={setTab} style={root}>
      <Tabs.List aria-label="Zaman aralığı">
        <Tabs.Trigger value="day">Gün</Tabs.Trigger>
        <Tabs.Trigger value="week">Hafta</Tabs.Trigger>
        <Tabs.Trigger value="month">Ay</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value={tab} style={panel}>
        {RANGE_LABELS[tab]} veriler gösteriliyor.
      </Tabs.Panel>
    </Tabs.Root>
  );
}

export function TabsVertical() {
  return (
    <Tabs.Root defaultValue="profile" orientation="vertical" style={root}>
      <Tabs.List aria-label="Hesap">
        <Tabs.Trigger value="profile">Profil</Tabs.Trigger>
        <Tabs.Trigger value="security">Güvenlik</Tabs.Trigger>
        <Tabs.Trigger value="notifications">Bildirimler</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="profile" style={panel}>
        Ad, avatar ve saat dilimi.
      </Tabs.Panel>
      <Tabs.Panel value="security" style={panel}>
        Şifre ve iki adımlı doğrulama.
      </Tabs.Panel>
      <Tabs.Panel value="notifications" style={panel}>
        E-posta ve uygulama içi bildirimler.
      </Tabs.Panel>
    </Tabs.Root>
  );
}
