import type { Product } from "@/types/product";

export function slugifyProductTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function productSlug(product: Pick<Product, "id" | "name" | "slug">) {
  return product.slug || slugifyProductTitle(product.name) || product.id;
}

export function formatPrice(price?: number | null) {
  if (price === null || price === undefined) return "Price on request";
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function productHref(product: Product) {
  return `/products/${encodeURIComponent(productSlug(product))}`;
}

export function stockLabel(product: Product) {
  if (product.status) return product.status;
  if (typeof product.stock === "number") {
    return product.stock > 0 ? "In stock" : "Out of stock";
  }
  return "Availability on request";
}

export function sortProducts(products: Product[], sort: string) {
  const sorted = [...products];
  if (sort === "price-asc") {
    return sorted.sort((a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER));
  }
  if (sort === "price-desc") {
    return sorted.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
  }
  return sorted.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
}
