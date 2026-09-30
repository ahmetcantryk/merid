"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Alert, Button, Field, Input, Stack } from "@meridui/react";
import { loginAction } from "@/lib/auth-actions";
import { loginSchema, type LoginInput } from "@/lib/schemas";
import { zodResolver } from "@/lib/zod-resolver";
import { applyServerErrors } from "@/lib/form-errors";

export function LoginForm() {
  const router = useRouter();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginInput) => {
    const result = await loginAction(values);
    if (result.ok) router.push(result.redirectTo);
    else applyServerErrors(result, setError);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={5}>
        {errors.root ? <Alert tone="danger">{errors.root.message}</Alert> : null}
        <Field label="Work email" required error={errors.email?.message}>
          <Input type="email" autoComplete="email" placeholder="you@company.com" {...register("email")} />
        </Field>
        <Field label="Password" required error={errors.password?.message} description='Tip: "wrong-password" shows a server error.'>
          <Input type="password" autoComplete="current-password" {...register("password")} />
        </Field>
        <Button type="submit" variant="primary" fullWidth loading={isSubmitting}>Log in</Button>
      </Stack>
    </form>
  );
}
