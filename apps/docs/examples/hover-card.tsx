"use client";

import { Avatar, HoverCard, Link, Text } from "@merid/react";

export function HoverCardBasic() {
  return (
    <Text>
      Reviewed by{" "}
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <Link href="#ada">@ada</Link>
        </HoverCard.Trigger>
        <HoverCard.Content>
          <div style={{ display: "flex", gap: 12 }}>
            <Avatar name="Ada Lovelace" />
            <div style={{ display: "grid", gap: 4 }}>
              <strong style={{ color: "var(--mrd-ink)", fontWeight: 600 }}>Ada Lovelace</strong>
              <span>Analytical Engine team · joined March 2021</span>
            </div>
          </div>
        </HoverCard.Content>
      </HoverCard.Root>{" "}
      two hours ago.
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
        Next.js storefront · 42 open pull requests · deployed 5 minutes ago
      </HoverCard.Content>
    </HoverCard.Root>
  );
}
