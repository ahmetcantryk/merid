export const selectBasicCode = `import { Select } from "@merid/react";

export function Example() {
  return (
    <>
      <span id="region-label">Bölge</span>
      <Select.Root defaultValue="eu-west" name="region" placeholder="Seç…">
        <Select.Trigger aria-labelledby="region-label" />
        <Select.Content>
          <Select.Item value="us-east">ABD Doğu</Select.Item>
          <Select.Item value="us-west">ABD Batı</Select.Item>
          <Select.Item value="eu-west">AB Batı</Select.Item>
          <Select.Item value="ap-south" disabled>
            Asya Pasifik (yakında)
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </>
  );
}`;

export const selectControlledCode = `const [plan, setPlan] = useState("");

<Select.Root value={plan} onValueChange={setPlan} placeholder="Paket seç">
  <Select.Trigger aria-label="Paket" invalid={plan === ""} />
  <Select.Content>
    <Select.Item value="starter">Başlangıç</Select.Item>
    <Select.Item value="team">Ekip</Select.Item>
    <Select.Item value="enterprise">Kurumsal</Select.Item>
  </Select.Content>
</Select.Root>`;

export const selectSizesCode = `<Select.Trigger size="sm" aria-label="Sıklık" />
<Select.Trigger size="md" aria-label="Sıklık" />
<Select.Trigger size="lg" aria-label="Sıklık" />

<Select.Root disabled placeholder="Devre dışı">
  <Select.Trigger aria-label="Devre dışı select" />
  <Select.Content>
    <Select.Item value="x">Kullanılamıyor</Select.Item>
  </Select.Content>
</Select.Root>`;
