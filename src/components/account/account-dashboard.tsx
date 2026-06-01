"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Heart, Loader2, MapPin, PackageCheck, RefreshCw, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCustomerAuth } from "@/context/customer-auth-context";

const futureAccountSections = [
  { title: "Orders", description: "Order history will appear here.", icon: PackageCheck },
  { title: "Wishlist", description: "Saved products will appear here.", icon: Heart },
  { title: "Saved Addresses", description: "Delivery addresses will appear here.", icon: MapPin },
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
      <div className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-brandGold/30 bg-brandGreen p-6 text-white shadow-[0_24px_70px_rgba(0,69,31,0.12)] sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-brandEmerald">
                <UserRound className="size-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-brandGold uppercase">
                  My Account
                </p>
                <h1 className="mt-1 text-3xl font-black leading-tight">
                  {customer.fullName}
                </h1>
              </div>
            </div>
            <Button
              type="button"
              onClick={() => void logout()}
              className="h-11 rounded-full bg-white px-6 text-sm font-bold text-brandEmerald hover:bg-[#F3E7C3]"
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 rounded-[24px] border border-brandGold/30 bg-white p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-brandGold uppercase">
              Email
            </p>
            <p className="mt-1 break-words text-base font-bold text-brandEmerald">
              {customer.email}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-brandGold uppercase">
              Phone
            </p>
            <p className="mt-1 text-base font-bold text-brandEmerald">
              {customer.phone || "Not added"}
            </p>
          </div>
        </div>

        {/* Phase 2 modules can replace these placeholders with real account feature data. */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {futureAccountSections.map((section) => {
            const Icon = section.icon;

            return (
              <article
                key={section.title}
                className="rounded-[22px] border border-brandGold/30 bg-white p-5 shadow-[0_12px_35px_rgba(0,69,31,0.06)]"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-brandCream text-brandEmerald">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-lg font-black text-brandEmerald">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#5F5F5F]">
                  {section.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
