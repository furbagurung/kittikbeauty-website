import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CatalogCard } from "@/components/catalog/catalog-card";
import { PageShell } from "@/components/shared/page-shell";
import { getCategories, getProducts } from "@/lib/api";
import { buildCategorySummaries, categoryHref } from "@/lib/category-utils";

const title = "Beauty Product Categories | Makeup, Skincare & More | Kittik Beauty";
const description =
  "Explore Kittik Beauty product categories including makeup, skincare, perfume, haircare, tools, bath and body, and more.";

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  alternates: {
    canonical: "/products/categories",
  },
  openGraph: {
    title,
    description,
    url: "/products/categories",
    siteName: "Kittik Beauty",
    type: "website",
  },
};

export default async function ProductCategoriesPage() {
  const [categories, productsResult] = await Promise.all([getCategories(), getProducts(1, 160)]);
  const categorySummaries = buildCategorySummaries(categories, productsResult.products);

  return (
    <PageShell>
      <section className="bg-white py-8 sm:py-14">
        <div className="mx-auto w-full max-w-[1304px] px-4 sm:px-6 lg:px-8">
          <div className="border-b border-stone-200 pb-6 sm:pb-8">
            <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.14em] text-stone-500">CATEGORIES</p>
            <h1 className="text-[36px] font-bold leading-[1.02] tracking-tight text-stone-950 sm:text-[64px] sm:leading-none">
              Shop Beauty Categories
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600 sm:mt-4 sm:text-lg sm:leading-8">
              Explore makeup, skincare, perfume, haircare, tools, and beauty essentials curated by Kittik Beauty.
            </p>
          </div>

          {categorySummaries.length ? (
            <div className="mt-6 grid grid-cols-2 gap-3 min-[420px]:gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {categorySummaries.map((category, index) => (
                <CatalogCard
                  key={`${category.id}-${category.slugValue}`}
                  href={categoryHref(category)}
                  title={category.name}
                  description={category.description}
                  image={category.image}
                  imageAlt={`${category.name} beauty products`}
                  count={category.productCount}
                  cta="Explore category"
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
              <h2 className="text-xl font-bold text-stone-950">No categories found.</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">Browse all products while categories are being prepared.</p>
              <Link
                href="/products"
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brandGreen px-6 text-sm font-bold text-white hover:bg-brandEmerald"
              >
                Browse all products
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          )}

          <div className="mt-8 grid items-center gap-5 rounded-lg border border-brandGold/35 bg-brandGreen p-5 text-white sm:mt-10 sm:p-8 lg:grid-cols-[1fr_auto] lg:p-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">Find your daily beauty essentials</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
                Browse products curated for your everyday routine.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-white px-6 text-sm font-bold text-brandEmerald transition-colors hover:bg-[#F3E7C3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brandGreen sm:w-auto"
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
