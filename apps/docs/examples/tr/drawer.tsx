"use client";

import { Button, Drawer, type DrawerSide, type DrawerSize } from "@merid/react";

const SIDE_LABELS: Record<DrawerSide, string> = { left: "Soldan aç", right: "Sağdan aç" };

function SideDrawer({ side }: { readonly side: DrawerSide }) {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button variant="secondary">{SIDE_LABELS[side]}</Button>
      </Drawer.Trigger>
      <Drawer.Content side={side} closeLabel="Kapat">
        <Drawer.Title>Filtreler</Drawer.Title>
        <Drawer.Description>Fatura listesini daralt.</Drawer.Description>
        <Drawer.Footer>
          <Drawer.Close>Sıfırla</Drawer.Close>
          <Drawer.Close asChild>
            <Button variant="primary">Uygula</Button>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}

export function DrawerDemo() {
  return <SideDrawer side="right" />;
}

export function DrawerSidesDemo() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <SideDrawer side="left" />
      <SideDrawer side="right" />
    </div>
  );
}

const DRAWER_SIZES: readonly DrawerSize[] = ["sm", "md", "lg"];

export function DrawerSizesDemo() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {DRAWER_SIZES.map((size) => (
        <Drawer.Root key={size}>
          <Drawer.Trigger asChild>
            <Button variant="secondary">{size}</Button>
          </Drawer.Trigger>
          <Drawer.Content size={size} closeLabel="Kapat">
            <Drawer.Title>Boyut: {size}</Drawer.Title>
            <Drawer.Description>size prop'u sheet'in genişliğini belirler.</Drawer.Description>
          </Drawer.Content>
        </Drawer.Root>
      ))}
    </div>
  );
}
