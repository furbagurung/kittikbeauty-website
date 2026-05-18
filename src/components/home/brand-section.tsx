import Link from "next/link";

import { HomeCarousel } from "@/components/home/home-carousel";
import { ProductImage } from "@/components/products/product-image";
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
    <section id="brands" className="bg-white">
      <div className="mx-auto w-full max-w-[1304px] border-b border-stone-200 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="text-center">
          <h2 className="text-[24px] font-extrabold leading-tight tracking-tight text-stone-950 uppercase">
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
              className="group relative flex aspect-square w-[104px] shrink-0 snap-start items-center justify-center overflow-hidden bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-4 min-[420px]:w-[118px] sm:w-[140px] lg:w-[148px]"
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
                  <span className="text-3xl font-extrabold text-stone-950 sm:text-4xl">
                    {brand.name.slice(0, 1)}
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
