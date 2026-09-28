import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid work email."),
  password: z.string().min(8, "Passwords are at least 8 characters."),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Tell us your name."),
    email: z.email("Enter a valid work email."),
    password: z
      .string()
      .min(10, "Use at least 10 characters.")
      .regex(/\d/, "Include at least one number."),
    confirm: z.string(),
    terms: z.boolean().refine((v) => v, "Accept the terms to continue."),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords do not match." });
export type SignupInput = z.infer<typeof signupSchema>;

/** Shape every auth server action returns. */
export type ActionResult =
  | { ok: true; redirectTo: string }
  | { ok: false; formError?: string; fieldErrors?: Record<string, string> };
