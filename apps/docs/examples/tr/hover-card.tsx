"use client";

import { Avatar, HoverCard, Link, Text } from "@meridui/react";

export function HoverCardBasic() {
  return (
    <Text>
      İki saat önce{" "}
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <Link href="#ada">@ada</Link>
        </HoverCard.Trigger>
        <HoverCard.Content>
          <div style={{ display: "flex", gap: 12 }}>
            <Avatar name="Ada Lovelace" />
            <div style={{ display: "grid", gap: 4 }}>
              <strong style={{ color: "var(--mrd-ink)", fontWeight: 600 }}>Ada Lovelace</strong>
              <span>Analytical Engine ekibi · Mart 2021'den beri</span>
            </div>
          </div>
        </HoverCard.Content>
      </HoverCard.Root>{" "}
      tarafından incelendi.
    </Text>
  );
}

export function HoverCardDelays() {
  return (
    <HoverCard.Root openDelay={150} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <Link href="#northwind">northwind-web</Link>
      </HoverCard.Trigger>
      <HoverCard.Content placement="top">
        Next.js mağazası · 42 açık pull request · 5 dakika önce deploy edildi
      </HoverCard.Content>
    </HoverCard.Root>
  );
}
