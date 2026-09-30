"use client";

import { useState } from "react";
import { Badge, Button, Card, Input, SegmentedControl, Stack, Switch, Text } from "@meridui/react";

type Theme = "light" | "dark";
type Accent = "blue" | "violet" | "green" | "graphite";
type Density = "compact" | "default" | "comfortable";

function Sample({ label }: { readonly label: string }) {
  return (
    <Card variant="outline" padding="md">
      <Stack gap={3}>
        <Stack direction="row" justify="between" align="center">
          <Text size="sm" weight="semibold" tone="ink">
            {label}
          </Text>
          <Badge tone="accent">Preview</Badge>
        </Stack>
        <Input aria-label={`${label} name`} defaultValue="northwind-web" />
        <Switch defaultChecked>Auto-deploy</Switch>
        <Stack direction="row" gap={2}>
          <Button variant="primary" size="sm">
            Save
          </Button>
          <Button size="sm">Cancel</Button>
        </Stack>
      </Stack>
    </Card>
  );
}

const surface = { background: "var(--mrd-bg)", color: "var(--mrd-body)", padding: 16, borderRadius: 14 } as const;

export function SubtreeNested() {
  const [outer, setOuter] = useState<Theme>("dark");
  const [accent, setAccent] = useState<Accent>("violet");
  const [density, setDensity] = useState<Density>("compact");
  const inner: Theme = outer === "dark" ? "light" : "dark";

  return (
    <Stack gap={4} style={{ width: "100%", maxWidth: 520 }}>
      <Stack direction="row" gap={3} wrap>
        <SegmentedControl
          aria-label="Outer theme"
          value={outer}
          onValueChange={(v) => setOuter(v as Theme)}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
        />
        <SegmentedControl
          aria-label="Inner accent"
          value={accent}
          onValueChange={(v) => setAccent(v as Accent)}
          options={[
            { value: "blue", label: "Blue" },
            { value: "violet", label: "Violet" },
            { value: "green", label: "Green" },
            { value: "graphite", label: "Graphite" },
          ]}
        />
        <SegmentedControl
          aria-label="Inner density"
          value={density}
          onValueChange={(v) => setDensity(v as Density)}
          options={[
            { value: "compact", label: "Compact" },
            { value: "default", label: "Default" },
            { value: "comfortable", label: "Comfortable" },
          ]}
        />
      </Stack>
      <div data-theme={outer} style={surface}>
        <Stack gap={4}>
          <Sample label={`Outer · ${outer} · blue`} />
          <div data-theme={inner} data-accent={accent} data-density={density} style={surface}>
            <Sample label={`Inner · ${inner} · ${accent} · ${density}`} />
          </div>
        </Stack>
      </div>
    </Stack>
  );
}
