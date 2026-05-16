import { ProductListingClient } from "@/components/products/product-listing-client";
import { PageShell } from "@/components/shared/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { getProducts } from "@/lib/api";

type ProductsPageProps = {
  searchParams?: Promise<{
    category?: string;
    sort?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const { products } = await getProducts(1, 12);
  const initialCategory = params?.category ? decodeURIComponent(params.category) : "all";
  const initialSort = params?.sort === "price-asc" || params?.sort === "price-desc" ? params.sort : "latest";

  return (
    <PageShell>
      <section className="bg-white py-8 sm:py-14">
        <div className="mx-auto w-full max-w-[1304px] px-4 sm:px-6 lg:px-8">
          <div className="border-b border-stone-200 pb-6 sm:pb-8">
            <SectionHeading
              eyebrow="Catalog"
              title="Explore Kittik Beauty"
              description="Shop curated skincare, makeup, and beauty essentials with quick search, category filters, and clean sorting."
            />
          </div>
          <div className="mt-6 sm:mt-8">
            <ProductListingClient products={products} initialCategory={initialCategory} initialSort={initialSort} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
