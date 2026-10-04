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

/** Open Graph locale codes (language_TERRITORY). */
const ogLocales: Record<Locale, string> = { en: "en_US", ar: "ar_IQ", ckb: "ckb_IQ" };

/** Default share image (1200 × 630) under /public. */
export const OG_IMAGE = { url: "/og.png", width: 1200, height: 630 };

/**
 * Shared metadata for a localized page: title, description, canonical, hreflang,
 * Open Graph and Twitter card. Pass `absoluteTitle` to skip the "| AtlasPlast" template.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  siteName,
  imageAlt,
  absoluteTitle = false,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  siteName: string;
  imageAlt: string;
  absoluteTitle?: boolean;
}) {
  const image = { ...OG_IMAGE, alt: imageAlt };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: localeUrl(locale, path), languages: languageAlternates(path) },
    openGraph: {
      type: "website" as const,
      siteName,
      title,
      description,
      url: localeUrl(locale, path),
      locale: ogLocales[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
      images: [image],
    },
    twitter: { card: "summary_large_image" as const, title, description, images: [image] },
  };
}

/** Stable @id of the AtlasPlast Organization node, referenced from every page's structured data. */
export const ORG_ID = `${SITE_URL}/#organization`;

/** BreadcrumbList JSON-LD from Home to the current page. */
export function breadcrumbLd(locale: Locale, crumbs: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: localeUrl(locale, c.path),
    })),
  };
}

/** JSON-LD @graph for an inner page: the page node plus its breadcrumb. */
export function pageLd({
  locale,
  path,
  type = "WebPage",
  name,
  description,
  crumbs,
  extra = [],
}: {
  locale: Locale;
  path: string;
  type?: string;
  name: string;
  description: string;
  crumbs: { name: string; path: string }[];
  extra?: object[];
}) {
  const url = localeUrl(locale, path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: locale,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": ORG_ID },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      { "@id": `${url}#breadcrumb`, ...breadcrumbLd(locale, crumbs) },
      ...extra,
    ],
  };
}
