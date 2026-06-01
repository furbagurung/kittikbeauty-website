import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { PageShell } from "@/components/shared/page-shell";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your Kittik Beauty customer account.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return (
    <PageShell>
      <LoginForm />
    </PageShell>
  );
}
