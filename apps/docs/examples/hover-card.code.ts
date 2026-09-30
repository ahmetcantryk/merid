export const hoverCardBasicCode = `import { Avatar, HoverCard, Link, Text } from "@meridui/react";

export function Example() {
  return (
    <Text>
      Reviewed by{" "}
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <Link href="/people/ada">@ada</Link>
        </HoverCard.Trigger>
        <HoverCard.Content>
          <Avatar name="Ada Lovelace" />
          <strong>Ada Lovelace</strong>
          <span>Analytical Engine team · joined March 2021</span>
        </HoverCard.Content>
      </HoverCard.Root>{" "}
      two hours ago.
    </Text>
  );
}`;

export const hoverCardDelaysCode = `<HoverCard.Root openDelay={150} closeDelay={100}>
  <HoverCard.Trigger asChild>
    <Link href="/projects/northwind-web">northwind-web</Link>
  </HoverCard.Trigger>
  <HoverCard.Content placement="top">
    Next.js storefront · 42 open pull requests · deployed 5 minutes ago
  </HoverCard.Content>
</HoverCard.Root>`;
