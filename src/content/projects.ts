import type { Localized, Source } from "./types";

/** Sector keys map to localized labels in messages (Projects.sectors). */
export type Sector =
  | "transport"
  | "sport"
  | "hospitality"
  | "healthcare"
  | "government"
  | "residential"
  | "education";

export type Project = {
  slug: string;
  name: Localized;
  sector: Sector;
  source: Source;
};

/**
 * Projects supplied with AtlasPlast products. The sources give names only:
 * no year, scope or quantities, so none are shown.
 */
export const featuredProjects: Project[] = [
  { slug: "erbil-international-airport", sector: "transport", source: "profile:p25",
    name: { en: "Erbil International Airport", ar: "مطار أربيل الدولي", ckb: "فڕۆکەخانەی نێودەوڵەتیی هەولێر" } },
  { slug: "baghdad-international-airport", sector: "transport", source: "site:/ar/من-نحن/",
    name: { en: "Baghdad International Airport", ar: "مطار بغداد الدولي", ckb: "فڕۆکەخانەی نێودەوڵەتیی بەغدا" } },
  { slug: "basra-international-stadium", sector: "sport", source: "profile:p25",
    name: { en: "Basra International Stadium", ar: "ملعب البصرة الدولي", ckb: "یاریگای نێودەوڵەتیی بەسرە" } },
  { slug: "al-anbar-international-stadium", sector: "sport", source: "profile:p25",
    name: { en: "Al-Anbar International Stadium", ar: "ملعب الأنبار الدولي", ckb: "یاریگای نێودەوڵەتیی ئەنبار" } },
  { slug: "movenpick-hotel", sector: "hospitality", source: "profile:p25",
    name: { en: "Mövenpick Hotel", ar: "فندق موفنبيك", ckb: "هوتێلی مۆڤنپیک" } },
  { slug: "babylon-rotana", sector: "hospitality", source: "site:/ar/من-نحن/",
    name: { en: "Babylon Rotana Hotel", ar: "فندق بابل روتانا", ckb: "هوتێلی بابل ڕۆتانا" } },
  { slug: "grand-millennium-sulaymaniyah", sector: "hospitality", source: "site:/ar/من-نحن/",
    name: { en: "Grand Millennium Sulaymaniyah", ar: "فندق غراند ميلينيوم السليمانية", ckb: "هوتێلی گراند میلێنیۆم، سلێمانی" } },
  { slug: "ibn-sina-hospital", sector: "healthcare", source: "profile:p25",
    name: { en: "Ibn Sina Hospital", ar: "مستشفى ابن سينا", ckb: "نەخۆشخانەی ئیبن سینا" } },
  { slug: "al-sidra-hospital", sector: "healthcare", source: "profile:p25",
    name: { en: "Al-Sidra Hospital", ar: "مستشفى السدرة", ckb: "نەخۆشخانەی سیدرە" } },
  { slug: "embassies-complex", sector: "government", source: "profile:p25",
    name: { en: "Embassies Complex", ar: "مجمع السفارات", ckb: "کۆمەڵگەی باڵیۆزخانەکان" } },
  { slug: "mrf-quartet-towers", sector: "residential", source: "site:/ar/من-نحن/",
    name: { en: "MRF Quartet Towers, Erbil", ar: "أبراج MRF الأربعة، أربيل", ckb: "چوار تاوەرەکەی MRF، هەولێر" } },
  { slug: "modern-basra-complex", sector: "residential", source: "profile:p25",
    name: { en: "Modern Basra Complex", ar: "مجمع البصرة الحديثة", ckb: "کۆمەڵگەی بەسرەی نوێ" } },
  { slug: "life-towers", sector: "residential", source: "profile:p25",
    name: { en: "Life Towers", ar: "أبراج لايف", ckb: "تاوەرەکانی لایف" } },
  { slug: "chinese-1000-schools", sector: "education", source: "profile:p25",
    name: { en: "Chinese 1,000 Schools Project", ar: "مشروع الألف مدرسة الصيني", ckb: "پڕۆژەی هەزار قوتابخانەی چینی" } },
];

/** Contractor clients, published with approval (confirmed 2026-10-04). Official names, not translated. */
export const clients: string[] = [
  "Al-Ashtar Company", "Al-Muraba Engineering Company", "Al-Mustaqbal Company", "Al-Naji Company",
  "AlSahara Alkubra Co.", "Al-Sheed Company", "Al-Tayyar Group", "Al-Usloob Al-Raqi", "Al-Watar Engineering",
  "Anwar Al-Madaen Company", "Asas Al-Alamiya", "Elegancia MEP", "GCITJ Babel Limited", "Ghadaq Mechanical Works",
  "Horizons of Giving", "Halat Group", "Imar Al-Wasat Co.", "Jazirat Al-Ataa Co.", "Jwan Company",
  "Khaimat Baghdad", "Khairat Al-Sibtain", "Miran Co.", "Nahj Baghdad", "North Light", "Nuhoğlu Construction",
  "Pencil Design", "Power China International Group Limited", "Qimmah Aali Al-Abraj Co.", "Radiation Energy Co.",
  "Ramla Co.", "Sama Zahid Company", "Shahan Company", "Sigma Company", "Tawseea Al-Gharbiya Co.", "UB Group", "UCC",
];
