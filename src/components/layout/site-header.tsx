import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ShoppingBag } from "lucide-react";

import { CustomerAccountIconLink } from "@/components/layout/customer-account-link";
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
  const [{ products }, categories] = await Promise.all([getProducts(1, 500), getCategories()]);
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
    <header className="sticky top-0 z-40 border-b border-brandGold/30 bg-white/95 backdrop-blur-xl">
      <div className="border-b border-brandGold/25 bg-white">
        <div className="mx-auto flex w-full max-w-[1304px] flex-col gap-2 px-3 py-2 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:px-6 sm:py-1.5 lg:px-8">
          <div className="grid min-h-[50px] grid-cols-[80px_minmax(0,1fr)_80px] items-center gap-2 sm:flex sm:min-h-0 sm:shrink-0 sm:grid-cols-none sm:gap-3">
            <div className="flex items-center justify-start">
              <MobileNavigation navLinks={navLinks} />
            </div>
            <div className="flex items-center justify-center sm:justify-start">
              <Link
                href="/"
                className="flex shrink-0 items-center justify-center"
                aria-label="Kittik Beauty home"
              >
                <Image
                  src="/images/kittik-logo.png"
                  alt="Kittik Beauty"
                  width={200}
                  height={74}
                  priority
                  className="h-auto max-h-[44px] w-auto object-contain md:max-h-[42px]"
                />
              </Link>
            </div>
            <div className="flex items-center justify-end gap-1.5 sm:hidden">
              <Link
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-full border border-brandGold/35 bg-white text-brandEmerald"
                aria-label="Cart support"
              >
                <ShoppingBag className="size-4.5" aria-hidden="true" />
              </Link>
              <CustomerAccountIconLink
                className="inline-flex size-9 items-center justify-center rounded-full bg-brandGreen text-white"
                iconClassName="size-4.5"
              />
            </div>
          </div>

          <HeaderSearch products={products} />

          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-11 items-center justify-center rounded-full border border-brandGold/35 bg-white text-brandEmerald transition hover:bg-brandCream"
              aria-label="Cart support"
            >
              <ShoppingBag className="size-5" aria-hidden="true" />
            </Link>
            <CustomerAccountIconLink
              className="inline-flex size-11 items-center justify-center rounded-full border border-brandGold/35 bg-white text-brandEmerald transition hover:bg-brandCream"
              iconClassName="size-5"
            />
          </div>

          <Button asChild className="hidden h-11 rounded-full bg-brandGreen px-5 text-[15px] font-bold text-white hover:bg-brandEmerald lg:inline-flex">
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
      <nav className="hidden bg-white text-brandEmerald sm:block" aria-label="Product categories">
        <div className="no-scrollbar mx-auto w-full max-w-[1600px] touch-pan-x overflow-x-auto overscroll-x-contain scroll-smooth px-4 sm:px-6 lg:px-8">
          <div className="flex h-11 min-w-max items-center justify-start gap-3 whitespace-nowrap text-xs font-bold sm:gap-4 sm:text-sm lg:justify-center xl:gap-5">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex h-8 items-center whitespace-nowrap rounded-full px-3 transition-colors hover:bg-brandCream hover:text-brandGreen"
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
