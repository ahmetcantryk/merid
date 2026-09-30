export const tabsBasicCode = `import { Tabs } from "@merid/react";

export function Example() {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List aria-label="Proje">
        <Tabs.Trigger value="overview">Genel bakış</Tabs.Trigger>
        <Tabs.Trigger value="activity">Aktivite</Tabs.Trigger>
        <Tabs.Trigger value="settings">Ayarlar</Tabs.Trigger>
        <Tabs.Trigger value="billing" disabled>
          Faturalandırma
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="overview">Bu hafta üç deploy yapıldı, hepsi sağlıklı.</Tabs.Panel>
      <Tabs.Panel value="activity">Northwind 4 pull request merge etti.</Tabs.Panel>
      <Tabs.Panel value="settings">Projeyi yeniden adlandır ya da bölgesini değiştir.</Tabs.Panel>
    </Tabs.Root>
  );
}`;

export const tabsControlledCode = `const RANGE_LABELS = { day: "Günlük", week: "Haftalık", month: "Aylık" };
const [tab, setTab] = useState("week");

<Tabs.Root value={tab} onValueChange={setTab}>
  <Tabs.List aria-label="Zaman aralığı">
    <Tabs.Trigger value="day">Gün</Tabs.Trigger>
    <Tabs.Trigger value="week">Hafta</Tabs.Trigger>
    <Tabs.Trigger value="month">Ay</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value={tab}>{RANGE_LABELS[tab]} veriler gösteriliyor.</Tabs.Panel>
</Tabs.Root>`;

export const tabsVerticalCode = `<Tabs.Root defaultValue="profile" orientation="vertical">
  <Tabs.List aria-label="Hesap">
    <Tabs.Trigger value="profile">Profil</Tabs.Trigger>
    <Tabs.Trigger value="security">Güvenlik</Tabs.Trigger>
    <Tabs.Trigger value="notifications">Bildirimler</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="profile">Ad, avatar ve saat dilimi.</Tabs.Panel>
  <Tabs.Panel value="security">Şifre ve iki adımlı doğrulama.</Tabs.Panel>
  <Tabs.Panel value="notifications">E-posta ve uygulama içi bildirimler.</Tabs.Panel>
</Tabs.Root>`;
