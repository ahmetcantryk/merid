import type { Metadata } from "next";
import NextLink from "next/link";
import { Link } from "@merid/react";
import { AuthCard } from "@/components/AuthCard";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <AuthCard
      title="Log in"
      description="Welcome back to Northwind Cloud."
      footer={<>No account yet? <NextLink href="/signup" className="mrd-link" data-tone="accent" data-underline="hover">Create one</NextLink></>}
    >
      <LoginForm />
      <Link href="#" tone="muted" className="forgot">Forgot password?</Link>
    </AuthCard>
  );
}
