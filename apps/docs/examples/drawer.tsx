"use client";

import { Button, Drawer, type DrawerSide, type DrawerSize } from "@meridui/react";

function SideDrawer({ side }: { readonly side: DrawerSide }) {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button variant="secondary">Open {side}</Button>
      </Drawer.Trigger>
      <Drawer.Content side={side}>
        <Drawer.Title>Filters</Drawer.Title>
        <Drawer.Description>Narrow the list of invoices.</Drawer.Description>
        <Drawer.Footer>
          <Drawer.Close>Reset</Drawer.Close>
          <Drawer.Close asChild>
            <Button variant="primary">Apply</Button>
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
          <Drawer.Content size={size}>
            <Drawer.Title>Size {size}</Drawer.Title>
            <Drawer.Description>The size prop sets the sheet width.</Drawer.Description>
          </Drawer.Content>
        </Drawer.Root>
      ))}
    </div>
  );
}
