"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Grid2X2,
  Home,
  Menu,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";

import { CustomerMobileAccountTab } from "@/components/layout/customer-account-link";

type MobileNavigationProps = {
  navLinks: Array<{ label: string; href: string }>;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNavigation({ navLinks }: MobileNavigationProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const drawer = open ? (
    <div className="fixed inset-0 z-[100] sm:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <button
        type="button"
        className="fixed inset-0 z-[100] bg-black/40"
        onClick={() => setOpen(false)}
        aria-label="Close navigation menu"
      />
      <div className="fixed left-0 top-0 z-[110] flex h-dvh min-h-screen w-[85vw] max-w-[360px] flex-col overflow-y-auto bg-white shadow-[24px_0_80px_rgba(0,69,31,0.18)]">
        <div className="flex min-h-16 shrink-0 items-center justify-between border-b border-brandGold/25 px-4">
          <Link
            href="/"
            className="rounded-full bg-brandGreen px-3.5 py-2 text-sm font-black tracking-[0.08em] text-white uppercase"
            onClick={() => setOpen(false)}
          >
            Kittik Beauty
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex size-10 items-center justify-center rounded-full text-brandEmerald transition-colors hover:bg-brandCream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandGold"
            aria-label="Close navigation menu"
          >
            <X className="size-5 stroke-[2.2]" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
          <p className="text-[11px] font-bold tracking-[0.14em] text-[#5F5F5F] uppercase">
            Browse
          </p>
          <nav className="mt-4 grid gap-2" aria-label="Mobile product categories">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-between rounded-2xl border border-brandGold/25 bg-white px-4 py-3 text-[15px] font-bold text-brandEmerald transition-colors hover:bg-brandCream focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brandGold"
              >
                <span>{item.label}</span>
                <span className="text-brandGold" aria-hidden="true">
                  /
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex size-10 items-center justify-center rounded-full border border-brandGold/35 bg-white text-brandEmerald transition-colors hover:bg-brandCream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandGold sm:hidden"
        aria-label="Open navigation menu"
        aria-expanded={open}
      >
        <Menu className="size-5 stroke-[2.2]" aria-hidden="true" />
      </button>

      {drawer && typeof document !== "undefined" ? createPortal(drawer, document.body) : null}
    </>
  );
}

export function MobileBottomNavigation({ whatsappHref }: { whatsappHref: string }) {
  const pathname = usePathname();
  const bottomTabs = [
    { label: "Home", href: "/", icon: Home },
    { label: "Categories", href: "/products/categories", icon: Grid2X2 },
    { label: "Search", href: "/products", icon: Search },
    { label: "Cart", href: whatsappHref, icon: ShoppingBag, external: true },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[90] h-[calc(72px+env(safe-area-inset-bottom))] border-t border-brandGold/25 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_40px_rgba(0,69,31,0.10)] sm:hidden"
      aria-label="Mobile bottom navigation"
    >
      <div className="grid h-[72px] grid-cols-5 px-1">
        {bottomTabs.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={`flex min-h-[66px] flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-bold tracking-[0.02em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brandGold ${
                active ? "bg-brandCream text-brandGreen" : "text-[#5F5F5F]"
              }`}
            >
              <Icon className={`size-5 ${active ? "stroke-[2.5]" : "stroke-[2]"}`} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <CustomerMobileAccountTab />
      </div>
    </nav>
  );
}
