import type { Locale } from "@/i18n/routing";
import type { Localized, Source } from "./types";
import { company, offices } from "./company";

/** FAQ groups, in page order. Labels live in messages under Faq.topics.<key>. */
export const faqTopics = [
  "company",
  "products",
  "waterSupply",
  "drainage",
  "infrastructure",
  "bathrooms",
  "equipment",
  "brands",
  "services",
  "contact",
] as const;

export type FaqTopic = (typeof faqTopics)[number];

export type Faq = {
  id: string;
  topic: FaqTopic;
  /** Solution pages that also show this question (and carry it in their FAQPage data). */
  solutions?: string[];
  /** Locale-relative page with more detail, linked under the answer. */
  href?: string;
  q: Localized;
  /**
   * Answer. Contact details are placeholders filled from company.ts, so they change in one place:
   * {mainPhone} {whatsapp} {projectsPhone} {salesPhone} {email} {branches}.
   */
  a: Localized;
  source: Source;
};

/** Placeholder values for an answer, in the given locale. */
export function faqValues(locale: Locale): Record<string, string> {
  const separator = locale === "en" ? "; " : "؛ ";
  return {
    mainPhone: company.mainPhone,
    whatsapp: company.whatsapp,
    projectsPhone: company.projectsPhone,
    salesPhone: company.salesPhone,
    email: company.email,
    branches: offices
      .map((o) => `${o.name[locale]}${o.street ? ` (${o.street[locale]})` : ""} ${o.phone ?? ""}`.trim())
      .join(separator),
  };
}

/** Answer text with its placeholders filled, for structured data, llms.txt and plain-text use. */
export function faqAnswer(faq: Faq, locale: Locale) {
  const values = faqValues(locale);
  return faq.a[locale].replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

/** Questions shown on a solution page. */
export function solutionFaqs(slug: string) {
  return faqs.filter((f) => f.solutions?.includes(slug));
}

/**
 * 100 questions and answers for the FAQ page, structured data and llms.txt.
 * Every answer uses only facts already published on the site (src/content and messages),
 * with the same sources; general technical explanations (what PP-R or SN means) are standard
 * industry definitions. Arabic and Sorani follow the site's terminology and still need a
 * native-speaker review, like the rest of the copy.
 */
export const faqs: Faq[] = [
  // ── About AtlasPlast ──────────────────────────────────────────────
  {
    id: "what-is-atlasplast",
    topic: "company",
    href: "/about",
    source: "profile:p4",
    q: {
      en: "What is AtlasPlast?",
      ar: "ما هي أطلس بلاست؟",
      ckb: "ئەتلەس پلاست چییە؟",
    },
    a: {
      en: "AtlasPlast is an Iraqi distributor and commercial agent for international manufacturers of pipe systems, drainage, sanitaryware, tiles, water heaters, pumps, faucets and installation tools. It has supplied the Iraqi market since 1975 and serves contractors, installers and project owners in every governorate.",
      ar: "أطلس بلاست موزّع ووكيل تجاري عراقي لشركات عالمية مصنّعة لأنظمة الأنابيب والصرف والأدوات الصحية والسيراميك وسخانات المياه والمضخات والخلاطات وأدوات التركيب. تجهّز السوق العراقية منذ عام 1975، وتخدم المقاولين والحرفيين وأصحاب المشاريع في جميع المحافظات.",
      ckb: "ئەتلەس پلاست دابەشکەر و بریکارێکی بازرگانیی عێراقییە بۆ بەرهەمهێنەرە نێودەوڵەتییەکانی سیستەمی بۆری، ئاوەڕۆ، کەلوپەلی تەندروستی، کاشی، ئاوگەرمکەرەوە، پەمپ، حەنەفیە و ئامرازی دامەزراندن. لە ساڵی 1975ەوە بازاڕی عێراق دابین دەکات و خزمەتی بەڵێندەران، وەستاکاران و خاوەن پڕۆژەکان لە هەموو پارێزگاکان دەکات.",
    },
  },
  {
    id: "legal-name",
    topic: "company",
    source: "profile:p4",
    q: {
      en: "What is AtlasPlast’s legal company name?",
      ar: "ما الاسم القانوني لشركة أطلس بلاست؟",
      ckb: "ناوی یاسایی کۆمپانیای ئەتلەس پلاست چییە؟",
    },
    a: {
      en: "AtlasPlast is the trading name of Ufuq Al-Atlas Ltd. (UFUQ ALATLAS LTD. – Commercial Agencies). In Arabic the company is شركة أفق الأطلس المحدودة and the brand is أطلس بلاست; in Kurdish the brand is ئەتلەس پلاست.",
      ar: "أطلس بلاست هو الاسم التجاري لشركة أفق الأطلس المحدودة (UFUQ ALATLAS LTD. – Commercial Agencies). وتُكتب العلامة بالإنجليزية AtlasPlast وبالكردية ئەتلەس پلاست.",
      ckb: "ئەتلەس پلاست ناوی بازرگانیی کۆمپانیای ئوفوق ئەلئەتلەسە (UFUQ ALATLAS LTD. – Commercial Agencies). براندەکە بە ئینگلیزی AtlasPlast و بە عەرەبی أطلس بلاست دەنووسرێت.",
    },
  },
  {
    id: "founded",
    topic: "company",
    href: "/about",
    source: "site:/ar/من-نحن/",
    q: {
      en: "When was AtlasPlast founded?",
      ar: "متى تأسست أطلس بلاست؟",
      ckb: "ئەتلەس پلاست کەی دامەزرا؟",
    },
    a: {
      en: "The business began in 1975, when Eng. Abdulameer Al-Moussawi started supplying construction materials to companies building in Iraq. The first Atlas showroom opened in Al-Shaab, Baghdad, in 1990, and Ufuq Al-Atlas was established in 2009 as the group’s pipe trading company.",
      ar: "بدأ العمل عام 1975 حين بدأ المهندس عبد الأمير الموسوي بتجهيز الشركات العاملة في إعمار العراق بالمواد الإنشائية. وافتُتح أول معرض لأطلس في منطقة الشعب ببغداد عام 1990، وتأسست شركة أفق الأطلس عام 2009 لتجارة الأنابيب وملحقاتها.",
      ckb: "کارەکە لە ساڵی 1975 دەستی پێکرد، کاتێک ئەندازیار عەبدولئەمیر مووسەوی دەستی کرد بە دابینکردنی کەرەستەی بیناسازی بۆ ئەو کۆمپانیایانەی لە عێراق بینا دروست دەکەن. یەکەم پێشانگای ئەتلەس لە ساڵی 1990 لە شەعبی بەغدا کرایەوە، و کۆمپانیای ئوفوق ئەلئەتلەس لە ساڵی 2009 بۆ بازرگانیی بۆری دامەزرا.",
    },
  },
  {
    id: "headquarters",
    topic: "company",
    href: "/locations",
    source: "confirmed:2026-10-05",
    q: {
      en: "Where is AtlasPlast’s headquarters?",
      ar: "أين يقع المقر الرئيسي لأطلس بلاست؟",
      ckb: "بارەگای سەرەکیی ئەتلەس پلاست لە کوێیە؟",
    },
    a: {
      en: "AtlasPlast’s headquarters is at Camp Sara in Baghdad. The company also has an office in Al-Shaab, Baghdad, and offices in Najaf, Basra, Erbil and Duhok.",
      ar: "يقع المقر الرئيسي لأطلس بلاست في كمب سارة ببغداد. وللشركة أيضاً مكتب في الشعب ببغداد، ومكاتب في النجف والبصرة وأربيل ودهوك.",
      ckb: "بارەگای سەرەکیی ئەتلەس پلاست لە کەمپ سارەی بەغدایە. کۆمپانیاکە هەروەها نووسینگەیەکی لە شەعبی بەغدا هەیە، و نووسینگەی لە نەجەف، بەسرە، هەولێر و دهۆک هەیە.",
    },
  },
  {
    id: "leadership",
    topic: "company",
    href: "/about/board",
    source: "confirmed:2026-10-05",
    q: {
      en: "Who leads AtlasPlast?",
      ar: "من يقود أطلس بلاست؟",
      ckb: "کێ سەرکردایەتیی ئەتلەس پلاست دەکات؟",
    },
    a: {
      en: "AtlasPlast is led by Jaafar Almusawi, Chairman of the Board of Atlas Group. The board members are Omer Ibrahim and Mohammed Bajalan.",
      ar: "يقود أطلس بلاست جعفر الموسوي، رئيس مجلس إدارة مجموعة أطلس. وعضوا مجلس الإدارة هما عمر إبراهيم ومحمد باجلان.",
      ckb: "ئەتلەس پلاست بە سەرۆکایەتیی جەعفەر ئەلموسەوی، سەرۆکی ئەنجومەنی بەڕێوەبەرایەتیی گرووپی ئەتلەس، بەڕێوە دەچێت. ئەندامانی ئەنجومەنەکە عومەر ئیبراهیم و محەمەد باجەلانن.",
    },
  },
  {
    id: "what-atlasplast-does",
    topic: "company",
    href: "/about",
    source: "profile:p4",
    q: {
      en: "What does AtlasPlast do?",
      ar: "ماذا تعمل أطلس بلاست؟",
      ckb: "ئەتلەس پلاست چی دەکات؟",
    },
    a: {
      en: "AtlasPlast holds commercial agencies for international manufacturers, many of them exclusive in Iraq, and supplies their products with technical support to housing, infrastructure and government developments. Its services are product distribution, project supply, technical support, after-sales service, training and private-label products.",
      ar: "تحمل أطلس بلاست وكالات تجارية لشركات عالمية مصنّعة، كثير منها وكالات حصرية في العراق، وتورّد منتجاتها مع الدعم الفني لمشاريع الإسكان والبنى التحتية والمشاريع الحكومية. وتشمل خدماتها توزيع المنتجات وتجهيز المشاريع والدعم الفني وخدمة ما بعد البيع والتدريب ومنتجات العلامات الخاصة.",
      ckb: "ئەتلەس پلاست بریکارایەتیی بازرگانیی بۆ بەرهەمهێنەرە نێودەوڵەتییەکان هەیە، کە زۆرێکیان لە عێراق تایبەتن، و بەرهەمەکانیان لەگەڵ پاڵپشتیی تەکنیکی بۆ پڕۆژەکانی نیشتەجێبوون، ژێرخان و پڕۆژە حکومییەکان دابین دەکات. خزمەتگوزارییەکانی بریتین لە دابەشکردنی بەرهەم، دابینکردنی پڕۆژە، پاڵپشتیی تەکنیکی، خزمەتگوزاریی دوای فرۆشتن، ڕاهێنان و بەرهەمی براندی تایبەت.",
    },
  },
  {
    id: "agents-dealers",
    topic: "company",
    source: "profile:p4",
    q: {
      en: "How many agents and dealers does AtlasPlast have?",
      ar: "كم عدد وكلاء وتجار أطلس بلاست؟",
      ckb: "ئەتلەس پلاست چەند بریکار و فرۆشیاری هەیە؟",
    },
    a: {
      en: "AtlasPlast supplies more than 600 agents and dealers across every governorate of Iraq.",
      ar: "تجهّز أطلس بلاست أكثر من 600 وكيل وتاجر في جميع محافظات العراق.",
      ckb: "ئەتلەس پلاست زیاتر لە 600 بریکار و فرۆشیار لە هەموو پارێزگاکانی عێراق دابین دەکات.",
    },
  },
  {
    id: "exclusive-agent",
    topic: "company",
    href: "/brands",
    source: "site:/ar/من-نحن/",
    q: {
      en: "Is AtlasPlast an exclusive agent in Iraq?",
      ar: "هل أطلس بلاست وكيل حصري في العراق؟",
      ckb: "ئایا ئەتلەس پلاست بریکاری تایبەتە لە عێراق؟",
    },
    a: {
      en: "Yes, for many of the brands it represents. Its first exclusive international agency was for Bänninger of Germany in 2004, and AtlasPlast is the exclusive Bänninger agent for central and southern Iraq.",
      ar: "نعم، لكثير من العلامات التي تمثّلها. كانت أول وكالة دولية حصرية لها لشركة باننجر الألمانية عام 2004، وأطلس بلاست هي الوكيل الحصري لباننجر في وسط العراق وجنوبه.",
      ckb: "بەڵێ، بۆ زۆرێک لەو براندانەی نوێنەرایەتییان دەکات. یەکەم بریکارایەتیی تایبەتی نێودەوڵەتیی لە ساڵی 2004 بۆ کۆمپانیای بانینگەری ئەڵمانی بوو، و ئەتلەس پلاست بریکاری تایبەتی بانینگەرە بۆ ناوەڕاست و باشووری عێراق.",
    },
  },
  {
    id: "vision-mission",
    topic: "company",
    href: "/about",
    source: "site:/ar/من-نحن/",
    q: {
      en: "What are AtlasPlast’s vision and mission?",
      ar: "ما رؤية أطلس بلاست ورسالتها؟",
      ckb: "دید و ئەرکی ئەتلەس پلاست چین؟",
    },
    a: {
      en: "The vision is to make AtlasPlast products the first choice of consumers in Iraq for water, drainage and sanitaryware. The mission is to supply Iraq with durable, high-quality products for water and sewage networks, and sanitaryware that is functional and well designed.",
      ar: "الرؤية أن تكون منتجات أطلس بلاست الخيار الأول للمستهلك العراقي في أنظمة المياه والصرف الصحي والأدوات الصحية. والرسالة تجهيز العراق بمنتجات متينة وعالية الجودة لشبكات المياه والصرف الصحي، وبأدوات صحية عملية وأنيقة التصميم.",
      ckb: "دیدەکە ئەوەیە بەرهەمەکانی ئەتلەس پلاست یەکەم هەڵبژاردەی بەکاربەری عێراقی بن لە سیستەمەکانی ئاو، ئاوەڕۆ و کەلوپەلی تەندروستیدا. ئەرکەکە دابینکردنی بەرهەمی بەهێز و کوالیتی بەرزە بۆ تۆڕەکانی ئاو و ئاوەڕۆ لە عێراق، و کەلوپەلی تەندروستیی بەسوود و جوان.",
    },
  },
  {
    id: "values",
    topic: "company",
    href: "/about",
    source: "profile:p6",
    q: {
      en: "What values guide AtlasPlast?",
      ar: "ما القيم التي توجّه أطلس بلاست؟",
      ckb: "چ بەهایەک ئەتلەس پلاست ڕێنمایی دەکات؟",
    },
    a: {
      en: "AtlasPlast’s values are quality without compromise, integrity, respect for customers, employees and the environment, innovation, consistency and teamwork. The Chairman sums them up as excellence, integrity and progress.",
      ar: "قيم أطلس بلاست هي الجودة دون مساومة، والنزاهة، واحترام العملاء والموظفين والبيئة، والابتكار، والثبات، والعمل بروح الفريق. ويلخّصها رئيس مجلس الإدارة في التميّز والنزاهة والتقدّم.",
      ckb: "بەهاکانی ئەتلەس پلاست بریتین لە کوالیتی بێ سازش، دەستپاکی، ڕێزگرتن لە کڕیاران، کارمەندان و ژینگە، داهێنان، بەردەوامی و کاری بەکۆمەڵ. سەرۆکی ئەنجومەنی بەڕێوەبەرایەتی بە نایابی، دەستپاکی و پێشکەوتن کورتیان دەکاتەوە.",
    },
  },
  {
    id: "outside-iraq",
    topic: "company",
    href: "/locations",
    source: "profile:p24",
    q: {
      en: "Does AtlasPlast have offices outside Iraq?",
      ar: "هل لأطلس بلاست مكاتب خارج العراق؟",
      ckb: "ئایا ئەتلەس پلاست نووسینگەی لە دەرەوەی عێراق هەیە؟",
    },
    a: {
      en: "Yes. AtlasPlast has regional offices in Saudi Arabia, Turkey, Syria and Egypt. The Saudi Arabia office opened in 2025.",
      ar: "نعم. لأطلس بلاست مكاتب إقليمية في السعودية وتركيا وسوريا ومصر، وافتُتح مكتب السعودية عام 2025.",
      ckb: "بەڵێ. ئەتلەس پلاست نووسینگەی هەرێمیی لە سعوودیە، تورکیا، سووریا و میسر هەیە. نووسینگەی سعوودیە لە ساڵی 2025 کرایەوە.",
    },
  },
  {
    id: "milestones",
    topic: "company",
    href: "/about",
    source: "site:/ar/من-نحن/",
    q: {
      en: "What are the main milestones in AtlasPlast’s history?",
      ar: "ما أبرز محطات تاريخ أطلس بلاست؟",
      ckb: "گرنگترین قۆناغەکانی مێژووی ئەتلەس پلاست چین؟",
    },
    a: {
      en: "1975: construction materials supply begins. 1990: first showroom in Al-Shaab, Baghdad. 2004: first exclusive international agency, for Bänninger. 2009: Ufuq Al-Atlas is established. 2010: Erbil branch. 2012: Basra branch. 2019: partnership with Turan Makina of Turkey for polyethylene systems. 2025: regional office in Saudi Arabia.",
      ar: "1975: بدء تجهيز المواد الإنشائية. 1990: أول معرض في الشعب ببغداد. 2004: أول وكالة دولية حصرية، لشركة باننجر. 2009: تأسيس شركة أفق الأطلس. 2010: فرع أربيل. 2012: فرع البصرة. 2019: شراكة مع توران ماكينة التركية لأنظمة البولي إيثيلين. 2025: مكتب إقليمي في السعودية.",
      ckb: "1975: دەستپێکردنی دابینکردنی کەرەستەی بیناسازی. 1990: یەکەم پێشانگا لە شەعبی بەغدا. 2004: یەکەم بریکارایەتیی تایبەتی نێودەوڵەتی، بۆ بانینگەر. 2009: دامەزراندنی ئوفوق ئەلئەتلەس. 2010: لقی هەولێر. 2012: لقی بەسرە. 2019: هاوبەشی لەگەڵ تووران ماکینەی تورکی بۆ سیستەمەکانی پۆلی ئێسیلین. 2025: نووسینگەی هەرێمی لە سعوودیە.",
    },
  },
  {
    id: "community",
    topic: "company",
    href: "/about",
    source: "profile:p20",
    q: {
      en: "What community work does AtlasPlast support?",
      ar: "ما العمل المجتمعي الذي تدعمه أطلس بلاست؟",
      ckb: "ئەتلەس پلاست پاڵپشتیی چ کارێکی کۆمەڵایەتی دەکات؟",
    },
    a: {
      en: "AtlasPlast funds annual education sponsorships for students, runs free plumbing classes for young people, supports start-ups and small businesses, and provides free materials and installation for public schools and families in need.",
      ar: "تقدّم أطلس بلاست كفالات دراسية سنوية للطلبة، ودورات مجانية في السباكة للشباب، وتدعم المشاريع الناشئة والصغيرة، وتوفّر مواد وتركيباً مجانياً للمدارس الحكومية والعائلات المحتاجة.",
      ckb: "ئەتلەس پلاست پاڵپشتیی ساڵانەی خوێندن بۆ قوتابیان دابین دەکات، خولی بێبەرامبەری بۆریکاری بۆ گەنجان دەکاتەوە، پاڵپشتیی پڕۆژە نوێ و بچووکەکان دەکات، و کەرەستە و دامەزراندنی بێبەرامبەر بۆ قوتابخانە حکومییەکان و ئەو خێزانانەی پێویستیان پێیەتی دابین دەکات.",
    },
  },
  // ── Products and solutions ────────────────────────────────────────
  {
    id: "product-range",
    topic: "products",
    href: "/solutions",
    source: "profile:p4",
    q: {
      en: "What products does AtlasPlast distribute?",
      ar: "ما هي المنتجات التي توزّعها شركة أطلس بلاست؟",
      ckb: "کۆمپانیای ئەتلەس پلاست چ بەرهەمێک دابەش دەکات؟",
    },
    a: {
      en: "AtlasPlast supplies ten solutions: water supply pipes (PP-R, PP-RCT and multilayer), drainage and grey water systems, water heaters, infrastructure networks (PE100 and U-PVC), galvanized fittings, sanitaryware and cisterns, ceramic and porcelain tiles, pumps, faucets and valves, and installation tools and fixings.",
      ar: "توفّر أطلس بلاست عشرة حلول: أنابيب إمدادات المياه (PP-R وPP-RCT ومتعددة الطبقات)، وأنظمة الصرف والمياه الرمادية، وسخانات المياه، وشبكات البنى التحتية (PE100 وU-PVC)، والملحقات المغلفنة، والأدوات الصحية وخزانات الدفن، والسيراميك والبورسلين، والمضخات، والخلاطات والمحابس، وأدوات التركيب والتثبيت.",
      ckb: "ئەتلەس پلاست دە چارەسەر دابین دەکات: بۆریی دابینکردنی ئاو (PP-R، PP-RCT و فرەچین)، سیستەمی ئاوەڕۆ و ئاوی خۆڵەمێشی، ئاوگەرمکەرەوە، تۆڕەکانی ژێرخان (PE100 و U-PVC)، پێکهاتە گەلڤانیزەکراوەکان، کەلوپەلی تەندروستی، کاشیی سێرامیک و پۆرسلین، پەمپ، حەنەفیە و ڤاڵڤ، و ئامرازی دامەزراندن و چەسپاندن.",
    },
  },
  {
    id: "stock",
    topic: "products",
    href: "/locations",
    source: "confirmed:2026-10-04",
    q: {
      en: "Does AtlasPlast keep stock in Iraq?",
      ar: "هل تحتفظ أطلس بلاست بمخزون داخل العراق؟",
      ckb: "ئایا ئەتلەس پلاست کۆگای لە ناو عێراق هەیە؟",
    },
    a: {
      en: "Yes. AtlasPlast’s warehouses in Baghdad, Basra, Erbil, Duhok and Zakho are planned to hold nine months of national demand, so contractors and installers are supplied without interruption.",
      ar: "نعم. صُمّمت مخازن أطلس بلاست في بغداد والبصرة وأربيل ودهوك وزاخو لتغطية حاجة البلاد لمدة تسعة أشهر، ليصل التجهيز إلى المقاولين والحرفيين دون انقطاع.",
      ckb: "بەڵێ. کۆگاکانی ئەتلەس پلاست لە بەغدا، بەسرە، هەولێر، دهۆک و زاخۆ بە شێوەیەک داڕێژراون کە پێداویستیی وڵات بۆ ماوەی نۆ مانگ دابین بکەن، بۆ ئەوەی بەڵێندەران و وەستاکاران بێ پچڕان کەرەستەیان پێبگات.",
    },
  },
  {
    id: "genuine-products",
    topic: "products",
    href: "/brands",
    source: "profile:p4",
    q: {
      en: "Where do AtlasPlast’s products come from?",
      ar: "من أين تأتي منتجات أطلس بلاست؟",
      ckb: "بەرهەمەکانی ئەتلەس پلاست لە کوێوە دێن؟",
    },
    a: {
      en: "Every product line comes from a manufacturer AtlasPlast represents directly, in Switzerland, Germany, Austria, the Netherlands, Italy, the Czech Republic, Serbia, Turkey, Saudi Arabia or Egypt. Each brand page shows the manufacturer’s country of origin.",
      ar: "كل خط منتجات يأتي من شركة مصنّعة تمثّلها أطلس بلاست مباشرة، في سويسرا أو ألمانيا أو النمسا أو هولندا أو إيطاليا أو التشيك أو صربيا أو تركيا أو السعودية أو مصر. وتعرض صفحة كل علامة بلد المنشأ.",
      ckb: "هەر هێڵێکی بەرهەم لە بەرهەمهێنەرێکەوە دێت کە ئەتلەس پلاست ڕاستەوخۆ نوێنەرایەتیی دەکات، لە سویسرا، ئەڵمانیا، نەمسا، هۆڵەندا، ئیتاڵیا، کۆماری چیک، سڕبیا، تورکیا، سعوودیە یان میسر. پەڕەی هەر براندێک وڵاتی سەرچاوەی پیشان دەدات.",
    },
  },
  {
    id: "choosing-help",
    topic: "products",
    href: "/contact",
    source: "profile:p20",
    q: {
      en: "Can AtlasPlast help me choose the right pipe system?",
      ar: "هل تساعدني أطلس بلاست في اختيار نظام الأنابيب المناسب؟",
      ckb: "ئایا ئەتلەس پلاست یارمەتیم دەدات سیستەمی بۆریی گونجاو هەڵبژێرم؟",
    },
    a: {
      en: "Yes. AtlasPlast’s sales and technical teams advise on selection, quantities and delivery for projects of every size, with pre-sale consultation and on-site assistance from the engineering team. Call the main line {mainPhone} or message WhatsApp {whatsapp}.",
      ar: "نعم. يقدّم فريقا المبيعات والدعم الفني في أطلس بلاست المشورة في الاختيار والكميات والتوصيل لمشاريع بكل الأحجام، مع استشارات قبل البيع ومساندة في موقع العمل من الفريق الهندسي. اتصل بالرقم الرئيسي {mainPhone} أو راسلنا على واتساب {whatsapp}.",
      ckb: "بەڵێ. تیمەکانی فرۆشتن و تەکنیکیی ئەتلەس پلاست ڕاوێژ لەسەر هەڵبژاردن، بڕ و گەیاندن بۆ پڕۆژەی هەموو قەبارەیەک دەدەن، لەگەڵ ڕاوێژی پێش فرۆشتن و یارمەتی لە شوێنی کار لەلایەن تیمی ئەندازیارییەوە. پەیوەندی بە ژمارەی سەرەکی {mainPhone} بکە یان لە واتسئاپ {whatsapp} نامە بنێرە.",
    },
  },
  {
    id: "technical-documents",
    topic: "products",
    href: "/brands",
    source: "manufacturer:2026-10-04",
    q: {
      en: "Where can I find technical catalogues and data sheets?",
      ar: "أين أجد الكتالوجات الفنية وصحائف البيانات؟",
      ckb: "کاتالۆگی تەکنیکی و پەڕەی زانیارییەکان لە کوێ دەدۆزمەوە؟",
    },
    a: {
      en: "Most brand pages on this site have a Technical documents section that links to the manufacturer’s official catalogues, data sheets and certificates, in English. For a brand without documents, ask the sales team on {mainPhone}.",
      ar: "تحتوي معظم صفحات العلامات في هذا الموقع على قسم الوثائق الفنية، ويربط بكتالوجات الشركة المصنّعة الرسمية وصحائف البيانات والشهادات باللغة الإنجليزية. وللعلامات التي لا تتوفر لها وثائق، اسأل فريق المبيعات على {mainPhone}.",
      ckb: "زۆربەی پەڕەکانی براند لەم ماڵپەڕەدا بەشی بەڵگەنامە تەکنیکییەکانیان هەیە، کە بەستەری کاتالۆگ، پەڕەی زانیاری و بڕوانامە فەرمییەکانی بەرهەمهێنەر بە ئینگلیزی دەدات. بۆ براندێک کە بەڵگەنامەی نییە، لە تیمی فرۆشتن بپرسە لەسەر {mainPhone}.",
    },
  },
  {
    id: "complete-systems",
    topic: "products",
    href: "/solutions",
    source: "profile:p4",
    q: {
      en: "Can I source a complete building water system from one supplier?",
      ar: "هل يمكنني تجهيز نظام مياه كامل للمبنى من مورّد واحد؟",
      ckb: "ئایا دەتوانم سیستەمێکی تەواوی ئاوی بینا لە یەک دابینکەرەوە وەربگرم؟",
    },
    a: {
      en: "Yes. AtlasPlast covers the whole route of water, from the water main to the tap: PE100 and U-PVC networks, PP-R supply pipes inside the building, pumps and pressure units, water heaters, faucets and valves, sanitaryware and cisterns, and the drainage that takes water away.",
      ar: "نعم. تغطي أطلس بلاست مسار المياه كاملاً، من الخط الرئيسي إلى الحنفية: شبكات PE100 وU-PVC، وأنابيب PP-R داخل المبنى، والمضخات ووحدات الضغط، وسخانات المياه، والخلاطات والمحابس، والأدوات الصحية وخزانات الدفن، وأنظمة الصرف.",
      ckb: "بەڵێ. ئەتلەس پلاست هەموو ڕێڕەوی ئاو دەگرێتەوە، لە هێڵی سەرەکیی ئاوەوە تا حەنەفیە: تۆڕی PE100 و U-PVC، بۆریی PP-R لە ناو بینا، پەمپ و یەکەی پەستان، ئاوگەرمکەرەوە، حەنەفیە و ڤاڵڤ، کەلوپەلی تەندروستی، و ئاوەڕۆ.",
    },
  },
  {
    id: "galvanized-fittings",
    topic: "products",
    solutions: ["galvanized-fittings"],
    href: "/solutions/galvanized-fittings",
    source: "confirmed:2026-10-04",
    q: {
      en: "Does AtlasPlast supply galvanized pipe fittings?",
      ar: "هل توفّر أطلس بلاست ملحقات أنابيب مغلفنة؟",
      ckb: "ئایا ئەتلەس پلاست پێکهاتەی گەلڤانیزەکراوی بۆری دابین دەکات؟",
    },
    a: {
      en: "Yes. AtlasPlast supplies Georg Fischer threaded fittings in galvanized malleable cast iron, produced in Austria to EN 10242.",
      ar: "نعم. توفّر أطلس بلاست ملحقات Georg Fischer الملولبة من الحديد المطاوع المغلفن، المصنوعة في النمسا وفق المعيار EN 10242.",
      ckb: "بەڵێ. ئەتلەس پلاست پێکهاتەی بادراوی Georg Fischer لە ئاسنی نەرمی گەلڤانیزەکراو دابین دەکات، کە لە نەمسا بەپێی ستانداردی EN 10242 دروست دەکرێن.",
    },
  },
  // ── Water supply pipes ────────────────────────────────────────────
  {
    id: "water-supply-range",
    topic: "waterSupply",
    solutions: ["water-supply"],
    href: "/solutions/water-supply",
    source: "profile:p8",
    q: {
      en: "Which water supply pipes does AtlasPlast supply in Iraq?",
      ar: "ما أنابيب إمدادات المياه التي توفّرها أطلس بلاست في العراق؟",
      ckb: "ئەتلەس پلاست چ بۆرییەکی دابینکردنی ئاو لە عێراق دابین دەکات؟",
    },
    a: {
      en: "PP-R, PP-RCT and multilayer pressure pipes for hot, cold and drinking water, including UV-resistant lines for exposed runs. The brands are Polymelt (POLO-POLYMUTAN, POLO-ECOSAN, POLO-UV, POLO-POLYMUTAN ML5, Polymutan and Polymelt UV), Georg Fischer Aquasystem, Aquapa, Bänninger, Polo Egypt and KAS.",
      ar: "أنابيب ضغط PP-R وPP-RCT ومتعددة الطبقات للمياه الساخنة والباردة ومياه الشرب، ومنها أنظمة مقاومة للأشعة فوق البنفسجية للتمديدات المكشوفة. والعلامات هي Polymelt (POLO-POLYMUTAN وPOLO-ECOSAN وPOLO-UV وPOLO-POLYMUTAN ML5 وPolymutan وPolymelt UV)، وAquasystem من Georg Fischer، وAquapa، وBänninger، وPolo Egypt، وKAS.",
      ckb: "بۆریی پەستانی PP-R، PP-RCT و فرەچین بۆ ئاوی گەرم، سارد و ئاوی خواردنەوە، لەگەڵ هێڵی بەرگری تیشکی سەروو وەنەوشەیی بۆ دامەزراندنی ئاشکرا. براندەکان بریتین لە Polymelt (POLO-POLYMUTAN، POLO-ECOSAN، POLO-UV، POLO-POLYMUTAN ML5، Polymutan و Polymelt UV)، Aquasystemی Georg Fischer، Aquapa، Bänninger، Polo Egypt و KAS.",
    },
  },
  {
    id: "what-is-ppr",
    topic: "waterSupply",
    solutions: ["water-supply"],
    href: "/solutions/water-supply",
    source: "profile:p8",
    q: {
      en: "What is PP-R pipe used for?",
      ar: "فيمَ تُستخدم أنابيب PP-R؟",
      ckb: "بۆریی PP-R بۆ چی بەکاردێت؟",
    },
    a: {
      en: "PP-R (polypropylene random copolymer) pipe carries hot and cold water, including drinking water, inside buildings. Pipes and fittings are joined by heat fusion welding into one leak-free piece, and the material does not corrode.",
      ar: "تُستخدم أنابيب PP-R (البولي بروبيلين العشوائي) لنقل المياه الساخنة والباردة، ومنها مياه الشرب، داخل المباني. وتُوصل الأنابيب والملحقات باللحام الحراري لتصبح قطعة واحدة دون تسرب، ولا تتعرض المادة للتآكل.",
      ckb: "بۆریی PP-R (پۆلی پرۆپیلینی هەڕەمەکی) ئاوی گەرم و سارد، لەوانە ئاوی خواردنەوە، لە ناو بیناکاندا دەگوازێتەوە. بۆری و پێکهاتەکان بە لکاندنی گەرمی دەبنە یەک پارچەی بێ دزە، و ماددەکە ژەنگ ناگرێت.",
    },
  },
  {
    id: "ppr-vs-pprct",
    topic: "waterSupply",
    solutions: ["water-supply"],
    href: "/solutions/water-supply",
    source: "profile:p8",
    q: {
      en: "What is the difference between PP-R and PP-RCT?",
      ar: "ما الفرق بين PP-R وPP-RCT؟",
      ckb: "جیاوازیی نێوان PP-R و PP-RCT چییە؟",
    },
    a: {
      en: "PP-RCT is a polypropylene with a modified crystal structure that keeps more of its strength at high temperatures than standard PP-R. It suits hot water and higher pressures, and can allow thinner walls for the same rating. AtlasPlast supplies both, from Polymelt and Bänninger.",
      ar: "PP-RCT بولي بروبيلين ببنية بلّورية معدّلة تحافظ على قوته في درجات الحرارة العالية أكثر من PP-R العادي. يناسب المياه الساخنة والضغوط الأعلى، ويسمح بجدران أرق للتصنيف نفسه. وتوفّر أطلس بلاست النوعين من Polymelt وBänninger.",
      ckb: "PP-RCT پۆلی پرۆپیلینێکە بە پێکهاتەی کریستاڵیی گۆڕدراو کە لە پلەی گەرمیی بەرزدا زیاتر لە PP-Rی ئاسایی هێزی خۆی دەپارێزێت. بۆ ئاوی گەرم و پەستانی بەرزتر گونجاوە، و ڕێگە بە دیواری تەنکتر دەدات بۆ هەمان پۆل. ئەتلەس پلاست هەردووکیان لە Polymelt و Bänninger دابین دەکات.",
    },
  },
  {
    id: "uv-resistant-pipes",
    topic: "waterSupply",
    solutions: ["water-supply"],
    href: "/solutions/water-supply",
    source: "profile:p8",
    q: {
      en: "Which pipes can be installed in direct sunlight?",
      ar: "ما الأنابيب التي يمكن تركيبها تحت أشعة الشمس المباشرة؟",
      ckb: "چ بۆرییەک دەتوانرێت لە بەر تیشکی ڕاستەوخۆی خۆر دابمەزرێت؟",
    },
    a: {
      en: "For exposed runs on roofs, outdoors and in irrigation, use a UV-resistant system: POLO-UV ML5 fibre pipes with PP-R fittings, or Polymelt UV, which has a black UV-resistant outer layer and is rated 25 bar at 20 °C and 11 bar at 70 °C.",
      ar: "للتمديدات المكشوفة على الأسطح وفي الخارج وأنظمة الري، استخدم نظاماً مقاوماً للأشعة فوق البنفسجية: أنابيب POLO-UV ML5 المدعّمة بالألياف مع ملحقات PP-R، أو Polymelt UV ذات الطبقة الخارجية السوداء المقاومة للأشعة، بضغط تشغيل 25 بار عند 20 °م و11 بار عند 70 °م.",
      ckb: "بۆ دامەزراندنی ئاشکرا لەسەر بان، لە دەرەوە و لە ئاودێریدا، سیستەمێکی بەرگری تیشکی سەروو وەنەوشەیی بەکاربهێنە: بۆریی ڕیشاڵداری POLO-UV ML5 لەگەڵ پێکهاتەی PP-R، یان Polymelt UV کە چینێکی دەرەوەی ڕەشی بەرگری تیشکی هەیە و پەستانی کارکردنی 25 بار لە 20 پلە و 11 بار لە 70 پلەیە.",
    },
  },
  {
    id: "ppr-sizes",
    topic: "waterSupply",
    solutions: ["water-supply"],
    href: "/solutions/water-supply",
    source: "profile:p7",
    q: {
      en: "What sizes and pressure classes do PP-R pipes come in?",
      ar: "ما مقاسات أنابيب PP-R وفئات ضغطها؟",
      ckb: "بۆریی PP-R بە چ پێوانە و پۆلێکی پەستان هەیە؟",
    },
    a: {
      en: "Most PP-R lines run from Ø 20 to 110 mm, and Georg Fischer Aquasystem goes up to Ø 200 mm. Pipes come in 4 m lengths (some brands 4 to 6 m) and in pressure classes PN 10, PN 16, PN 20 and PN 25.",
      ar: "تتراوح معظم خطوط PP-R من قطر 20 إلى 110 مم، ويصل Aquasystem من Georg Fischer إلى قطر 200 مم. وتأتي الأنابيب بطول 4 م (ولدى بعض العلامات من 4 إلى 6 م) وبفئات ضغط PN 10 وPN 16 وPN 20 وPN 25.",
      ckb: "زۆربەی هێڵەکانی PP-R لە تیرەی 20 تا 110 ملمن، و Aquasystemی Georg Fischer تا تیرەی 200 ملم دەگات. بۆرییەکان بە درێژیی 4 م (لای هەندێک براند 4 تا 6 م) و بە پۆلی پەستانی PN 10، PN 16، PN 20 و PN 25 هەن.",
    },
  },
  {
    id: "ppr-standards",
    topic: "waterSupply",
    solutions: ["water-supply"],
    href: "/solutions/water-supply",
    source: "profile:p8",
    q: {
      en: "Which standards do AtlasPlast’s PP-R pipes meet?",
      ar: "ما المعايير التي تطابقها أنابيب PP-R من أطلس بلاست؟",
      ckb: "بۆرییەکانی PP-Rی ئەتلەس پلاست بەپێی چ ستانداردێکن؟",
    },
    a: {
      en: "The PP-R and PP-RCT lines are made to DIN 8077 and DIN 8078 and to EN ISO 15874. Polymelt Polymutan and Polymelt UV also meet EN ISO 21003 for multilayer pipes.",
      ar: "تُصنع خطوط PP-R وPP-RCT وفق DIN 8077 وDIN 8078 وEN ISO 15874. وتطابق Polymutan وPolymelt UV من Polymelt أيضاً المعيار EN ISO 21003 للأنابيب متعددة الطبقات.",
      ckb: "هێڵەکانی PP-R و PP-RCT بەپێی DIN 8077، DIN 8078 و EN ISO 15874 دروست دەکرێن. Polymutan و Polymelt UVی Polymelt هەروەها بەپێی EN ISO 21003 ن بۆ بۆریی فرەچین.",
    },
  },
  {
    id: "ml5-pipe",
    topic: "waterSupply",
    solutions: ["water-supply"],
    href: "/brands/polymelt",
    source: "confirmed:2026-10-04",
    q: {
      en: "What is a five-layer ML5 pipe?",
      ar: "ما هو أنبوب ML5 خماسي الطبقات؟",
      ckb: "بۆریی پێنج چینی ML5 چییە؟",
    },
    a: {
      en: "POLO-POLYMUTAN ML5 from Polymelt is a five-layer pipe that combines PP-R 80, an HPCE compound and PP-RCT for added strength in hot and cold water installations.",
      ar: "POLO-POLYMUTAN ML5 من Polymelt أنبوب خماسي الطبقات يجمع PP-R 80 ومركّب HPCE وPP-RCT لمتانة أعلى في تمديدات المياه الساخنة والباردة.",
      ckb: "POLO-POLYMUTAN ML5ی Polymelt بۆرییەکی پێنج چینە کە PP-R 80، تێکەڵەی HPCE و PP-RCT کۆدەکاتەوە بۆ بەهێزیی زیاتر لە دامەزراندنی ئاوی گەرم و سارددا.",
    },
  },
  {
    id: "drinking-water-pipes",
    topic: "waterSupply",
    solutions: ["water-supply"],
    href: "/solutions/water-supply",
    source: "confirmed:2026-10-04",
    q: {
      en: "Which pipes are suitable for drinking water?",
      ar: "ما الأنابيب المناسبة لمياه الشرب؟",
      ckb: "چ بۆرییەک بۆ ئاوی خواردنەوە گونجاوە؟",
    },
    a: {
      en: "The PP-R and PP-RCT water supply range is made for hot, cold and drinking water. POLO-ECOSAN from Polymelt is a PP-R system designed for healthy, corrosion-free drinking water, and Pimtaş compression fittings serve drinking-water networks.",
      ar: "صُمّمت تشكيلة أنابيب PP-R وPP-RCT لإمدادات المياه الساخنة والباردة ومياه الشرب. وPOLO-ECOSAN من Polymelt نظام PP-R مخصص لمياه شرب صحية وخالية من التآكل، وتخدم ملحقات الضغط من Pimtaş شبكات مياه الشرب.",
      ckb: "کۆمەڵەی بۆریی PP-R و PP-RCT بۆ ئاوی گەرم، سارد و ئاوی خواردنەوە دروست کراوە. POLO-ECOSANی Polymelt سیستەمێکی PP-Rە بۆ ئاوی خواردنەوەی تەندروست و بێ ژەنگ، و پێکهاتەی کۆمپرێشنی Pimtaş خزمەتی تۆڕەکانی ئاوی خواردنەوە دەکەن.",
    },
  },
  {
    id: "aquasystem",
    topic: "waterSupply",
    solutions: ["water-supply"],
    href: "/brands/georg-fischer",
    source: "profile:p7",
    q: {
      en: "What is Georg Fischer Aquasystem?",
      ar: "ما هو نظام Aquasystem من Georg Fischer؟",
      ckb: "Aquasystemی Georg Fischer چییە؟",
    },
    a: {
      en: "Aquasystem is Georg Fischer’s PP-R pipe system for hot and cold water in buildings, from Ø 20 to 200 mm in 4 m lengths, in PN 10 to PN 25, made to EN ISO 15874, DIN 8077 and DIN 8078.",
      ar: "Aquasystem نظام أنابيب PP-R من Georg Fischer للمياه الساخنة والباردة في المباني، من قطر 20 إلى 200 مم بطول 4 م، وبفئات ضغط من PN 10 إلى PN 25، وفق EN ISO 15874 وDIN 8077 وDIN 8078.",
      ckb: "Aquasystem سیستەمی بۆریی PP-Rی Georg Fischerە بۆ ئاوی گەرم و سارد لە بیناکاندا، لە تیرەی 20 تا 200 ملم بە درێژیی 4 م، بە پۆلی PN 10 تا PN 25، بەپێی EN ISO 15874، DIN 8077 و DIN 8078.",
    },
  },
  {
    id: "kas-ppr",
    topic: "waterSupply",
    solutions: ["water-supply"],
    href: "/brands/kas",
    source: "confirmed:2026-10-04",
    q: {
      en: "Which KAS pipes does AtlasPlast supply?",
      ar: "ما أنابيب KAS التي توفّرها أطلس بلاست؟",
      ckb: "ئەتلەس پلاست چ بۆرییەکی KAS دابین دەکات؟",
    },
    a: {
      en: "AtlasPlast supplies KAS PPR pipes and fittings for hot and cold water. It does not supply the KAS PPR-C line. AtlasPlast also supplies KAS faucets.",
      ar: "توفّر أطلس بلاست أنابيب وملحقات KAS PPR للمياه الساخنة والباردة، ولا توفّر خط KAS PPR-C. كما توفّر خلاطات KAS.",
      ckb: "ئەتلەس پلاست بۆری و پێکهاتەی KAS PPR بۆ ئاوی گەرم و سارد دابین دەکات، و هێڵی KAS PPR-C دابین ناکات. هەروەها حەنەفیەکانی KAS دابین دەکات.",
    },
  },
  // ── Drainage and grey water ───────────────────────────────────────
  {
    id: "drainage-range",
    topic: "drainage",
    solutions: ["drainage"],
    href: "/solutions/drainage",
    source: "profile:p16",
    q: {
      en: "Which drainage systems does AtlasPlast supply?",
      ar: "ما أنظمة الصرف التي توفّرها أطلس بلاست؟",
      ckb: "ئەتلەس پلاست چ سیستەمێکی ئاوەڕۆ دابین دەکات؟",
    },
    a: {
      en: "Three kinds: PVC-U drainage pipes (Boroug UPVC), low-noise PP systems for inside buildings (Georg Fischer Silenta Premium and Silenta 3A, Poloplast POLO-KAL NG and POLO-KAL 3S, Aquapa Aqua Silent PP, Ostendorf Skolan Safe and HT Safe), and the Ostendorf KG-System for buried sewers.",
      ar: "ثلاثة أنواع: أنابيب صرف PVC-U (Boroug UPVC)، وأنظمة PP منخفضة الضوضاء داخل المباني (Silenta Premium وSilenta 3A من Georg Fischer، وPOLO-KAL NG وPOLO-KAL 3S من Poloplast، وAqua Silent PP من Aquapa، وSkolan Safe وHT Safe من Ostendorf)، ونظام KG من Ostendorf للمجاري المدفونة.",
      ckb: "سێ جۆر: بۆریی ئاوەڕۆی PVC-U (Boroug UPVC)، سیستەمی PPی کەمدەنگ بۆ ناو بیناکان (Silenta Premium و Silenta 3Aی Georg Fischer، POLO-KAL NG و POLO-KAL 3Sی Poloplast، Aqua Silent PPی Aquapa، Skolan Safe و HT Safeی Ostendorf)، و سیستەمی KGی Ostendorf بۆ ئاوەڕۆی ژێرزەوی.",
    },
  },
  {
    id: "low-noise-drainage",
    topic: "drainage",
    solutions: ["drainage"],
    href: "/solutions/drainage",
    source: "profile:p13",
    q: {
      en: "What is a low-noise (silent) drainage system?",
      ar: "ما هو نظام الصرف منخفض الضوضاء (الصامت)؟",
      ckb: "سیستەمی ئاوەڕۆی کەمدەنگ (بێدەنگ) چییە؟",
    },
    a: {
      en: "A low-noise system uses heavy, mineral-filled or multilayer PP pipes and sound-insulating fittings so that waste water running through a building is barely heard. Each system is rated in dB(A) at a stated flow under EN 14366 or DIN 4109, which makes them a common choice for hotels, hospitals and apartments.",
      ar: "يستخدم النظام منخفض الضوضاء أنابيب PP ثقيلة أو مدعّمة بالمعادن أو متعددة الطبقات وملحقات عازلة للصوت، فلا يكاد يُسمع صوت مياه الصرف في المبنى. ويُصنّف كل نظام بالديسيبل dB(A) عند تدفق محدد وفق EN 14366 أو DIN 4109، ولذلك يُختار كثيراً للفنادق والمستشفيات والشقق.",
      ckb: "سیستەمی کەمدەنگ بۆریی PPی قورس، پڕکراو بە کانزا یان فرەچین و پێکهاتەی دەنگبڕ بەکاردەهێنێت، بۆ ئەوەی دەنگی ئاوی پیس لە ناو بینادا بە زەحمەت ببیسترێت. هەر سیستەمێک بە dB(A) لە ڕێژەیەکی دیاریکراوی ڕۆیشتندا بەپێی EN 14366 یان DIN 4109 پۆلێن دەکرێت، بۆیە زۆر جار بۆ هوتێل، نەخۆشخانە و شوقە هەڵدەبژێردرێت.",
    },
  },
  {
    id: "quietest-drainage",
    topic: "drainage",
    solutions: ["drainage"],
    href: "/solutions/drainage",
    source: "profile:p7",
    q: {
      en: "Which drainage system is the quietest?",
      ar: "ما أكثر أنظمة الصرف هدوءاً؟",
      ckb: "کام سیستەمی ئاوەڕۆ بێدەنگترینە؟",
    },
    a: {
      en: "Georg Fischer Silenta Premium has the lowest published figure in the range: 7 dB(A) at 2 l/s to EN 14366. Next are POLO-KAL 3S at 12 dB(A) at 4 l/s (DIN 4109), Silenta 3A and Skolan Safe at 17 dB(A) at 4 l/s, and POLO-KAL NG at 18 dB(A) at 2 l/s. Compare figures at the same flow and test method.",
      ar: "يحمل Silenta Premium من Georg Fischer أدنى رقم منشور في التشكيلة: 7 dB(A) عند 2 لتر/ثانية وفق EN 14366. يليه POLO-KAL 3S بـ12 dB(A) عند 4 لتر/ثانية (DIN 4109)، ثم Silenta 3A وSkolan Safe بـ17 dB(A) عند 4 لتر/ثانية، وPOLO-KAL NG بـ18 dB(A) عند 2 لتر/ثانية. قارن الأرقام عند التدفق وطريقة الاختبار نفسيهما.",
      ckb: "Silenta Premiumی Georg Fischer نزمترین ژمارەی بڵاوکراوەی هەیە لە کۆمەڵەکەدا: 7 dB(A) لە 2 لیتر/چرکە بەپێی EN 14366. دواتر POLO-KAL 3S بە 12 dB(A) لە 4 لیتر/چرکە (DIN 4109)، Silenta 3A و Skolan Safe بە 17 dB(A) لە 4 لیتر/چرکە، و POLO-KAL NG بە 18 dB(A) لە 2 لیتر/چرکە. ژمارەکان لە هەمان ڕێژەی ڕۆیشتن و هەمان شێوازی تاقیکردنەوەدا بەراورد بکە.",
    },
  },
  {
    id: "kg-system",
    topic: "drainage",
    solutions: ["drainage"],
    href: "/brands/ostendorf",
    source: "profile:p16",
    q: {
      en: "What is the KG system?",
      ar: "ما هو نظام KG؟",
      ckb: "سیستەمی KG چییە؟",
    },
    a: {
      en: "KG is the German name for buried sewer pipe. The Ostendorf KG-System that AtlasPlast supplies is co-extruded PVC-U pipe for underground drainage, from Ø 110 to 500 mm, in ring stiffness classes SN 4, SN 8 and SN 10, made to DIN EN 13476-2 and DIN EN 1401-1.",
      ar: "KG هو الاسم الألماني لأنابيب المجاري المدفونة. ونظام KG من Ostendorf الذي توفّره أطلس بلاست أنابيب PVC-U متعددة الطبقات للصرف تحت الأرض، من قطر 110 إلى 500 مم، بفئات صلابة SN 4 وSN 8 وSN 10، وفق DIN EN 13476-2 وDIN EN 1401-1.",
      ckb: "KG ناوی ئەڵمانییە بۆ بۆریی ئاوەڕۆی ژێرزەوی. سیستەمی KGی Ostendorf کە ئەتلەس پلاست دابینی دەکات بۆریی PVC-Uی فرەچینە بۆ ئاوەڕۆی ژێرزەوی، لە تیرەی 110 تا 500 ملم، بە پۆلی ڕەقیی SN 4، SN 8 و SN 10، بەپێی DIN EN 13476-2 و DIN EN 1401-1.",
    },
  },
  {
    id: "ring-stiffness",
    topic: "drainage",
    solutions: ["drainage"],
    href: "/solutions/drainage",
    source: "profile:p16",
    q: {
      en: "What does SN 4, SN 8 or SN 10 mean on a sewer pipe?",
      ar: "ماذا يعني SN 4 أو SN 8 أو SN 10 على أنبوب المجاري؟",
      ckb: "SN 4، SN 8 یان SN 10 لەسەر بۆریی ئاوەڕۆ مانای چییە؟",
    },
    a: {
      en: "SN is the ring stiffness class of a buried pipe in kN/m²: SN 8 means 8 kN/m². A higher class resists more soil and traffic load, so SN 8 and SN 10 are used under roads and deeper trenches, and SN 4 where loads are light.",
      ar: "SN هي فئة صلابة الحلقة للأنبوب المدفون بوحدة كيلونيوتن/م²: فـSN 8 تعني 8 كيلونيوتن/م². وكلما ارتفعت الفئة تحمّل الأنبوب أحمال تربة ومرور أكبر، لذلك يُستخدم SN 8 وSN 10 تحت الطرق وفي الخنادق الأعمق، وSN 4 حيث الأحمال خفيفة.",
      ckb: "SN پۆلی ڕەقیی بازنەیی بۆرییەکی ژێرزەوییە بە کیلۆنیوتن/م²: SN 8 واتە 8 کیلۆنیوتن/م². پۆلی بەرزتر بەرگەی باری زیاتری خۆڵ و هاتوچۆ دەگرێت، بۆیە SN 8 و SN 10 لە ژێر ڕێگاکان و چاڵی قووڵتردا بەکاردێن، و SN 4 لەو شوێنانەی بارەکە سووکە.",
    },
  },
  {
    id: "drainage-sizes",
    topic: "drainage",
    solutions: ["drainage"],
    href: "/solutions/drainage",
    source: "profile:p17",
    q: {
      en: "What sizes of drainage pipe are available?",
      ar: "ما مقاسات أنابيب الصرف المتوفرة؟",
      ckb: "بۆریی ئاوەڕۆ بە چ پێوانەیەک بەردەستە؟",
    },
    a: {
      en: "From Ø 25 mm (Boroug PVC-U, in 6 to 12 m lengths) up to Ø 500 mm (Ostendorf KG-System). Low-noise PP systems inside buildings generally cover Ø 32 to 200 mm.",
      ar: "من قطر 25 مم (Boroug PVC-U بأطوال من 6 إلى 12 م) حتى قطر 500 مم (نظام KG من Ostendorf). وتغطي أنظمة PP منخفضة الضوضاء داخل المباني عموماً الأقطار من 32 إلى 200 مم.",
      ckb: "لە تیرەی 25 ملم (Boroug PVC-U، بە درێژیی 6 تا 12 م) تا تیرەی 500 ملم (سیستەمی KGی Ostendorf). سیستەمە کەمدەنگەکانی PP لە ناو بیناکاندا بە گشتی تیرەی 32 تا 200 ملم دەگرنەوە.",
    },
  },
  {
    id: "drainage-chemical-resistance",
    topic: "drainage",
    solutions: ["drainage"],
    href: "/solutions/drainage",
    source: "profile:p13",
    q: {
      en: "Are the drainage pipes resistant to chemicals?",
      ar: "هل أنابيب الصرف مقاومة للمواد الكيميائية؟",
      ckb: "ئایا بۆرییەکانی ئاوەڕۆ بەرگری مادە کیمیاییەکان دەکەن؟",
    },
    a: {
      en: "Yes, within published ranges: Poloplast POLO-KAL NG resists pH 2 to 13, Ostendorf Skolan Safe pH 2 to 12, and Boroug PVC-U about pH 2 to 13. Check the manufacturer’s chemical resistance list for industrial waste water.",
      ar: "نعم، ضمن حدود منشورة: يقاوم POLO-KAL NG من Poloplast درجة حموضة من 2 إلى 13، وSkolan Safe من Ostendorf من 2 إلى 12، وBoroug PVC-U نحو 2 إلى 13. راجع جدول المقاومة الكيميائية لدى الشركة المصنّعة لمياه الصرف الصناعية.",
      ckb: "بەڵێ، لە سنووری بڵاوکراوەدا: POLO-KAL NGی Poloplast بەرگری pH 2 تا 13 دەکات، Skolan Safeی Ostendorf pH 2 تا 12، و Boroug PVC-U نزیکەی pH 2 تا 13. بۆ ئاوی پیسی پیشەسازی سەیری لیستی بەرگریی کیمیایی بەرهەمهێنەر بکە.",
    },
  },
  {
    id: "drainage-fire-class",
    topic: "drainage",
    solutions: ["drainage"],
    href: "/solutions/drainage",
    source: "profile:p16",
    q: {
      en: "What fire classes do the drainage systems have?",
      ar: "ما تصنيفات الحريق لأنظمة الصرف؟",
      ckb: "سیستەمەکانی ئاوەڕۆ چ پۆلێکی ئاگریان هەیە؟",
    },
    a: {
      en: "Georg Fischer Silenta Premium and Silenta 3A, Poloplast POLO-KAL NG and Ostendorf Skolan Safe are class B2 to DIN 4102. Ostendorf HT Safe is B1, and POLO-KAL 3S is D-s2 and B2.",
      ar: "Silenta Premium وSilenta 3A من Georg Fischer وPOLO-KAL NG من Poloplast وSkolan Safe من Ostendorf من الفئة B2 وفق DIN 4102. وHT Safe من Ostendorf من الفئة B1، وPOLO-KAL 3S من الفئتين D-s2 وB2.",
      ckb: "Silenta Premium و Silenta 3Aی Georg Fischer، POLO-KAL NGی Poloplast و Skolan Safeی Ostendorf پۆلی B2ن بەپێی DIN 4102. HT Safeی Ostendorf پۆلی B1ە، و POLO-KAL 3S پۆلی D-s2 و B2یە.",
    },
  },
  {
    id: "grey-water",
    topic: "drainage",
    solutions: ["drainage"],
    href: "/solutions/drainage",
    source: "profile:p13",
    q: {
      en: "What is grey water drainage?",
      ar: "ما هو صرف المياه الرمادية؟",
      ckb: "ئاوەڕۆی ئاوی خۆڵەمێشی چییە؟",
    },
    a: {
      en: "Grey water is the waste water from basins, showers, baths and kitchens, as opposed to the soil water from WCs. AtlasPlast’s drainage solution covers grey water branches, soil stacks and buried sewer lines.",
      ar: "المياه الرمادية هي مياه الصرف القادمة من المغاسل والدوش وأحواض الاستحمام والمطابخ، بخلاف مياه المراحيض. ويغطي حل الصرف من أطلس بلاست فروع المياه الرمادية وأعمدة الصرف وخطوط المجاري المدفونة.",
      ckb: "ئاوی خۆڵەمێشی ئەو ئاوە پیسەیە کە لە دەستشۆر، دووش، بانیۆ و چێشتخانەوە دێت، جیاواز لە ئاوی تەوالێت. چارەسەری ئاوەڕۆی ئەتلەس پلاست لقەکانی ئاوی خۆڵەمێشی، ستوونی ئاوەڕۆ و هێڵی ئاوەڕۆی ژێرزەوی دەگرێتەوە.",
    },
  },
  // ── Infrastructure networks ───────────────────────────────────────
  {
    id: "infrastructure-range",
    topic: "infrastructure",
    solutions: ["infrastructure"],
    href: "/solutions/infrastructure",
    source: "profile:p11",
    q: {
      en: "Which pipes does AtlasPlast supply for water mains and city networks?",
      ar: "ما الأنابيب التي توفّرها أطلس بلاست لخطوط المياه الرئيسية وشبكات المدن؟",
      ckb: "ئەتلەس پلاست چ بۆرییەک بۆ هێڵی سەرەکیی ئاو و تۆڕی شارەکان دابین دەکات؟",
    },
    a: {
      en: "PE100 pressure pipes from Pimtaş, Turan Borfit and Georg Fischer; U-PVC pressure pipes from Pimtaş; Pimtaş compression fittings; injection-moulded, electrofusion and fabricated PE fittings from Turan Borfit; and Bänninger PE and PVC-U systems from Ø 8 to 1000 mm.",
      ar: "أنابيب ضغط PE100 من Pimtaş وTuran Borfit وGeorg Fischer، وأنابيب ضغط U-PVC من Pimtaş، وملحقات الضغط من Pimtaş، وملحقات PE المحقونة والملحومة كهربائياً والمصنّعة من Turan Borfit، وأنظمة PE وPVC-U من Bänninger من قطر 8 إلى 1000 مم.",
      ckb: "بۆریی پەستانی PE100 لە Pimtaş، Turan Borfit و Georg Fischer؛ بۆریی پەستانی U-PVC لە Pimtaş؛ پێکهاتەی کۆمپرێشنی Pimtaş؛ پێکهاتەی PEی قاڵبکراو، لکاندنی کارەبایی و دروستکراو لە Turan Borfit؛ و سیستەمی PE و PVC-Uی Bänninger لە تیرەی 8 تا 1000 ملم.",
    },
  },
  {
    id: "what-is-pe100",
    topic: "infrastructure",
    solutions: ["infrastructure"],
    href: "/solutions/infrastructure",
    source: "profile:p12",
    q: {
      en: "What is PE100 pipe?",
      ar: "ما هو أنبوب PE100؟",
      ckb: "بۆریی PE100 چییە؟",
    },
    a: {
      en: "PE100 is a high-density polyethylene grade with a minimum required strength of 10 MPa. It is flexible, corrosion-free and joined by butt or electrofusion welding, which makes it the usual choice for water mains, distribution networks and pressurised infrastructure.",
      ar: "PE100 درجة من البولي إيثيلين عالي الكثافة بحد أدنى للمتانة المطلوبة قدره 10 ميغاباسكال. وهو مرن ولا يتآكل ويوصل باللحام التناكبي أو الكهربائي، ولذلك يُختار عادةً لخطوط المياه الرئيسية وشبكات التوزيع والبنى التحتية المضغوطة.",
      ckb: "PE100 پلەیەکی پۆلی ئێسیلینی چڕیی بەرزە بە کەمترین هێزی پێویستی 10 مێگاپاسکاڵ. نەرمە، ژەنگ ناگرێت و بە لکاندنی ڕووبەڕوو یان کارەبایی دەلکێنرێت، بۆیە بە زۆری بۆ هێڵی سەرەکیی ئاو، تۆڕی دابەشکردن و ژێرخانی بەپەستان هەڵدەبژێردرێت.",
    },
  },
  {
    id: "largest-diameter",
    topic: "infrastructure",
    solutions: ["infrastructure"],
    href: "/solutions/infrastructure",
    source: "profile:p12",
    q: {
      en: "What is the largest pipe diameter AtlasPlast can supply?",
      ar: "ما أكبر قطر أنابيب يمكن أن توفّره أطلس بلاست؟",
      ckb: "گەورەترین تیرەی بۆری کە ئەتلەس پلاست دابینی بکات چەندە؟",
    },
    a: {
      en: "Turan Borfit PE fittings go up to Ø 2000 mm and Bänninger PE and PVC-U systems up to Ø 1000 mm. Pimtaş U-PVC pressure pipe reaches Ø 400 mm, Georg Fischer PE100 Ø 355 mm, and Turan Borfit butt welding machines weld PE and PP pipes up to Ø 1200 mm.",
      ar: "تصل ملحقات PE من Turan Borfit إلى قطر 2000 مم، وأنظمة PE وPVC-U من Bänninger إلى قطر 1000 مم. ويبلغ أنبوب الضغط U-PVC من Pimtaş قطر 400 مم، وPE100 من Georg Fischer قطر 355 مم، وتلحم مكائن اللحام التناكبي من Turan Borfit أنابيب PE وPP حتى قطر 1200 مم.",
      ckb: "پێکهاتەکانی PEی Turan Borfit تا تیرەی 2000 ملم و سیستەمی PE و PVC-Uی Bänninger تا تیرەی 1000 ملم دەگەن. بۆریی پەستانی U-PVCی Pimtaş دەگاتە 400 ملم، PE100ی Georg Fischer دەگاتە 355 ملم، و مەکینەی لکاندنی ڕووبەڕووی Turan Borfit بۆریی PE و PP تا تیرەی 1200 ملم دەلکێنێت.",
    },
  },
  {
    id: "compression-fittings",
    topic: "infrastructure",
    solutions: ["infrastructure"],
    href: "/brands/pimtas",
    source: "profile:p11",
    q: {
      en: "What are compression fittings used for?",
      ar: "فيمَ تُستخدم ملحقات الضغط (الكمبريشن)؟",
      ckb: "پێکهاتەی کۆمپرێشن بۆ چی بەکاردێت؟",
    },
    a: {
      en: "Compression fittings join PE pipes mechanically, without welding. Pimtaş compression fittings are for drinking water and pressurised waste water, above and below ground, from Ø 20 to 110 mm (½″ to 4″) in PN 10 and PN 16.",
      ar: "تربط ملحقات الضغط أنابيب PE ميكانيكياً دون لحام. وملحقات Pimtaş مخصصة لمياه الشرب ومياه الصرف المضغوطة، فوق الأرض وتحتها، من قطر 20 إلى 110 مم (½″ إلى 4″) بفئتي ضغط PN 10 وPN 16.",
      ckb: "پێکهاتەی کۆمپرێشن بۆریی PE بە شێوەی میکانیکی و بێ لکاندن پێکەوە دەبەستێت. پێکهاتەکانی کۆمپرێشنی Pimtaş بۆ ئاوی خواردنەوە و ئاوی پیسی بەپەستانن، لەسەر زەوی و ژێر زەوی، لە تیرەی 20 تا 110 ملم (½″ تا 4″) بە PN 10 و PN 16.",
    },
  },
  {
    id: "pe-standards",
    topic: "infrastructure",
    solutions: ["infrastructure"],
    href: "/solutions/infrastructure",
    source: "profile:p7",
    q: {
      en: "Which standards and pressure classes do the PE100 pipes meet?",
      ar: "ما المعايير وفئات الضغط لأنابيب PE100؟",
      ckb: "بۆرییەکانی PE100 بەپێی چ ستاندارد و پۆلێکی پەستانن؟",
    },
    a: {
      en: "Pimtaş PE100 is made to ISO 4427-2, EN 12201-2 and DIN 8074/8075 in PN 6 to PN 20. Turan Borfit PE100 meets EN 1555, EN 12201 and ISO 4437 in PN 10 to PN 25. Georg Fischer PE100 meets EN 12201-2 and ISO 4427:2019 in SDR 9 and SDR 11.",
      ar: "يُصنع PE100 من Pimtaş وفق ISO 4427-2 وEN 12201-2 وDIN 8074/8075 بفئات من PN 6 إلى PN 20. ويطابق PE100 من Turan Borfit المعايير EN 1555 وEN 12201 وISO 4437 بفئات من PN 10 إلى PN 25. ويطابق PE100 من Georg Fischer المعيارين EN 12201-2 وISO 4427:2019 بسلسلتي SDR 9 وSDR 11.",
      ckb: "PE100ی Pimtaş بەپێی ISO 4427-2، EN 12201-2 و DIN 8074/8075 بە PN 6 تا PN 20 دروست دەکرێت. PE100ی Turan Borfit بەپێی EN 1555، EN 12201 و ISO 4437ە بە PN 10 تا PN 25. PE100ی Georg Fischer بەپێی EN 12201-2 و ISO 4427:2019ە بە SDR 9 و SDR 11.",
    },
  },
  {
    id: "upvc-pressure",
    topic: "infrastructure",
    solutions: ["infrastructure"],
    href: "/brands/pimtas",
    source: "profile:p11",
    q: {
      en: "Does AtlasPlast supply U-PVC pressure pipe?",
      ar: "هل توفّر أطلس بلاست أنابيب ضغط U-PVC؟",
      ckb: "ئایا ئەتلەس پلاست بۆریی پەستانی U-PVC دابین دەکات؟",
    },
    a: {
      en: "Yes. Pimtaş U-PVC pressure pipes run from Ø 20 to 400 mm in 6 m lengths, in PN 6, PN 10 and PN 16, with socket, plain-end or O-ring joints, made to EN ISO 1452-2, DIN 8061/8062 and ISO 4422.",
      ar: "نعم. تتوفر أنابيب ضغط U-PVC من Pimtaş من قطر 20 إلى 400 مم بطول 6 م، بفئات PN 6 وPN 10 وPN 16، بوصلات رأس أو أطراف مستوية أو حلقات O-ring، وفق EN ISO 1452-2 وDIN 8061/8062 وISO 4422.",
      ckb: "بەڵێ. بۆرییەکانی پەستانی U-PVCی Pimtaş لە تیرەی 20 تا 400 ملم بە درێژیی 6 م هەن، بە PN 6، PN 10 و PN 16، بە جومگەی سۆکێت، سەری ڕێک یان ئەڵقەی O-ring، بەپێی EN ISO 1452-2، DIN 8061/8062 و ISO 4422.",
    },
  },
  {
    id: "baenninger-infrastructure",
    topic: "infrastructure",
    solutions: ["infrastructure"],
    href: "/brands/baenninger",
    source: "site:/ar/الوكالات/",
    q: {
      en: "Which Bänninger infrastructure systems does AtlasPlast supply?",
      ar: "ما أنظمة البنى التحتية من Bänninger التي توفّرها أطلس بلاست؟",
      ckb: "ئەتلەس پلاست چ سیستەمێکی ژێرخانی Bänninger دابین دەکات؟",
    },
    a: {
      en: "Bänninger PE and PVC-U pipe systems from Ø 8 to 1000 mm. AtlasPlast is the exclusive Bänninger agent for central and southern Iraq and also supplies Bänninger PP-R and PP-RCT water supply pipes.",
      ar: "أنظمة أنابيب PE وPVC-U من Bänninger من قطر 8 إلى 1000 مم. وأطلس بلاست هي الوكيل الحصري لـBänninger في وسط العراق وجنوبه، وتوفّر أيضاً أنابيب PP-R وPP-RCT لإمدادات المياه من Bänninger.",
      ckb: "سیستەمی بۆریی PE و PVC-Uی Bänninger لە تیرەی 8 تا 1000 ملم. ئەتلەس پلاست بریکاری تایبەتی Bänningerە بۆ ناوەڕاست و باشووری عێراق و هەروەها بۆریی PP-R و PP-RCTی Bänninger بۆ دابینکردنی ئاو دابین دەکات.",
    },
  },
  // ── Sanitaryware, tiles and water heaters ─────────────────────────
  {
    id: "sanitaryware-range",
    topic: "bathrooms",
    solutions: ["sanitaryware"],
    href: "/solutions/sanitaryware",
    source: "profile:p15",
    q: {
      en: "Which sanitaryware does AtlasPlast supply?",
      ar: "ما الأدوات الصحية التي توفّرها أطلس بلاست؟",
      ckb: "ئەتلەس پلاست چ کەلوپەلێکی تەندروستی دابین دەکات؟",
    },
    a: {
      en: "Vitreous china WCs, basins, urinals and bidets from Saudi Ceramics (Oryx) and QuarterBath, QuarterBath bathroom furniture and concealed cisterns, and WISA pre-wall elements and built-in cisterns for wall-hung WCs.",
      ar: "مراحيض ومغاسل ومباول وشطافات من البورسلين من الخزف السعودي (Oryx) وQuarterBath، وأثاث حمامات وخزانات دفن من QuarterBath، وهياكل تثبيت وخزانات دفن من WISA للمراحيض المعلّقة.",
      ckb: "تەوالێت، دەستشۆر، میزدان و بیدێی پۆرسلین لە سعوودی سێرامیکس (Oryx) و QuarterBath، مۆبیلیاتی حەمام و سیفۆنی ناو دیواری QuarterBath، و چوارچێوەی پێش دیوار و سیفۆنی ناو دیواری WISA بۆ تەوالێتی هەڵواسراو.",
    },
  },
  {
    id: "water-saving-wc",
    topic: "bathrooms",
    solutions: ["sanitaryware"],
    href: "/solutions/sanitaryware",
    source: "profile:p10",
    q: {
      en: "Does AtlasPlast offer water-saving toilets?",
      ar: "هل توفّر أطلس بلاست مراحيض موفّرة للمياه؟",
      ckb: "ئایا ئەتلەس پلاست تەوالێتی پاشەکەوتکەری ئاو دابین دەکات؟",
    },
    a: {
      en: "Yes. Oryx and QuarterBath WCs and the QuarterBath and WISA cisterns use dual-flush 3/6 litre systems, and Oryx offers rimless and water-saving designs. WISA pre-wall elements carry a WELS 3-star rating.",
      ar: "نعم. تعمل مراحيض Oryx وQuarterBath وخزانات الدفن من QuarterBath وWISA بنظام الدفق المزدوج 3/6 لتر، وتقدّم Oryx تصاميم بدون حافة وموفّرة للمياه. وتحمل هياكل WISA تصنيف WELS بثلاث نجوم.",
      ckb: "بەڵێ. تەوالێتەکانی Oryx و QuarterBath و سیفۆنەکانی QuarterBath و WISA سیستەمی شۆردنی دوولایەنەی 3/6 لیتر بەکاردەهێنن، و Oryx دیزاینی بێ لێوار و پاشەکەوتکەری ئاو پێشکەش دەکات. چوارچێوەکانی WISA پلەی WELSی سێ ئەستێرەیان هەیە.",
    },
  },
  {
    id: "concealed-cistern",
    topic: "bathrooms",
    solutions: ["sanitaryware"],
    href: "/solutions/sanitaryware",
    source: "profile:p14",
    q: {
      en: "What is a concealed cistern or pre-wall element?",
      ar: "ما هو خزان الدفن أو هيكل التثبيت داخل الجدار؟",
      ckb: "سیفۆنی ناو دیوار یان چوارچێوەی پێش دیوار چییە؟",
    },
    a: {
      en: "It is a flush cistern and steel frame built into the wall behind a wall-hung WC, so only the flush plate shows. WISA makes pneumatic and mechanical versions with quiet fill valves; QuarterBath’s has a powder-coated steel frame with adjustable height and depth and a sound insulation pad.",
      ar: "هو خزان دفق وهيكل فولاذي يُبنيان داخل الجدار خلف المرحاض المعلّق، فلا يظهر إلا زر الدفق. تصنع WISA نماذج هوائية وميكانيكية بصمامات تعبئة هادئة، ويأتي خزان QuarterBath بهيكل فولاذي مطلي بالبودرة بارتفاع وعمق قابلين للتعديل ووسادة عزل صوتي.",
      ckb: "سیفۆن و چوارچێوەیەکی پۆڵایە کە لە ناو دیوار لە پشت تەوالێتی هەڵواسراوەوە دادەنرێت، بەجۆرێک تەنها دوگمەی شۆردن دەردەکەوێت. WISA جۆری هەوایی و میکانیکی بە ڤاڵڤی پڕکردنەوەی بێدەنگ دروست دەکات؛ هی QuarterBath چوارچێوەی پۆڵای بۆیەکراوی هەیە بە بەرزی و قووڵیی گۆڕاو و پارچەی دەنگبڕ.",
    },
  },
  {
    id: "bathroom-furniture",
    topic: "bathrooms",
    solutions: ["sanitaryware"],
    href: "/brands/quarterbath",
    source: "profile:p15",
    q: {
      en: "Does AtlasPlast supply bathroom furniture?",
      ar: "هل توفّر أطلس بلاست أثاث حمامات؟",
      ckb: "ئایا ئەتلەس پلاست مۆبیلیاتی حەمام دابین دەکات؟",
    },
    a: {
      en: "Yes. QuarterBath bathroom furniture is made of moisture-resistant MDF with fully sealed edges, an anti-fungal and anti-bacterial coating and soft-close storage, to ISO 9001 and CE.",
      ar: "نعم. يُصنع أثاث حمامات QuarterBath من خشب MDF مقاوم للرطوبة بحواف محكمة الإغلاق، وطلاء مضاد للفطريات والبكتيريا، وخزائن بإغلاق هادئ، وفق ISO 9001 وCE.",
      ckb: "بەڵێ. مۆبیلیاتی حەمامی QuarterBath لە MDFی بەرگر بە شێ دروست دەکرێت، بە لێواری تەواو داخراو، ڕووپۆشی دژە کەڕوو و بەکتریا و کەنتۆری داخستنی نەرم، بەپێی ISO 9001 و CE.",
    },
  },
  {
    id: "sanitaryware-certifications",
    topic: "bathrooms",
    solutions: ["sanitaryware"],
    href: "/solutions/sanitaryware",
    source: "profile:p10",
    q: {
      en: "Which certifications does the sanitaryware carry?",
      ar: "ما الشهادات التي تحملها الأدوات الصحية؟",
      ckb: "کەلوپەلە تەندروستییەکان چ بڕوانامەیەکیان هەیە؟",
    },
    a: {
      en: "Oryx and QuarterBath sanitaryware are listed with SASO, ISO 9001, CE and WRAS. WISA pre-wall elements are listed with WELS 3-star, SASO, ISO 9001, CE and KIWA.",
      ar: "تحمل الأدوات الصحية من Oryx وQuarterBath شهادات SASO وISO 9001 وCE وWRAS. وتحمل هياكل WISA شهادات WELS بثلاث نجوم وSASO وISO 9001 وCE وKIWA.",
      ckb: "کەلوپەلی تەندروستیی Oryx و QuarterBath بڕوانامەی SASO، ISO 9001، CE و WRASیان هەیە. چوارچێوەکانی WISA بڕوانامەی WELSی سێ ئەستێرە، SASO، ISO 9001، CE و KIWAیان هەیە.",
    },
  },
  {
    id: "wisa",
    topic: "bathrooms",
    solutions: ["sanitaryware"],
    href: "/brands/wisa",
    source: "profile:p14",
    q: {
      en: "Who makes WISA cisterns?",
      ar: "من يصنع خزانات دفن WISA؟",
      ckb: "سیفۆنەکانی WISA لەلایەن کێوە دروست دەکرێن؟",
    },
    a: {
      en: "WISA is a Dutch brand owned by Fluidmaster. AtlasPlast supplies its pneumatic and mechanical concealed cisterns and pre-wall elements for wall-hung WCs in Iraq.",
      ar: "WISA علامة هولندية تابعة لشركة Fluidmaster. وتوفّر أطلس بلاست في العراق خزانات الدفن الهوائية والميكانيكية وهياكل التثبيت للمراحيض المعلّقة من WISA.",
      ckb: "WISA براندێکی هۆڵەندییە کە سەر بە Fluidmasterە. ئەتلەس پلاست سیفۆنی ناو دیواری هەوایی و میکانیکی و چوارچێوەی پێش دیواری WISA بۆ تەوالێتی هەڵواسراو لە عێراق دابین دەکات.",
    },
  },
  {
    id: "tiles-range",
    topic: "bathrooms",
    solutions: ["tiles"],
    href: "/solutions/tiles",
    source: "profile:p10",
    q: {
      en: "Which tiles does AtlasPlast supply?",
      ar: "ما أنواع البلاط التي توفّرها أطلس بلاست؟",
      ckb: "ئەتلەس پلاست چ کاشییەک دابین دەکات؟",
    },
    a: {
      en: "Porcelain and ceramic wall and floor tiles from Saudi Ceramics, for indoor, outdoor and wet areas and commercial spaces, in glossy, matt, polished, semi-polished, rustic and anti-slip finishes.",
      ar: "بلاط بورسلين وسيراميك للجدران والأرضيات من الخزف السعودي، للمساحات الداخلية والخارجية والمناطق الرطبة والمساحات التجارية، بتشطيبات لامعة ومطفأة ومصقولة ونصف مصقولة وريفية ومانعة للانزلاق.",
      ckb: "کاشیی پۆرسلین و سێرامیک بۆ دیوار و زەوی لە سعوودی سێرامیکس، بۆ ناوەوە، دەرەوە، شوێنە تەڕەکان و شوێنە بازرگانییەکان، بە ڕووکاری بریقەدار، مات، سووکراو، نیمچە سووکراو، ڕووستیک و دژە خلیسکان.",
    },
  },
  {
    id: "porcelain-vs-ceramic",
    topic: "bathrooms",
    solutions: ["tiles"],
    href: "/solutions/tiles",
    source: "profile:p10",
    q: {
      en: "What is the difference between porcelain and ceramic tiles?",
      ar: "ما الفرق بين بلاط البورسلين والسيراميك؟",
      ckb: "جیاوازیی نێوان کاشیی پۆرسلین و سێرامیک چییە؟",
    },
    a: {
      en: "Porcelain is denser: Saudi Ceramics porcelain absorbs 0.5% water or less, against 3% or less for its ceramic tiles, so porcelain suits heavy traffic, outdoor and wet areas. Porcelain comes in 30×30, 60×60, 30×60 and 120×60 cm at 10 mm thick; ceramic in 30×30, 60×60 and 30×60 cm at 8 to 12 mm.",
      ar: "البورسلين أكثر كثافة: يمتص بورسلين الخزف السعودي 0.5% من الماء أو أقل، مقابل 3% أو أقل لبلاط السيراميك، لذلك يناسب البورسلين الحركة الكثيفة والمساحات الخارجية والرطبة. يأتي البورسلين بمقاسات 30×30 و60×60 و30×60 و120×60 سم بسماكة 10 مم، والسيراميك بمقاسات 30×30 و60×60 و30×60 سم بسماكة من 8 إلى 12 مم.",
      ckb: "پۆرسلین چڕترە: پۆرسلینی سعوودی سێرامیکس 0.5% یان کەمتر ئاو هەڵدەمژێت، بەرامبەر 3% یان کەمتر بۆ کاشیی سێرامیکەکەی، بۆیە پۆرسلین بۆ هاتوچۆی زۆر، دەرەوە و شوێنی تەڕ گونجاوە. پۆرسلین بە پێوانەی 30×30، 60×60، 30×60 و 120×60 سم و ئەستووریی 10 ملم هەیە؛ سێرامیک بە 30×30، 60×60 و 30×60 سم و ئەستووریی 8 تا 12 ملم.",
    },
  },
  {
    id: "anti-slip-tiles",
    topic: "bathrooms",
    solutions: ["tiles"],
    href: "/solutions/tiles",
    source: "profile:p10",
    q: {
      en: "Are anti-slip tiles available?",
      ar: "هل يتوفر بلاط مانع للانزلاق؟",
      ckb: "ئایا کاشیی دژە خلیسکان بەردەستە؟",
    },
    a: {
      en: "Yes. Saudi Ceramics porcelain includes anti-slip models rated R9, R10 and R11; the higher the R value, the more slip-resistant the surface, for wet areas, ramps and outdoor floors.",
      ar: "نعم. يشمل بورسلين الخزف السعودي طرازات مانعة للانزلاق بتصنيف R9 وR10 وR11، وكلما ارتفعت قيمة R زادت مقاومة السطح للانزلاق، للمناطق الرطبة والمنحدرات والأرضيات الخارجية.",
      ckb: "بەڵێ. پۆرسلینی سعوودی سێرامیکس مۆدێلی دژە خلیسکانی بە پلەی R9، R10 و R11 تێدایە؛ تا بەهای R بەرزتر بێت ڕووەکە زیاتر بەرگری خلیسکان دەکات، بۆ شوێنی تەڕ، لێژایی و زەویی دەرەوە.",
    },
  },
  {
    id: "tile-certifications",
    topic: "bathrooms",
    solutions: ["tiles"],
    href: "/brands/saudi-ceramics",
    source: "profile:p10",
    q: {
      en: "Which certifications do Saudi Ceramics tiles have?",
      ar: "ما شهادات بلاط الخزف السعودي؟",
      ckb: "کاشییەکانی سعوودی سێرامیکس چ بڕوانامەیەکیان هەیە؟",
    },
    a: {
      en: "Saudi Ceramics porcelain and ceramic tiles are listed with ISO 9001:2015, SASO QM, CE, ESMA and G-Mark.",
      ar: "يحمل بلاط البورسلين والسيراميك من الخزف السعودي شهادات ISO 9001:2015 وSASO QM وCE وESMA وG-Mark.",
      ckb: "کاشیی پۆرسلین و سێرامیکی سعوودی سێرامیکس بڕوانامەی ISO 9001:2015، SASO QM، CE، ESMA و G-Markیان هەیە.",
    },
  },
  {
    id: "water-heaters",
    topic: "bathrooms",
    solutions: ["water-heaters"],
    href: "/solutions/water-heaters",
    source: "profile:p10",
    q: {
      en: "Which water heaters does AtlasPlast supply?",
      ar: "ما سخانات المياه التي توفّرها أطلس بلاست؟",
      ckb: "ئەتلەس پلاست چ ئاوگەرمکەرەوەیەک دابین دەکات؟",
    },
    a: {
      en: "Aquahot electric storage water heaters from Saudi Ceramics, in vertical and horizontal models with enamelled tanks, a two-valve system rated at 8.5 bar and Italian-made electrical components. They meet SASO and IEC 60335-2-21:2020.",
      ar: "سخانات مياه كهربائية بخزان من نوع Aquahot من الخزف السعودي، بطرازات عمودية وأفقية وخزانات مطلية بالمينا، ونظام بصمامين لضغط 8.5 بار، ومكونات كهربائية إيطالية الصنع. وتطابق SASO وIEC 60335-2-21:2020.",
      ckb: "ئاوگەرمکەرەوەی کارەبایی Aquahot لە سعوودی سێرامیکس، بە مۆدێلی ستوونی و ئاسۆیی، تانکی مینا لێدراو، سیستەمی دوو ڤاڵڤی 8.5 بار و پێکهاتەی کارەبایی دروستکراوی ئیتاڵیا. بەپێی SASO و IEC 60335-2-21:2020ن.",
    },
  },
  {
    id: "water-heater-sizes",
    topic: "bathrooms",
    solutions: ["water-heaters"],
    href: "/solutions/water-heaters",
    source: "profile:p10",
    q: {
      en: "What sizes do Aquahot water heaters come in?",
      ar: "ما سعات سخانات Aquahot؟",
      ckb: "ئاوگەرمکەرەوەکانی Aquahot بە چ قەبارەیەک هەن؟",
    },
    a: {
      en: "Aquahot heaters come in 10, 15, 30, 50, 80, 100, 120, 150, 200 and 300 litres. The sales team can advise on the right size for a home or a commercial building.",
      ar: "تتوفر سخانات Aquahot بسعات 10 و15 و30 و50 و80 و100 و120 و150 و200 و300 لتر. ويمكن لفريق المبيعات المساعدة في اختيار السعة المناسبة لمنزل أو مبنى تجاري.",
      ckb: "ئاوگەرمکەرەوەکانی Aquahot بە قەبارەی 10، 15، 30، 50، 80، 100، 120، 150، 200 و 300 لیتر هەن. تیمی فرۆشتن دەتوانێت یارمەتی هەڵبژاردنی قەبارەی گونجاو بۆ ماڵ یان بینایەکی بازرگانی بدات.",
    },
  },
  // ── Pumps, faucets and installation tools ─────────────────────────
  {
    id: "pumps-range",
    topic: "equipment",
    solutions: ["pumps"],
    href: "/solutions/pumps",
    source: "profile:p19",
    q: {
      en: "Which pumps does AtlasPlast supply?",
      ar: "ما المضخات التي توفّرها أطلس بلاست؟",
      ckb: "ئەتلەس پلاست چ پەمپێک دابین دەکات؟",
    },
    a: {
      en: "DAB pumps from Italy: circulators, in-line and centrifugal pumps, multistage and self-priming units, submersible, sewage and drainage pumps, lifting stations, pressure units and controls.",
      ar: "مضخات DAB الإيطالية: مضخات تدوير، ومضخات خطية وطاردة مركزية، ووحدات متعددة المراحل وذاتية التحضير، ومضخات غاطسة ومجاري وصرف، ومحطات رفع، ووحدات ضغط وأجهزة تحكم.",
      ckb: "پەمپەکانی DAB لە ئیتاڵیاوە: پەمپی سووڕاندنەوە، ناو هێڵ و ناوەندگەریز، یەکەی فرەقۆناغ و خۆڕاکێش، پەمپی نوقمبوو، ئاوی پیس و ئاوەڕۆ، وێستگەی بەرزکردنەوە، یەکەی پەستان و کۆنترۆڵ.",
    },
  },
  {
    id: "dab-specs",
    topic: "equipment",
    solutions: ["pumps"],
    href: "/brands/dab",
    source: "profile:p19",
    q: {
      en: "What are the performance limits of DAB pumps?",
      ar: "ما حدود أداء مضخات DAB؟",
      ckb: "سنووری کارکردنی پەمپەکانی DAB چییە؟",
    },
    a: {
      en: "Across the DAB range AtlasPlast supplies, pumps reach a maximum head of 400 m, handle liquids from 0 to 110 °C and work up to 10 bar. DAB is certified to ISO 9001:2015, ISO 14001 and ISO 45001.",
      ar: "في تشكيلة DAB التي توفّرها أطلس بلاست، يصل أقصى ارتفاع ضخ إلى 400 م، وتتعامل المضخات مع سوائل من 0 إلى 110 °م، وتعمل حتى ضغط 10 بار. وتحمل DAB شهادات ISO 9001:2015 وISO 14001 وISO 45001.",
      ckb: "لە کۆمەڵەی DAB کە ئەتلەس پلاست دابینی دەکات، زۆرترین بەرزیی پەمپکردن دەگاتە 400 م، شلەی 0 تا 110 پلە هەڵدەگرن و تا 10 بار کار دەکەن. DAB بڕوانامەی ISO 9001:2015، ISO 14001 و ISO 45001ی هەیە.",
    },
  },
  {
    id: "booster-pump",
    topic: "equipment",
    solutions: ["pumps"],
    href: "/solutions/pumps",
    source: "manufacturer:2026-10-04",
    q: {
      en: "Which pump raises low water pressure in a building?",
      ar: "ما المضخة التي ترفع ضغط المياه المنخفض في المبنى؟",
      ckb: "کام پەمپ پەستانی نزمی ئاو لە بینادا بەرز دەکاتەوە؟",
    },
    a: {
      en: "A booster set or pressure unit, such as DAB’s e.sybox, an electronic pressure boosting system with an inverter. The right model depends on the number of floors, outlets and the flow needed; AtlasPlast’s technical team can size it with you on {mainPhone}.",
      ar: "مجموعة رفع ضغط أو وحدة ضغط، مثل e.sybox من DAB، وهو نظام إلكتروني لرفع الضغط مزوّد بمحوّل تردد. ويعتمد الطراز المناسب على عدد الطوابق ونقاط الاستهلاك والتدفق المطلوب، ويمكن لفريق أطلس بلاست الفني تحديده معك على {mainPhone}.",
      ckb: "کۆمەڵەی بەرزکردنەوەی پەستان یان یەکەی پەستان، وەک e.syboxی DAB، کە سیستەمێکی ئەلیکترۆنیی بەرزکردنەوەی پەستانە بە ئینڤێرتەر. مۆدێلی گونجاو پەیوەستە بە ژمارەی نهۆمەکان، خاڵەکانی بەکارهێنان و بڕی ئاوی پێویست؛ تیمی تەکنیکیی ئەتلەس پلاست دەتوانێت لەگەڵت دیاری بکات لەسەر {mainPhone}.",
    },
  },
  {
    id: "faucets-range",
    topic: "equipment",
    solutions: ["faucets-valves"],
    href: "/solutions/faucets-valves",
    source: "profile:p18",
    q: {
      en: "Which faucets and mixers does AtlasPlast supply?",
      ar: "ما الخلاطات والحنفيات التي توفّرها أطلس بلاست؟",
      ckb: "ئەتلەس پلاست چ حەنەفیە و تێکەڵکەرێک دابین دەکات؟",
    },
    a: {
      en: "KAS basin, kitchen, wall-mounted, shower, bidet and industrial kitchen mixers, including a sensor series, with spare parts; Guarri brass bathroom and kitchen faucets; Topsan mixers, classic and industrial faucets, built-in valves and shower sets; and Shield faucet sets.",
      ar: "خلاطات KAS للمغاسل والمطابخ والجدار والدوش والشطافات والمطابخ الصناعية، ومنها سلسلة بحساس، مع توفّر قطع الغيار؛ وحنفيات Guarri النحاسية للحمامات والمطابخ؛ وخلاطات Topsan وحنفياتها الكلاسيكية والصناعية وخلاطات الدفن وأطقم الدوش؛ وأطقم حنفيات Shield.",
      ckb: "تێکەڵکەری KAS بۆ دەستشۆر، چێشتخانە، دیوار، دووش، بیدێ و چێشتخانەی پیشەسازی، لەوانە زنجیرەی هەستەوەر، لەگەڵ پارچەی یەدەگ؛ حەنەفیەی مسی زەردی Guarri بۆ حەمام و چێشتخانە؛ تێکەڵکەر، حەنەفیەی کلاسیک و پیشەسازی، ڤاڵڤی ناودیوار و کۆمەڵەی دووشی Topsan؛ و کۆمەڵەی حەنەفیەی Shield.",
    },
  },
  {
    id: "valves",
    topic: "equipment",
    solutions: ["faucets-valves"],
    href: "/brands/shield",
    source: "profile:p18",
    q: {
      en: "Does AtlasPlast supply angle valves and ball valves?",
      ar: "هل توفّر أطلس بلاست محابس زاوية ومحابس كروية؟",
      ckb: "ئایا ئەتلەس پلاست ڤاڵڤی گۆشەیی و تۆپی دابین دەکات؟",
    },
    a: {
      en: "Yes. Shield supplies brass angle valves, ball valves, faucet sets and accessories for laundries, bathrooms and kitchens. Topsan supplies valves and built-in valves.",
      ar: "نعم. توفّر Shield محابس زاوية ومحابس كروية وأطقم حنفيات وملحقات من النحاس لغرف الغسيل والحمامات والمطابخ. وتوفّر Topsan محابس وخلاطات دفن.",
      ckb: "بەڵێ. Shield ڤاڵڤی گۆشەیی و تۆپی، کۆمەڵەی حەنەفیە و پێداویستی لە مسی زەرد بۆ جلشۆرخانە، حەمام و چێشتخانە دابین دەکات. Topsan ڤاڵڤ و ڤاڵڤی ناودیوار دابین دەکات.",
    },
  },
  {
    id: "faucet-certifications",
    topic: "equipment",
    solutions: ["faucets-valves"],
    href: "/solutions/faucets-valves",
    source: "profile:p18",
    q: {
      en: "Are the faucets certified for drinking water?",
      ar: "هل الخلاطات معتمدة لمياه الشرب؟",
      ckb: "ئایا حەنەفیەکان بۆ ئاوی خواردنەوە بڕوانامەیان هەیە؟",
    },
    a: {
      en: "KAS faucets are listed with NSF/ANSI 61 and NSF/ANSI 372, the US standards for drinking-water components and low lead, and ISO 9001:2015. Guarri faucets are listed with DVGW, NSF, CE and ISO 9001:2015.",
      ar: "تحمل خلاطات KAS شهادتي NSF/ANSI 61 وNSF/ANSI 372، وهما المعياران الأمريكيان لمكونات مياه الشرب وانخفاض الرصاص، إضافة إلى ISO 9001:2015. وتحمل حنفيات Guarri شهادات DVGW وNSF وCE وISO 9001:2015.",
      ckb: "حەنەفیەکانی KAS بڕوانامەی NSF/ANSI 61 و NSF/ANSI 372یان هەیە، کە ستانداردی ئەمریکین بۆ پێکهاتەکانی ئاوی خواردنەوە و قوڕقوشمی کەم، لەگەڵ ISO 9001:2015. حەنەفیەکانی Guarri بڕوانامەی DVGW، NSF، CE و ISO 9001:2015یان هەیە.",
    },
  },
  {
    id: "welding-machines",
    topic: "equipment",
    solutions: ["installation-tools"],
    href: "/solutions/installation-tools",
    source: "profile:p12",
    q: {
      en: "Does AtlasPlast supply pipe welding machines?",
      ar: "هل توفّر أطلس بلاست مكائن لحام الأنابيب؟",
      ckb: "ئایا ئەتلەس پلاست مەکینەی لکاندنی بۆری دابین دەکات؟",
    },
    a: {
      en: "Yes. Turan Borfit manual and automatic butt welding machines join PE and PP pipes from Ø 20 to 1200 mm. Candan welding machines cover Ø 20 to 110 mm, with adjustable temperature up to 300 °C, 700 to 2,400 W at 220–240 V, and spare parts.",
      ar: "نعم. تلحم مكائن اللحام التناكبي اليدوية والأوتوماتيكية من Turan Borfit أنابيب PE وPP من قطر 20 إلى 1200 مم. وتغطي مكائن Candan الأقطار من 20 إلى 110 مم، بحرارة قابلة للتعديل حتى 300 °م، وقدرة من 700 إلى 2,400 واط على 220–240 فولت، مع قطع الغيار.",
      ckb: "بەڵێ. مەکینەی لکاندنی ڕووبەڕووی دەستی و ئۆتۆماتیکیی Turan Borfit بۆریی PE و PP لە تیرەی 20 تا 1200 ملم دەلکێنن. مەکینەکانی Candan تیرەی 20 تا 110 ملم دەگرنەوە، بە پلەی گەرمیی گۆڕاو تا 300 پلە، توانای 700 تا 2,400 وات لەسەر 220–240 ڤۆڵت، لەگەڵ پارچەی یەدەگ.",
    },
  },
  {
    id: "how-ppr-is-joined",
    topic: "equipment",
    solutions: ["installation-tools", "water-supply"],
    href: "/solutions/installation-tools",
    source: "profile:p19",
    q: {
      en: "How are PP-R pipes joined?",
      ar: "كيف تُوصل أنابيب PP-R؟",
      ckb: "بۆریی PP-R چۆن پێکەوە دەلکێنرێن؟",
    },
    a: {
      en: "PP-R pipes and fittings are joined by heat fusion: a welding machine heats the pipe end and the fitting socket, which are then pushed together and fuse into one piece. AtlasPlast supplies Candan welding machines for Ø 20 to 110 mm and runs training courses on correct installation.",
      ar: "تُوصل أنابيب وملحقات PP-R باللحام الحراري: تسخّن ماكينة اللحام طرف الأنبوب وتجويف الملحق، ثم يُدفعان معاً فيلتحمان قطعة واحدة. وتوفّر أطلس بلاست مكائن لحام Candan للأقطار من 20 إلى 110 مم، وتقيم دورات تدريبية على التركيب الصحيح.",
      ckb: "بۆری و پێکهاتەکانی PP-R بە لکاندنی گەرمی پێکەوە دەلکێنرێن: مەکینەی لکاندن سەری بۆرییەکە و ناوی پێکهاتەکە گەرم دەکات، پاشان پێکەوە دەنرێن و دەبنە یەک پارچە. ئەتلەس پلاست مەکینەی لکاندنی Candan بۆ تیرەی 20 تا 110 ملم دابین دەکات و خولی ڕاهێنان لەسەر دامەزراندنی دروست دەکاتەوە.",
    },
  },
  {
    id: "pipe-clamps",
    topic: "equipment",
    solutions: ["installation-tools"],
    href: "/brands/ascelik",
    source: "profile:p19",
    q: {
      en: "Does AtlasPlast supply pipe clamps and support profiles?",
      ar: "هل توفّر أطلس بلاست مرابط الأنابيب ومقاطع التثبيت؟",
      ckb: "ئایا ئەتلەس پلاست گیرەی بۆری و پرۆفایلی ڕاگرتن دابین دەکات؟",
    },
    a: {
      en: "Yes. Asçelik Clamp makes pipe clamps, profiles and consoles in malleable iron, ductile iron and steel for plumbing, HVAC and industrial piping, listed with ISO 9001:2015, CE, UL and FM.",
      ar: "نعم. تصنع Asçelik Clamp مرابط أنابيب ومقاطع وحوامل من الحديد المطاوع والحديد المرن والفولاذ لأعمال السباكة والتكييف والأنابيب الصناعية، وتحمل شهادات ISO 9001:2015 وCE وUL وFM.",
      ckb: "بەڵێ. Asçelik Clamp گیرەی بۆری، پرۆفایل و کۆنسۆڵ لە ئاسنی نەرم، ئاسنی چەماوە و پۆڵا بۆ بۆریکاری، فێنککەرەوە و بۆریی پیشەسازی دروست دەکات، بە بڕوانامەی ISO 9001:2015، CE، UL و FM.",
    },
  },
  {
    id: "chemical-anchors",
    topic: "equipment",
    solutions: ["installation-tools"],
    href: "/brands/guarri",
    source: "profile:p18",
    q: {
      en: "Does AtlasPlast supply chemical anchors and pipe sealants?",
      ar: "هل توفّر أطلس بلاست مثبتات كيميائية ومواد منع تسرب الأنابيب؟",
      ckb: "ئایا ئەتلەس پلاست ئەنکەری کیمیایی و مادەی ڕێگرتن لە دزەی بۆری دابین دەکات؟",
    },
    a: {
      en: "Yes. Guarri supplies polyester and vinyl ester chemical anchors, pipe sealants and super glue, made to ISO 9001:2015.",
      ar: "نعم. توفّر Guarri مثبتات كيميائية من البوليستر والفينيل إستر، ومواد منع تسرب الأنابيب، وغراء فورياً، وفق ISO 9001:2015.",
      ckb: "بەڵێ. Guarri ئەنکەری کیمیایی پۆلیەستەر و ڤینایل ئێستەر، مادەی ڕێگرتن لە دزەی بۆری و چەسپی خێرا دابین دەکات، بەپێی ISO 9001:2015.",
    },
  },
  // ── Brands and agencies ───────────────────────────────────────────
  {
    id: "brands-list",
    topic: "brands",
    href: "/brands",
    source: "profile:p4",
    q: {
      en: "Which agencies does AtlasPlast hold?",
      ar: "ما هي وكالات شركة أطلس بلاست؟",
      ckb: "بریکارایەتییەکانی کۆمپانیای ئەتلەس پلاست کامانەن؟",
    },
    a: {
      en: "Georg Fischer, Polymelt, Bänninger, Ostendorf, Poloplast, FV-Plast, Peštan, WISA, DAB Pumps, Saudi Ceramics, Aquapa, Pimtaş, Turan Borfit, KAS, Guarri, Topsan, Asçelik Clamp, Boroug, Shield, QuarterBath, Candan Makina and Alvit.",
      ar: "Georg Fischer وPolymelt وBänninger وOstendorf وPoloplast وFV-Plast وPeštan وWISA وDAB Pumps والخزف السعودي (Saudi Ceramics) وAquapa وPimtaş وTuran Borfit وKAS وGuarri وTopsan وAsçelik Clamp وBoroug وShield وQuarterBath وCandan Makina وAlvit.",
      ckb: "Georg Fischer، Polymelt، Bänninger، Ostendorf، Poloplast، FV-Plast، Peštan، WISA، DAB Pumps، سعوودی سێرامیکس (Saudi Ceramics)، Aquapa، Pimtaş، Turan Borfit، KAS، Guarri، Topsan، Asçelik Clamp، Boroug، Shield، QuarterBath، Candan Makina و Alvit.",
    },
  },
  {
    id: "georg-fischer",
    topic: "brands",
    href: "/brands/georg-fischer",
    source: "profile:p7",
    q: {
      en: "Can I buy Georg Fischer products in Iraq?",
      ar: "هل يمكنني شراء منتجات Georg Fischer في العراق؟",
      ckb: "ئایا دەتوانم بەرهەمەکانی Georg Fischer لە عێراق بکڕم؟",
    },
    a: {
      en: "Yes. AtlasPlast represents Georg Fischer of Switzerland and supplies its Aquasystem PP-R pipes, Silenta Premium and Silenta 3A low-noise drainage, PE100 pressure pipes and galvanized malleable-iron fittings across Iraq.",
      ar: "نعم. تمثّل أطلس بلاست شركة Georg Fischer السويسرية، وتوفّر في جميع أنحاء العراق أنابيب Aquasystem من PP-R، وأنظمة الصرف منخفضة الضوضاء Silenta Premium وSilenta 3A، وأنابيب ضغط PE100، والملحقات المغلفنة من الحديد المطاوع.",
      ckb: "بەڵێ. ئەتلەس پلاست نوێنەرایەتیی Georg Fischerی سویسری دەکات و بۆریی PP-Rی Aquasystem، ئاوەڕۆی کەمدەنگی Silenta Premium و Silenta 3A، بۆریی پەستانی PE100 و پێکهاتەی گەلڤانیزەکراوی ئاسنی نەرم لە سەرانسەری عێراق دابین دەکات.",
    },
  },
  {
    id: "polymelt",
    topic: "brands",
    href: "/brands/polymelt",
    source: "confirmed:2026-10-04",
    q: {
      en: "Which Polymelt pipe systems are available in Iraq?",
      ar: "ما أنظمة أنابيب Polymelt المتوفرة في العراق؟",
      ckb: "چ سیستەمێکی بۆریی Polymelt لە عێراق بەردەستە؟",
    },
    a: {
      en: "AtlasPlast supplies the German manufacturer Polymelt’s POLO-POLYMUTAN, POLO-ECOSAN, POLO-UV and POLO-POLYMUTAN ML5 lines, plus Polymutan PP-R / PP-RCT and Polymelt UV pipes, for hot, cold and drinking water.",
      ar: "توفّر أطلس بلاست خطوط POLO-POLYMUTAN وPOLO-ECOSAN وPOLO-UV وPOLO-POLYMUTAN ML5 من الشركة الألمانية Polymelt، إضافة إلى أنابيب Polymutan PP-R / PP-RCT وPolymelt UV، للمياه الساخنة والباردة ومياه الشرب.",
      ckb: "ئەتلەس پلاست هێڵەکانی POLO-POLYMUTAN، POLO-ECOSAN، POLO-UV و POLO-POLYMUTAN ML5ی کۆمپانیای ئەڵمانیی Polymelt دابین دەکات، لەگەڵ بۆریی Polymutan PP-R / PP-RCT و Polymelt UV، بۆ ئاوی گەرم، سارد و ئاوی خواردنەوە.",
    },
  },
  {
    id: "poloplast",
    topic: "brands",
    href: "/brands/poloplast",
    source: "confirmed:2026-10-04",
    q: {
      en: "Which Poloplast products does AtlasPlast supply?",
      ar: "ما منتجات Poloplast التي توفّرها أطلس بلاست؟",
      ckb: "ئەتلەس پلاست چ بەرهەمێکی Poloplast دابین دەکات؟",
    },
    a: {
      en: "AtlasPlast supplies two Poloplast (Austria) sound-insulated drainage systems: POLO-KAL NG, with EPDM seals and chemical resistance from pH 2 to 13, and POLO-KAL 3S, with sockets and built-in EPDM seals.",
      ar: "توفّر أطلس بلاست نظامين للصرف العازل للصوت من Poloplast النمساوية: POLO-KAL NG بحلقات EPDM ومقاومة كيميائية من pH 2 إلى 13، وPOLO-KAL 3S برؤوس توصيل وحلقات EPDM مدمجة.",
      ckb: "ئەتلەس پلاست دوو سیستەمی ئاوەڕۆی دەنگبڕی Poloplast (نەمسا) دابین دەکات: POLO-KAL NG بە ئەڵقەی EPDM و بەرگریی کیمیایی لە pH 2 تا 13، و POLO-KAL 3S بە سۆکێت و ئەڵقەی EPDMی ناوەکی.",
    },
  },
  {
    id: "ostendorf",
    topic: "brands",
    href: "/brands/ostendorf",
    source: "profile:p16",
    q: {
      en: "Which Ostendorf systems does AtlasPlast supply?",
      ar: "ما أنظمة Ostendorf التي توفّرها أطلس بلاست؟",
      ckb: "ئەتلەس پلاست چ سیستەمێکی Ostendorf دابین دەکات؟",
    },
    a: {
      en: "Three systems from Ostendorf of Germany: Skolan Safe, mineral-filled PP drainage with high sound insulation; HT Safe, mineral-filled PP drainage pipes for buildings; and the KG-System, PVC-U pipe for buried sewers in SN 4, 8 and 10.",
      ar: "ثلاثة أنظمة من Ostendorf الألمانية: Skolan Safe، صرف PP مدعّم بالمعادن بعزل صوتي عالٍ؛ وHT Safe، أنابيب صرف PP مدعّمة بالمعادن للمباني؛ ونظام KG، أنابيب PVC-U للمجاري المدفونة بفئات SN 4 و8 و10.",
      ckb: "سێ سیستەم لە Ostendorfی ئەڵمانی: Skolan Safe، ئاوەڕۆی PPی پڕکراو بە کانزا بە دەنگبڕینی بەرز؛ HT Safe، بۆریی ئاوەڕۆی PPی پڕکراو بە کانزا بۆ بیناکان؛ و سیستەمی KG، بۆریی PVC-U بۆ ئاوەڕۆی ژێرزەوی بە SN 4، 8 و 10.",
    },
  },
  {
    id: "saudi-ceramics",
    topic: "brands",
    href: "/brands/saudi-ceramics",
    source: "profile:p10",
    q: {
      en: "Which Saudi Ceramics products does AtlasPlast supply?",
      ar: "ما منتجات الخزف السعودي التي توفّرها أطلس بلاست؟",
      ckb: "ئەتلەس پلاست چ بەرهەمێکی سعوودی سێرامیکس دابین دەکات؟",
    },
    a: {
      en: "Oryx sanitaryware, porcelain and ceramic tiles, and Aquahot electric water heaters, all from Saudi Ceramics of Saudi Arabia.",
      ar: "أدوات Oryx الصحية، وبلاط البورسلين والسيراميك، وسخانات المياه الكهربائية Aquahot، وكلها من شركة الخزف السعودي في المملكة العربية السعودية.",
      ckb: "کەلوپەلی تەندروستیی Oryx، کاشیی پۆرسلین و سێرامیک، و ئاوگەرمکەرەوەی کارەبایی Aquahot، هەمووی لە سعوودی سێرامیکسی سعوودیەوە.",
    },
  },
  {
    id: "turkish-brands",
    topic: "brands",
    href: "/brands",
    source: "profile:p9",
    q: {
      en: "Which Turkish brands does AtlasPlast represent?",
      ar: "ما العلامات التركية التي تمثّلها أطلس بلاست؟",
      ckb: "ئەتلەس پلاست نوێنەرایەتیی چ براندێکی تورکی دەکات؟",
    },
    a: {
      en: "Aquapa (PP-R pipes and Aqua Silent PP drainage), Pimtaş (PE100, U-PVC and compression fittings), Turan Borfit (PE pipes, fittings and butt welding machines), KAS (PPR pipes and faucets), Guarri (faucets, chemical anchors and sealants), Topsan (faucets, built-in valves, shower sets and valves) and Asçelik Clamp (pipe clamps and profiles).",
      ar: "Aquapa (أنابيب PP-R وصرف Aqua Silent PP)، وPimtaş (PE100 وU-PVC وملحقات الضغط)، وTuran Borfit (أنابيب وملحقات PE ومكائن اللحام التناكبي)، وKAS (أنابيب PPR وخلاطات)، وGuarri (حنفيات ومثبتات كيميائية ومواد منع التسرب)، وTopsan (خلاطات وخلاطات دفن وأطقم دوش ومحابس)، وAsçelik Clamp (مرابط الأنابيب والمقاطع).",
      ckb: "Aquapa (بۆریی PP-R و ئاوەڕۆی Aqua Silent PP)، Pimtaş (PE100، U-PVC و پێکهاتەی کۆمپرێشن)، Turan Borfit (بۆری و پێکهاتەی PE و مەکینەی لکاندنی ڕووبەڕوو)، KAS (بۆریی PPR و حەنەفیە)، Guarri (حەنەفیە، ئەنکەری کیمیایی و مادەی ڕێگرتن لە دزە)، Topsan (حەنەفیە، ڤاڵڤی ناودیوار، کۆمەڵەی دووش و ڤاڵڤ) و Asçelik Clamp (گیرەی بۆری و پرۆفایل).",
    },
  },
  {
    id: "european-brands",
    topic: "brands",
    href: "/brands",
    source: "profile:p4",
    q: {
      en: "Which European manufacturers does AtlasPlast represent?",
      ar: "ما الشركات الأوروبية المصنّعة التي تمثّلها أطلس بلاست؟",
      ckb: "ئەتلەس پلاست نوێنەرایەتیی چ بەرهەمهێنەرێکی ئەورووپی دەکات؟",
    },
    a: {
      en: "Georg Fischer (Switzerland); Polymelt, Bänninger and Ostendorf (Germany); Poloplast (Austria); WISA (the Netherlands); DAB Pumps (Italy); FV-Plast (the Czech Republic); and Peštan (Serbia).",
      ar: "Georg Fischer (سويسرا)، وPolymelt وBänninger وOstendorf (ألمانيا)، وPoloplast (النمسا)، وWISA (هولندا)، وDAB Pumps (إيطاليا)، وFV-Plast (التشيك)، وPeštan (صربيا).",
      ckb: "Georg Fischer (سویسرا)؛ Polymelt، Bänninger و Ostendorf (ئەڵمانیا)؛ Poloplast (نەمسا)؛ WISA (هۆڵەندا)؛ DAB Pumps (ئیتاڵیا)؛ FV-Plast (کۆماری چیک)؛ و Peštan (سڕبیا).",
    },
  },
  {
    id: "range-on-request",
    topic: "brands",
    href: "/brands",
    source: "confirmed:2026-10-04",
    q: {
      en: "How do I find out what AtlasPlast stocks from FV-Plast or Peštan?",
      ar: "كيف أعرف ما تتوفر عليه أطلس بلاست من FV-Plast أو Peštan؟",
      ckb: "چۆن بزانم ئەتلەس پلاست چی لە FV-Plast یان Peštan هەیە؟",
    },
    a: {
      en: "The range from these brands is available on request. FV-Plast is AtlasPlast’s Czech agency and is ordered directly from the manufacturer through AtlasPlast; Peštan is its Serbian agency. Call the sales team on {mainPhone} or write to {email} for current stock and specifications.",
      ar: "تشكيلة هذه العلامات متوفرة عند الطلب. FV-Plast هي الوكالة التشيكية لأطلس بلاست وتُطلب منتجاتها مباشرة من المصنّع عبر أطلس بلاست، وPeštan وكالتها الصربية. اتصل بفريق المبيعات على {mainPhone} أو راسلنا على {email} لمعرفة المخزون والمواصفات الحالية.",
      ckb: "بەرهەمەکانی ئەم براندانە بە داواکاری بەردەستن. FV-Plast بریکارایەتیی چیکیی ئەتلەس پلاستە و بەرهەمەکانی ڕاستەوخۆ لە بەرهەمهێنەرەوە لە ڕێگەی ئەتلەس پلاستەوە داوا دەکرێن، و Peštan بریکارایەتیی سڕبییەکەیەتی. بۆ زانینی کۆگا و تایبەتمەندییەکانی ئێستا پەیوەندی بە تیمی فرۆشتنەوە بکە لەسەر {mainPhone} یان بنووسە بۆ {email}.",
    },
  },
  {
    id: "egyptian-brands",
    topic: "brands",
    href: "/brands",
    source: "profile:p17",
    q: {
      en: "Which Egyptian brands does AtlasPlast supply?",
      ar: "ما العلامات المصرية التي توفّرها أطلس بلاست؟",
      ckb: "ئەتلەس پلاست چ براندێکی میسری دابین دەکات؟",
    },
    a: {
      en: "Boroug, for Boroug UPVC drainage pipes and POLO EGY PP-R water supply pipes, and Shield, for brass valves, faucet sets and accessories.",
      ar: "Boroug لأنابيب الصرف Boroug UPVC وأنابيب إمدادات المياه POLO EGY PP-R، وShield للمحابس النحاسية وأطقم الحنفيات والملحقات.",
      ckb: "Boroug بۆ بۆریی ئاوەڕۆی Boroug UPVC و بۆریی دابینکردنی ئاوی POLO EGY PP-R، و Shield بۆ ڤاڵڤی مسی زەرد، کۆمەڵەی حەنەفیە و پێداویستییەکان.",
    },
  },
  // ── Projects and services ─────────────────────────────────────────
  {
    id: "projects",
    topic: "services",
    href: "/projects",
    source: "profile:p25",
    q: {
      en: "Which projects have used AtlasPlast products?",
      ar: "ما المشاريع التي استُخدمت فيها منتجات أطلس بلاست؟",
      ckb: "چ پڕۆژەیەک بەرهەمەکانی ئەتلەس پلاستی بەکارهێناوە؟",
    },
    a: {
      en: "Hundreds of projects across Iraq, including Erbil and Baghdad International Airports, Basra International Stadium, Al-Anbar International Stadium, the Mövenpick and Babylon Rotana hotels, Grand Millennium Sulaymaniyah, Ibn Sina and Al-Sidra hospitals, the Embassies Complex, MRF Quartet Towers in Erbil, Modern Basra Complex, Life Towers and the Chinese 1,000 Schools Project.",
      ar: "مئات المشاريع في جميع أنحاء العراق، منها مطارا أربيل وبغداد الدوليان، وملعب البصرة الدولي، وملعب الأنبار الدولي، وفندقا موفنبيك وبابل روتانا، وغراند ميلينيوم السليمانية، ومستشفيا ابن سينا والسدرة، ومجمع السفارات، وأبراج MRF الأربعة في أربيل، ومجمع البصرة الحديثة، وأبراج لايف، ومشروع الألف مدرسة الصيني.",
      ckb: "سەدان پڕۆژە لە سەرانسەری عێراق، لەوانە فڕۆکەخانە نێودەوڵەتییەکانی هەولێر و بەغدا، یاریگای نێودەوڵەتیی بەسرە، یاریگای نێودەوڵەتیی ئەنبار، هوتێلەکانی مۆڤنپیک و بابل ڕۆتانا، گراند میلێنیۆمی سلێمانی، نەخۆشخانەکانی ئیبن سینا و سیدرە، کۆمەڵگەی باڵیۆزخانەکان، چوار تاوەرەکەی MRF لە هەولێر، کۆمەڵگەی بەسرەی نوێ، تاوەرەکانی لایف و پڕۆژەی هەزار قوتابخانەی چینی.",
    },
  },
  {
    id: "contractors",
    topic: "services",
    href: "/projects",
    source: "confirmed:2026-10-04",
    q: {
      en: "Which contractors work with AtlasPlast?",
      ar: "ما المقاولون الذين يعملون مع أطلس بلاست؟",
      ckb: "چ بەڵێندەرێک لەگەڵ ئەتلەس پلاست کار دەکات؟",
    },
    a: {
      en: "AtlasPlast supplies dozens of contractors, among them Power China International Group Limited, Al-Tayyar Group, UB Group, Halat Group, UCC, GCITJ Babel Limited, Nuhoğlu Construction, Elegancia MEP and Al-Muraba Engineering Company. The Projects page lists them all.",
      ar: "تجهّز أطلس بلاست عشرات المقاولين، منهم Power China International Group Limited وAl-Tayyar Group وUB Group وHalat Group وUCC وGCITJ Babel Limited وNuhoğlu Construction وElegancia MEP وAl-Muraba Engineering Company. وتعرضهم صفحة المشاريع جميعاً.",
      ckb: "ئەتلەس پلاست دەیان بەڵێندەر دابین دەکات، لەوانە Power China International Group Limited، Al-Tayyar Group، UB Group، Halat Group، UCC، GCITJ Babel Limited، Nuhoğlu Construction، Elegancia MEP و Al-Muraba Engineering Company. پەڕەی پڕۆژەکان هەموویان پیشان دەدات.",
    },
  },
  {
    id: "project-supply",
    topic: "services",
    href: "/contact",
    source: "profile:p20",
    q: {
      en: "Does AtlasPlast supply large and government projects?",
      ar: "هل تجهّز أطلس بلاست المشاريع الكبيرة والحكومية؟",
      ckb: "ئایا ئەتلەس پلاست پڕۆژە گەورە و حکومییەکان دابین دەکات؟",
    },
    a: {
      en: "Yes. AtlasPlast provides scheduled supply for residential, commercial and government projects, backed by stock in five warehouses. The projects division is on {projectsPhone}.",
      ar: "نعم. تقدّم أطلس بلاست تجهيزاً مجدولاً للمشاريع السكنية والتجارية والحكومية، مدعوماً بمخزون في خمسة مستودعات. ويمكن التواصل مع قسم المشاريع على {projectsPhone}.",
      ckb: "بەڵێ. ئەتلەس پلاست دابینکردنی خشتەبەندکراو بۆ پڕۆژە نیشتەجێبوون، بازرگانی و حکومییەکان پێشکەش دەکات، بە پشتبەستن بە کەرەستەی ئامادە لە پێنج کۆگادا. بەشی پڕۆژەکان لەسەر {projectsPhone}ە.",
    },
  },
  {
    id: "training",
    topic: "services",
    href: "/about",
    source: "profile:p20",
    q: {
      en: "Does AtlasPlast train plumbers and engineers?",
      ar: "هل تدرّب أطلس بلاست السبّاكين والمهندسين؟",
      ckb: "ئایا ئەتلەس پلاست ڕاهێنان بە وەستاکارانی بۆری و ئەندازیاران دەکات؟",
    },
    a: {
      en: "Yes. AtlasPlast runs courses that raise installation standards for engineers, plumbers and craftsmen, and has trained more than 6,000 engineers and plumbers. It also offers free plumbing classes for young people.",
      ar: "نعم. تقيم أطلس بلاست دورات ترفع معايير التركيب لدى المهندسين والسبّاكين والحرفيين، ودرّبت أكثر من 6,000 مهندس وسبّاك. كما تقدّم دورات مجانية في السباكة للشباب.",
      ckb: "بەڵێ. ئەتلەس پلاست خول بۆ بەرزکردنەوەی ئاستی دامەزراندن لای ئەندازیاران، وەستاکارانی بۆری و پیشەوەران دەکاتەوە، و زیاتر لە 6,000 ئەندازیار و وەستای بۆری ڕاهێنانیان پێکراوە. هەروەها خولی بێبەرامبەری بۆریکاری بۆ گەنجان پێشکەش دەکات.",
    },
  },
  {
    id: "after-sales",
    topic: "services",
    href: "/contact",
    source: "profile:p20",
    q: {
      en: "Does AtlasPlast provide after-sales service and warranty support?",
      ar: "هل تقدّم أطلس بلاست خدمة ما بعد البيع ومتابعة الضمان؟",
      ckb: "ئایا ئەتلەس پلاست خزمەتگوزاریی دوای فرۆشتن و بەدواداچوونی گەرەنتی پێشکەش دەکات؟",
    },
    a: {
      en: "Yes. AtlasPlast’s after-sales service covers warranty handling, maintenance guidance and ongoing customer support. Warranty terms depend on the product and manufacturer, so ask the sales team on {mainPhone} about a specific product.",
      ar: "نعم. تشمل خدمة ما بعد البيع في أطلس بلاست متابعة الضمان وإرشادات الصيانة والدعم المستمر للعملاء. وتختلف شروط الضمان باختلاف المنتج والشركة المصنّعة، لذا اسأل فريق المبيعات على {mainPhone} عن منتج بعينه.",
      ckb: "بەڵێ. خزمەتگوزاریی دوای فرۆشتنی ئەتلەس پلاست بەدواداچوونی گەرەنتی، ڕێنمایی چاککردنەوە و پاڵپشتیی بەردەوامی کڕیاران دەگرێتەوە. مەرجەکانی گەرەنتی بەپێی بەرهەم و بەرهەمهێنەر جیاوازن، بۆیە دەربارەی بەرهەمێکی دیاریکراو لە تیمی فرۆشتن بپرسە لەسەر {mainPhone}.",
    },
  },
  {
    id: "private-label",
    topic: "services",
    href: "/about",
    source: "profile:p20",
    q: {
      en: "Does AtlasPlast make private-label products?",
      ar: "هل تصنع أطلس بلاست منتجات بعلامات خاصة؟",
      ckb: "ئایا ئەتلەس پلاست بەرهەمی براندی تایبەت دروست دەکات؟",
    },
    a: {
      en: "Yes. AtlasPlast offers customised private-label products for partners building their own brands. Contact the sales team to discuss a range.",
      ar: "نعم. تقدّم أطلس بلاست منتجات مخصّصة بعلامات خاصة للشركاء الذين يبنون علاماتهم التجارية. تواصل مع فريق المبيعات لمناقشة التشكيلة.",
      ckb: "بەڵێ. ئەتلەس پلاست بەرهەمی تایبەتکراو بە براندی تایبەت بۆ ئەو هاوبەشانەی براندی خۆیان بنیات دەنێن پێشکەش دەکات. بۆ گفتوگۆ لەسەر بەرهەمەکان پەیوەندی بە تیمی فرۆشتنەوە بکە.",
    },
  },
  {
    id: "on-site-support",
    topic: "services",
    href: "/contact",
    source: "profile:p20",
    q: {
      en: "Does AtlasPlast give technical support on site?",
      ar: "هل تقدّم أطلس بلاست دعماً فنياً في موقع العمل؟",
      ckb: "ئایا ئەتلەس پلاست پاڵپشتیی تەکنیکی لە شوێنی کار دەدات؟",
    },
    a: {
      en: "Yes. AtlasPlast’s engineering team gives pre-sale consultation and on-site assistance, from the first consultation to after-sales support, and stays with the project throughout.",
      ar: "نعم. يقدّم الفريق الهندسي في أطلس بلاست استشارات قبل البيع ومساندة في موقع العمل، من الاستشارة الأولى إلى خدمة ما بعد البيع، ويبقى إلى جانب المشروع طوال مدته.",
      ckb: "بەڵێ. تیمی ئەندازیاریی ئەتلەس پلاست ڕاوێژی پێش فرۆشتن و یارمەتی لە شوێنی کار دەدات، لە یەکەم ڕاوێژەوە تا پاڵپشتیی دوای فرۆشتن، و بە درێژایی پڕۆژەکە لەگەڵیدا دەمێنێتەوە.",
    },
  },
  // ── Ordering, delivery and contact ────────────────────────────────
  {
    id: "how-to-contact",
    topic: "contact",
    href: "/contact",
    source: "confirmed:2026-10-04",
    q: {
      en: "How do I contact AtlasPlast?",
      ar: "كيف يمكنني التواصل مع أطلس بلاست؟",
      ckb: "چۆن پەیوەندی بە ئەتلەس پلاستەوە بکەم؟",
    },
    a: {
      en: "Call the main line {mainPhone}, message WhatsApp {whatsapp}, or email {email}. The projects division is on {projectsPhone} and the sales department on {salesPhone}.",
      ar: "اتصل بالرقم الرئيسي {mainPhone}، أو راسلنا على واتساب {whatsapp}، أو بالبريد الإلكتروني {email}. ورقم قسم المشاريع {projectsPhone}، وقسم المبيعات {salesPhone}.",
      ckb: "پەیوەندی بە ژمارەی سەرەکی {mainPhone} بکە، لە واتسئاپ {whatsapp} نامە بنێرە، یان ئیمەیڵ بنێرە بۆ {email}. ژمارەی بەشی پڕۆژەکان {projectsPhone}ە و بەشی فرۆشتن {salesPhone}ە.",
    },
  },
  {
    id: "main-phone",
    topic: "contact",
    href: "/contact",
    source: "confirmed:2026-10-04",
    q: {
      en: "What is AtlasPlast’s main phone number?",
      ar: "ما الرقم الرئيسي لأطلس بلاست؟",
      ckb: "ژمارەی سەرەکیی ئەتلەس پلاست چەندە؟",
    },
    a: {
      en: "The main line is the short number {mainPhone}. Dial it from a phone in Iraq to reach the sales team.",
      ar: "الرقم الرئيسي هو الرقم المختصر {mainPhone}. اتصل به من هاتف داخل العراق للوصول إلى فريق المبيعات.",
      ckb: "ژمارەی سەرەکی ژمارە کورتەکەی {mainPhone}ە. لە تەلەفۆنێکی ناو عێراقەوە پەیوەندی پێوە بکە بۆ گەیشتن بە تیمی فرۆشتن.",
    },
  },
  {
    id: "whatsapp",
    topic: "contact",
    href: "/contact",
    source: "confirmed:2026-10-05",
    q: {
      en: "Does AtlasPlast have a WhatsApp number?",
      ar: "هل لدى أطلس بلاست رقم واتساب؟",
      ckb: "ئایا ئەتلەس پلاست ژمارەی واتسئاپی هەیە؟",
    },
    a: {
      en: "Yes. AtlasPlast’s WhatsApp line is {whatsapp}, at the Al-Shaab branch in Baghdad. Every mobile number on this site also opens a WhatsApp chat.",
      ar: "نعم. رقم واتساب أطلس بلاست هو {whatsapp}، في فرع الشعب ببغداد. وكل رقم موبايل في هذا الموقع يفتح محادثة واتساب أيضاً.",
      ckb: "بەڵێ. هێڵی واتسئاپی ئەتلەس پلاست {whatsapp}ە، لە لقی شەعب لە بەغدا. هەموو ژمارەیەکی مۆبایل لەم ماڵپەڕەدا گفتوگۆیەکی واتسئاپیش دەکاتەوە.",
    },
  },
  {
    id: "projects-division",
    topic: "contact",
    href: "/contact",
    source: "confirmed:2026-10-04",
    q: {
      en: "How do I reach the projects division?",
      ar: "كيف أتواصل مع قسم المشاريع؟",
      ckb: "چۆن پەیوەندی بە بەشی پڕۆژەکانەوە بکەم؟",
    },
    a: {
      en: "The projects division is on {projectsPhone}, by call or WhatsApp. It handles scheduled supply for contractors and residential, commercial and government projects.",
      ar: "رقم قسم المشاريع {projectsPhone}، بالاتصال أو واتساب. ويتولى التجهيز المجدول للمقاولين والمشاريع السكنية والتجارية والحكومية.",
      ckb: "ژمارەی بەشی پڕۆژەکان {projectsPhone}ە، بە پەیوەندی یان واتسئاپ. ئەم بەشە دابینکردنی خشتەبەندکراو بۆ بەڵێندەران و پڕۆژە نیشتەجێبوون، بازرگانی و حکومییەکان دەکات.",
    },
  },
  {
    id: "sales-department",
    topic: "contact",
    href: "/contact",
    source: "site:/ar/اتصل-بنا/",
    q: {
      en: "What is the sales department’s number?",
      ar: "ما رقم قسم المبيعات؟",
      ckb: "ژمارەی بەشی فرۆشتن چەندە؟",
    },
    a: {
      en: "The sales department is on {salesPhone}. You can also call the main line {mainPhone}.",
      ar: "رقم قسم المبيعات {salesPhone}، ويمكنك أيضاً الاتصال بالرقم الرئيسي {mainPhone}.",
      ckb: "ژمارەی بەشی فرۆشتن {salesPhone}ە. دەتوانیت پەیوەندی بە ژمارەی سەرەکی {mainPhone}یشەوە بکەیت.",
    },
  },
  {
    id: "opening-hours",
    topic: "contact",
    href: "/contact",
    source: "site:/ar/اتصل-بنا/",
    q: {
      en: "What are AtlasPlast’s opening hours?",
      ar: "ما أوقات عمل أطلس بلاست؟",
      ckb: "کاتەکانی کارکردنی ئەتلەس پلاست چین؟",
    },
    a: {
      en: "Saturday to Thursday, 07:00 to 15:00. On Fridays the company handles goods pickup and shipping only. The warehouses are open 24 hours a day, 7 days a week.",
      ar: "من السبت إلى الخميس، من 07:00 إلى 15:00. وفي يوم الجمعة يقتصر العمل على استلام البضائع وشحنها. وتعمل المخازن على مدار الساعة طوال أيام الأسبوع.",
      ckb: "شەممە تا پێنجشەممە، 07:00 تا 15:00. ڕۆژی هەینی تەنها وەرگرتن و ناردنی کاڵا دەکرێت. کۆگاکان 24 کاتژمێر و 7 ڕۆژی هەفتە کراوەن.",
    },
  },
  {
    id: "delivery",
    topic: "contact",
    href: "/locations",
    source: "site:/ar/اتصل-بنا/",
    q: {
      en: "Does AtlasPlast deliver across Iraq?",
      ar: "هل توصّل أطلس بلاست إلى جميع أنحاء العراق؟",
      ckb: "ئایا ئەتلەس پلاست بۆ سەرانسەری عێراق دەگەیەنێت؟",
    },
    a: {
      en: "Yes. AtlasPlast delivers to every region around the clock from warehouses that are open 24/7, and supplies more than 600 agents and dealers in every governorate.",
      ar: "نعم. توصّل أطلس بلاست إلى جميع المناطق على مدار الساعة من مخازن تعمل طوال أيام الأسبوع، وتجهّز أكثر من 600 وكيل وتاجر في جميع المحافظات.",
      ckb: "بەڵێ. ئەتلەس پلاست بە درێژایی شەو و ڕۆژ لە کۆگاکانەوە کە 24/7 کراوەن بۆ هەموو ناوچەکان دەگەیەنێت، و زیاتر لە 600 بریکار و فرۆشیار لە هەموو پارێزگاکان دابین دەکات.",
    },
  },
  {
    id: "warehouses",
    topic: "contact",
    href: "/locations",
    source: "confirmed:2026-10-04",
    q: {
      en: "Where are AtlasPlast’s warehouses?",
      ar: "أين تقع مخازن أطلس بلاست؟",
      ckb: "کۆگاکانی ئەتلەس پلاست لە کوێن؟",
    },
    a: {
      en: "AtlasPlast has warehouses in Baghdad, Basra, Erbil, Duhok and Zakho, from Zakho in the north to Basra in the south.",
      ar: "لأطلس بلاست مخازن في بغداد والبصرة وأربيل ودهوك وزاخو، من زاخو في الشمال إلى البصرة في الجنوب.",
      ckb: "ئەتلەس پلاست کۆگای لە بەغدا، بەسرە، هەولێر، دهۆک و زاخۆ هەیە، لە زاخۆ لە باکوورەوە تا بەسرە لە باشوور.",
    },
  },
  {
    id: "branch-numbers",
    topic: "contact",
    href: "/locations",
    source: "confirmed:2026-10-05",
    q: {
      en: "What are the phone numbers of AtlasPlast’s branches?",
      ar: "ما أرقام هواتف فروع أطلس بلاست؟",
      ckb: "ژمارەی تەلەفۆنی لقەکانی ئەتلەس پلاست چین؟",
    },
    a: {
      en: "{branches}. Each office opens its exact place in Google Maps from the Locations page.",
      ar: "{branches}. ويفتح كل مكتب موقعه الدقيق على خرائط Google من صفحة مواقعنا.",
      ckb: "{branches}. هەر نووسینگەیەک شوێنی ورد لە Google Maps لە پەڕەی شوێنەکانمانەوە دەکاتەوە.",
    },
  },
  {
    id: "become-dealer",
    topic: "contact",
    href: "/contact",
    source: "profile:p4",
    q: {
      en: "How can I become an AtlasPlast agent or dealer?",
      ar: "كيف أصبح وكيلاً أو تاجراً لأطلس بلاست؟",
      ckb: "چۆن ببم بە بریکار یان فرۆشیاری ئەتلەس پلاست؟",
    },
    a: {
      en: "AtlasPlast distributes through a network of more than 600 agents and dealers across Iraq. To ask about joining it, contact the sales department on {salesPhone} or write to {email}.",
      ar: "توزّع أطلس بلاست منتجاتها عبر شبكة من أكثر من 600 وكيل وتاجر في العراق. للاستفسار عن الانضمام إليها، تواصل مع قسم المبيعات على {salesPhone} أو راسلنا على {email}.",
      ckb: "ئەتلەس پلاست لە ڕێگەی تۆڕێکی زیاتر لە 600 بریکار و فرۆشیار لە عێراق دابەش دەکات. بۆ پرسیارکردن دەربارەی بەشداریکردن، پەیوەندی بە بەشی فرۆشتنەوە بکە لەسەر {salesPhone} یان بنووسە بۆ {email}.",
    },
  },
  {
    id: "kurdistan",
    topic: "contact",
    href: "/locations",
    source: "confirmed:2026-10-04",
    q: {
      en: "Does AtlasPlast serve the Kurdistan Region?",
      ar: "هل تخدم أطلس بلاست إقليم كردستان؟",
      ckb: "ئایا ئەتلەس پلاست خزمەتی هەرێمی کوردستان دەکات؟",
    },
    a: {
      en: "Yes. AtlasPlast has offices in Erbil (since 2010) and Duhok and warehouses in Erbil, Duhok and Zakho. The website is also available in Kurdish (Sorani). One exception: AtlasPlast’s exclusive Bänninger agency covers central and southern Iraq only.",
      ar: "نعم. لأطلس بلاست مكتبان في أربيل (منذ 2010) ودهوك، ومخازن في أربيل ودهوك وزاخو، والموقع متوفر باللغة الكردية (السورانية) أيضاً. والاستثناء الوحيد أن وكالة Bänninger الحصرية لأطلس بلاست تغطي وسط العراق وجنوبه فقط.",
      ckb: "بەڵێ. ئەتلەس پلاست نووسینگەی لە هەولێر (لە 2010ەوە) و دهۆک و کۆگای لە هەولێر، دهۆک و زاخۆ هەیە، و ماڵپەڕەکە بە کوردی (سۆرانی)یش بەردەستە. تاکە جیاوازی ئەوەیە کە بریکارایەتیی تایبەتی Bänningerی ئەتلەس پلاست تەنها ناوەڕاست و باشووری عێراق دەگرێتەوە.",
    },
  },
  {
    id: "social-media",
    topic: "contact",
    href: "/media",
    source: "confirmed:2026-10-04",
    q: {
      en: "Where can I follow AtlasPlast online?",
      ar: "أين يمكنني متابعة أطلس بلاست على الإنترنت؟",
      ckb: "لە کوێ دەتوانم ئەتلەس پلاست لە ئینتەرنێت فۆڵۆو بکەم؟",
    },
    a: {
      en: "AtlasPlast is on Facebook (AtlasPlast.llc), Instagram (@atlasplast.iq), LinkedIn (atlas-plast) and YouTube (@atlasplast). The Media page shows the YouTube videos.",
      ar: "أطلس بلاست على فيسبوك (AtlasPlast.llc) وإنستغرام (@atlasplast.iq) ولينكدإن (atlas-plast) ويوتيوب (@atlasplast). وتعرض صفحة الوسائط مقاطع يوتيوب.",
      ckb: "ئەتلەس پلاست لە فەیسبووک (AtlasPlast.llc)، ئینستاگرام (@atlasplast.iq)، لینکدئین (atlas-plast) و یوتیوب (@atlasplast) هەیە. پەڕەی میدیا ڤیدیۆکانی یوتیوب پیشان دەدات.",
    },
  },
  {
    id: "prices",
    topic: "contact",
    href: "/contact",
    source: "confirmed:2026-10-05",
    q: {
      en: "What are AtlasPlast’s prices?",
      ar: "ما هي الأسعار؟",
      ckb: "نرخەکان چەندن؟",
    },
    a: {
      en: "Please contact the sales team and tell them your governorate and what the purchase is for. Once we receive this information, we will send you a price quotation and the details of the distributor nearest to you as soon as possible. Call {mainPhone}, message WhatsApp {whatsapp} or email {email}.",
      ar: "يرجى التواصل مع فريق المبيعات وإعلامهم بالمحافظة والغاية من الشراء. بمجرد أن نتلقى هذه المعلومات، سنقدّم لك عرض أسعار وأقرب موزّع إليك في أقرب وقت ممكن. اتصل على {mainPhone} أو راسلنا على واتساب {whatsapp} أو بالبريد الإلكتروني {email}.",
      ckb: "تکایە پەیوەندی بە تیمی فرۆشتنەوە بکە و پارێزگاکەت و مەبەستی کڕینەکەیان پێ بڵێ. هەر کە ئەم زانیارییانەمان پێگەیشت، لە زووترین کاتدا نرخنامەیەک و نزیکترین دابەشکەرت پێ دەدەین. پەیوەندی بە {mainPhone} بکە، لە واتسئاپ {whatsapp} نامە بنێرە یان ئیمەیڵ بنێرە بۆ {email}.",
    },
  },
  {
    id: "where-to-buy",
    topic: "contact",
    href: "/locations",
    source: "confirmed:2026-10-05",
    q: {
      en: "Where can I buy the products AtlasPlast distributes?",
      ar: "أين يمكنني شراء المنتجات التي توزّعها شركة أطلس بلاست؟",
      ckb: "لە کوێ دەتوانم ئەو بەرهەمانە بکڕم کە ئەتلەس پلاست دابەشیان دەکات؟",
    },
    a: {
      en: "You can buy the products of AtlasPlast’s agencies through a wide network of authorised distributors across Iraq. Send us your phone number and the name of your city by WhatsApp to {whatsapp} or by email to {email}; once we receive this information, we will find the distributor nearest to you as soon as possible.",
      ar: "يمكنك شراء منتجات وكالات شركة أطلس بلاست من خلال شبكة واسعة من الموزّعين المعتمدين في جميع أنحاء العراق. يرجى تزويدنا برقم هاتفك واسم المدينة عبر واتساب {whatsapp} أو البريد الإلكتروني {email}، وبمجرد أن نتلقى هذه المعلومات سنحدّد أقرب موزّع إليك في أقرب وقت ممكن.",
      ckb: "دەتوانیت بەرهەمی بریکارایەتییەکانی ئەتلەس پلاست لە ڕێگەی تۆڕێکی فراوانی دابەشکەری ڕێگەپێدراو لە سەرانسەری عێراق بکڕیت. تکایە ژمارەی تەلەفۆن و ناوی شارەکەت بە واتسئاپ بۆ {whatsapp} یان بە ئیمەیڵ بۆ {email} بنێرە؛ هەر کە ئەم زانیارییانەمان پێگەیشت، لە زووترین کاتدا نزیکترین دابەشکەرت بۆ دیاری دەکەین.",
    },
  },
  {
    id: "request-quote",
    topic: "contact",
    href: "/contact",
    source: "confirmed:2026-10-04",
    q: {
      en: "How do I request a quotation?",
      ar: "كيف أطلب عرض سعر؟",
      ckb: "چۆن داوای نرخنامە بکەم؟",
    },
    a: {
      en: "Send the products, sizes, quantities and site location by WhatsApp to {whatsapp} or by email to {email}, or call the main line {mainPhone}. For contractor and government projects, contact the projects division on {projectsPhone}.",
      ar: "أرسل المنتجات والمقاسات والكميات وموقع العمل عبر واتساب إلى {whatsapp} أو بالبريد الإلكتروني إلى {email}، أو اتصل بالرقم الرئيسي {mainPhone}. ولمشاريع المقاولين والمشاريع الحكومية، تواصل مع قسم المشاريع على {projectsPhone}.",
      ckb: "بەرهەمەکان، پێوانەکان، بڕەکان و شوێنی کار بە واتسئاپ بنێرە بۆ {whatsapp} یان بە ئیمەیڵ بۆ {email}، یان پەیوەندی بە ژمارەی سەرەکی {mainPhone} بکە. بۆ پڕۆژەی بەڵێندەران و پڕۆژە حکومییەکان، پەیوەندی بە بەشی پڕۆژەکانەوە بکە لەسەر {projectsPhone}.",
    },
  },
];
