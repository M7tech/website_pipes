"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Image from "next/image";
import { m, useReducedMotion } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
import { useDirectionSign } from "@/components/motion/useDirection";
import { Arrow } from "@/components/ui/Arrow";

/** `image` is a decorative backdrop photo under /public. */
export type HeroSlide = { id: string; tab: string; content: ReactNode; image?: string };

type HeroCarouselProps = {
  slides: HeroSlide[];
  labels: { label: string; prev: string; next: string; pause: string; play: string; slideOf: string[] };
  /** Milliseconds each slide stays before advancing. */
  interval?: number;
};

/**
 * Tabbed hero carousel (WAI-ARIA APG pattern).
 * - Slides share one grid cell, so the hero keeps the height of the tallest slide.
 * - Autoplay is driven by the active tab's progress rule (a CSS animation): it pauses
 *   on mouse hover, on keyboard focus and with the pause button (never on a tap), and
 *   never runs when the visitor prefers reduced motion.
 * - Arrow keys follow the reading direction, so they swap in RTL.
 */
export function HeroCarousel({ slides, labels, interval = 8000 }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const reduce = useReducedMotion();
  const sign = useDirectionSign();
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = slides.length;

  const running = playing && !held && !reduce;
  const go = (i: number, focus = false) => {
    const next = (i + count) % count;
    setIndex(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const forward = sign === 1 ? "ArrowRight" : "ArrowLeft";
    const back = sign === 1 ? "ArrowLeft" : "ArrowRight";
    if (e.key === forward) go(index + 1, true);
    else if (e.key === back) go(index - 1, true);
    else if (e.key === "Home") go(0, true);
    else if (e.key === "End") go(count - 1, true);
    else return;
    e.preventDefault();
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={labels.label}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setHeld(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setHeld(false);
      }}
      onFocus={(e) => {
        if (e.target.matches(":focus-visible")) setHeld(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
    >
      {/* Photo backdrops fill the whole hero (its nearest positioned ancestor) and cross-fade with the slides. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        {slides.map((slide, i) =>
          slide.image ? (
            <div
              key={slide.id}
              className="absolute inset-0 transition-opacity duration-1000 ease-(--ease-out-expo)"
              style={{ opacity: i === index ? 1 : 0 }}
            >
              <Image
                key={i === index ? `on-${index}` : "off"}
                src={slide.image}
                alt=""
                fill
                sizes="100vw"
                priority={i === 0}
                className={`object-cover ${i === index ? "ken-burns" : ""}`}
              />
            </div>
          ) : null,
        )}
        <div className="absolute inset-0 bg-atlas-navy/45 md:hidden" />
        <div className="absolute inset-0 bg-linear-to-r from-atlas-navy/95 via-atlas-navy/70 to-atlas-navy/25 rtl:bg-linear-to-l" />
        <div className="absolute inset-0 bg-linear-to-t from-atlas-navy via-transparent to-atlas-navy/50" />
        <div className="caustics absolute -inset-[10%] mix-blend-screen" />
      </div>

      <div className="grid" aria-live={running ? "off" : "polite"}>
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <m.div
              key={slide.id}
              id={`${baseId}-slide-${i}`}
              role="tabpanel"
              aria-roledescription="slide"
              aria-label={labels.slideOf[i]}
              aria-hidden={!active}
              inert={!active}
              className={`flex flex-col justify-center [grid-area:1/1] ${active ? "z-10" : "pointer-events-none"}`}
              initial={false}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
            >
              {slide.content}
            </m.div>
          );
        })}
      </div>

      <div className="mt-10 flex items-stretch justify-between gap-6 md:mt-14">
        <div role="tablist" aria-label={labels.label} className="grid flex-1 grid-cols-4 gap-x-3 md:gap-x-6">
          {slides.map((slide, i) => {
            const active = i === index;
            return (
              <button
                key={slide.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${i}`}
                aria-selected={active}
                aria-controls={`${baseId}-slide-${i}`}
                tabIndex={active ? 0 : -1}
                onClick={() => go(i)}
                onKeyDown={onTabKey}
                className={`group relative grid min-h-11 content-start gap-1 pt-4 text-start text-sm transition-colors ${
                  active ? "text-white" : "text-on-dark-muted hover:text-white"
                }`}
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 rounded-full bg-white/15" />
                <span
                  aria-hidden="true"
                  key={active ? `on-${index}` : "off"}
                  onAnimationEnd={active ? () => go(index + 1) : undefined}
                  className="absolute inset-x-0 top-0 h-1 origin-left rounded-full bg-on-dark rtl:origin-right"
                  style={
                    active
                      ? reduce || !playing
                        ? { transform: "scaleX(1)" }
                        : {
                            animation: `hero-progress ${interval}ms linear forwards`,
                            animationPlayState: running ? "running" : "paused",
                          }
                      : { transform: "scaleX(0)" }
                  }
                />
                <span className="text-xs font-medium tabular">{String(i + 1).padStart(2, "0")}</span>
                <span className={`${active ? "" : "max-md:sr-only"}`}>{slide.tab}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 pt-3">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label={labels.prev}
            className="inline-flex size-11 items-center justify-center rounded-full transition-[scale,background-color] duration-(--duration-base) ease-(--ease-out-expo) hover:bg-white/10 active:scale-[0.95] active:duration-(--duration-fast)"
          >
            <Arrow className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label={labels.next}
            className="inline-flex size-11 items-center justify-center rounded-full transition-[scale,background-color] duration-(--duration-base) ease-(--ease-out-expo) hover:bg-white/10 active:scale-[0.95] active:duration-(--duration-fast)"
          >
            <Arrow />
          </button>
          {reduce ? null : (
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? labels.pause : labels.play}
              className="inline-flex size-11 items-center justify-center rounded-full transition-[scale,background-color] duration-(--duration-base) ease-(--ease-out-expo) hover:bg-white/10 active:scale-[0.95] active:duration-(--duration-fast)"
            >
              {playing ? (
                <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="currentColor">
                  <rect x="5" y="4" width="3" height="12" />
                  <rect x="12" y="4" width="3" height="12" />
                </svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="currentColor">
                  <path d="M6 4l10 6-10 6z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
