# ATLASPLAST WEBSITE — PROJECT HANDOFF

Last updated: 2026-10-04 (end of the first build session). Written from the repository state at commit `14bf432` on branch `feat/home-page`.

---

## 1. Project Overview

- **What:** a new corporate website for **AtlasPlast**, replacing the current WordPress site at https://atlasplast.iq/.
- **Company:** AtlasPlast. Legal/trading name **Ufuq Al-Atlas Ltd.** (UFUQ ALATLAS LTD. – Commercial Agencies). It is an Iraqi distributor and exclusive agent for international pipe-system, drainage, sanitaryware, pump, faucet and installation-tool manufacturers. It has been in business since 1975 and opened its first showroom in 1990.
- **Purpose:** present AtlasPlast as an established, technically capable national supplier. It should help contractors, installers and project owners find solutions and brands, see projects, and contact sales.
- **Stage:**
  - The **Home page is built** in three languages and is the approved visual benchmark.
  - Every other page is an **interim placeholder** (noindex).
  - The owner (MOhammed) asked for the next round, which is **not started in code yet**: a 3–4 slide hero, a true multipage site, and a **Solutions** section. See §23.
- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion for React, next-intl 4.
- **Deployment:** GitHub → Coolify → Linux VPS. No Vercel-specific features or dependencies.
- **Languages:**
  - English — `en` — LTR
  - Arabic — `ar` — RTL
  - Kurdish Sorani — `ckb` — RTL
- **Content sources:**
  - `ATLASProfile.pdf` (the "atlasprofile"), stored in the project's shared files at `/mnt/project-files/atlas/sources/`.
  - https://atlasplast.iq/
  - Explicit decisions by MOhammed in the project thread.
- **Company facts must never be invented.** Every fact on the site must trace to one of these sources. Each record in `src/content/*.ts` carries a `source` field (`profile:pN`, `site:…` or `confirmed:YYYY-MM-DD`).

## 2. Current Technology Stack

Installed versions, from `npm ls --depth=0`:

| Package | Version | Use |
|---|---|---|
| next | 16.3.8 | App Router, Turbopack (default), `proxy.ts` (replaces middleware), static generation |
| react / react-dom | 19.2.8 | |
| typescript | 5.9.3 | strict, path alias `@/*` → `src/*` |
| tailwindcss / @tailwindcss/postcss | 4.3.3 | CSS-first config via `@theme` in `src/app/globals.css` (there is no tailwind.config file) |
| motion | 14.0.0 | imported from `motion/react`; LazyMotion + `m` components |
| next-intl | 4.14.9 | locale routing, messages, navigation |
| eslint / eslint-config-next | 9.39.5 / 16.3.8 | `npm run lint` |
| @types/node, @types/react, @types/react-dom | 20 / 19 | |

- **Fonts:** loaded with `next/font/google` in `src/lib/fonts.ts`, so they are self-hosted at build time with no runtime Google requests. The families are Archivo (wdth axis), IBM Plex Sans, IBM Plex Mono (400/500) and IBM Plex Sans Arabic (400/500/600/700).
- **Not installed:** there is no icon library (the arrows are inline SVG in `src/components/ui/Arrow.tsx`). There is also no test runner and no Playwright dependency.
  - QA used a **global** Playwright install in the build container, run with `NODE_PATH=$(npm root -g)` and Chromium from `/opt/pw-browsers`. The QA scripts live outside the repo.
  - Adding `@playwright/test` as a devDependency is an open task (§24).
- **Scripts** (`package.json`): `dev`, `build`, `start`, `lint`, and `typecheck` (`next typegen && tsc --noEmit`).
- **Engines:** `node >= 20.9.0`.

## 3. Project Architecture

```
.
├── AGENTS.md / CLAUDE.md     Next.js agent rules (CLAUDE.md just includes AGENTS.md). Read node_modules/next/dist/docs before using Next APIs: Next 16 differs from older versions.
├── HANDOFF.md                this file
├── README.md                 setup, checks, env vars, Coolify deploy steps, structure
├── .env.example              NEXT_PUBLIC_SITE_URL only (allowed by .gitignore `!.env.example`)
├── next.config.ts            next-intl plugin, poweredByHeader false, AVIF/WebP image formats
├── messages/                 en.json, ar.json, ckb.json — ALL user-facing UI copy
├── public/
│   ├── brand/                official AtlasPlast logos (SVG, from the 2026 logo pack)
│   └── brands/               partner manufacturer logos (SVG, cropped and optimised with svgo)
└── src/
    ├── proxy.ts              next-intl middleware (Next 16 name for middleware)
    ├── i18n/                 routing.ts, navigation.ts, request.ts
    ├── lib/                  site.ts (URLs/hreflang), nav.ts (menu and page list), fonts.ts
    ├── content/              typed company data with sources: company, brands, projects, timeline, iraq-map
    ├── components/
    │   ├── layout/           SiteHeader (client), SiteFooter (server), LanguageSwitcher (client), Logo
    │   ├── sections/         Home page sections (server by default)
    │   ├── motion/           MotionProvider, LineRise, SectionWipe, ScrollRule, useDirection
    │   └── ui/               ButtonLink, TextLink, Arrow, SectionHead, Ltr
    └── app/
        ├── globals.css       design tokens (@theme), base styles, utilities
        ├── icon.svg          favicon (globe mark cropped from atlasplast-stacked.svg)
        ├── robots.ts, sitemap.ts
        └── [locale]/
            ├── layout.tsx    <html lang dir>, fonts, providers, header/footer, skip link
            ├── page.tsx      Home page with Organization JSON-LD
            ├── not-found.tsx
            └── [section]/page.tsx   interim placeholder for products/brands/projects/about/locations/contact
```

There is no `.claude/` directory in the repo.

**Architectural decisions:**
- **Routing:** every route lives under `src/app/[locale]/`. `localePrefix: "always"`, so `/` redirects (307) to `/en` (or to the visitor's preferred locale).
- **Static generation:**
  - `generateStaticParams` builds every locale.
  - The placeholder route uses `dynamicParams = false`, so unknown sections return 404.
  - The build currently produces 25 static pages.
- **Server vs client components:** components are Server Components by default. Only these are client components:
  - `SiteHeader`, because of menu state and the active link.
  - `LanguageSwitcher`.
  - `PipeSection`, because it animates.
  - The motion components.

  Section components fetch copy with `getTranslations` on the server.
- **Content:**
  - Facts (phones, offices, brands, projects, timeline, map points) live in typed modules in `src/content/`, with `Localized<T> = Record<Locale, T>` for names.
  - UI copy lives in `messages/*.json`.
  - Brand and product names stay in Latin script, marked `lang="en"` where needed.
- **Images:** there is no photography yet. Logos are SVG, rendered with `next/image` using `unoptimized`, because SVGs need no optimisation. `next.config` has AVIF/WebP enabled for future raster photos.
- **Translations:** there is one JSON file per locale, with identical key structure (parity was verified). The namespaces are `Meta`, `Common`, `Nav`, `Footer`, `Home.{hero,facts,statement,products,brands,projects,timeline,services,presence,contact}`, `Products.families`, `Projects.sectors`, `Brands.notes`, `Countries`, `Placeholder` and `NotFound`.

## 4. Current Sitemap

| Route | Status | Notes |
|---|---|---|
| `/` | DONE | redirects to `/en` (next-intl proxy) |
| `/en`, `/ar`, `/ckb` (Home) | DONE | approved benchmark. Hero still needs to become a 3–4 slide slider (§23) |
| `/{locale}/products` | PLACEHOLDER | to be replaced by **Solutions** (owner request 2026-10-04) |
| `/{locale}/solutions` + `/solutions/[slug]` | NOT STARTED | requested by owner; facts gathered in §23 |
| `/{locale}/brands` | PLACEHOLDER | brand index and per-brand pages planned |
| `/{locale}/projects` | PLACEHOLDER | |
| `/{locale}/about` | PLACEHOLDER | history, services, values; vision/mission pending owner approval |
| `/{locale}/locations` | PLACEHOLDER | |
| `/{locale}/contact` | PLACEHOLDER | |
| `/{locale}/<unknown>` | DONE | localized 404 (`not-found.tsx`) |
| `/sitemap.xml`, `/robots.txt`, `/icon.svg` | DONE | sitemap lists Home only |

Placeholder pages say "in preparation", show the main line 6779, and are `robots: { index: false }`.

## 5. Design System

All tokens are in `src/app/globals.css`, in `@theme` and `:root`.

**Style:** editorial and architectural. Square geometry, hairline rules, 2px section rules, a 12-column grid, no decorative shadows or gradients, and navy bands for emphasis. Technical-drawing motifs (pipe cross-sections) stand in for photography until real photos arrive.

**Colours:**
- Brand colours were sampled from the vector logo:
  - `--color-atlas-blue: #26549f`. Primary accent with 7.37:1 contrast on white, so it is safe for text.
  - `--color-atlas-sky: #3c84c2`. Decorative only, at 4.0:1; never use it for small text.
  - `--color-atlas-grey: #70767b`.
  - `--color-atlas-navy: #14284a`. Derived; used for the header, hero, contact band and theme-color.
  - `--color-atlas-navy-deep: #0e1c35`. Footer.
- Neutrals:
  - `--color-paper: #f3f4f2`. Page background.
  - `--color-surface: #ffffff`. Alternate sections.
  - `--color-rule: #d3d7d5` and `--color-rule-strong: #9aa2a8`.
  - `--color-steel: #59626b`. Secondary text.
  - `--color-ink: #15181b`.
- On dark backgrounds: `--color-on-dark: #f3f4f2`, `--color-on-dark-muted: #b9c3d3`, `--color-rule-dark: #2c4063`.

**Typography:**
- `--font-display` is Archivo (`font-display-latin` utility: `font-stretch: 112%`, `letter-spacing: -0.02em`).
- `--font-sans` is IBM Plex Sans (body, 1rem / 1.6).
- `--font-mono` is IBM Plex Mono (specs, labels, the `eyebrow` utility).
- `--font-arabic` is IBM Plex Sans Arabic.
- For `ar`/`ckb`, `:lang()` rules swap the display, eyebrow and body fonts to Plex Arabic. They also remove letter-spacing and uppercase.
- Body line-height in ar/ckb is 1.8. It is set on `html:lang(..) body` so that `leading-*` utilities can still tighten headings.
- Weights in use: 400/500/600; headings are mostly `font-semibold`.

**Heading scale:**
- Hero h1: `clamp(2.4rem, 6.2vw, 5.6rem)`, leading 0.98 (1.28 in ar/ckb).
- Section h2 via `SectionHead`: `clamp(2rem, 4.4vw, 3.75rem)`, leading 1.02 (1.3 in ar/ckb), max 22ch.
- Placeholder h1: `clamp(2.5rem, 7vw, 6rem)`.
- Figures: `clamp(2rem, 4vw, 3.25rem)`. Contact number: `clamp(3.5rem, 9vw, 7rem)`.

**Spacing and layout:**
- `--gutter: clamp(1rem, 3.2vw, 2.5rem)` and `--section-space: clamp(4.5rem, 10vw, 10rem)`.
- Utilities: `container-page` (max-width `--container-wide` 95rem / 1520px, with inline padding of `--gutter`) and `section-space`.
- `--container-content` is 80rem and `--container-text` is 42rem.

**Grid:** `md:grid-cols-12`, with the label in 3 columns and content in 9. This pattern comes from `SectionHead`.

**Radius:** square everywhere. `--radius-input: 2px` is reserved for future form fields.

**Buttons:**
- `ButtonLink` variants: `primary` (blue), `secondary` (ink outline), `inverse` (paper on navy) and `inverseOutline`.
- All are 48px min height, square, with an arrow that nudges in the reading direction on hover.
- `TextLink` is an underlined link with an arrow.

**Cards:** there are no rounded cards. Brand tiles form a hairline-bordered grid. Product and project rows are rule-separated lists.

**Images:** partner logos appear in grayscale and switch to colour on hover.

**Icons:** a single inline-SVG `Arrow` (mirrored in RTL), plus `SectionGlyph` (pipe cross-section markers).

**Motion tokens:** `--ease-out-expo: cubic-bezier(0.22,1,0.36,1)`, `--duration-fast: 160ms`, `--duration-base: 320ms`, `--duration-reveal: 700ms`.

**Header:** a solid navy sticky bar, 64px tall (80px at `md`). See §11.

**Footer:** deep-navy, 12-column. See §12.

## 6. Design Principles

The site should feel premium, sophisticated, modern, architectural, industrial, editorial, established, trustworthy and technically capable.

**Avoid:**
- a generic SaaS look
- purple/blue AI gradients
- glassmorphism
- rounded card stacks
- repetitive three-card rows
- random decorative shapes
- heavy shadows
- template-looking layouts

**Decisions already made:**
- The **technical-drawing language**: the hero PE100 SDR11 Ø110 pipe section and the `SectionGlyph` markers. Product data is set in mono with real specs (e.g. "PP-R · PP-RCT · Ø 20–200").
- **Navy bands** for the hero and contact, with paper and white alternating between other sections.
- **Lists and indexes instead of cards** for products, projects and clients. The **brand wall** is a hairline grid.
- **Restrained motion**: one reveal per heading, a drawing that draws itself, and a timeline rule that fills on scroll.
- The logo lockup reads "PIPE SYSTEMS · SINCE 1990". This is the official artwork and must not be edited; the copy uses "Since 1975" (see §9).

## 7. RTL and Multilingual Architecture

- **Locales:** `en` (LTR), `ar` (RTL), `ckb` (RTL). These are defined in `src/i18n/routing.ts`, together with `getDirection(locale)`.
- **next-intl:**
  - `defineRouting` with `localePrefix: "always"` and `defaultLocale: "en"`.
  - `src/i18n/request.ts` loads `messages/${locale}.json`.
  - `src/i18n/navigation.ts` exports `Link`, `usePathname`, `redirect` and so on from `createNavigation`. **Always use these**, not `next/link`, for internal links.
- **Proxy:** `src/proxy.ts` is `createMiddleware(routing)`, with matcher `/((?!api|_next|_vercel|.*\\..*).*)`.
- **lang/dir:** `src/app/[locale]/layout.tsx` renders `<html lang={locale} dir={getDirection(locale)}>`.
- **Font switching:** handled by the `:lang(ar)` / `:lang(ckb)` CSS rules (§5). The language switcher sets `lang` on each option so every language name renders in its own font.
- **Logical CSS:** only `ms-/me-/ps-/pe-/start-/end-/border-s/border-e` are used; there is no left/right. `rtl:` variants are used only where a transform must flip:
  - arrow `rtl:-scale-x-100`
  - hover nudge `rtl:group-hover:-translate-x-1`
  - underline and ScrollRule origin `rtl:origin-right`
- **Never mirrored:** the logo, the Iraq map (`style={{direction:"ltr"}}`, geography) and the pipe drawing (a technical drawing).
- **`<Ltr>`** (`<bdi dir="ltr">`) wraps phone numbers, figures, emails and Latin codes inside RTL text.
- **Motion direction:** `useDirectionSign()` returns +1 or -1. `SectionWipe` opens from the reading-start edge.
- **Navigation:** the language switcher keeps the current path (`usePathname` + `locale` prop).
- **Known RTL issues:**
  - None open from the last QA pass.
  - The Arabic heading leading bug was fixed this session.
  - Brand names in mono-styled country labels need `[:lang(ar)_&]:font-arabic`, because Plex Mono has no Arabic glyphs. Remember this for any new mono text that may contain Arabic script.

## 8. Translation Status

| Area | English | Arabic | Kurdish Sorani |
|---|---|---|---|
| Meta, Common, Nav, Footer | complete | complete | complete |
| Home (all 10 namespaces) | complete | complete | complete |
| Products.families (7) | complete | complete | complete |
| Projects.sectors, Brands.notes, Countries | complete | complete | complete |
| Content data (offices, warehouses, regional offices, timeline, project names) | complete | complete | complete |
| Placeholder / NotFound | complete | complete | complete |
| Solutions / Brands / Projects / About / Locations / Contact pages | **not written** | **not written** | **not written** |

**Needs human review:**
- **Kurdish Sorani has not been reviewed by a native speaker.** Claude wrote it carefully, and several fixes were made this session:
  - سعوودیە, سڕبیا, کۆماری چیک, گیرەی بۆری
  - "پەیوەندی بە بەشی فرۆشتنەوە بکە"
  - `PPی` written attached
  - non-breaking space after the conjunction "و" in titles

  It is still **not approved copy**. Arabic has not had a native review either.
- **Client names** (36 contractors in `src/content/projects.ts`) are shown in Latin script in every locale. Arabic/Kurdish spellings were not supplied.

**Consistent terminology:**
- Brand name: AtlasPlast / أطلس بلاست / ئەتلەس پلاست.
- Company name: Ufuq Al-Atlas Ltd. / شركة أفق الأطلس المحدودة / کۆمپانیای ئوفوق ئەلئەتلەس.
- Manufacturer and product names stay in Latin script (Georg Fischer, Silenta, PP-R…).
- Numerals are Western digits, wrapped in `<Ltr>`.

## 9. Content Sources

Source files are in the shared project folder (not in the repo):
- `/mnt/project-files/atlas/sources/ATLASProfile.pdf` (31 pages), plus the extracted text `ATLASProfile.txt`.
- `/mnt/project-files/atlas/sources/All_AtlasPlast_Logos_2026.pdf` (logo pack).
- `/mnt/project-files/atlas/sources/profile-images/`: 13 PNGs, mostly partner-factory photos at about 1000px. They are not AtlasPlast's own photos.
- Full audit: `/mnt/project-files/atlas/research/content-audit.md` (Rev B; section 0 holds the final decisions).

**Precedence:** MOhammed's confirmations (newest wins) > ATLASProfile > atlasplast.iq.

**Confirmed and in use:**
- Since 1975 (first showroom 1990).
- "Hundreds of projects."
- Main phone **6779**. WhatsApp/HQ +964 783 305 6475. Projects division +964 772 267 1130. Email info@atlasplast.iq.
- **Offices in Iraq:**
  - Camp Sara (Baghdad) — HQ
  - Al-Shaab (Baghdad)
  - Najaf — +964 783 700 6314
  - Basra — Al-Watan St, +964 787 116 6601
  - Erbil — Gulan St, +964 787 803 0001
  - Duhok — +964 750 991 0065
- **Warehouses:** Baghdad (includes Al-Radwaniyah), Basra, Erbil, Duhok, Zakho.
- **Regional offices:** Saudi Arabia, Turkey, Syria, Egypt.
- **Bänninger:** AtlasPlast is the exclusive agent for **central and southern Iraq**; Massary holds Kurdistan.
- The Czech agency is **FV-Plast**; the Serbian agency is **Pestan**.
- **Calpeda and Vitra are no longer partners.** Do not show them.
- Operations Manager is Raid Thamer. Hussein Raad and Hassan Al-Oreibi have left; do not publish them.
- Client names: approved for publication.
- Figures used:
  - 600+ agents and dealers
  - 23 brands
  - 6,000+ engineers and plumbers trained
  - 6 months of national demand held in stock
- Hours: Sat–Thu 07:00–15:00 (website).

**REQUIRES REVIEW:**
- **"23 international brands" vs 21 brands shown.** The profile says 23. After Calpeda and Vitra were removed, the brand wall shows 21. Ask the owner whether the figure should change.
- **Vision/mission:** the profile's version is sanitaryware-only, while the website's is about water and sewage networks. A combined statement is to be drafted and approved. It is not on the site.
- **Projects completed:** the profile says 700+ (p6) and 800+ (p23). Only "hundreds" is used.
- **Warehouse area:** the profile gives 40,000 m² + 16,000+ m² vs a 76,000 m² total, and the old site said 20,000 m². None of these is published.
- **Office count:** the profile contradicts itself (14 vs 10). Not published.
- **Financial and growth figures, market-share bars, the unnamed ISO certificate:** do not publish.
- **Leadership:** not shown. Whether to publish people is unconfirmed, and Deniz Yilmaz's status is unknown.
- **Profile main number +964 790 135 0331:** not used, because the owner chose 6779.
- **Boroug UPVC:** it may be a private label. It appears on the Polo Egypt page of the profile and in the logo pack (unconfirmed).
- **Partner-company founding years:** these are the manufacturers' facts. Use them sparingly.

## 10. Home Page

`src/app/[locale]/page.tsx` renders the sections in this order. All are complete in three languages.

1. **Hero** — `sections/Hero.tsx` (server) with `PipeSection.tsx` (client).
   - Navy band containing:
     - eyebrow "AtlasPlast · Ufuq Al-Atlas Ltd."
     - h1 animated by `LineRise`, word by word
     - lead text
     - two buttons: Explore products → `/products`, and Contact sales → `/contact`
     - the PE100 SDR11 Ø110 pipe drawing on the end side, which draws itself
   - Below it, a `dl` of 4 figures (2 columns on mobile, 4 on large screens).
   - **Pending change:** the owner wants 3–4 slides here showing history and brands (§23).
2. **Statement** — `Statement.tsx`. "A distributor built on stock, reach and technical knowledge." Two paragraphs, plus a blue-ruled line: "Hundreds of projects completed…".
3. **Product families** — `ProductIndex.tsx`.
   - White section listing 7 families with a `SectionGlyph`, description, mono spec and brand list.
   - The rows link to `/products`; the glyph rotates on hover.
   - Should become **Solutions** (§23).
4. **Brands** — `BrandWall.tsx`.
   - 21 partner logos in a hairline grid (2 columns, 3 from `sm`), grayscale until hover, each with its country and the Bänninger territory note.
   - Polo Egypt has no logo file and renders as text.
5. **Projects** — `ProjectIndex.tsx`. 14 featured projects with sector labels in two columns, plus a "Contractors we supply" inline list of 36 names and "And many more".
6. **Timeline** — `Timeline.tsx`.
   - Milestones 1975, 1990, 2004, 2009, 2010, 2012, 2019 and 2025.
   - 4-column grid; `ScrollRule` fills the top rule on scroll.
7. **Service model** — `ServiceModel.tsx`.
   - Sticky heading "More than supply" on the start side, with 6 services in a 2-column list.
   - Below that, an "In the community" panel with 4 items.
8. **Presence** — `Presence.tsx` with `IraqMap.tsx`.
   - "From Zakho to Basra." An SVG Iraq map wipes in via `SectionWipe`, showing office dots and warehouse squares with a legend.
   - Lists of offices (HQ flagged), warehouses and regional offices.
9. **Contact band** — `ContactBand.tsx`.
   - Navy band with "Talk to our sales and projects teams", the hours and a "Send an enquiry" button → `/contact`.
   - The giant main line 6779, with WhatsApp, projects division and email rows.

**Responsive:** all sections stack to one column below `md`/`lg`. The figures go 2×2 on mobile. QA found no horizontal overflow at 375 through 1920px.

## 11. Header and Navigation

`src/components/layout/SiteHeader.tsx` (client).

- **Bar:** sticky, solid navy, z-40. There is no transparent state and no scroll-based change. It is `h-16`, or `md:h-20`.
- **Logo:** the white lockup, sized by height (`!h-11 md:!h-14`, fixed this session; it previously overflowed the bar). It links to `/`.
- **Desktop (≥ lg):**
  - Nav items: Products, Brands, Projects, About, Locations.
  - An underline grows on hover and on `aria-current="page"`. Its origin flips in RTL.
  - On the end side: `LanguageSwitcher` (English / العربية / کوردی) and a bordered Contact button.
- **Mobile (< lg):**
  - A two-line burger opens a full-screen navy menu under the bar.
  - The menu has large links with arrows (staggered fade-up), plus the language switcher.
  - Escape closes it; page scroll is locked while open; links close the menu.
- **Known gaps:**
  - No focus trap inside the open mobile menu (Tab can leave it).
  - Nav labels still say "Products". This should become "Solutions" per the owner's request.

## 12. Footer

`src/components/layout/SiteFooter.tsx` (server). Deep navy, 12-column grid.

- **Columns:**
  - logo and tagline
  - "Explore" links (the nav plus Contact)
  - "Offices in Iraq" (6 offices)
  - Contact (main line 6779, email)
  - Follow (Facebook, Instagram, LinkedIn)
- **Bottom bar:** © year Ufuq Al-Atlas Ltd.
- **Mobile:** the columns stack.
- **Missing:**
  - Warehouse and regional office lists.
  - Office addresses and phone numbers (data exists in `company.ts`).
  - A link to the future Solutions pages.
  - Social URLs are taken from the old site and have not been re-verified.

## 13. Components

| Component | File | Purpose / where used | Notes |
|---|---|---|---|
| `SectionHead` | `src/components/ui/SectionHead.tsx` | Section opener: 2px rule, eyebrow (3 cols), h2 + intro + action (9 cols). Used by most Home sections | props `eyebrow, title, intro?, id, action?, tone` (light/dark). Arabic leading override built in |
| `ButtonLink` | `ui/ButtonLink.tsx` | Primary CTA links (next-intl `Link`) | `variant`: primary/secondary/inverse/inverseOutline; the arrow nudge flips in RTL |
| `TextLink` | `ui/TextLink.tsx` | Underlined "All …" links | |
| `Arrow` | `ui/Arrow.tsx` | Forward arrow | `rtl:-scale-x-100` |
| `Ltr` | `ui/Ltr.tsx` | `<bdi dir="ltr">` for numbers and codes in RTL | |
| `Logo` | `layout/Logo.tsx` | Official lockup (`/brand/atlasplast.svg` or `-white.svg`) via `next/image` (unoptimized, priority) | never mirrored; size it with height |
| `LanguageSwitcher` | `layout/LanguageSwitcher.tsx` | Locale links keeping the path | `className`, `onNavigate` |
| `SiteHeader` / `SiteFooter` | `layout/` | §11 and §12 | |
| `PipeSection` | `sections/PipeSection.tsx` | Hero technical drawing | client; renders finished when reduced motion is on |
| `SectionGlyph` | `sections/SectionGlyph.tsx` | Pipe cross-section marker for each product family | prop `wall` (ratio) |
| `IraqMap` | `sections/IraqMap.tsx` | Map with office and warehouse markers | props `locale, label, officeCities, warehouseCities, cityNames`; never mirrored; `labelSide` puts Zakho/Najaf/Basra labels to the west |
| `LineRise` | `motion/LineRise.tsx` | Word-mask headline reveal | splits only on spaces (keeps Arabic shaping); plain heading when reduced motion is on |
| `SectionWipe` | `motion/SectionWipe.tsx` | clip-path reveal from the reading-start edge | for large visuals only; plain div when reduced motion is on |
| `ScrollRule` | `motion/ScrollRule.tsx` | Timeline rule that fills with scroll (spring) | origin flips in RTL; full width when reduced motion is on |
| `MotionProvider` | `motion/MotionProvider.tsx` | `LazyMotion` (domAnimation, strict) + `MotionConfig reducedMotion="user"` | strict mode means you **must use `m.*`, not `motion.*`** |
| `useDirectionSign` | `motion/useDirection.ts` | +1 LTR / -1 RTL | |

## 14. Animation System

- **Philosophy:** purposeful and restrained. Motion explains (a drawing draws itself, a timeline fills) and never decorates. One reveal per element, once.
- **Hero:**
  - `LineRise` rises each word out of a mask (0.9s, ease-out-expo, 45ms stagger).
  - `PipeSection` strokes draw via `pathLength` (1.6s, staggered 0.3–1.1s), then labels fade in.
- **Scroll:**
  - `SectionWipe` on the map (1.1s, `whileInView`, once, at 25% visibility).
  - `ScrollRule` on the timeline (spring with stiffness 120, damping 30).
- **Hover:**
  - Underline grow (320ms), the button arrow nudge, the product glyph rotating 90° (700ms) and brand logos changing from grayscale to colour.
- **Mobile menu:** a 0.25s fade, with items staggered at 40ms.
- **Not implemented:** page transitions and parallax. Both are intentionally absent.
- **Easing:** everything uses `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Reduced motion:**
  - `MotionConfig reducedMotion="user"`.
  - `LineRise`, `SectionWipe` and `PipeSection` check `useReducedMotion()` and render the final state.
  - `ScrollRule` uses `motion-reduce:!scale-x-100`.
  - `html` smooth scrolling is turned off under `prefers-reduced-motion`.
- **Do not change:**
  - The `LazyMotion strict` + `m` pattern (bundle size).
  - The reduced-motion fallbacks.
  - That the map and drawing are never mirrored.
  - That `LineRise` never splits inside a word (it would break Arabic and Sorani joining).

## 15. Responsive Design

Breakpoints are Tailwind defaults (sm 640, md 768, lg 1024, xl 1280). QA viewports: 375, 430, 768, 1024, 1440 and 1920.

- **375/430:**
  - Burger menu and single-column sections.
  - Figures in a 2×2 grid.
  - Brand wall in 2 columns (the last odd tile spans both).
  - Pipe drawing below the hero text.
  - Header 64px.
- **768:**
  - The 12-column `SectionHead` grid starts (label beside the heading).
  - Brand wall in 3 columns.
  - Header 80px.
- **1024 and up:**
  - Desktop nav.
  - Hero in two columns (7 + 5).
  - Figures in 4 columns.
  - Timeline in 4 columns.
  - Presence in two columns (map + lists).
- **1440/1920:** content is capped at 1520px plus gutters.
- **Typography:** scales fluidly with `clamp()`. There is no image cropping yet because there are no photos.
- **RTL on mobile:** verified for ar and ckb at 375 and 390, including the menu.
- **Known problems:** none open. Fixed this session: the Basra map label was clipped at mobile width.

## 16. Images and Assets

- **AtlasPlast logos:** in `public/brand/`.
  - `atlasplast.svg` (colour, horizontal), `atlasplast-white.svg` and `atlasplast-stacked.svg`.
  - All come from the 2026 logo pack PDF via `pdftocairo` and svgo.
- **Favicon:** `src/app/icon.svg`, a viewBox crop of the stacked logo's globe mark.
- **Partner logos:** in `public/brands/`.
  - alvit, aquapa, ascelik, baenninger, candan, dab, fv-plast, georg-fischer, guarri, kas, ostendorf, pestan, pimtas, poloplast, polymelt, quarterbath, saudi-ceramics, shield, turan-borfit and wisa (all used).
  - `aquahot.svg` is **present but not used yet**. It is meant for the Water heaters solution.
  - **Polo Egypt has no logo** (renders as text).
- **Photography:**
  - There is **none**: no hero, product or project photos.
  - The owner has been asked for original photos of warehouses, showrooms, team and projects.
  - The profile images in `/mnt/project-files/atlas/sources/profile-images/` are mostly partner factories at about 1000px, so they are not suitable as AtlasPlast hero imagery.
  - Never substitute AI-generated "company" photos.
- **Fonts:** self-hosted by `next/font` (§2).
- **OG image:** none yet.
- **Preview screenshots** (not in the repo): `/mnt/project-files/atlas/preview/home-{en,ar,ckb}-1440.jpg`, `home-ckb-390.jpg` and `home-ar-390.jpg`.

## 17. SEO

**Implemented:**
- Root layout `generateMetadata`: `metadataBase` = `SITE_URL`, title template `%s | <siteName>`, localized description and `applicationName`.
- Home metadata:
  - Absolute localized title and description.
  - `alternates.canonical` (`/{locale}`), plus `alternates.languages` for en/ar/ckb and **x-default → /en** (`src/lib/site.ts`).
  - Open Graph: type, siteName, title, description, url and locale.
- Placeholder pages: localized title, canonical and hreflang, plus `robots: { index: false }`.
- `src/app/sitemap.ts` lists the three Home URLs with hreflang alternates. Add new pages here as they ship.
- `src/app/robots.ts`: allow all, with the sitemap URL.
- JSON-LD `Organization` on Home: name, legalName, url, logo, foundingDate 1975, email, telephone 6779, Baghdad address and sameAs social links.
- `viewport.themeColor` is `#14284a`.

**Unfinished:**
- OG/Twitter image.
- Per-page metadata for the real pages.
- `LocalBusiness`/branch structured data.
- `BreadcrumbList`.
- Sitemap entries for future pages.
- `og:locale` uses the bare locale code (`ar`, `ckb`); consider `ar_IQ` / `ckb_IQ`.

## 18. Accessibility

**In place:**
- Semantic landmarks: header/nav/main/footer and a skip link to `#main`.
- One h1 per page, with sections labelled by `aria-labelledby`.
- `dl` for the figures and `aria-current` on nav and language links.
- Visible `:focus-visible` outline: 2px Atlas Blue, or light on dark sections.
- `aria-expanded`/`aria-controls` on the burger, plus Escape to close.
- Alt text on logos (brand names).
- `role="img"` + `aria-label` on the map and pipe drawing.
- `LineRise` keeps the full heading in `aria-label`, with the word spans `aria-hidden`.
- `lang`/`dir` on `<html>`, plus `lang` on Latin-script brand names and language options.
- Reduced motion is honoured.
- Atlas Sky is not used for text.
- Tap targets are at least 44px (burger 44px, buttons 48px).

**Known issues:**
- No focus trap in the mobile menu.
- No forms yet; the contact form is still to be designed, with labels and errors.
- No automated axe audit has been run.

## 19. Performance

- All pages are statically prerendered (SSG) with Server Components by default. Only the header, language switcher, pipe drawing and motion helpers ship client JS.
- Motion uses `LazyMotion` + `domAnimation` (a reduced feature bundle).
- Fonts use `next/font` (self-hosted, `display: swap`, subset); the Arabic font loads the arabic subset only.
- Logos are lightweight SVGs (svgo-optimised).
- AVIF/WebP are configured for future photos.
- **Known problems:** none measured. No Lighthouse run yet.

## 20. Coolify Deployment

- **Repository:** https://github.com/M7tech/website_pipes
- **Production branch:** `main`. It currently holds only the scaffold commit. The Home page is on `feat/home-page`, in **draft PR #1** (https://github.com/M7tech/website_pipes/pull/1), which is not merged. Deploy `main` only after the PR is merged.
- **Build method:** Nixpacks or a Node Dockerfile, with Node ≥ 20.9.
- **Commands:**
  - Install: `npm ci`
  - Build: `npm run build`
  - Start: `npm run start` (`next start`)
- **Port:** 3000. `next start` honours `PORT`.
- **Environment variable:** `NEXT_PUBLIC_SITE_URL`. Set it as a **build-time** variable because it is inlined at build. It defaults to `https://atlasplast.iq`.
- **Domain:** point it at the Coolify app and enable HTTPS there.
- **Health check:** none defined. Any 200 on `/en` works; `/` returns 307.
- No secrets are needed or committed. `.env*` is gitignored, except `.env.example`.

## 21. Git Status

- **Current branch:** `feat/home-page`, which tracks `origin/feat/home-page` and is pushed.
- **Commits** (newest first):
  - `14bf432` Add sitemap, robots and app icon
  - `0f613e5` Build the Home page
  - `2927911` Add site header, footer and locale layout
  - `27cf8bc` Add design tokens, typography and motion primitives
  - `9419020` Add trilingual routing for en, ar and ckb with next-intl
  - `ed44260` Scaffold Next.js 16 project… (this is `main`)
- **Uncommitted:** none. HANDOFF.md was committed on `feat/home-page` after it was written.
- **PR #1:** draft, assigned to M7tech. No CI workflows exist in the repo (no `.github/`).

## 22. Completed Work

- [x] Research: website and profile audit, with conflicts resolved with the owner (`content-audit.md`)
- [x] Next.js 16 + TypeScript + Tailwind 4 + Motion + next-intl project initialised
- [x] Multilingual routing (`/en`, `/ar`, `/ckb`) with proxy redirects
- [x] English locale (LTR)
- [x] Arabic locale (RTL)
- [x] Kurdish Sorani locale (RTL), pending native review
- [x] Message catalogues with key parity across 3 languages
- [x] Design tokens, fonts (Sorani glyph coverage verified) and RTL foundation with logical properties
- [x] Logo and partner logo assets (SVG)
- [x] Header with desktop nav, language switcher and mobile menu
- [x] Footer
- [x] Home page, all 9 sections
- [x] Motion primitives with reduced-motion support
- [x] Interim placeholder pages (noindex) and a localized 404
- [x] SEO: metadata, canonical, hreflang + x-default, OG, sitemap, robots, Organization JSON-LD, favicon
- [x] README with Coolify notes, plus `.env.example`
- [x] Lint, typecheck and build pass from a clean clone
- [x] Playwright QA across 3 locales × 6 widths: 0 overflow, 0 console errors, 0 failed requests, 0 broken images
- [x] Visual review fixes: Arabic heading leading, header logo size, reduced-motion visuals, map labels, Sorani wording
- [x] Pushed `main` + `feat/home-page`; draft PR #1 opened

## 23. Work Currently in Progress

**Owner request (MOhammed, 2026-10-04 14:19):**

> "the main slides should be 3 to 4 shows our strong history and brands. all should be multipage not single page website. you should add solutions, water pipes > Polo UV, ecosan, ... Grey water > PVC > Boroug / Silent GF Silenta ... Water heater > Aquahot, Saudi Ceramic"

**State:** research only. **No code has been written for this request yet.** Product facts were gathered from the profile (`ATLASProfile.txt`, pages 7–19) and from the old site's Poloplast agency page (`https://atlasplast.iq/wp-json/wp/v2/pages/3946`).

**Intended result:**

1. **Hero slider** (3–4 slides) replacing the single hero in `src/components/sections/Hero.tsx`. Suggested slides, all from confirmed facts:
   - Since 1975: five decades.
   - 23 international brands, as a logo slide.
   - Exclusive agencies: Bänninger in central and southern Iraq, plus the European and Turkish manufacturers.
   - Six months of stock and nationwide reach.

   Requirements:
   - Accessible carousel: prev/next buttons, slide indicators, a pause control, and no autoplay under reduced motion.
   - Pause on hover/focus, `aria-roledescription="carousel"`, and RTL-aware direction.
   - No photography until the owner supplies it; keep the technical-drawing language.
2. **Rename "Products" to "Solutions"**: nav key, `/solutions` index and `/solutions/[slug]` pages. Update the Home `ProductIndex` links, the hero CTA, the sitemap and `pagePaths`. Proposed solutions and their sourced product lines:
   - **Water supply pipes:**
     - Poloplast: POLO-POLYMUTAN (PP-R 80 hot/cold), POLO-ECOSAN (PP-R, corrosion-free drinking water), POLO-UV (UV-resistant ML5 fibre pipe with PP-R fittings, for exposed installs and irrigation) and POLO-POLYMUTAN ML5 (5-layer PP-R 80 / HPCE / PP-RCT). Source: old site, Poloplast page.
     - Polymelt: Polymutan PP-R/PP-RCT (Ø20–110, PN10–25) and Polymelt UV (Ø20–110, SR7, black UV layer).
     - GF Aquasystem (Ø20–200, PN10–25).
     - Aquapa PP-R (Ø20–110).
     - Polo EGY PP-R (Ø20–110).
     - Bänninger PP-R (Ø20–110).
   - **Drainage and grey water:**
     - Boroug UPVC (Ø25–160, white, PVC cement).
     - GF Silenta Premium (Ø58–200, 7 dB(A)) and Silenta 3A (Ø40–200, 17 dB(A)).
     - Poloplast Polo-Kal NG (Ø32–200, 18 dB(A)) and Polo-Kal 3S (Ø75–160, 12 dB(A)).
     - Aquapa Aqua Silent PP (Ø50–160, 22 dB(A)).
     - Ostendorf Skolan Safe (Ø58–200, 17 dB(A)), HT Safe (Ø32–160) and KG-System (Ø110–500, SN4/8/10).
   - **Water heaters:** Saudi Ceramics **Aquahot**.
     - 10–300 L, vertical and horizontal, enamelled, two-valve 8.5 bar, Italian-made electrical components.
     - Standards: SASO / IEC 60335-2-21.
     - Logo file: `public/brands/aquahot.svg`.
   - **Further solutions** from the existing 7 families, specs in the profile:
     - Infrastructure: PE100 / U-PVC from Pimtaş, Turan Borfit, GF PE100.
     - Sanitaryware and cisterns: Saudi Ceramics Oryx, QuarterBath, WISA/Fluidmaster.
     - Pumps: DAB.
     - Faucets and valves: KAS, Shield, Guarri.
     - Installation tools: Candan, Turan Borfit welding, Asçelik clamps, Guarri chemicals.
3. **Multipage:** replace the placeholders with real Brands (index + `/brands/[slug]`), Projects, About (history, services, community; vision/mission pending), Locations (offices with phones and addresses, warehouses, regional offices, map) and Contact (phones, WhatsApp, email, hours, offices; a form needs a backend decision).

**Files to touch:**
- `src/components/sections/Hero.tsx` (+ a new client `HeroSlider`)
- `src/lib/nav.ts`
- `src/app/[locale]/[section]/page.tsx` (shrink or remove as real pages land)
- new `src/app/[locale]/solutions/…`, `brands/…`, etc.
- new `src/content/solutions.ts`
- `messages/*.json` (all three)
- `src/app/sitemap.ts`
- `src/components/sections/ProductIndex.tsx`

**Defaults chosen (tell the owner):**
- "Grey water" is presented as **"Drainage and grey water"**.
- Spec values come verbatim from the profile.
- Solutions become the primary nav item in place of Products.

## 24. Remaining Tasks

**Critical (blocking production)**
- Build the real pages, replacing the placeholders (Solutions, Brands, Projects, About, Locations, Contact). See §23.
- Owner review and merge of PR #1, then point Coolify at `main`.
- Native-speaker review of the Sorani (and Arabic) copy.

**High priority**
- Hero slider, 3–4 slides (§23).
- Rename Products to Solutions across nav, Home, sitemap and CTAs.
- Resolve "23 brands" vs the 21 shown (§9, REQUIRES REVIEW).
- Original photography from the owner, plus an image strategy (hero, projects, warehouses).
- Contact page: decide on a form (needs a backend or email service via env vars) vs direct contact links.

**Medium priority**
- Vision/mission combined statement for About, to be approved by the owner.
- OG image, per-page metadata, sitemap entries, LocalBusiness JSON-LD for branches.
- Focus trap for the mobile menu.
- Add `@playwright/test` and commit the QA scripts (overflow, console, broken images, lang/dir per locale × width).
- Footer: add warehouses and regional offices, and a Solutions link.
- Arabic/Kurdish spellings of client names, if the owner supplies them.

**Polish**
- Brand logo optical sizing (some marks such as Bänninger read small).
- `og:locale` region codes.
- Lighthouse and axe audits.

## 25. Known Problems / Bugs

1. **Mobile menu has no focus trap**
   - Affects: `SiteHeader.tsx`.
   - Tab can move focus behind the overlay.
   - Next step: trap focus inside `#mobile-menu` and return focus to the burger on close.
2. **"23 brands" figure vs 21 logos**
   - Affects: `src/content/company.ts` (`facts`) and the Home hero figures.
   - Cause: Calpeda and Vitra were removed.
   - Needs the owner's answer; do not change the number on a guess.
3. **Placeholders still linked from Home**
   - Affects: the hero CTA and the ProductIndex rows go to `/products`, which is a placeholder.
   - These resolve when Solutions ships.
4. **QA tooling not in the repo**
   - Playwright was run from a global install with scripts in a temp folder.
   - Next step: add the tooling as a devDependency.
5. **`[section]` catch-all route**
   - `src/app/[locale]/[section]/page.tsx` serves every placeholder.
   - When adding real routes such as `src/app/[locale]/brands/page.tsx`, **remove that section from `pagePaths`/`sections`**, or the two routes will conflict.

No visual or RTL bugs are open from the last QA pass.

## 26. Decisions That Must Be Preserved

- **Content hierarchy:** owner confirmations > ATLASProfile > atlasplast.iq. Every fact records its source in `src/content`.
- **Locales and routing:** en/ar/ckb with an always-present prefix; the ckb code is used for Sorani. One component tree serves all languages, and direction comes from `dir` plus logical properties. There are no separate RTL layouts.
- **Fonts:**
  - IBM Plex Sans Arabic for ar and ckb. It is one of the few families verified to render ڕ ڵ ێ ۆ ە ڤ; Cairo, Tajawal, Rubik, Alexandria and Readex fail Sorani.
  - Archivo + Plex for English.
- **Colours:** Atlas Blue is the text-safe accent. Atlas Sky is decorative only. Navy is derived from the brand blue.
- **Never mirrored:** the logo, the map and the technical drawings.
- **Design language:** square, editorial, hairline rules, technical drawings, lists over cards. The Home page is the benchmark for every new page; reuse `SectionHead`, `ButtonLink`, `TextLink` and `container-page`/`section-space`.
- **Server Components by default.** Client components only for interaction and animation. `LazyMotion strict` with `m.*`.
- **Copy:** never hard-code UI copy; add keys to all three message files together.
- **Calpeda/Vitra:** not partners. **Hussein Raad / Hassan Al-Oreibi:** not published.
- **Wording:** "Since 1975" in copy; the logo artwork keeps "since 1990". "Hundreds of projects", not a number. Main phone 6779.
- **Deployment and git:** Coolify on a Node server with no Vercel dependencies. Work on feature branches with logical commits; `main` is production.

## 27. Things Claude Must NOT Do

- Do not invent AtlasPlast facts, figures, projects, certifications or people.
- Do not replace real company photography with AI-generated images, and do not present partner-factory photos as AtlasPlast's.
- Do not redesign the approved design system without a reason the owner agrees with.
- Do not create separate RTL layouts or components; use logical properties and `rtl:` only for transforms.
- Do not hard-code user-facing text; every string goes through `messages/*.json`.
- Do not introduce Vercel-only dependencies (`@vercel/*`, Edge Config, Vercel image loaders, etc.).
- Do not hard-code secrets; only env var names belong in the repo.
- Do not change working components for stylistic preference.
- Do not hide layout bugs with ad-hoc CSS patches. Fix the cause; the Arabic leading bug, for example, was a specificity issue.
- Do not remove features or routes without checking where they are used (`pagePaths` drives the sitemap and placeholders).
- Do not do large refactors before understanding dependencies.
- Do not use `next/link` for internal links (use `@/i18n/navigation`), and do not use `motion.*` (strict LazyMotion requires `m.*`).
- Do not split headings inside words (it breaks Arabic and Sorani letter joining).
- Do not put Arabic-script text in Plex Mono without a font override.
- Do not edit the logo SVGs or recolour partner logos beyond the grayscale hover treatment.
- Do not publish the REQUIRES REVIEW items in §9.
- Do not trust Next.js API knowledge from training data. Read `node_modules/next/dist/docs/` (AGENTS.md); Next 16 uses `proxy.ts`, async `params` and the generated global `PageProps`/`LayoutProps` types.

## 28. Files That Are Especially Important

| File | Controls |
|---|---|
| `AGENTS.md` / `CLAUDE.md` | Agent rules for this Next.js version |
| `package.json` | scripts, versions, engines |
| `next.config.ts` | next-intl plugin, image formats |
| `src/proxy.ts` | locale detection and redirects |
| `src/i18n/routing.ts` | locales, default, direction helper |
| `src/i18n/navigation.ts`, `src/i18n/request.ts` | localized links; message loading |
| `src/lib/nav.ts` | primary nav, contact link, `pagePaths` (sitemap and placeholders) |
| `src/lib/site.ts` | `SITE_URL`, canonical and hreflang helpers |
| `src/lib/fonts.ts` | font loading and CSS variables |
| `src/app/globals.css` | design tokens, Arabic-script rules, utilities |
| `src/app/[locale]/layout.tsx` | html lang/dir, providers, header/footer, skip link, base metadata |
| `src/app/[locale]/page.tsx` | Home composition and JSON-LD |
| `src/app/[locale]/[section]/page.tsx` | placeholder pages |
| `messages/en.json`, `ar.json`, `ckb.json` | all UI copy |
| `src/content/company.ts` | phones, email, offices, warehouses, regional offices, figures |
| `src/content/brands.ts` | brands, logos, countries, product families |
| `src/content/projects.ts`, `timeline.ts`, `iraq-map.ts` | projects and clients, milestones, map geometry |
| `src/components/layout/SiteHeader.tsx`, `SiteFooter.tsx` | site chrome |
| `src/components/sections/Hero.tsx` | the next file to change (slider) |
| `/mnt/project-files/atlas/research/content-audit.md` | source facts and conflicts (outside the repo) |

## 29. Recommended Next Step

Build the Solutions structure and the hero slider requested on 2026-10-04:
- Create `src/content/solutions.ts` from the sourced product lines in §23.
- Add `/[locale]/solutions` and `/[locale]/solutions/[slug]`, starting with water supply pipes, drainage and grey water, and water heaters.
- Rename Products to Solutions in the nav, Home and sitemap.
- Replace the hero with an accessible 3–4 slide slider about history and brands.
- Test in EN/AR/CKB at 375 and 1440 px.

## 30. New Session Instructions

Before making any changes:

1. Read CLAUDE.md.
2. Read HANDOFF.md completely.
3. Inspect git status.
4. Inspect relevant existing files.
5. Do not assume HANDOFF.md is more recent than the repository.
6. Treat the current repository code as the final source of truth.
7. Reconcile any difference between HANDOFF.md and the code before editing.
8. Continue from the "Recommended Next Step" unless the user gives a different instruction.
