"use client";

import { FormEvent, useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomerAuth } from "@/context/customer-auth-context";
import { changeCustomerPassword } from "@/lib/customer-auth";

export function AccountPasswordForm() {
  const { token } = useCustomerAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Customer login required");
      return;
    }

    setSubmitting(true);

    try {
      await changeCustomerPassword(token, {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password changed");
    } catch (passwordError) {
      setError(passwordError instanceof Error ? passwordError.message : "Password change failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="rounded-[24px] border border-brandGold/30 bg-white p-5 shadow-[0_12px_35px_rgba(0,69,31,0.06)] sm:p-6">
      <p className="text-xs font-bold tracking-[0.14em] text-brandGold uppercase">
        Security
      </p>
      <h2 className="mt-2 text-xl font-black text-brandEmerald">Change password</h2>

      <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-bold text-brandEmerald">
          Current password
          <Input
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-brandEmerald">
          New password
          <Input
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
            minLength={8}
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-brandEmerald">
          Confirm password
          <Input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
            minLength={8}
            required
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
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
          Change password
        </Button>
      </form>
    </article>
  );
}
