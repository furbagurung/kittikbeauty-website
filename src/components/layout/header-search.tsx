"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ProductImage } from "@/components/products/product-image";
import { formatPrice, productHref } from "@/lib/product-utils";
import type { Product } from "@/types/product";

type HeaderSearchProps = {
  products: Product[];
};

export function HeaderSearch({ products }: HeaderSearchProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const trimmedDebouncedQuery = debouncedQuery.trim();
  const showDesktopSuggestions = !mobileOpen && open && trimmedDebouncedQuery.length >= 2;
  const showMobileSuggestions = mobileOpen && trimmedDebouncedQuery.length >= 2;

  const suggestions = useMemo(() => {
    const normalizedQuery = trimmedDebouncedQuery.toLowerCase();
    if (normalizedQuery.length < 2) return [];

    return products
      .filter((product) => {
        const name = product.name.toLowerCase();
        const category = product.categoryName?.toLowerCase() ?? "";
        return name.includes(normalizedQuery) || category.includes(normalizedQuery);
      })
      .slice(0, 6);
  }, [products, trimmedDebouncedQuery]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);

    return () => window.clearTimeout(timeout);
  }, [query]);

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

  function clearSearch() {
    setQuery("");
  }

  function goToProducts() {
    setOpen(false);
    setMobileOpen(false);
    router.push("/products");
  }

  function closeMobileSearch() {
    setMobileOpen(false);
    setQuery("");
  }

  function renderSearchInput({ autoFocus = false }: { autoFocus?: boolean } = {}) {
    return (
      <>
        <Search className="size-4 shrink-0 text-stone-500 sm:size-5" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              setOpen(false);
            }
            if (event.key === "Enter") {
              event.preventDefault();
              goToProducts();
            }
          }}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-stone-950 outline-none placeholder:text-stone-500 sm:text-[15px]"
          placeholder="What are you looking for?"
          aria-label="Search beauty products"
          type="text"
          autoComplete="off"
          autoFocus={autoFocus}
        />
        {query ? (
          <button
            type="button"
            onClick={clearSearch}
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-200 hover:text-stone-950"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </>
    );
  }

  const suggestionContent = (
    <>
      {suggestions.length ? (
        <div className="p-2">
          {suggestions.map((product) => (
            <Link
              key={product.slug ?? product.id}
              href={productHref(product)}
              onClick={() => {
                setOpen(false);
                setMobileOpen(false);
              }}
              className="grid grid-cols-[52px_minmax(0,1fr)] gap-3 rounded-xl p-2 transition-colors hover:bg-stone-50"
            >
              <div className="relative size-12 overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
                <ProductImage src={product.image} alt={product.name} sizes="48px" className="object-cover" />
              </div>
              <div className="min-w-0 py-0.5">
                <p className="line-clamp-2 text-sm font-bold leading-snug text-stone-950 sm:line-clamp-1">{product.name}</p>
                <p className="mt-0.5 line-clamp-1 text-xs font-medium text-stone-500">
                  {product.categoryName ?? "Kittik Beauty"}
                </p>
                <p className="mt-1 text-sm font-bold text-stone-950">{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="px-4 py-5">
          <p className="text-sm font-bold text-stone-950">No products found</p>
          <p className="mt-1 text-sm text-stone-500">Try another keyword.</p>
        </div>
      )}

      <button
        type="button"
        onClick={goToProducts}
        className="flex w-full items-center justify-between border-t border-stone-200 px-4 py-3 text-left text-sm font-bold text-stone-950 transition-colors hover:bg-stone-50"
      >
        <span>View all results for &quot;{trimmedDebouncedQuery}&quot;</span>
        <span aria-hidden="true">-&gt;</span>
      </button>
    </>
  );

  return (
    <div ref={containerRef} className="relative z-50 w-full sm:max-w-[520px] sm:flex-1">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="flex h-10 w-full items-center gap-3 rounded-full border border-stone-300 bg-stone-50 px-4 text-left text-sm font-medium text-stone-500 sm:hidden"
        aria-label="Open product search"
      >
        <Search className="size-4 shrink-0 text-stone-500" />
        <span>What are you looking for?</span>
      </button>

      <div className="hidden h-10 w-full items-center gap-3 rounded-full border border-stone-300 bg-stone-50 px-4 text-sm font-medium text-stone-950 transition-colors focus-within:border-stone-950 focus-within:bg-white sm:flex sm:h-11 sm:text-[15px]">
        {renderSearchInput()}
      </div>

      {showDesktopSuggestions ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_24px_70px_rgba(28,25,23,0.16)]">
          {suggestionContent}
        </div>
      ) : null}

      {mobileOpen ? (
        <div className="fixed inset-0 z-[100] bg-white sm:hidden">
          <div className="flex min-h-dvh flex-col">
            <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4">
              <p className="text-sm font-bold tracking-[0.12em] text-stone-950 uppercase">Kittik Beauty</p>
              <button type="button" onClick={closeMobileSearch} className="text-sm font-bold text-stone-950">
                Cancel
              </button>
            </div>
            <div className="border-b border-stone-200 px-4 py-3">
              <div className="flex h-11 w-full items-center gap-3 rounded-full border border-stone-300 bg-stone-50 px-4 text-sm font-medium text-stone-950 focus-within:border-stone-950 focus-within:bg-white">
                {renderSearchInput({ autoFocus: true })}
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              {showMobileSuggestions ? (
                <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_18px_45px_rgba(28,25,23,0.10)]">
                  {suggestionContent}
                </div>
              ) : (
                <div className="py-8 text-sm text-stone-500">Start typing to search beauty products.</div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
