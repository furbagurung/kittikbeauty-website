import Link from "next/link";

import { HomeCarousel } from "@/components/home/home-carousel";
import { ProductImage } from "@/components/products/product-image";
import { buildCategorySummaries, categoryHref } from "@/lib/category-utils";
import type { Category, Product, SubCategory } from "@/types/product";

const fallbackVisuals = [
  "bg-[linear-gradient(135deg,#ffffff,#e5e5e5)]",
  "bg-[linear-gradient(135deg,#fafafa,#d4d4d4)]",
  "bg-[linear-gradient(135deg,#f5f5f5,#e4e4e7)]",
  "bg-[linear-gradient(135deg,#ffffff,#d6d3d1)]",
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
      <div className="mx-auto w-full max-w-[1304px] px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[22px] font-black leading-tight tracking-tight text-stone-950 sm:text-[28px]">
            Shop by category
          </h2>
          <Link href="/products/categories" className="text-sm font-bold text-stone-950 hover:text-neutral-600">
            View all
          </Link>
        </div>

        <HomeCarousel
          className="mt-4"
          controlsLabel="Category carousel controls"
          trackClassName="gap-4 sm:gap-5 lg:gap-6"
        >
          {categorySummaries.map((category, index) => (
            <Link
              key={`${category.id}-${category.slugValue}`}
              href={categoryHref(category)}
              className="group flex w-[92px] shrink-0 snap-start flex-col items-center gap-3 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-4 min-[400px]:w-[104px] sm:w-[132px]"
            >
                <span className="relative block aspect-square w-full overflow-hidden rounded-full border border-neutral-300 bg-neutral-100 p-1 transition duration-300 group-hover:-translate-y-1 group-hover:border-stone-950">
                  <span className="relative block h-full w-full overflow-hidden rounded-full">
                  {category.image ? (
                    <ProductImage
                    src={category.image}
                    alt={`${category.name} beauty category`}
                    priority={index < 6}
                    sizes="(min-width: 640px) 132px, 104px"
                    className="transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  ) : (
                    <span className={`block h-full w-full ${fallbackVisuals[index % fallbackVisuals.length]}`} />
                  )}
                  </span>
                </span>
              <h3 className="line-clamp-2 text-[12px] font-extrabold leading-tight text-stone-950 sm:text-sm">
                {category.name}
              </h3>
            </Link>
          ))}
        </HomeCarousel>
      </div>
    </section>
  );
}
