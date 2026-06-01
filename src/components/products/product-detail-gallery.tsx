import Link from "next/link";

import { ProductImage } from "@/components/products/product-image";
import { cn } from "@/lib/utils";

type ProductDetailGalleryProps = {
  productName: string;
  brandName?: string | null;
  categoryName?: string | null;
  images: string[];
  selectedIndex: number;
};

export function ProductDetailGallery({
  productName,
  categoryName,
  images,
  selectedIndex,
}: ProductDetailGalleryProps) {
  const visibleImages = images.slice(0, 6);
  const selectedImage = visibleImages[selectedIndex] ?? null;
  const productType = categoryName ? categoryName.toLowerCase() : "beauty";
  const mainAlt = `${productName} ${productType} product available at Kittik Beauty Nepal`;

  return (
    <div className="space-y-2.5 sm:space-y-4">
      <div className="relative aspect-[5/4] overflow-hidden border border-brandGold/25 bg-brandCream sm:aspect-square">
        <ProductImage
          src={selectedImage}
          alt={mainAlt}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain p-2.5 sm:p-6"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-6 sm:gap-3 sm:overflow-visible sm:pb-0">
        {visibleImages.map((image, index) => {
          const isSelected = index === selectedIndex;

          return (
            <Link
              key={`${image}-${index}`}
              href={`?image=${index + 1}`}
              scroll={false}
              className={cn(
                "relative aspect-square w-[68px] shrink-0 overflow-hidden border bg-brandCream transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandGold min-[420px]:w-20 sm:w-auto",
                isSelected ? "border-brandGreen" : "border-brandGold/25 hover:border-brandGold",
              )}
              aria-label={`View ${productName} image ${index + 1}`}
              aria-current={isSelected ? "true" : undefined}
            >
              <ProductImage
                src={image}
                alt={`${productName} product thumbnail ${index + 1} at Kittik Beauty Nepal`}
                sizes="120px"
                className="object-contain p-2 sm:p-2.5"
              />
              {isSelected ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brandGreen" /> : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
