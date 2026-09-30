export const commandBasicCode = `import { Command } from "@meridui/react";

export function Example() {
  return (
    <Command.Root
      onSelect={(value) => run(value)}
      label="Komut menüsü"
      resultsLabel={(count) => \`\${count} sonuç\`}
    >
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
  );
}`;

export const commandDialogCode = `const [open, setOpen] = useState(false);

<Button variant="secondary" onClick={() => setOpen(true)}>
  Komut menüsünü aç <Shortcut keys={["mod", "j"]} size="sm" />
</Button>

{/* shortcut varsayılan olarak ⌘K / Ctrl+K; bu site onu arama için kullanıyor. */}
<Command.Dialog
  open={open}
  onOpenChange={setOpen}
  onSelect={(value) => run(value)}
  shortcut={["mod", "j"]}
  label="Komut menüsü"
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
</Command.Dialog>`;
