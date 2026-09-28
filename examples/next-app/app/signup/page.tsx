import type { Metadata } from "next";
import NextLink from "next/link";
import { AuthCard } from "@/components/AuthCard";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Free for one project. No card required."
      footer={<>Already have an account? <NextLink href="/login" className="mrd-link" data-tone="accent" data-underline="hover">Log in</NextLink></>}
    >
      <SignupForm />
    </AuthCard>
  );
}
