"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Checkbox,
  Field,
  Input,
  NativeSelect,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Text,
} from "@merid/react";

interface InviteValues {
  email: string;
  role: string;
  region: string;
  seat: "full" | "viewer";
  notify: boolean;
  terms: boolean;
}

const DEFAULTS: InviteValues = { email: "", role: "", region: "", seat: "full", notify: true, terms: false };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function RhfInviteForm() {
  const [submitted, setSubmitted] = useState<InviteValues | null>(null);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteValues>({ defaultValues: DEFAULTS, mode: "onTouched" });

  const onSubmit = async (values: InviteValues) => {
    await wait(700);
    setSubmitted(values);
    reset(DEFAULTS);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ width: "100%", maxWidth: 420 }}>
      <Stack gap={5}>
        <Field label="E-posta" required error={errors.email?.message}>
          <Input
            type="email"
            placeholder="sen@sirket.com"
            autoComplete="email"
            {...register("email", {
              required: "E-posta adresini gir.",
              pattern: { value: EMAIL, message: "E-posta adresi geçersiz." },
            })}
          />
        </Field>

        <Field label="Rol" required error={errors.role?.message}>
          <NativeSelect placeholder="Rol seç" {...register("role", { required: "Bir rol seç." })}>
            <option value="admin">Yönetici</option>
            <option value="member">Üye</option>
            <option value="billing">Faturalandırma</option>
          </NativeSelect>
        </Field>

        <Controller
          control={control}
          name="region"
          rules={{ required: "Bir veri bölgesi seç." }}
          render={({ field, fieldState }) => (
            <Field id="rhf-region" label="Veri bölgesi" required error={fieldState.error?.message}>
              <Select.Root
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                onOpenChange={(open) => {
                  if (!open) field.onBlur();
                }}
                placeholder="Bölge seç"
              >
                <Select.Trigger id="rhf-region" ref={field.ref} invalid={fieldState.invalid} />
                <Select.Content>
                  <Select.Item value="eu">Avrupa (Frankfurt)</Select.Item>
                  <Select.Item value="us">ABD (Virginia)</Select.Item>
                  <Select.Item value="ap">Asya Pasifik (Singapur)</Select.Item>
                </Select.Content>
              </Select.Root>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="seat"
          render={({ field }) => (
            <RadioGroup
              aria-label="Koltuk tipi"
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
            >
              <Radio value="full" description="Projeleri düzenleyebilir ve kişi davet edebilir.">
                Tam koltuk
              </Radio>
              <Radio value="viewer" description="Salt okunur. Her planda ücretsiz.">
                İzleyici
              </Radio>
            </RadioGroup>
          )}
        />

        <Controller
          control={control}
          name="notify"
          render={({ field }) => (
            <Switch ref={field.ref} checked={field.value} onCheckedChange={field.onChange} onBlur={field.onBlur}>
              Davet e-postası gönder
            </Switch>
          )}
        />

        <Checkbox invalid={Boolean(errors.terms)} {...register("terms", { required: true })}>
          Bu kişiyi eklemeye yetkim var
        </Checkbox>
        {errors.terms ? (
          <Text size="xs" tone="danger" role="alert">
            Daveti göndermeden önce onayla.
          </Text>
        ) : null}

        <Stack direction="row" gap={2}>
          <Button type="submit" variant="primary" loading={isSubmitting}>
            Davet gönder
          </Button>
          <Button type="button" variant="ghost" onClick={() => reset(DEFAULTS)} disabled={isSubmitting}>
            Sıfırla
          </Button>
        </Stack>

        {submitted ? (
          <Text size="xs" tone="muted" as="pre" style={{ margin: 0, whiteSpace: "pre-wrap" }}>
            {JSON.stringify(submitted, null, 2)}
          </Text>
        ) : null}
      </Stack>
    </form>
  );
}
