/** Primary navigation. Labels live in messages under Nav.<key>. */
export const primaryNav = [
  { key: "products", href: "/products" },
  { key: "brands", href: "/brands" },
  { key: "projects", href: "/projects" },
  { key: "about", href: "/about" },
  { key: "locations", href: "/locations" },
] as const;

export const contactHref = "/contact";

/** Pages that exist as routes; used by the sitemap and the placeholder route. */
export const pagePaths = ["", "/products", "/brands", "/projects", "/about", "/locations", "/contact"] as const;

export const languageNames = { en: "English", ar: "العربية", ckb: "کوردی" } as const;
