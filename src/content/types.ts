import type { Locale } from "@/i18n/routing";

/** A value written once per locale. */
export type Localized<T = string> = Record<Locale, T>;

/**
 * Where a fact comes from, so every published claim stays traceable:
 * "profile:p25" = ATLASProfile.pdf page 25, "site:<url>" = atlasplast.iq,
 * "confirmed:<date>" = confirmed by AtlasPlast management in the project thread.
 */
export type Source = `profile:${string}` | `site:${string}` | `confirmed:${string}`;
