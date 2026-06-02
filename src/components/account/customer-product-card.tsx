import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { ProductImage } from "@/components/products/product-image";
import { formatPrice, productHref } from "@/lib/product-utils";
import type { Product } from "@/types/product";

type CustomerProductCardProps = {
  product: Product;
};

export function CustomerProductCard({ product }: CustomerProductCardProps) {
  const metaLabel = product.brandName ?? product.categoryName ?? "Kittik Beauty";

  return (
    <Link
      href={productHref(product)}
      className="group grid grid-cols-[88px_1fr] overflow-hidden rounded-[20px] border border-brandGold/30 bg-white shadow-[0_12px_35px_rgba(0,69,31,0.06)] transition hover:border-brandGold/70 sm:grid-cols-[112px_1fr]"
    >
      <div className="relative aspect-square overflow-hidden bg-brandCream">
        <ProductImage
          src={product.image}
          alt={`${product.name} beauty product available at Kittik Beauty Nepal`}
          sizes="112px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex min-w-0 flex-col justify-between p-4">
        <div className="min-w-0">
          <p className="line-clamp-1 text-[11px] font-bold uppercase tracking-[0.08em] text-brandGold">
            {metaLabel}
          </p>
          <h3 className="mt-1 line-clamp-2 text-sm font-black leading-5 text-brandEmerald">
            {product.name}
          </h3>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm font-black text-brandEmerald">{formatPrice(product.price)}</p>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brandGreen text-white">
            <ShoppingBag className="size-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
