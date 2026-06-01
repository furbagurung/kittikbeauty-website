"use client";

import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";

import { ProductImage } from "@/components/products/product-image";
import type { Reel } from "@/types/product";

const fallbackVisuals = [
  "bg-[linear-gradient(145deg,#ffffff,#FAF7F0)]",
  "bg-[linear-gradient(145deg,#ffffff,#F3E7C3)]",
  "bg-[linear-gradient(145deg,#FAF7F0,#ffffff)]",
  "bg-[linear-gradient(145deg,#ffffff,rgba(214,178,83,0.28))]",
];

const highlightLabels = ["New In", "Tutorials", "Reviews", "Lip Care", "Skin Prep", "Tools"];

function highlightLabel(index: number) {
  return highlightLabels[index % highlightLabels.length];
}

export function ReelSection({ reels }: { reels: Reel[] }) {
  const [activeReel, setActiveReel] = useState<Reel | null>(null);

  useEffect(() => {
    if (!activeReel) return;

    const originalOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveReel(null);
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeReel]);

  if (!reels.length) return null;

  return (
    <>
      <section id="reels" className="bg-white">
        <div className="mx-auto w-full max-w-[1304px] px-4 py-3.5 sm:px-6 sm:py-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[22px] font-black leading-tight tracking-tight text-brandEmerald sm:text-[28px]">
              Beauty highlights
            </h2>
          </div>

          <div className="no-scrollbar mt-2.5 flex snap-x gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 sm:gap-5">
            {reels.map((reel, index) => (
              <button
                key={reel.id}
                type="button"
                onClick={() => setActiveReel(reel)}
                className="group w-[78px] shrink-0 snap-start text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brandGold focus-visible:ring-offset-4 sm:w-[88px]"
                aria-label={`Play ${reel.title}`}
              >
                <div className="relative aspect-square overflow-hidden rounded-full border border-brandGold/35 bg-brandCream p-1 transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:border-brandGold">
                  <div className="relative h-full w-full overflow-hidden rounded-full bg-brandCream">
                  {reel.thumbnailUrl ? (
                    <ProductImage
                      src={reel.thumbnailUrl}
                      alt={reel.title}
                      priority={index < 3}
                      sizes="(min-width: 640px) 88px, 78px"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className={`h-full w-full ${fallbackVisuals[index % fallbackVisuals.length]}`} />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/15 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-black/70">
                      <Play className="ml-0.5 size-3.5 fill-current" aria-hidden="true" />
                    </span>
                  </span>
                  </div>
                </div>
                <span className="mt-1.5 block truncate text-[11px] font-bold leading-tight text-brandEmerald sm:text-xs">
                  {highlightLabel(index)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeReel ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={activeReel.title}
          onClick={() => setActiveReel(null)}
        >
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setActiveReel(null)}
            aria-label="Close reel"
          />
          <div
            className="relative z-[121] w-full max-w-[420px]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveReel(null)}
              className="absolute right-0 top-[-52px] inline-flex size-10 items-center justify-center rounded-full bg-white text-stone-950 shadow-sm transition hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-label="Close reel"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <div className="overflow-hidden rounded-2xl bg-black shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
              {activeReel.videoUrl ? (
                <video
                  key={activeReel.id}
                  src={activeReel.videoUrl}
                  poster={activeReel.thumbnailUrl ?? undefined}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[82dvh] w-full bg-black"
                />
              ) : (
                <div className="relative aspect-[9/16] bg-neutral-900">
                  <ProductImage
                    src={activeReel.thumbnailUrl}
                    alt={activeReel.title}
                    sizes="420px"
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="inline-flex size-14 items-center justify-center rounded-full bg-white text-stone-950">
                      <Play className="ml-1 size-6 fill-current" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3 text-white">
              <h3 className="text-lg font-bold leading-6">{activeReel.title}</h3>
              {activeReel.caption ? (
                <p className="mt-1 text-sm leading-6 text-white/75">{activeReel.caption}</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
