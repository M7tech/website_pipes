import type { Localized } from "./types";

/**
 * Iraq's governorates, for the quotation form. Halabja is listed as the 19th
 * (federal parliament vote, 2025). Names are the usual forms in each language;
 * Sorani spellings are pending the same native review as the rest of the site.
 */
export const governorates: { id: string; name: Localized }[] = [
  { id: "baghdad", name: { en: "Baghdad", ar: "بغداد", ckb: "بەغدا" } },
  { id: "basra", name: { en: "Basra", ar: "البصرة", ckb: "بەسرە" } },
  { id: "nineveh", name: { en: "Nineveh", ar: "نينوى", ckb: "نەینەوا" } },
  { id: "erbil", name: { en: "Erbil", ar: "أربيل", ckb: "هەولێر" } },
  { id: "sulaymaniyah", name: { en: "Sulaymaniyah", ar: "السليمانية", ckb: "سلێمانی" } },
  { id: "duhok", name: { en: "Duhok", ar: "دهوك", ckb: "دهۆک" } },
  { id: "halabja", name: { en: "Halabja", ar: "حلبجة", ckb: "هەڵەبجە" } },
  { id: "kirkuk", name: { en: "Kirkuk", ar: "كركوك", ckb: "کەرکووک" } },
  { id: "diyala", name: { en: "Diyala", ar: "ديالى", ckb: "دیالە" } },
  { id: "anbar", name: { en: "Anbar", ar: "الأنبار", ckb: "ئەنبار" } },
  { id: "salahaddin", name: { en: "Salah al-Din", ar: "صلاح الدين", ckb: "سەلاحەدین" } },
  { id: "babylon", name: { en: "Babylon", ar: "بابل", ckb: "بابل" } },
  { id: "karbala", name: { en: "Karbala", ar: "كربلاء", ckb: "کەربەلا" } },
  { id: "najaf", name: { en: "Najaf", ar: "النجف", ckb: "نەجەف" } },
  { id: "wasit", name: { en: "Wasit", ar: "واسط", ckb: "واست" } },
  { id: "qadisiyyah", name: { en: "Al-Qadisiyyah", ar: "القادسية", ckb: "قادسیە" } },
  { id: "maysan", name: { en: "Maysan", ar: "ميسان", ckb: "مەیسان" } },
  { id: "dhiqar", name: { en: "Dhi Qar", ar: "ذي قار", ckb: "زیقار" } },
  { id: "muthanna", name: { en: "Al-Muthanna", ar: "المثنى", ckb: "موسەننا" } },
];
