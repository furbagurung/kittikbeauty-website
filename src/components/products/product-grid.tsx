import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types/product";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <EmptyState
        title="No products to show"
        description="The catalog is being prepared. Please check back soon or ask Kittik Beauty on WhatsApp."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 4} />
      ))}
    </div>
  );
}
