import type { Metadata } from "next";
import { Card, Separator, Stack, Switch, Text } from "@meridui/react";

export const metadata: Metadata = { title: "Notifications" };

const PREFS = [
  { id: "deploys", label: "Deployment emails", description: "A summary after every production deploy.", on: true },
  { id: "incidents", label: "Incident alerts", description: "Page me when a project I own degrades.", on: true },
  { id: "product", label: "Product updates", description: "One email a month about new features.", on: false },
];

// Uncontrolled Switches rendered from a server component: no client wrapper needed.
export default function NotificationsPage() {
  return (
    <Card padding="lg">
      <Stack gap={4}>
        {PREFS.map((p, i) => (
          <Stack gap={4} key={p.id}>
            {i > 0 ? <Separator /> : null}
            <div className="pref-row">
              <Stack gap={1}>
                <Text size="sm" weight="medium" tone="ink" id={`pref-${p.id}`}>{p.label}</Text>
                <Text size="sm" tone="muted">{p.description}</Text>
              </Stack>
              <Switch name={p.id} defaultChecked={p.on} aria-labelledby={`pref-${p.id}`} />
            </div>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
