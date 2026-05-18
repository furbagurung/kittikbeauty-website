"use client";

import { Children, type ReactNode, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type HomeCarouselProps = {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  controlsLabel: string;
  showIndicators?: boolean;
};

export function HomeCarousel({
  children,
  className = "",
  trackClassName = "",
  controlsLabel,
  showIndicators = false,
}: HomeCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemCount = Children.count(children);

  function scrollTrack(direction: "left" | "right") {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction === "left" ? -track.clientWidth * 0.85 : track.clientWidth * 0.85,
      behavior: "smooth",
    });
  }

  function updateActiveIndex() {
    const track = trackRef.current;
    if (!track || itemCount < 2) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) {
      setActiveIndex(0);
      return;
    }

    const progress = track.scrollLeft / maxScroll;
    setActiveIndex(Math.round(progress * (itemCount - 1)));
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className="pointer-events-none absolute inset-y-0 z-10 hidden items-center justify-between md:-left-8 md:-right-8 md:flex lg:-left-16 lg:-right-16 xl:-left-20 xl:-right-20"
        aria-label={controlsLabel}
      >
        <button
          type="button"
          onClick={() => scrollTrack("left")}
          className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-950 shadow-sm transition hover:border-stone-950 hover:bg-stone-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2"
          aria-label="Scroll left"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollTrack("right")}
          className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-950 shadow-sm transition hover:border-stone-950 hover:bg-stone-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2"
          aria-label="Scroll right"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
      <div
        ref={trackRef}
        onScroll={showIndicators ? updateActiveIndex : undefined}
        className={`no-scrollbar -mx-3 flex snap-x gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-3 pb-2 pt-1 sm:-mx-4 sm:gap-6 sm:px-4 ${trackClassName}`}
      >
        {children}
      </div>
      {showIndicators && itemCount > 1 ? (
        <div className="mt-4 flex justify-center gap-2" aria-hidden="true">
          {Array.from({ length: itemCount }).map((_, index) => (
            <span
              key={index}
              className={`h-0.5 w-8 transition-colors duration-200 ${
                index === activeIndex ? "bg-red-800" : "bg-stone-400"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
