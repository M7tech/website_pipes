"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

type Photo = { src: string; alt: string };

/**
 * Photo backdrop for a page header that cross-fades like the home hero.
 * On wide screens the photos fill the end side and fade into the navy behind
 * the text; on phones they sit under a navy wash. Advances on its own (paused
 * on hover or focus of the dots, never with reduced motion); the dots select a
 * photo directly. Must be a direct child of the positioned, isolated header.
 */
export function HeaderSlides({
  photos,
  label,
  photoOf,
  interval = 5000,
}: {
  photos: Photo[];
  label: string;
  /** One accessible name per dot, e.g. "Photo 2 of 5". */
  photoOf: string[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const reduce = useReducedMotion();
  const count = photos.length;

  useEffect(() => {
    if (reduce || held || count < 2) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % count), interval);
    return () => clearTimeout(id);
  }, [index, reduce, held, count, interval]);

  return (
    <>
      <div className="absolute inset-0 -z-10 overflow-hidden lg:start-[38%] lg:[mask-image:linear-gradient(to_left,black_60%,transparent)] rtl:lg:[mask-image:linear-gradient(to_right,black_60%,transparent)]">
        {photos.map((photo, i) => (
          <div
            key={photo.src}
            aria-hidden={i !== index}
            className="absolute inset-0 transition-opacity duration-1000 ease-(--ease-out-expo)"
            style={{ opacity: i === index ? 1 : 0 }}
          >
            <Image
              key={i === index ? `on-${index}` : "off"}
              src={photo.src}
              alt={photo.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 62vw, 100vw"
              className={`object-cover ${i === index ? "ken-burns" : ""}`}
            />
          </div>
        ))}
        {/* Navy wash: strong on phones (text sits on the photo), light on wide screens. */}
        <div aria-hidden="true" className="absolute inset-0 bg-atlas-navy/80 lg:bg-atlas-navy/15" />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-atlas-navy/70 via-transparent to-atlas-navy/30" />
      </div>

      {count > 1 ? (
        <div
          role="group"
          aria-roledescription="carousel"
          aria-label={label}
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
          }}
          className="absolute bottom-14 end-[var(--gutter)] z-10 flex gap-1 md:bottom-24"
        >
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={photoOf[i]}
              aria-current={i === index}
              className="group inline-flex size-11 items-center justify-center"
            >
              <span
                aria-hidden="true"
                className={`h-1 rounded-full shadow-sm transition-all duration-500 ${i === index ? "w-8 bg-white" : "w-3 bg-white/50 group-hover:bg-white/80"}`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}
