"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Alert, Button, Checkbox, Field, Input, Stack, Text } from "@merid/react";
import { signupAction } from "@/lib/auth-actions";
import { applyServerErrors } from "@/lib/form-errors";
import { signupSchema, type SignupInput } from "@/lib/schemas";
import { zodResolver } from "@/lib/zod-resolver";

export function SignupForm() {
  const router = useRouter();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirm: "", terms: false },
  });

  const onSubmit = async (values: SignupInput) => {
    const result = await signupAction(values);
    if (result.ok) router.push(result.redirectTo);
    else applyServerErrors(result, setError);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={5}>
        {errors.root ? <Alert tone="danger">{errors.root.message}</Alert> : null}
        <Field label="Full name" required error={errors.name?.message}>
          <Input autoComplete="name" {...register("name")} />
        </Field>
        <Field label="Work email" required error={errors.email?.message} description="taken@northwind.example is already registered.">
          <Input type="email" autoComplete="email" placeholder="you@company.com" {...register("email")} />
        </Field>
        <Field label="Password" required error={errors.password?.message} description="10+ characters, including a number.">
          <Input type="password" autoComplete="new-password" {...register("password")} />
        </Field>
        <Field label="Confirm password" required error={errors.confirm?.message}>
          <Input type="password" autoComplete="new-password" {...register("confirm")} />
        </Field>
        <Stack gap={1}>
          <Checkbox invalid={Boolean(errors.terms)} aria-describedby={errors.terms ? "terms-error" : undefined} {...register("terms")}>
            I accept the terms of service
          </Checkbox>
          {errors.terms ? <Text id="terms-error" size="sm" tone="danger">{errors.terms.message}</Text> : null}
        </Stack>
        <Button type="submit" variant="primary" fullWidth loading={isSubmitting}>Create account</Button>
      </Stack>
    </form>
  );
}
