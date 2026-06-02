import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { ProductImage } from "@/components/products/product-image";
import { WishlistButton } from "@/components/products/wishlist-button";
import { formatPrice, productHref } from "@/lib/product-utils";
import type { Product } from "@/types/product";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const metaLabel = product.brandName ?? product.categoryName ?? "Kittik Beauty";

  return (
    <article className="group relative h-full">
      <Link
        href={productHref(product)}
        className="block h-full overflow-hidden rounded-[22px] border border-brandGold/20 bg-white shadow-[0_10px_28px_rgba(0,69,31,0.05)] transition duration-300 hover:-translate-y-1 hover:border-brandGold/70 hover:shadow-[0_18px_45px_rgba(0,69,31,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brandGold focus-visible:ring-offset-4"
      >
        <div className="relative aspect-[1/1.06] overflow-hidden bg-brandCream">
          <ProductImage
            src={product.image}
            alt={`${product.name} beauty product available at Kittik Beauty Nepal`}
            priority={priority}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div className="p-3.5 sm:p-4">
          <p className="line-clamp-1 text-[12px] font-medium uppercase tracking-[0.02em] text-[#5F5F5F]">
            {metaLabel}
          </p>
          <h3 className="mt-1 line-clamp-2 min-h-[40px] text-[14px] font-bold leading-[1.35] tracking-tight text-[#111111] sm:min-h-[44px] sm:text-[15px]">
            {product.name}
          </h3>
          <div className="mt-3 flex items-center justify-between gap-2">
            <p className="text-[16px] font-extrabold leading-none text-brandEmerald tabular-nums sm:text-[18px]">
              {formatPrice(product.price)}
            </p>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brandGreen text-white transition group-hover:bg-brandEmerald">
              <ShoppingBag className="size-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
      <WishlistButton productId={product.id} className="absolute right-3 top-3 z-10" />
    </article>
  );
}
