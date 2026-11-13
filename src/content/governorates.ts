import type { Localized } from "./types";

/**
 * Iraq's governorates, for the quotation form. Halabja is listed as the 19th
 * (federal parliament vote, 2025). Names are the usual forms in each language;
 * Sorani spellings are pending the same native review as the rest of the site.
 *
 * Each governorate's nearest AtlasPlast branch (an `offices` id), by road distance to the branch
 * cities. Owner 2026-11-13: quotations go to the branch nearest the customer, not all to Al-Shaab.
 * The form preselects it and the customer can pick another branch.
 */
export const governorates: { id: string; branch: string; name: Localized }[] = [
  { id: "baghdad", branch: "camp-sara", name: { en: "Baghdad", ar: "بغداد", ckb: "بەغدا" } },
  { id: "basra", branch: "basra", name: { en: "Basra", ar: "البصرة", ckb: "بەسرە" } },
  { id: "nineveh", branch: "duhok", name: { en: "Nineveh", ar: "نينوى", ckb: "نەینەوا" } },
  { id: "erbil", branch: "erbil", name: { en: "Erbil", ar: "أربيل", ckb: "هەولێر" } },
  { id: "sulaymaniyah", branch: "erbil", name: { en: "Sulaymaniyah", ar: "السليمانية", ckb: "سلێمانی" } },
  { id: "duhok", branch: "duhok", name: { en: "Duhok", ar: "دهوك", ckb: "دهۆک" } },
  { id: "halabja", branch: "erbil", name: { en: "Halabja", ar: "حلبجة", ckb: "هەڵەبجە" } },
  { id: "kirkuk", branch: "erbil", name: { en: "Kirkuk", ar: "كركوك", ckb: "کەرکووک" } },
  { id: "diyala", branch: "camp-sara", name: { en: "Diyala", ar: "ديالى", ckb: "دیالە" } },
  { id: "anbar", branch: "camp-sara", name: { en: "Anbar", ar: "الأنبار", ckb: "ئەنبار" } },
  { id: "salahaddin", branch: "camp-sara", name: { en: "Salah al-Din", ar: "صلاح الدين", ckb: "سەلاحەدین" } },
  { id: "babylon", branch: "najaf", name: { en: "Babylon", ar: "بابل", ckb: "بابل" } },
  { id: "karbala", branch: "najaf", name: { en: "Karbala", ar: "كربلاء", ckb: "کەربەلا" } },
  { id: "najaf", branch: "najaf", name: { en: "Najaf", ar: "النجف", ckb: "نەجەف" } },
  { id: "wasit", branch: "camp-sara", name: { en: "Wasit", ar: "واسط", ckb: "واست" } },
  { id: "qadisiyyah", branch: "najaf", name: { en: "Al-Qadisiyyah", ar: "القادسية", ckb: "قادسیە" } },
  { id: "maysan", branch: "basra", name: { en: "Maysan", ar: "ميسان", ckb: "مەیسان" } },
  { id: "dhiqar", branch: "basra", name: { en: "Dhi Qar", ar: "ذي قار", ckb: "زیقار" } },
  { id: "muthanna", branch: "najaf", name: { en: "Al-Muthanna", ar: "المثنى", ckb: "موسەننا" } },
];
