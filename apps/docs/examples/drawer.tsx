"use client";

import { Drawer, type DrawerSide } from "@merid/react";

function SideDrawer({ side }: { readonly side: DrawerSide }) {
  return (
    <Drawer.Root>
      <Drawer.Trigger className="mrd-button" data-variant="secondary" data-size="md">
        Open {side}
      </Drawer.Trigger>
      <Drawer.Content side={side}>
        <Drawer.Title>Filters</Drawer.Title>
        <Drawer.Description>Narrow the list of invoices.</Drawer.Description>
        <Drawer.Footer>
          <Drawer.Close className="mrd-button" data-variant="secondary" data-size="md">
            Reset
          </Drawer.Close>
          <Drawer.Close className="mrd-button" data-variant="primary" data-size="md">
            Apply
          </Drawer.Close>
        </Drawer.Footer>
        <Drawer.Close />
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
