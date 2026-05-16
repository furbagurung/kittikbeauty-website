import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-300 bg-white">
      <div className="mx-auto grid w-full max-w-[1304px] gap-7 px-4 py-10 text-sm text-stone-600 sm:px-6 sm:py-14 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
        <div>
          <p className="text-base font-bold tracking-[0.14em] text-stone-950 uppercase">Kittik Beauty</p>
          <p className="mt-3 max-w-lg leading-6">
            Beauty essentials, skincare, and cosmetics curated for simple product discovery.
          </p>
        </div>
        <div className="flex flex-col gap-1 font-bold text-stone-950 sm:flex-row sm:flex-wrap sm:gap-x-7">
          <Link className="inline-flex min-h-10 items-center transition-colors hover:text-stone-950 sm:min-h-0" href="/products">
            Products
          </Link>
          <Link className="inline-flex min-h-10 items-center transition-colors hover:text-stone-950 sm:min-h-0" href="/#categories">
            Categories
          </Link>
          <Link className="inline-flex min-h-10 items-center transition-colors hover:text-stone-950 sm:min-h-0" href="/#story">
            Story
          </Link>
        </div>
      </div>
    </footer>
  );
}
