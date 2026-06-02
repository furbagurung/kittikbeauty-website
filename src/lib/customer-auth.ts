const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://kittikbeauty.com/api";
const CUSTOMER_TOKEN_KEY = "kittikCustomerToken";
const CUSTOMER_KEY = "kittikCustomer";

export type Customer = {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: "customer" | string;
  status: "active" | string;
  createdAt?: string;
  updatedAt?: string;
};

export type CustomerAuthResponse = {
  message: string;
  token: string;
  customer: Customer;
};

type CustomerAuthPayload = {
  fullName?: string;
  email: string;
  phone?: string;
  password: string;
};

export type CustomerProfilePayload = {
  fullName: string;
  phone?: string;
};

export type CustomerPasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function customerAuthUrl(path: string) {
  return `${API_URL}${path}`;
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Customer auth request failed";
    throw new Error(message);
  }

  return payload as T;
}

export function getStoredCustomerToken() {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(CUSTOMER_TOKEN_KEY);
}

export function getStoredCustomer() {
  if (!isBrowser()) return null;

  const storedCustomer = window.localStorage.getItem(CUSTOMER_KEY);
  if (!storedCustomer) return null;

  try {
    return JSON.parse(storedCustomer) as Customer;
  } catch {
    return null;
  }
}

export function setStoredCustomerSession(token: string, customer: Customer) {
  if (!isBrowser()) return;
  window.localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  window.localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
}

export function clearStoredCustomerSession() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(CUSTOMER_TOKEN_KEY);
  window.localStorage.removeItem(CUSTOMER_KEY);
}

export async function registerCustomer(payload: CustomerAuthPayload) {
  const response = await fetch(customerAuthUrl("/customers/register"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<CustomerAuthResponse>(response);
}

export async function loginCustomer(payload: CustomerAuthPayload) {
  const response = await fetch(customerAuthUrl("/customers/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
    }),
  });

  return parseJsonResponse<CustomerAuthResponse>(response);
}

export async function getCustomerMe(token: string) {
  const response = await fetch(customerAuthUrl("/customers/me"), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const payload = await parseJsonResponse<{ customer: Customer }>(response);
  return payload.customer;
}

export async function logoutCustomer(token: string) {
  const response = await fetch(customerAuthUrl("/customers/logout"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return parseJsonResponse<{ message: string }>(response);
}

export async function updateCustomerProfile(token: string, payload: CustomerProfilePayload) {
  const response = await fetch(customerAuthUrl("/customers/profile"), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<{ message: string; customer: Customer }>(response);
}

export async function changeCustomerPassword(token: string, payload: CustomerPasswordPayload) {
  const response = await fetch(customerAuthUrl("/customers/change-password"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<{ message: string }>(response);
}
