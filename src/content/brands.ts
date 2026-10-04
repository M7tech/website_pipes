import type { Source } from "./types";

/** Country keys map to localized names in messages (Countries namespace). */
export type Country = "CH" | "DE" | "AT" | "NL" | "IT" | "TR" | "SA" | "EG" | "CZ" | "RS";

export type BrandDocument = {
  kind: "catalogue" | "datasheet" | "certificate" | "downloads";
  /** Title as printed on the file (English). */
  title: string;
  /** Self-hosted file under /public/docs/<brand>/, or an absolute manufacturer URL. */
  href: string;
  /** File size in KB, shown next to the link when known. */
  sizeKb?: number;
  source: Source;
};

export type Brand = {
  slug: string;
  name: string;
  /** Path under /public, or undefined when no approved artwork exists yet. */
  logo?: string;
  country?: Country;
  /** Message key under Brands.notes for an agency note, e.g. territory. */
  note?: "baenningerTerritory";
  /** English technical documents (owner decision 2026-10-04: English files only). */
  documents?: BrandDocument[];
  /** Manufacturer site photo from the company profile; `subject` names the company shown when it differs. */
  photo?: { src: string; subject?: string };
  source: Source;
};

/** Profile photos (atlasprofile brand pages), keyed by brand slug. */
const photos: Record<string, Brand["photo"]> = {
  polymelt: { src: "/images/brands/polymelt.jpg" },
  aquapa: { src: "/images/brands/aquapa.jpg", subject: "Formül Plastik" },
  "saudi-ceramics": { src: "/images/brands/saudi-ceramics.jpg" },
  pimtas: { src: "/images/brands/pimtas.jpg" },
  "turan-borfit": { src: "/images/brands/turan-borfit.jpg" },
  poloplast: { src: "/images/brands/poloplast.jpg" },
  wisa: { src: "/images/brands/wisa.jpg", subject: "Fluidmaster" },
  quarterbath: { src: "/images/brands/quarterbath.jpg" },
  ostendorf: { src: "/images/brands/ostendorf.jpg" },
  "polo-egypt": { src: "/images/brands/polo-egypt.jpg" },
};

const brandList: Brand[] = [
  { slug: "georg-fischer", name: "Georg Fischer", logo: "/brands/georg-fischer.svg", country: "CH",
    source: "profile:p7",
    documents: [
      { kind: "downloads", title: "GF Download Center", href: "https://www.gfps.com/com/en/downloads-tools/download-center.html", source: "manufacturer:2026-10-04" },
      { kind: "catalogue", title: "Sound-Insulated Piping Systems Silenta Premium", href: "https://www.gfps.com/content/dam/gfps/com/archive-global/gfps-hakan-product-range-silenta-premium-en.pdf", source: "manufacturer:2026-10-04" },
      { kind: "catalogue", title: "AQUASYSTEM PP-R and PP-RCT Piping Systems", href: "https://www.gfps.com/content/dam/gfps/com/archive-global/gfps-hakan-product-range-aquasystem-en.pdf", source: "manufacturer:2026-10-04" },
      { kind: "catalogue", title: "PE Systems Product Range International", href: "https://www.gfps.com/content/dam/gfps/gb/brochures-and-flyers/gfps-uk-brochure-PE-Catalogue-en.pdf", source: "manufacturer:2026-10-04" },
    ],
  },
  { slug: "polymelt", name: "Polymelt", logo: "/brands/polymelt.svg", country: "DE",
    source: "profile:p8",
    documents: [
      { kind: "downloads", title: "Polymelt downloads", href: "https://www.polymelt.com/downloads/", source: "manufacturer:2026-10-04" },
      { kind: "catalogue", title: "POLYMELT Polymutan Technical Manual", href: "https://www.polymelt.com/wp-content/uploads/2025/09/2024_POLYMELT_POLYMUTAN_PPR_Pipe_System_technical_manual_EN.pdf", source: "manufacturer:2026-10-04" },
      { kind: "catalogue", title: "POLYMELT Ecosan Technical Manual", href: "https://www.polymelt.com/wp-content/uploads/2026/04/POLY-26_021_THB_ECOSAN_m_74_SL_NEUE_TYPO_inter.pdf", source: "manufacturer:2026-10-04" },
      { kind: "catalogue", title: "POLYMELT UV Brochure", href: "https://www.polymelt.com/wp-content/uploads/2025/09/POLYMELT_UV_THB_UV_EN_PPR_Pipe.pdf", source: "manufacturer:2026-10-04" },
    ],
  },
  { slug: "baenninger", name: "Bänninger", logo: "/brands/baenninger.svg", country: "DE", note: "baenningerTerritory",
    source: "confirmed:2026-10-04",
    documents: [
      { kind: "downloads", title: "Bänninger downloads", href: "https://www.baenninger.de/en/downloads.html", source: "manufacturer:2026-10-04" },
      { kind: "catalogue", title: "Bänninger Technical Manual", href: "https://www.baenninger.de/fileadmin/pdf/drucksachen/BR_Technical_Manual_DE_EN.pdf", source: "manufacturer:2026-10-04" },
      { kind: "catalogue", title: "Bänninger Range of Products 2026", href: "https://www.baenninger.de/fileadmin/pdf/drucksachen/BR_Gesamtprogramm_Range_of_Products_DE_EN_2026.02_HIGH.pdf", source: "manufacturer:2026-10-04" },
    ],
  },
  { slug: "ostendorf", name: "Ostendorf", logo: "/brands/ostendorf.svg", country: "DE",
    source: "profile:p16",
    documents: [
      { kind: "downloads", title: "Catalogues and More", href: "https://www.ostendorf-kunststoffe.com/en/downloads/catalogue/", source: "manufacturer:2026-10-04" },
      { kind: "downloads", title: "Product data", href: "https://www.ostendorf-kunststoffe.com/en/downloads/product-data/", source: "manufacturer:2026-10-04" },
    ],
  },
  { slug: "poloplast", name: "Poloplast", logo: "/brands/poloplast.svg", country: "AT",
    source: "profile:p13",
    documents: [
      { kind: "downloads", title: "Downloads: all files", href: "https://www.poloplast.com/en-at/products/downloads.html", source: "manufacturer:2026-10-04" },
      { kind: "catalogue", title: "Technical Manual Building Drainage", href: "https://www.poloplast.com/fileadmin/downloads/downloads_gesamt/Gebaudeentwasserung_POLO-KAL/poloplast-technical-manual-building-drainage-en-int-2026-06.pdf", source: "manufacturer:2026-10-04" },
      { kind: "datasheet", title: "Fitting guide POLO-KAL NG Qmax", href: "https://www.poloplast.com/fileadmin/downloads/downloads_gesamt/Gebaudeentwasserung_POLO-KAL/Fitting_guide_POLO-KAL_NG_Qmax_EN_09_2019.pdf", source: "manufacturer:2026-10-04" },
    ],
  },
  { slug: "fv-plast", name: "FV-Plast", logo: "/brands/fv-plast.svg", country: "CZ",
    source: "confirmed:2026-10-04",
    documents: [
      { kind: "catalogue", title: "Catalogue of Products 2018", href: "https://www.fv-plast.cz/media/cache/file/9a/ENG-katalog-2018.pdf", source: "manufacturer:2026-10-04" },
    ],
  },
  { slug: "pestan", name: "Peštan", logo: "/brands/pestan.svg", country: "RS",
    source: "confirmed:2026-10-04",
    documents: [
      { kind: "catalogue", title: "Piping Solutions catalog 2024", href: "https://pestan.net/wp-content/uploads/2024/04/Piping-Solutions-catalog-2024.pdf", source: "manufacturer:2026-10-04" },
      { kind: "catalogue", title: "Technical Catalogue HT(PP) Pipes and Fittings", href: "https://pestan.net/wp-content/uploads/2016/06/HTPP-TECHNICAL-CATALOGUE.pdf", source: "manufacturer:2026-10-04" },
      { kind: "catalogue", title: "S LINE Low Noise Pipes and Fittings Technical Catalogue", href: "https://pestan.net/wp-content/uploads/2016/06/S-LINE-technical-catalogue.pdf", source: "manufacturer:2026-10-04" },
      { kind: "catalogue", title: "Bathroom Solutions", href: "https://pestan.net/wp-content/uploads/2023/09/Bathroom-solutions-EU-4-1.pdf", source: "manufacturer:2026-10-04" },
    ],
  },
  { slug: "wisa", name: "WISA", logo: "/brands/wisa.svg", country: "NL", source: "profile:p14" },
  { slug: "dab", name: "DAB Pumps", logo: "/brands/dab.svg", country: "IT",
    source: "profile:p19",
    documents: [
      { kind: "downloads", title: "e.sybox product documentation", href: "https://www.dabpumps.com/en/products/multistage-centrifugal-and-self-priming-pumps/automatic-booster-system-with-inverter/e.sybox", source: "manufacturer:2026-10-04" },
      { kind: "datasheet", title: "ESYBOX Electronic Pressure Boosting System - Technical sheet", href: "https://www.dabpumps.com/content/dam/dabpumps-dam/products/dab/eng_master/esybox_line/esybox/documentation/mkt_documentation/technical_sheet/esybox_dab_technical_sheet_en_50260013.pdf", source: "manufacturer:2026-10-04" },
      { kind: "datasheet", title: "K Single-Impeller Centrifugal Pumps - Technical sheet", href: "https://www.dabpumps.com/content/dam/dabpumps-dam/products/dab/eng_master/centrifugal_pumps/k_single_impeller/documentation/mkt-documentation/technical-sheet/k_single_dab_technical_sheet_eng_50250003.pdf", source: "manufacturer:2026-10-04" },
    ],
  },
  { slug: "saudi-ceramics", name: "Saudi Ceramics", logo: "/brands/saudi-ceramics.svg", country: "SA",
    source: "profile:p10",
    documents: [
      { kind: "downloads", title: "Product Catalogs", href: "https://www.saudiceramics.com/en/fb-3502/", source: "manufacturer:2026-10-04" },
    ],
  },
  { slug: "aquapa", name: "Aquapa", logo: "/brands/aquapa.svg", country: "TR",
    source: "profile:p9",
    documents: [
      { kind: "certificate", title: "Aquapa certificates", href: "https://www.formul.com.tr/en/sertifikalar", source: "manufacturer:2026-10-04" },
    ],
  },
  { slug: "pimtas", name: "Pimtaş", logo: "/brands/pimtas.svg", country: "TR",
    source: "profile:p11",
    documents: [
      { kind: "downloads", title: "Pimtaş catalogues", href: "https://pimtas.com/en/catalog/", source: "manufacturer:2026-10-04" },
      { kind: "catalogue", title: "Pimtaş Technical Catalogue", href: "https://pimtas.com/wp-content/uploads/2025/06/teknik-katalog-ingilizce-min.pdf", source: "manufacturer:2026-10-04" },
      { kind: "catalogue", title: "Pimtaş Compression Fittings Catalogue", href: "https://pimtas.com/wp-content/uploads/2026/09/KAPLIN_EURO_2025_ARALIK.pdf", source: "manufacturer:2026-10-04" },
      { kind: "certificate", title: "Pimtaş certificates", href: "https://pimtas.com/en/certificates/", source: "manufacturer:2026-10-04" },
    ],
  },
  { slug: "turan-borfit", name: "Turan Borfit", logo: "/brands/turan-borfit.svg", country: "TR", source: "profile:p12" },
  { slug: "kas", name: "KAS", logo: "/brands/kas.svg", country: "TR",
    source: "profile:p18",
    documents: [
      { kind: "downloads", title: "KAS catalogues", href: "https://kas.com.tr/en/catalog-category/our-catalogs/", source: "manufacturer:2026-10-04" },
      { kind: "catalogue", title: "General Catalog", href: "https://kas.com.tr/wp-content/uploads/2026/04/General-Catalog.pdf", source: "manufacturer:2026-10-04" },
      { kind: "catalogue", title: "Brass Valve & Fittings", href: "https://kas.com.tr/wp-content/uploads/2023/07/Brass-Valve-Fittings.pdf", source: "manufacturer:2026-10-04" },
      { kind: "catalogue", title: "Faucet Catalogue", href: "https://kas.com.tr/wp-content/uploads/2018/04/kas-faucet-catalog.pdf", source: "manufacturer:2026-10-04" },
    ],
  },
  { slug: "guarri", name: "Guarri", logo: "/brands/guarri.svg", country: "TR", source: "profile:p18" },
  { slug: "ascelik", name: "Asçelik Clamp", logo: "/brands/ascelik.svg", country: "TR", source: "profile:p19" },
  { slug: "polo-egypt", name: "Polo Egypt", country: "EG", source: "profile:p17" },
  { slug: "shield", name: "Shield", logo: "/brands/shield.svg", country: "EG", source: "profile:p18" },
  { slug: "quarterbath", name: "QuarterBath", logo: "/brands/quarterbath.svg",
    source: "profile:p15",
    documents: [
      { kind: "catalogue", title: "QuarterBath Catalogue 2025", href: "https://quarterbath.com/ups/files/pdf/%C3%9Cr%C3%BCn-Katalog-25-en-.pdf", source: "manufacturer:2026-10-04" },
    ],
  },
  { slug: "candan", name: "Candan Makina", logo: "/brands/candan.svg",
    source: "profile:p19",
    documents: [
      { kind: "catalogue", title: "Candan Catalogue 2023", href: "https://www.candanmakina.com/images/candan_katalog_2023.pdf", source: "manufacturer:2026-10-04" },
    ],
  },
  { slug: "alvit", name: "Alvit", logo: "/brands/alvit.svg", source: "profile:p4" },
];

export const brands: Brand[] = brandList.map((b) => (photos[b.slug] ? { ...b, photo: photos[b.slug] } : b));

export function brandBySlug(slug: string) {
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) throw new Error(`Unknown brand: ${slug}`);
  return brand;
}
