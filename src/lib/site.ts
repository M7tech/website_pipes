import type { Locale } from "@/i18n/routing";
import { locales } from "@/i18n/routing";

/** Public origin of the site, set per environment (Coolify: NEXT_PUBLIC_SITE_URL). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://atlasplast.iq"
).replace(/\/$/, "");

/** Absolute URL for a locale-relative path, e.g. ("ar", "/about"). */
export function localeUrl(locale: Locale, path = "") {
  return `${SITE_URL}/${locale}${path === "/" ? "" : path}`;
}

/** hreflang alternates for a locale-relative path, including x-default. */
export function languageAlternates(path = "") {
  const languages: Record<string, string> = {};
  for (const locale of locales) languages[locale] = localeUrl(locale, path);
  languages["x-default"] = localeUrl("en", path);
  return languages;
}

/** Shared metadata for a localized page: title, description, canonical, hreflang and Open Graph. */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  siteName,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  siteName: string;
}) {
  return {
    title,
    description,
    alternates: { canonical: localeUrl(locale, path), languages: languageAlternates(path) },
    openGraph: {
      type: "website" as const,
      siteName,
      title,
      description,
      url: localeUrl(locale, path),
      locale,
    },
  };
}
