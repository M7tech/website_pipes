/** The AtlasPlast YouTube channel (owner's link, confirmed 2026-10-04). */
export const youtube = {
  url: "https://www.youtube.com/@atlasplast",
  channelId: "UCURwlrQZe8PnV7ZUzTme-AQ",
} as const;

export type Video = {
  /** YouTube video id (11 characters). */
  id: string;
  /** Title as published on YouTube, in the language it was written in. */
  title?: string;
  /** ISO date the video was published. */
  published?: string;
};

/** Shown when the channel feed can't be reached: the video the old site linked to. */
export const fallbackVideos: Video[] = [{ id: "xatuZC65KuM" }];

export const videoThumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const videoEmbed = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
export const videoUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
