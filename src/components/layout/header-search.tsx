"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ProductImage } from "@/components/products/product-image";
import { categoryHref } from "@/lib/category-utils";
import { formatPrice, productHref } from "@/lib/product-utils";
import type { Product } from "@/types/product";

type HeaderSearchProps = {
  products: Product[];
};

type SearchSurface = "desktop" | "mobile";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
                    setOpen(false);
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
        </div>
      ) : null}
    </div>
  );
}
