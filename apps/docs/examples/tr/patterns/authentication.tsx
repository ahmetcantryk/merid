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
      setEmailError("Kayıt olduğun e-posta adresini gir.");
      return;
    }
    setEmailError(undefined);
    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 800));
    // Demo: hata durumu görülsün diye her deneme başarısız olur. Hangi alanın yanlış olduğunu asla söyleme.
    setStatus("error");
  }

  const busy = status === "submitting";

  return (
    <Card variant="elevated" padding="lg" style={{ width: "100%", maxWidth: 380 }}>
      <Stack gap={6}>
        <Stack gap={1}>
          <Heading level={3} size="h3">
            Merid'e giriş yap
          </Heading>
          <Text size="sm">
            Hesabın yok mu? <Link href="#">Hesap oluştur</Link>
          </Text>
        </Stack>

        <Button fullWidth disabled={busy}>
          SSO ile devam et
        </Button>
        <Stack direction="row" align="center" gap={3}>
          <Separator style={{ flex: 1 }} />
          <Text size="xs" tone="muted">
            veya
          </Text>
          <Separator style={{ flex: 1 }} />
        </Stack>

        <form onSubmit={onSubmit} noValidate>
          <Stack gap={4}>
            {status === "error" ? (
              <Alert tone="danger" live="assertive">
                E-posta ve şifre eşleşmiyor.
              </Alert>
            ) : null}
            <Field label="E-posta" error={emailError}>
              <Input name="email" type="email" autoComplete="username" disabled={busy} />
            </Field>
            <Field label="Şifre">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                disabled={busy}
              />
            </Field>
            <Stack direction="row" justify="between" align="center">
              <Checkbox checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)}>
                Şifreyi göster
              </Checkbox>
              <Link href="#" tone="muted">
                Şifreni mi unuttun?
              </Link>
            </Stack>
            <Button type="submit" variant="primary" fullWidth loading={busy}>
              Giriş yap
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
            E-postanı kontrol et
          </Heading>
          <Text size="sm">ada@northwind.dev adresine 6 haneli bir kod gönderdik. Kodun süresi 10 dakika içinde dolar.</Text>
        </Stack>
        <Field label="Doğrulama kodu">
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
          Doğrula
        </Button>
        <Text size="sm" tone="muted">
          Kod gelmedi mi? <Link href="#">Kodu yeniden gönder</Link>
        </Text>
      </Stack>
    </Card>
  );
}
