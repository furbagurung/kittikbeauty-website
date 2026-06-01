import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

import { CategoryProductListingClient } from "@/components/categories/category-product-listing-client";
import { PageShell } from "@/components/shared/page-shell";
import { getCategories, getProductsBySubCategory, getSubCategories } from "@/lib/api";
import {
  categorySlug,
  findCategoryBySlug,
  findSubCategoryBySlug,
  subCategorySlug,
} from "@/lib/category-utils";

type SubCategoryPageProps = {
  params: Promise<{
    categorySlug: string;
    subCategorySlug: string;
  }>;
};

export async function generateStaticParams() {
  const [categories, subCategories] = await Promise.all([getCategories(), getSubCategories()]);

  return subCategories.flatMap((subCategory) => {
    const category = subCategory.category ?? categories.find((item) => String(item.id) === String(subCategory.categoryId));
    if (!category) return [];

    return {
      categorySlug: categorySlug(category),
      subCategorySlug: subCategorySlug(subCategory),
    };
  });
}

async function resolveSubCategoryPage(params: SubCategoryPageProps["params"]) {
  const { categorySlug: rawCategorySlug, subCategorySlug: rawSubCategorySlug } = await params;
  const [categories, subCategories] = await Promise.all([getCategories(), getSubCategories()]);
  const category = findCategoryBySlug(categories, rawCategorySlug);

  if (!category) {
    return { category: null, subCategory: null };
  }

  const categorySubCategories = subCategories.filter((subCategory) => {
    if (subCategory.categoryId && String(subCategory.categoryId) === String(category.id)) return true;
    if (!subCategory.category) return false;
    return categorySlug(subCategory.category) === categorySlug(category);
  });
  const subCategory = findSubCategoryBySlug(categorySubCategories, rawSubCategorySlug);

  return { category, subCategory };
}

export async function generateMetadata({ params }: SubCategoryPageProps): Promise<Metadata> {
  const { category, subCategory } = await resolveSubCategoryPage(params);

  if (!category || !subCategory) {
    return {
      title: "Sub-category Products",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const title = `${subCategory.name} Products in Nepal | Kittik Beauty`;
  const description = `Shop ${subCategory.name} products from ${category.name} at Kittik Beauty. Explore curated beauty products with details, prices, and WhatsApp support.`;
  const canonical = `/products/categories/${categorySlug(category)}/${subCategorySlug(subCategory)}`;

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
      images: subCategory.image ? [{ url: subCategory.image, alt: subCategory.name }] : undefined,
    },
  };
}

export default async function SubCategoryPage({ params }: SubCategoryPageProps) {
  const { category, subCategory } = await resolveSubCategoryPage(params);

  if (!category || !subCategory) {
    notFound();
  }

  const products = await getProductsBySubCategory(category, subCategory, 160);
  const categoryHref = `/products/categories/${categorySlug(category)}`;

  return (
    <PageShell>
      <section className="bg-white py-8 sm:py-14">
        <div className="mx-auto w-full max-w-[1304px] px-4 sm:px-6 lg:px-8">
          <div className="border-b border-stone-200 pb-6 sm:pb-8">
            <Link
              href={categoryHref}
              className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-stone-600 transition-colors hover:text-stone-950"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              {category.name}
            </Link>
            <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.14em] text-stone-500">SUB-CATEGORY</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <h1 className="text-[36px] font-bold leading-[1.02] tracking-tight text-stone-950 sm:text-[64px] sm:leading-none">
                  {subCategory.name}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600 sm:mt-4 sm:text-lg sm:leading-8">
                  Browse {subCategory.name} products from {category.name}.
                </p>
              </div>
              <div className="rounded-md border border-stone-200 px-4 py-3 text-sm font-bold text-stone-700">
                {products.length} products
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            {products.length ? (
              <CategoryProductListingClient products={products} />
            ) : (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
                <h2 className="text-lg font-semibold text-stone-950">No products found in this sub-category.</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">
                  Browse {category.name} products while this sub-category is being updated.
                </p>
                <Link
                  href={categoryHref}
                  className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brandGreen px-6 text-sm font-bold text-white hover:bg-brandEmerald"
                >
                  Browse {category.name}
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
