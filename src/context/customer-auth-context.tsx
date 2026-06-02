"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  clearStoredCustomerSession,
  getCustomerMe,
  getStoredCustomerToken,
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  setStoredCustomerSession,
  updateCustomerProfile,
  type Customer,
  type CustomerProfilePayload,
} from "@/lib/customer-auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = LoginPayload & {
  fullName: string;
  phone?: string;
};

type CustomerAuthContextValue = {
  customer: Customer | null;
  token: string | null;
  status: AuthStatus;
  login: (payload: LoginPayload) => Promise<Customer>;
  register: (payload: RegisterPayload) => Promise<Customer>;
  logout: () => Promise<void>;
  refreshCustomer: () => Promise<void>;
  updateProfile: (payload: CustomerProfilePayload) => Promise<Customer>;
};

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const applySession = useCallback((nextToken: string, nextCustomer: Customer) => {
    setStoredCustomerSession(nextToken, nextCustomer);
    setToken(nextToken);
    setCustomer(nextCustomer);
    setStatus("authenticated");
  }, []);

  const clearSession = useCallback(() => {
    clearStoredCustomerSession();
    setToken(null);
    setCustomer(null);
    setStatus("unauthenticated");
  }, []);

  const refreshCustomer = useCallback(async () => {
    const storedToken = getStoredCustomerToken();

    if (!storedToken) {
      clearSession();
      return;
    }

    try {
      const currentCustomer = await getCustomerMe(storedToken);
      applySession(storedToken, currentCustomer);
    } catch {
      clearSession();
    }
  }, [applySession, clearSession]);

  useEffect(() => {
    void Promise.resolve().then(refreshCustomer);
  }, [refreshCustomer]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await loginCustomer(payload);
      applySession(response.token, response.customer);
      return response.customer;
    },
    [applySession],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await registerCustomer(payload);
      applySession(response.token, response.customer);
      return response.customer;
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    const currentToken = token ?? getStoredCustomerToken();
    clearSession();

    if (currentToken) {
      await logoutCustomer(currentToken).catch(() => undefined);
    }
  }, [clearSession, token]);

  const updateProfile = useCallback(
    async (payload: CustomerProfilePayload) => {
      const currentToken = token ?? getStoredCustomerToken();

      if (!currentToken) {
        clearSession();
        throw new Error("Customer login required");
      }

      const response = await updateCustomerProfile(currentToken, payload);
      applySession(currentToken, response.customer);
      return response.customer;
    },
    [applySession, clearSession, token],
  );

  const value = useMemo<CustomerAuthContextValue>(
    () => ({
      customer,
      token,
      status,
      login,
      register,
      logout,
      refreshCustomer,
      updateProfile,
    }),
    [customer, login, logout, refreshCustomer, register, status, token, updateProfile],
  );

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);

  if (!context) {
    throw new Error("useCustomerAuth must be used inside CustomerAuthProvider");
  }

  return context;
}
