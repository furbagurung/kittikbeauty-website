"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ProductImage } from "@/components/products/product-image";
import { categoryHref } from "@/lib/category-utils";
import { formatPrice, productHref } from "@/lib/product-utils";
import type { Product } from "@/types/product";

type HeaderSearchProps = {
  products: Product[];
};

const popularSearches = ["Sunscreen", "Lip tint", "Mascara", "Serum", "Eyeliner", "Blush", "Moisturizer", "Foundation"];

const categoryShortcuts = [
  { label: "Makeup", href: categoryHref({ name: "Makeup" }) },
  { label: "Skincare", href: categoryHref({ name: "Skincare" }) },
  { label: "Haircare", href: categoryHref({ name: "Haircare" }) },
  { label: "New Arrivals", href: "/products?sort=latest" },
];

function buildRelatedSearches(query: string) {
  const normalized = query.toLowerCase();

  if (normalized.includes("melao")) {
    return ["melao sunscreen", "melao serum", "melao skincare", "melao face cream"];
  }
  if (normalized.includes("lip")) {
    return ["lip tint", "lip gloss", "lipstick", "lip colour"];
  }
  if (normalized.includes("eye")) {
    return ["eyeliner", "eyebrow", "eyeshadow", "mascara"];
  }
  if (normalized.includes("skin")) {
    return ["skincare", "sunscreen", "serum", "moisturizer"];
  }

  return [`${query} sunscreen`, `${query} serum`, `${query} skincare`, `${query} face cream`];
}

export function HeaderSearch({ products }: HeaderSearchProps) {
  const router = useRouter();
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const trimmedQuery = query.trim();
  const hasTypedQuery = trimmedQuery.length > 0;

  const trendingProducts = useMemo(() => products.slice(0, 6), [products]);

  const suggestions = useMemo(() => {
    const normalizedQuery = trimmedQuery.toLowerCase();
    if (!normalizedQuery) return [];

    return products
      .filter((product) => {
        const name = product.name.toLowerCase();
        const category = product.categoryName?.toLowerCase() ?? "";
        return name.includes(normalizedQuery) || category.includes(normalizedQuery);
      })
      .slice(0, 6);
  }, [products, trimmedQuery]);

  const relatedSearches = useMemo(() => (hasTypedQuery ? buildRelatedSearches(trimmedQuery) : []), [hasTypedQuery, trimmedQuery]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const originalOverflow = document.body.style.overflow;
    const timeout = window.setTimeout(() => {
      mobileInputRef.current?.focus();
    }, 50);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      window.clearTimeout(timeout);
    };
  }, [mobileOpen]);

  function clearSearch() {
    setQuery("");
  }

  function closePanels() {
    setMobileOpen(false);
  }

  function closeMobileSearch() {
    setMobileOpen(false);
    setQuery("");
  }

  function goToResults(searchQuery = trimmedQuery) {
    closePanels();
    const nextQuery = searchQuery.trim();
    router.push(nextQuery ? `/products?search=${encodeURIComponent(nextQuery)}` : "/products");
  }

  function renderMobileChip(label: string, onClick: () => void) {
    return (
      <button
        key={label}
        type="button"
        onClick={onClick}
        className="min-h-9 rounded-full bg-stone-100 px-4 text-[13px] font-semibold leading-none text-stone-800 transition-colors hover:bg-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
      >
        {label}
      </button>
    );
  }

  function renderMobileSectionTitle(title: string) {
    return <h3 className="text-[13px] font-bold tracking-[0.08em] text-stone-500 uppercase">{title}</h3>;
  }

  function renderMobileProductRows(productsToShow: Product[]) {
    return (
      <div className="divide-y divide-stone-100 rounded-xl border border-stone-100 bg-white">
        {productsToShow.map((product) => (
          <Link
            key={product.slug ?? product.id}
            href={productHref(product)}
            onClick={closePanels}
            className="grid min-h-[68px] grid-cols-[48px_minmax(0,1fr)] gap-3 px-3 py-2.5 transition-colors hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-stone-950"
          >
            <div className="relative size-12 overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
              <ProductImage src={product.image} alt={product.name} sizes="48px" className="object-cover" />
            </div>
            <div className="min-w-0 self-center">
              <p className="line-clamp-1 text-[13px] font-bold leading-5 text-stone-950">{product.name}</p>
              <div className="mt-0.5 flex min-w-0 items-center gap-2">
                <p className="line-clamp-1 min-w-0 text-xs font-medium text-stone-500">{product.categoryName ?? "Kittik Beauty"}</p>
                <span className="size-1 shrink-0 rounded-full bg-stone-300" />
                <p className="shrink-0 text-xs font-bold text-stone-950">{formatPrice(product.price)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  function renderMobileDiscovery() {
    return (
      <div className="px-4 py-5">
        <h2 className="text-[22px] font-bold leading-tight tracking-tight text-stone-950">Search Discovery</h2>

        <section className="mt-5">
          {renderMobileSectionTitle("Popular Searches")}
          <div className="mt-3 flex flex-wrap gap-2">
            {popularSearches.map((item) => renderMobileChip(item, () => goToResults(item)))}
          </div>
        </section>

        <section className="mt-6">
          {renderMobileSectionTitle("Shop by Category")}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {categoryShortcuts.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closePanels}
                className="flex min-h-10 items-center rounded-xl border border-stone-200 bg-white px-3 text-[13px] font-bold text-stone-950 transition-colors hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6">
          {renderMobileSectionTitle("Trending Products")}
          <div className="mt-3">
            {trendingProducts.length ? (
              renderMobileProductRows(trendingProducts.slice(0, 5))
            ) : (
              <p className="rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-500">Trending products will appear here soon.</p>
            )}
          </div>
        </section>
      </div>
    );
  }

  function renderMobileTypedSearch() {
    const noResults = suggestions.length === 0;

    return (
      <div className="space-y-5 px-4 py-5">
        {noResults ? (
          <>
            <div className="rounded-xl bg-stone-50 px-4 py-4">
              <p className="text-sm font-bold text-stone-950">No products found</p>
              <p className="mt-1 text-sm leading-5 text-stone-500">Try searching sunscreen, lip tint, mascara, or serum.</p>
            </div>
            <section>
              {renderMobileSectionTitle("Popular Searches")}
              <div className="mt-3 flex flex-wrap gap-2">
                {popularSearches.slice(0, 6).map((item) => renderMobileChip(item, () => goToResults(item)))}
              </div>
            </section>
          </>
        ) : (
          <>
            <section>
              {renderMobileSectionTitle("Product Suggestions")}
              <div className="mt-3">{renderMobileProductRows(suggestions)}</div>
            </section>

            <section>
              {renderMobileSectionTitle("Related Searches")}
              <div className="mt-3 flex flex-wrap gap-2">
                {relatedSearches.map((item) =>
                  renderMobileChip(item, () => {
                    setQuery(item);
                  }),
                )}
              </div>
            </section>

            <button
              type="button"
              onClick={() => goToResults()}
              className="flex min-h-11 w-full items-center justify-between rounded-xl border border-stone-200 bg-white px-4 text-sm font-bold text-stone-950 transition-colors hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
            >
              <span>View all results</span>
              <span className="text-stone-400" aria-hidden="true">
                -&gt;
              </span>
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative z-50 w-full font-sans sm:max-w-[520px] sm:flex-1">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="flex h-9 w-full items-center gap-2.5 rounded-full border border-stone-300 bg-stone-50 px-3.5 text-left text-[13px] font-medium text-stone-500 transition-colors hover:border-stone-400 hover:bg-white sm:hidden"
        aria-label="Open product search"
      >
        <Search className="size-4 shrink-0 text-stone-500" />
        <span>What are you looking for?</span>
      </button>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="hidden h-10 w-full items-center gap-3 rounded-full border border-stone-300 bg-stone-50 px-4 text-left text-sm font-medium text-stone-500 transition-colors hover:border-stone-400 hover:bg-white sm:flex sm:h-11 sm:text-[15px]"
        aria-label="Open product search"
      >
        <Search className="size-5 shrink-0 text-stone-500" />
        <span>What are you looking for?</span>
      </button>

      {mobileOpen && typeof document !== "undefined" ? createPortal(
        <div className="fixed inset-0 z-[120] min-h-dvh overflow-y-auto bg-white">
          <div className="flex min-h-dvh flex-col">
            <div className="flex min-h-16 items-center gap-2 border-b border-stone-100 bg-white px-3 py-2">
              <button
                type="button"
                onClick={closeMobileSearch}
                className="flex size-11 shrink-0 items-center justify-center rounded-full text-stone-950 transition-colors hover:bg-stone-100 hover:text-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
                aria-label="Close search"
              >
                <ChevronLeft className="size-6 stroke-[2.2]" />
              </button>
              <div className="flex h-11 min-w-0 flex-1 items-center rounded-full border border-stone-300 bg-white px-3 transition-colors focus-within:border-stone-950">
                <Search className="size-5 shrink-0 text-stone-500" />
                <input
                  ref={mobileInputRef}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      event.preventDefault();
                      closeMobileSearch();
                    }
                    if (event.key === "Enter") {
                      event.preventDefault();
                      goToResults();
                    }
                  }}
                  className="min-w-0 flex-1 bg-transparent px-2 text-[15px] font-medium text-stone-950 outline-none placeholder:text-stone-500"
                  placeholder="What are you looking for?"
                  aria-label="Search beauty products"
                  type="text"
                  autoComplete="off"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
                    aria-label="Clear search"
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => goToResults()}
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-stone-950 text-white transition-colors hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
                aria-label="Search"
              >
                <Search className="size-5 stroke-[2.3]" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto pb-24">{hasTypedQuery ? renderMobileTypedSearch() : renderMobileDiscovery()}</div>
          </div>
        </div>,
        document.body,
      ) : null}
    </div>
  );
}
