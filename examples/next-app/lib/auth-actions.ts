"use server";

import { loginSchema, signupSchema, type ActionResult } from "./schemas";

const DEMO_LATENCY_MS = 600;
const TAKEN_EMAIL = "taken@northwind.example";

function fieldErrorsOf(issues: { path: PropertyKey[]; message: string }[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

const pause = () => new Promise((r) => setTimeout(r, DEMO_LATENCY_MS));

/** Mock sign-in. Re-validates on the server: never trust the client-side check alone. */
export async function loginAction(input: unknown): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsOf(parsed.error.issues) };
  await pause();
  if (parsed.data.password === "wrong-password") {
    return { ok: false, formError: "That email and password do not match." };
  }
  return { ok: true, redirectTo: "/settings" };
}

/** Mock account creation; one address is "taken" to demonstrate server-side field errors. */
export async function signupAction(input: unknown): Promise<ActionResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsOf(parsed.error.issues) };
  await pause();
  if (parsed.data.email.toLowerCase() === TAKEN_EMAIL) {
    return { ok: false, fieldErrors: { email: "An account with this email already exists." } };
  }
  return { ok: true, redirectTo: "/onboarding/1" };
}
