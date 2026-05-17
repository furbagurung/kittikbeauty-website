import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { HeaderSearch } from "@/components/layout/header-search";
import { Button } from "@/components/ui/button";
import { getCategories, getProducts } from "@/lib/api";
import { categoryHref, slugifyCategory } from "@/lib/category-utils";
import { createWhatsappLink } from "@/lib/whatsapp";

type HeaderCategoryLink = {
  label: string;
  href?: string;
  categoryAliases?: string[];
};

const categoryLinks: HeaderCategoryLink[] = [
  { label: "New", href: "/products" },
  { label: "Makeup", categoryAliases: ["makeup"] },
  { label: "Skincare", categoryAliases: ["skincare", "skin-care"] },
  { label: "Fragrance", categoryAliases: ["fragrance", "perfume"] },
  { label: "Hair", categoryAliases: ["haircare", "hair-care", "hair"] },
  { label: "Tools & Brushes", categoryAliases: ["tools-and-brushes", "tools-brushes"] },
  { label: "Bath & Body", categoryAliases: ["bath-and-body", "bath-body"] },
  { label: "Mini Size", categoryAliases: ["mini-size"] },
  { label: "Brands", href: "/products" },
  { label: "Gifts & Value Sets", categoryAliases: ["gifts-and-value-sets", "gifts-value-sets"] },
  { label: "Sale & Offers", categoryAliases: ["sale-and-offers", "sale-offers", "sale"] },
];

export async function SiteHeader() {
  const [{ products }, categories] = await Promise.all([getProducts(1, 50), getCategories()]);

  const navLinks: Array<{ label: string; href: string }> = categoryLinks.map((item) => {
    if (item.href) {
      return {
        label: item.label,
        href: item.href,
      };
    }

    const aliases = item.categoryAliases ?? [item.label];
    const matchingCategory = categories.find((category) => {
      const candidates = [category.slug, category.name].filter(Boolean).map((value) => slugifyCategory(String(value)));
      return aliases.some((alias) => candidates.includes(slugifyCategory(alias)));
    });

    return {
      label: item.label,
      href: matchingCategory ? categoryHref(matchingCategory) : `/products/categories/${slugifyCategory(aliases[0])}`,
    };
  });

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white">
      <div className="flex h-8 items-center justify-center bg-stone-950 px-4 text-center text-[12px] font-bold tracking-[0.03em] text-white sm:text-[13px]">
        Authentic beauty picks | WhatsApp support | Delivery available
      </div>
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1304px] flex-col gap-2 px-3 py-2 sm:h-[68px] sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:px-6 sm:py-0 lg:px-8">
          <div className="flex min-h-10 items-center justify-between gap-3 sm:min-h-0">
            <Link
              href="/"
              className="shrink-0 text-base font-bold tracking-[0.12em] text-stone-950 uppercase sm:text-xl sm:tracking-[0.16em]"
              aria-label="Kittik Beauty home"
            >
              Kittik Beauty
            </Link>
            <Button asChild className="h-9 rounded-full bg-stone-950 px-3 text-sm font-bold text-white hover:bg-black sm:hidden">
              <Link
                href={createWhatsappLink("Hi, I want to ask about Kittik Beauty products.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-4" />
                WhatsApp
              </Link>
            </Button>
          </div>

          <HeaderSearch products={products} />

          <Button asChild className="hidden h-11 rounded-full bg-stone-950 px-5 text-[15px] font-bold text-white hover:bg-black sm:inline-flex">
            <Link
              href={createWhatsappLink("Hi, I want to ask about Kittik Beauty products.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" />
              WhatsApp
            </Link>
          </Button>
        </div>
      </div>
      <nav className="bg-black text-white" aria-label="Product categories">
        <div className="no-scrollbar mx-auto w-full max-w-[1600px] touch-pan-x overflow-x-auto overscroll-x-contain scroll-smooth px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 min-w-max items-center justify-start gap-6 whitespace-nowrap text-xs font-bold sm:h-11 sm:gap-8 sm:text-sm lg:justify-center xl:gap-10">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex h-full items-center whitespace-nowrap border-b-2 border-transparent px-0.5 transition-colors hover:border-white/80 hover:text-white/90 sm:px-0"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
