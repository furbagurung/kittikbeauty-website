import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { categoryHref } from "@/lib/category-utils";
import type { Category } from "@/types/product";

export function CategorySection({ categories }: { categories: Category[] }) {
  return (
    <section id="categories" className="border-b border-stone-200 bg-white py-10 sm:py-14">
      <div className="mx-auto w-full max-w-[1304px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Categories"
          title="Shop by category"
          description="Browse the catalog by the categories currently available from Kittik Beauty."
        />
        <div className="mt-6 flex gap-3 overflow-x-auto pb-2 sm:mt-8 sm:gap-4">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              href={categoryHref(category)}
              className="group flex min-h-32 min-w-[220px] items-center justify-between gap-4 rounded-lg border border-stone-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-stone-950 hover:bg-stone-50 sm:min-h-36 sm:min-w-[310px] sm:gap-5 sm:p-6"
            >
              <div className="min-w-0">
                <h3 className="truncate text-xl font-bold tracking-tight text-stone-950 sm:text-[22px]">{category.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-5 text-stone-500 sm:text-base sm:leading-6">
                  {category.description ?? "Browse available beauty products."}
                </p>
              </div>
              <ArrowRight className="size-5 shrink-0 text-stone-400 transition group-hover:translate-x-1 group-hover:text-stone-950" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
