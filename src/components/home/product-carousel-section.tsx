import { HomeCarousel } from "@/components/home/home-carousel";
import { ProductCard } from "@/components/products/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
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
      <div className="mx-auto w-full max-w-[1304px] border-b border-stone-200 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <SectionHeading title={title} />
        <HomeCarousel className="mt-5 sm:mt-6" controlsLabel={controlsLabel}>
          {products.map((product, index) => (
            <div
              key={product.id}
              className="w-[172px] shrink-0 snap-start min-[420px]:w-[196px] sm:w-[260px] lg:w-[284px]"
            >
              <ProductCard product={product} priority={index < 4} />
            </div>
          ))}
        </HomeCarousel>
      </div>
    </section>
  );
}
