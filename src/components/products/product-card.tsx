import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/products/product-image";
import { formatPrice, productHref, stockLabel } from "@/lib/product-utils";
import type { Product } from "@/types/product";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const status = stockLabel(product);
  const isAvailable = status.toLowerCase() === "active";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:border-stone-400 hover:shadow-[0_20px_55px_rgba(28,25,23,0.12)]">
      <Link href={productHref(product)} className="block">
        <div className="relative h-[176px] overflow-hidden bg-stone-50 min-[420px]:h-[200px] sm:h-auto sm:aspect-[4/5]">
          <ProductImage
            src={product.image}
            alt={product.name}
            priority={priority}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
          />
          {product.categoryName ? (
            <Badge className="absolute left-2 top-2 max-w-[58%] rounded-md border border-stone-200 bg-white px-1.5 py-1 text-[9px] font-bold tracking-[0.06em] text-stone-700 uppercase shadow-sm sm:left-3 sm:top-3 sm:max-w-[46%] sm:px-2 sm:text-[10px] sm:tracking-[0.08em]" variant="secondary">
              {product.categoryName}
            </Badge>
          ) : null}
          {isAvailable ? (
            <Badge className="absolute right-2 top-2 rounded-md border border-stone-950 bg-stone-950 px-1.5 py-1 text-[9px] font-bold tracking-[0.06em] text-white uppercase shadow-sm sm:right-3 sm:top-3 sm:px-2 sm:text-[10px] sm:tracking-[0.08em]" variant="secondary">
              Available
            </Badge>
          ) : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-3.5 sm:p-6">
        <Link href={productHref(product)} className="block">
          <h3 className="line-clamp-2 min-h-[44px] text-[14px] font-bold leading-[1.5] tracking-tight text-stone-950 min-[420px]:text-[15px] sm:min-h-[60px] sm:text-[19px] sm:leading-[1.5]">
            {product.name}
          </h3>
        </Link>
        <div className="mt-3.5 flex items-end justify-between gap-3 sm:mt-5">
          <p className="text-[19px] font-bold leading-none text-stone-950 tabular-nums min-[420px]:text-xl sm:text-[27px]">{formatPrice(product.price)}</p>
        </div>
        <Button asChild variant="outline" className="mt-4 h-10 w-full rounded-md border-stone-950 bg-white px-2 text-[12px] font-bold text-stone-950 transition-colors hover:bg-stone-950 hover:text-white sm:mt-6 sm:h-12 sm:px-4 sm:text-[15px]">
          <Link href={productHref(product)}>View Product</Link>
        </Button>
      </div>
    </article>
  );
}
