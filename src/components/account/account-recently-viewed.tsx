"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";

import { CustomerProductCard } from "@/components/account/customer-product-card";
import { useCustomerAuth } from "@/context/customer-auth-context";
import { getCustomerRecentlyViewed } from "@/lib/customer-account";
import type { Product } from "@/types/product";

export function AccountRecentlyViewed() {
  const { token } = useCustomerAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadRecentlyViewed() {
      if (!token) return;

      try {
        const nextProducts = await getCustomerRecentlyViewed(token);
        if (active) {
          setProducts(nextProducts);
        }
      } catch (recentError) {
        if (active) {
          setError(recentError instanceof Error ? recentError.message : "Failed to load recently viewed products");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadRecentlyViewed();

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <section className="rounded-[24px] border border-brandGold/30 bg-white p-5 shadow-[0_12px_35px_rgba(0,69,31,0.06)] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-brandGold uppercase">
            Recently Viewed
          </p>
          <h2 className="mt-2 text-xl font-black text-brandEmerald">Viewed products</h2>
        </div>
        <div className="flex size-10 items-center justify-center rounded-full bg-brandCream text-brandEmerald">
          <RefreshCw className="size-5" aria-hidden="true" />
        </div>
      </div>

      {loading ? (
        <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-brandGold/30 bg-brandCream px-4 py-3 text-sm font-bold text-brandEmerald">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Loading recently viewed
        </div>
      ) : null}

      {error ? (
        <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      {!loading && !error && products.length === 0 ? (
        <p className="mt-5 rounded-2xl bg-brandCream/70 px-4 py-4 text-sm leading-6 text-[#5F5F5F]">
          Product pages you view while logged in will appear here.
        </p>
      ) : null}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {products.map((product) => (
          <CustomerProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
