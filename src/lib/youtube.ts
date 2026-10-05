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

type PlaylistPage = {
  nextPageToken?: string;
  items?: {
    snippet?: { title?: string; publishedAt?: string; resourceId?: { videoId?: string } };
    contentDetails?: { videoPublishedAt?: string };
    status?: { privacyStatus?: string };
  }[];
};

/**
 * Every public upload, newest first, from the YouTube Data API (the channel's
 * uploads playlist, 50 per page, up to 500). Needs YOUTUBE_API_KEY, a server-only
 * variable set in Coolify. Null when the API can't be read, so the feed takes over.
 */
async function allUploads(key: string): Promise<Video[] | null> {
  const playlistId = `UU${youtube.channelId.slice(2)}`;
  const videos: Video[] = [];
  let pageToken: string | undefined;
  for (let page = 0; page < 10; page++) {
    const query = new URLSearchParams({ part: "snippet,contentDetails,status", playlistId, maxResults: "50", key });
    if (pageToken) query.set("pageToken", pageToken);
    const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${query}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as PlaylistPage;
    for (const item of data.items ?? []) {
      const id = item.snippet?.resourceId?.videoId ?? "";
      if (!/^[\w-]{11}$/.test(id) || item.status?.privacyStatus !== "public") continue;
      videos.push({
        id,
        title: item.snippet?.title?.trim() || undefined,
        published: item.contentDetails?.videoPublishedAt ?? item.snippet?.publishedAt,
      });
    }
    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }
  return videos;
}

/**
 * The channel's videos, newest first. With YOUTUBE_API_KEY set, every public
 * upload; without it (or if the API fails), YouTube's public feed, which holds
 * only the latest 15. Re-read hourly, so new uploads appear without a redeploy.
 * If neither can be reached, the page falls back to the old site's video.
 */
export async function channelVideos(): Promise<Video[]> {
  const key = process.env.YOUTUBE_API_KEY;
  if (key) {
    const all = await allUploads(key).catch(() => null);
    if (all?.length) return all;
  }
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
