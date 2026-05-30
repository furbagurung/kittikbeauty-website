import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BannerCarousel } from "@/components/home/banner-carousel";
import { BrandSection } from "@/components/home/brand-section";
import { BrandStory } from "@/components/home/brand-story";
import { CategorySection } from "@/components/home/category-section";
import { MakeupHomeBanner } from "@/components/home/makeup-home-banner";
import { ProductCarouselSection } from "@/components/home/product-carousel-section";
import { ReelSection } from "@/components/home/reel-section";
import { TrustBadges } from "@/components/home/trust-badges";
import { PageShell } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";
import {
  getBrands,
  getBanners,
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
  const [categories, catalog, subCategories, brands, reels, banners] = await Promise.all(
    [
      getCategories(),
      getProducts(1, 160),
      getSubCategories(),
      getBrands(),
      getReels(8),
      getBanners(),
    ],
  );
  const arrivals = catalog.products.slice(0, 12);
  const bestSellers = catalog.products.slice(12, 24);
  const featuredProducts = catalog.products.slice(24, 36);

  return (
    <PageShell>
      <BannerCarousel banners={banners} />
      <ReelSection reels={reels} />
      <MakeupHomeBanner />
      <CategorySection
        categories={categories}
        products={catalog.products}
        subCategories={subCategories}
      />
      <ProductCarouselSection
        id="best-sellers"
        title="Best sellers"
        products={bestSellers.length ? bestSellers : arrivals}
        controlsLabel="Best sellers carousel controls"
      />
      <ProductCarouselSection
        id="new-arrivals"
        title="New arrivals"
        products={arrivals}
        controlsLabel="New arrivals carousel controls"
      />
      <ProductCarouselSection
        id="featured-products"
        title="Beauty essentials"
        products={featuredProducts.length ? featuredProducts : bestSellers}
        controlsLabel="Beauty essentials carousel controls"
      />
      <BrandSection brands={brands} products={catalog.products} />

      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1304px] px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
          <div className="grid items-center gap-5 rounded-[22px] border border-neutral-200 bg-stone-950 p-5 text-white shadow-[0_18px_45px_rgba(24,24,27,0.14)] sm:gap-8 sm:p-8 lg:grid-cols-[1fr_auto] lg:p-10">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-neutral-300 uppercase">
                Featured routine
              </p>
              <h2 className="mt-2 text-[24px] font-black leading-tight tracking-tight sm:text-[34px]">
                Glow essentials for every routine
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-300 sm:text-base sm:leading-7">
                Skincare, complexion, lips, and finishing care selected for easy
                product discovery.
              </p>
            </div>
            <Button
              asChild
              className="h-10 rounded-full bg-white px-5 text-sm font-bold text-stone-950 hover:bg-neutral-100 sm:h-11 sm:px-7"
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
