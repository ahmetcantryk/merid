export const navigationMenuBasicCode = `import { NavigationMenu } from "@meridui/react";

export function SiteNav() {
  return (
    <NavigationMenu.Root aria-label="Product site">
      <NavigationMenu.List>
        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content fullWidth>
            <NavigationMenu.Link href="/analytics" description="Dashboards, funnels and retention.">
              Analytics
            </NavigationMenu.Link>
            <NavigationMenu.Link href="/billing" description="Invoices, plans and usage-based pricing.">
              Billing
            </NavigationMenu.Link>
            {/* … */}
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="resources">
          <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/docs">Documentation</NavigationMenu.Link>
            <NavigationMenu.Link href="/guides">Guides</NavigationMenu.Link>
            <NavigationMenu.Link href="/changelog">Changelog</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/pricing" active>Pricing</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}`;

