"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Grid2X2,
  Home,
  Menu,
  MessageCircle,
  ShoppingBag,
  X,
} from "lucide-react";

type MobileNavigationProps = {
  navLinks: Array<{ label: string; href: string }>;
  whatsappHref: string;
};

const bottomTabs = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/products", icon: ShoppingBag },
  { label: "Categories", href: "/products/categories", icon: Grid2X2 },
  { label: "Brands", href: "/products/brands", icon: BadgeCheck },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNavigation({ navLinks, whatsappHref }: MobileNavigationProps) {
  const pathname = usePathname();
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

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex size-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-950 transition-colors hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 sm:hidden"
        aria-label="Open navigation menu"
        aria-expanded={open}
      >
        <Menu className="size-5 stroke-[2.2]" aria-hidden="true" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80] sm:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <button
            type="button"
            className="absolute inset-0 bg-stone-950/35"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col bg-white shadow-[24px_0_80px_rgba(28,25,23,0.22)]">
            <div className="flex min-h-16 items-center justify-between border-b border-stone-200 px-4">
              <Link
                href="/"
                className="text-sm font-bold tracking-[0.14em] text-stone-950 uppercase"
                onClick={() => setOpen(false)}
              >
                Kittik Beauty
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-full text-stone-950 transition-colors hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
                aria-label="Close navigation menu"
              >
                <X className="size-5 stroke-[2.2]" aria-hidden="true" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
              <p className="text-[11px] font-bold tracking-[0.14em] text-stone-500 uppercase">
                Browse
              </p>
              <nav className="mt-4 divide-y divide-stone-100 border-y border-stone-100" aria-label="Mobile product categories">
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center justify-between py-3 text-[15px] font-bold text-stone-950 transition-colors hover:text-stone-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-stone-950"
                  >
                    <span>{item.label}</span>
                    <span className="text-stone-300" aria-hidden="true">
                      /
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-[70] border-t border-stone-200 bg-white/95 shadow-[0_-12px_40px_rgba(28,25,23,0.10)] backdrop-blur sm:hidden" aria-label="Mobile bottom navigation">
        <div className="grid grid-cols-5 px-1 pb-[env(safe-area-inset-bottom)]">
          {bottomTabs.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex min-h-[62px] flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-bold tracking-[0.02em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-stone-950 ${
                  active ? "text-stone-950" : "text-stone-500"
                }`}
              >
                <Icon className={`size-5 ${active ? "stroke-[2.5]" : "stroke-[2]"}`} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <Link
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[62px] flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-bold tracking-[0.02em] text-stone-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-stone-950"
          >
            <MessageCircle className="size-5 stroke-[2]" aria-hidden="true" />
            <span>WhatsApp</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
