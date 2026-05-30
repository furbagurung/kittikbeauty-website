import Link from "next/link";

import { HomeCarousel } from "@/components/home/home-carousel";
import { ProductImage } from "@/components/products/product-image";
import { brandHref, buildBrandSummaries } from "@/lib/category-utils";
import type { Brand, Product } from "@/types/product";

const fallbackVisuals = [
  "bg-[linear-gradient(135deg,#ffffff,#e5e5e5)]",
  "bg-[linear-gradient(135deg,#fafafa,#d4d4d4)]",
  "bg-[linear-gradient(135deg,#f5f5f5,#e4e4e7)]",
  "bg-[linear-gradient(135deg,#ffffff,#d6d3d1)]",
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
    <section id="brands" className="bg-white">
      <div className="mx-auto w-full max-w-[1304px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="text-left">
          <h2 className="text-[22px] font-black leading-tight tracking-tight text-stone-950 sm:text-[28px]">
            Brands we love
          </h2>
        </div>

        <HomeCarousel
          className="mt-4 sm:mt-5"
          controlsLabel="Brand carousel controls"
          trackClassName="gap-2 sm:gap-3 lg:gap-4"
        >
          {brandSummaries.map((brand, index) => (
            <Link
              key={`${brand.id}-${brand.slugValue}`}
              href={brandHref(brand)}
              className="group relative flex aspect-square w-[104px] shrink-0 snap-start items-center justify-center overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-[0_10px_28px_rgba(24,24,27,0.06)] transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-4 min-[420px]:w-[118px] sm:w-[140px] lg:w-[148px]"
              aria-label={`Shop ${brand.name}`}
            >
              {brand.image ? (
                <ProductImage
                  src={brand.image}
                  alt={`${brand.name} beauty brand`}
                  priority={index < 6}
                  sizes="(min-width: 1024px) 148px, (min-width: 640px) 140px, 110px"
                  className="object-contain p-5 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105 sm:p-6"
                />
              ) : (
                <div className={`flex h-full w-full items-center justify-center ${fallbackVisuals[index % fallbackVisuals.length]}`}>
                  <span className="line-clamp-2 px-3 text-center text-sm font-black leading-tight text-stone-950 sm:text-base">
                    {brand.name}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </HomeCarousel>
      </div>
    </section>
  );
}
