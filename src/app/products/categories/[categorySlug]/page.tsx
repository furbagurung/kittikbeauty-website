import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

import { CatalogCard } from "@/components/catalog/catalog-card";
import { CategoryProductListingClient } from "@/components/categories/category-product-listing-client";
import { PageShell } from "@/components/shared/page-shell";
import { getCategories, getProductsByCategory, getSubCategories } from "@/lib/api";
import {
  buildSubCategorySummaries,
  categoryDescription,
  categorySlug,
  findCategoryBySlug,
  subCategoryHref,
} from "@/lib/category-utils";

type ProductCategoryPageProps = {
  params: Promise<{
    categorySlug: string;
  }>;
};

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map((category) => ({
    categorySlug: categorySlug(category),
  }));
}

export async function generateMetadata({ params }: ProductCategoryPageProps): Promise<Metadata> {
  const { categorySlug: slug } = await params;
  const categories = await getCategories();
  const category = findCategoryBySlug(categories, slug);

  if (!category) {
    return {
      title: "Category Products",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const title = `${category.name} Products in Nepal | Kittik Beauty`;
  const description = `Shop ${category.name} products at Kittik Beauty. Browse curated beauty essentials with prices, product details, WhatsApp support, and delivery in Nepal.`;
  const canonical = `/products/categories/${categorySlug(category)}`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Kittik Beauty",
      type: "website",
      images: category.image ? [{ url: category.image, alt: category.name }] : undefined,
    },
  };
}

export default async function ProductCategoryPage({ params }: ProductCategoryPageProps) {
  const { categorySlug: slug } = await params;
  const categories = await getCategories();
  const category = findCategoryBySlug(categories, slug);

  if (!category) {
    notFound();
  }

  const [products, subCategories] = await Promise.all([getProductsByCategory(category, 160), getSubCategories()]);
  const categorySubCategories = subCategories.filter((subCategory) => {
    if (subCategory.categoryId && category.id && String(subCategory.categoryId) === String(category.id)) return true;
    return subCategory.category?.slug
      ? categorySlug(subCategory.category) === categorySlug(category)
      : subCategory.category?.name === category.name;
  });
  const subCategorySummaries = buildSubCategorySummaries(categorySubCategories, products);

  return (
    <PageShell>
      <section className="bg-white py-8 sm:py-14">
        <div className="mx-auto w-full max-w-[1304px] px-4 sm:px-6 lg:px-8">
          <div className="border-b border-stone-200 pb-6 sm:pb-8">
            <Link
              href="/products/categories"
              className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-stone-600 transition-colors hover:text-stone-950"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Categories
            </Link>
            <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.14em] text-stone-500">CATEGORY</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <h1 className="text-[36px] font-bold leading-[1.02] tracking-tight text-stone-950 sm:text-[64px] sm:leading-none">
                  {category.name}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600 sm:mt-4 sm:text-lg sm:leading-8">
                  Browse {category.name} products curated for your beauty routine.
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">{categoryDescription(category)}</p>
              </div>
              <div className="rounded-md border border-stone-200 px-4 py-3 text-sm font-bold text-stone-700">
                {products.length} products
              </div>
            </div>
          </div>

          {subCategorySummaries.length ? (
            <div className="mt-6 border-b border-stone-200 pb-7 sm:mt-8 sm:pb-9">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">Sub-categories</p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-950">Browse within {category.name}</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 min-[420px]:gap-4 sm:gap-5 lg:grid-cols-4">
                {subCategorySummaries.map((subCategory, index) => (
                  <CatalogCard
                    key={`${subCategory.id}-${subCategory.slugValue}`}
                    href={subCategoryHref(category, subCategory)}
                    title={subCategory.name}
                    description={subCategory.description}
                    image={subCategory.image}
                    imageAlt={`${subCategory.name} beauty products`}
                    count={subCategory.productCount}
                    cta="Explore"
                    index={index}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6 sm:mt-8">
            {products.length ? (
              <CategoryProductListingClient products={products} />
            ) : (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
                <h2 className="text-lg font-semibold text-stone-950">No products found in this category.</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">
                  Browse the full Kittik Beauty catalog while this category is being updated.
                </p>
                <Link
                  href="/products"
                  className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-stone-950 px-6 text-sm font-bold text-white hover:bg-black"
                >
                  Browse all products
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
