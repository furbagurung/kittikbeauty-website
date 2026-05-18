import Link from "next/link";

import { HomeCarousel } from "@/components/home/home-carousel";
import { ProductImage } from "@/components/products/product-image";
import { buildCategorySummaries, categoryHref } from "@/lib/category-utils";
import type { Category, Product, SubCategory } from "@/types/product";

const fallbackVisuals = [
  "bg-[radial-gradient(circle_at_30%_25%,#fecdd3,transparent_42%),linear-gradient(135deg,#ffffff,#e7e5e4)]",
  "bg-[radial-gradient(circle_at_72%_28%,#ddd6fe,transparent_42%),linear-gradient(135deg,#ffffff,#e5e7eb)]",
  "bg-[radial-gradient(circle_at_28%_72%,#bae6fd,transparent_42%),linear-gradient(135deg,#fafafa,#d6d3d1)]",
  "bg-[radial-gradient(circle_at_70%_68%,#fde68a,transparent_42%),linear-gradient(135deg,#ffffff,#e7e5e4)]",
];

export function CategorySection({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
  subCategories: SubCategory[];
}) {
  const categorySummaries = buildCategorySummaries(categories, products).slice(0, 12);

  return (
    <section id="categories" className="bg-white">
      <div className="mx-auto w-full max-w-[1304px] border-b border-stone-200 px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        <div className="max-w-2xl text-left">
          <h2 className="text-[24px] font-bold leading-tight tracking-tight text-stone-950 uppercase">
            Shop by category
          </h2>
        </div>

        <HomeCarousel
          className="mt-5 sm:mt-6"
          controlsLabel="Category carousel controls"
          trackClassName="gap-3 sm:gap-5 lg:gap-6"
        >
          {categorySummaries.map((category, index) => (
            <Link
              key={`${category.id}-${category.slugValue}`}
              href={categoryHref(category)}
              className="group relative aspect-square w-[176px] shrink-0 snap-start overflow-hidden bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-4 min-[400px]:w-[196px] sm:w-[270px] lg:w-[300px]"
            >
              {category.image ? (
                <ProductImage
                  src={category.image}
                  alt={`${category.name} beauty category`}
                  priority={index < 4}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="transition-transform duration-500 ease-out group-hover:scale-105"
                />
              ) : (
                <div className={`h-full w-full ${fallbackVisuals[index % fallbackVisuals.length]}`} />
              )}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <h3 className="absolute inset-x-3 bottom-5 text-center text-lg font-extrabold uppercase tracking-tight text-white drop-shadow-sm sm:bottom-7 sm:text-2xl">
                {category.name}
              </h3>
            </Link>
          ))}
        </HomeCarousel>
      </div>
    </section>
  );
}
