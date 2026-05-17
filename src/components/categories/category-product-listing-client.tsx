"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sortProducts } from "@/lib/product-utils";
import type { Product } from "@/types/product";

export function CategoryProductListingClient({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) => !query || product.name.toLowerCase().includes(query));
    return sortProducts(filtered, sort);
  }, [products, search, sort]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="rounded-lg border border-stone-200 bg-white p-3 shadow-[0_14px_45px_rgba(28,25,23,0.06)] sm:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-stone-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              className="h-11 rounded-md border-stone-300 bg-white pl-11 text-base font-medium shadow-none sm:h-[52px] sm:pl-12"
            />
          </div>
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

      {filteredProducts.length ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
          <h3 className="text-lg font-semibold text-stone-950">No products found in this category.</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">Try another search or browse the full Kittik Beauty catalog.</p>
          <Button asChild className="mt-5 h-11 rounded-md bg-stone-950 px-6 font-bold text-white hover:bg-black">
            <Link href="/products">
              Browse all products
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

