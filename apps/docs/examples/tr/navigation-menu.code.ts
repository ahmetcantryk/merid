export const navigationMenuBasicCode = `import { NavigationMenu } from "@meridui/react";

export function SiteNav() {
  return (
    <NavigationMenu.Root aria-label="Ürün sitesi">
      <NavigationMenu.List>
        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger>Ürünler</NavigationMenu.Trigger>
          <NavigationMenu.Content fullWidth>
            <NavigationMenu.Link href="/analytics" description="Dashboard'lar, huniler ve elde tutma.">
              Analitik
            </NavigationMenu.Link>
            <NavigationMenu.Link href="/billing" description="Faturalar, planlar ve kullanıma göre fiyatlandırma.">
              Faturalandırma
            </NavigationMenu.Link>
            {/* … */}
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="resources">
          <NavigationMenu.Trigger>Kaynaklar</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/docs">Dokümantasyon</NavigationMenu.Link>
            <NavigationMenu.Link href="/guides">Rehberler</NavigationMenu.Link>
            <NavigationMenu.Link href="/changelog">Sürüm notları</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/pricing" active>Fiyatlar</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}`;

