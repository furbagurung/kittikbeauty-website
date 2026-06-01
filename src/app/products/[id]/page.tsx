import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronLeft, Headphones, MapPin, ShieldCheck, Truck } from "lucide-react";

import { ProductCard } from "@/components/products/product-card";
import { ProductDetailActions } from "@/components/products/product-detail-actions";
import { ProductDetailGallery } from "@/components/products/product-detail-gallery";
import { PageShell } from "@/components/shared/page-shell";
import { getProductById, getProducts } from "@/lib/api";
import { categoryHref } from "@/lib/category-utils";
import { formatPrice, productHref, productSlug, stockLabel } from "@/lib/product-utils";
import type { Product } from "@/types/product";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    image?: string;
  }>;
};

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://kittikbeauty.com").replace(/\/$/, "");

function absoluteUrl(pathOrUrl?: string | null) {
  if (!pathOrUrl) return siteUrl;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
  return `${siteUrl}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

function productPath(product: Product) {
  return productHref(product);
}

function productMetaDescription(product: Product) {
  return `Shop ${product.name} at Kittik Beauty Nepal. Authentic beauty and cosmetics products with WhatsApp support and delivery inside and outside Kathmandu Valley.`;
}

function productImageAlt(product: Product) {
  const productType = product.categoryName ? product.categoryName.toLowerCase() : "beauty";
  return `${product.name} ${productType} product available at Kittik Beauty Nepal`;
}

function schemaAvailability(product: Product) {
  const label = stockLabel(product).toLowerCase();
  if (label.includes("out")) return "https://schema.org/OutOfStock";
  if (label.includes("request")) return "https://schema.org/LimitedAvailability";
  return "https://schema.org/InStock";
}

function productBreadcrumbs(product: Product) {
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
  ];

  if (product.category?.name) {
    breadcrumbs.push({ name: product.category.name, href: categoryHref(product.category) });
  } else if (product.categoryName) {
    breadcrumbs.push({ name: product.categoryName, href: `/products?category=${encodeURIComponent(product.categoryName)}` });
  }

  breadcrumbs.push({ name: product.name, href: productPath(product) });

  return breadcrumbs;
}

function buildProductFaq(product: Product) {
  return [
    {
      question: `Is ${product.name} available in Nepal?`,
      answer: `Yes, ${product.name} is available at Kittik Beauty with delivery support.`,
    },
    {
      question: "Can I ask about this product before buying?",
      answer: "Yes, you can use WhatsApp support or the Ask About This Product option.",
    },
    {
      question: "Does Kittik Beauty deliver outside Kathmandu Valley?",
      answer: "Yes, delivery is available inside and outside Kathmandu Valley.",
    },
  ];
}

function ProductStructuredData({
  product,
  faqItems,
}: {
  product: Product;
  faqItems: Array<{ question: string; answer: string }>;
}) {
  const canonicalUrl = absoluteUrl(productPath(product));
  const breadcrumbs = productBreadcrumbs(product);
  const images = (product.images.length ? product.images : [product.image]).filter(isString).map(absoluteUrl);
  const description = productMetaDescription(product);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: images,
      description,
      sku: product.id,
      brand: product.brandName
        ? {
            "@type": "Brand",
            name: product.brandName,
          }
        : undefined,
      category: product.subCategoryName || product.categoryName || undefined,
      url: canonicalUrl,
      offers: {
        "@type": "Offer",
        url: canonicalUrl,
        priceCurrency: "NPR",
        price: typeof product.price === "number" ? product.price : undefined,
        availability: schemaAvailability(product),
        itemCondition: "https://schema.org/NewCondition",
        seller: {
          "@type": "Organization",
          name: "Kittik Beauty",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.href),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

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

  const title = `${product.name} in Nepal | Kittik Beauty`;
  const description = productMetaDescription(product);
  const canonical = productPath(product);
  const imageAlt = productImageAlt(product);
  const images = product.image ? [{ url: absoluteUrl(product.image), alt: imageAlt }] : undefined;
  const keywords = [
    product.name,
    product.brandName,
    product.categoryName,
    product.subCategoryName,
    `${product.name} Nepal`,
    `${product.name} price in Nepal`,
    "Kittik Beauty",
  ].filter(isString);

  return {
    title: {
      absolute: title,
    },
    description,
    keywords,
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
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.image ? [absoluteUrl(product.image)] : undefined,
    },
  };
}

function isSameProduct(product: Product, currentProduct: Product, currentId: string) {
  const normalizedCurrentId = currentId.toLowerCase();

  return (
    product.id === currentProduct.id ||
    product.slug === currentProduct.slug ||
    product.id === currentId ||
    product.slug === currentId ||
    productSlug(product).toLowerCase() === productSlug(currentProduct).toLowerCase() ||
    productSlug(product).toLowerCase() === normalizedCurrentId
  );
}

function isSameCategory(product: Product, currentProduct: Product) {
  const productCategory = product.category?.id ?? product.category?.slug ?? product.categoryName;
  const currentCategory = currentProduct.category?.id ?? currentProduct.category?.slug ?? currentProduct.categoryName;

  return Boolean(productCategory && currentCategory && productCategory.toLowerCase() === currentCategory.toLowerCase());
}

function isSameBrand(product: Product, currentProduct: Product) {
  const productBrand = product.brand?.id ?? product.brand?.slug ?? product.brandName;
  const currentBrand = currentProduct.brand?.id ?? currentProduct.brand?.slug ?? currentProduct.brandName;

  return Boolean(productBrand && currentBrand && productBrand.toLowerCase() === currentBrand.toLowerCase());
}

function uniqueProducts(products: Product[]) {
  const seen = new Set<string>();

  return products.filter((product) => {
    const key = productSlug(product);
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
  const sameBrandProducts = candidateProducts.filter((item) => isSameBrand(item, product));
  const recommendedProducts = uniqueProducts([...sameCategoryProducts, ...sameBrandProducts]).slice(0, 4);

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
  const breadcrumbs = productBreadcrumbs(product);
  const faqItems = buildProductFaq(product);
  const relatedHeading = "You may also like";
  return (
    <PageShell>
      <ProductStructuredData product={product} faqItems={faqItems} />
      <section className="bg-white py-3 sm:py-7">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-6">
          <nav aria-label="Breadcrumb" className="mb-3 overflow-x-auto pb-1 sm:mb-4">
            <ol className="flex min-w-max items-center gap-2 text-xs font-bold text-[#5F5F5F] sm:text-sm">
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <li key={item.href} className="flex items-center gap-2">
                    {index > 0 ? <span className="text-brandGold">/</span> : null}
                    {isLast ? (
                      <span className="max-w-[220px] truncate text-brandEmerald sm:max-w-[420px]">{item.name}</span>
                    ) : (
                      <Link href={item.href} className="transition hover:text-brandGreen">
                        {item.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
          <Link href="/products" className="mb-3 inline-flex min-h-9 items-center gap-2 text-sm font-bold text-[#5F5F5F] hover:text-brandGreen sm:mb-6 sm:min-h-0">
            <ChevronLeft className="size-4" />
            Back to products
          </Link>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(480px,0.9fr)] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(520px,0.88fr)]">
            <ProductDetailGallery
              productName={product.name}
              brandName={product.brandName}
              categoryName={product.categoryName}
              images={gallery}
              selectedIndex={selectedImageIndex}
            />

            <div className="flex flex-col justify-start">
              <div className="bg-white lg:sticky lg:top-24 lg:border-l lg:border-brandGold/25 lg:pl-10 xl:pl-12">
                <p className="text-[11px] font-bold tracking-[0.08em] text-[#5F5F5F] uppercase sm:text-xs">{product.categoryName ?? "Kittik Beauty"}</p>
                <h1 className="mt-2 text-[22px] font-bold leading-[1.18] tracking-tight text-[#111111] min-[420px]:text-2xl sm:mt-3 sm:text-4xl sm:leading-tight">{product.name}</h1>
                <div className="mt-3 flex items-center justify-between gap-3 sm:mt-5 sm:flex-col sm:items-start">
                  <p className="text-[25px] font-bold tracking-tight text-brandEmerald sm:text-3xl">{formatPrice(product.price)}</p>
                  <div className="inline-flex w-fit shrink-0 items-center gap-2 border border-brandGold/35 px-2.5 py-1.5 text-xs font-bold text-brandEmerald sm:px-3 sm:py-2 sm:text-sm">
                    <span className="size-2 rounded-full bg-brandGreen" />
                    {availabilityLabel}
                  </div>
                </div>

                {optionLabel || product.variants.length > 1 ? (
                  <div className="mt-4 sm:mt-8">
                    <p className="text-xs font-bold tracking-[0.02em] text-brandEmerald uppercase sm:text-sm">
                      {variant?.shade ? "Shade" : "Option"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {optionLabel ? (
                        <span className="border border-brandGreen px-3 py-2 text-sm font-bold text-brandEmerald sm:px-4 sm:py-3">{optionLabel}</span>
                      ) : null}
                      {product.variants.slice(optionLabel ? 1 : 0, 8).map((item, index) => (
                        <span
                          key={item.id ?? `${item.name}-${index}`}
                          className="border border-brandGold/25 px-3 py-2 text-sm font-bold text-[#5F5F5F] hover:border-brandGold sm:px-4 sm:py-3"
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
                  <div className="flex items-start gap-2.5 bg-brandCream px-3 py-2.5 text-xs leading-5 text-brandEmerald sm:items-center sm:gap-3 sm:px-4 sm:py-3 sm:text-sm">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-brandGold sm:mt-0 sm:size-5" />
                    <span>
                      <span className="font-medium">Inside Kathmandu Valley</span> - <span className="font-bold">Support available today</span>
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 bg-brandCream px-3 py-2.5 text-xs leading-5 text-brandEmerald sm:items-center sm:gap-3 sm:px-4 sm:py-3 sm:text-sm">
                    <Truck className="mt-0.5 size-4 shrink-0 text-brandGold sm:mt-0 sm:size-5" />
                    <span>
                      <span className="font-medium">Outside Valley</span> - <span className="font-bold">Delivery available</span>
                    </span>
                  </div>
                </div>

                <div className="mt-5 divide-y divide-brandGold/25 border-y border-brandGold/25 sm:mt-8">
                  <details className="group">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-sm font-bold tracking-[0.02em] text-brandEmerald uppercase sm:py-5">
                      <h2 className="text-sm font-bold tracking-[0.02em] uppercase">Description</h2>
                      <span className="text-lg leading-none text-brandGold transition-transform duration-200 group-open:rotate-45">+</span>
                    </summary>
                    <div className="max-w-[62ch] pb-4 pr-1 text-sm leading-6 text-[#5F5F5F] sm:pb-5 sm:pr-2 sm:leading-7">
                      {productDetails}
                    </div>
                  </details>
                  <details className="group">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-sm font-bold tracking-[0.02em] text-brandEmerald uppercase sm:py-5">
                      <h2 className="text-sm font-bold tracking-[0.02em] uppercase">Product Details</h2>
                      <span className="text-lg leading-none text-brandGold transition-transform duration-200 group-open:rotate-45">+</span>
                    </summary>
                    <div className="grid gap-3 pb-5 text-sm text-[#5F5F5F]">
                      {product.brandName ? (
                        <div className="flex items-center justify-between gap-4">
                          <span>Brand</span>
                          <span className="text-right font-bold text-brandEmerald">{product.brandName}</span>
                        </div>
                      ) : null}
                      {product.categoryName ? (
                        <div className="flex items-center justify-between gap-4">
                          <span>Category</span>
                          <span className="text-right font-bold text-brandEmerald">{product.categoryName}</span>
                        </div>
                      ) : null}
                      {optionLabel ? (
                        <div className="flex items-center justify-between gap-4">
                          <span>{variant?.shade ? "Shade" : "Option"}</span>
                          <span className="text-right font-bold text-brandEmerald">{optionLabel}</span>
                        </div>
                      ) : null}
                      <div className="flex items-center justify-between gap-4">
                        <span>Status</span>
                        <span className="text-right font-bold text-brandEmerald">{availabilityLabel}</span>
                      </div>
                    </div>
                  </details>
                  <details className="group">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-sm font-bold tracking-[0.02em] text-brandEmerald uppercase sm:py-5">
                      <h2 className="text-sm font-bold tracking-[0.02em] uppercase">Delivery</h2>
                      <span className="text-lg leading-none text-brandGold transition-transform duration-200 group-open:rotate-45">+</span>
                    </summary>
                    <p className="pb-4 text-sm leading-6 text-[#5F5F5F] sm:pb-5 sm:leading-7">
                      Delivery is available inside Kathmandu Valley and outside Valley. Message us on WhatsApp to confirm timing for your location.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-sm font-bold tracking-[0.02em] text-brandEmerald uppercase sm:py-5">
                      Support
                      <span className="text-lg leading-none text-brandGold transition-transform duration-200 group-open:rotate-45">+</span>
                    </summary>
                    <p className="pb-4 text-sm leading-6 text-[#5F5F5F] sm:pb-5 sm:leading-7">
                      Ask about shade, usage, availability, or delivery directly through WhatsApp before buying.
                    </p>
                  </details>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-b border-brandGold/25 pb-5 sm:mt-5 sm:gap-4 sm:pb-6 lg:grid-cols-1 xl:grid-cols-3">
                  <div className="flex flex-col items-center gap-2 text-center text-brandEmerald sm:flex-row sm:text-left">
                    <ShieldCheck className="size-5 text-brandGold sm:size-6" />
                    <span className="text-[11px] font-bold leading-snug sm:text-sm">Authentic products</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center text-brandEmerald sm:flex-row sm:text-left">
                    <Headphones className="size-5 text-brandGold sm:size-6" />
                    <span className="text-[11px] font-bold leading-snug sm:text-sm">WhatsApp support</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center text-brandEmerald sm:flex-row sm:text-left">
                    <CheckCircle2 className="size-5 text-brandGold sm:size-6" />
                    <span className="text-[11px] font-bold leading-snug sm:text-sm">Delivery available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-brandCream py-10 sm:py-14">
        <div className="mx-auto grid w-full max-w-[1440px] gap-5 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)] lg:px-6">
          <div className="bg-white p-5 sm:p-7 lg:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-brandEmerald sm:text-3xl">
              Buy {product.name} in Nepal
            </h2>
            <div className="mt-4 max-w-[78ch] space-y-4 text-sm leading-7 text-[#5F5F5F] sm:text-base sm:leading-8">
              <p>
                {product.name} is available at Kittik Beauty, your trusted online beauty and cosmetics store in Nepal.
                We offer authentic makeup, skincare, fragrance, hair care, and beauty essentials with WhatsApp support
                and delivery inside and outside Kathmandu Valley.
              </p>
            </div>
          </div>

          <section className="bg-white p-5 sm:p-7 lg:p-8" aria-labelledby="why-shop-kittik">
            <h2 id="why-shop-kittik" className="text-xl font-bold tracking-tight text-brandEmerald">
              Why shop from Kittik Beauty?
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-[#5F5F5F]">
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brandGold" />
                Authentic beauty product selection
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brandGold" />
                WhatsApp support before purchase
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brandGold" />
                Delivery available inside and outside Kathmandu Valley
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brandGold" />
                Easy product enquiry and order support
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brandGold" />
                Premium makeup, skincare, fragrance, and beauty collection in Nepal
              </li>
            </ul>
          </section>
        </div>
      </section>
      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto w-full max-w-[1040px] px-4 sm:px-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-brandEmerald sm:text-3xl">
              Frequently asked questions
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#5F5F5F]">
              Common product, ordering, and delivery questions before buying from Kittik Beauty.
            </p>
          </div>
          <div className="divide-y divide-brandGold/25 border-y border-brandGold/25">
            {faqItems.map((item) => (
              <details key={item.question} className="group">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-sm font-bold text-brandEmerald sm:text-base">
                  {item.question}
                  <span className="text-xl leading-none text-brandGold transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-[78ch] pb-5 text-sm leading-7 text-[#5F5F5F]">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      {recommendedProducts.length ? (
        <section className="bg-white pb-10 pt-6 sm:pb-16 sm:pt-9">
          <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-6">
            <div className="mb-5 flex flex-col gap-4 border-t border-brandGold/25 pt-6 sm:mb-6 sm:flex-row sm:items-end sm:justify-between sm:pt-7">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-brandEmerald sm:text-3xl">{relatedHeading}</h2>
                <p className="mt-2 text-sm font-medium text-[#5F5F5F]">More Kittik Beauty products selected around this item.</p>
              </div>
              <Link
                href="/products"
                className="inline-flex h-11 w-fit items-center justify-center border border-brandGreen px-5 text-sm font-bold text-brandEmerald transition-colors duration-200 hover:bg-brandGreen hover:text-white"
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
