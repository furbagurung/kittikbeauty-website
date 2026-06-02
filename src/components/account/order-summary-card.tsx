import { ChevronDown, ChevronUp, PackageCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CustomerOrderSummary } from "@/lib/customer-account";

type OrderSummaryCardProps = {
  order: CustomerOrderSummary;
  expanded: boolean;
  loading: boolean;
  onToggle: () => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function formatLabel(value: string) {
  return value.replace(/_/g, " ");
}

export function OrderSummaryCard({ order, expanded, loading, onToggle }: OrderSummaryCardProps) {
  return (
    <article className="rounded-[22px] border border-brandGold/30 bg-white p-5 shadow-[0_12px_35px_rgba(0,69,31,0.06)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brandCream text-brandEmerald">
            <PackageCheck className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-black text-brandEmerald">Order #{order.id}</h3>
            <p className="mt-1 text-sm text-[#5F5F5F]">{formatDate(order.createdAt)}</p>
          </div>
        </div>
        <Button
          type="button"
          onClick={onToggle}
          disabled={loading}
          className="h-10 rounded-full bg-brandGreen px-4 text-sm font-bold text-white hover:bg-brandEmerald"
        >
          {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          {expanded ? "Hide details" : "View details"}
        </Button>
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-brandCream/70 p-3">
          <dt className="text-xs font-bold tracking-[0.12em] text-brandGold uppercase">Status</dt>
          <dd className="mt-1 font-bold capitalize text-brandEmerald">{formatLabel(order.status)}</dd>
        </div>
        <div className="rounded-2xl bg-brandCream/70 p-3">
          <dt className="text-xs font-bold tracking-[0.12em] text-brandGold uppercase">Payment</dt>
          <dd className="mt-1 font-bold capitalize text-brandEmerald">{formatLabel(order.paymentStatus)}</dd>
        </div>
        <div className="rounded-2xl bg-brandCream/70 p-3">
          <dt className="text-xs font-bold tracking-[0.12em] text-brandGold uppercase">Items</dt>
          <dd className="mt-1 font-bold text-brandEmerald">{order.totalItems}</dd>
        </div>
        <div className="rounded-2xl bg-brandCream/70 p-3">
          <dt className="text-xs font-bold tracking-[0.12em] text-brandGold uppercase">Total</dt>
          <dd className="mt-1 font-bold text-brandEmerald">{formatCurrency(order.total)}</dd>
        </div>
      </dl>
    </article>
  );
}

export { formatCurrency, formatDate, formatLabel };
