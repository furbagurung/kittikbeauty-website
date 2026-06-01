import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductImage } from "@/components/products/product-image";

const fallbackGradients = [
  "bg-[radial-gradient(circle_at_30%_20%,rgba(214,178,83,0.32),transparent_34%),linear-gradient(135deg,#ffffff,#FAF7F0)]",
  "bg-[radial-gradient(circle_at_78%_24%,rgba(0,69,31,0.16),transparent_30%),linear-gradient(135deg,#ffffff,#F3E7C3)]",
  "bg-[radial-gradient(circle_at_28%_72%,rgba(214,178,83,0.24),transparent_34%),linear-gradient(135deg,#FAF7F0,#ffffff)]",
  "bg-[radial-gradient(circle_at_72%_24%,rgba(0,56,24,0.14),transparent_34%),linear-gradient(135deg,#ffffff,#FAF7F0)]",
];

type CatalogCardProps = {
  href: string;
  title: string;
  description?: string | null;
  image?: string | null;
  imageAlt: string;
  count?: number;
  cta: string;
  index?: number;
  imageClassName?: string;
};

export function CatalogCard({
  href,
  title,
  description,
  image,
  imageAlt,
  count,
  cta,
  index = 0,
  imageClassName,
}: CatalogCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-brandGold/25 bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brandGold/70 hover:shadow-[0_20px_55px_rgba(0,69,31,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brandGold focus-visible:ring-offset-2"
    >
      <div className="relative h-[148px] overflow-hidden bg-brandCream min-[420px]:h-[172px] sm:h-[220px] lg:h-[244px]">
        {image ? (
          <ProductImage
            src={image}
            alt={imageAlt}
            priority={index < 4}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
            className={imageClassName ?? "transition-transform duration-500 ease-out group-hover:scale-[1.035]"}
          />
        ) : (
          <div className={`h-full w-full ${fallbackGradients[index % fallbackGradients.length]}`}>
            <div className="flex h-full items-end p-4 sm:p-5">
              <div className="h-14 w-14 rounded-full border border-white/70 bg-white/55 shadow-sm sm:h-20 sm:w-20" />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[16px] font-bold leading-tight tracking-tight text-brandEmerald sm:text-xl">
            {title}
          </h2>
          {typeof count === "number" ? (
            <span className="shrink-0 text-right text-[11px] font-bold text-[#5F5F5F] sm:text-xs">
              {count} products
            </span>
          ) : null}
        </div>
        {description ? (
          <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-[#5F5F5F] sm:text-sm sm:leading-6">
            {description}
          </p>
        ) : null}
        <span className="mt-auto flex min-h-11 items-end gap-2 pt-4 text-[13px] font-bold text-brandGreen sm:text-sm">
          {cta}
          <ArrowRight
            className="mb-0.5 size-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
