"use client";

import { FormEvent, useState } from "react";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CustomerAddress, CustomerAddressPayload } from "@/lib/customer-account";

type AddressFormProps = {
  address?: CustomerAddress | null;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (payload: CustomerAddressPayload) => Promise<void>;
};

export function AddressForm({ address, submitting, onCancel, onSubmit }: AddressFormProps) {
  const [fullName, setFullName] = useState(address?.fullName ?? "");
  const [phone, setPhone] = useState(address?.phone ?? "");
  const [addressLine1, setAddressLine1] = useState(address?.addressLine1 ?? "");
  const [addressLine2, setAddressLine2] = useState(address?.addressLine2 ?? "");
  const [city, setCity] = useState(address?.city ?? "");
  const [area, setArea] = useState(address?.area ?? "");
  const [landmark, setLandmark] = useState(address?.landmark ?? "");
  const [province, setProvince] = useState(address?.province ?? "");
  const [isDefault, setIsDefault] = useState(address?.isDefault ?? false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      area,
      landmark,
      province,
      isDefault,
    });
  }

  return (
    <form className="grid gap-4 rounded-[22px] border border-brandGold/30 bg-brandCream/70 p-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
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
          Phone
          <Input
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
            required
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-brandEmerald">
        Address line 1
        <Input
          type="text"
          autoComplete="address-line1"
          value={addressLine1}
          onChange={(event) => setAddressLine1(event.target.value)}
          className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
          required
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-brandEmerald">
        Address line 2
        <Input
          type="text"
          autoComplete="address-line2"
          value={addressLine2}
          onChange={(event) => setAddressLine2(event.target.value)}
          className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-brandEmerald">
          City
          <Input
            type="text"
            autoComplete="address-level2"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-brandEmerald">
          Area
          <Input
            type="text"
            value={area}
            onChange={(event) => setArea(event.target.value)}
            className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-brandEmerald">
          Landmark
          <Input
            type="text"
            value={landmark}
            onChange={(event) => setLandmark(event.target.value)}
            className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-brandEmerald">
          Province
          <Input
            type="text"
            autoComplete="address-level1"
            value={province}
            onChange={(event) => setProvince(event.target.value)}
            className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
          />
        </label>
      </div>

      <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-brandEmerald">
        <input
          type="checkbox"
          checked={isDefault}
          onChange={(event) => setIsDefault(event.target.checked)}
          className="size-4 rounded border-brandGold"
        />
        Set as default address
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="submit"
          disabled={submitting}
          className="h-12 rounded-full bg-brandGreen px-6 text-base font-bold text-white hover:bg-brandEmerald"
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {address ? "Save address" : "Add address"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="h-12 rounded-full border border-brandGold/40 bg-white px-6 text-base font-bold text-brandEmerald hover:bg-brandCream"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
