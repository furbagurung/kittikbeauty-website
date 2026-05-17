import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductImage } from "@/components/products/product-image";

const fallbackGradients = [
  "bg-[radial-gradient(circle_at_30%_20%,#f5d0d6,transparent_34%),linear-gradient(135deg,#fafafa,#e7e5e4)]",
  "bg-[radial-gradient(circle_at_78%_24%,#d9f99d,transparent_30%),linear-gradient(135deg,#ffffff,#e7e5e4)]",
  "bg-[radial-gradient(circle_at_28%_72%,#fde68a,transparent_34%),linear-gradient(135deg,#fafafa,#d6d3d1)]",
  "bg-[radial-gradient(circle_at_72%_24%,#ddd6fe,transparent_34%),linear-gradient(135deg,#ffffff,#e7e5e4)]",
  "bg-[radial-gradient(circle_at_34%_28%,#bfdbfe,transparent_32%),linear-gradient(135deg,#fafafa,#d6d3d1)]",
  "bg-[radial-gradient(circle_at_75%_72%,#bae6fd,transparent_34%),linear-gradient(135deg,#ffffff,#e7e5e4)]",
  "bg-[radial-gradient(circle_at_22%_22%,#fecdd3,transparent_34%),linear-gradient(135deg,#fafafa,#e7e5e4)]",
  "bg-[radial-gradient(circle_at_70%_25%,#fed7aa,transparent_34%),linear-gradient(135deg,#ffffff,#d6d3d1)]",
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
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:border-stone-400 hover:shadow-[0_20px_55px_rgba(28,25,23,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2"
    >
      <div className="relative h-[148px] overflow-hidden bg-stone-100 min-[420px]:h-[172px] sm:h-[220px] lg:h-[244px]">
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
          <h2 className="text-[16px] font-bold leading-tight tracking-tight text-stone-950 sm:text-xl">
            {title}
          </h2>
          {typeof count === "number" ? (
            <span className="shrink-0 text-right text-[11px] font-bold text-stone-500 sm:text-xs">
              {count} products
            </span>
          ) : null}
        </div>
        {description ? (
          <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-stone-600 sm:text-sm sm:leading-6">
            {description}
          </p>
        ) : null}
        <span className="mt-auto flex min-h-11 items-end gap-2 pt-4 text-[13px] font-bold text-stone-950 sm:text-sm">
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
