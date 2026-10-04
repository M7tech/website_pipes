import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";

/** English display face; the wdth axis gives headings their expanded, engineered stance. */
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

/** English text face. */
export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex",
  display: "swap",
});

/** Specifications, data and labels. */
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
  // Small labels only; not worth a slot on the critical path.
  preload: false,
});

/**
 * Arabic and Sorani Kurdish. Verified to include the Sorani letters ڕ ڵ ێ ۆ ە ڤ;
 * drawn as a companion to IBM Plex Sans, so the scripts share one voice.
 */
export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  // Only the weights the UI uses (font-normal, font-medium, font-semibold).
  weight: ["400", "500", "600"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export const fontVariables = [archivo, plexSans, plexMono, plexArabic]
  .map((f) => f.variable)
  .join(" ");
