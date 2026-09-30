"use client";

import { IconButton, Text, VisuallyHidden } from "@meridui/react";
import { SettingsIcon } from "./icons";

export function VisuallyHiddenDemo() {
  return (
    <Text>
      Revenue up 12%
      <VisuallyHidden> compared with last month</VisuallyHidden>
    </Text>
  );
}

export function VisuallyHiddenHeading() {
  return (
    <nav aria-labelledby="vh-nav">
      <VisuallyHidden as="h2" id="vh-nav">
        Account settings
      </VisuallyHidden>
      <IconButton label="Settings" icon={<SettingsIcon />} />
    </nav>
  );
}
