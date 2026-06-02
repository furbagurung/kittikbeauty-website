import type { CheckoutOrderItemPayload } from "@/lib/customer-account";

export const CHECKOUT_DRAFT_STORAGE_KEY = "kittikCheckoutDraft";

export type CheckoutDraft = {
  items: CheckoutOrderItemPayload[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  totalItems: number;
  paymentMethod: "cod";
};

function isBrowser() {
  return typeof window !== "undefined";
}

function toFiniteNumber(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function normalizeItem(item: unknown): CheckoutOrderItemPayload | null {
  if (!item || typeof item !== "object") return null;

  const value = item as Partial<CheckoutOrderItemPayload>;
  const price = toFiniteNumber(value.price);
  const quantity = toFiniteNumber(value.quantity);

  if (!value.name || typeof value.name !== "string" || price === null || quantity === null || quantity <= 0) {
    return null;
  }

  if (value.productId === undefined && value.id === undefined && value.variantId === undefined) {
    return null;
  }

  return {
    id: value.id,
    productId: value.productId,
    variantId: value.variantId,
    name: value.name,
    price,
    quantity,
  };
}

export function normalizeCheckoutDraft(value: unknown): CheckoutDraft | null {
  if (!value || typeof value !== "object") return null;

  const draft = value as Partial<CheckoutDraft>;
  const items = Array.isArray(draft.items) ? draft.items.map(normalizeItem).filter(Boolean) : [];
  const subtotal = toFiniteNumber(draft.subtotal);
  const deliveryFee = toFiniteNumber(draft.deliveryFee);
  const total = toFiniteNumber(draft.total);
  const totalItems = toFiniteNumber(draft.totalItems);

  if (!items.length || subtotal === null || deliveryFee === null || total === null || totalItems === null) {
    return null;
  }

  return {
    items: items as CheckoutOrderItemPayload[],
    subtotal,
    deliveryFee,
    total,
    totalItems,
    paymentMethod: "cod",
  };
}

export function readCheckoutDraft() {
  if (!isBrowser()) return null;

  const storedDraft = window.localStorage.getItem(CHECKOUT_DRAFT_STORAGE_KEY);
  if (!storedDraft) return null;

  try {
    return normalizeCheckoutDraft(JSON.parse(storedDraft));
  } catch {
    return null;
  }
}

export function writeCheckoutDraft(draft: CheckoutDraft) {
  if (!isBrowser()) return;
  window.localStorage.setItem(CHECKOUT_DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export function clearCheckoutDraft() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(CHECKOUT_DRAFT_STORAGE_KEY);
}
