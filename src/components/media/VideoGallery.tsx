"use client";

import { useRef, useState, type ReactNode, type SyntheticEvent } from "react";
import Image from "next/image";
import { videoEmbed, videoThumbnail } from "@/content/media";

export type GalleryVideo = {
  id: string;
  title: string;
  /** Accessible name for the play button ("Play video: …"). */
  playLabel: string;
  /** Localized publish date, with its ISO value for <time>. */
  date?: { text: string; iso: string };
};

/** A removed or unreachable thumbnail leaves the dark frame and play button, not a broken-image icon. */
const hideBroken = (e: SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.visibility = "hidden";
};

function PlayBadge({ size = "lg" }: { size?: "lg" | "sm" }) {
  return (
    <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
      <span
        className={`${size === "lg" ? "play-ripple " : ""}grid place-items-center rounded-full bg-atlas-blue/90 text-white transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-hover:scale-110 group-focus-visible:scale-110 ${size === "lg" ? "size-20" : "size-12"}`}
      >
        <svg viewBox="0 0 24 24" className={`fill-current ${size === "lg" ? "size-8" : "size-5"}`} style={{ marginInlineStart: "0.15em" }}>
          <path d="M8 5.5v13l10.5-6.5z" />
        </svg>
      </span>
    </span>
  );
}

/**
 * A featured player beside the list of videos (stacked on small screens).
 * Nothing loads from YouTube until a video is played: the player starts as a
 * thumbnail, and the embed is the privacy-enhanced youtube-nocookie.com domain.
 */
export function VideoGallery({
  videos,
  listLabel,
  aside,
}: {
  videos: GalleryVideo[];
  listLabel: string;
  /** Shown under the list, e.g. a link to the channel. */
  aside?: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const player = useRef<HTMLDivElement>(null);
  const current = videos[active];

  const play = (i: number) => {
    setActive(i);
    setPlaying(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    player.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
  };

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
      <figure className="grid content-start gap-5 lg:sticky lg:top-28 lg:col-span-8 lg:self-start">
        <div ref={player} className="relative aspect-video overflow-hidden rounded-card bg-atlas-navy-deep">
          {playing ? (
            <iframe
              key={current.id}
              src={videoEmbed(current.id)}
              title={current.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 size-full border-0"
            />
          ) : (
            <button type="button" onClick={() => setPlaying(true)} aria-label={current.playLabel} className="group absolute inset-0">
              <Image
                src={videoThumbnail(current.id)}
                alt=""
                fill
                unoptimized
                priority
                onError={hideBroken}
                sizes="(min-width: 1440px) 1300px, 100vw"
                className="object-cover"
              />
              <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-atlas-navy/50 to-transparent" />
              <PlayBadge />
            </button>
          )}
        </div>
        <figcaption className="grid gap-1">
          <span className="text-[clamp(1.25rem,2.2vw,1.75rem)] font-semibold leading-snug">
            <bdi>{current.title}</bdi>
          </span>
          {current.date ? (
            <time dateTime={current.date.iso} className="text-sm text-steel">
              {current.date.text}
            </time>
          ) : null}
        </figcaption>
      </figure>

      <div className="grid content-start gap-8 lg:col-span-4">
        {videos.length > 1 ? (
        <ul aria-label={listLabel} className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-1 lg:gap-y-6">
          {videos.map((video, i) => (
            <li key={video.id}>
              <button
                type="button"
                onClick={() => play(i)}
                aria-label={video.playLabel}
                aria-current={i === active ? "true" : undefined}
                className="group pressable grid w-full gap-3 text-start lg:grid-cols-[44%_1fr] lg:items-start lg:gap-4"
              >
                <span className="relative block aspect-video overflow-hidden rounded-tile bg-atlas-navy-deep">
                  <Image
                    src={videoThumbnail(video.id)}
                    alt=""
                    fill
                    unoptimized
                    onError={hideBroken}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-(--duration-reveal) ease-(--ease-out-expo) group-hover:scale-105"
                  />
                  <PlayBadge size="sm" />
                  {i === active ? <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-atlas-sky" /> : null}
                </span>
                <span className="grid gap-1">
                  <span className="font-semibold leading-snug group-hover:text-atlas-blue lg:text-[0.9375rem]">
                    <bdi>{video.title}</bdi>
                  </span>
                  {video.date ? (
                    <time dateTime={video.date.iso} className="text-sm text-steel">
                      {video.date.text}
                    </time>
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
        ) : null}
        {aside}
      </div>
    </div>
  );
}
