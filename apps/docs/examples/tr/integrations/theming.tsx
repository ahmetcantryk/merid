"use client";

import { useState, type CSSProperties } from "react";
import { Badge, Button, Card, Checkbox, Field, Input, SegmentedControl, Stack, Switch, Tabs, Text } from "@merid/react";

type Brand = "merid" | "teal" | "plum";

/** Her marka accent ailesinin tamamını ezer; değerler beyaz zeminde AA için kontrol edildi (solid ≥ 4.5:1). */
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
        aria-label="Marka"
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
                Çalışma alanı
              </Text>
              <Badge tone="accent">Pro</Badge>
            </Stack>
            <Tabs.Root defaultValue="general">
              <Tabs.List aria-label="Marka önizlemesi">
                <Tabs.Trigger value="general">Genel</Tabs.Trigger>
                <Tabs.Trigger value="members">Üyeler</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
            <Field label="Çalışma alanı adı">
              <Input defaultValue="Northwind" />
            </Field>
            <Checkbox defaultChecked>Misafirlere izin ver</Checkbox>
            <Switch defaultChecked>Haftalık özet</Switch>
            <Stack direction="row" gap={2}>
              <Button variant="primary">Değişiklikleri kaydet</Button>
              <Button variant="link">Daha fazla bilgi</Button>
            </Stack>
          </Stack>
        </Card>
      </div>
    </Stack>
  );
}
