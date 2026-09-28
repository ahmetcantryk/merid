export const selectBasicCode = `import { Select } from "@merid/react";

export function Example() {
  return (
    <>
      <span id="region-label">Region</span>
      <Select.Root defaultValue="eu-west" name="region">
        <Select.Trigger aria-labelledby="region-label" />
        <Select.Content>
          <Select.Item value="us-east">US East</Select.Item>
          <Select.Item value="us-west">US West</Select.Item>
          <Select.Item value="eu-west">EU West</Select.Item>
          <Select.Item value="ap-south" disabled>
            Asia Pacific (soon)
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </>
  );
}`;

export const selectControlledCode = `const [plan, setPlan] = useState("");

<Select.Root value={plan} onValueChange={setPlan} placeholder="Choose a plan">
  <Select.Trigger aria-label="Plan" invalid={plan === ""} />
  <Select.Content>
    <Select.Item value="starter">Starter</Select.Item>
    <Select.Item value="team">Team</Select.Item>
    <Select.Item value="enterprise">Enterprise</Select.Item>
  </Select.Content>
</Select.Root>`;

export const selectSizesCode = `<Select.Trigger size="sm" aria-label="Frequency" />
<Select.Trigger size="md" aria-label="Frequency" />
<Select.Trigger size="lg" aria-label="Frequency" />

<Select.Root disabled placeholder="Disabled">
  <Select.Trigger aria-label="Disabled select" />
  <Select.Content>
    <Select.Item value="x">Unavailable</Select.Item>
  </Select.Content>
</Select.Root>`;
