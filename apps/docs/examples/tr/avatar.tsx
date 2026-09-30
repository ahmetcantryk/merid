"use client";

import { Avatar, AvatarGroup } from "@merid/react";

export function AvatarDemo() {
  return (
    <>
      <Avatar name="Ada Lovelace" />
      <Avatar name="Grace Hopper" />
      <Avatar name="Linus" />
    </>
  );
}

export function AvatarSizes() {
  return (
    <>
      <Avatar name="Ada Lovelace" size="xs" />
      <Avatar name="Ada Lovelace" size="sm" />
      <Avatar name="Ada Lovelace" size="md" />
      <Avatar name="Ada Lovelace" size="lg" />
      <Avatar name="Ada Lovelace" size="xl" />
    </>
  );
}

export function AvatarFallback() {
  return (
    <>
      <Avatar name="Bozuk Görsel" src="/does-not-exist.png" />
      <Avatar name="Acme Corporation" initials="AC" />
    </>
  );
}

export function AvatarGroupDemo() {
  return (
    <AvatarGroup label="Proje üyeleri" max={3} size="sm" formatOverflowLabel={(n) => `${n} kişi daha`}>
      <Avatar name="Ada Lovelace" size="sm" />
      <Avatar name="Grace Hopper" size="sm" />
      <Avatar name="Alan Turing" size="sm" />
      <Avatar name="Katherine Johnson" size="sm" />
      <Avatar name="Edsger Dijkstra" size="sm" />
    </AvatarGroup>
  );
}
