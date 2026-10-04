"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

type Photo = { src: string; alt: string };

/**
 * Cross-fading product photos on a white card, for page headers.
 * Advances on its own (paused on hover or focus, never with reduced motion);
 * the dots select a photo directly.
 */
export function PhotoSlider({
  photos,
  label,
  photoOf,
  interval = 4500,
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
    <section
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
      className="grid w-full max-w-[30rem] gap-4"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-white shadow-[0_24px_60px_-20px_rgb(0_0_0/0.5)]">
        {photos.map((photo, i) => (
          <div
            key={photo.src}
            aria-hidden={i !== index}
            className="absolute inset-0 transition-opacity duration-700 ease-(--ease-out-expo)"
            style={{ opacity: i === index ? 1 : 0 }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 480px, 90vw"
              priority={i === 0}
              className={`object-contain p-3 ${i === index ? "ken-burns-soft" : ""}`}
            />
          </div>
        ))}
      </div>
      {count > 1 ? (
        <div className="flex flex-wrap gap-1">
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
                className={`h-1 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-on-dark" : "w-3 bg-on-dark/40 group-hover:bg-on-dark/70"}`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
