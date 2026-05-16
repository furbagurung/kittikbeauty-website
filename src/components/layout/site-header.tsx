import Link from "next/link";
import { MessageCircle, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createWhatsappLink } from "@/lib/whatsapp";

const categoryLinks = [
  { label: "New", href: "/products?sort=latest" },
  { label: "Makeup", href: "/products?category=Makeup" },
  { label: "Skincare", href: "/products?category=Skincare" },
  { label: "Fragrance", href: "/products?category=Fragrance" },
  { label: "Hair", href: "/products?category=Hair" },
  { label: "Tools & Brushes", href: "/products?category=Tools%20%26%20Brushes" },
  { label: "Bath & Body", href: "/products?category=Bath%20%26%20Body" },
  { label: "Mini Size", href: "/products?category=Mini%20Size" },
  { label: "Brands", href: "/products" },
  { label: "Gifts & Value Sets", href: "/products?category=Gifts%20%26%20Value%20Sets" },
  { label: "Sale & Offers", href: "/products" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white">
      <div className="flex h-8 items-center justify-center bg-stone-950 px-4 text-center text-[12px] font-bold tracking-[0.03em] text-white sm:text-[13px]">
        Authentic beauty picks • WhatsApp support • Delivery available
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

          <Link
            href="/products"
            className="flex h-10 w-full items-center gap-3 rounded-full border border-stone-300 bg-stone-50 px-4 text-sm font-medium text-stone-500 transition-colors hover:border-stone-500 hover:bg-white sm:h-11 sm:max-w-[520px] sm:flex-1 sm:text-[15px]"
            aria-label="Search beauty products"
          >
            <Search className="size-4 shrink-0 text-stone-500 sm:size-5" />
            <span>Search beauty products</span>
          </Link>

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
            {categoryLinks.map((item) => (
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
