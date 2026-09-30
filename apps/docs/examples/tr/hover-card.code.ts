export const hoverCardBasicCode = `import { Avatar, HoverCard, Link, Text } from "@meridui/react";

export function Example() {
  return (
    <Text>
      İki saat önce{" "}
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <Link href="/people/ada">@ada</Link>
        </HoverCard.Trigger>
        <HoverCard.Content>
          <Avatar name="Ada Lovelace" />
          <strong>Ada Lovelace</strong>
          <span>Analytical Engine ekibi · Mart 2021'den beri</span>
        </HoverCard.Content>
      </HoverCard.Root>{" "}
      tarafından incelendi.
    </Text>
  );
}`;

export const hoverCardDelaysCode = `<HoverCard.Root openDelay={150} closeDelay={100}>
  <HoverCard.Trigger asChild>
    <Link href="/projects/northwind-web">northwind-web</Link>
  </HoverCard.Trigger>
  <HoverCard.Content placement="top">
    Next.js mağazası · 42 açık pull request · 5 dakika önce deploy edildi
  </HoverCard.Content>
</HoverCard.Root>`;
