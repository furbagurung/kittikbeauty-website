import type {
  Brand,
  Category,
  PaginatedProducts,
  Product,
  ProductVariant,
  Reel,
  ReelProductTag,
  SubCategory,
} from "@/types/product";
import { productMatchesBrand, productMatchesCategory, productMatchesSubCategory, slugifyCategory } from "@/lib/category-utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://kittikbeauty.com/api";

type UnknownRecord = Record<string, unknown>;

const fallbackCategories: Category[] = [
  { id: "skincare", name: "Skincare", description: "Daily glow essentials" },
  { id: "makeup", name: "Makeup", description: "Soft color and complexion" },
  { id: "haircare", name: "Haircare", description: "Nourishing care rituals" },
  { id: "fragrance", name: "Fragrance", description: "Elegant finishing touches" },
];

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);
  return undefined;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    const stringValue = asString(value);
    if (stringValue) return stringValue;
  }
}

function cleanText(value?: string): string | null {
  if (!value) return null;
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim() || null;
}

function firstNumber(...values: unknown[]): number | null {
  for (const value of values) {
    const numberValue = asNumber(value);
    if (numberValue !== null) return numberValue;
  }
  return null;
}

function absolutizeImage(src?: string | null): string | null {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/")) {
    try {
      return new URL(src, API_URL).toString();
    } catch {
      return src;
    }
  }
  return src;
}

function extractArray(payload: unknown, keys: string[]): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];

  for (const key of keys) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
    if (isRecord(value)) {
      const nested = extractArray(value, keys);
      if (nested.length) return nested;
    }
  }

  return [];
}

function normalizeCategory(value: unknown): Category | null {
  if (typeof value === "string") {
    return { id: value, name: value };
  }
  if (!isRecord(value)) return null;

  const name = firstString(value.name, value.title, value.label, value.categoryName);
  const id = firstString(value.id, value._id, value.slug, name);
  if (!id || !name) return null;

  return {
    id,
    name,
    slug: firstString(value.slug),
    image: absolutizeImage(firstString(value.image, value.imageUrl, value.thumbnail)),
    description: firstString(value.description) ?? null,
  };
}

function normalizeSubCategory(value: unknown): SubCategory | null {
  if (typeof value === "string") {
    return { id: value, name: value };
  }
  if (!isRecord(value)) return null;

  const category = normalizeCategory(value.category);
  const name = firstString(value.name, value.title, value.label, value.subCategoryName);
  const id = firstString(value.id, value._id, value.slug, name);
  if (!id || !name) return null;

  return {
    id,
    name,
    slug: firstString(value.slug),
    image: absolutizeImage(firstString(value.image, value.imageUrl, value.thumbnail)),
    description: firstString(value.description) ?? null,
    categoryId: firstString(value.categoryId, value.category_id, category?.id) ?? null,
    category,
  };
}

function normalizeBrand(value: unknown): Brand | null {
  if (typeof value === "string") {
    return { id: value, name: value };
  }
  if (!isRecord(value)) return null;

  const name = firstString(value.name, value.title, value.label, value.brandName);
  const id = firstString(value.id, value._id, value.slug, name);
  if (!id || !name) return null;

  const logo = absolutizeImage(firstString(value.logo, value.image, value.imageUrl, value.thumbnail));

  return {
    id,
    name,
    slug: firstString(value.slug),
    logo,
    image: logo,
    description: firstString(value.description) ?? null,
  };
}

function normalizeVariant(value: unknown): ProductVariant | null {
  if (!isRecord(value)) return null;
  return {
    id: firstString(value.id, value._id),
    name: firstString(value.name, value.title),
    shade: firstString(value.shade, value.shadeName),
    color: firstString(value.color, value.hex),
    price: firstNumber(value.price, value.salePrice),
    stock: firstNumber(value.stock, value.quantity, value.inventory),
  };
}

function normalizeReelProductTag(value: unknown): ReelProductTag | null {
  if (!isRecord(value)) return null;

  return {
    id: firstString(value.id, value._id),
    productId: firstString(value.productId, value.product_id) ?? null,
    ctaLabel: firstString(value.ctaLabel, value.label) ?? null,
    product: normalizeProduct(value.product),
  };
}

function normalizeReel(value: unknown): Reel | null {
  if (!isRecord(value)) return null;

  const id = firstString(value.id, value._id);
  const title = firstString(value.title, value.name);
  const videoUrl = absolutizeImage(firstString(value.videoUrl, value.video, value.url));

  if (!id || !title || !videoUrl) return null;

  const productTags = extractArray(value.productTags ?? value.product_tags ?? value.reelproducttag, [
    "productTags",
    "data",
    "items",
  ])
    .map(normalizeReelProductTag)
    .filter((tag): tag is ReelProductTag => Boolean(tag));

  return {
    id,
    title,
    caption: cleanText(firstString(value.caption, value.description)),
    videoUrl,
    thumbnailUrl: absolutizeImage(firstString(value.thumbnailUrl, value.thumbnail, value.poster)),
    viewCount: firstNumber(value.viewCount, value.views),
    likeCount: firstNumber(value.likeCount, value.likes),
    productTags,
  };
}

export function normalizeProduct(value: unknown): Product | null {
  if (!isRecord(value)) return null;

  const name = firstString(value.name, value.title, value.productName);
  const id = firstString(value.id, value._id, value.slug, value.productId);
  if (!id || !name) return null;

  const category = normalizeCategory(value.category ?? value.categories);
  const subCategory = normalizeSubCategory(value.subCategory ?? value.subcategory);
  const brand = normalizeBrand(value.brand);
  const rawImages = [
    value.image,
    value.imageUrl,
    value.thumbnail,
    value.coverImage,
    ...(Array.isArray(value.images) ? value.images : []),
    ...(Array.isArray(value.gallery) ? value.gallery : []),
  ];
  const images = rawImages
    .map((image) => {
      if (isRecord(image)) {
        return absolutizeImage(firstString(image.url, image.src, image.imageUrl));
      }
      return absolutizeImage(firstString(image));
    })
    .filter((image): image is string => Boolean(image));

  const variants = (Array.isArray(value.variants) ? value.variants : [])
    .map(normalizeVariant)
    .filter((variant): variant is ProductVariant => Boolean(variant));

  return {
    id,
    name,
    slug: firstString(value.slug),
    description: cleanText(firstString(value.description, value.shortDescription)),
    category,
    categoryId: firstString(value.categoryId, value.category_id, value.categoryID, category?.id) ?? null,
    categoryName: category?.name ?? firstString(value.categoryName, value.category) ?? null,
    subCategory,
    subCategoryId:
      firstString(value.subCategoryId, value.subcategoryId, value.sub_category_id, subCategory?.id) ?? null,
    subCategoryName: subCategory?.name ?? firstString(value.subCategoryName, value.subcategoryName, value.subCategory) ?? null,
    brand,
    brandId: firstString(value.brandId, value.brand_id, brand?.id) ?? null,
    brandName: brand?.name ?? firstString(value.brandName, value.brand) ?? null,
    price: firstNumber(value.price, value.salePrice, value.finalPrice, value.mrp),
    compareAtPrice: firstNumber(value.compareAtPrice, value.regularPrice, value.mrp),
    stock: firstNumber(value.stock, value.quantity, value.inventory),
    status: firstString(value.status, value.stockStatus) ?? null,
    image: images[0] ?? null,
    images,
    variants,
    createdAt: firstString(value.createdAt, value.updatedAt) ?? null,
  };
}

async function fetchJson(path: string): Promise<unknown> {
  const timeoutSignal = AbortSignal.timeout(8000);
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
    signal: timeoutSignal,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function getProducts(page = 1, limit = 12): Promise<PaginatedProducts> {
  try {
    const payload = await fetchJson(`/products?page=${page}&limit=${limit}`);
    const rawProducts = extractArray(payload, ["products", "data", "items", "results"]);
    const products = rawProducts.map(normalizeProduct).filter((product): product is Product => Boolean(product));
    const meta = isRecord(payload) ? payload : {};
    const total = firstNumber(meta.total, meta.count, meta.totalItems) ?? products.length;
    const totalPages = firstNumber(meta.totalPages, meta.pages) ?? Math.max(1, Math.ceil(total / limit));

    return { products, total, page, limit, totalPages };
  } catch {
    return { products: [], total: 0, page, limit, totalPages: 1 };
  }
}

export async function getProductsByCategory(category: Category, limit = 50): Promise<Product[]> {
  try {
    const payload = await fetchJson(`/products?page=1&limit=${limit}&category=${encodeURIComponent(category.name)}`);
    const rawProducts = extractArray(payload, ["products", "data", "items", "results"]);
    const products = rawProducts.map(normalizeProduct).filter((product): product is Product => Boolean(product));
    const matchingProducts = products.filter((product) => productMatchesCategory(product, category));

    if (!products.length || matchingProducts.length) {
      return matchingProducts;
    }
  } catch {
    // Fall back to a broad product fetch below.
  }

  const { products } = await getProducts(1, Math.max(limit, 100));
  return products.filter((product) => productMatchesCategory(product, category));
}

export async function getProductsBySubCategory(
  category: Category,
  subCategory: SubCategory,
  limit = 100,
): Promise<Product[]> {
  const { products } = await getProducts(1, Math.max(limit, 100));

  return products.filter(
    (product) => productMatchesCategory(product, category) && productMatchesSubCategory(product, subCategory),
  );
}

export async function getProductsByBrand(brand: Brand, limit = 100): Promise<Product[]> {
  const { products } = await getProducts(1, Math.max(limit, 100));

  return products.filter((product) => productMatchesBrand(product, brand));
}

export async function getCategories(): Promise<Category[]> {
  try {
    const payload = await fetchJson("/categories");
    const categories = extractArray(payload, ["categories", "data", "items", "results"])
      .map(normalizeCategory)
      .filter((category): category is Category => Boolean(category));

    return categories.length ? categories : fallbackCategories;
  } catch {
    const { products } = await getProducts(1, 100);
    const categoriesByKey = new Map<string, Category>();

    for (const product of products) {
      const name = product.category?.name ?? product.categoryName;
      if (!name) continue;

      const slug = product.category?.slug ? slugifyCategory(product.category.slug) : slugifyCategory(name);
      if (!slug || categoriesByKey.has(slug)) continue;

      categoriesByKey.set(slug, {
        id: product.categoryId || product.category?.id || slug,
        name,
        slug,
        image: product.category?.image || product.image || null,
        description: product.category?.description ?? null,
      });
    }

    return categoriesByKey.size ? Array.from(categoriesByKey.values()) : fallbackCategories;
  }
}

export async function getSubCategories(): Promise<SubCategory[]> {
  try {
    const payload = await fetchJson("/sub-categories");
    return extractArray(payload, ["subCategories", "subcategories", "data", "items", "results"])
      .map(normalizeSubCategory)
      .filter((subCategory): subCategory is SubCategory => Boolean(subCategory));
  } catch {
    return [];
  }
}

export async function getBrands(): Promise<Brand[]> {
  try {
    const payload = await fetchJson("/brands");
    return extractArray(payload, ["brands", "data", "items", "results"])
      .map(normalizeBrand)
      .filter((brand): brand is Brand => Boolean(brand));
  } catch {
    return [];
  }
}

export async function getReels(limit = 8): Promise<Reel[]> {
  try {
    const payload = await fetchJson(`/reels?page=1&limit=${limit}`);
    return extractArray(payload, ["reels", "data", "items", "results"])
      .map(normalizeReel)
      .filter((reel): reel is Reel => Boolean(reel));
  } catch {
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const payload = await fetchJson(`/products/${encodeURIComponent(id)}`);
    const product = normalizeProduct(isRecord(payload) && "data" in payload ? payload.data : payload);
    if (product) return product;
  } catch {
    // Fall back to a list lookup below.
  }

  const { products } = await getProducts(1, 100);
  return products.find((product) => product.id === id || product.slug === id) ?? null;
}
