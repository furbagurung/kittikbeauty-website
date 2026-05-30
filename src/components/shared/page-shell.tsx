import type { ReactNode } from "react";

import { MobileBottomNavigation } from "@/components/layout/mobile-navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { createWhatsappLink } from "@/lib/whatsapp";

export function PageShell({ children }: { children: ReactNode }) {
  const whatsappHref = createWhatsappLink("Hi, I want to ask about Kittik Beauty products.");

  return (
    <div className="flex min-h-screen flex-col bg-white text-stone-950">
      <SiteHeader />
      <main className="flex-1 pb-[calc(112px+env(safe-area-inset-bottom))] sm:pb-0">{children}</main>
      <SiteFooter />
      <MobileBottomNavigation whatsappHref={whatsappHref} />
    </div>
  );
}
