"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sortProducts } from "@/lib/product-utils";
import type { Product } from "@/types/product";

export function ProductListingClient({
  products,
  initialCategory = "all",
  initialSort = "latest",
}: {
  products: Product[];
  initialCategory?: string;
  initialSort?: string;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [visible, setVisible] = useState(24);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.categoryName).filter(Boolean))).sort() as string[];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesSearch = !query || product.name.toLowerCase().includes(query);
      const matchesCategory = category === "all" || product.categoryName === category;
      return matchesSearch && matchesCategory;
    });
    return sortProducts(filtered, sort);
  }, [category, products, search, sort]);

  const shownProducts = filteredProducts.slice(0, visible);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="rounded-lg border border-stone-200 bg-white p-3 shadow-[0_14px_45px_rgba(28,25,23,0.06)] sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-stone-400" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setVisible(24);
              }}
              placeholder="Search products"
              className="h-11 rounded-md border-stone-300 bg-white pl-11 text-base font-medium shadow-none sm:h-[52px] sm:pl-12"
            />
          </div>
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              setVisible(24);
            }}
          >
            <SelectTrigger className="h-11 w-full rounded-md border-stone-300 bg-white px-4 font-medium shadow-none sm:h-[52px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-11 w-full rounded-md border-stone-300 bg-white px-4 font-medium shadow-none sm:h-[52px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="price-asc">Price low to high</SelectItem>
              <SelectItem value="price-desc">Price high to low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-b border-stone-200 pb-3 text-sm font-medium text-stone-500 sm:pb-4">
        <span>{filteredProducts.length} products</span>
      </div>

      {shownProducts.length ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {shownProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      ) : (
        <EmptyState title="No products found" description="Try adjusting your search or filter." />
      )}

      {visible < filteredProducts.length ? (
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="h-11 rounded-md border-stone-950 bg-white px-8 font-bold"
            onClick={() => setVisible((current) => current + 24)}
          >
            Load more
          </Button>
        </div>
      ) : null}
    </div>
  );
}
