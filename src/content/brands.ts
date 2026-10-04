import type { Source } from "./types";

/** Country keys map to localized names in messages (Countries namespace). */
export type Country = "CH" | "DE" | "AT" | "NL" | "IT" | "TR" | "SA" | "EG" | "CZ" | "RS";

export type Brand = {
  slug: string;
  name: string;
  /** Path under /public, or undefined when no approved artwork exists yet. */
  logo?: string;
  country?: Country;
  /** Message key under Brands.notes for an agency note, e.g. territory. */
  note?: "baenningerTerritory";
  source: Source;
};

export const brands: Brand[] = [
  { slug: "georg-fischer", name: "Georg Fischer", logo: "/brands/georg-fischer.svg", country: "CH", source: "profile:p7" },
  { slug: "polymelt", name: "Polymelt", logo: "/brands/polymelt.svg", country: "DE", source: "profile:p8" },
  { slug: "baenninger", name: "Bänninger", logo: "/brands/baenninger.svg", country: "DE", note: "baenningerTerritory", source: "confirmed:2026-10-04" },
  { slug: "ostendorf", name: "Ostendorf", logo: "/brands/ostendorf.svg", country: "DE", source: "profile:p16" },
  { slug: "poloplast", name: "Poloplast", logo: "/brands/poloplast.svg", country: "AT", source: "profile:p13" },
  { slug: "fv-plast", name: "FV-Plast", logo: "/brands/fv-plast.svg", country: "CZ", source: "confirmed:2026-10-04" },
  { slug: "pestan", name: "Peštan", logo: "/brands/pestan.svg", country: "RS", source: "confirmed:2026-10-04" },
  { slug: "wisa", name: "WISA", logo: "/brands/wisa.svg", country: "NL", source: "profile:p14" },
  { slug: "dab", name: "DAB Pumps", logo: "/brands/dab.svg", country: "IT", source: "profile:p19" },
  { slug: "saudi-ceramics", name: "Saudi Ceramics", logo: "/brands/saudi-ceramics.svg", country: "SA", source: "profile:p10" },
  { slug: "aquapa", name: "Aquapa", logo: "/brands/aquapa.svg", country: "TR", source: "profile:p9" },
  { slug: "pimtas", name: "Pimtaş", logo: "/brands/pimtas.svg", country: "TR", source: "profile:p11" },
  { slug: "turan-borfit", name: "Turan Borfit", logo: "/brands/turan-borfit.svg", country: "TR", source: "profile:p12" },
  { slug: "kas", name: "KAS", logo: "/brands/kas.svg", country: "TR", source: "profile:p18" },
  { slug: "guarri", name: "Guarri", logo: "/brands/guarri.svg", country: "TR", source: "profile:p18" },
  { slug: "ascelik", name: "Asçelik Clamp", logo: "/brands/ascelik.svg", country: "TR", source: "profile:p19" },
  { slug: "polo-egypt", name: "Polo Egypt", country: "EG", source: "profile:p17" },
  { slug: "shield", name: "Shield", logo: "/brands/shield.svg", country: "EG", source: "profile:p18" },
  { slug: "quarterbath", name: "QuarterBath", logo: "/brands/quarterbath.svg", source: "profile:p15" },
  { slug: "candan", name: "Candan Makina", logo: "/brands/candan.svg", source: "profile:p19" },
  { slug: "alvit", name: "Alvit", logo: "/brands/alvit.svg", source: "profile:p4" },
];

export function brandBySlug(slug: string) {
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) throw new Error(`Unknown brand: ${slug}`);
  return brand;
}
