import type { Source } from "./types";
import { brands, type Country } from "./brands";
import type { IconName } from "@/components/ui/Icon";

/**
 * Solutions: AtlasPlast's range organised by what the customer is building.
 * Copy (names, descriptions) lives in messages under Solutions.<slug> and
 * Solutions.lines.<id>; spec labels under Solutions.specs.<key>.
 * Spec values are technical codes and figures, copied from the source and
 * shown left-to-right in every language.
 */
export type SpecKey =
  | "diameter"
  | "length"
  | "pressure"
  | "rating"
  | "sdr"
  | "stiffness"
  | "material"
  | "acoustic"
  | "fire"
  | "capacity"
  | "flush"
  | "head"
  | "temperature"
  | "weldRange"
  | "power"
  | "sizes"
  | "thickness"
  | "absorption"
  | "slip"
  | "standards"
  | "cartridge";

export type ProductLine = {
  /** Message key under Solutions.lines. */
  id: string;
  /**
   * Product name as the manufacturer writes it. Generic names ("PE fittings")
   * are translated: messages Solutions.lines.<id>.name overrides this when present.
   */
  name: string;
  /** Product-brand artwork under /public, when the line has its own mark. */
  logo?: string;
  /** Brand slug from src/content/brands.ts. */
  brand: string;
  specs: { key: SpecKey; value: string }[];
  /** Country of manufacture, when it differs from the brand's home country. */
  madeIn?: Country;
  source: Source;
};

export type SolutionPhoto = {
  src: string;
  /** Brand slug when the photo shows that brand's products. */
  brand?: string;
};

export type Solution = {
  slug: string;
  /** Line icon naming the family (components/ui/Icon). */
  icon: IconName;
  /** Product photos from the company profile, shown in the solution header slider. */
  photos: SolutionPhoto[];
  /** Wall ratio for the SectionGlyph marker. */
  wall: number;
  /** One-line technical summary for indexes. */
  spec: string;
  lines: ProductLine[];
};

export const solutions: Solution[] = [
  {
    slug: "water-supply",
    icon: "waterSupply",
    photos: [
      { src: "/images/solutions/water-supply-1.jpg", brand: "polymelt" },
      { src: "/images/solutions/water-supply-2.jpg", brand: "polymelt" },
      { src: "/images/solutions/water-supply-3.jpg", brand: "aquapa" },
      { src: "/images/solutions/water-supply-4.jpg", brand: "georg-fischer" },
      { src: "/images/solutions/water-supply-5.jpg", brand: "boroug" },
    ],
    wall: 2.5,
    spec: "PP-R · PP-RCT · ML5 · Ø 20–200",
    lines: [
      { id: "poloPolymutan", name: "POLO-POLYMUTAN", brand: "polymelt", specs: [{ key: "material", value: "PP-R 80" }], source: "confirmed:2026-10-04" },
      { id: "poloEcosan", name: "POLO-ECOSAN", brand: "polymelt", specs: [{ key: "material", value: "PP-R" }], source: "confirmed:2026-10-04" },
      { id: "poloUv", name: "POLO-UV", brand: "polymelt", specs: [{ key: "material", value: "POLO-UV ML5 · PP-R" }], source: "confirmed:2026-10-04" },
      { id: "poloPolymutanMl5", name: "POLO-POLYMUTAN ML5", brand: "polymelt", specs: [{ key: "material", value: "PP-R 80 · HPCE · PP-RCT" }], source: "confirmed:2026-10-04" },
      {
        id: "polymutan",
        name: "Polymutan PP-R / PP-RCT",
        brand: "polymelt",
        specs: [
          { key: "diameter", value: "Ø 20–110 mm" },
          { key: "length", value: "4 m" },
          { key: "pressure", value: "PN 10 · 16 · 20 · 25" },
          { key: "standards", value: "DIN 8077/8078 · EN ISO 15874 · EN ISO 21003" },
        ],
        source: "profile:p8",
      },
      {
        id: "polymeltUv",
        name: "Polymelt UV",
        brand: "polymelt",
        specs: [
          { key: "diameter", value: "Ø 20–110 mm" },
          { key: "sdr", value: "SR 7" },
          { key: "length", value: "4 m" },
          { key: "rating", value: "25 bar @ 20 °C · 11 bar @ 70 °C" },
          { key: "standards", value: "DIN EN ISO 15874 · EN ISO 21003" },
        ],
        source: "profile:p8",
      },
      {
        id: "aquasystem",
        name: "Aquasystem",
        brand: "georg-fischer",
        specs: [
          { key: "diameter", value: "Ø 20–200 mm" },
          { key: "length", value: "4 m" },
          { key: "pressure", value: "PN 10 · 16 · 20 · 25" },
          { key: "standards", value: "EN ISO 15874 · DIN 8077 · DIN 8078" },
        ],
        source: "profile:p7",
      },
      {
        id: "aquapa",
        name: "Aquapa PP-R",
        brand: "aquapa",
        specs: [
          { key: "diameter", value: "Ø 20–110 mm" },
          { key: "length", value: "4–5.8 m" },
          { key: "pressure", value: "PN 10 · 16 · 20 · 25" },
          { key: "standards", value: "EN ISO 15874 · DIN 8077 · DIN 8078" },
        ],
        source: "profile:p9",
      },
      {
        id: "baenningerPpr",
        name: "Bänninger PP-R · PP-RCT",
        brand: "baenninger",
        specs: [
          { key: "material", value: "PP-R · PP-RCT" },
          { key: "diameter", value: "Ø 20–110 mm" },
          { key: "length", value: "4–6 m" },
          { key: "pressure", value: "PN 10 · 16 · 20 · 25" },
          { key: "standards", value: "DIN 8077 · DIN 8078 · ISO 15874" },
        ],
        source: "profile:p17",
      },
      {
        id: "poloEgy",
        name: "POLO EGY PP-R",
        brand: "boroug",
        specs: [
          { key: "diameter", value: "Ø 20–110 mm" },
          { key: "length", value: "4–6 m" },
          { key: "pressure", value: "PN 10 · 16 · 20 · 25" },
          { key: "standards", value: "DIN 8077 · DIN 8078 · ISO 15874" },
        ],
        source: "profile:p17",
      },
      {
        id: "kasPpr",
        name: "KAS PPR",
        brand: "kas",
        // Owner 2026-10-04: AtlasPlast supplies KAS PPR only (not PPR-C).
        specs: [{ key: "material", value: "PPR" }],
        source: "confirmed:2026-10-04",
      },
      // Owner 2026-11-13: AtlasPlast stocks NASSAR PPR and uPVC.
      { id: "nassarPpr", name: "NASSAR PPR", brand: "nassar", specs: [{ key: "material", value: "PPR" }], source: "confirmed:2026-11-13" },
    ],
  },
  {
    slug: "drainage",
    icon: "drainage",
    photos: [
      { src: "/images/solutions/drainage-1.jpg", brand: "georg-fischer" },
      { src: "/images/solutions/drainage-2.jpg", brand: "poloplast" },
      { src: "/images/solutions/drainage-3.jpg", brand: "poloplast" },
      { src: "/images/solutions/drainage-4.jpg", brand: "ostendorf" },
      { src: "/images/solutions/drainage-5.jpg", brand: "ostendorf" },
      { src: "/images/solutions/drainage-6.jpg", brand: "georg-fischer" },
    ],
    wall: 4,
    spec: "PVC-U · PP · Silent · Ø 25–500",
    // Owner 2026-10-05: Georg Fischer first, Boroug last.
    lines: [
      {
        id: "silentaPremium",
        name: "Silenta Premium",
        brand: "georg-fischer",
        // 4 l/s: GF brochure "Silenta Premium" (GF brand portal, checked 2026-11-13).
        // https://brandportal.uponor.com/m/d28f4f390926b438/original/GF-BFS-Brochure-Silenta-Premium.pdf
        // 2 l/s: profile p7 (7 dB(A) @ 2 l/s, EN 14366), also the 2 l/s value in GF's Silenta range brochure chart;
        // owner 2026-11-13: show both flows.
        specs: [
          { key: "diameter", value: "Ø 58–200 mm" },
          { key: "acoustic", value: "7 dB(A) @ 2 l/s · 12 dB(A) @ 4 l/s · EN 14366" },
          { key: "fire", value: "D-s2, d2 · EN 13501-1 · DIN 4102 B2" },
          { key: "standards", value: "EN 14366 · EN 13501-1 · ISO 9969" },
        ],
        source: "manufacturer:2026-11-13",
      },
      {
        id: "silenta3a",
        name: "Silenta 3A",
        brand: "georg-fischer",
        // GF brochure "Silenta 3A" (GF brand portal, checked 2026-11-13): replaces profile p7's 17 dB(A), Ø 40–200.
        // https://brandportal.uponor.com/m/b5fb3a47079edd9e/original/GF-BFS-Brochure-Silenta-3A.pdf
        // Noise: owner confirmed 2026-11-13, 9 dB(A) @ 2 l/s and 16 dB(A) @ 4 l/s (matches GF's range brochure, not the 15 in the 3A brochure).
        specs: [
          { key: "diameter", value: "Ø 32–200 mm" },
          { key: "acoustic", value: "9 dB(A) @ 2 l/s · 16 dB(A) @ 4 l/s · EN 14366" },
          { key: "fire", value: "D-s2, d2 · EN 13501-1" },
          { key: "standards", value: "EN 1451 · EN 14366 · ISO 9969" },
        ],
        source: "manufacturer:2026-11-13",
      },
      {
        id: "poloKalNg",
        name: "POLO-KAL NG",
        brand: "poloplast",
        // Poloplast performance profile POLO-KAL NG (2024-04, poloplast.com, checked 2026-11-13; test report P-BA 297/2017):
        // replaces profile p13's Ø 32–200. 2 l/s: profile p13 (18 dB(A) @ 2 l/s, EN 14366); owner 2026-11-13: show both flows.
        // https://www.poloplast.com/fileadmin/downloads/downloads_gesamt/Gebaudeentwasserung_POLO-KAL/Leistungsprofil_POLO-KAL_NG_FR_A4_240409_LAY.pdf
        specs: [
          { key: "diameter", value: "Ø 32–250 mm" },
          { key: "acoustic", value: "18 dB(A) @ 2 l/s · 22 dB(A) @ 4 l/s · EN 14366 / DIN 4109" },
          { key: "fire", value: "B2 · DIN 4102 · D-s2, d1 · EN 13501-1" },
          { key: "standards", value: "EN 1451-1 · EN ISO 9969 · EN 13501-1" },
        ],
        source: "manufacturer:2026-11-13",
      },
      {
        id: "poloKal3s",
        name: "POLO-KAL 3S",
        brand: "poloplast",
        // Poloplast performance profile POLO-KAL 3S (2021-02, poloplast.com, checked 2026-11-13; Fraunhofer IBP report
        // P-BA 248/2009): replaces profile p13's 12 dB(A) @ 4 l/s.
        // https://www.poloplast.com/fileadmin/downloads/downloads_gesamt/Gebaudeentwasserung_POLO-KAL/Leistungsprofil_POLO-KAL_3S_A4_02_2021.pdf
        specs: [
          { key: "diameter", value: "Ø 75–160 mm" },
          { key: "acoustic", value: "18 dB(A) @ 4 l/s · DIN 4109" },
          { key: "fire", value: "B2 · DIN 4102 · D-s2, d1 · EN 13501-1" },
          { key: "standards", value: "EN 1451-1 · DIN 4109 · EN 13501-1" },
        ],
        source: "manufacturer:2026-11-13",
      },
      {
        id: "aquaSilent",
        name: "Aqua Silent PP",
        brand: "aquapa",
        specs: [
          { key: "diameter", value: "Ø 50–160 mm" },
          { key: "acoustic", value: "22 dB(A) @ 4 l/s" },
          // Profile p9 listed EN ISO 15874, DIN 8077/8078 and ASTM F2389 here: standards for PP-R pressure pipes,
          // not drainage. Removed 2026-11-13 (owner asked for the manufacturer's figures); Aquapa's site could
          // not be reached to confirm the right ones, so none are shown until its datasheet is checked.
        ],
        source: "profile:p9",
      },
      {
        id: "skolanSafe",
        name: "Skolan Safe",
        brand: "ostendorf",
        specs: [
          { key: "diameter", value: "Ø 58–200 mm" },
          { key: "acoustic", value: "17 dB(A) @ 4 l/s" },
          { key: "fire", value: "B2 · DIN 4102" },
          { key: "standards", value: "DIN EN 1451-1 · DIN EN 12056 · DIN 1986-100" },
        ],
        source: "profile:p16",
      },
      {
        id: "htSafe",
        name: "HT Safe",
        brand: "ostendorf",
        specs: [
          { key: "diameter", value: "Ø 32–160 mm" },
          { key: "acoustic", value: "21 dB(A) @ 4 l/s" },
          { key: "fire", value: "B1" },
          { key: "standards", value: "DIN EN 1451-1 · DIN 19560-10 · DIN 8078" },
        ],
        source: "profile:p16",
      },
      {
        id: "kgSystem",
        name: "KG-System",
        brand: "ostendorf",
        specs: [
          { key: "diameter", value: "Ø 110–500 mm" },
          { key: "material", value: "PVC-U" },
          { key: "stiffness", value: "SN 4 · 8 · 10" },
          { key: "standards", value: "DIN EN 13476-2 · DIN EN 1401-1" },
        ],
        source: "profile:p16",
      },
      {
        id: "boroug",
        name: "Boroug UPVC",
        brand: "boroug",
        specs: [
          { key: "diameter", value: "Ø 25–160 mm" },
          { key: "length", value: "6–12 m" },
          { key: "material", value: "PVC-U" },
          { key: "standards", value: "DIN 8061 · ISO/R 1183 · ISO/R 527 · DIN 52612" },
        ],
        source: "profile:p17",
      },
    ],
  },
  {
    slug: "water-heaters",
    icon: "waterHeater",
    photos: [
      { src: "/images/solutions/water-heaters-1.jpg", brand: "saudi-ceramics" },
    ],
    wall: 6,
    spec: "10–300 L · 8.5 bar",
    lines: [
      {
        id: "aquahot",
        name: "Aquahot",
        brand: "saudi-ceramics",
        logo: "/brands/aquahot.svg",
        specs: [
          { key: "capacity", value: "10 · 15 · 30 · 50 · 80 · 100 · 120 · 150 · 200 · 300 L" },
          { key: "rating", value: "8.5 bar" },
          { key: "standards", value: "SASO · IEC 60335-2-21:2020" },
        ],
        source: "profile:p10",
      },
    ],
  },
  {
    slug: "infrastructure",
    icon: "network",
    photos: [
      { src: "/images/solutions/infrastructure-1.jpg", brand: "pimtas" },
      { src: "/images/solutions/infrastructure-2.jpg", brand: "pimtas" },
      { src: "/images/solutions/infrastructure-3.jpg", brand: "turan-borfit" },
      { src: "/images/solutions/infrastructure-4.jpg", brand: "turan-borfit" },
      { src: "/images/solutions/infrastructure-5.jpg", brand: "georg-fischer" },
    ],
    wall: 3,
    spec: "PE100 · U-PVC · Ø 20–2000",
    lines: [
      {
        id: "pimtasPe100",
        name: "PE100 pipe and fittings",
        brand: "pimtas",
        specs: [
          { key: "diameter", value: "Ø 20–63 mm" },
          { key: "length", value: "6–12 m · 100 m" },
          { key: "pressure", value: "PN 6 · 10 · 16 · 20" },
          { key: "standards", value: "ISO 4427-2 · EN 12201-2 · DIN 8074/8075" },
        ],
        source: "profile:p11",
      },
      {
        id: "pimtasUpvc",
        name: "U-PVC pressure pipe",
        brand: "pimtas",
        specs: [
          { key: "diameter", value: "Ø 20–400 mm" },
          { key: "length", value: "6 m" },
          { key: "pressure", value: "PN 6 · 10 · 16" },
          { key: "standards", value: "EN ISO 1452-2 · DIN 8061/8062 · ISO 4422" },
        ],
        source: "profile:p11",
      },
      { id: "nassarUpvc", name: "NASSAR uPVC", brand: "nassar", specs: [{ key: "material", value: "uPVC" }], source: "confirmed:2026-11-13" },
      {
        id: "pimtasCompression",
        name: "Compression fittings",
        brand: "pimtas",
        specs: [
          { key: "diameter", value: "Ø 20–110 mm · ½″–4″" },
          { key: "pressure", value: "PN 10 · 16" },
          { key: "standards", value: "DIN EN 12201 · ISO 11922-1 · DIN 8074" },
        ],
        source: "profile:p11",
      },
      {
        id: "turanPeFittings",
        name: "PE fittings",
        brand: "turan-borfit",
        specs: [
          { key: "diameter", value: "Ø 20–2000 mm" },
          { key: "pressure", value: "PN 10 · 16 · 20 · 25" },
          { key: "standards", value: "EN 1555 · EN 12201 · ISO 4437" },
        ],
        source: "profile:p12",
      },
      {
        id: "turanPe100",
        name: "PE100 pipe",
        brand: "turan-borfit",
        specs: [
          { key: "diameter", value: "Ø 20–125 mm" },
          { key: "length", value: "6–12 m · 100 m" },
          { key: "pressure", value: "PN 10 · 16 · 20 · 25" },
          { key: "standards", value: "EN 1555 · EN 12201 · ISO 4437" },
        ],
        source: "profile:p12",
      },
      {
        id: "gfPe100",
        name: "PE100",
        brand: "georg-fischer",
        specs: [
          { key: "diameter", value: "Ø 20–355 mm" },
          { key: "length", value: "6–12.5 m" },
          { key: "sdr", value: "SDR 9 · 11" },
          { key: "standards", value: "EN 12201-2 · ISO 4427:2019" },
        ],
        source: "profile:p7",
      },
      {
        id: "baenningerPe",
        name: "Bänninger PE · PVC-U",
        brand: "baenninger",
        specs: [
          { key: "material", value: "PE · PVC-U" },
          { key: "diameter", value: "Ø 8–1000 mm" },
        ],
        source: "site:/ar/الوكالات/",
      },
    ],
  },
  {
    slug: "galvanized-fittings",
    icon: "fitting",
    // Photo supplied by the owner, 2026-10-05 (the profile's Georg Fischer page shows only the building).
    photos: [{ src: "/images/solutions/galvanized-fittings-2.jpg", brand: "georg-fischer" }],
    wall: 4,
    spec: "EN 10242",
    lines: [
      {
        id: "gfMalleable",
        name: "Malleable iron fittings",
        brand: "georg-fischer",
        specs: [{ key: "standards", value: "EN 10242" }],
        // Owner, 2026-10-04: these Georg Fischer fittings are produced in Austria.
        madeIn: "AT",
        source: "site:/ar/الوكالات/",
      },
    ],
  },
  {
    slug: "sanitaryware",
    icon: "toilet",
    photos: [
      { src: "/images/solutions/sanitaryware-1.jpg", brand: "saudi-ceramics" },
      { src: "/images/solutions/sanitaryware-2.jpg", brand: "quarterbath" },
      { src: "/images/solutions/sanitaryware-3.jpg", brand: "wisa" },
      { src: "/images/solutions/sanitaryware-4.jpg", brand: "saudi-ceramics" },
      { src: "/images/solutions/sanitaryware-5.jpg", brand: "quarterbath" },
      { src: "/images/solutions/sanitaryware-6.jpg", brand: "quarterbath" },
    ],
    wall: 8,
    spec: "Dual flush 3/6 L · SASO · CE",
    lines: [
      {
        id: "oryx",
        name: "Oryx sanitaryware",
        brand: "saudi-ceramics",
        specs: [
          { key: "flush", value: "3/6 L" },
          { key: "standards", value: "SASO · ISO 9001 · CE · WRAS" },
        ],
        source: "profile:p10",
      },
      {
        id: "quarterbathSanitary",
        name: "Sanitaryware",
        brand: "quarterbath",
        specs: [
          { key: "flush", value: "3/6 L" },
          { key: "standards", value: "SASO · ISO 9001 · CE · WRAS" },
        ],
        source: "profile:p15",
      },
      {
        id: "quarterbathFurniture",
        name: "Bathroom furniture",
        brand: "quarterbath",
        specs: [{ key: "standards", value: "ISO 9001 · CE" }],
        source: "profile:p15",
      },
      {
        id: "quarterbathCistern",
        name: "Concealed cistern",
        brand: "quarterbath",
        specs: [
          { key: "flush", value: "3/6 L · ≤ 7.5 L" },
          { key: "standards", value: "SASO · ISO 9001" },
        ],
        source: "profile:p15",
      },
      {
        id: "wisaPrewall",
        name: "Pre-wall elements and built-in cisterns",
        brand: "wisa",
        specs: [
          { key: "flush", value: "3/6 L · ≤ 7.5 L" },
          { key: "standards", value: "WELS 3-star · SASO · ISO 9001 · CE · KIWA" },
        ],
        source: "profile:p14",
      },
      // Owner 2026-11-13: AtlasPlast stocks Fluidmaster concealed cisterns and spare parts.
      { id: "fluidmasterCistern", name: "Concealed cisterns", brand: "fluidmaster", specs: [], source: "confirmed:2026-11-13" },
      { id: "fluidmasterParts", name: "Cistern spare parts", brand: "fluidmaster", specs: [], source: "confirmed:2026-11-13" },
    ],
  },
  {
    // Owner, 2026-10-05: ceramic and porcelain tiles are a solution of their own (the tenth).
    slug: "tiles",
    icon: "tiles",
    photos: [
      { src: "/images/solutions/tiles-1.jpg", brand: "saudi-ceramics" },
      { src: "/images/solutions/tiles-2.jpg", brand: "saudi-ceramics" },
    ],
    wall: 8,
    spec: "30×30 – 120×60 cm · R9 – R11",
    lines: [
      {
        id: "saudiPorcelain",
        name: "Porcelain tiles",
        brand: "saudi-ceramics",
        specs: [
          { key: "sizes", value: "30×30 · 60×60 · 30×60 · 120×60 cm" },
          { key: "thickness", value: "10 mm" },
          { key: "absorption", value: "≤ 0.5 %" },
          { key: "slip", value: "R9 · R10 · R11" },
          { key: "standards", value: "ISO 9001:2015 · SASO QM · CE · ESMA · G-Mark" },
        ],
        source: "profile:p10",
      },
      {
        id: "saudiCeramic",
        name: "Ceramic tiles",
        brand: "saudi-ceramics",
        specs: [
          { key: "sizes", value: "30×30 · 60×60 · 30×60 cm" },
          { key: "thickness", value: "8 · 9 · 10 · 12 mm" },
          { key: "absorption", value: "≤ 3 %" },
          { key: "standards", value: "ISO 9001:2015 · SASO QM · CE · ESMA · G-Mark" },
        ],
        source: "profile:p10",
      },
    ],
  },
  {
    slug: "pumps",
    icon: "pump",
    photos: [
      { src: "/images/solutions/pumps-1.jpg", brand: "dab" },
    ],
    wall: 5,
    spec: "≤ 10 bar · 0–110 °C",
    lines: [
      {
        id: "dab",
        name: "DAB pumps",
        brand: "dab",
        specs: [
          { key: "head", value: "≤ 400 m" },
          { key: "temperature", value: "0–110 °C" },
          { key: "rating", value: "≤ 10 bar" },
          { key: "standards", value: "ISO 9001:2015 · ISO 14001 · ISO 45001" },
        ],
        source: "profile:p19",
      },
    ],
  },
  {
    slug: "faucets-valves",
    icon: "faucet",
    photos: [
      { src: "/images/solutions/faucets-valves-1.jpg", brand: "guarri" },
      { src: "/images/solutions/faucets-valves-2.jpg" },
      { src: "/images/solutions/faucets-valves-3.jpg" },
      { src: "/images/solutions/faucets-valves-4.jpg", brand: "pimtas" },
    ],
    wall: 10,
    spec: "NSF/ANSI 61 · DVGW",
    lines: [
      {
        id: "kas",
        name: "KAS faucets",
        brand: "kas",
        specs: [{ key: "standards", value: "ISO 9001:2015 · NSF/ANSI 61 · NSF/ANSI 372" }],
        source: "profile:p18",
      },
      {
        id: "shield",
        name: "Valves and faucets",
        brand: "shield",
        specs: [],
        source: "profile:p18",
      },
      {
        id: "guarriFaucets",
        name: "Guarri faucets",
        brand: "guarri",
        specs: [{ key: "standards", value: "ISO 9001:2015 · DVGW · NSF · CE" }],
        source: "profile:p18",
      },
      {
        id: "topsanFaucets",
        name: "Topsan faucets",
        brand: "topsan",
        specs: [{ key: "cartridge", value: "35 mm · 40 mm" }],
        source: "manufacturer:2026-10-05",
      },
      {
        id: "topsanShower",
        name: "Built-in valves, shower sets and valves",
        brand: "topsan",
        specs: [],
        source: "manufacturer:2026-10-05",
      },
    ],
  },
  {
    slug: "installation-tools",
    icon: "wrench",
    photos: [
      { src: "/images/solutions/installation-tools-1.jpg", brand: "turan-borfit" },
      { src: "/images/solutions/installation-tools-2.jpg", brand: "turan-borfit" },
      { src: "/images/solutions/installation-tools-3.jpg", brand: "ascelik" },
      { src: "/images/solutions/installation-tools-4.jpg", brand: "candan" },
    ],
    wall: 7,
    spec: "Welding Ø 20–1200 · fixings",
    lines: [
      {
        id: "turanWelding",
        name: "Butt welding machines",
        brand: "turan-borfit",
        specs: [{ key: "weldRange", value: "Ø 20–1200 mm · PE · PP" }],
        source: "profile:p12",
      },
      {
        id: "candan",
        name: "Welding machines",
        brand: "candan",
        specs: [
          { key: "weldRange", value: "Ø 20–110 mm" },
          { key: "temperature", value: "≤ 300 °C" },
          { key: "power", value: "700–2,400 W · 220–240 V" },
        ],
        source: "profile:p19",
      },
      {
        id: "ascelik",
        name: "Clamps and profiles",
        brand: "ascelik",
        specs: [{ key: "standards", value: "ISO 9001:2015 · CE · UL · FM" }],
        source: "profile:p19",
      },
      {
        id: "guarriChemicals",
        name: "Chemical anchors and sealants",
        brand: "guarri",
        specs: [{ key: "standards", value: "ISO 9001:2015" }],
        source: "profile:p18",
      },
    ],
  },
];

export type SolutionSlug = (typeof solutions)[number]["slug"];

export function solutionBySlug(slug: string) {
  return solutions.find((s) => s.slug === slug);
}

/** Message key for a solution slug (Solutions.<key>). */
export function solutionKey(slug: string) {
  return slug.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

/** A brand's product lines grouped by the solution they belong to, in solution order. */
/** Solutions and lines for a brand; a sister brand (see Brand.sisterOf) shows its sister's range. */
export function brandSolutions(slug: string) {
  const brand = brands.find((b) => b.slug === slug)?.sisterOf ?? slug;
  return solutions
    .map((solution) => ({ solution, lines: solution.lines.filter((l) => l.brand === brand) }))
    .filter((group) => group.lines.length > 0);
}
