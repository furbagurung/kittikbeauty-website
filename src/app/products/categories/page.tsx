import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductImage } from "@/components/products/product-image";
import { PageShell } from "@/components/shared/page-shell";
import { getCategories, getProducts } from "@/lib/api";
import { buildCategorySummaries, categoryHref } from "@/lib/category-utils";

export const metadata: Metadata = {
  title: "Product Categories",
  description: "Explore Kittik Beauty product categories including makeup, skincare, perfume, haircare, and more.",
};

const fallbackGradients = [
  "bg-[radial-gradient(circle_at_30%_20%,#f5d0d6,transparent_34%),linear-gradient(135deg,#fafafa,#e7e5e4)]",
  "bg-[radial-gradient(circle_at_78%_24%,#d9f99d,transparent_30%),linear-gradient(135deg,#ffffff,#e7e5e4)]",
  "bg-[radial-gradient(circle_at_28%_72%,#fde68a,transparent_34%),linear-gradient(135deg,#fafafa,#d6d3d1)]",
  "bg-[radial-gradient(circle_at_72%_24%,#ddd6fe,transparent_34%),linear-gradient(135deg,#ffffff,#e7e5e4)]",
  "bg-[radial-gradient(circle_at_34%_28%,#bfdbfe,transparent_32%),linear-gradient(135deg,#fafafa,#d6d3d1)]",
  "bg-[radial-gradient(circle_at_75%_72%,#bae6fd,transparent_34%),linear-gradient(135deg,#ffffff,#e7e5e4)]",
  "bg-[radial-gradient(circle_at_22%_22%,#fecdd3,transparent_34%),linear-gradient(135deg,#fafafa,#e7e5e4)]",
  "bg-[radial-gradient(circle_at_70%_25%,#fed7aa,transparent_34%),linear-gradient(135deg,#ffffff,#d6d3d1)]",
];

export default async function ProductCategoriesPage() {
  const [categories, productsResult] = await Promise.all([getCategories(), getProducts(1, 100)]);
  const categorySummaries = buildCategorySummaries(categories, productsResult.products);

  return (
    <PageShell>
      <section className="bg-white py-8 sm:py-14">
        <div className="mx-auto w-full max-w-[1304px] px-4 sm:px-6 lg:px-8">
          <div className="border-b border-stone-200 pb-6 sm:pb-8">
            <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.14em] text-stone-500">CATEGORIES</p>
            <h1 className="text-[36px] font-bold leading-[1.02] tracking-tight text-stone-950 sm:text-[64px] sm:leading-none">
              Shop by Category
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600 sm:mt-4 sm:text-lg sm:leading-8">
              Explore curated beauty categories for makeup, skincare, haircare, perfume, and everyday essentials.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 min-[420px]:gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {categorySummaries.map((category, index) => (
              <Link
                key={`${category.id}-${category.slugValue}`}
                href={categoryHref(category)}
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:border-stone-400 hover:shadow-[0_20px_55px_rgba(28,25,23,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2"
              >
                <div className="relative h-[148px] overflow-hidden bg-stone-100 min-[420px]:h-[172px] sm:h-[220px] lg:h-[244px]">
                  {category.image ? (
                    <ProductImage
                      src={category.image}
                      alt={`${category.name} beauty products`}
                      priority={index < 4}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
                      className="transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                    />
                  ) : (
                    <div className={`h-full w-full ${fallbackGradients[index % fallbackGradients.length]}`}>
                      <div className="flex h-full items-end p-4 sm:p-5">
                        <div className="h-14 w-14 rounded-full border border-white/70 bg-white/55 shadow-sm sm:h-20 sm:w-20" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-[16px] font-bold leading-tight tracking-tight text-stone-950 sm:text-xl">{category.name}</h2>
                    <span className="shrink-0 text-right text-[11px] font-bold text-stone-500 sm:text-xs">
                      {category.productCount} products
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-stone-600 sm:text-sm sm:leading-6">
                    {category.description}
                  </p>
                  <span className="mt-auto flex min-h-11 items-end gap-2 pt-4 text-[13px] font-bold text-stone-950 sm:text-sm">
                    Explore
                    <ArrowRight className="mb-0.5 size-4 transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid items-center gap-5 rounded-lg border border-stone-950 bg-stone-950 p-5 text-white sm:mt-10 sm:p-8 lg:grid-cols-[1fr_auto] lg:p-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">Find your daily beauty essentials</h2>
            </div>
            <Link
              href="/products"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-white px-6 text-sm font-bold text-stone-950 transition-colors hover:bg-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 sm:w-auto"
            >
              Explore all products
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

