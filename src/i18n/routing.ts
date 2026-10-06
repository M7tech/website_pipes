import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ar", "ckb"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});

const rtlLocales: ReadonlySet<Locale> = new Set(["ar", "ckb"]);

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return rtlLocales.has(locale) ? "rtl" : "ltr";
}
