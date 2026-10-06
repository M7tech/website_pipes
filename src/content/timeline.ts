import type { Localized, Source } from "./types";

export type Milestone = {
  year: number;
  /** Last year of a period, shown as a range ("1990–2003"). */
  until?: number;
  /** Shown only in the full history on the About page, not on Home or the hero year scale. */
  detail?: true;
  text: Localized;
  source: Source;
};

export const milestones: Milestone[] = [
  { year: 1975, source: "site:/ar/من-نحن/", text: {
    en: "Eng. Abdulameer Al-Moussawi starts supplying construction materials to companies building in Iraq.",
    ar: "يبدأ المهندس عبد الأمير الموسوي بتجهيز الشركات العاملة في إعمار العراق بالمواد الإنشائية.",
    ckb: "ئەندازیار عەبدولئەمیر مووسەوی دەست دەکات بە دابینکردنی کەرەستەی بیناسازی بۆ ئەو کۆمپانیایانەی لە عێراق بینا دروست دەکەن." } },
  { year: 1990, source: "confirmed:2026-10-04", text: {
    en: "The first Atlas showroom opens in Al-Shaab, Baghdad.",
    ar: "افتتاح أول معرض لأطلس في منطقة الشعب ببغداد.",
    ckb: "یەکەم پێشانگای ئەتلەس لە شەعبی بەغدا دەکرێتەوە." } },
  { year: 1990, until: 2003, detail: true, source: "site:/ar/من-نحن/", text: {
    en: "Through the sanctions years, Atlas keeps supplying the market as a distributor for the State Company for Construction Materials Trading.",
    ar: "طوال سنوات الحصار، تواصل أطلس تجهيز السوق موزّعاً للشركة العامة لتجارة المواد الإنشائية.",
    ckb: "لە ماوەی ساڵانی گەمارۆدا، ئەتلەس بەردەوام دەبێت لە دابینکردنی بازاڕ وەک دابەشکەری کۆمپانیای گشتیی بازرگانیی کەرەستەی بیناسازی." } },
  { year: 2004, source: "site:/ar/من-نحن/", text: {
    en: "First exclusive international agency, for Bänninger of Germany.",
    ar: "أول وكالة دولية حصرية، لشركة باننجر الألمانية.",
    ckb: "یەکەم بریکارایەتیی تایبەتی نێودەوڵەتی، بۆ کۆمپانیای بانینگەری ئەڵمانی." } },
  { year: 2006, until: 2007, detail: true, source: "site:/ar/من-نحن/", text: {
    en: "As security worsens, the business keeps running and management moves to Sulaymaniyah, led by Eng. Jaafar Al-Moussawi.",
    ar: "مع تدهور الوضع الأمني يستمر العمل، وتنتقل الإدارة إلى السليمانية بقيادة المهندس جعفر الموسوي.",
    ckb: "لەگەڵ خراپبوونی باری ئاسایش کار بەردەوام دەبێت، و بەڕێوەبردن بە سەرپەرشتیی ئەندازیار جەعفەر مووسەوی دەگوازرێتەوە بۆ سلێمانی." } },
  { year: 2007, detail: true, source: "site:/ar/من-نحن/", text: {
    en: "A partnership in Sulaymaniyah with Abdul-Razzaq Al-Hayali in the ARBAK PVC pipe plant.",
    ar: "شراكة في السليمانية مع عبد الرزاق الحيالي في معمل ARBAK لأنابيب PVC.",
    ckb: "هاوبەشی لە سلێمانی لەگەڵ عەبدولڕەزاق حەیالی لە کارگەی بۆریی PVCی ARBAK." } },
  { year: 2008, detail: true, source: "site:/ar/من-نحن/", text: {
    en: "Management returns to Baghdad.",
    ar: "عودة الإدارة إلى بغداد.",
    ckb: "بەڕێوەبردن دەگەڕێتەوە بۆ بەغدا." } },
  { year: 2009, source: "site:/ar/من-نحن/", text: {
    en: "Ufuq Al-Atlas is established as the group’s pipe trading company.",
    ar: "تأسيس شركة أفق الأطلس لتجارة الأنابيب وملحقاتها.",
    ckb: "کۆمپانیای ئوفوق ئەلئەتلەس بۆ بازرگانیی بۆری و پێداویستییەکانی دادەمەزرێت." } },
  { year: 2009, detail: true, source: "site:/ar/من-نحن/", text: {
    en: "The Al-Amir sanitaryware showroom opens with the FABCO brand.",
    ar: "افتتاح معرض الأمير للأدوات الصحية بعلامة FABCO.",
    ckb: "پێشانگای ئەلئەمیر بۆ کەلوپەلی تەندروستی بە براندی FABCO دەکرێتەوە." } },
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

/** Milestones for Home and the hero year scale; About shows them all. */
export const keyMilestones = milestones.filter((m) => !m.detail);
