import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BrandStory } from "@/components/home/brand-story";
import { CategorySection } from "@/components/home/category-section";
import { Hero } from "@/components/home/hero";
import { TrustBadges } from "@/components/home/trust-badges";
import { PageShell } from "@/components/shared/page-shell";
import { ProductGrid } from "@/components/products/product-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { getCategories, getProducts, getSubCategories } from "@/lib/api";

const title = "Kittik Beauty | Makeup, Skincare & Beauty Products in Nepal";
const description =
  "Shop curated makeup, skincare, haircare, perfume, and beauty essentials at Kittik Beauty. Discover authentic products with WhatsApp support and delivery in Nepal.";

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Kittik Beauty",
    type: "website",
  },
};

export default async function Home() {
  const [categories, catalog, subCategories] = await Promise.all([
    getCategories(),
    getProducts(1, 160),
    getSubCategories(),
  ]);
  const arrivals = catalog.products.slice(0, 8);

  return (
    <PageShell>
      <Hero products={arrivals} />
      <CategorySection categories={categories} products={catalog.products} subCategories={subCategories} />
      <section id="new-arrivals" className="border-b border-stone-200 bg-white py-10 sm:py-16">
        <div className="mx-auto w-full max-w-[1304px] px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="New arrivals"
            title="Fresh beauty arrivals"
            description="Browse the latest products added to the Kittik Beauty catalog."
            action={
              <Button asChild variant="outline" className="h-11 rounded-md border-stone-950 bg-white px-6 font-bold">
                <Link href="/products">
                  View all
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            }
          />
          <div className="mt-6 sm:mt-9">
            <ProductGrid products={arrivals} />
          </div>
        </div>
      </section>
      <section className="border-b border-stone-200 bg-white py-10 sm:py-14">
        <div className="mx-auto w-full max-w-[1304px] px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-6 rounded-lg border border-stone-200 bg-stone-950 p-5 text-white sm:gap-8 sm:p-9 lg:grid-cols-[1fr_auto] lg:p-12">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-stone-300 uppercase">Featured routine</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Glow essentials for every routine</h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-stone-300">
                Skincare, complexion, lips, and finishing care selected for easy product discovery.
              </p>
            </div>
            <Button asChild className="h-12 rounded-md bg-white px-8 font-bold text-stone-950 hover:bg-stone-200">
              <Link href="/products">
                Browse catalog
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <BrandStory />
      <TrustBadges />
    </PageShell>
  );
}
