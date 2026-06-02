"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Heart, Loader2, RefreshCw } from "lucide-react";

import { useCustomerAuth } from "@/context/customer-auth-context";
import { AccountAddresses } from "@/components/account/account-addresses";
import { AccountModuleCards } from "@/components/account/account-module-cards";
import { AccountOrders } from "@/components/account/account-orders";
import { AccountPasswordForm } from "@/components/account/account-password-form";
import { AccountProfileForm } from "@/components/account/account-profile-form";
import { AccountProfileSummary } from "@/components/account/account-profile-summary";
import { AccountWelcome } from "@/components/account/account-welcome";

const accountModules = [
  { title: "Wishlist", description: "Saved products will appear here.", icon: Heart },
  { title: "Recently Viewed", description: "Recently viewed products will appear here.", icon: RefreshCw },
];

export function AccountDashboard() {
  const router = useRouter();
  const { customer, logout, status } = useCustomerAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [router, status]);

  if (status === "loading") {
    return (
      <section className="flex min-h-[50vh] items-center justify-center bg-brandCream px-4">
        <div className="inline-flex items-center gap-3 rounded-full border border-brandGold/30 bg-white px-5 py-3 text-sm font-bold text-brandEmerald">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Loading account
        </div>
      </section>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <section className="bg-brandCream">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <AccountWelcome customer={customer} onLogout={() => void logout()} />

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <AccountProfileSummary customer={customer} />
          <AccountModuleCards modules={accountModules} />
        </div>

        <div className="mt-6 grid gap-5">
          <AccountOrders />
          <AccountAddresses />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <AccountProfileForm customer={customer} />
          <AccountPasswordForm />
        </div>
      </div>
    </section>
  );
}
