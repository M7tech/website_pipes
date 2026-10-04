import type { Localized, Source } from "./types";

export type Milestone = { year: number; text: Localized; source: Source };

export const milestones: Milestone[] = [
  { year: 1975, source: "site:/ar/من-نحن/", text: {
    en: "Eng. Abdulameer Al-Moussawi starts supplying construction materials to companies building in Iraq.",
    ar: "يبدأ المهندس عبد الأمير الموسوي بتجهيز الشركات العاملة في إعمار العراق بالمواد الإنشائية.",
    ckb: "ئەندازیار عەبدولئەمیر مووسەوی دەست دەکات بە دابینکردنی کەرەستەی بیناسازی بۆ ئەو کۆمپانیایانەی لە عێراق بینا دروست دەکەن." } },
  { year: 1990, source: "confirmed:2026-10-04", text: {
    en: "The first Atlas showroom opens in Al-Shaab, Baghdad.",
    ar: "افتتاح أول معرض لأطلس في منطقة الشعب ببغداد.",
    ckb: "یەکەم پێشانگای ئەتلەس لە شەعبی بەغدا دەکرێتەوە." } },
  { year: 2004, source: "site:/ar/من-نحن/", text: {
    en: "First exclusive international agency, for Bänninger of Germany.",
    ar: "أول وكالة دولية حصرية، لشركة باننجر الألمانية.",
    ckb: "یەکەم بریکارایەتیی تایبەتی نێودەوڵەتی، بۆ کۆمپانیای بانینگەری ئەڵمانی." } },
  { year: 2009, source: "site:/ar/من-نحن/", text: {
    en: "Ufuq Al-Atlas is established as the group’s pipe trading company.",
    ar: "تأسيس شركة أفق الأطلس لتجارة الأنابيب وملحقاتها.",
    ckb: "کۆمپانیای ئوفوق ئەلئەتلەس بۆ بازرگانیی بۆری و پێداویستییەکانی دادەمەزرێت." } },
  { year: 2010, source: "site:/ar/من-نحن/", text: {
    en: "Erbil branch opens.",
    ar: "افتتاح فرع أربيل.",
    ckb: "لقی هەولێر دەکرێتەوە." } },
  { year: 2012, source: "site:/ar/من-نحن/", text: {
    en: "Basra branch opens.",
    ar: "افتتاح فرع البصرة.",
    ckb: "لقی بەسرە دەکرێتەوە." } },
  { year: 2019, source: "site:/ar/من-نحن/", text: {
    en: "Partnership with Turan Makina of Turkey for polyethylene systems.",
    ar: "شراكة مع شركة توران ماكينة التركية لأنظمة البولي إيثيلين.",
    ckb: "هاوبەشی لەگەڵ کۆمپانیای تووران ماکینەی تورکی بۆ سیستەمەکانی پۆلی ئێسیلین." } },
  { year: 2025, source: "profile:p24", text: {
    en: "A regional office opens in Saudi Arabia.",
    ar: "افتتاح مكتب إقليمي في المملكة العربية السعودية.",
    ckb: "نووسینگەیەکی هەرێمی لە سعوودیە دەکرێتەوە." } },
];
