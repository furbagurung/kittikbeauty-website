"use client";

import { useCallback, useEffect, useState } from "react";
import { Edit, Loader2, MapPin, Plus, Star, Trash2 } from "lucide-react";

import { AddressForm } from "@/components/account/address-form";
import { Button } from "@/components/ui/button";
import { useCustomerAuth } from "@/context/customer-auth-context";
import {
  createCustomerAddress,
  deleteCustomerAddress,
  getCustomerAddresses,
  setDefaultCustomerAddress,
  updateCustomerAddress,
  type CustomerAddress,
  type CustomerAddressPayload,
} from "@/lib/customer-account";

type FormMode = "create" | "edit" | null;

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

export function AccountAddresses() {
  const { token } = useCustomerAuth();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadAddresses = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      setAddresses(await getCustomerAddresses(token));
    } catch (addressesError) {
      setError(addressesError instanceof Error ? addressesError.message : "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let active = true;

    async function loadInitialAddresses() {
      if (!token) return;

      try {
        const nextAddresses = await getCustomerAddresses(token);
        if (active) {
          setAddresses(nextAddresses);
        }
      } catch (addressesError) {
        if (active) {
          setError(addressesError instanceof Error ? addressesError.message : "Failed to load addresses");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadInitialAddresses();

    return () => {
      active = false;
    };
  }, [token]);

  function openCreateForm() {
    setFormMode("create");
    setEditingAddress(null);
    setError("");
    setMessage("");
  }

  function openEditForm(address: CustomerAddress) {
    setFormMode("edit");
    setEditingAddress(address);
    setError("");
    setMessage("");
  }

  function closeForm() {
    setFormMode(null);
    setEditingAddress(null);
  }

  async function handleSubmit(payload: CustomerAddressPayload) {
    if (!token) return;

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      if (formMode === "edit" && editingAddress) {
        await updateCustomerAddress(token, editingAddress.id, payload);
        setMessage("Address updated");
      } else {
        await createCustomerAddress(token, payload);
        setMessage("Address added");
      }

      closeForm();
      await loadAddresses();
    } catch (addressError) {
      setError(addressError instanceof Error ? addressError.message : "Address save failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(addressId: number) {
    if (!token) return;

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await deleteCustomerAddress(token, addressId);
      setMessage("Address deleted");
      await loadAddresses();
    } catch (addressError) {
      setError(addressError instanceof Error ? addressError.message : "Address delete failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSetDefault(addressId: number) {
    if (!token) return;

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await setDefaultCustomerAddress(token, addressId);
      setMessage("Default address updated");
      await loadAddresses();
    } catch (addressError) {
      setError(addressError instanceof Error ? addressError.message : "Default address update failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-[24px] border border-brandGold/30 bg-white p-5 shadow-[0_12px_35px_rgba(0,69,31,0.06)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-brandGold uppercase">
            Saved Addresses
          </p>
          <h2 className="mt-2 text-xl font-black text-brandEmerald">Delivery addresses</h2>
        </div>
        <Button
          type="button"
          onClick={openCreateForm}
          className="h-11 rounded-full bg-brandGreen px-5 text-sm font-bold text-white hover:bg-brandEmerald"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add address
        </Button>
      </div>

      {loading ? (
        <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-brandGold/30 bg-brandCream px-4 py-3 text-sm font-bold text-brandEmerald">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Loading addresses
        </div>
      ) : null}

      {error ? (
        <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          {message}
        </p>
      ) : null}

      {formMode ? (
        <div className="mt-5">
          <AddressForm
            key={editingAddress?.id ?? "new"}
            address={editingAddress}
            submitting={submitting}
            onCancel={closeForm}
            onSubmit={handleSubmit}
          />
        </div>
      ) : null}

      {!loading && addresses.length === 0 && !formMode ? (
        <p className="mt-5 rounded-2xl bg-brandCream/70 px-4 py-4 text-sm leading-6 text-[#5F5F5F]">
          Add a delivery address now so checkout can use it in a future phase.
        </p>
      ) : null}

      <div className="mt-5 grid gap-4">
        {addresses.map((address) => (
          <article
            key={address.id}
            className="rounded-[22px] border border-brandGold/30 bg-brandCream/70 p-4"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-brandEmerald">
                  <MapPin className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-brandEmerald">{address.fullName}</h3>
                    {address.isDefault ? (
                      <span className="rounded-full bg-brandGold/20 px-3 py-1 text-xs font-bold text-brandEmerald">
                        Default
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm font-bold text-brandEmerald">{address.phone}</p>
                  <p className="mt-2 text-sm leading-6 text-[#5F5F5F]">{formatAddress(address)}</p>
                  {address.landmark ? (
                    <p className="mt-1 text-sm text-[#5F5F5F]">Landmark: {address.landmark}</p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {!address.isDefault ? (
                  <Button
                    type="button"
                    onClick={() => void handleSetDefault(address.id)}
                    disabled={submitting}
                    className="h-10 rounded-full border border-brandGold/40 bg-white px-4 text-sm font-bold text-brandEmerald hover:bg-brandCream"
                  >
                    <Star className="size-4" aria-hidden="true" />
                    Default
                  </Button>
                ) : null}
                <Button
                  type="button"
                  onClick={() => openEditForm(address)}
                  disabled={submitting}
                  className="h-10 rounded-full border border-brandGold/40 bg-white px-4 text-sm font-bold text-brandEmerald hover:bg-brandCream"
                >
                  <Edit className="size-4" aria-hidden="true" />
                  Edit
                </Button>
                <Button
                  type="button"
                  onClick={() => void handleDelete(address.id)}
                  disabled={submitting}
                  className="h-10 rounded-full border border-red-200 bg-white px-4 text-sm font-bold text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Delete
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
