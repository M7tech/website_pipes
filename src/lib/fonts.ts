import { IBM_Plex_Mono, IBM_Plex_Sans_Arabic, Inter } from "next/font/google";

/**
 * English display and text face. The opsz axis redraws it for its size, like a
 * system font: open and sturdy in body copy, tighter and finer in headlines.
 */
export const inter = Inter({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-inter",
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
 * Arabic and Sorani Kurdish. Verified to include the Sorani letters ڕ ڵ ێ ۆ ە ڤ.
 */
export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  // Only the weights the UI uses (font-normal, font-medium, font-semibold).
  weight: ["400", "500", "600"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export const fontVariables = [inter, plexMono, plexArabic]
  .map((f) => f.variable)
  .join(" ");
