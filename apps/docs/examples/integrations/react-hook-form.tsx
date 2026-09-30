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
} from "@meridui/react";

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
        <Field label="Email" required error={errors.email?.message}>
          <Input
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            {...register("email", {
              required: "Enter an email address.",
              pattern: { value: EMAIL, message: "That does not look like an email address." },
            })}
          />
        </Field>

        <Field label="Role" required error={errors.role?.message}>
          <NativeSelect placeholder="Choose a role" {...register("role", { required: "Pick a role." })}>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="billing">Billing</option>
          </NativeSelect>
        </Field>

        <Controller
          control={control}
          name="region"
          rules={{ required: "Pick a data region." }}
          render={({ field, fieldState }) => (
            <Field id="rhf-region" label="Data region" required error={fieldState.error?.message}>
              <Select.Root
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                onOpenChange={(open) => {
                  if (!open) field.onBlur();
                }}
                placeholder="Choose a region"
              >
                <Select.Trigger id="rhf-region" ref={field.ref} invalid={fieldState.invalid} />
                <Select.Content>
                  <Select.Item value="eu">Europe (Frankfurt)</Select.Item>
                  <Select.Item value="us">United States (Virginia)</Select.Item>
                  <Select.Item value="ap">Asia Pacific (Singapore)</Select.Item>
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
              aria-label="Seat type"
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
            >
              <Radio value="full" description="Can edit projects and invite people.">
                Full seat
              </Radio>
              <Radio value="viewer" description="Read-only. Free on every plan.">
                Viewer
              </Radio>
            </RadioGroup>
          )}
        />

        <Controller
          control={control}
          name="notify"
          render={({ field }) => (
            <Switch ref={field.ref} checked={field.value} onCheckedChange={field.onChange} onBlur={field.onBlur}>
              Send an invitation email
            </Switch>
          )}
        />

        <Checkbox invalid={Boolean(errors.terms)} {...register("terms", { required: true })}>
          I have permission to add this person
        </Checkbox>
        {errors.terms ? (
          <Text size="xs" tone="danger" role="alert">
            Confirm before sending the invite.
          </Text>
        ) : null}

        <Stack direction="row" gap={2}>
          <Button type="submit" variant="primary" loading={isSubmitting}>
            Send invite
          </Button>
          <Button type="button" variant="ghost" onClick={() => reset(DEFAULTS)} disabled={isSubmitting}>
            Reset
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
