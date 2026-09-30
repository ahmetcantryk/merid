"use client";

import { useState } from "react";
import { Button, Command, Shortcut } from "@merid/react";

const resultsLabel = (count: number) => `${count} sonuç`;

export function CommandBasic() {
  const [last, setLast] = useState("henüz yok");
  return (
    <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 480 }}>
      <Command.Root onSelect={setLast} label="Komut menüsü" resultsLabel={resultsLabel}>
        <Command.Input placeholder="Bir komut yaz ya da ara…" />
        <Command.List label="Öneriler">
          <Command.Empty>Sonuç bulunamadı.</Command.Empty>
          <Command.Group heading="Sayfalar">
            <Command.Item value="Ana sayfa" keywords={["dashboard", "pano"]}>Ana sayfa</Command.Item>
            <Command.Item>Projeler</Command.Item>
            <Command.Item>Ayarlar</Command.Item>
          </Command.Group>
          <Command.Separator />
          <Command.Group heading="Aksiyonlar">
            <Command.Item value="Yeni proje" shortcut={["mod", "shift", "p"]}>Yeni proje</Command.Item>
            <Command.Item value="Üye davet et" shortcut={["mod", "shift", "i"]}>Üye davet et</Command.Item>
            <Command.Item disabled>Çalışma alanını sil</Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Root>
      <p style={{ margin: 0, color: "var(--mrd-muted)", fontSize: 14 }}>Son komut: {last}</p>
    </div>
  );
}

export function CommandDialogDemo() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState("henüz yok");
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Komut menüsünü aç <Shortcut keys={["mod", "j"]} size="sm" />
      </Button>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        onSelect={setLast}
        shortcut={["mod", "j"]}
        label="Komut menüsü"
        resultsLabel={resultsLabel}
      >
        <Command.Input placeholder="Sayfa ve aksiyon ara…" />
        <Command.List label="Öneriler">
          <Command.Empty>Bu aramayla eşleşen bir şey yok.</Command.Empty>
          <Command.Group heading="Sayfalar">
            <Command.Item value="Ana sayfa">Ana sayfa</Command.Item>
            <Command.Item value="Faturalandırma">Faturalandırma</Command.Item>
            <Command.Item value="Ekip">Ekip</Command.Item>
          </Command.Group>
          <Command.Group heading="Tema">
            <Command.Item value="Açık tema">Açık</Command.Item>
            <Command.Item value="Koyu tema">Koyu</Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Dialog>
      <p style={{ margin: 0, color: "var(--mrd-muted)", fontSize: 14 }}>Son komut: {last}</p>
    </div>
  );
}
