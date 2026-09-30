"use client";

import { useState, type CSSProperties } from "react";
import { Badge, Button, Card, Checkbox, Field, Input, SegmentedControl, Stack, Switch, Tabs, Text } from "@merid/react";

type Brand = "merid" | "teal" | "plum";

/** Each brand overrides the full accent family; values checked for AA on white (solid ≥ 4.5:1). */
const BRANDS: Record<Brand, CSSProperties> = {
  merid: {},
  teal: {
    "--mrd-accent": "#0f766e",
    "--mrd-accent-hover": "#0d6560",
    "--mrd-accent-solid": "#0f766e",
    "--mrd-accent-solid-hover": "#0d6560",
    "--mrd-accent-soft": "#e7f5f3",
    "--mrd-accent-strong": "#0b4f4a",
    "--mrd-focus-ring": "0 0 0 3px rgb(15 118 110 / 20%)",
  } as CSSProperties,
  plum: {
    "--mrd-accent": "#7c3aed",
    "--mrd-accent-hover": "#6d28d9",
    "--mrd-accent-solid": "#7c3aed",
    "--mrd-accent-solid-hover": "#6d28d9",
    "--mrd-accent-soft": "#f3edff",
    "--mrd-accent-strong": "#5b21b6",
    "--mrd-focus-ring": "0 0 0 3px rgb(124 58 237 / 20%)",
  } as CSSProperties,
};

export function ThemingBrandPreview() {
  const [brand, setBrand] = useState<Brand>("teal");
  return (
    <Stack gap={4} style={{ width: "100%", maxWidth: 440 }}>
      <SegmentedControl
        aria-label="Brand"
        value={brand}
        onValueChange={(value) => setBrand(value as Brand)}
        options={[
          { value: "merid", label: "Merid" },
          { value: "teal", label: "Teal" },
          { value: "plum", label: "Plum" },
        ]}
      />
      <div style={BRANDS[brand]}>
        <Card variant="outline" padding="md">
          <Stack gap={4}>
            <Stack direction="row" justify="between" align="center">
              <Text weight="semibold" tone="ink">
                Workspace
              </Text>
              <Badge tone="accent">Pro</Badge>
            </Stack>
            <Tabs.Root defaultValue="general">
              <Tabs.List aria-label="Brand preview">
                <Tabs.Trigger value="general">General</Tabs.Trigger>
                <Tabs.Trigger value="members">Members</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
            <Field label="Workspace name">
              <Input defaultValue="Northwind" />
            </Field>
            <Checkbox defaultChecked>Allow guests</Checkbox>
            <Switch defaultChecked>Weekly digest</Switch>
            <Stack direction="row" gap={2}>
              <Button variant="primary">Save changes</Button>
              <Button variant="link">Learn more</Button>
            </Stack>
          </Stack>
        </Card>
      </div>
    </Stack>
  );
}
