import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { brands } from "@/content/brands";
import { solutions } from "@/content/solutions";
import { SITE_URL, languageAlternates, localeUrl } from "@/lib/site";

/** Every public page, in each locale, with the photos it shows (image sitemap). */
const paths: { path: string; priority: number; images?: string[] }[] = [
  { path: "", priority: 1 },
  { path: "/solutions", priority: 0.9 },
  ...solutions.map((s) => ({ path: `/solutions/${s.slug}`, priority: 0.8, images: s.photos.map((p) => p.src) })),
  { path: "/brands", priority: 0.8 },
  ...brands.map((b) => ({
    path: `/brands/${b.slug}`,
    priority: 0.6,
    images: [b.photo?.src, b.logo].filter((src): src is string => Boolean(src)),
  })),
  { path: "/projects", priority: 0.7 },
  { path: "/media", priority: 0.6 },
  { path: "/about", priority: 0.7 },
  { path: "/about/board", priority: 0.6 },
  { path: "/locations", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
  { path: "/faq", priority: 0.7 },
];

/** Build time, so every URL does not claim to change on each request. */
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap(({ path, priority, images }) =>
    routing.locales.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: languageAlternates(path) },
      ...(images?.length ? { images: images.map((src) => `${SITE_URL}${src}`) } : {}),
    })),
  );
}
