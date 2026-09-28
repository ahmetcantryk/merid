"use client";

import { useState, type FormEvent } from "react";
import { Alert, Button, Card, Field, Grid, Heading, Input, NativeSelect, Separator, Stack, Text, Textarea } from "@merid/react";

type Status = "idle" | "submitting" | "success" | "error";
type Errors = Partial<Record<"name" | "email" | "company", string>>;

function validate(data: FormData): Errors {
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const company = String(data.get("company") ?? "").trim();
  return {
    ...(name.length < 2 ? { name: "Enter your full name." } : {}),
    ...(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? { email: "Enter a valid work email." } : {}),
    ...(company.length === 0 ? { company: "Enter a company name." } : {}),
  };
}

export function FormLayoutExample() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = validate(data);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus("idle");
      const first = event.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }
    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 900));
    // Simulate a server failure on the demo domain so the error state can be seen.
    setStatus(String(data.get("email")).endsWith("@fail.test") ? "error" : "success");
  }

  const busy = status === "submitting";

  return (
    <Card variant="outline" padding="lg" style={{ width: "100%", maxWidth: 560 }}>
      <form onSubmit={onSubmit} noValidate aria-busy={busy}>
        <Stack gap={6}>
          <Stack gap={1}>
            <Heading level={3} size="h3">
              Request a demo
            </Heading>
            <Text size="sm">We reply within one business day. Use an address ending in @fail.test to see the error state.</Text>
          </Stack>

          {status === "success" ? (
            <Alert tone="success" title="Request sent">
              Check your inbox for a calendar invite.
            </Alert>
          ) : null}
          {status === "error" ? (
            <Alert tone="danger" title="We could not send your request" live="assertive">
              Nothing was saved. Try again in a moment.
            </Alert>
          ) : null}

          <Grid columns={2} gap={4} minItemWidth={200}>
            <Field label="Full name" required error={errors.name}>
              <Input name="name" autoComplete="name" disabled={busy} />
            </Field>
            <Field label="Work email" required error={errors.email}>
              <Input name="email" type="email" autoComplete="email" disabled={busy} />
            </Field>
            <Field label="Company" required error={errors.company}>
              <Input name="company" autoComplete="organization" disabled={busy} />
            </Field>
            <Field label="Team size">
              <NativeSelect name="size" defaultValue="11-50" disabled={busy}>
                <option value="1-10">1–10</option>
                <option value="11-50">11–50</option>
                <option value="51-200">51–200</option>
                <option value="200+">200+</option>
              </NativeSelect>
            </Field>
          </Grid>
          <Field label="What are you building?" description="Optional. Two or three sentences is plenty.">
            <Textarea name="notes" rows={3} disabled={busy} />
          </Field>

          <Separator />
          <Stack direction="row" gap={2} justify="end">
            <Button type="reset" variant="ghost" disabled={busy} onClick={() => { setErrors({}); setStatus("idle"); }}>
              Clear
            </Button>
            <Button type="submit" variant="primary" loading={busy}>
              {busy ? "Sending…" : "Send request"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Card>
  );
}
