"use client";

import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";

import { HomeCarousel } from "@/components/home/home-carousel";
import { ProductImage } from "@/components/products/product-image";
import type { Reel } from "@/types/product";

const fallbackVisuals = [
  "bg-[radial-gradient(circle_at_30%_22%,#fecdd3,transparent_38%),linear-gradient(145deg,#ffffff,#d6d3d1)]",
  "bg-[radial-gradient(circle_at_72%_26%,#ddd6fe,transparent_38%),linear-gradient(145deg,#ffffff,#e5e7eb)]",
  "bg-[radial-gradient(circle_at_26%_76%,#bae6fd,transparent_38%),linear-gradient(145deg,#fafafa,#d6d3d1)]",
  "bg-[radial-gradient(circle_at_72%_72%,#fde68a,transparent_38%),linear-gradient(145deg,#ffffff,#e7e5e4)]",
];

export function ReelSection({ reels }: { reels: Reel[] }) {
  const [activeReel, setActiveReel] = useState<Reel | null>(null);

  useEffect(() => {
    if (!activeReel) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveReel(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeReel]);

  if (!reels.length) return null;

  return (
    <>
      <section id="reels" className="bg-white">
        <div className="mx-auto w-full max-w-[1304px] border-b border-stone-200 px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[24px] font-bold leading-tight tracking-tight text-stone-950 uppercase">
              Beauty reels
            </h2>
          </div>

          <HomeCarousel
            className="mt-5 sm:mt-6"
            trackClassName="sm:gap-5"
            controlsLabel="Beauty reels carousel controls"
            showIndicators
          >
            {reels.map((reel, index) => (
              <button
                key={reel.id}
                type="button"
                onClick={() => setActiveReel(reel)}
                className="group w-[170px] shrink-0 snap-start text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-4 sm:w-[220px]"
                aria-label={`Play ${reel.title}`}
              >
                <div className="relative aspect-[9/14] overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:border-stone-400">
                  {reel.thumbnailUrl ? (
                    <ProductImage
                      src={reel.thumbnailUrl}
                      alt={reel.title}
                      priority={index < 3}
                      sizes="(min-width: 640px) 220px, 170px"
                      className="transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className={`h-full w-full ${fallbackVisuals[index % fallbackVisuals.length]}`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute left-3 top-3 inline-flex size-10 items-center justify-center rounded-full bg-white text-stone-950 shadow-sm">
                    <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
                    <h3 className="line-clamp-2 text-sm font-bold leading-5 sm:text-base sm:leading-6">{reel.title}</h3>
                    {reel.caption ? (
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/80">{reel.caption}</p>
                    ) : null}
                  </div>
                </div>
              </button>
            ))}
          </HomeCarousel>
        </div>
      </section>

      {activeReel ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={activeReel.title}
          onClick={() => setActiveReel(null)}
        >
          <div
            className="relative w-full max-w-[420px]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveReel(null)}
              className="absolute -right-2 -top-12 inline-flex size-10 items-center justify-center rounded-full bg-white text-stone-950 shadow-sm transition hover:bg-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:-right-12 sm:top-0"
              aria-label="Close reel"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <div className="overflow-hidden rounded-2xl bg-black shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
              <video
                key={activeReel.id}
                src={activeReel.videoUrl}
                poster={activeReel.thumbnailUrl ?? undefined}
                controls
                autoPlay
                playsInline
                className="max-h-[82vh] w-full bg-black"
              />
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
