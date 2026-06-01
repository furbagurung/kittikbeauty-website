import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

import { CategoryProductListingClient } from "@/components/categories/category-product-listing-client";
import { PageShell } from "@/components/shared/page-shell";
import { getBrands, getProductsByBrand } from "@/lib/api";
import { brandDescription, brandSlug, findBrandBySlug } from "@/lib/category-utils";

type BrandPageProps = {
  params: Promise<{
    brandSlug: string;
  }>;
};

export async function generateStaticParams() {
  const brands = await getBrands();

  return brands.map((brand) => ({
    brandSlug: brandSlug(brand),
  }));
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { brandSlug: slug } = await params;
  const brands = await getBrands();
  const brand = findBrandBySlug(brands, slug);

  if (!brand) {
    return {
      title: "Brand Products",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const title = `${brand.name} Products in Nepal | Kittik Beauty`;
  const description = `Shop ${brand.name} products at Kittik Beauty. Browse authentic beauty essentials with prices, details, and WhatsApp support in Nepal.`;
  const canonical = `/products/brands/${brandSlug(brand)}`;
  const image = brand.logo || brand.image;

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
      images: image ? [{ url: image, alt: brand.name }] : undefined,
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brandSlug: slug } = await params;
  const brands = await getBrands();
  const brand = findBrandBySlug(brands, slug);

  if (!brand) {
    notFound();
  }

  const products = await getProductsByBrand(brand, 160);

  return (
    <PageShell>
      <section className="bg-white py-8 sm:py-14">
        <div className="mx-auto w-full max-w-[1304px] px-4 sm:px-6 lg:px-8">
          <div className="border-b border-stone-200 pb-6 sm:pb-8">
            <Link
              href="/products/brands"
              className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-stone-600 transition-colors hover:text-stone-950"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Brands
            </Link>
            <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.14em] text-stone-500">BRAND</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <h1 className="text-[36px] font-bold leading-[1.02] tracking-tight text-stone-950 sm:text-[64px] sm:leading-none">
                  {brand.name}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600 sm:mt-4 sm:text-lg sm:leading-8">
                  Shop {brand.name} products at Kittik Beauty.
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">{brandDescription(brand)}</p>
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
                <h2 className="text-lg font-semibold text-stone-950">No products found for this brand.</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">
                  Browse all products while this brand page is being updated.
                </p>
                <Link
                  href="/products"
                  className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brandGreen px-6 text-sm font-bold text-white hover:bg-brandEmerald"
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
