"use client";

import { Button, Card, Field, Input, Stack, Switch } from "@merid/react";

/** Live counterpart of SHOWCASE_CODE on the landing page; keep the two identical. */
export function Workspace() {
  return (
    <Card variant="elevated">
      <Stack gap={5} align="start">
        <Field label="Workspace name">
          <Input defaultValue="Northwind" />
        </Field>
        <Switch defaultChecked>Weekly digest</Switch>
        <Button variant="primary">Save changes</Button>
      </Stack>
    </Card>
  );
}
