"use client";

import { useState, type ReactNode } from "react";
import {
  Avatar,
  Button,
  Card,
  Field,
  Heading,
  Input,
  NativeSelect,
  Separator,
  SidebarNav,
  Stack,
  Switch,
  Text,
  ToastProvider,
  useToast,
} from "@merid/react";

function Section({ title, description, children }: { readonly title: string; readonly description: string; readonly children: ReactNode }) {
  return (
    <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
      <Stack gap={1}>
        <Heading level={3} size="sm">
          {title}
        </Heading>
        <Text size="sm" tone="muted">
          {description}
        </Text>
      </Stack>
      <Stack gap={4}>{children}</Stack>
    </section>
  );
}

function SettingsForm() {
  const { toast } = useToast();
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSaving(false);
    setDirty(false);
    toast({ title: "Ayarlar kaydedildi", tone: "success" });
  }

  return (
    <form
      onChange={() => setDirty(true)}
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <Stack gap={8}>
        <Section title="Profil" description="Yorumlarda ve üye listesinde görünür.">
          <Stack direction="row" gap={3} align="center">
            <Avatar name="Ada Lovelace" size="lg" />
            <Button size="sm" onClick={() => setDirty(true)}>
              Fotoğrafı değiştir
            </Button>
          </Stack>
          <Field label="Görünen ad">
            <Input name="name" defaultValue="Ada Lovelace" />
          </Field>
          <Field label="Saat dilimi">
            <NativeSelect name="tz" defaultValue="Europe/London">
              <option value="Europe/London">Londra (GMT+1)</option>
              <option value="Europe/Istanbul">İstanbul (GMT+3)</option>
              <option value="America/New_York">New York (GMT−4)</option>
            </NativeSelect>
          </Field>
        </Section>
        <Separator />
        <Section title="Bildirimler" description="E-posta en fazla saatte bir gönderilir.">
          <Switch name="mentions" defaultChecked onCheckedChange={() => setDirty(true)}>
            Bahsetmeler ve yanıtlar
          </Switch>
          <Switch name="deploys" onCheckedChange={() => setDirty(true)}>
            Başarısız deployment'lar
          </Switch>
          <Switch name="digest" defaultChecked onCheckedChange={() => setDirty(true)}>
            Haftalık özet
          </Switch>
        </Section>
        <Separator />
        <Stack direction="row" justify="end" gap={2} align="center">
          {dirty ? (
            <Text size="sm" tone="muted">
              Kaydedilmemiş değişiklikler var
            </Text>
          ) : null}
          <Button type="submit" variant="primary" disabled={!dirty} loading={saving}>
            Değişiklikleri kaydet
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}

export function SettingsPageExample() {
  return (
    <ToastProvider label="Bildirimler" dismissLabel="Bildirimi kapat">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 32, width: "100%" }}>
        <div style={{ width: 180 }}>
          <SidebarNav aria-label="Ayarlar">
            <SidebarNav.Item href="#" active>
              Hesap
            </SidebarNav.Item>
            <SidebarNav.Item href="#">Çalışma alanı</SidebarNav.Item>
            <SidebarNav.Item href="#">Faturalandırma</SidebarNav.Item>
            <SidebarNav.Item href="#">Güvenlik</SidebarNav.Item>
          </SidebarNav>
        </div>
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <SettingsForm />
        </div>
      </div>
    </ToastProvider>
  );
}

export function DangerZone() {
  return (
    <Card variant="outline" padding="md" style={{ width: "100%", maxWidth: 560 }}>
      <Stack direction="row" gap={4} justify="between" align="center" wrap>
        <Stack gap={1}>
          <Text weight="medium" tone="ink" size="sm">
            Hesabı sil
          </Text>
          <Text size="sm" tone="muted">
            Profilini siler ve tüm çalışma alanlarından çıkarır.
          </Text>
        </Stack>
        <Button variant="danger" size="sm">
          Hesabı sil
        </Button>
      </Stack>
    </Card>
  );
}
