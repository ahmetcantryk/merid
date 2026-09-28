import type { ReactNode } from "react";
import { Card, Heading, Stack, Text } from "@merid/react";

export function AuthCard({ title, description, footer, children }: { title: string; description: string; footer: ReactNode; children: ReactNode }) {
  return (
    <div className="auth">
      <Card variant="elevated" padding="lg" className="auth__card">
        <Stack gap={6}>
          <Stack gap={1}>
            <Heading level={1} size="h3">{title}</Heading>
            <Text tone="muted">{description}</Text>
          </Stack>
          {children}
        </Stack>
      </Card>
      <Text size="sm" tone="muted" className="auth__footer">{footer}</Text>
    </div>
  );
}
