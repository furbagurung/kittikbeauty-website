import type { Brand, Category, Product, SubCategory } from "@/types/product";

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

export function subCategorySlug(subCategory: Pick<SubCategory, "name" | "slug">) {
  return slugifyCategory(subCategory.slug || subCategory.name);
}

export function subCategoryHref(category: Pick<Category, "name" | "slug">, subCategory: Pick<SubCategory, "name" | "slug">) {
  return `${categoryHref(category)}/${subCategorySlug(subCategory)}`;
}

export function brandSlug(brand: Pick<Brand, "name" | "slug">) {
  return slugifyCategory(brand.slug || brand.name);
}

export function brandHref(brand: Pick<Brand, "name" | "slug">) {
  return `/products/brands/${brandSlug(brand)}`;
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

export function productMatchesSubCategory(product: Product, subCategory: SubCategory) {
  const subCategoryId = String(subCategory.id);
  const subCategoryName = normalizeCategoryText(subCategory.name);
  const subCategorySlugValue = subCategorySlug(subCategory);

  return Boolean(
    (product.subCategoryId && String(product.subCategoryId) === subCategoryId) ||
      (product.subCategory?.id && String(product.subCategory.id) === subCategoryId) ||
      (product.subCategory?.slug && slugifyCategory(product.subCategory.slug) === subCategorySlugValue) ||
      (product.subCategory?.name && normalizeCategoryText(product.subCategory.name) === subCategoryName) ||
      (product.subCategoryName && normalizeCategoryText(product.subCategoryName) === subCategoryName),
  );
}

export function productMatchesBrand(product: Product, brand: Brand) {
  const brandId = String(brand.id);
  const brandName = normalizeCategoryText(brand.name);
  const brandSlugValue = brandSlug(brand);

  return Boolean(
    (product.brandId && String(product.brandId) === brandId) ||
      (product.brand?.id && String(product.brand.id) === brandId) ||
      (product.brand?.slug && slugifyCategory(product.brand.slug) === brandSlugValue) ||
      (product.brand?.name && normalizeCategoryText(product.brand.name) === brandName) ||
      (product.brandName && normalizeCategoryText(product.brandName) === brandName),
  );
}

export function findCategoryBySlug(categories: Category[], slug: string) {
  const normalizedSlug = slugifyCategory(decodeURIComponent(slug));

  return categories.find((category) => categorySlug(category) === normalizedSlug || slugifyCategory(category.name) === normalizedSlug) ?? null;
}

export function findSubCategoryBySlug(subCategories: SubCategory[], slug: string) {
  const normalizedSlug = slugifyCategory(decodeURIComponent(slug));

  return (
    subCategories.find(
      (subCategory) =>
        subCategorySlug(subCategory) === normalizedSlug ||
        slugifyCategory(subCategory.name) === normalizedSlug,
    ) ?? null
  );
}

export function findBrandBySlug(brands: Brand[], slug: string) {
  const normalizedSlug = slugifyCategory(decodeURIComponent(slug));

  return (
    brands.find(
      (brand) =>
        brandSlug(brand) === normalizedSlug ||
        slugifyCategory(brand.name) === normalizedSlug,
    ) ?? null
  );
}

export function categoryDescription(category: Category) {
  const slug = categorySlug(category);
  return category.description || defaultCategoryDescriptions[slug] || "Explore beauty picks selected for this category.";
}

export function subCategoryDescription(subCategory: SubCategory) {
  return subCategory.description || `Explore ${subCategory.name} products selected for your beauty routine.`;
}

export function brandDescription(brand: Brand) {
  return brand.description || `Shop ${brand.name} beauty products available at Kittik Beauty.`;
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

export type SubCategorySummary = SubCategory & {
  slugValue: string;
  productCount: number;
  image: string | null;
  description: string | null;
};

export type BrandSummary = Brand & {
  slugValue: string;
  productCount: number;
  image: string | null;
  description: string | null;
};

export function buildSubCategorySummaries(subCategories: SubCategory[], products: Product[]): SubCategorySummary[] {
  return subCategories.map((subCategory) => {
    const matchingProducts = products.filter((product) => productMatchesSubCategory(product, subCategory));

    return {
      ...subCategory,
      slugValue: subCategorySlug(subCategory),
      productCount: matchingProducts.length,
      image: subCategory.image || matchingProducts.find((product) => product.image)?.image || null,
      description: subCategoryDescription(subCategory),
    };
  });
}

export function buildBrandSummaries(brands: Brand[], products: Product[]): BrandSummary[] {
  return brands.map((brand) => {
    const matchingProducts = products.filter((product) => productMatchesBrand(product, brand));

    return {
      ...brand,
      slugValue: brandSlug(brand),
      productCount: matchingProducts.length,
      image: brand.logo || brand.image || matchingProducts.find((product) => product.image)?.image || null,
      description: brandDescription(brand),
    };
  });
}
