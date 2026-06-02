"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, LockKeyhole, MapPin, PackageCheck, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomerAuth } from "@/context/customer-auth-context";
import {
  createCheckoutOrder,
  getCustomerCheckoutState,
  selectDefaultCustomerAddress,
  type CheckoutOrderPayload,
  type CustomerAddress,
  type CustomerOrderDetail,
} from "@/lib/customer-account";
import { clearCheckoutDraft, readCheckoutDraft, type CheckoutDraft } from "@/lib/checkout-draft";

type AddressMode = "saved" | "manual";

type ManualAddressFields = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  area: string;
  landmark: string;
  province: string;
  saveAddress: boolean;
};

const emptyManualFields: ManualAddressFields = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  area: "",
  landmark: "",
  province: "",
  saveAddress: false,
};

const moneyFormatter = new Intl.NumberFormat("en-NP", {
  style: "currency",
  currency: "NPR",
  maximumFractionDigits: 0,
});

function formatMoney(value: number) {
  return moneyFormatter.format(value);
}

function formatAddress(address: CustomerAddress) {
  return [
    address.addressLine1,
    address.addressLine2,
    address.area,
    address.city,
    address.province,
  ]
    .filter(Boolean)
    .join(", ");
}

function profileFields(customer: { fullName: string; phone: string | null } | null): ManualAddressFields {
  return {
    ...emptyManualFields,
    fullName: customer?.fullName ?? "",
    phone: customer?.phone ?? "",
  };
}

export function CheckoutClient() {
  const { customer, status, token } = useCustomerAuth();
  const [draft, setDraft] = useState<CheckoutDraft | null>(() => readCheckoutDraft());
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [addressMode, setAddressMode] = useState<AddressMode>("manual");
  const [manualFields, setManualFields] = useState<ManualAddressFields>(() => profileFields(customer));
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState<CustomerOrderDetail | null>(null);

  const selectedAddress = useMemo(
    () => addresses.find((address) => String(address.id) === selectedAddressId) ?? null,
    [addresses, selectedAddressId],
  );

  useEffect(() => {
    let active = true;

    async function loadCheckoutCustomerState() {
      if (status === "loading") return;

      if (status !== "authenticated" || !token) {
        if (active) {
          setLoadingAccount(false);
          setAddresses([]);
          setSelectedAddressId("");
          setAddressMode("manual");
          setManualFields(profileFields(null));
        }
        return;
      }

      setLoadingAccount(true);
      setError("");

      try {
        const checkoutState = await getCustomerCheckoutState(token);
        if (!active) return;

        const defaultAddress = selectDefaultCustomerAddress(checkoutState.addresses);
        setAddresses(checkoutState.addresses);
        setSelectedAddressId(defaultAddress ? String(defaultAddress.id) : "");
        setAddressMode(defaultAddress ? "saved" : "manual");
        setManualFields(profileFields(checkoutState.customer));
      } catch (checkoutError) {
        if (!active) return;
        setError(checkoutError instanceof Error ? checkoutError.message : "Failed to load customer checkout details");
        setAddresses([]);
        setSelectedAddressId("");
        setAddressMode("manual");
        setManualFields(profileFields(customer));
      } finally {
        if (active) {
          setLoadingAccount(false);
        }
      }
    }

    void loadCheckoutCustomerState();

    return () => {
      active = false;
    };
  }, [customer, status, token]);

  function updateManualField(field: keyof ManualAddressFields, value: string | boolean) {
    setManualFields((currentFields) => ({
      ...currentFields,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft) return;

    setSubmitting(true);
    setError("");

    try {
      const basePayload = {
        items: draft.items,
        subtotal: draft.subtotal,
        deliveryFee: draft.deliveryFee,
        total: draft.total,
        totalItems: draft.totalItems,
        paymentMethod: draft.paymentMethod,
      } satisfies Pick<
        CheckoutOrderPayload,
        "items" | "subtotal" | "deliveryFee" | "total" | "totalItems" | "paymentMethod"
      >;

      const manualAddress = {
        fullName: manualFields.fullName.trim(),
        phone: manualFields.phone.trim(),
        addressLine1: manualFields.addressLine1.trim(),
        addressLine2: manualFields.addressLine2.trim(),
        city: manualFields.city.trim(),
        area: manualFields.area.trim(),
        landmark: manualFields.landmark.trim(),
        province: manualFields.province.trim(),
      };

      if (addressMode === "manual" && (!manualAddress.fullName || !manualAddress.phone || !manualAddress.addressLine1 || !manualAddress.city)) {
        throw new Error("Full name, phone, address line 1, and city are required");
      }

      const payload: CheckoutOrderPayload =
        addressMode === "saved" && selectedAddress
          ? {
              ...basePayload,
              savedAddressId: selectedAddress.id,
            }
          : {
              ...basePayload,
              ...manualAddress,
              saveAddress: status === "authenticated" ? manualFields.saveAddress : false,
            };

      const order = await createCheckoutOrder(payload, token);
      clearCheckoutDraft();
      setDraft(null);
      setPlacedOrder(order);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Order placement failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (placedOrder) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[24px] border border-brandGold/30 bg-white p-6 text-center shadow-[0_18px_45px_rgba(0,69,31,0.08)] sm:p-8">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-brandEmerald">
            <CheckCircle2 className="size-7" aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-2xl font-black text-brandEmerald sm:text-3xl">Order placed</h1>
          <p className="mt-3 text-sm leading-6 text-[#5F5F5F]">
            Your order #{placedOrder.id} has been received. You can track linked orders from your account.
          </p>
          <div className="mt-6 rounded-2xl bg-brandCream/70 px-4 py-4 text-sm text-[#5F5F5F]">
            <div className="flex items-center justify-between gap-4">
              <span>Status</span>
              <span className="font-bold capitalize text-brandEmerald">{placedOrder.status.replaceAll("_", " ")}</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-4">
              <span>Total</span>
              <span className="font-bold text-brandEmerald">{formatMoney(placedOrder.total)}</span>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="h-12 rounded-full bg-brandGreen px-6 text-sm font-bold text-white hover:bg-brandEmerald">
              <Link href="/account">View account</Link>
            </Button>
            <Button asChild className="h-12 rounded-full border border-brandGold/40 bg-white px-6 text-sm font-bold text-brandEmerald hover:bg-brandCream">
              <Link href="/products">Continue shopping</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-6">
        <p className="text-xs font-bold tracking-[0.14em] text-brandGold uppercase">Checkout</p>
        <h1 className="mt-2 text-3xl font-black text-brandEmerald sm:text-4xl">Complete your order</h1>
      </div>

      {!draft ? (
        <div className="rounded-[24px] border border-brandGold/30 bg-white p-6 shadow-[0_18px_45px_rgba(0,69,31,0.08)] sm:p-8">
          <div className="flex size-12 items-center justify-center rounded-full bg-brandCream text-brandEmerald">
            <ShoppingBag className="size-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-2xl font-black text-brandEmerald">No checkout items</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#5F5F5F]">
            Your checkout draft is empty. Add checkout items from a cart or product flow when that feature is connected.
          </p>
          <Button asChild className="mt-6 h-12 rounded-full bg-brandGreen px-6 text-sm font-bold text-white hover:bg-brandEmerald">
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      ) : (
        <form className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]" onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {status === "unauthenticated" ? (
              <div className="rounded-[22px] border border-brandGold/30 bg-white p-5 text-sm text-[#5F5F5F] shadow-[0_12px_35px_rgba(0,69,31,0.06)]">
                <div className="flex gap-3">
                  <LockKeyhole className="mt-0.5 size-5 shrink-0 text-brandEmerald" aria-hidden="true" />
                  <div>
                    <p className="font-bold text-brandEmerald">Login to use saved addresses and track your orders.</p>
                    <Link href="/login" className="mt-2 inline-flex font-bold text-brandEmerald underline underline-offset-4">
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            ) : null}

            <section className="rounded-[24px] border border-brandGold/30 bg-white p-5 shadow-[0_12px_35px_rgba(0,69,31,0.06)] sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-brandCream text-brandEmerald">
                  <MapPin className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-[0.14em] text-brandGold uppercase">Delivery</p>
                  <h2 className="text-xl font-black text-brandEmerald">Delivery details</h2>
                </div>
              </div>

              {loadingAccount ? (
                <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-brandGold/30 bg-brandCream px-4 py-3 text-sm font-bold text-brandEmerald">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Loading checkout details
                </div>
              ) : null}

              {status === "authenticated" && customer ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <label className="grid gap-2 text-sm font-bold text-brandEmerald sm:col-span-1">
                    Full name
                    <Input className="h-12 rounded-2xl border-brandGold/35 bg-white px-4" value={customer.fullName} readOnly />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-brandEmerald sm:col-span-1">
                    Email
                    <Input className="h-12 rounded-2xl border-brandGold/35 bg-white px-4" value={customer.email} readOnly />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-brandEmerald sm:col-span-1">
                    Phone
                    <Input className="h-12 rounded-2xl border-brandGold/35 bg-white px-4" value={customer.phone ?? ""} readOnly />
                  </label>
                </div>
              ) : null}

              {status === "authenticated" && addresses.length > 0 ? (
                <div className="mt-6 grid gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={() => setAddressMode("saved")}
                      className={`h-10 rounded-full px-5 text-sm font-bold ${
                        addressMode === "saved"
                          ? "bg-brandGreen text-white hover:bg-brandEmerald"
                          : "border border-brandGold/40 bg-white text-brandEmerald hover:bg-brandCream"
                      }`}
                    >
                      Saved address
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setAddressMode("manual")}
                      className={`h-10 rounded-full px-5 text-sm font-bold ${
                        addressMode === "manual"
                          ? "bg-brandGreen text-white hover:bg-brandEmerald"
                          : "border border-brandGold/40 bg-white text-brandEmerald hover:bg-brandCream"
                      }`}
                    >
                      New address
                    </Button>
                  </div>

                  {addressMode === "saved" ? (
                    <div className="grid gap-3">
                      {addresses.map((address) => (
                        <label
                          key={address.id}
                          className="flex cursor-pointer gap-3 rounded-[22px] border border-brandGold/30 bg-brandCream/70 p-4 text-sm text-[#5F5F5F]"
                        >
                          <input
                            type="radio"
                            name="savedAddress"
                            value={address.id}
                            checked={selectedAddressId === String(address.id)}
                            onChange={(event) => setSelectedAddressId(event.target.value)}
                            className="mt-1 size-4 shrink-0 accent-brandGreen"
                          />
                          <span>
                            <span className="flex flex-wrap items-center gap-2 font-black text-brandEmerald">
                              {address.fullName}
                              {address.isDefault ? (
                                <span className="rounded-full bg-brandGold/20 px-3 py-1 text-xs font-bold text-brandEmerald">
                                  Default
                                </span>
                              ) : null}
                            </span>
                            <span className="mt-1 block font-bold text-brandEmerald">{address.phone}</span>
                            <span className="mt-2 block leading-6">{formatAddress(address)}</span>
                            {address.landmark ? <span className="mt-1 block">Landmark: {address.landmark}</span> : null}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {addressMode === "manual" || status !== "authenticated" || addresses.length === 0 ? (
                <div className="mt-6 grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-bold text-brandEmerald">
                      Full name
                      <Input
                        type="text"
                        autoComplete="name"
                        value={manualFields.fullName}
                        onChange={(event) => updateManualField("fullName", event.target.value)}
                        className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
                        required={addressMode === "manual"}
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-brandEmerald">
                      Phone
                      <Input
                        type="tel"
                        autoComplete="tel"
                        value={manualFields.phone}
                        onChange={(event) => updateManualField("phone", event.target.value)}
                        className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
                        required={addressMode === "manual"}
                      />
                    </label>
                  </div>

                  <label className="grid gap-2 text-sm font-bold text-brandEmerald">
                    Address line 1
                    <Input
                      type="text"
                      autoComplete="address-line1"
                      value={manualFields.addressLine1}
                      onChange={(event) => updateManualField("addressLine1", event.target.value)}
                      className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
                      required={addressMode === "manual"}
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-bold text-brandEmerald">
                    Address line 2
                    <Input
                      type="text"
                      autoComplete="address-line2"
                      value={manualFields.addressLine2}
                      onChange={(event) => updateManualField("addressLine2", event.target.value)}
                      className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-bold text-brandEmerald">
                      City
                      <Input
                        type="text"
                        autoComplete="address-level2"
                        value={manualFields.city}
                        onChange={(event) => updateManualField("city", event.target.value)}
                        className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
                        required={addressMode === "manual"}
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-brandEmerald">
                      Area
                      <Input
                        type="text"
                        value={manualFields.area}
                        onChange={(event) => updateManualField("area", event.target.value)}
                        className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-bold text-brandEmerald">
                      Landmark
                      <Input
                        type="text"
                        value={manualFields.landmark}
                        onChange={(event) => updateManualField("landmark", event.target.value)}
                        className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-brandEmerald">
                      Province
                      <Input
                        type="text"
                        autoComplete="address-level1"
                        value={manualFields.province}
                        onChange={(event) => updateManualField("province", event.target.value)}
                        className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
                      />
                    </label>
                  </div>

                  {status === "authenticated" ? (
                    <label className="flex items-center gap-3 rounded-2xl bg-brandCream/70 px-4 py-3 text-sm font-bold text-brandEmerald">
                      <input
                        type="checkbox"
                        checked={manualFields.saveAddress}
                        onChange={(event) => updateManualField("saveAddress", event.target.checked)}
                        className="size-4 rounded border-brandGold accent-brandGreen"
                      />
                      Save this address for future orders
                    </label>
                  ) : null}
                </div>
              ) : null}
            </section>

            {error ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            ) : null}
          </div>

          <aside className="h-fit rounded-[24px] border border-brandGold/30 bg-white p-5 shadow-[0_18px_45px_rgba(0,69,31,0.08)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-brandCream text-brandEmerald">
                <PackageCheck className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-brandGold uppercase">Order</p>
                <h2 className="text-xl font-black text-brandEmerald">Summary</h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {draft.items.map((item, index) => (
                <div key={`${item.variantId ?? item.productId ?? item.id}-${index}`} className="flex justify-between gap-4 text-sm">
                  <div>
                    <p className="font-bold text-brandEmerald">{item.name}</p>
                    <p className="mt-1 text-[#5F5F5F]">Qty {item.quantity}</p>
                  </div>
                  <p className="font-bold text-brandEmerald">{formatMoney(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-brandGold/25 pt-5 text-sm text-[#5F5F5F]">
              <div className="flex justify-between gap-4">
                <span>Subtotal</span>
                <span className="font-bold text-brandEmerald">{formatMoney(draft.subtotal)}</span>
              </div>
              <div className="mt-3 flex justify-between gap-4">
                <span>Delivery</span>
                <span className="font-bold text-brandEmerald">{formatMoney(draft.deliveryFee)}</span>
              </div>
              <div className="mt-3 flex justify-between gap-4">
                <span>Payment</span>
                <span className="font-bold text-brandEmerald">Cash on delivery</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-brandGold/25 pt-5">
              <span className="text-base font-black text-brandEmerald">Total</span>
              <span className="text-xl font-black text-brandEmerald">{formatMoney(draft.total)}</span>
            </div>

            <Button
              type="submit"
              disabled={submitting || loadingAccount || (addressMode === "saved" && !selectedAddress)}
              className="mt-6 h-12 w-full rounded-full bg-brandGreen px-6 text-sm font-bold text-white hover:bg-brandEmerald"
            >
              {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
              Place order
            </Button>
          </aside>
        </form>
      )}
    </section>
  );
}
