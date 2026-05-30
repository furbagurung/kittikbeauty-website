import Link from "next/link";
import { MessageCircle, ShoppingBag, UserRound } from "lucide-react";

import { HeaderSearch } from "@/components/layout/header-search";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
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
  { label: "Makeup Services", href: "/makeup" },
  { label: "Makeup", categoryAliases: ["makeup"] },
  { label: "Skincare", categoryAliases: ["skincare", "skin-care"] },
  { label: "Fragrance", categoryAliases: ["fragrance", "perfume"] },
  { label: "Hair", categoryAliases: ["haircare", "hair-care", "hair"] },
  { label: "Tools & Brushes", categoryAliases: ["tools-and-brushes", "tools-brushes"] },
  { label: "Bath & Body", categoryAliases: ["bath-and-body", "bath-body"] },
  { label: "Mini Size", categoryAliases: ["mini-size"] },
  { label: "Brands", href: "/products/brands" },
  { label: "Gifts & Value Sets", categoryAliases: ["gifts-and-value-sets", "gifts-value-sets"] },
  { label: "Sale & Offers", categoryAliases: ["sale-and-offers", "sale-offers", "sale"] },
];

export async function SiteHeader() {
  const [{ products }, categories] = await Promise.all([getProducts(1, 50), getCategories()]);
  const whatsappHref = createWhatsappLink("Hi, I want to ask about Kittik Beauty products.");

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
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
      <div className="flex h-7 items-center justify-center bg-neutral-950 px-4 text-center text-[11px] font-bold tracking-[0.02em] text-white sm:h-8 sm:text-[13px]">
        Authentic beauty picks | WhatsApp support | Delivery available
      </div>
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1304px] flex-col gap-1.5 px-3 py-1.5 sm:h-[72px] sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:px-6 sm:py-0 lg:px-8">
          <div className="flex min-h-9 items-center justify-between gap-3 sm:min-h-0">
            <div className="flex items-center gap-2">
              <MobileNavigation navLinks={navLinks} />
              <Link
                href="/"
                className="shrink-0 rounded-full bg-stone-950 px-3 py-1.5 text-[12px] font-black tracking-[0.08em] text-white uppercase shadow-[0_10px_24px_rgba(28,25,23,0.12)] sm:bg-transparent sm:px-0 sm:py-0 sm:text-xl sm:tracking-[0.12em] sm:text-stone-950 sm:shadow-none"
                aria-label="Kittik Beauty home"
              >
                Kittik Beauty
              </Link>
            </div>
            <div className="flex items-center gap-1.5 sm:hidden">
              <Link
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-stone-950"
                aria-label="Cart support"
              >
                <ShoppingBag className="size-4.5" aria-hidden="true" />
              </Link>
              <Link
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-full bg-stone-950 text-white"
                aria-label="Account support"
              >
                <UserRound className="size-4.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <HeaderSearch products={products} />

          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-stone-950 transition hover:bg-neutral-100"
              aria-label="Cart support"
            >
              <ShoppingBag className="size-5" aria-hidden="true" />
            </Link>
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-950 transition hover:bg-stone-50"
              aria-label="Account support"
            >
              <UserRound className="size-5" aria-hidden="true" />
            </Link>
          </div>

          <Button asChild className="hidden h-11 rounded-full bg-stone-950 px-5 text-[15px] font-bold text-white hover:bg-black lg:inline-flex">
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" />
              WhatsApp
            </Link>
          </Button>
        </div>
      </div>
      <nav className="hidden bg-white text-stone-950 sm:block" aria-label="Product categories">
        <div className="no-scrollbar mx-auto w-full max-w-[1600px] touch-pan-x overflow-x-auto overscroll-x-contain scroll-smooth px-4 sm:px-6 lg:px-8">
          <div className="flex h-11 min-w-max items-center justify-start gap-3 whitespace-nowrap text-xs font-bold sm:gap-4 sm:text-sm lg:justify-center xl:gap-5">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex h-8 items-center whitespace-nowrap rounded-full px-3 transition-colors hover:bg-neutral-100 hover:text-stone-950"
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
