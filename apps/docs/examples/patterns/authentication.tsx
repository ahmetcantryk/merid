"use client";

import { useState, type FormEvent } from "react";
import { Alert, Button, Card, Checkbox, Field, Heading, Input, Link, Separator, Stack, Text } from "@merid/react";

type Status = "idle" | "submitting" | "error";

export function SignInExample() {
  const [status, setStatus] = useState<Status>("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string>();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    if (!email.includes("@")) {
      setEmailError("Enter the email you signed up with.");
      return;
    }
    setEmailError(undefined);
    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 800));
    // Demo: every attempt fails so the error state is visible. Never say which field was wrong.
    setStatus("error");
  }

  const busy = status === "submitting";

  return (
    <Card variant="elevated" padding="lg" style={{ width: "100%", maxWidth: 380 }}>
      <Stack gap={6}>
        <Stack gap={1}>
          <Heading level={3} size="h3">
            Sign in to Merid
          </Heading>
          <Text size="sm">
            New here? <Link href="#">Create an account</Link>
          </Text>
        </Stack>

        <Button fullWidth disabled={busy}>
          Continue with SSO
        </Button>
        <Stack direction="row" align="center" gap={3}>
          <Separator style={{ flex: 1 }} />
          <Text size="xs" tone="muted">
            or
          </Text>
          <Separator style={{ flex: 1 }} />
        </Stack>

        <form onSubmit={onSubmit} noValidate>
          <Stack gap={4}>
            {status === "error" ? (
              <Alert tone="danger" live="assertive">
                That email and password do not match.
              </Alert>
            ) : null}
            <Field label="Email" error={emailError}>
              <Input name="email" type="email" autoComplete="username" disabled={busy} />
            </Field>
            <Field label="Password">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                disabled={busy}
              />
            </Field>
            <Stack direction="row" justify="between" align="center">
              <Checkbox checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)}>
                Show password
              </Checkbox>
              <Link href="#" tone="muted">
                Forgot password?
              </Link>
            </Stack>
            <Button type="submit" variant="primary" fullWidth loading={busy}>
              Sign in
            </Button>
          </Stack>
        </form>
      </Stack>
    </Card>
  );
}

export function OneTimeCodeExample() {
  const [code, setCode] = useState("");
  const complete = /^\d{6}$/.test(code);
  return (
    <Card variant="elevated" padding="lg" style={{ width: "100%", maxWidth: 380 }}>
      <Stack gap={5}>
        <Stack gap={1}>
          <Heading level={3} size="h3">
            Check your email
          </Heading>
          <Text size="sm">We sent a 6-digit code to ada@northwind.dev. It expires in 10 minutes.</Text>
        </Stack>
        <Field label="Verification code">
          <Input
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            style={{ letterSpacing: "0.3em", fontVariantNumeric: "tabular-nums" }}
          />
        </Field>
        <Button variant="primary" fullWidth disabled={!complete}>
          Verify
        </Button>
        <Text size="sm" tone="muted">
          Didn’t get it? <Link href="#">Resend code</Link>
        </Text>
      </Stack>
    </Card>
  );
}
