import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ar", "ckb"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
  // Every page already declares its hreflang alternates (and x-default -> /en) in the HTML head
  // via pageMetadata(). The middleware's own `Link` header pointed x-default at "/" and used the
  // request host, which gave crawlers two conflicting sets of alternates.
  alternateLinks: false,
});

const rtlLocales: ReadonlySet<Locale> = new Set(["ar", "ckb"]);

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return rtlLocales.has(locale) ? "rtl" : "ltr";
}
