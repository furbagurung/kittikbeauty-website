"use client";

import { MouseEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";

import { useCustomerAuth } from "@/context/customer-auth-context";
import {
  addCustomerWishlistItem,
  deleteCustomerWishlistItem,
  getCustomerWishlist,
} from "@/lib/customer-account";
import { cn } from "@/lib/utils";

type WishlistButtonProps = {
  productId: string | number;
  label?: string;
  className?: string;
  iconClassName?: string;
  variant?: "icon" | "full";
};

export function WishlistButton({
  productId,
  label = "Save",
  className,
  iconClassName,
  variant = "icon",
}: WishlistButtonProps) {
  const router = useRouter();
  const { status, token } = useCustomerAuth();
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadWishlistState() {
      if (status !== "authenticated" || !token) return;

      try {
        const products = await getCustomerWishlist(token);
        if (active) {
          setWishlisted(products.some((product) => String(product.id) === String(productId)));
        }
      } catch {
        if (active) {
          setWishlisted(false);
        }
      }
    }

    void loadWishlistState();

    return () => {
      active = false;
    };
  }, [productId, status, token]);

  async function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (status !== "authenticated" || !token) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      if (wishlisted) {
        await deleteCustomerWishlistItem(token, productId);
        setWishlisted(false);
      } else {
        await addCustomerWishlistItem(token, productId);
        setWishlisted(true);
      }
    } finally {
      setLoading(false);
    }
  }

  const buttonLabel = wishlisted ? "Remove from wishlist" : label;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-pressed={wishlisted}
      aria-label={buttonLabel}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-brandGold/30 bg-white/95 font-bold text-brandEmerald shadow-sm backdrop-blur transition hover:bg-brandCream disabled:pointer-events-none disabled:opacity-70",
        variant === "icon" ? "size-9" : "h-11 px-5 text-sm",
        wishlisted && "border-brandGold bg-brandGold/20 text-brandGreen",
        className,
      )}
    >
      {loading ? (
        <Loader2 className={cn("size-4 animate-spin", iconClassName)} aria-hidden="true" />
      ) : (
        <Heart
          className={cn("size-4", wishlisted && "fill-current", iconClassName)}
          aria-hidden="true"
        />
      )}
      {variant === "full" ? <span>{wishlisted ? "Saved" : label}</span> : null}
    </button>
  );
}
