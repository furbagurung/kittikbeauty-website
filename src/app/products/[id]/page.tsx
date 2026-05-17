import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronLeft, Headphones, MapPin, ShieldCheck, Truck } from "lucide-react";

import { ProductCard } from "@/components/products/product-card";
import { ProductDetailActions } from "@/components/products/product-detail-actions";
import { ProductDetailGallery } from "@/components/products/product-detail-gallery";
import { PageShell } from "@/components/shared/page-shell";
import { getProductById, getProducts } from "@/lib/api";
import { formatPrice, stockLabel } from "@/lib/product-utils";
import type { Product } from "@/types/product";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    image?: string;
  }>;
};

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const currentId = decodeURIComponent(id);
  const product = await getProductById(currentId);

  if (!product) {
    return {
      title: "Product",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const title = `Buy ${product.name} in Nepal | Kittik Beauty`;
  const description = `Buy ${product.name} at Kittik Beauty. View price, product details, category, shade options, and ask or order through WhatsApp support in Nepal.`;
  const canonical = `/products/${encodeURIComponent(product.slug || product.id)}`;
  const images = product.image ? [{ url: product.image, alt: product.name }] : undefined;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Kittik Beauty",
      type: "website",
      images,
    },
  };
}

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

function isString(value: string | null | undefined): value is string {
  return Boolean(value);
}

export default async function ProductDetailPage({ params, searchParams }: ProductDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
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
  const gallery = product.images.length ? product.images : [product.image].filter(isString);
  const requestedImageIndex = Number(query?.image ?? 1) - 1;
  const selectedImageIndex = Number.isFinite(requestedImageIndex)
    ? Math.min(Math.max(requestedImageIndex, 0), Math.max(gallery.slice(0, 6).length - 1, 0))
    : 0;
  const currentStatus = stockLabel(product);
  const availabilityLabel = currentStatus.toLowerCase() === "active" ? "Available" : currentStatus;
  const productDetails = product.description?.trim() || "Product information is being updated.";
  const optionLabel = variant?.shade ?? variant?.name;

  return (
    <PageShell>
      <section className="bg-white py-3 sm:py-7">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-6">
          <Link href="/products" className="mb-3 inline-flex min-h-9 items-center gap-2 text-sm font-bold text-stone-600 hover:text-stone-950 sm:mb-6 sm:min-h-0">
            <ChevronLeft className="size-4" />
            Back to products
          </Link>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(480px,0.9fr)] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(520px,0.88fr)]">
            <ProductDetailGallery productName={product.name} images={gallery} selectedIndex={selectedImageIndex} />

            <div className="flex flex-col justify-start">
              <div className="bg-white lg:sticky lg:top-24 lg:border-l lg:border-stone-200 lg:pl-10 xl:pl-12">
                <p className="text-[11px] font-bold tracking-[0.08em] text-stone-500 uppercase sm:text-xs">{product.categoryName ?? "Kittik Beauty"}</p>
                <h1 className="mt-2 text-[22px] font-bold leading-[1.18] tracking-tight text-stone-950 min-[420px]:text-2xl sm:mt-3 sm:text-4xl sm:leading-tight">{product.name}</h1>
                <div className="mt-3 flex items-center justify-between gap-3 sm:mt-5 sm:flex-col sm:items-start">
                  <p className="text-[25px] font-bold tracking-tight text-stone-950 sm:text-3xl">{formatPrice(product.price)}</p>
                  <div className="inline-flex w-fit shrink-0 items-center gap-2 border border-stone-200 px-2.5 py-1.5 text-xs font-bold text-stone-950 sm:px-3 sm:py-2 sm:text-sm">
                    <span className="size-2 rounded-full bg-emerald-600" />
                    {availabilityLabel}
                  </div>
                </div>

                {optionLabel || product.variants.length > 1 ? (
                  <div className="mt-4 sm:mt-8">
                    <p className="text-xs font-bold tracking-[0.02em] text-stone-950 uppercase sm:text-sm">
                      {variant?.shade ? "Shade" : "Option"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {optionLabel ? (
                        <span className="border border-stone-950 px-3 py-2 text-sm font-bold text-stone-950 sm:px-4 sm:py-3">{optionLabel}</span>
                      ) : null}
                      {product.variants.slice(optionLabel ? 1 : 0, 8).map((item, index) => (
                        <span
                          key={item.id ?? `${item.name}-${index}`}
                          className="border border-stone-200 px-3 py-2 text-sm font-bold text-stone-700 hover:border-stone-500 sm:px-4 sm:py-3"
                        >
                          {item.shade ?? item.name ?? `Variant ${index + 1}`}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-5 sm:mt-8">
                  <ProductDetailActions productName={product.name} />
                </div>

                <div className="mt-4 grid gap-2 sm:mt-8">
                  <div className="flex items-start gap-2.5 bg-blue-50 px-3 py-2.5 text-xs leading-5 text-stone-950 sm:items-center sm:gap-3 sm:px-4 sm:py-3 sm:text-sm">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-stone-950 sm:mt-0 sm:size-5" />
                    <span>
                      <span className="font-medium">Inside Kathmandu Valley</span> - <span className="font-bold">Support available today</span>
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 bg-blue-50 px-3 py-2.5 text-xs leading-5 text-stone-950 sm:items-center sm:gap-3 sm:px-4 sm:py-3 sm:text-sm">
                    <Truck className="mt-0.5 size-4 shrink-0 text-stone-950 sm:mt-0 sm:size-5" />
                    <span>
                      <span className="font-medium">Outside Valley</span> - <span className="font-bold">Delivery available</span>
                    </span>
                  </div>
                </div>

                <div className="mt-5 divide-y divide-stone-200 border-y border-stone-200 sm:mt-8">
                  <details className="group">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-sm font-bold tracking-[0.02em] text-stone-950 uppercase sm:py-5">
                      Description
                      <span className="text-lg leading-none text-stone-500 transition-transform duration-200 group-open:rotate-45">+</span>
                    </summary>
                    <div className="max-w-[62ch] pb-4 pr-1 text-sm leading-6 text-stone-600 sm:pb-5 sm:pr-2 sm:leading-7">
                      {productDetails}
                    </div>
                  </details>
                  <details className="group">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-sm font-bold tracking-[0.02em] text-stone-950 uppercase sm:py-5">
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
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-sm font-bold tracking-[0.02em] text-stone-950 uppercase sm:py-5">
                      Delivery
                      <span className="text-lg leading-none text-stone-500 transition-transform duration-200 group-open:rotate-45">+</span>
                    </summary>
                    <p className="pb-4 text-sm leading-6 text-stone-600 sm:pb-5 sm:leading-7">
                      Delivery is available inside Kathmandu Valley and outside Valley. Message us on WhatsApp to confirm timing for your location.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-sm font-bold tracking-[0.02em] text-stone-950 uppercase sm:py-5">
                      Support
                      <span className="text-lg leading-none text-stone-500 transition-transform duration-200 group-open:rotate-45">+</span>
                    </summary>
                    <p className="pb-4 text-sm leading-6 text-stone-600 sm:pb-5 sm:leading-7">
                      Ask about shade, usage, availability, or delivery directly through WhatsApp before buying.
                    </p>
                  </details>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-b border-stone-200 pb-5 sm:mt-5 sm:gap-4 sm:pb-6 lg:grid-cols-1 xl:grid-cols-3">
                  <div className="flex flex-col items-center gap-2 text-center text-stone-950 sm:flex-row sm:text-left">
                    <ShieldCheck className="size-5 text-stone-950 sm:size-6" />
                    <span className="text-[11px] font-bold leading-snug sm:text-sm">Authentic products</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center text-stone-950 sm:flex-row sm:text-left">
                    <Headphones className="size-5 text-stone-950 sm:size-6" />
                    <span className="text-[11px] font-bold leading-snug sm:text-sm">WhatsApp support</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center text-stone-950 sm:flex-row sm:text-left">
                    <CheckCircle2 className="size-5 text-stone-950 sm:size-6" />
                    <span className="text-[11px] font-bold leading-snug sm:text-sm">Delivery available</span>
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
