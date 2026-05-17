import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductImage } from "@/components/products/product-image";
import { PageShell } from "@/components/shared/page-shell";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types/product";

export const metadata: Metadata = {
  title: "Categories",
  description: "Shop Kittik Beauty categories for makeup, skincare, haircare, fragrance, tools, and everyday essentials.",
};

type CategoryCard = {
  name: string;
  description: string;
  imageQuery: string[];
  fallbackClassName: string;
};

const categoryCards: CategoryCard[] = [
  {
    name: "Makeup",
    description: "Complexion, lips, eyes, and color for polished everyday looks.",
    imageQuery: ["makeup", "cosmetic", "beauty"],
    fallbackClassName: "bg-[radial-gradient(circle_at_30%_20%,#f5d0d6,transparent_34%),linear-gradient(135deg,#fafafa,#e7e5e4)]",
  },
  {
    name: "Skincare",
    description: "Cleansers, creams, serums, and treatments for daily care.",
    imageQuery: ["skincare", "skin care", "serum", "cream"],
    fallbackClassName: "bg-[radial-gradient(circle_at_78%_24%,#d9f99d,transparent_30%),linear-gradient(135deg,#ffffff,#e7e5e4)]",
  },
  {
    name: "Haircare",
    description: "Shampoo, masks, oils, and styling care for healthy hair.",
    imageQuery: ["haircare", "hair care", "shampoo", "conditioner", "hair"],
    fallbackClassName: "bg-[radial-gradient(circle_at_28%_72%,#fde68a,transparent_34%),linear-gradient(135deg,#fafafa,#d6d3d1)]",
  },
  {
    name: "Fragrance",
    description: "Fragrance picks and finishing touches for every mood.",
    imageQuery: ["fragrance", "perfume", "scent"],
    fallbackClassName: "bg-[radial-gradient(circle_at_72%_24%,#ddd6fe,transparent_34%),linear-gradient(135deg,#ffffff,#e7e5e4)]",
  },
  {
    name: "Tools & Brushes",
    description: "Brushes, applicators, and tools for precise beauty routines.",
    imageQuery: ["brush", "tool", "tools", "applicator"],
    fallbackClassName: "bg-[radial-gradient(circle_at_34%_28%,#bfdbfe,transparent_32%),linear-gradient(135deg,#fafafa,#d6d3d1)]",
  },
  {
    name: "Bath & Body",
    description: "Body care, bath essentials, and soft daily comfort.",
    imageQuery: ["bath", "body", "lotion", "wash"],
    fallbackClassName: "bg-[radial-gradient(circle_at_75%_72%,#bae6fd,transparent_34%),linear-gradient(135deg,#ffffff,#e7e5e4)]",
  },
  {
    name: "Mini Size",
    description: "Travel-friendly beauty and compact essentials to try now.",
    imageQuery: ["mini", "travel", "small"],
    fallbackClassName: "bg-[radial-gradient(circle_at_22%_22%,#fecdd3,transparent_34%),linear-gradient(135deg,#fafafa,#e7e5e4)]",
  },
  {
    name: "Sale & Offers",
    description: "Limited deals and offers across beauty favorites.",
    imageQuery: ["sale", "offer", "discount"],
    fallbackClassName: "bg-[radial-gradient(circle_at_70%_25%,#fed7aa,transparent_34%),linear-gradient(135deg,#ffffff,#d6d3d1)]",
  },
];

function normalize(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
}

async function imageIsReachable(src: string) {
  try {
    const response = await fetch(src, {
      method: "HEAD",
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(3000),
    });

    return response.ok;
  } catch {
    return false;
  }
}

async function getCategoryImage(products: Product[], category: CategoryCard, usedImages: Set<string>) {
  const terms = category.imageQuery.map(normalize);

  const candidates = products.filter((product) => {
    if (!product.image || usedImages.has(product.image)) return false;

    const searchableText = normalize([product.categoryName, product.category?.name, product.name].filter(Boolean).join(" "));
    return terms.some((term) => searchableText.includes(term));
  });

  candidates.push(...products.filter((product) => product.image && !usedImages.has(product.image) && !candidates.includes(product)));

  for (const product of candidates) {
    if (!product.image || usedImages.has(product.image)) continue;
    const reachable = await imageIsReachable(product.image);

    if (reachable) {
      usedImages.add(product.image);
      return product.image;
    }
  }

  return null;
}

export default async function CategoriesPage() {
  const { products } = await getProducts(1, 100);
  const usedImages = new Set<string>();
  const categories: Array<CategoryCard & { image: string | null; href: string }> = [];

  for (const category of categoryCards) {
    categories.push({
      ...category,
      image: await getCategoryImage(products, category, usedImages),
      href: `/products?category=${encodeURIComponent(category.name)}`,
    });
  }

  return (
    <PageShell>
      <section className="bg-white py-8 sm:py-14">
        <div className="mx-auto w-full max-w-[1304px] px-4 sm:px-6 lg:px-8">
          <div className="border-b border-stone-200 pb-6 sm:pb-8">
            <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.14em] text-stone-500">CATEGORIES</p>
            <h1 className="text-[36px] font-bold leading-[1.02] tracking-tight text-stone-950 sm:text-[64px] sm:leading-none">
              Shop by Category
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600 sm:mt-4 sm:text-lg sm:leading-8">
              Explore curated beauty categories for makeup, skincare, haircare, and everyday essentials.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 min-[420px]:gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                href={category.href}
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:border-stone-400 hover:shadow-[0_20px_55px_rgba(28,25,23,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2"
              >
                <div className="relative h-[148px] overflow-hidden bg-stone-100 min-[420px]:h-[172px] sm:h-[220px] lg:h-[244px]">
                  {category.image ? (
                    <ProductImage
                      src={category.image}
                      alt={`${category.name} beauty products`}
                      priority={index < 4}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
                      className="transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                    />
                  ) : (
                    <div className={`h-full w-full ${category.fallbackClassName}`}>
                      <div className="flex h-full items-end p-4 sm:p-5">
                        <div className="h-14 w-14 rounded-full border border-white/70 bg-white/55 shadow-sm sm:h-20 sm:w-20" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                  <h2 className="text-[16px] font-bold leading-tight tracking-tight text-stone-950 sm:text-xl">{category.name}</h2>
                  <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-stone-600 sm:text-sm sm:leading-6">
                    {category.description}
                  </p>
                  <span className="mt-auto flex min-h-11 items-end gap-2 pt-4 text-[13px] font-bold text-stone-950 sm:text-sm">
                    Explore
                    <ArrowRight className="mb-0.5 size-4 transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid items-center gap-5 rounded-lg border border-stone-950 bg-stone-950 p-5 text-white sm:mt-10 sm:p-8 lg:grid-cols-[1fr_auto] lg:p-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">Find your daily beauty essentials</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300 sm:text-base sm:leading-7">
                Browse products curated for your everyday routine.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-white px-6 text-sm font-bold text-stone-950 transition-colors hover:bg-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 sm:w-auto"
            >
              Explore all products
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
