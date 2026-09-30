"use client";

import { Link, Text } from "@merid/react";

export function LinkDemo() {
  return (
    <Text>
      Başlamadan önce <Link href="#">kurulum rehberini</Link> oku.
    </Text>
  );
}

export function LinkTones() {
  return (
    <>
      <Link href="#" tone="accent">Accent</Link>
      <Link href="#" tone="ink">Ink</Link>
      <Link href="#" tone="muted">Muted</Link>
    </>
  );
}

export function LinkUnderlines() {
  return (
    <>
      <Link href="#" underline="hover">Hover'da altı çizili</Link>
      <Link href="#" underline="always">Her zaman altı çizili</Link>
      <Link href="#" underline="none">Alt çizgi yok</Link>
    </>
  );
}

export function LinkExternal() {
  return (
    <Link href="https://github.com/ahmetcantryk/merid" external>
      GitHub reposu
    </Link>
  );
}
