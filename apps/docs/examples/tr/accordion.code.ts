export const accordionBasicCode = `import { Accordion } from "@meridui/react";

export function Example() {
  return (
    <Accordion.Root type="single" defaultValue="billing">
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
}`;

export const accordionMultipleCode = `const [open, setOpen] = useState<string[]>(["a"]);

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
</Accordion.Root>`;

export const accordionNonCollapsibleCode = `<Accordion.Root type="single" defaultValue="one" collapsible={false}>
  <Accordion.Item value="one">
    <Accordion.Trigger>Birinci adım: bağla</Accordion.Trigger>
    <Accordion.Content>Repository'ni bağla.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="two">
    <Accordion.Trigger>İkinci adım: deploy et</Accordion.Trigger>
    <Accordion.Content>Deploy için main'e push et.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>`;
