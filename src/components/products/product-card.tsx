import Link from "next/link";

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
    <article className="group h-full bg-white">
      <Link href={productHref(product)} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-4">
        <div className="relative aspect-square overflow-hidden bg-stone-100">
          <ProductImage
            src={product.image}
            alt={product.name}
            priority={priority}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div className="pt-4">
          <p className="line-clamp-1 text-[12px] font-medium uppercase tracking-[0.02em] text-stone-500">
            {metaLabel}
          </p>
          <h3 className="mt-1 line-clamp-2 min-h-[42px] text-[15px] font-medium leading-[1.4] tracking-tight text-stone-950">
            {product.name}
          </h3>
          <p className="mt-2 text-[18px] font-extrabold leading-none text-stone-950 tabular-nums">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </article>
  );
}
