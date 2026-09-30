import { Avatar, Card, Stack, Text } from "@meridui/react";
import { ProfileForm } from "./ProfileForm";

export default function ProfilePage() {
  return (
    <Card padding="lg">
      <Stack gap={6}>
        <Stack direction="row" gap={4} align="center">
          <Avatar name="Mara Lindqvist" size="lg" />
          <Stack gap={0}>
            <Text weight="semibold" tone="ink">Mara Lindqvist</Text>
            <Text size="sm" tone="muted">Owner · joined March 2025</Text>
          </Stack>
        </Stack>
        <ProfileForm />
      </Stack>
    </Card>
  );
}
