"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, ChevronDown, ChevronLeft, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ProductImage } from "@/components/products/product-image";
import { formatPrice, productHref } from "@/lib/product-utils";
import type { Product } from "@/types/product";

type HeaderSearchProps = {
  products: Product[];
};

type SearchSurface = "desktop" | "mobile";

const popularSearches = ["Sunscreen", "Lip tint", "Mascara", "Serum", "Eyeliner", "Blush", "Moisturizer", "Foundation"];

const mobileDiscoverySearches = [
  "Sunscreen For Daily Use",
  "Lip Tint For Everyday",
  "Waterproof Mascara",
  "Face Serum",
  "Eyeliner",
  "Blush",
  "Moisturizer",
  "Foundation",
  "Makeup Brushes",
  "Hair Care",
];

const categoryShortcuts = [
  { label: "Makeup", href: "/products?category=Makeup" },
  { label: "Skincare", href: "/products?category=Skincare" },
  { label: "Haircare", href: "/products?category=Haircare" },
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
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDiscoveryExpanded, setMobileDiscoveryExpanded] = useState(false);
  const trimmedQuery = query.trim();
  const hasTypedQuery = trimmedQuery.length > 0;
  const showDesktopPanel = !mobileOpen && open;

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
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const timeout = window.setTimeout(() => {
      mobileInputRef.current?.focus();
    }, 50);

    return () => window.clearTimeout(timeout);
  }, [mobileOpen]);

  function clearSearch() {
    setQuery("");
    setOpen(true);
  }

  function closePanels() {
    setOpen(false);
    setMobileOpen(false);
  }

  function closeMobileSearch() {
    setOpen(false);
    setMobileOpen(false);
    setMobileDiscoveryExpanded(false);
    setQuery("");
  }

  function goToResults(searchQuery = trimmedQuery) {
    closePanels();
    const nextQuery = searchQuery.trim();
    router.push(nextQuery ? `/products?search=${encodeURIComponent(nextQuery)}` : "/products");
  }

  function applySearchChip(searchQuery: string, surface: SearchSurface) {
    setQuery(searchQuery);
    setOpen(surface === "desktop");
    if (surface === "desktop") {
      desktopInputRef.current?.focus();
    } else {
      mobileInputRef.current?.focus();
    }
  }

  function renderSearchInput(surface: SearchSurface) {
    const inputRef = surface === "desktop" ? desktopInputRef : mobileInputRef;

    return (
      <>
        <Search className="size-4 shrink-0 text-stone-500 sm:size-5" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              closePanels();
            }
            if (event.key === "Enter") {
              event.preventDefault();
              goToResults();
            }
          }}
          className="min-w-0 flex-1 bg-transparent font-sans text-sm font-medium text-stone-950 outline-none placeholder:text-stone-500 sm:text-[15px]"
          placeholder="What are you looking for?"
          aria-label="Search beauty products"
          type="text"
          autoComplete="off"
        />
        {query ? (
          <button
            type="button"
            onClick={clearSearch}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-200 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </>
    );
  }

  function renderProductResult(product: Product, surface: SearchSurface) {
    const isMobile = surface === "mobile";

    return (
      <Link
        key={product.slug ?? product.id}
        href={productHref(product)}
        onClick={closePanels}
        className="grid grid-cols-[48px_minmax(0,1fr)] gap-3 rounded-xl p-2 transition-colors hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 sm:grid-cols-[56px_minmax(0,1fr)]"
      >
        <div className="relative size-12 overflow-hidden rounded-xl border border-stone-200 bg-stone-50 sm:size-14">
          <ProductImage src={product.image} alt={product.name} sizes={isMobile ? "48px" : "56px"} className="object-cover" />
        </div>
        <div className="min-w-0 self-center">
          <p className="line-clamp-2 text-sm font-bold leading-snug text-stone-950 sm:line-clamp-1">{product.name}</p>
          <p className="mt-0.5 line-clamp-1 text-xs font-medium text-stone-500">{product.categoryName ?? "Kittik Beauty"}</p>
          <p className="mt-1 text-sm font-bold text-stone-950">{formatPrice(product.price)}</p>
        </div>
      </Link>
    );
  }

  function renderSectionTitle(title: string) {
    return <p className="px-1 text-xs font-bold tracking-[0.14em] text-stone-500 uppercase">{title}</p>;
  }

  function renderPopularChips(surface: SearchSurface) {
    return (
      <div className="flex flex-wrap gap-2">
        {popularSearches.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => applySearchChip(item, surface)}
            className="min-h-10 rounded-full border border-stone-200 bg-stone-50 px-4 text-sm font-bold text-stone-800 transition-colors hover:border-stone-950 hover:bg-white hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
          >
            {item}
          </button>
        ))}
      </div>
    );
  }

  function renderCategoryShortcuts() {
    return (
      <div className="grid grid-cols-2 gap-2">
        {categoryShortcuts.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={closePanels}
            className="flex min-h-12 items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 text-sm font-bold text-stone-950 transition-colors hover:border-stone-950 hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
          >
            <span>{item.label}</span>
            <span className="text-stone-400" aria-hidden="true">
              -&gt;
            </span>
          </Link>
        ))}
      </div>
    );
  }

  function renderTrendingProducts(surface: SearchSurface) {
    return trendingProducts.length ? (
      <div className="space-y-1">{trendingProducts.slice(0, surface === "mobile" ? 6 : 4).map((product) => renderProductResult(product, surface))}</div>
    ) : (
      <p className="px-1 py-3 text-sm text-stone-500">Trending products will appear here soon.</p>
    );
  }

  function renderRelatedSearches(surface: SearchSurface) {
    return (
      <div className="space-y-1">
        {relatedSearches.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => applySearchChip(item, surface)}
            className="flex min-h-10 w-full items-center justify-between rounded-xl px-2 text-left text-sm font-bold text-stone-800 transition-colors hover:bg-stone-50 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
          >
            <span>{item}</span>
            <span className="text-stone-400" aria-hidden="true">
              -&gt;
            </span>
          </button>
        ))}
      </div>
    );
  }

  function renderEmptyState(surface: SearchSurface) {
    return (
      <div className="space-y-5 p-4 sm:p-5">
        <section className="space-y-3">
          {renderSectionTitle("Popular Searches")}
          {renderPopularChips(surface)}
        </section>
        <section className="space-y-3">
          {renderSectionTitle("Shop by Category")}
          {renderCategoryShortcuts()}
        </section>
        <section className="space-y-3">
          {renderSectionTitle("Trending Products")}
          {renderTrendingProducts(surface)}
        </section>
      </div>
    );
  }

  function renderTypedState(surface: SearchSurface) {
    const noResults = suggestions.length === 0;

    return (
      <>
        <div className="space-y-5 p-4 sm:p-5">
          {noResults ? (
            <section className="space-y-3">
              <div className="rounded-2xl bg-stone-50 px-4 py-5">
                <p className="text-sm font-bold text-stone-950">No products found for &quot;{trimmedQuery}&quot;</p>
                <p className="mt-1 text-sm text-stone-500">
                  {surface === "mobile" ? "Try another keyword." : "Try searching for sunscreen, lip tint, mascara, or serum."}
                </p>
              </div>
              {renderPopularChips(surface)}
            </section>
          ) : (
            <section className="space-y-3">
              {renderSectionTitle("Product Suggestions")}
              <div className="space-y-1">{suggestions.map((product) => renderProductResult(product, surface))}</div>
            </section>
          )}

          <section className="space-y-2">
            {renderSectionTitle("Related Searches")}
            {renderRelatedSearches(surface)}
          </section>
        </div>

        <button
          type="button"
          onClick={() => goToResults()}
          className="flex w-full items-center justify-between border-t border-stone-200 px-5 py-4 text-left text-sm font-bold text-stone-950 transition-colors hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-stone-950"
        >
          <span>View all results for &quot;{trimmedQuery}&quot;</span>
          <span aria-hidden="true">-&gt;</span>
        </button>
      </>
    );
  }

  function renderSearchContent(surface: SearchSurface) {
    return hasTypedQuery ? renderTypedState(surface) : renderEmptyState(surface);
  }

  function renderMobileDiscovery() {
    const visibleSearches = mobileDiscoveryExpanded ? mobileDiscoverySearches : mobileDiscoverySearches.slice(0, 6);

    return (
      <section className="px-5 pt-8">
        <h2 className="text-[26px] font-bold leading-none tracking-tight text-stone-950">Search Discovery</h2>
        <div className="mt-7 flex flex-wrap gap-3">
          {visibleSearches.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => goToResults(item)}
              className="min-h-14 rounded bg-stone-50 px-6 text-left text-[22px] font-medium leading-tight text-stone-950 transition-colors hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
            >
              {item}
            </button>
          ))}
          {!mobileDiscoveryExpanded ? (
            <button
              type="button"
              onClick={() => setMobileDiscoveryExpanded(true)}
              className="inline-flex min-h-14 items-center gap-2 rounded bg-white px-6 text-[22px] font-medium leading-tight text-stone-950 transition-colors hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
            >
              More
              <ChevronDown className="size-5 text-stone-500" />
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  function renderMobileTypedSearch() {
    const noResults = suggestions.length === 0;

    return (
      <div className="px-5 pt-8">
        {noResults ? (
          <section>
            <h2 className="text-[26px] font-bold leading-none tracking-tight text-stone-950">Search Discovery</h2>
            <div className="mt-5 rounded bg-stone-50 px-4 py-5">
              <p className="text-[17px] font-bold text-stone-950">No products found for &quot;{trimmedQuery}&quot;</p>
              <p className="mt-1 text-sm text-stone-500">Try another keyword.</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {mobileDiscoverySearches.slice(0, 6).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => goToResults(item)}
                  className="min-h-12 rounded bg-stone-50 px-5 text-left text-lg font-medium leading-tight text-stone-950 transition-colors hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section>
            <h2 className="text-[26px] font-bold leading-none tracking-tight text-stone-950">Product Suggestions</h2>
            <div className="mt-5 space-y-2">{suggestions.map((product) => renderProductResult(product, "mobile"))}</div>
            <button
              type="button"
              onClick={() => goToResults()}
              className="mt-5 flex min-h-12 w-full items-center justify-center rounded bg-stone-950 px-5 text-base font-bold text-white transition-colors hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
            >
              View all results
            </button>
          </section>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative z-50 w-full font-sans sm:max-w-[520px] sm:flex-1">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="flex h-10 w-full items-center gap-3 rounded-full border border-stone-300 bg-stone-50 px-4 text-left text-sm font-medium text-stone-500 transition-colors hover:border-stone-400 hover:bg-white sm:hidden"
        aria-label="Open product search"
      >
        <Search className="size-4 shrink-0 text-stone-500" />
        <span>What are you looking for?</span>
      </button>

      <div className="hidden h-10 w-full items-center gap-3 rounded-full border border-stone-300 bg-stone-50 px-4 text-sm font-medium text-stone-950 transition-colors focus-within:border-stone-950 focus-within:bg-white sm:flex sm:h-11 sm:text-[15px]">
        {renderSearchInput("desktop")}
      </div>

      {showDesktopPanel ? (
        <div className="absolute left-1/2 top-full z-[90] mt-3 max-h-[min(72vh,720px)] w-[min(680px,calc(100vw-32px))] -translate-x-1/2 overflow-y-auto rounded-2xl border border-stone-200 bg-white shadow-[0_28px_80px_rgba(28,25,23,0.18)]">
          {renderSearchContent("desktop")}
        </div>
      ) : null}

      {mobileOpen ? (
        <div className="fixed inset-0 z-[100] bg-white sm:hidden">
          <div className="flex min-h-dvh flex-col">
            <div className="flex items-center gap-3 px-3 pt-5">
              <button
                type="button"
                onClick={closeMobileSearch}
                className="flex size-12 shrink-0 items-center justify-center text-stone-950 transition-colors hover:text-stone-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
                aria-label="Close search"
              >
                <ChevronLeft className="size-10 stroke-[2.4]" />
              </button>
              <div className="flex h-16 min-w-0 flex-1 overflow-hidden rounded-[14px] border-[3px] border-stone-950 bg-white min-[420px]:h-[72px]">
                <input
                  ref={mobileInputRef}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setOpen(true);
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
                  className="min-w-0 flex-1 bg-transparent px-4 text-[19px] font-medium text-stone-950 outline-none placeholder:text-stone-400 min-[420px]:px-5 min-[420px]:text-[22px]"
                  placeholder="Search beauty products"
                  aria-label="Search beauty products"
                  type="text"
                  autoComplete="off"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="flex w-11 shrink-0 items-center justify-center text-stone-500 transition-colors hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-stone-950"
                    aria-label="Clear search"
                  >
                    <X className="size-6" />
                  </button>
                ) : null}
                <button
                  type="button"
                  className="flex w-12 shrink-0 items-center justify-center text-stone-400 transition-colors hover:text-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-stone-950 min-[420px]:w-14"
                  aria-label="Search by image"
                >
                  <Camera className="size-8 stroke-[2.3]" />
                </button>
                <button
                  type="button"
                  onClick={() => goToResults()}
                  className="m-1 flex w-14 shrink-0 items-center justify-center rounded-[9px] bg-black text-white transition-colors hover:bg-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-white min-[420px]:w-16"
                  aria-label="Search"
                >
                  <Search className="size-8 stroke-[2.6] min-[420px]:size-9" />
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto pb-24">{hasTypedQuery ? renderMobileTypedSearch() : renderMobileDiscovery()}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
