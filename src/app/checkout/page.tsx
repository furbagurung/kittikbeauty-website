import type { Metadata } from "next";

import { CheckoutClient } from "@/components/checkout/checkout-client";
import { PageShell } from "@/components/shared/page-shell";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Kittik Beauty order.",
  alternates: {
    canonical: "/checkout",
  },
};

export default function CheckoutPage() {
  return (
    <PageShell>
      <CheckoutClient />
    </PageShell>
  );
}
