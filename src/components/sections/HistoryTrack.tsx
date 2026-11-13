"use client";

import Image from "next/image";
import { m, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { easeOutExpo } from "@/lib/motion";
import { Ltr } from "@/components/ui/Ltr";
import { Waves } from "@/components/water/Waves";

export type TrackItem = {
  key: string;
  year: number;
  until?: number;
  /** Detail milestones are told only here, and carry no tick on the gauge. */
  detail: boolean;
  card: ReactNode;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Scroll-driven history: a sticky gauge fills with water and shows the year of the
 * milestone at the middle of the screen, while a pipe along the list fills to it.
 * The gauge repeats what the list says, so it is hidden from assistive technology.
 * With reduced motion the water follows the scroll without easing or waves, and
 * the cards appear without rising.
 */
export function HistoryTrack({ items, label }: { items: TrackItem[]; label: string }) {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 50%", "end 50%"],
  });
  const eased = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const progress = reduce ? scrollYProgress : eased;
  // The water never quite reaches the gauge's top, so its surface stays in view.
  const waterY = useTransform(progress, [0, 1], ["100%", "12%"]);

  // The milestone crossing the middle of the viewport is the current one.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const rows = Array.from(list.querySelectorAll<HTMLElement>("[data-index]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  const current = items[active];
  const keyYears = [...new Set(items.filter((i) => !i.detail).map((i) => i.year))];
  const tickYear = keyYears.filter((y) => y <= current.year).at(-1);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-12 lg:gap-12">
      <div
        aria-hidden="true"
        className="sticky top-[calc(var(--header-h)+0.75rem)] z-10 self-start lg:col-span-5 lg:top-[calc(var(--header-h)+2rem)]"
      >
        <div className="relative isolate h-20 overflow-hidden rounded-card bg-atlas-navy text-on-dark shadow-[0_10px_30px_-12px_rgb(20_40_74/0.45)] lg:h-[min(36rem,calc(100svh-var(--header-h)-4rem))] lg:rounded-panel lg:shadow-none">
          <Image
            src="/images/hero/landmark.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="-z-10 object-cover opacity-55"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-b from-atlas-navy/25 via-atlas-navy/50 to-atlas-navy/90" />

          {/* Phone: the bar fills along the reading direction. */}
          <m.div
            style={{ scaleX: progress }}
            className="absolute inset-0 -z-10 origin-left bg-atlas-blue/85 rtl:origin-right lg:hidden"
          />
          {/* Desktop: the gauge fills from the bottom, with a moving surface. */}
          <m.div
            style={{ y: waterY }}
            className="absolute inset-0 -z-10 hidden bg-linear-to-b from-atlas-blue to-atlas-navy-deep lg:block"
          >
            <div className="absolute inset-x-0 bottom-full h-14">
              <Waves fillClass="fill-atlas-blue" className="!h-full" />
            </div>
          </m.div>

          <div className="flex h-full items-center justify-between gap-4 px-5 lg:flex-col lg:items-stretch lg:p-10">
            <p className="hidden items-center justify-between text-sm text-on-dark-muted lg:flex">
              <span className="eyebrow text-atlas-mist">{label}</span>
              <Ltr className="tabular">
                {pad(active + 1)} / {pad(items.length)}
              </Ltr>
            </p>
            <p className="font-display-latin overflow-hidden text-[2.5rem] font-semibold leading-none tabular lg:text-[clamp(5rem,8.5vw,8.5rem)]">
              <Ltr>
                <m.span
                  key={current.key}
                  className="inline-block"
                  initial={{ opacity: 0, y: "0.35em" }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: easeOutExpo }}
                >
                  {current.year}
                  {current.until ? <span className="text-[0.45em] text-on-dark-muted">–{current.until}</span> : null}
                </m.span>
              </Ltr>
            </p>
            <Ltr className="tabular text-sm text-on-dark-muted lg:hidden">
              {pad(active + 1)} / {pad(items.length)}
            </Ltr>
            <ol className="hidden justify-between gap-2 border-t border-white/20 pt-4 text-sm tabular lg:flex">
              {keyYears.map((y) => (
                <li
                  key={y}
                  className={`transition-colors duration-(--duration-base) ${
                    y === tickYear
                      ? "font-semibold text-on-dark"
                      : y < (tickYear ?? 0)
                        ? "text-on-dark-muted"
                        : "text-on-dark-muted/50"
                  }`}
                >
                  <Ltr>{y}</Ltr>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <ol ref={listRef} className="relative lg:col-span-7">
        {/* The pipe along the list: empty, then filled down to the current milestone. */}
        <div
          aria-hidden="true"
          className="absolute inset-y-5 start-[1.1875rem] w-0.5 overflow-hidden rounded-full bg-rule md:start-[1.4375rem]"
        >
          <m.div
            style={{ scaleY: progress }}
            className="absolute inset-0 origin-top bg-atlas-blue motion-reduce:transition-none"
          />
        </div>
        {items.map((item, i) => {
          const state = i < active ? "past" : i === active ? "current" : "next";
          return (
            <li
              key={item.key}
              data-index={i}
              className="history-row relative grid grid-cols-[minmax(0,1fr)] gap-3 pb-8 ps-14 last:pb-0 md:gap-4 md:pb-10 md:ps-20"
            >
              <span
                aria-hidden="true"
                data-state={state}
                className="history-node absolute start-0 top-0 grid size-10 place-items-center rounded-full border-2 md:size-12"
              >
                <span className="size-3 rounded-full md:size-3.5" />
              </span>
              <p
                className={`font-display-latin flex h-10 items-center font-semibold leading-none tabular text-atlas-blue md:h-12 ${
                  item.detail ? "text-[clamp(1.5rem,2.4vw,2rem)]" : "text-[clamp(1.75rem,3.2vw,2.75rem)]"
                }`}
              >
                <Ltr>
                  {item.year}
                  {item.until ? <span className="text-[0.6em]">–{item.until}</span> : null}
                </Ltr>
              </p>
              {item.card}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
