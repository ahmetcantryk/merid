"use client";

import { useState } from "react";
import { Button, Field, Input, NativeSelect, Stack, Text } from "@merid/react";

export function ProfileForm() {
  const [saved, setSaved] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSaved(true);
      }}
      onChange={() => setSaved(false)}
    >
      <Stack gap={5} className="form-narrow">
        <Field label="Display name">
          <Input name="name" defaultValue="Mara Lindqvist" />
        </Field>
        <Field label="Time zone" description="Used for digests and incident timelines.">
          <NativeSelect name="tz" defaultValue="Europe/Stockholm">
            <option value="Europe/Stockholm">Europe/Stockholm</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Asia/Kolkata">Asia/Kolkata</option>
          </NativeSelect>
        </Field>
        <Stack direction="row" gap={3} align="center">
          <Button type="submit" variant="primary">Save profile</Button>
          <Text size="sm" tone="muted" role="status">{saved ? "Saved." : ""}</Text>
        </Stack>
      </Stack>
    </form>
  );
}
