"use client";

import { useLocale } from "next-intl";
import { getDirection, type Locale } from "@/i18n/routing";

/** +1 in LTR, -1 in RTL: multiply horizontal offsets by this so motion follows reading direction. */
export function useDirectionSign() {
  return getDirection(useLocale() as Locale) === "rtl" ? -1 : 1;
}
