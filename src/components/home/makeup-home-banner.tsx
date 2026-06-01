import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function MakeupHomeBanner() {
  return (
    <section className="bg-white" aria-label="Makeup services">
      <div className="mx-auto w-full max-w-[1304px] px-4 py-3 sm:px-6 sm:py-5 lg:px-8">
        <Link
          href="/makeup"
          className="group grid gap-4 rounded-[22px] border border-brandGold/35 bg-brandGreen p-4 text-white shadow-[0_12px_34px_rgba(0,69,31,0.16)] transition hover:bg-brandEmerald focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandGold sm:grid-cols-[1fr_auto] sm:items-center sm:p-5"
        >
          <div>
            <h2 className="text-xl font-black leading-tight tracking-tight sm:text-2xl">
              Book Professional Makeup
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/75">
              Bridal, party, engagement, and photoshoot makeup by Kittik Beauty.
            </p>
          </div>
          <span className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-brandEmerald transition group-hover:bg-[#F3E7C3]">
            Explore Makeup Services
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </Link>
      </div>
    </section>
  );
}
