/** Primary navigation. Labels live in messages under Nav.<key>. */
export const primaryNav = [
  { key: "solutions", href: "/solutions" },
  { key: "brands", href: "/brands" },
  { key: "projects", href: "/projects" },
  { key: "about", href: "/about" },
  { key: "locations", href: "/locations" },
] as const;

export const contactHref = "/contact";

/**
 * Sections still served by the interim placeholder route (noindex).
 * Remove a section from this list when its real route lands under src/app/[locale]/.
 */
export const placeholderSections = ["brands", "projects", "about", "locations", "contact"] as const;

export const languageNames = { en: "English", ar: "العربية", ckb: "کوردی" } as const;
