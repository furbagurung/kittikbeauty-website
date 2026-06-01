"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomerAuth } from "@/context/customer-auth-context";

export function RegisterForm() {
  const router = useRouter();
  const { register, status } = useCustomerAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/account");
    }
  }, [router, status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      await register({ fullName, email, phone, password });
      router.replace("/account");
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-brandCream">
      <div className="mx-auto flex min-h-[calc(100vh-220px)] w-full max-w-[1180px] items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-brandGold/30 bg-white shadow-[0_24px_70px_rgba(0,69,31,0.10)] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="hidden bg-brandGreen p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-brandGold uppercase">
                Customer Account
              </p>
              <h1 className="mt-4 text-4xl font-black leading-tight">
                Create your Kittik Beauty account
              </h1>
            </div>
            <p className="max-w-sm text-sm leading-6 text-white/75">
              Register once and use the same account foundation for future order history, wishlist, saved addresses, reviews, loyalty, and OTP login.
            </p>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-md">
              <p className="text-xs font-bold tracking-[0.14em] text-brandGold uppercase lg:hidden">
                Customer Account
              </p>
              <h1 className="mt-2 text-3xl font-black leading-tight text-brandEmerald lg:hidden">
                Create your Kittik Beauty account
              </h1>
              <h2 className="hidden text-2xl font-black text-brandEmerald lg:block">
                Register
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#5F5F5F]">
                Add your details to create a customer account.
              </p>

              <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
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
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-brandEmerald">
                  Phone optional
                  <Input
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="h-12 rounded-2xl border-brandGold/35 bg-white px-4"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-brandEmerald">
                    Password
                    <Input
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
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
                </div>

                {error ? (
                  <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {error}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 h-12 rounded-full bg-brandGreen px-6 text-base font-bold text-white hover:bg-brandEmerald"
                >
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                  Create account
                  {!submitting ? <ArrowRight className="size-4" /> : null}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-[#5F5F5F]">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-brandEmerald underline-offset-4 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
