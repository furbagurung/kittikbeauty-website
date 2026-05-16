import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronLeft, Headphones, MapPin, ShieldCheck, Truck } from "lucide-react";

import { ProductCard } from "@/components/products/product-card";
import { ProductDetailActions } from "@/components/products/product-detail-actions";
import { ProductImage } from "@/components/products/product-image";
import { PageShell } from "@/components/shared/page-shell";
import { getProductById, getProducts } from "@/lib/api";
import { formatPrice, stockLabel } from "@/lib/product-utils";
import type { Product } from "@/types/product";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

function isSameProduct(product: Product, currentProduct: Product, currentId: string) {
  return (
    product.id === currentProduct.id ||
    product.slug === currentProduct.slug ||
    product.id === currentId ||
    product.slug === currentId
  );
}

function isSameCategory(product: Product, currentProduct: Product) {
  const productCategory = product.category?.id ?? product.category?.slug ?? product.categoryName;
  const currentCategory = currentProduct.category?.id ?? currentProduct.category?.slug ?? currentProduct.categoryName;

  return Boolean(productCategory && currentCategory && productCategory.toLowerCase() === currentCategory.toLowerCase());
}

function uniqueProducts(products: Product[]) {
  const seen = new Set<string>();

  return products.filter((product) => {
    const key = product.slug ?? product.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const currentId = decodeURIComponent(id);
  const product = await getProductById(currentId);

  if (!product) {
    notFound();
  }

  const { products } = await getProducts(1, 24);
  const candidateProducts = products.filter((item) => !isSameProduct(item, product, currentId));
  const sameCategoryProducts = candidateProducts.filter((item) => isSameCategory(item, product));
  const otherProducts = candidateProducts.filter((item) => !isSameCategory(item, product));
  const recommendedProducts = uniqueProducts([...sameCategoryProducts, ...otherProducts]).slice(0, 4);

  const variant = product.variants[0];
  const gallery = product.images.length ? product.images : [product.image].filter(Boolean);
  const currentStatus = stockLabel(product);
  const availabilityLabel = currentStatus.toLowerCase() === "active" ? "Available" : currentStatus;
  const productDetails = product.description?.trim() || "Product information is being updated.";
  const optionLabel = variant?.shade ?? variant?.name;

  return (
    <PageShell>
      <section className="bg-white py-4 sm:py-7">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-6">
          <Link href="/products" className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-stone-950 sm:mb-6">
            <ChevronLeft className="size-4" />
            Back to products
          </Link>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(480px,0.9fr)] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(520px,0.88fr)]">
            <div className="space-y-3 sm:space-y-4">
              <div className="relative aspect-square overflow-hidden border border-stone-200 bg-stone-50">
                <ProductImage
                  src={gallery[0] ?? null}
                  alt={product.name}
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain p-3 sm:p-6"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-6 sm:gap-3 sm:overflow-visible sm:pb-0">
                {gallery.slice(0, 6).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className={`relative aspect-square w-20 shrink-0 overflow-hidden border bg-stone-50 transition-colors duration-200 sm:w-auto ${
                      index === 0 ? "border-stone-950" : "border-stone-200 hover:border-stone-500"
                    }`}
                  >
                    <ProductImage src={image} alt={`${product.name} ${index + 1}`} sizes="120px" className="object-contain p-2.5" />
                    {index === 0 ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-stone-950" /> : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-start">
              <div className="sticky top-24 bg-white lg:border-l lg:border-stone-200 lg:pl-10 xl:pl-12">
                <p className="text-xs font-bold tracking-[0.08em] text-stone-500 uppercase">{product.categoryName ?? "Kittik Beauty"}</p>
                <h1 className="mt-3 text-2xl font-bold leading-[1.15] tracking-tight text-stone-950 sm:text-4xl sm:leading-tight">{product.name}</h1>
                <div className="mt-4 flex flex-col gap-3 sm:mt-5">
                  <p className="text-[28px] font-bold tracking-tight text-stone-950 sm:text-3xl">{formatPrice(product.price)}</p>
                  <div className="inline-flex w-fit items-center gap-2 border border-stone-200 px-3 py-2 text-sm font-bold text-stone-950">
                    <span className="size-2 rounded-full bg-emerald-600" />
                    {availabilityLabel}
                  </div>
                </div>

                {optionLabel || product.variants.length > 1 ? (
                  <div className="mt-6 sm:mt-8">
                    <p className="text-sm font-bold tracking-[0.02em] text-stone-950 uppercase">
                      {variant?.shade ? "Shade" : "Option"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {optionLabel ? (
                        <span className="border border-stone-950 px-4 py-3 text-sm font-bold text-stone-950">{optionLabel}</span>
                      ) : null}
                      {product.variants.slice(optionLabel ? 1 : 0, 8).map((item, index) => (
                        <span
                          key={item.id ?? `${item.name}-${index}`}
                          className="border border-stone-200 px-4 py-3 text-sm font-bold text-stone-700 hover:border-stone-500"
                        >
                          {item.shade ?? item.name ?? `Variant ${index + 1}`}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-6 grid gap-2 sm:mt-8">
                  <div className="flex items-center gap-3 bg-blue-50 px-3 py-3 text-sm leading-5 text-stone-950 sm:px-4">
                    <MapPin className="size-5 shrink-0 text-stone-950" />
                    <span>
                      <span className="font-medium">Inside Kathmandu Valley</span> - <span className="font-bold">Support available today</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-blue-50 px-3 py-3 text-sm leading-5 text-stone-950 sm:px-4">
                    <Truck className="size-5 shrink-0 text-stone-950" />
                    <span>
                      <span className="font-medium">Outside Valley</span> - <span className="font-bold">Delivery available</span>
                    </span>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8">
                  <ProductDetailActions productName={product.name} />
                </div>

                <div className="mt-6 divide-y divide-stone-200 border-y border-stone-200 sm:mt-8">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-bold tracking-[0.02em] text-stone-950 uppercase sm:py-5">
                      Description
                      <span className="text-lg leading-none text-stone-500 transition-transform duration-200 group-open:rotate-45">+</span>
                    </summary>
                    <div className="max-w-[62ch] pb-5 pr-2 text-sm leading-7 text-stone-600">
                      {productDetails}
                    </div>
                  </details>
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-bold tracking-[0.02em] text-stone-950 uppercase sm:py-5">
                      Product details
                      <span className="text-lg leading-none text-stone-500 transition-transform duration-200 group-open:rotate-45">+</span>
                    </summary>
                    <div className="grid gap-3 pb-5 text-sm text-stone-600">
                      {product.categoryName ? (
                        <div className="flex items-center justify-between gap-4">
                          <span>Category</span>
                          <span className="text-right font-bold text-stone-950">{product.categoryName}</span>
                        </div>
                      ) : null}
                      {optionLabel ? (
                        <div className="flex items-center justify-between gap-4">
                          <span>{variant?.shade ? "Shade" : "Option"}</span>
                          <span className="text-right font-bold text-stone-950">{optionLabel}</span>
                        </div>
                      ) : null}
                      <div className="flex items-center justify-between gap-4">
                        <span>Status</span>
                        <span className="text-right font-bold text-stone-950">{availabilityLabel}</span>
                      </div>
                    </div>
                  </details>
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-bold tracking-[0.02em] text-stone-950 uppercase sm:py-5">
                      Delivery
                      <span className="text-lg leading-none text-stone-500 transition-transform duration-200 group-open:rotate-45">+</span>
                    </summary>
                    <p className="pb-5 text-sm leading-7 text-stone-600">
                      Delivery is available inside Kathmandu Valley and outside Valley. Message us on WhatsApp to confirm timing for your location.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-bold tracking-[0.02em] text-stone-950 uppercase sm:py-5">
                      Support
                      <span className="text-lg leading-none text-stone-500 transition-transform duration-200 group-open:rotate-45">+</span>
                    </summary>
                    <p className="pb-5 text-sm leading-7 text-stone-600">
                      Ask about shade, usage, availability, or delivery directly through WhatsApp before buying.
                    </p>
                  </details>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 border-b border-stone-200 pb-6 sm:grid-cols-3 sm:gap-4 lg:grid-cols-1 xl:grid-cols-3">
                  <div className="flex items-center gap-3 text-stone-950">
                    <ShieldCheck className="size-6 text-stone-950" />
                    <span className="text-sm font-bold leading-snug">Authentic products</span>
                  </div>
                  <div className="flex items-center gap-3 text-stone-950">
                    <Headphones className="size-6 text-stone-950" />
                    <span className="text-sm font-bold leading-snug">WhatsApp support</span>
                  </div>
                  <div className="flex items-center gap-3 text-stone-950">
                    <CheckCircle2 className="size-6 text-stone-950" />
                    <span className="text-sm font-bold leading-snug">Delivery available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {recommendedProducts.length ? (
        <section className="bg-white pb-10 pt-6 sm:pb-16 sm:pt-9">
          <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-6">
            <div className="mb-5 flex flex-col gap-4 border-t border-stone-200 pt-6 sm:mb-6 sm:flex-row sm:items-end sm:justify-between sm:pt-7">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">You May Also Like</h2>
                <p className="mt-2 text-sm font-medium text-stone-600">More beauty picks selected for your routine.</p>
              </div>
              <Link
                href="/products"
                className="inline-flex h-11 w-fit items-center justify-center border border-stone-950 px-5 text-sm font-bold text-stone-950 transition-colors duration-200 hover:bg-stone-950 hover:text-white"
              >
                View all products
              </Link>
            </div>
            <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-4 pb-1 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0 xl:gap-6">
              {recommendedProducts.map((item) => (
                <div key={item.slug ?? item.id} className="w-[74vw] max-w-[310px] shrink-0 snap-start snap-always sm:w-[42vw] lg:w-auto lg:max-w-none">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
