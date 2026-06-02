"use client";

import { useEffect } from "react";

import { useCustomerAuth } from "@/context/customer-auth-context";
import { trackCustomerRecentlyViewed } from "@/lib/customer-account";

type RecentlyViewedTrackerProps = {
  productId: string | number;
};

export function RecentlyViewedTracker({ productId }: RecentlyViewedTrackerProps) {
  const { status, token } = useCustomerAuth();

  useEffect(() => {
    if (status !== "authenticated" || !token) return;

    void trackCustomerRecentlyViewed(token, productId).catch(() => undefined);
  }, [productId, status, token]);

  return null;
}
