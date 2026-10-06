import type { Localized, Source } from "./types";

/** Sector keys map to localized labels in messages (Projects.sectors). */
export type Sector =
  | "transport"
  | "sport"
  | "hospitality"
  | "healthcare"
  | "education"
  | "government"
  | "commercial"
  | "residential";

/** Order of the sector groups on the Projects page (housing, the longest, last). */
export const sectorOrder: Sector[] = [
  "transport",
  "sport",
  "hospitality",
  "healthcare",
  "education",
  "government",
  "commercial",
  "residential",
];

export const governorateNames = {
  baghdad: { en: "Baghdad", ar: "بغداد", ckb: "بەغدا" },
  anbar: { en: "Al-Anbar", ar: "الأنبار", ckb: "ئەنبار" },
  basra: { en: "Basra", ar: "البصرة", ckb: "بەسرە" },
  erbil: { en: "Erbil", ar: "أربيل", ckb: "هەولێر" },
  duhok: { en: "Duhok", ar: "دهوك", ckb: "دهۆک" },
  karbala: { en: "Karbala", ar: "كربلاء", ckb: "کەربەلا" },
  all: { en: "Across Iraq", ar: "عموم العراق", ckb: "سەرانسەری عێراق" },
} satisfies Record<string, Localized>;

export type Project = {
  slug: string;
  name: Localized;
  sector: Sector;
  governorate?: keyof typeof governorateNames;
  /** Brand slugs (brands.ts) of the products AtlasPlast supplied. */
  brands?: string[];
  /** Shown in the Home page selection. */
  featured?: true;
  source: Source;
};

/** The owner's projects list, sent 2026-10-06 (atlas/sources/projects-owner-2026-10-06.xlsx). */
const OWNER_LIST: Source = "confirmed:2026-10-06";

/**
 * Projects supplied with AtlasPlast products. The sources give no year, scope or
 * quantities, so none are shown. NASSAR, listed on three projects in the owner's
 * sheet, is left out of `brands` until it is a brand on the site.
 */
export const projects: Project[] = [
  { slug: "erbil-international-airport", sector: "transport", featured: true, source: "profile:p25",
    name: { en: "Erbil International Airport", ar: "مطار أربيل الدولي", ckb: "فڕۆکەخانەی نێودەوڵەتیی هەولێر" } },
  { slug: "baghdad-international-airport", sector: "transport", featured: true, source: "site:/ar/من-نحن/",
    name: { en: "Baghdad International Airport", ar: "مطار بغداد الدولي", ckb: "فڕۆکەخانەی نێودەوڵەتیی بەغدا" } },
  { slug: "basra-international-stadium", sector: "sport", featured: true, source: "profile:p25",
    name: { en: "Basra International Stadium", ar: "ملعب البصرة الدولي", ckb: "یاریگای نێودەوڵەتیی بەسرە" } },
  { slug: "al-anbar-international-stadium", sector: "sport", featured: true, source: "profile:p25",
    governorate: "anbar", brands: ["aquapa"],
    name: { en: "Al-Anbar International Stadium", ar: "ملعب الأنبار الدولي", ckb: "یاریگای نێودەوڵەتیی ئەنبار" } },
  { slug: "movenpick-hotel", sector: "hospitality", featured: true, source: "profile:p25",
    governorate: "baghdad", brands: ["georg-fischer", "polymelt", "pimtas"],
    name: { en: "Mövenpick Hotel", ar: "فندق موفنبيك", ckb: "هوتێلی مۆڤنپیک" } },
  { slug: "babylon-rotana", sector: "hospitality", featured: true, source: "site:/ar/من-نحن/",
    name: { en: "Babylon Rotana Hotel", ar: "فندق بابل روتانا", ckb: "هوتێلی بابل ڕۆتانا" } },
  { slug: "grand-millennium-sulaymaniyah", sector: "hospitality", featured: true, source: "site:/ar/من-نحن/",
    name: { en: "Grand Millennium Sulaymaniyah", ar: "فندق غراند ميلينيوم السليمانية", ckb: "هوتێلی گراند میلێنیۆم، سلێمانی" } },
  { slug: "ibn-sina-hospital", sector: "healthcare", featured: true, source: "profile:p25",
    name: { en: "Ibn Sina Hospital", ar: "مستشفى ابن سينا", ckb: "نەخۆشخانەی ئیبن سینا" } },
  { slug: "al-sidra-hospital", sector: "healthcare", featured: true, source: "profile:p25",
    name: { en: "Al-Sidra Hospital", ar: "مستشفى السدرة", ckb: "نەخۆشخانەی سیدرە" } },
  { slug: "embassies-complex", sector: "government", featured: true, source: "profile:p25",
    name: { en: "Embassies Complex", ar: "مجمع السفارات", ckb: "کۆمەڵگەی باڵیۆزخانەکان" } },
  { slug: "mrf-quartet-towers", sector: "residential", featured: true, source: "site:/ar/من-نحن/",
    name: { en: "MRF Quartet Towers, Erbil", ar: "أبراج MRF الأربعة، أربيل", ckb: "چوار تاوەرەکەی MRF، هەولێر" } },
  { slug: "modern-basra-complex", sector: "residential", featured: true, source: "profile:p25",
    name: { en: "Modern Basra Complex", ar: "مجمع البصرة الحديثة", ckb: "کۆمەڵگەی بەسرەی نوێ" } },
  { slug: "life-towers", sector: "residential", featured: true, source: "profile:p25",
    name: { en: "Life Towers", ar: "أبراج لايف", ckb: "تاوەرەکانی لایف" } },
  // The owner's sheet lists the schools twice: across Iraq and the Al-Anbar group.
  { slug: "chinese-1000-schools", sector: "education", featured: true, source: "profile:p25",
    governorate: "all", brands: ["georg-fischer", "turan-borfit", "alvit", "aquapa", "quarterbath"],
    name: { en: "Chinese 1,000 Schools Project", ar: "مشروع الألف مدرسة الصيني", ckb: "پڕۆژەی هەزار قوتابخانەی چینی" } },

  // From the owner's list, in its order.
  { slug: "jawahir-dijla-complex", sector: "residential", governorate: "baghdad", brands: ["saudi-ceramics"], source: OWNER_LIST,
    name: { en: "Jawahir Dijla Complex", ar: "مجمع جواهر دجلة", ckb: "کۆمەڵگەی جەواهیری دیجلە" } },
  { slug: "al-hadi-towers", sector: "residential", governorate: "baghdad", brands: ["wisa"], source: OWNER_LIST,
    name: { en: "Al-Hadi Towers", ar: "أبراج الهادي", ckb: "تاوەرەکانی هادی" } },
  { slug: "mpc-villas-complex", sector: "residential", governorate: "anbar", brands: ["georg-fischer", "aquapa", "wisa"], source: OWNER_LIST,
    name: { en: "MPC Villas Complex", ar: "مجمع فلل MPC", ckb: "کۆمەڵگەی ڤێلاکانی MPC" } },
  { slug: "anbar-burns-hospital", sector: "healthcare", governorate: "anbar", brands: ["aquapa", "wisa"], source: OWNER_LIST,
    name: { en: "Burns Hospital", ar: "مستشفى الحروق", ckb: "نەخۆشخانەی سووتاوان" } },
  { slug: "al-nakheel-mall", sector: "commercial", governorate: "anbar", brands: ["baenninger", "wisa"], source: OWNER_LIST,
    name: { en: "Al-Nakheel Mall", ar: "مول النخيل", ckb: "مۆڵی نەخیل" } },
  { slug: "prime-village-prime-view", sector: "residential", governorate: "duhok", brands: ["wisa"], source: OWNER_LIST,
    name: { en: "Prime Village and Prime View", ar: "برايم فيلج وبرايم فيو", ckb: "پرایم ڤیلج و پرایم ڤیو" } },
  { slug: "family-mall-erbil", sector: "commercial", governorate: "erbil", brands: ["wisa"], source: OWNER_LIST,
    name: { en: "Family Mall", ar: "فاميلي مول", ckb: "فامیلی مۆڵ" } },
  { slug: "rixos-hotels", sector: "hospitality", governorate: "baghdad", brands: ["pimtas", "aquapa", "ascelik", "georg-fischer"], source: OWNER_LIST,
    name: { en: "Rixos Hotels", ar: "فنادق ريكسوس", ckb: "هوتێلەکانی ریکسۆس" } },
  { slug: "al-jadriya-towers", sector: "residential", governorate: "baghdad", brands: ["pimtas", "georg-fischer"], source: OWNER_LIST,
    name: { en: "Al-Jadriya Towers", ar: "أبراج الجادرية", ckb: "تاوەرەکانی جادریە" } },
  { slug: "al-risala-complex", sector: "residential", governorate: "baghdad", brands: ["kas"], source: OWNER_LIST,
    name: { en: "Al-Risala Complex", ar: "مجمع الرسالة", ckb: "کۆمەڵگەی ڕیسالە" } },
  { slug: "millennium-towers", sector: "residential", governorate: "baghdad", brands: ["georg-fischer", "ascelik"], source: OWNER_LIST,
    name: { en: "Millennium Towers", ar: "أبراج ميلينيوم", ckb: "تاوەرەکانی میلێنیۆم" } },
  { slug: "al-absali-complex", sector: "residential", governorate: "baghdad", brands: ["georg-fischer"], source: OWNER_LIST,
    name: { en: "Al-Absali Complex", ar: "مجمع العبسلي", ckb: "کۆمەڵگەی عەبسەلی" } },
  { slug: "al-khulood-complex", sector: "residential", governorate: "baghdad", brands: ["georg-fischer"], source: OWNER_LIST,
    name: { en: "Al-Khulood Complex", ar: "مجمع الخلود", ckb: "کۆمەڵگەی خلوود" } },
  { slug: "al-dalla-residential-complex", sector: "residential", governorate: "anbar", brands: ["georg-fischer", "aquapa"], source: OWNER_LIST,
    name: { en: "Al-Dalla Residential Complex", ar: "مجمع الدلة السكني", ckb: "کۆمەڵگەی نیشتەجێبوونی دەلە" } },
  { slug: "al-murooj-complex", sector: "residential", governorate: "karbala", brands: ["aquapa", "shield", "turan-borfit"], source: OWNER_LIST,
    name: { en: "Al-Murooj Complex", ar: "مجمع المروج", ckb: "کۆمەڵگەی مورووج" } },
  { slug: "al-shuhada-basra", sector: "residential", governorate: "basra", brands: ["aquapa"], source: OWNER_LIST,
    name: { en: "Al-Shuhada", ar: "الشهداء", ckb: "شوهەدا" } },
  { slug: "hilal-salafa-complex", sector: "residential", governorate: "basra", brands: ["aquapa"], source: OWNER_LIST,
    name: { en: "Hilal Salafa Complex", ar: "مجمع هلال سلافا", ckb: "کۆمەڵگەی هیلال سەلافا" } },
  { slug: "shatt-al-arab-complex", sector: "residential", governorate: "basra", brands: ["aquapa"], source: OWNER_LIST,
    name: { en: "Shatt Al-Arab Complex", ar: "مجمع شط العرب", ckb: "کۆمەڵگەی شەتولعەرەب" } },
  { slug: "al-safa-complex", sector: "residential", governorate: "basra", brands: ["aquapa", "georg-fischer"], source: OWNER_LIST,
    name: { en: "Al-Safa Complex", ar: "مجمع الصفا", ckb: "کۆمەڵگەی سەفا" } },
  { slug: "al-narjis-complex", sector: "residential", governorate: "basra", brands: ["georg-fischer"], source: OWNER_LIST,
    name: { en: "Al-Narjis Complex", ar: "مجمع النرجس", ckb: "کۆمەڵگەی نەرجس" } },
  { slug: "al-taj-complex", sector: "residential", governorate: "basra", brands: ["aquapa"], source: OWNER_LIST,
    name: { en: "Al-Taj Complex", ar: "مجمع التاج", ckb: "کۆمەڵگەی تاج" } },
  { slug: "sindbad-complex", sector: "residential", governorate: "basra", brands: ["aquapa"], source: OWNER_LIST,
    name: { en: "Sindbad Complex", ar: "مجمع السندباد", ckb: "کۆمەڵگەی سندباد" } },
  { slug: "al-faisal-complex", sector: "residential", governorate: "basra", brands: ["aquapa"], source: OWNER_LIST,
    name: { en: "Al-Faisal Complex", ar: "مجمع الفيصل", ckb: "کۆمەڵگەی فەیسەڵ" } },
  { slug: "al-farouq-1-complex", sector: "residential", governorate: "anbar", brands: ["ostendorf", "georg-fischer"], source: OWNER_LIST,
    name: { en: "Al-Farouq 1 Complex", ar: "مجمع الفاروق 1", ckb: "کۆمەڵگەی فارووق 1" } },
  { slug: "garden-city-complex", sector: "residential", governorate: "anbar", brands: ["aquapa"], source: OWNER_LIST,
    name: { en: "Garden City Complex", ar: "مجمع كاردن ستي", ckb: "کۆمەڵگەی گاردن سیتی" } },
  { slug: "al-lulua-complex", sector: "residential", governorate: "anbar", brands: ["aquapa"], source: OWNER_LIST,
    name: { en: "Al-Lulua Complex", ar: "مجمع اللؤلؤة", ckb: "کۆمەڵگەی لولوئە" } },
  { slug: "taiba-complex", sector: "residential", governorate: "anbar", brands: ["aquapa"], source: OWNER_LIST,
    name: { en: "Taiba Complex", ar: "مجمع طيبة", ckb: "کۆمەڵگەی تەیبە" } },
  { slug: "anbar-government-complex", sector: "government", governorate: "anbar", brands: ["aquapa", "ostendorf"], source: OWNER_LIST,
    name: { en: "Government Complex, Governorate Building", ar: "المجمع الحكومي، مبنى المحافظة", ckb: "کۆمەڵگەی حکوومی، باڵەخانەی پارێزگا" } },
  { slug: "al-hussam-complex", sector: "residential", governorate: "anbar", brands: ["aquapa"], source: OWNER_LIST,
    name: { en: "Al-Hussam Complex", ar: "مجمع الحسام", ckb: "کۆمەڵگەی حوسام" } },
  { slug: "jazan-city-complex", sector: "residential", governorate: "anbar", brands: ["aquapa"], source: OWNER_LIST,
    name: { en: "Jazan City Complex", ar: "مجمع جازان ستي", ckb: "کۆمەڵگەی جازان سیتی" } },
  { slug: "unified-nationality-directorate", sector: "government", governorate: "anbar", brands: ["aquapa", "georg-fischer"], source: OWNER_LIST,
    name: { en: "Unified Nationality Directorate", ar: "دائرة الجنسية الموحدة", ckb: "فەرمانگەی ڕەگەزنامەی یەکگرتوو" } },
  { slug: "al-halbousi-palace", sector: "residential", governorate: "anbar", brands: ["georg-fischer", "baenninger"], source: OWNER_LIST,
    name: { en: "Mohammed Al-Halbousi Palace", ar: "قصر الرئيس محمد الحلبوسي", ckb: "کۆشکی محەمەد حەلبووسی" } },
  { slug: "al-mumayaza-city", sector: "residential", governorate: "anbar", brands: ["aquapa"], source: OWNER_LIST,
    name: { en: "Al-Mumayaza City", ar: "المدينة المميزة", ckb: "شاری مومەییەزە" } },
  { slug: "anbar-international-hotel", sector: "hospitality", governorate: "anbar", brands: ["baenninger", "ostendorf", "turan-borfit"], source: OWNER_LIST,
    name: { en: "Anbar International Hotel", ar: "فندق الأنبار الدولي", ckb: "هوتێلی نێودەوڵەتیی ئەنبار" } },
  { slug: "anbar-mall", sector: "commercial", governorate: "anbar", brands: ["baenninger", "georg-fischer"], source: OWNER_LIST,
    name: { en: "Anbar Mall", ar: "أنبار مول", ckb: "ئەنبار مۆڵ" } },
  { slug: "al-yarmouk-complex", sector: "residential", governorate: "anbar", brands: ["aquapa"], source: OWNER_LIST,
    name: { en: "Al-Yarmouk Complex", ar: "مجمع اليرموك", ckb: "کۆمەڵگەی یەرمووک" } },
  { slug: "islamic-city-anbar", sector: "residential", governorate: "anbar", brands: ["aquapa", "poloplast"], source: OWNER_LIST,
    name: { en: "Islamic City", ar: "المدينة الإسلامية", ckb: "شاری ئیسلامی" } },
  { slug: "al-huda-private-college", sector: "education", governorate: "anbar", brands: ["baenninger"], source: OWNER_LIST,
    name: { en: "Al-Huda Private College", ar: "كلية الهدى الأهلية", ckb: "کۆلێژی ئەهلیی هودا" } },
  { slug: "awal-fawri-dental-hospital", sector: "healthcare", governorate: "anbar", brands: ["baenninger", "ostendorf"], source: OWNER_LIST,
    name: { en: "Awal Fawri Dental Hospital", ar: "مستشفى أول فوري للأسنان", ckb: "نەخۆشخانەی ددانی ئەوەل فەوری" } },
  { slug: "al-othman-trading-company", sector: "commercial", governorate: "anbar", brands: ["aquapa"], source: OWNER_LIST,
    name: { en: "Al-Othman Trading Company", ar: "شركة آل عثمان التجارية", ckb: "کۆمپانیای بازرگانیی ئال عوسمان" } },
  { slug: "green-city-complex", sector: "residential", governorate: "karbala", brands: ["georg-fischer"], source: OWNER_LIST,
    name: { en: "Green City Complex", ar: "مجمع المدينة الخضراء", ckb: "کۆمەڵگەی شاری سەوز" } },
  { slug: "zagros-towers", sector: "residential", governorate: "erbil", brands: ["georg-fischer"], source: OWNER_LIST,
    name: { en: "Zagros Towers", ar: "زاكروس تاورز", ckb: "زاگرۆس تاوەرز" } },
];

/** The Home page selection. */
export const featuredProjects = projects.filter((p) => p.featured);

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
