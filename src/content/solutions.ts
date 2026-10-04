import type { Source } from "./types";

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
  | "standards";

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
  source: Source;
};

export type Solution = {
  slug: string;
  /** Wall ratio for the SectionGlyph marker. */
  wall: number;
  /** One-line technical summary for indexes. */
  spec: string;
  lines: ProductLine[];
};

export const solutions: Solution[] = [
  {
    slug: "water-supply",
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
        name: "Bänninger PP-R",
        brand: "baenninger",
        specs: [
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
        brand: "polo-egypt",
        specs: [
          { key: "diameter", value: "Ø 20–110 mm" },
          { key: "length", value: "4–6 m" },
          { key: "pressure", value: "PN 10 · 16 · 20 · 25" },
          { key: "standards", value: "DIN 8077 · DIN 8078 · ISO 15874" },
        ],
        source: "profile:p17",
      },
    ],
  },
  {
    slug: "drainage",
    wall: 4,
    spec: "PVC-U · PP · Silent · Ø 25–500",
    lines: [
      {
        id: "boroug",
        name: "Boroug UPVC",
        brand: "polo-egypt",
        specs: [
          { key: "diameter", value: "Ø 25–160 mm" },
          { key: "length", value: "6–12 m" },
          { key: "material", value: "PVC-U" },
          { key: "standards", value: "DIN 8061 · ISO/R 1183 · ISO/R 527 · DIN 52612" },
        ],
        source: "profile:p17",
      },
      {
        id: "silentaPremium",
        name: "Silenta Premium",
        brand: "georg-fischer",
        specs: [
          { key: "diameter", value: "Ø 58–200 mm" },
          { key: "acoustic", value: "7 dB(A) @ 2 l/s · EN 14366" },
          { key: "fire", value: "B2 · DIN 4102" },
          { key: "standards", value: "DIN 4109 · DIN 4102-B2" },
        ],
        source: "profile:p7",
      },
      {
        id: "silenta3a",
        name: "Silenta 3A",
        brand: "georg-fischer",
        specs: [
          { key: "diameter", value: "Ø 40–200 mm" },
          { key: "acoustic", value: "17 dB(A) @ 4 l/s · EN 14366" },
          { key: "fire", value: "B2 · DIN 4102" },
          { key: "standards", value: "DIN EN 1451-1 · DIN 4109 · DIN 4102-B2" },
        ],
        source: "profile:p7",
      },
      {
        id: "poloKalNg",
        name: "POLO-KAL NG",
        brand: "poloplast",
        specs: [
          { key: "diameter", value: "Ø 32–200 mm" },
          { key: "acoustic", value: "18 dB(A) @ 2 l/s · EN 14366" },
          { key: "fire", value: "B2 · DIN 4102" },
          { key: "standards", value: "EN 1451-1 · EN ISO 9969 · EN 13501-1" },
        ],
        source: "profile:p13",
      },
      {
        id: "poloKal3s",
        name: "POLO-KAL 3S",
        brand: "poloplast",
        specs: [
          { key: "diameter", value: "Ø 75–160 mm" },
          { key: "acoustic", value: "12 dB(A) @ 4 l/s · DIN 4109" },
          { key: "fire", value: "D-s2 · B2" },
          { key: "standards", value: "DIN EN 12056 · EN 14366 · DIN 4109" },
        ],
        source: "profile:p13",
      },
      {
        id: "aquaSilent",
        name: "Aqua Silent PP",
        brand: "aquapa",
        specs: [
          { key: "diameter", value: "Ø 50–160 mm" },
          { key: "acoustic", value: "22 dB(A) @ 4 l/s" },
          { key: "standards", value: "EN ISO 15874 · DIN 8077 · DIN 8078 · ASTM F2389" },
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
    ],
  },
  {
    slug: "water-heaters",
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
    ],
  },
  {
    slug: "sanitaryware",
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
        id: "saudiTiles",
        name: "Porcelain and ceramic tiles",
        brand: "saudi-ceramics",
        specs: [
          { key: "sizes", value: "30×30 · 60×60 · 30×60 · 120×60 cm" },
          { key: "standards", value: "ISO 9001 · SASO QM · CE" },
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
    ],
  },
  {
    slug: "pumps",
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
    ],
  },
  {
    slug: "installation-tools",
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
export function brandSolutions(brand: string) {
  return solutions
    .map((solution) => ({ solution, lines: solution.lines.filter((l) => l.brand === brand) }))
    .filter((group) => group.lines.length > 0);
}
