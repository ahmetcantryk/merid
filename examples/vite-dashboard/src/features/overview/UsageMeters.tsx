import { Button, Card, Heading, Progress, Stack, Text } from "@meridui/react";
import { hrefFor } from "../../lib/router";

const METERS = [
  { label: "Compute hours", used: 1840, limit: 2500, unit: "h" },
  { label: "Bandwidth", used: 612, limit: 1000, unit: "GB" },
  { label: "Build minutes", used: 5720, limit: 6000, unit: "min" },
];

export function UsageMeters() {
  return (
    <Card padding="lg">
      <Stack gap={5}>
        <Stack direction="row" justify="between" align="center">
          <Heading level={2} size="sm">Usage this cycle</Heading>
          <Button size="sm" variant="ghost" onClick={() => { window.location.hash = hrefFor("settings", { tab: "billing" }); }}>
            Manage plan
          </Button>
        </Stack>
        {METERS.map((m) => {
          const pct = Math.round((m.used / m.limit) * 100);
          return (
            <Stack gap={2} key={m.label}>
              <Stack direction="row" justify="between">
                <Text size="sm" tone="ink" id={`meter-${m.unit}`}>{m.label}</Text>
                <Text size="sm" tone={pct >= 90 ? "danger" : "muted"} numeric>
                  {m.used.toLocaleString("en-US")} / {m.limit.toLocaleString("en-US")} {m.unit}
                </Text>
              </Stack>
              <Progress value={pct} aria-labelledby={`meter-${m.unit}`} valueText={`${pct}% used`} />
            </Stack>
          );
        })}
      </Stack>
    </Card>
  );
}
