export type Category = {
  id: string;
  name: string;
  slug?: string;
  image?: string | null;
  description?: string | null;
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
