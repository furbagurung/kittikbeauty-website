import { HomeCarousel } from "@/components/home/home-carousel";
import { ProductCard } from "@/components/products/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Product } from "@/types/product";

type ProductCarouselSectionProps = {
  id: string;
  title: string;
  products: Product[];
  controlsLabel: string;
};

export function ProductCarouselSection({
  id,
  title,
  products,
  controlsLabel,
}: ProductCarouselSectionProps) {
  if (!products.length) return null;

  return (
    <section id={id} className="bg-white">
      <div className="mx-auto w-full max-w-[1304px] px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <SectionHeading
          title={title}
          action={
            <Button asChild variant="outline" className="h-10 rounded-full border-neutral-200 bg-white px-4 text-sm font-bold text-stone-950 hover:bg-neutral-100">
              <Link href="/products">View all</Link>
            </Button>
          }
        />
        <HomeCarousel className="mt-4 sm:mt-6" controlsLabel={controlsLabel}>
          {products.map((product, index) => (
            <div
              key={product.id}
              className="w-[164px] shrink-0 snap-start min-[420px]:w-[188px] sm:w-[238px] lg:w-[260px]"
            >
              <ProductCard product={product} priority={index < 4} />
            </div>
          ))}
        </HomeCarousel>
      </div>
    </section>
  );
}
