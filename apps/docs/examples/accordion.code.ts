export const accordionBasicCode = `import { Accordion } from "@meridui/react";

export function Example() {
  return (
    <Accordion.Root type="single" defaultValue="billing">
      <Accordion.Item value="billing">
        <Accordion.Trigger>How does billing work?</Accordion.Trigger>
        <Accordion.Content>You are billed monthly per active seat. Unused seats are credited.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="export">
        <Accordion.Trigger>Can I export my data?</Accordion.Trigger>
        <Accordion.Content>Yes. Export any workspace as CSV or JSON from Settings.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="sso" disabled>
        <Accordion.Trigger>Do you support SSO? (Enterprise)</Accordion.Trigger>
        <Accordion.Content>SAML and OIDC on the Enterprise plan.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}`;

export const accordionMultipleCode = `const [open, setOpen] = useState<string[]>(["a"]);

<Accordion.Root type="multiple" value={open} onValueChange={setOpen} headingLevel={4}>
  <Accordion.Item value="a">
    <Accordion.Trigger>Shipping</Accordion.Trigger>
    <Accordion.Content>Orders ship within two business days.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="b">
    <Accordion.Trigger>Returns</Accordion.Trigger>
    <Accordion.Content>Return unused items within 30 days.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="c">
    <Accordion.Trigger>Warranty</Accordion.Trigger>
    <Accordion.Content>Two years on all hardware.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>`;

export const accordionNonCollapsibleCode = `<Accordion.Root type="single" defaultValue="one" collapsible={false}>
  <Accordion.Item value="one">
    <Accordion.Trigger>Step one: connect</Accordion.Trigger>
    <Accordion.Content>Link your repository.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="two">
    <Accordion.Trigger>Step two: deploy</Accordion.Trigger>
    <Accordion.Content>Push to main to deploy.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>`;
