export type Category = {
  id: string;
  name: string;
  slug?: string;
  image?: string | null;
  description?: string | null;
};

export type SubCategory = {
  id: string;
  name: string;
  slug?: string;
  image?: string | null;
  description?: string | null;
  categoryId?: string | null;
  category?: Category | null;
};

export type Brand = {
  id: string;
  name: string;
  slug?: string;
  logo?: string | null;
  image?: string | null;
  description?: string | null;
};

export type Banner = {
  id: string;
  image: string | null;
  title?: string | null;
  subtitle?: string | null;
  cta?: string | null;
  link?: string | null;
  isActive?: boolean | null;
  order?: number | null;
};

export type ProductVariant = {
  id?: string;
  name?: string;
  shade?: string;
  color?: string;
  price?: number | null;
  stock?: number | null;
};

export type Product = {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  category?: Category | null;
  categoryId?: string | null;
  categoryName?: string | null;
  subCategory?: SubCategory | null;
  subCategoryId?: string | null;
  subCategoryName?: string | null;
  brand?: Brand | null;
  brandId?: string | null;
  brandName?: string | null;
  price?: number | null;
  compareAtPrice?: number | null;
  stock?: number | null;
  status?: string | null;
  image?: string | null;
  images: string[];
  variants: ProductVariant[];
  createdAt?: string | null;
};

export type PaginatedProducts = {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ReelProductTag = {
  id?: string;
  productId?: string | null;
  ctaLabel?: string | null;
  product?: Product | null;
};

export type Reel = {
  id: string;
  title: string;
  caption?: string | null;
  videoUrl: string;
  thumbnailUrl?: string | null;
  viewCount?: number | null;
  likeCount?: number | null;
  productTags: ReelProductTag[];
};
