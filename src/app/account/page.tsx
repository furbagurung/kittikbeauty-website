import type { Metadata } from "next";

import { AccountDashboard } from "@/components/account/account-dashboard";
import { PageShell } from "@/components/shared/page-shell";

export const metadata: Metadata = {
  title: "My Account",
  description: "View your Kittik Beauty customer account.",
  alternates: {
    canonical: "/account",
  },
};

export default function AccountPage() {
  return (
    <PageShell>
      <AccountDashboard />
    </PageShell>
  );
}
