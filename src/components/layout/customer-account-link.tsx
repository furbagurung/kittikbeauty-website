"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";

import { useCustomerAuth } from "@/context/customer-auth-context";

type CustomerAccountIconLinkProps = {
  className?: string;
  iconClassName?: string;
};

export function CustomerAccountIconLink({ className, iconClassName }: CustomerAccountIconLinkProps) {
  const { customer, logout, status } = useCustomerAuth();
  const isAuthenticated = status === "authenticated" && customer;
  const href = isAuthenticated ? "/account" : "/login";

  if (!isAuthenticated) {
    return (
      <Link href={href} className={className} aria-label="Customer login">
        <UserRound className={iconClassName} aria-hidden="true" />
      </Link>
    );
  }

  return (
    <div className={`group relative ${className ?? ""}`}>
      <Link href="/account" className="inline-flex size-full items-center justify-center rounded-full" aria-label="My account">
        <UserRound className={iconClassName} aria-hidden="true" />
      </Link>
      <div className="invisible absolute right-0 top-[calc(100%+10px)] z-50 hidden w-48 rounded-2xl border border-brandGold/30 bg-white p-2 text-sm shadow-[0_18px_50px_rgba(0,69,31,0.16)] opacity-0 transition sm:block group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <Link
          href="/account"
          className="block rounded-xl px-3 py-2 font-bold text-brandEmerald transition hover:bg-brandCream"
        >
          My Account
        </Link>
        <button
          type="button"
          onClick={() => void logout()}
          className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-bold text-[#5F5F5F] transition hover:bg-brandCream hover:text-brandEmerald"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  );
}

export function CustomerMobileAccountTab() {
  const pathname = usePathname();
  const { customer, status } = useCustomerAuth();
  const href = status === "authenticated" && customer ? "/account" : "/login";
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`flex min-h-[66px] flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-bold tracking-[0.02em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brandGold ${
        active ? "bg-brandCream text-brandGreen" : "text-[#5F5F5F]"
      }`}
    >
      <UserRound className={`size-5 ${active ? "stroke-[2.5]" : "stroke-[2]"}`} aria-hidden="true" />
      <span>Account</span>
    </Link>
  );
}
