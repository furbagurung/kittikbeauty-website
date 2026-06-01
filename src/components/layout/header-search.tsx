"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ProductImage } from "@/components/products/product-image";
import { categoryHref } from "@/lib/category-utils";
import { formatPrice, productHref } from "@/lib/product-utils";
import type { Product } from "@/types/product";

type HeaderSearchProps = {
  products: Product[];
};

const popularSearches = ["perfume", "lip", "lipstick", "liner", "foundation", "o.two.o", "serum", "mascara", "sunscreen"];
const recentSearchesStorageKey = "kittik_recent_searches";
const maxRecentSearches = 5;

const categoryShortcuts = [
  { label: "Makeup", href: categoryHref({ name: "Makeup" }) },
  { label: "Skincare", href: categoryHref({ name: "Skincare" }) },
  { label: "Haircare", href: categoryHref({ name: "Haircare" }) },
  { label: "New Arrivals", href: "/products?sort=latest" },
];

function productKey(product: Product) {
  return product.id || product.slug || product.name;
}

function uniqueProducts(productsToDedupe: Product[]) {
  const seen = new Set<string>();

  return productsToDedupe.filter((product) => {
    const key = productKey(product);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

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

function normalizeRecentSearches(value: unknown) {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const nextSearches: string[] = [];

  for (const item of value) {
    if (typeof item !== "string") continue;

    const nextItem = item.trim();
    const normalizedItem = nextItem.toLowerCase();

    if (!nextItem || seen.has(normalizedItem)) continue;

    seen.add(normalizedItem);
    nextSearches.push(nextItem);

    if (nextSearches.length === maxRecentSearches) break;
  }

  return nextSearches;
}

function saveRecentSearches(nextSearches: string[]) {
  if (typeof window === "undefined") return;

  try {
    if (nextSearches.length) {
      window.localStorage.setItem(recentSearchesStorageKey, JSON.stringify(nextSearches));
    } else {
      window.localStorage.removeItem(recentSearchesStorageKey);
    }
  } catch {
    // Ignore storage failures so private browsing or quota limits never break search.
  }
}

export function HeaderSearch({ products }: HeaderSearchProps) {
  const router = useRouter();
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const productRailRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const trimmedQuery = query.trim();
  const hasTypedQuery = trimmedQuery.length > 0;

  const trendingProducts = useMemo(() => uniqueProducts([...products]).slice(0, 10), [products]);

  const suggestions = useMemo(() => {
    const normalizedQuery = trimmedQuery.toLowerCase();
    if (!normalizedQuery) return [];

    const filteredProducts = [...products]
      .filter((product) => {
        const searchable = [
          product.name,
          product.categoryName,
          product.subCategoryName,
          product.brandName,
          product.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(normalizedQuery);
      })
      .slice(0, 12);

    return uniqueProducts(filteredProducts);
  }, [products, trimmedQuery]);

  const recommendedProducts = useMemo(
    () => (hasTypedQuery ? suggestions : trendingProducts),
    [hasTypedQuery, suggestions, trendingProducts],
  );
  const relatedSearches = useMemo(() => (hasTypedQuery ? buildRelatedSearches(trimmedQuery) : []), [hasTypedQuery, trimmedQuery]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedSearches = window.localStorage.getItem(recentSearchesStorageKey);
      if (!savedSearches) return;

      const nextSearches = normalizeRecentSearches(JSON.parse(savedSearches));
      setRecentSearches(nextSearches);
      saveRecentSearches(nextSearches);
    } catch {
      setRecentSearches([]);
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDesktopOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!desktopOpen) return;

    const timeout = window.setTimeout(() => {
      desktopInputRef.current?.focus();
    }, 50);

    return () => window.clearTimeout(timeout);
  }, [desktopOpen]);

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
    setDesktopOpen(false);
    setMobileOpen(false);
  }

  function closeDesktopSearch() {
    setDesktopOpen(false);
  }

  function closeMobileSearch() {
    setMobileOpen(false);
    setQuery("");
  }

  function openDesktopSearch() {
    setMobileOpen(false);
    setDesktopOpen(true);
  }

  function openMobileSearch() {
    setDesktopOpen(false);
    setMobileOpen(true);
  }

  function rememberSearch(searchQuery: string) {
    const nextQuery = searchQuery.trim();
    if (!nextQuery) return;

    setRecentSearches((current) => {
      const nextSearches = [
        nextQuery,
        ...current.filter((item) => item.toLowerCase() !== nextQuery.toLowerCase()),
      ].slice(0, maxRecentSearches);

      saveRecentSearches(nextSearches);
      return nextSearches;
    });
  }

  function goToResults(searchQuery = trimmedQuery) {
    closePanels();
    const nextQuery = searchQuery.trim();
    rememberSearch(nextQuery);
    router.push(nextQuery ? `/products?search=${encodeURIComponent(nextQuery)}` : "/products");
  }

  function removeRecentSearch(label: string) {
    setRecentSearches((current) => {
      const nextSearches = current.filter((item) => item !== label);
      saveRecentSearches(nextSearches);
      return nextSearches;
    });
  }

  function clearRecentSearches() {
    setRecentSearches([]);
    saveRecentSearches([]);
  }

  function selectRecentSearch(searchQuery: string) {
    const nextQuery = searchQuery.trim();
    if (!nextQuery) return;

    setQuery(nextQuery);
    rememberSearch(nextQuery);
  }

  function handleDesktopProductClick() {
    rememberSearch(trimmedQuery);
    closePanels();
  }

  function scrollRecommended(direction: "left" | "right") {
    productRailRef.current?.scrollBy({
      left: direction === "left" ? -420 : 420,
      behavior: "smooth",
    });
  }

  function renderMobileChip(label: string, onClick: () => void) {
    return (
      <button
        key={label}
        type="button"
        onClick={onClick}
        className="min-h-9 rounded-full bg-brandCream px-4 text-[13px] font-semibold leading-none text-brandEmerald transition-colors hover:bg-[#F3E7C3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandGold"
      >
        {label}
      </button>
    );
  }

  function renderMobileSectionTitle(title: string) {
    return <h3 className="text-[13px] font-bold tracking-[0.08em] text-[#5F5F5F] uppercase">{title}</h3>;
  }

  function renderMobileProductRows(productsToShow: Product[]) {
    return (
      <div className="divide-y divide-brandGold/15 rounded-xl border border-brandGold/20 bg-white">
        {uniqueProducts(productsToShow).map((product) => (
          <Link
            key={productKey(product)}
            href={productHref(product)}
            onClick={closePanels}
            className="grid min-h-[68px] grid-cols-[48px_minmax(0,1fr)] gap-3 px-3 py-2.5 transition-colors hover:bg-brandCream focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brandGold"
          >
            <div className="relative size-12 overflow-hidden rounded-lg border border-brandGold/25 bg-brandCream">
              <ProductImage src={product.image} alt={product.name} sizes="48px" className="object-cover" />
            </div>
            <div className="min-w-0 self-center">
              <p className="line-clamp-1 text-[13px] font-bold leading-5 text-[#111111]">{product.name}</p>
              <div className="mt-0.5 flex min-w-0 items-center gap-2">
                <p className="line-clamp-1 min-w-0 text-xs font-medium text-[#5F5F5F]">{product.categoryName ?? "Kittik Beauty"}</p>
                <span className="size-1 shrink-0 rounded-full bg-brandGold" />
                <p className="shrink-0 text-xs font-bold text-brandEmerald">{formatPrice(product.price)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  function renderDesktopSearchProduct(product: Product) {
    const hasDiscount =
      typeof product.compareAtPrice === "number" &&
      typeof product.price === "number" &&
      product.compareAtPrice > product.price;

    return (
      <article className="w-[174px] shrink-0">
        <Link
          href={productHref(product)}
          onClick={handleDesktopProductClick}
          className="block h-full rounded-md border border-[#E5DED3] bg-white transition-colors hover:border-brandGold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandGold"
        >
          <div className="relative mx-auto mt-4 aspect-square w-[132px] overflow-hidden bg-[#FAF7F0]">
            <ProductImage
              src={product.image}
              alt={product.name}
              sizes="132px"
              className="object-cover transition-transform duration-300 hover:scale-[1.025]"
            />
          </div>
          <div className="px-4 pb-4 pt-3">
            <p className="line-clamp-2 min-h-10 text-[13px] font-medium leading-5 text-[#222222]">{product.name}</p>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              {hasDiscount ? (
                <span className="text-xs font-medium text-[#777777] line-through tabular-nums">
                  {formatPrice(product.compareAtPrice)}
                </span>
              ) : null}
              <span className={hasDiscount ? "text-[13px] font-bold text-brandEmerald tabular-nums" : "text-[13px] font-bold text-[#111111] tabular-nums"}>
                {formatPrice(product.price)}
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  function renderDesktopDropdown() {
    return typeof document !== "undefined" ? createPortal(
      <div className="fixed inset-0 z-[120] hidden sm:block">
        <button
          type="button"
          aria-label="Close search"
          onClick={closeDesktopSearch}
          className="absolute inset-0 bg-black/65"
        />
        <div className="absolute left-0 right-0 top-0 max-h-[430px] overflow-hidden border-b border-brandGold/25 bg-white text-[#111111] shadow-[0_16px_34px_rgba(0,0,0,0.08)]">
          <div className="mx-auto max-w-[1920px] px-8 pb-10 pt-5">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                goToResults();
              }}
              className="flex h-10 items-center gap-4 border-b border-brandGold pb-3"
            >
              <Search className="size-5 shrink-0 text-[#111111]" />
              <input
                ref={desktopInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-[#111111] outline-none placeholder:text-[#777777]"
                placeholder="Search..."
                aria-label="Search beauty products"
                type="text"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={closeDesktopSearch}
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#666666] transition hover:bg-brandCream hover:text-brandEmerald focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandGold"
                aria-label="Close search"
              >
                <X className="size-6" />
              </button>
            </form>

            <div className="mt-3 flex min-h-8 flex-wrap items-center gap-2 text-[13px]">
              <span className="mr-1 font-medium text-[#555555]">Latest searches:</span>
              {recentSearches.map((item) => (
                <span
                  key={item}
                  className="inline-flex h-7 items-center gap-2 rounded-full border border-[#CFC8BD] bg-white pl-3 pr-2 text-xs font-medium text-[#555555]"
                >
                  <button
                    type="button"
                    onClick={() => selectRecentSearch(item)}
                    className="transition hover:text-brandEmerald"
                  >
                    {item}
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeRecentSearch(item);
                    }}
                    className="flex size-4 items-center justify-center rounded-full text-[#777777] transition hover:bg-brandCream hover:text-brandEmerald"
                    aria-label={`Remove ${item}`}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              {!recentSearches.length ? (
                <span className="text-xs font-medium text-[#777777]">No recent searches yet</span>
              ) : null}
              {recentSearches.length ? (
                <button
                  type="button"
                  onClick={clearRecentSearches}
                  className="ml-1 text-xs font-medium text-brandEmerald underline-offset-4 transition hover:text-brandGreen hover:underline"
                >
                  Delete all
                </button>
              ) : null}
            </div>

            <div className="mt-7 grid grid-cols-[140px_minmax(0,1fr)] gap-8">
              <section>
                <h3 className="text-[15px] font-bold text-[#111111]">Popular searches</h3>
                <div className="mt-3 flex flex-col items-start gap-2.5">
                  {popularSearches.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setQuery(item);
                        goToResults(item);
                      }}
                      className="text-left text-[13px] font-medium text-[#444444] transition hover:text-brandEmerald focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandGold"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </section>

              <section className="min-w-0">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-[15px] font-bold text-[#111111]">Recommended products</h3>
                  {recommendedProducts.length > 4 ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => scrollRecommended("left")}
                        className="flex size-8 items-center justify-center rounded-full text-brandEmerald transition hover:bg-brandCream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandGold"
                        aria-label="Scroll recommended products left"
                      >
                        <ChevronLeft className="size-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollRecommended("right")}
                        className="flex size-8 items-center justify-center rounded-full text-brandEmerald transition hover:bg-brandCream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandGold"
                        aria-label="Scroll recommended products right"
                      >
                        <ChevronRight className="size-5" />
                      </button>
                    </div>
                  ) : null}
                </div>

                {recommendedProducts.length ? (
                  <div
                    ref={productRailRef}
                    className="no-scrollbar flex max-w-full gap-3 overflow-x-auto overscroll-x-contain scroll-smooth pb-2"
                  >
                    {recommendedProducts.map((product) => (
                      <Fragment key={productKey(product)}>
                        {renderDesktopSearchProduct(product)}
                      </Fragment>
                    ))}
                  </div>
                ) : (
                  <div className="border border-[#E8E0D2] bg-brandCream px-5 py-8">
                    <p className="text-sm font-bold text-brandEmerald">No products found</p>
                    <p className="mt-1 text-sm text-[#5F5F5F]">Try another keyword or choose a popular search.</p>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>,
      document.body,
    ) : null;
  }

  function renderMobileDiscovery() {
    return (
      <div className="px-4 py-5">
        <h2 className="text-[22px] font-bold leading-tight tracking-tight text-brandEmerald">Search Discovery</h2>

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
                className="flex min-h-10 items-center rounded-xl border border-brandGold/25 bg-white px-3 text-[13px] font-bold text-brandEmerald transition-colors hover:bg-brandCream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandGold"
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
              <p className="rounded-xl bg-brandCream px-4 py-3 text-sm text-[#5F5F5F]">Trending products will appear here soon.</p>
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
            <div className="rounded-xl bg-brandCream px-4 py-4">
              <p className="text-sm font-bold text-brandEmerald">No products found</p>
              <p className="mt-1 text-sm leading-5 text-[#5F5F5F]">Try searching sunscreen, lip tint, mascara, or serum.</p>
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
              <div className="mt-3">{renderMobileProductRows(suggestions.slice(0, 6))}</div>
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
              className="flex min-h-11 w-full items-center justify-between rounded-xl border border-brandGold/25 bg-white px-4 text-sm font-bold text-brandEmerald transition-colors hover:bg-brandCream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandGold"
            >
              <span>View all results</span>
              <span className="text-brandGold" aria-hidden="true">
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
        onClick={openMobileSearch}
        className="flex h-9 w-full items-center gap-2.5 rounded-full border border-brandGold/35 bg-brandCream px-3.5 text-left text-[13px] font-medium text-[#5F5F5F] transition-colors hover:border-brandGold hover:bg-white sm:hidden"
        aria-label="Open product search"
      >
        <Search className="size-4 shrink-0 text-brandEmerald" />
        <span>What are you looking for?</span>
      </button>

      <button
        type="button"
        onClick={openDesktopSearch}
        className="hidden h-10 w-full items-center gap-3 rounded-full border border-brandGold/35 bg-brandCream px-4 text-left text-sm font-medium text-[#5F5F5F] transition-colors hover:border-brandGold hover:bg-white sm:flex sm:h-11 sm:text-[15px]"
        aria-label="Open product search"
        aria-expanded={desktopOpen}
      >
        <Search className="size-5 shrink-0 text-brandEmerald" />
        <span className="line-clamp-1">{trimmedQuery || "What are you looking for?"}</span>
      </button>

      {desktopOpen ? renderDesktopDropdown() : null}

      {mobileOpen && typeof document !== "undefined" ? createPortal(
        <div className="fixed inset-0 z-[120] min-h-dvh overflow-y-auto bg-white">
          <div className="flex min-h-dvh flex-col">
            <div className="flex min-h-16 items-center gap-2 border-b border-brandGold/20 bg-white px-3 py-2">
              <button
                type="button"
                onClick={closeMobileSearch}
                className="flex size-11 shrink-0 items-center justify-center rounded-full text-brandEmerald transition-colors hover:bg-brandCream hover:text-brandGreen focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandGold"
                aria-label="Close search"
              >
                <ChevronLeft className="size-6 stroke-[2.2]" />
              </button>
              <div className="flex h-11 min-w-0 flex-1 items-center rounded-full border border-brandGold/35 bg-white px-3 transition-colors focus-within:border-brandGreen">
                <Search className="size-5 shrink-0 text-brandEmerald" />
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
                  className="min-w-0 flex-1 bg-transparent px-2 text-[15px] font-medium text-[#111111] outline-none placeholder:text-[#5F5F5F]"
                  placeholder="What are you looking for?"
                  aria-label="Search beauty products"
                  type="text"
                  autoComplete="off"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#5F5F5F] transition-colors hover:bg-brandCream hover:text-brandEmerald focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandGold"
                    aria-label="Clear search"
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => goToResults()}
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brandGreen text-white transition-colors hover:bg-brandEmerald focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandGold"
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
