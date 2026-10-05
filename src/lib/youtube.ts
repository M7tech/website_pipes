import { fallbackVideos, youtube, type Video } from "@/content/media";

const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${youtube.channelId}`;

const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
const decode = (s: string) =>
  s.replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e: string) =>
    e[0] === "#"
      ? String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : Number(e.slice(1)))
      : (entities[e] ?? m),
  );
const field = (entry: string, tag: string) => entry.match(new RegExp(`<${tag}>([^<]*)</${tag}>`))?.[1];

/**
 * The channel's videos, newest first, from YouTube's public feed (its latest
 * 15 uploads). Re-read hourly, so new uploads appear without a redeploy. If the
 * feed can't be reached, the page falls back to the old site's video.
 */
export async function channelVideos(): Promise<Video[]> {
  try {
    const res = await fetch(feedUrl, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return fallbackVideos;
    const xml = await res.text();
    const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
      .map(([, entry]) => ({
        id: field(entry, "yt:videoId") ?? "",
        title: decode(field(entry, "title") ?? "").trim() || undefined,
        published: field(entry, "published"),
      }))
      .filter((v) => /^[\w-]{11}$/.test(v.id));
    return videos.length ? videos : fallbackVideos;
  } catch {
    return fallbackVideos;
  }
}
