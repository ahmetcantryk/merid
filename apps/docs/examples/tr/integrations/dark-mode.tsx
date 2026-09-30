"use client";

import { useState } from "react";
import { Badge, Button, Card, Stack, Switch, Text } from "@merid/react";

function Panel({ title }: { readonly title: string }) {
  return (
    <Card variant="outline" padding="md">
      <Stack gap={3}>
        <Stack direction="row" justify="between" align="center">
          <Text weight="semibold" tone="ink">
            {title}
          </Text>
          <Badge tone="success" dot>
            Canlı
          </Badge>
        </Stack>
        <Text size="sm">Token'lar en yakın data-theme atasından çözülür.</Text>
        <Stack direction="row" gap={2}>
          <Button variant="primary" size="sm">
            Deploy et
          </Button>
          <Button size="sm">Loglar</Button>
        </Stack>
      </Stack>
    </Card>
  );
}

export function DarkModeSubtree() {
  const [dark, setDark] = useState(true);
  return (
    <Stack gap={4} style={{ width: "100%", maxWidth: 420 }}>
      <Switch checked={dark} onCheckedChange={setDark}>
        Koyu alt ağaç
      </Switch>
      <div
        data-theme={dark ? "dark" : undefined}
        style={{ background: "var(--mrd-bg)", color: "var(--mrd-body)", padding: 16, borderRadius: 14 }}
      >
        <Panel title="Production" />
      </div>
    </Stack>
  );
}
