import type { Localized, Source } from "./types";
import type { CITY_POINTS } from "./iraq-map";

export const company = {
  name: "AtlasPlast",
  legalName: "Ufuq Al-Atlas Ltd.",
  foundingYear: 1975,
  firstShowroomYear: 1990,
  email: "info@atlasplast.iq",
  /** Short-code main line. Source: confirmed:2026-10-04 */
  mainPhone: "6779",
  whatsapp: "+964 783 305 6475",
  projectsPhone: "+964 772 267 1130",
  social: {
    facebook: "https://www.facebook.com/AtlasPlast.llc/",
    instagram: "https://www.instagram.com/atlasplast.iq/",
    linkedin: "https://www.linkedin.com/company/atlas-plast",
  },
} as const;

/** Headline figures. Only figures confirmed consistent across sources are listed. */
export const facts = [
  { key: "agents", value: "600+", source: "profile:p4,p23,p27" },
  { key: "brands", value: "23", source: "profile:p4" },
  { key: "trained", value: "6,000+", source: "profile:p20" },
  { key: "stock", value: "6", source: "profile:p9-10" },
] as const satisfies readonly { key: string; value: string; source: Source }[];

type City = keyof typeof CITY_POINTS;

export type Office = {
  id: string;
  city: City;
  name: Localized;
  hq?: boolean;
  phone?: string;
  source: Source;
};

export const offices: Office[] = [
  {
    id: "camp-sara",
    city: "baghdad",
    hq: true,
    name: { en: "Camp Sara, Baghdad", ar: "كمب سارة، بغداد", ckb: "کەمپ سارە، بەغدا" },
    phone: "+964 783 305 6475",
    source: "confirmed:2026-10-04",
  },
  {
    id: "al-shaab",
    city: "baghdad",
    name: { en: "Al-Shaab, Baghdad", ar: "الشعب، بغداد", ckb: "شەعب، بەغدا" },
    source: "confirmed:2026-10-04",
  },
  {
    id: "najaf",
    city: "najaf",
    name: { en: "Najaf", ar: "النجف", ckb: "نەجەف" },
    phone: "+964 783 700 6314",
    source: "profile:p29",
  },
  {
    id: "basra",
    city: "basra",
    name: { en: "Basra", ar: "البصرة", ckb: "بەسرە" },
    phone: "+964 787 116 6601",
    source: "confirmed:2026-10-04",
  },
  {
    id: "erbil",
    city: "erbil",
    name: { en: "Erbil", ar: "أربيل", ckb: "هەولێر" },
    phone: "+964 787 803 0001",
    source: "confirmed:2026-10-04",
  },
  {
    id: "duhok",
    city: "duhok",
    name: { en: "Duhok", ar: "دهوك", ckb: "دهۆک" },
    phone: "+964 750 991 0065",
    source: "profile:p29",
  },
];

export const warehouses: { id: City; name: Localized; source: Source }[] = [
  { id: "baghdad", name: { en: "Baghdad", ar: "بغداد", ckb: "بەغدا" }, source: "confirmed:2026-10-04" },
  { id: "basra", name: { en: "Basra", ar: "البصرة", ckb: "بەسرە" }, source: "confirmed:2026-10-04" },
  { id: "erbil", name: { en: "Erbil", ar: "أربيل", ckb: "هەولێر" }, source: "confirmed:2026-10-04" },
  { id: "duhok", name: { en: "Duhok", ar: "دهوك", ckb: "دهۆک" }, source: "confirmed:2026-10-04" },
  { id: "zakho", name: { en: "Zakho", ar: "زاخو", ckb: "زاخۆ" }, source: "confirmed:2026-10-04" },
];

export const regionalOffices: Localized[] = [
  { en: "Saudi Arabia", ar: "السعودية", ckb: "سعوودیە" },
  { en: "Turkey", ar: "تركيا", ckb: "تورکیا" },
  { en: "Syria", ar: "سوريا", ckb: "سووریا" },
  { en: "Egypt", ar: "مصر", ckb: "میسر" },
];
