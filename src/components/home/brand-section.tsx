import Link from "next/link";

import { ProductImage } from "@/components/products/product-image";
import { Button } from "@/components/ui/button";
import { brandHref, buildBrandSummaries } from "@/lib/category-utils";
import type { Brand, Product } from "@/types/product";

const fallbackVisuals = [
  "bg-[radial-gradient(circle_at_30%_25%,#fecdd3,transparent_42%),linear-gradient(135deg,#ffffff,#e7e5e4)]",
  "bg-[radial-gradient(circle_at_72%_28%,#ddd6fe,transparent_42%),linear-gradient(135deg,#ffffff,#e5e7eb)]",
  "bg-[radial-gradient(circle_at_28%_72%,#bae6fd,transparent_42%),linear-gradient(135deg,#fafafa,#d6d3d1)]",
  "bg-[radial-gradient(circle_at_70%_68%,#fde68a,transparent_42%),linear-gradient(135deg,#ffffff,#e7e5e4)]",
];

export function BrandSection({
  brands,
  products,
}: {
  brands: Brand[];
  products: Product[];
}) {
  const brandSummaries = buildBrandSummaries(brands, products).slice(0, 12);

  if (!brandSummaries.length) return null;

  return (
    <section id="brands" className="border-b border-stone-200 bg-white py-9 sm:py-12">
      <div className="mx-auto w-full max-w-[1304px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em] text-stone-500">BRANDS</p>
            <h2 className="text-[30px] font-bold leading-tight tracking-tight text-stone-950 sm:text-5xl">
              Shop by brands
            </h2>
            <p className="mt-2 text-base leading-7 text-stone-600">Explore beauty favorites by brand.</p>
          </div>
          <Button asChild variant="outline" className="h-11 rounded-md border-stone-950 bg-white px-6 font-bold sm:shrink-0">
            <Link href="/products/brands">View all brands</Link>
          </Button>
        </div>

        <div className="no-scrollbar -mx-3 mt-4 flex snap-x gap-5 overflow-x-auto overscroll-x-contain scroll-smooth px-3 py-5 sm:-mx-4 sm:mt-6 sm:gap-7 sm:px-4 sm:py-6">
          {brandSummaries.map((brand, index) => {
            const useLogoFit = Boolean(brand.logo);

            return (
              <Link
                key={`${brand.id}-${brand.slugValue}`}
                href={brandHref(brand)}
                className="group flex w-[92px] shrink-0 snap-start flex-col items-center px-1 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-4 sm:w-32"
              >
                <div className="size-[84px] rounded-full transition-transform duration-300 ease-out group-hover:-translate-y-0.5 sm:size-32">
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-stone-100">
                    {brand.image ? (
                      <ProductImage
                        src={brand.image}
                        alt={`${brand.name} beauty brand`}
                        priority={index < 6}
                        sizes="(min-width: 640px) 120px, 76px"
                        className={
                          useLogoFit
                            ? "object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
                            : "transition-transform duration-500 ease-out group-hover:scale-105"
                        }
                      />
                    ) : (
                      <div className={`flex h-full w-full items-center justify-center ${fallbackVisuals[index % fallbackVisuals.length]}`}>
                        <span className="text-2xl font-bold text-stone-950 sm:text-4xl">{brand.name.slice(0, 1)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className="mt-2 line-clamp-2 min-h-[36px] text-[13px] font-bold leading-[18px] tracking-tight text-stone-950 sm:mt-3 sm:text-[15px] sm:leading-5">
                  {brand.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
