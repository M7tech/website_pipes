import type { Localized, Source } from "./types";

export type Leader = {
  id: string;
  name: Localized;
  role: Localized;
  /** Portrait under /public; the studio portraits from the company profile's management page. */
  photo: { src: string; width: number; height: number };
  source: Source;
};

/** Chairman of the board. His message is in the messages under Board.message. */
export const chairman: Leader = {
  id: "jaafar-almusawi",
  name: { en: "Jaafar Almusawi", ar: "جعفر الموسوي", ckb: "جەعفەر ئەلموسەوی" },
  role: {
    en: "Chairman of the Board, Atlas Group",
    ar: "رئيس مجلس إدارة مجموعة أطلس",
    ckb: "سەرۆکی ئەنجومەنی بەڕێوەبەرایەتیی گرووپی ئەتلەس",
  },
  photo: { src: "/images/leadership/jaafar-almusawi.jpg", width: 362, height: 511 },
  source: "confirmed:2026-10-05",
};

/** Board members, in the order the owner gave them (2026-10-05). Spelling of names as in the profile (p5). */
export const boardMembers: Leader[] = [
  {
    id: "omer-ibrahim",
    name: { en: "Omer Ibrahim", ar: "عمر إبراهيم", ckb: "عومەر ئیبراهیم" },
    role: { en: "Board member", ar: "عضو مجلس الإدارة", ckb: "ئەندامی ئەنجومەنی بەڕێوەبەرایەتی" },
    photo: { src: "/images/leadership/omer-ibrahim.jpg", width: 303, height: 419 },
    source: "confirmed:2026-10-05",
  },
  {
    id: "mohammed-bajalan",
    name: { en: "Mohammed Bajalan", ar: "محمد باجلان", ckb: "محەمەد باجەلان" },
    role: { en: "Board member", ar: "عضو مجلس الإدارة", ckb: "ئەندامی ئەنجومەنی بەڕێوەبەرایەتی" },
    photo: { src: "/images/leadership/mohammed-bajalan.jpg", width: 360, height: 436 },
    source: "confirmed:2026-10-05",
  },
];
