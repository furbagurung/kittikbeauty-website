"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import { ProductImage } from "@/components/products/product-image";
import type { Banner } from "@/types/product";

const AUTO_SLIDE_INTERVAL_MS = 4000;
const RESUME_DELAY_MS = 2500;

type BannerCarouselProps = {
  banners: Banner[];
};

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const visibleBanners = banners.filter((banner) => banner.image);
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const intervalRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  const clearAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  const scrollToBanner = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const slide = track?.children.item(index);

      if (!track || !(slide instanceof HTMLElement)) return;

      activeIndexRef.current = index;
      setActiveIndex(index);
      track.scrollTo({
        left: slide.offsetLeft - track.offsetLeft,
        behavior: "smooth",
      });
    },
    [],
  );

  const startAutoSlide = useCallback(() => {
    clearAutoSlide();

    if (visibleBanners.length <= 1) return;

    intervalRef.current = window.setInterval(() => {
      const nextIndex = (activeIndexRef.current + 1) % visibleBanners.length;
      scrollToBanner(nextIndex);
    }, AUTO_SLIDE_INTERVAL_MS);
  }, [clearAutoSlide, scrollToBanner, visibleBanners.length]);

  const pauseAutoSlide = useCallback(() => {
    clearResumeTimer();
    clearAutoSlide();
  }, [clearAutoSlide, clearResumeTimer]);

  const resumeAutoSlideSoon = useCallback(() => {
    clearResumeTimer();

    if (visibleBanners.length <= 1) return;

    resumeTimeoutRef.current = window.setTimeout(() => {
      startAutoSlide();
    }, RESUME_DELAY_MS);
  }, [clearResumeTimer, startAutoSlide, visibleBanners.length]);

  const updateActiveFromScroll = useCallback(() => {
    const track = trackRef.current;

    if (!track) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    Array.from(track.children).forEach((slide, index) => {
      if (!(slide instanceof HTMLElement)) return;

      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(slideCenter - trackCenter);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    if (nearestIndex !== activeIndexRef.current) {
      activeIndexRef.current = nearestIndex;
      setActiveIndex(nearestIndex);
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = window.requestAnimationFrame(() => {
      updateActiveFromScroll();
      frameRef.current = null;
    });
  }, [updateActiveFromScroll]);

  const handleInteractionEnd = useCallback(() => {
    updateActiveFromScroll();
    resumeAutoSlideSoon();
  }, [resumeAutoSlideSoon, updateActiveFromScroll]);

  useEffect(() => {
    startAutoSlide();

    return () => {
      clearAutoSlide();
      clearResumeTimer();

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [clearAutoSlide, clearResumeTimer, startAutoSlide]);

  if (!visibleBanners.length) return null;

  return (
    <section className="bg-white" aria-label="Featured banners">
      <div className="mx-auto w-full max-w-[1600px] px-4 pb-2 pt-2.5 sm:px-6 sm:pb-3 sm:pt-3 lg:px-8">
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x gap-3 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 sm:gap-4"
          onMouseEnter={pauseAutoSlide}
          onMouseLeave={resumeAutoSlideSoon}
          onPointerDown={pauseAutoSlide}
          onPointerUp={handleInteractionEnd}
          onPointerCancel={handleInteractionEnd}
          onTouchStart={pauseAutoSlide}
          onTouchEnd={handleInteractionEnd}
          onScroll={handleScroll}
        >
          {visibleBanners.map((banner, index) => (
            <BannerSlide key={banner.id} banner={banner} priority={index === 0} />
          ))}
        </div>
        {visibleBanners.length > 1 ? (
          <div className="mt-1.5 flex justify-center gap-1.5" aria-label="Banner slides">
            {visibleBanners.map((banner, index) => (
              <button
                type="button"
                key={`${banner.id}-dot`}
                className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-5 bg-stone-950" : "w-1.5 bg-stone-300"}`}
                aria-label={`Go to banner ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => {
                  pauseAutoSlide();
                  scrollToBanner(index);
                  resumeAutoSlideSoon();
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function BannerSlide({ banner, priority }: { banner: Banner; priority?: boolean }) {
  const hasCopy = Boolean(banner.title || banner.subtitle || banner.cta);
  const content = (
    <div className="relative aspect-[16/7.5] w-[calc(100vw-32px)] shrink-0 snap-center overflow-hidden rounded-[22px] border border-neutral-200 bg-neutral-50 shadow-[0_12px_32px_rgba(24,24,27,0.08)] sm:aspect-[16/7] sm:w-[min(720px,72vw)] lg:w-[min(860px,64vw)]">
      <ProductImage
        src={banner.image}
        alt={banner.title || "Kittik Beauty banner"}
        priority={priority}
        sizes="(min-width: 1024px) 860px, (min-width: 640px) 720px, calc(100vw - 32px)"
        className="object-cover"
      />
      {hasCopy ? (
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/45 via-black/10 to-transparent p-4 text-white sm:p-6">
          <div className="max-w-[76%]">
            {banner.title ? (
              <h2 className="line-clamp-2 text-lg font-black leading-tight tracking-tight sm:text-2xl">
                {banner.title}
              </h2>
            ) : null}
            {banner.subtitle ? (
              <p className="mt-1 line-clamp-1 text-xs font-semibold text-white/85 sm:text-sm">{banner.subtitle}</p>
            ) : null}
            {banner.cta ? (
              <p className="mt-2 inline-flex rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-stone-950">
                {banner.cta}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );

  if (!banner.link) return content;

  return (
    <Link href={banner.link} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-4">
      {content}
    </Link>
  );
}
