import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

import { ProductImage } from "@/components/products/product-image";
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
    <article className="group h-full">
      <Link
        href={productHref(product)}
        className="block h-full overflow-hidden rounded-[22px] border border-neutral-200 bg-white shadow-[0_10px_28px_rgba(24,24,27,0.06)] transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_18px_45px_rgba(24,24,27,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-4"
      >
        <div className="relative aspect-[1/1.06] overflow-hidden bg-neutral-50">
          <ProductImage
            src={product.image}
            alt={product.name}
            priority={priority}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
          <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-stone-950 shadow-sm backdrop-blur">
            <Heart className="size-4" aria-hidden="true" />
          </span>
        </div>

        <div className="p-3.5 sm:p-4">
          <p className="line-clamp-1 text-[12px] font-medium uppercase tracking-[0.02em] text-stone-500">
            {metaLabel}
          </p>
          <h3 className="mt-1 line-clamp-2 min-h-[40px] text-[14px] font-bold leading-[1.35] tracking-tight text-stone-950 sm:min-h-[44px] sm:text-[15px]">
            {product.name}
          </h3>
          <div className="mt-3 flex items-center justify-between gap-2">
            <p className="text-[16px] font-extrabold leading-none text-stone-950 tabular-nums sm:text-[18px]">
              {formatPrice(product.price)}
            </p>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-stone-950 text-white transition group-hover:bg-black">
              <ShoppingBag className="size-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
