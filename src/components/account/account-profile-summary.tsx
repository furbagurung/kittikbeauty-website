import { Mail, Phone, ShieldCheck } from "lucide-react";

import type { Customer } from "@/lib/customer-auth";

type AccountProfileSummaryProps = {
  customer: Customer;
};

export function AccountProfileSummary({ customer }: AccountProfileSummaryProps) {
  const summaryItems = [
    { label: "Email", value: customer.email, icon: Mail },
    { label: "Phone", value: customer.phone || "Not added", icon: Phone },
    { label: "Status", value: customer.status, icon: ShieldCheck },
  ];

  return (
    <article className="rounded-[24px] border border-brandGold/30 bg-white p-5 shadow-[0_12px_35px_rgba(0,69,31,0.06)] sm:p-6">
      <p className="text-xs font-bold tracking-[0.14em] text-brandGold uppercase">
        Profile Summary
      </p>
      <h2 className="mt-2 text-xl font-black text-brandEmerald">Account details</h2>
      <div className="mt-5 grid gap-4">
        {summaryItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="flex gap-3 rounded-2xl bg-brandCream/70 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-brandEmerald">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold tracking-[0.12em] text-brandGold uppercase">
                  {item.label}
                </p>
                <p className="mt-1 break-words text-sm font-bold text-brandEmerald">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
