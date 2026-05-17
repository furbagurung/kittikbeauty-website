import type { Category, Product } from "@/types/product";

export type CategorySummary = Category & {
  slugValue: string;
  productCount: number;
  image: string | null;
  description: string | null;
};

const defaultCategoryDescriptions: Record<string, string> = {
  makeup: "Complexion, lips, eyes, and color for polished everyday looks.",
  skincare: "Cleansers, creams, serums, and treatments for daily care.",
  haircare: "Shampoo, masks, oils, and styling care for healthy hair.",
  "hair-care": "Shampoo, masks, oils, and styling care for healthy hair.",
  hair: "Shampoo, masks, oils, and styling care for healthy hair.",
  fragrance: "Fragrance picks and finishing touches for every mood.",
  perfume: "Fragrance picks and finishing touches for every mood.",
  "tools-and-brushes": "Brushes, applicators, and tools for precise beauty routines.",
  "tools-brushes": "Brushes, applicators, and tools for precise beauty routines.",
  "bath-and-body": "Body care, bath essentials, and soft daily comfort.",
  "bath-body": "Body care, bath essentials, and soft daily comfort.",
  "mini-size": "Travel-friendly beauty and compact essentials to try now.",
  "sale-and-offers": "Limited deals and offers across beauty favorites.",
  "sale-offers": "Limited deals and offers across beauty favorites.",
};

export function slugifyCategory(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeCategoryText(value?: string | null) {
  return slugifyCategory(value ?? "").replace(/-/g, " ");
}

export function categorySlug(category: Pick<Category, "name" | "slug">) {
  return slugifyCategory(category.slug || category.name);
}

export function categoryHref(category: Pick<Category, "name" | "slug">) {
  return `/products/categories/${categorySlug(category)}`;
}

export function productMatchesCategory(product: Product, category: Category) {
  const categoryId = String(category.id);
  const categoryName = normalizeCategoryText(category.name);
  const categorySlugValue = categorySlug(category);

  return Boolean(
    (product.categoryId && String(product.categoryId) === categoryId) ||
      (product.category?.id && String(product.category.id) === categoryId) ||
      (product.category?.slug && slugifyCategory(product.category.slug) === categorySlugValue) ||
      (product.category?.name && normalizeCategoryText(product.category.name) === categoryName) ||
      (product.categoryName && normalizeCategoryText(product.categoryName) === categoryName),
  );
}

export function findCategoryBySlug(categories: Category[], slug: string) {
  const normalizedSlug = slugifyCategory(decodeURIComponent(slug));

  return categories.find((category) => categorySlug(category) === normalizedSlug || slugifyCategory(category.name) === normalizedSlug) ?? null;
}

export function categoryDescription(category: Category) {
  const slug = categorySlug(category);
  return category.description || defaultCategoryDescriptions[slug] || "Explore beauty picks selected for this category.";
}

export function buildCategorySummaries(categories: Category[], products: Product[]): CategorySummary[] {
  return categories.map((category) => {
    const matchingProducts = products.filter((product) => productMatchesCategory(product, category));

    return {
      ...category,
      slugValue: categorySlug(category),
      productCount: matchingProducts.length,
      image: category.image || matchingProducts.find((product) => product.image)?.image || null,
      description: categoryDescription(category),
    };
  });
}
