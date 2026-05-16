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
      <div className="mx-auto flex h-12 w-full max-w-[1304px] items-center justify-between gap-2 px-3 sm:h-14 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 text-base font-bold tracking-[0.06em] text-stone-950 uppercase sm:text-xl sm:tracking-[0.08em]" aria-label="Kittik Beauty home">
          Kittik Beauty
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <Button asChild variant="ghost" className="h-9 rounded-md px-2 text-[15px] font-bold text-stone-950 sm:h-10 sm:px-4" aria-label="Search products">
            <Link href="/products">
              <Search className="size-4 sm:size-5" />
              <span className="hidden sm:inline">Search</span>
            </Link>
          </Button>
          <Button asChild className="hidden h-10 rounded-md bg-stone-950 px-5 text-[15px] font-bold text-white hover:bg-stone-800 sm:inline-flex">
            <Link
              href={createWhatsappLink("Hi, I want to ask about Kittik Beauty products.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" />
              Contact
            </Link>
          </Button>
          <Button asChild className="h-9 rounded-md bg-stone-950 px-3 text-sm font-bold text-white hover:bg-stone-800 sm:hidden">
            <Link href="/products">Shop</Link>
          </Button>
        </div>
      </div>
      <nav className="bg-black text-white" aria-label="Product categories">
        <div className="no-scrollbar mx-auto w-full max-w-[1600px] touch-pan-x overflow-x-auto overscroll-x-contain scroll-smooth px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 min-w-max items-center justify-start gap-6 whitespace-nowrap text-xs font-bold sm:h-11 sm:gap-8 sm:text-sm lg:justify-center xl:gap-10">
            {categoryLinks.map((item) => (
              <Link key={item.label} href={item.href} className="inline-flex h-full items-center whitespace-nowrap px-0.5 transition-colors hover:text-stone-300 sm:px-0">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
