"use client";

import { Link, Text } from "@merid/react";

export function LinkDemo() {
  return (
    <Text>
      Read the <Link href="#">installation guide</Link> before you start.
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
      <Link href="#" underline="hover">Underline on hover</Link>
      <Link href="#" underline="always">Always underlined</Link>
      <Link href="#" underline="none">No underline</Link>
    </>
  );
}

export function LinkExternal() {
  return (
    <Link href="https://github.com/ahmetcantryk/merid" external>
      GitHub repository
    </Link>
  );
}
