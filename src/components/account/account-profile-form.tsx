"use client";

import { FormEvent, useState } from "react";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomerAuth } from "@/context/customer-auth-context";
import type { Customer } from "@/lib/customer-auth";

type AccountProfileFormProps = {
  customer: Customer;
};

export function AccountProfileForm({ customer }: AccountProfileFormProps) {
  const { updateProfile } = useCustomerAuth();
  const [fullName, setFullName] = useState(customer.fullName);
  const [phone, setPhone] = useState(customer.phone ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      const updatedCustomer = await updateProfile({ fullName, phone });
      setFullName(updatedCustomer.fullName);
      setPhone(updatedCustomer.phone ?? "");
      setMessage("Profile updated");
    } catch (profileError) {
      setError(profileError instanceof Error ? profileError.message : "Profile update failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="rounded-[24px] border border-brandGold/30 bg-white p-5 shadow-[0_12px_35px_rgba(0,69,31,0.06)] sm:p-6">
      <p className="text-xs font-bold tracking-[0.14em] text-brandGold uppercase">
        Profile
      </p>
      <h2 className="mt-2 text-xl font-black text-brandEmerald">Manage profile</h2>

      <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-bold text-brandEmerald">
          Full name
          <Input
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-brandEmerald">
          Email
          <Input
            type="email"
            value={customer.email}
            className="h-12 rounded-2xl border-brandGold/35 bg-brandCream/70 px-4 font-semibold text-[#5F5F5F]"
            disabled
            readOnly
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-brandEmerald">
          Phone
          <Input
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
          />
        </label>

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {message}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={submitting}
          className="mt-1 h-12 rounded-full bg-brandGreen px-6 text-base font-bold text-white hover:bg-brandEmerald"
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save profile
        </Button>
      </form>
    </article>
  );
}
