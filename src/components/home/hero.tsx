import Link from "next/link";

import { ProductImage } from "@/components/products/product-image";
import { categoryHref } from "@/lib/category-utils";
import type { Product } from "@/types/product";

const promoCards = [
  {
    title: "New Beauty Essentials",
    description: "Fresh picks for your everyday glow.",
    cta: "SHOP NOW >",
    href: "/products?sort=latest",
    blockClass: "bg-[#527d6e] text-white",
    fallbackClass: "bg-[linear-gradient(135deg,#e3ead9_0%,#b7cbb8_100%)]",
  },
  {
    title: "Makeup Must-Haves",
    description: "Polished color, soft textures, and daily favorites.",
    cta: "EXPLORE MAKEUP >",
    href: categoryHref({ name: "Makeup" }),
    blockClass: "bg-[#c5c900] text-black",
    fallbackClass: "bg-[linear-gradient(135deg,#f3d8cf_0%,#d9a89c_100%)]",
  },
  {
    title: "Skincare Glow Edit",
    description: "Gentle routines for radiant-looking skin.",
    cta: "VIEW SKINCARE >",
    href: categoryHref({ name: "Skincare" }),
    blockClass: "bg-[#d8804b] text-white",
    fallbackClass: "bg-[linear-gradient(135deg,#f4ddc6_0%,#d98a53_100%)]",
  },
  {
    title: "Buzzy Beauty Finds",
    description: "Trending picks selected for your routine.",
    cta: "SHOP NEW >",
    href: "/products?sort=latest",
    blockClass: "bg-[#71669a] text-white",
    fallbackClass: "bg-[linear-gradient(135deg,#d8cff1_0%,#9489bc_100%)]",
  },
];

export function Hero({ products = [] }: { products?: Product[] }) {
  const featuredProducts = products.slice(0, 4);

  return (
    <section className="w-full border-b border-stone-200 bg-white py-3">
      <h1 className="sr-only">Kittik Beauty beauty catalog</h1>
      <PromoBannerGrid products={featuredProducts} />
    </section>
  );
}

function PromoBannerGrid({ products }: { products: Product[] }) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
        {promoCards.map((card, index) => (
          <PromoCard key={card.title} card={card} product={products[index]} priority={index < 2} />
        ))}
      </div>
    </div>
  );
}

function PromoCard({
  card,
  product,
  priority,
}: {
  card: (typeof promoCards)[number];
  product?: Product;
  priority?: boolean;
}) {
  return (
    <Link href={card.href} className="group block overflow-hidden rounded-sm border border-stone-200 bg-white transition hover:border-stone-400">
      <div className="relative h-[142px] overflow-hidden bg-stone-100 min-[420px]:h-[165px] sm:h-[300px] lg:h-[320px] 2xl:h-[340px]">
        {product ? (
          <ProductImage
            src={product.image}
            alt={product.name}
            priority={priority}
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`absolute inset-0 ${card.fallbackClass}`} />
        )}
      </div>
      <div className={`min-h-[104px] p-3 sm:min-h-[132px] sm:p-6 lg:min-h-[140px] ${card.blockClass}`}>
        <h2 className="text-[15px] font-bold leading-tight min-[420px]:text-base sm:text-2xl">{card.title}</h2>
        <p className="mt-1 line-clamp-2 text-xs leading-4 opacity-95 sm:mt-2 sm:text-base sm:leading-6">{card.description}</p>
        <p className="mt-2 text-xs font-bold tracking-[0.02em] sm:mt-4 sm:text-[15px]">{card.cta}</p>
      </div>
    </Link>
  );
}
