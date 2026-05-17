import Link from "next/link";

import { ProductImage } from "@/components/products/product-image";
import { Button } from "@/components/ui/button";
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
    <section id="categories" className="border-b border-stone-200 bg-white py-9 sm:py-12">
      <div className="mx-auto w-full max-w-[1304px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em] text-stone-500">CATEGORIES</p>
            <h2 className="text-[30px] font-bold leading-tight tracking-tight text-stone-950 sm:text-5xl">
              Shop by category
            </h2>
            <p className="mt-2 text-base leading-7 text-stone-600">Explore beauty essentials by category.</p>
          </div>
          <Button asChild variant="outline" className="h-11 rounded-md border-stone-950 bg-white px-6 font-bold sm:shrink-0">
            <Link href="/products/categories">View all categories</Link>
          </Button>
        </div>

        <div className="no-scrollbar -mx-3 mt-4 flex snap-x gap-5 overflow-x-auto overscroll-x-contain scroll-smooth px-3 py-5 sm:-mx-4 sm:mt-6 sm:gap-7 sm:px-4 sm:py-6">
          {categorySummaries.map((category, index) => (
            <Link
              key={`${category.id}-${category.slugValue}`}
              href={categoryHref(category)}
              className="group flex w-[92px] shrink-0 snap-start flex-col items-center px-1 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-4 sm:w-32"
            >
              <div className="size-[84px] rounded-full transition-transform duration-300 ease-out group-hover:-translate-y-0.5 sm:size-32">
                <div className="relative h-full w-full overflow-hidden rounded-full bg-stone-100">
                  {category.image ? (
                    <ProductImage
                      src={category.image}
                      alt={`${category.name} beauty category`}
                      priority={index < 6}
                      sizes="(min-width: 640px) 120px, 76px"
                      className="transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className={`h-full w-full ${fallbackVisuals[index % fallbackVisuals.length]}`} />
                  )}
                </div>
              </div>
              <span className="mt-2 line-clamp-2 min-h-[36px] text-[13px] font-bold leading-[18px] tracking-tight text-stone-950 sm:mt-3 sm:text-[15px] sm:leading-5">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
