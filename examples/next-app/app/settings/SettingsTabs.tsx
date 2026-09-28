"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs } from "@merid/react";

const TABS = [
  { href: "/settings", label: "Profile" },
  { href: "/settings/notifications", label: "Notifications" },
];

/** Route-driven tabs: the URL is the selected value, and the active route renders inside the one panel. */
export function SettingsTabs({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const current = TABS.some((t) => t.href === pathname) ? pathname : TABS[0].href;

  return (
    <Tabs.Root value={current} onValueChange={(href) => router.push(href)}>
      <Tabs.List aria-label="Settings sections">
        {TABS.map((t) => (
          <Tabs.Trigger key={t.href} value={t.href} onMouseEnter={() => router.prefetch(t.href)}>
            {t.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <Tabs.Panel value={current} className="tab-panel">
        {children}
      </Tabs.Panel>
    </Tabs.Root>
  );
}
