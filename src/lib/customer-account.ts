import { normalizeProduct } from "@/lib/api";
import { getCustomerMe, getStoredCustomerToken } from "@/lib/customer-auth";
import type { Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://kittikbeauty.com/api";

export type CustomerOrderItem = {
  id: number;
  variantId: number;
  name: string;
  price: number;
  quantity: number;
};

export type CustomerOrderSummary = {
  id: number;
  createdAt: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  totalItems: number;
};

export type CustomerOrderDetail = CustomerOrderSummary & {
  fullName: string;
  phone: string;
  address: string;
  subtotal: number;
  deliveryFee: number;
  items: CustomerOrderItem[];
};

export type CustomerAddress = {
  id: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  area: string | null;
  landmark: string | null;
  province: string | null;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CustomerAddressPayload = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  area?: string;
  landmark?: string;
  province?: string;
  isDefault?: boolean;
};

export type CheckoutOrderItemPayload = {
  id?: number | string;
  productId?: number | string;
  variantId?: number | string;
  name: string;
  price: number;
  quantity: number;
};

export type CheckoutAddressPayload = CustomerAddressPayload & {
  address?: string;
};

export type CheckoutOrderPayload = {
  items: CheckoutOrderItemPayload[];
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  totalItems: number;
  status?: string;
  savedAddressId?: number;
  saveAddress?: boolean;
  isDefault?: boolean;
} & Partial<CheckoutAddressPayload>;

function customerAccountUrl(path: string) {
  return `${API_URL}${path}`;
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Customer account request failed";
    throw new Error(message);
  }

  return payload as T;
}

function customerHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function optionalCustomerHeaders(token?: string | null) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getCustomerOrders(token: string) {
  const response = await fetch(customerAccountUrl("/customers/orders"), {
    headers: customerHeaders(token),
    cache: "no-store",
  });

  const payload = await parseJsonResponse<{ orders: CustomerOrderSummary[] }>(response);
  return payload.orders;
}

export async function getCustomerOrderById(token: string, id: number) {
  const response = await fetch(customerAccountUrl(`/customers/orders/${id}`), {
    headers: customerHeaders(token),
    cache: "no-store",
  });

  const payload = await parseJsonResponse<{ order: CustomerOrderDetail }>(response);
  return payload.order;
}

export async function getCustomerAddresses(token: string) {
  const response = await fetch(customerAccountUrl("/customers/addresses"), {
    headers: customerHeaders(token),
    cache: "no-store",
  });

  const payload = await parseJsonResponse<{ addresses: CustomerAddress[] }>(response);
  return payload.addresses;
}

export async function createCustomerAddress(token: string, payload: CustomerAddressPayload) {
  const response = await fetch(customerAccountUrl("/customers/addresses"), {
    method: "POST",
    headers: customerHeaders(token),
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<{ message: string; address: CustomerAddress }>(response);
}

export async function updateCustomerAddress(token: string, id: number, payload: CustomerAddressPayload) {
  const response = await fetch(customerAccountUrl(`/customers/addresses/${id}`), {
    method: "PATCH",
    headers: customerHeaders(token),
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<{ message: string; address: CustomerAddress }>(response);
}

export async function deleteCustomerAddress(token: string, id: number) {
  const response = await fetch(customerAccountUrl(`/customers/addresses/${id}`), {
    method: "DELETE",
    headers: customerHeaders(token),
  });

  return parseJsonResponse<{ message: string }>(response);
}

export async function setDefaultCustomerAddress(token: string, id: number) {
  const response = await fetch(customerAccountUrl(`/customers/addresses/${id}/default`), {
    method: "PATCH",
    headers: customerHeaders(token),
  });

  return parseJsonResponse<{ message: string; address: CustomerAddress }>(response);
}

export function selectDefaultCustomerAddress(addresses: CustomerAddress[]) {
  return addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;
}

export function normalizeCheckoutAddressPayload(
  address: CustomerAddress | CustomerAddressPayload,
): CheckoutAddressPayload {
  return {
    fullName: address.fullName,
    phone: address.phone,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 ?? undefined,
    city: address.city,
    area: address.area ?? undefined,
    landmark: address.landmark ?? undefined,
    province: address.province ?? undefined,
    isDefault: address.isDefault,
  };
}

export async function getCustomerCheckoutState(token = getStoredCustomerToken()) {
  if (!token) {
    return {
      token: null,
      customer: null,
      addresses: [] as CustomerAddress[],
      defaultAddress: null as CustomerAddress | null,
    };
  }

  const [customer, addresses] = await Promise.all([getCustomerMe(token), getCustomerAddresses(token)]);

  return {
    token,
    customer,
    addresses,
    defaultAddress: selectDefaultCustomerAddress(addresses),
  };
}

export async function createCheckoutOrder(payload: CheckoutOrderPayload, token = getStoredCustomerToken()) {
  const safePayload = { ...payload } as CheckoutOrderPayload & { customerId?: unknown };
  delete safePayload.customerId;

  const response = await fetch(customerAccountUrl("/orders"), {
    method: "POST",
    headers: optionalCustomerHeaders(token),
    body: JSON.stringify(safePayload),
  });

  return parseJsonResponse<CustomerOrderDetail>(response);
}

function normalizeProductList(values: unknown[]) {
  return values.map(normalizeProduct).filter((product): product is Product => Boolean(product));
}

export async function getCustomerWishlist(token: string) {
  const response = await fetch(customerAccountUrl("/customers/wishlist"), {
    headers: customerHeaders(token),
    cache: "no-store",
  });

  const payload = await parseJsonResponse<{ products: unknown[] }>(response);
  return normalizeProductList(payload.products ?? []);
}

export async function addCustomerWishlistItem(token: string, productId: string | number) {
  const response = await fetch(customerAccountUrl("/customers/wishlist"), {
    method: "POST",
    headers: customerHeaders(token),
    body: JSON.stringify({ productId }),
  });

  return parseJsonResponse<{ message: string; productId: number }>(response);
}

export async function deleteCustomerWishlistItem(token: string, productId: string | number) {
  const response = await fetch(customerAccountUrl(`/customers/wishlist/${productId}`), {
    method: "DELETE",
    headers: customerHeaders(token),
  });

  return parseJsonResponse<{ message: string; productId: number }>(response);
}

export async function getCustomerRecentlyViewed(token: string) {
  const response = await fetch(customerAccountUrl("/customers/recently-viewed"), {
    headers: customerHeaders(token),
    cache: "no-store",
  });

  const payload = await parseJsonResponse<{ products: unknown[] }>(response);
  return normalizeProductList(payload.products ?? []);
}

export async function trackCustomerRecentlyViewed(token: string, productId: string | number) {
  const response = await fetch(customerAccountUrl("/customers/recently-viewed"), {
    method: "POST",
    headers: customerHeaders(token),
    body: JSON.stringify({ productId }),
  });

  return parseJsonResponse<{ message: string; productId: number }>(response);
}
