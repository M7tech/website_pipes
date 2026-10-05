import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { brands } from "@/content/brands";
import { solutions } from "@/content/solutions";
import { languageAlternates, localeUrl } from "@/lib/site";

/** Every public page, in each locale. */
const paths: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/solutions", priority: 0.9 },
  ...solutions.map((s) => ({ path: `/solutions/${s.slug}`, priority: 0.8 })),
  { path: "/brands", priority: 0.8 },
  ...brands.map((b) => ({ path: `/brands/${b.slug}`, priority: 0.6 })),
  { path: "/projects", priority: 0.7 },
  { path: "/media", priority: 0.6 },
  { path: "/about", priority: 0.7 },
  { path: "/about/board", priority: 0.6 },
  { path: "/locations", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
];

/** Build time, so every URL does not claim to change on each request. */
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap(({ path, priority }) =>
    routing.locales.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
