import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";
import { PageShell } from "@/components/shared/page-shell";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a Kittik Beauty customer account.",
  alternates: {
    canonical: "/register",
  },
};

export default function RegisterPage() {
  return (
    <PageShell>
      <RegisterForm />
    </PageShell>
  );
}
