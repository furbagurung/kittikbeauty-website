import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { CategoryProductListingClient } from "@/components/categories/category-product-listing-client";
import { PageShell } from "@/components/shared/page-shell";
import { getCategories, getProductsByCategory } from "@/lib/api";
import { categoryDescription, categorySlug, findCategoryBySlug } from "@/lib/category-utils";

type ProductCategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map((category) => ({
    slug: categorySlug(category),
  }));
}

export async function generateMetadata({ params }: ProductCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = findCategoryBySlug(categories, slug);

  if (!category) {
    return {
      title: "Category Products",
    };
  }

  return {
    title: `${category.name} Products`,
    description: `Shop ${category.name} products at Kittik Beauty.`,
  };
}

export default async function ProductCategoryPage({ params }: ProductCategoryPageProps) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = findCategoryBySlug(categories, slug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(category, 100);

  return (
    <PageShell>
      <section className="bg-white py-8 sm:py-14">
        <div className="mx-auto w-full max-w-[1304px] px-4 sm:px-6 lg:px-8">
          <div className="border-b border-stone-200 pb-6 sm:pb-8">
            <Link
              href="/products/categories"
              className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-stone-600 transition-colors hover:text-stone-950"
            >
              <ArrowLeft className="size-4" />
              Categories
            </Link>
            <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.14em] text-stone-500">CATEGORY</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <h1 className="text-[36px] font-bold leading-[1.02] tracking-tight text-stone-950 sm:text-[64px] sm:leading-none">
                  {category.name}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600 sm:mt-4 sm:text-lg sm:leading-8">
                  Browse selected products from this category.
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">{categoryDescription(category)}</p>
              </div>
              <div className="rounded-md border border-stone-200 px-4 py-3 text-sm font-bold text-stone-700">
                {products.length} products
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <CategoryProductListingClient products={products} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

