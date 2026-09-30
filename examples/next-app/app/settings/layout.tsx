import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbRoot, Container, Heading, Section, Stack, Text } from "@meridui/react";
import { SettingsTabs } from "./SettingsTabs";

export const metadata: Metadata = { title: "Settings" };

// Nested layout: persists across /settings and /settings/notifications; only the panel content changes.
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Section spacing="compact">
      <Container>
        <Stack gap={6}>
          {/* Server component: flat part names, and asChild (a component cannot be passed as `as` from the server). */}
          <BreadcrumbRoot>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbRoot>
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
