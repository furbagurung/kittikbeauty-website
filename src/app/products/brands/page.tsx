import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CatalogCard } from "@/components/catalog/catalog-card";
import { PageShell } from "@/components/shared/page-shell";
import { getBrands, getProducts } from "@/lib/api";
import { brandHref, buildBrandSummaries } from "@/lib/category-utils";

const title = "Beauty Brands | Shop Brands Online in Nepal | Kittik Beauty";
const description =
  "Explore beauty brands at Kittik Beauty. Shop makeup, skincare, perfume, haircare, and beauty essentials by brand.";

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  alternates: {
    canonical: "/products/brands",
  },
  openGraph: {
    title,
    description,
    url: "/products/brands",
    siteName: "Kittik Beauty",
    type: "website",
  },
};

export default async function BrandsPage() {
  const [brands, productsResult] = await Promise.all([getBrands(), getProducts(1, 160)]);
  const brandSummaries = buildBrandSummaries(brands, productsResult.products);

  return (
    <PageShell>
      <section className="bg-white py-8 sm:py-14">
        <div className="mx-auto w-full max-w-[1304px] px-4 sm:px-6 lg:px-8">
          <div className="border-b border-stone-200 pb-6 sm:pb-8">
            <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.14em] text-stone-500">BRANDS</p>
            <h1 className="text-[36px] font-bold leading-[1.02] tracking-tight text-stone-950 sm:text-[64px] sm:leading-none">
              Shop Beauty Brands
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600 sm:mt-4 sm:text-lg sm:leading-8">
              Explore beauty products by brand at Kittik Beauty.
            </p>
          </div>

          {brandSummaries.length ? (
            <div className="mt-6 grid grid-cols-2 gap-3 min-[420px]:gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {brandSummaries.map((brand, index) => (
                <CatalogCard
                  key={`${brand.id}-${brand.slugValue}`}
                  href={brandHref(brand)}
                  title={brand.name}
                  description={brand.description}
                  image={brand.image}
                  imageAlt={`${brand.name} beauty brand`}
                  count={brand.productCount}
                  cta="Explore brand"
                  index={index}
                  imageClassName="object-contain p-8 transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
              <h2 className="text-xl font-bold text-stone-950">No brands found.</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">Browse all products while brand pages are being prepared.</p>
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
      </section>
    </PageShell>
  );
}
