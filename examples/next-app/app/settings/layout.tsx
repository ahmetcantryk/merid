import type { Metadata } from "next";
import { Container, Heading, Section, Stack, Text } from "@merid/react";
import { SettingsBreadcrumb } from "./SettingsBreadcrumb";
import { SettingsTabs } from "./SettingsTabs";

export const metadata: Metadata = { title: "Settings" };

// Nested layout: persists across /settings and /settings/notifications; only the panel content changes.
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Section spacing="compact">
      <Container>
        <Stack gap={6}>
          <SettingsBreadcrumb />
          <Stack gap={1}>
            <Heading level={1} size="h3">Settings</Heading>
            <Text tone="muted">Manage your profile and how Northwind Cloud contacts you.</Text>
          </Stack>
          <SettingsTabs>{children}</SettingsTabs>
        </Stack>
      </Container>
    </Section>
  );
}
