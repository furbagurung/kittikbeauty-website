import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BrandSection } from "@/components/home/brand-section";
import { BrandStory } from "@/components/home/brand-story";
import { CategorySection } from "@/components/home/category-section";
import { Hero } from "@/components/home/hero";
import { ProductCarouselSection } from "@/components/home/product-carousel-section";
import { ReelSection } from "@/components/home/reel-section";
import { TrustBadges } from "@/components/home/trust-badges";
import { PageShell } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";
import {
  getBrands,
  getCategories,
  getProducts,
  getReels,
  getSubCategories,
} from "@/lib/api";

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
  const [categories, catalog, subCategories, brands, reels] = await Promise.all(
    [
      getCategories(),
      getProducts(1, 160),
      getSubCategories(),
      getBrands(),
      getReels(8),
    ],
  );
  const arrivals = catalog.products.slice(0, 12);
  const featuredProducts = catalog.products.slice(12, 24);

  return (
    <PageShell>
      <Hero products={arrivals} />
      <ReelSection reels={reels} />
      <BrandSection brands={brands} products={catalog.products} />
      <ProductCarouselSection
        id="new-arrivals"
        title="Fresh beauty arrivals"
        products={arrivals}
        controlsLabel="New arrivals carousel controls"
      />
      <ProductCarouselSection
        id="featured-products"
        title="Featured products"
        products={featuredProducts}
        controlsLabel="Featured products carousel controls"
      />
      <CategorySection
        categories={categories}
        products={catalog.products}
        subCategories={subCategories}
      />

      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1304px] border-b border-stone-200 px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <div className="grid items-center gap-6 rounded-lg border border-stone-200 bg-stone-950 p-5 text-white sm:gap-8 sm:p-9 lg:grid-cols-[1fr_auto] lg:p-12">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-stone-300 uppercase">
                Featured routine
              </p>
              <h2 className="mt-3 text-[24px] font-bold leading-tight tracking-tight uppercase">
                Glow essentials for every routine
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-stone-300">
                Skincare, complexion, lips, and finishing care selected for easy
                product discovery.
              </p>
            </div>
            <Button
              asChild
              className="h-12 rounded-md bg-white px-8 font-bold text-stone-950 hover:bg-stone-200"
            >
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
