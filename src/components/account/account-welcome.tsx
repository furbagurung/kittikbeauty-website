import { LogOut, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Customer } from "@/lib/customer-auth";

type AccountWelcomeProps = {
  customer: Customer;
  onLogout: () => void;
};

export function AccountWelcome({ customer, onLogout }: AccountWelcomeProps) {
  return (
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
            <h1 className="mt-1 text-2xl font-black leading-tight sm:text-3xl">
              Welcome, {customer.fullName}
            </h1>
          </div>
        </div>
        <Button
          type="button"
          onClick={onLogout}
          className="h-11 rounded-full bg-white px-6 text-sm font-bold text-brandEmerald hover:bg-[#F3E7C3]"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Logout
        </Button>
      </div>
    </div>
  );
}
