# ATLASPLAST WEBSITE — PROJECT HANDOFF

Last updated: 2026-10-04. Written from the repository state at commit `85a05c5` on branch `feat/home-page`. This revision adds the Brands, About, Locations, Contact and Projects pages: every section in the navigation is now a real page.

---

## 1. Project Overview

- **What:** a new corporate website for **AtlasPlast**, replacing the current WordPress site at https://atlasplast.iq/.
- **Company:** AtlasPlast. Legal/trading name **Ufuq Al-Atlas Ltd.** (UFUQ ALATLAS LTD. – Commercial Agencies). It is an Iraqi distributor and exclusive agent for international pipe-system, drainage, sanitaryware, pump, faucet and installation-tool manufacturers. It has been in business since 1975 and opened its first showroom in 1990.
- **Purpose:** present AtlasPlast as an established, technically capable national supplier. It should help contractors, installers and project owners find solutions and brands, see projects, and contact sales.
- **Stage:**
  - The **Home page is built** in three languages and is the approved visual benchmark. Its hero is now a four-slide carousel, as the owner asked on 2026-10-04.
  - **Solutions is built:** an index plus 8 solution pages, in three languages.
  - **Brands** (index plus 21 brand pages), **About**, **Locations**, **Contact** and **Projects** are built. The interim placeholder route has been removed.
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
            ├── solutions/        index + [slug] (8 pages)
            ├── brands/           index + [slug] (21 pages)
            └── about/, locations/, contact/, projects/   single pages
```

There is no `.claude/` directory in the repo.

**Architectural decisions:**
- **Routing:** every route lives under `src/app/[locale]/`. `localePrefix: "always"`, so `/` redirects (307) to `/en` (or to the visitor's preferred locale).
- **Static generation:**
  - `generateStaticParams` builds every locale.
  - The `[slug]` routes use `dynamicParams = false`, so unknown slugs return 404.
  - The build currently produces 113 static pages.
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
- **Translations:** there is one JSON file per locale, with identical key structure (parity was verified). The namespaces are `Meta`, `Common`, `Nav`, `Footer`, `Home.{hero,facts,statement,products,brands,projects,timeline,services,presence,contact}`, `Solutions`, `Brands.{notes,index,detail,labels}`, `About`, `Locations`, `Contact`, `ProjectsPage`, `Projects.sectors`, `Countries` and `NotFound`. The `Placeholder` namespace was removed.

## 4. Current Sitemap

| Route | Status | Notes |
|---|---|---|
| `/` | DONE | redirects to `/en` (next-intl proxy) |
| `/en`, `/ar`, `/ckb` (Home) | DONE | approved benchmark, with a four-slide hero |
| `/{locale}/solutions` | DONE | index of the 8 solutions |
| `/{locale}/solutions/{slug}` | DONE | water-supply, drainage, water-heaters, infrastructure, sanitaryware, pumps, faucets-valves, installation-tools |
| `/{locale}/products` | REMOVED | returns 404; replaced by Solutions |
| `/{locale}/brands` | DONE | logo grid with country and product-line count per brand |
| `/{locale}/brands/{slug}` | DONE | 21 brands; product lines grouped by solution, or "range on request" for FV-Plast, Peštan and Alvit |
| `/{locale}/projects` | DONE | featured projects grouped by sector, plus the contractor list |
| `/{locale}/about` | DONE | intro, figures, statement, full timeline, services; vision/mission pending owner approval |
| `/{locale}/locations` | DONE | map, offices, warehouses, regional offices, branch phone lines |
| `/{locale}/contact` | DONE | main line, WhatsApp, projects line, email, social, branch lines; no form yet |
| `/{locale}/links` | DONE | unlisted روابط page (old site's `/روابط/`): main line, WhatsApp, email, social, branch maps, craftsmen app. In no menu or sitemap, `noindex`. `/روابط` and `/ar/روابط` redirect (308) to `/ar/links` via `redirects()` in `next.config.ts`, with percent-encoded sources because Next matches the encoded path |
| `/{locale}/<unknown>` | DONE | localized 404 (`not-found.tsx`) |
| `/sitemap.xml`, `/robots.txt`, `/icon.svg` | DONE | sitemap lists all 36 public pages in every locale (108 URLs) |

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
- Inner-page h1 (`PageHeader`): `clamp(2.4rem, 6vw, 5.25rem)`.
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
| Projects.sectors, Brands.notes, Countries | complete | complete | complete |
| Content data (offices, warehouses, regional offices, timeline, project names) | complete | complete | complete |
| Brands, About, Locations, Contact, Projects, NotFound | complete | complete | complete |
| Solutions (index, 8 solutions, 41 product lines, spec labels) and hero slides | complete | complete | complete, needs native review |
| Brands / Projects / About / Locations / Contact pages | **not written** | **not written** | **not written** |

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

1. **Hero carousel**: `sections/Hero.tsx` (server) composes the slides; `sections/HeroCarousel.tsx` (client) runs them.
   - The navy band has four slides:
     1. **Solutions**: the h1 (animated by `LineRise`), the lead, the Explore solutions (`/solutions`) and Contact sales buttons, and the `PipeSection` drawing.
     2. **History**: "Five decades supplying the builders of Iraq", with a `YearScale` ruler from 1975 to 2025 marking the milestones. The button goes to `/about`.
     3. **Brands**: lists the manufacturer countries, with a 3×3 grid of white-inverted partner logos. The button goes to `/brands`.
     4. **Reach**: "Six months of national demand, held in stock", with `IraqMap tone="dark"`. The button goes to `/locations`.
   - The tab bar has numbered tabs with labels (only the active label shows on phones), plus prev, next and pause controls.
   - Each slide's visual is hidden below `md` to keep the hero short on phones.
   - Below the carousel is a `dl` of 4 figures.
2. **Statement**: `Statement.tsx`.
3. **Solutions**: `SolutionIndex.tsx` (SectionHead + `solutions/SolutionList.tsx`). It lists the 8 solutions, each linking to its page.
4. **Brands**: `BrandWall.tsx`, 21 logos.
5. **Projects**: `ProjectIndex.tsx`.
6. **Timeline**: `Timeline.tsx` with `ScrollRule`.
7. **Service model**: `ServiceModel.tsx`.
8. **Presence**: `Presence.tsx` + `IraqMap`.
9. **Contact band**: `ContactBand.tsx`.

**Solutions pages** (new):
- `/solutions` has a `PageHeader` (navy, with breadcrumb and h1) and the pipe drawing, then a `SolutionList` with h2 rows and the `ContactBand`.
- `/solutions/[slug]` has:
  - a `PageHeader` with the "01 / 08" eyebrow, intro, line count and brand names, plus a large `SectionGlyph`
  - product line rows: brand logo (or the Aquahot mark), name, description, and a spec `dl` in mono wrapped in `<Ltr>`
  - a navy "Need help choosing?" band with the main line
  - an "Other solutions" list
  - `BreadcrumbList` JSON-LD

**Responsive:** sections stack below `md`/`lg`. QA passed on Home and the Solutions pages at 375–1920px in all 3 locales.

## 11. Header and Navigation

`src/components/layout/SiteHeader.tsx` (client).

- **Bar:** sticky, solid navy, z-40. There is no transparent state and no scroll-based change. It is `h-16`, or `md:h-20`.
- **Logo:** the white lockup, sized by height (`!h-11 md:!h-14`, fixed this session; it previously overflowed the bar). It links to `/`.
- **Desktop (≥ lg):**
  - Nav items: Solutions, Brands, Projects, About, Locations.
  - An underline grows on hover and on `aria-current="page"`. Its origin flips in RTL.
  - On the end side: `LanguageSwitcher` (English / العربية / کوردی) and a bordered Contact button.
- **Mobile (< lg):**
  - A two-line burger opens a full-screen navy menu under the bar.
  - The menu has large links with arrows (staggered fade-up), plus the language switcher.
  - Escape closes it; page scroll is locked while open; links close the menu.
- **Known gaps:**
  - No focus trap inside the open mobile menu (Tab can leave it).
- **Nav items:** Solutions, Brands, Projects, About, Locations. Products was renamed to Solutions on 2026-10-04.

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
| `HeroCarousel` | `sections/HeroCarousel.tsx` | Tabbed hero carousel (APG pattern) | client; props `slides {id, tab, content}[]`, `labels`, `interval` (default 8000). Autoplay is driven by the CSS `hero-progress` keyframes on the active tab rule (`onAnimationEnd` advances). It pauses on hover, focus and the pause button, and has no autoplay under reduced motion. Arrow keys follow the reading direction. Slides share one grid cell |
| `PageHeader` | `ui/PageHeader.tsx` | Navy opening band for inner pages: breadcrumb, eyebrow, h1, intro, optional aside and children | use it on every new inner page |
| `SolutionList` | `solutions/SolutionList.tsx` | Rule-separated solution rows linking to `/solutions/[slug]` | props `only?` (slugs), `headingLevel`; also exports `solutionBrands()` |
| `PipeSection` | `sections/PipeSection.tsx` | Hero technical drawing | client; renders finished when reduced motion is on |
| `SectionGlyph` | `sections/SectionGlyph.tsx` | Pipe cross-section marker for each product family | prop `wall` (ratio) |
| `IraqMap` | `sections/IraqMap.tsx` | Map with office and warehouse markers | props `locale, label, officeCities, warehouseCities, cityNames, tone` (`light`/`dark`), `className`; never mirrored; `labelSide` puts Zakho/Najaf/Basra labels to the west |
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
- **Hero carousel:**
  - Slides crossfade over 0.6s (opacity only, no sliding).
  - The active tab's 3px rule fills over 8s via the CSS keyframes `hero-progress`, defined in `globals.css`. When it ends, the next slide shows.
  - Under reduced motion there is no autoplay and no pause button; the rule shows as full.
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
  - `aquahot.svg` is used on the Water heaters solution page as the Aquahot line's mark.
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

Full SEO pass done 2026-10-04 at the owner's request ("make sure SEO is the best for the website and all pages").

**Metadata** (`pageMetadata()` in `src/lib/site.ts`, used by every page):
- Keyword-led titles per page in all three languages (`Meta.*Title` keys), e.g. "Water supply pipes in Iraq | AtlasPlast", "Polymelt in Iraq | AtlasPlast". Home uses an absolute title.
- Descriptions are kept under about 160 characters. Solution pages use the solution's short text plus "Supplied across Iraq by AtlasPlast". Brand pages name the product lines supplied, or "ask our sales team" when there are none.
- Canonical URL, hreflang for en/ar/ckb plus x-default → /en.
- Open Graph with `og:locale` en_US / ar_IQ / ckb_IQ and the other two as `og:locale:alternate`, plus the share image `/og.png` (1200×630, localized alt). Twitter `summary_large_image`.
- The main line in titles and descriptions comes from `company.mainPhone` via `{phone}`, so it updates in one place.

**Structured data** (`src/lib/structured-data.ts`, `src/components/seo/JsonLd.tsx`, one `@graph` per page):
- Home: `Organization` (@id `SITE_URL/#organization`, logo, founding 1975, contact points, sameAs) and `WebSite`, plus `WebPage`.
- Every inner page: a typed page node (`CollectionPage`, `AboutPage`, `ContactPage` or `WebPage`) and `BreadcrumbList`.
- Solution and brand pages: an `ItemList` of product lines. This is deliberately not `Product`, because there are no prices or reviews and Product without them raises Search Console errors.
- Locations: one `LocalBusiness` per Iraqi office (city, phone, parentOrganization).
- Contact: Organization `contactPoint`s (main line, projects line, WhatsApp).

**Other:**
- `src/app/sitemap.ts` lists all 36 pages × 3 locales (108 URLs) with hreflang alternates and a build-time `lastModified`.
- `src/app/robots.ts` allows all and points to the sitemap. The 404 page is noindex.
- `src/app/manifest.ts`, `src/app/icon.svg` and `src/app/apple-icon.png`. `viewport.themeColor` is `#14284a`.
- The share image is rendered by `scripts/og-image.js` (needs the production server on :3600 for fonts). Re-run it if the branding changes.

**Verified:** across all 108 sitemap URLs there are no duplicate titles, every canonical matches its URL, every JSON-LD block parses, and each page has exactly one h1. Two descriptions (Arabic and Sorani water supply) run slightly over 160 characters, which is acceptable.

**Still open:** submit the sitemap in Google Search Console and Bing Webmaster Tools after the domain goes live (this needs the owner's account), and add original photography for richer share images.

### Brand technical documents

- Brand pages show a **Technical documents** section when `documents` is set on the brand in `src/content/brands.ts` (component `src/components/brands/BrandDocuments.tsx`).
- Owner decision 2026-10-04: the files come from the **manufacturers' official websites** and must be **in English**. They are linked, not re-hosted (the sandbox cannot download from those domains). Each has `source: "manufacturer:2026-10-04"`.
- 14 brands have documents. KAS = kas.com.tr, confirmed by the owner 2026-10-04; its PP-R line (KAS PPR-C) is in Water supply. None were found for WISA (site timed out), Turan Borfit, Guarri, Asçelik, Polo Egypt, Shield and Alvit (Turkish only).
- Unverified: the Bänninger Range of Products PDF (34 MB, not opened). Saudi Ceramics links to its catalogue page; the files themselves are on Google Drive and were not opened.
- To self-host a file instead, put it under `public/docs/<brand>/` and use `href: "/docs/<brand>/<file>.pdf"`.

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

**Lighthouse 12 (2026-10-04, mobile, simulated slow 4G, standalone server):**
- `/en`: Performance 87, Accessibility 100, Best Practices 100, SEO 92. LCP 4.0 s, TBT 60 ms, CLS 0.
- `/ar/brands/polymelt`: Performance 89, Accessibility 100, Best Practices 100, SEO 92. LCP 3.7 s.
- The SEO 92 is only the `canonical` audit, because the test ran on localhost while canonicals point to `https://atlasplast.iq`. It passes on the real domain.
- LCP is the hero lead paragraph, delayed by web-font loading (all locales share one layout, so Latin and Arabic fonts are both preloaded). Already applied: mono labels are not preloaded, and the unused Arabic 700 weight was dropped. A further gain would mean splitting the font loading per script.

## 20. Coolify Deployment

- **Repository:** https://github.com/M7tech/website_pipes
- **Production branch:** `main`, which holds only the scaffold. The site is on `feat/home-page` in **draft PR #1** (https://github.com/M7tech/website_pipes/pull/1). Deploy `main` only after the PR is merged.
- **Build method: Dockerfile** (repo root). It is multi-stage on `node:22-alpine`, uses `output: "standalone"`, runs as a non-root user, and has a built-in `HEALTHCHECK` on `/en`. `.dockerignore` keeps tests, `.git` and env files out of the image.
  - The image was **not built in this sandbox** (no Docker daemon). The same standalone server (`node .next/standalone/server.js` with `public` and `.next/static` copied in) was run locally, and all 121 Playwright checks passed against it.
- **Build argument:** `NEXT_PUBLIC_SITE_URL` must be set as a build-time variable, because it is inlined during the build. It defaults to `https://atlasplast.iq`.
- **Port:** 3000. **Health check:** host `127.0.0.1` (the server is IPv4 only and `localhost` may resolve to `::1`), port 3000, path `/en` (`/` returns a 307 redirect), return code 200. The image includes `curl` for Coolify's check.
- **Headers** (`next.config.ts`):
  - `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN` and `Permissions-Policy` on every response.
  - A one-week cache on `/brand/*` and `/brands/*` logos.
  - HSTS is left to Coolify's proxy.
- **Without Docker:** `npm ci && npm run build && npm run start` still works (`next start` runs fine with standalone output).
- **Domain:** point it at the Coolify app and enable HTTPS there.
- No secrets are needed or committed. `.env*` is gitignored, except `.env.example`.

## 21. Git Status

- **Current branch:** `feat/home-page`, which tracks `origin/feat/home-page`.
- **Commits** (newest first):
  - `c7d9f17` Add Solutions pages and a four-slide hero
  - `6f84d2e` Add project handoff for future sessions (HANDOFF.md)
  - `14bf432` Add sitemap, robots and app icon
  - `0f613e5` Build the Home page
  - `2927911` Add site header, footer and locale layout
  - `27cf8bc` Add design tokens, typography and motion primitives
  - `9419020` Add trilingual routing for en, ar and ckb with next-intl
  - `ed44260` Scaffold Next.js 16 project… (this is `main`)
- **Uncommitted:** none, apart from this HANDOFF.md update, which is committed right after it is written.
- **PR #1:** draft, assigned to M7tech. No CI workflows exist in the repo (no `.github/`). Run `git log --oneline` for exact hashes.

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
- [x] Localized 404
- [x] Brands index and 21 brand pages
- [x] About, Locations, Contact and Projects pages
- [x] SEO: metadata, canonical, hreflang + x-default, OG, sitemap, robots, Organization JSON-LD, favicon
- [x] README with Coolify notes, plus `.env.example`
- [x] Lint, typecheck and build pass from a clean clone
- [x] Playwright QA across 3 locales × 6 widths: 0 overflow, 0 console errors, 0 failed requests, 0 broken images
- [x] Visual review fixes: Arabic heading leading, header logo size, reduced-motion visuals, map labels, Sorani wording
- [x] Pushed `main` + `feat/home-page`; draft PR #1 opened
- [x] HANDOFF.md
- [x] Unlisted روابط links page (`/{locale}/links`) and exact office map pins from the old site
- [x] Products renamed to Solutions (nav, Home, CTAs, sitemap); `/products` removed
- [x] Solutions data (`src/content/solutions.ts`): 8 solutions and 41 product lines, every line sourced
- [x] `/solutions` index and 8 `/solutions/[slug]` pages in en/ar/ckb, with breadcrumb JSON-LD
- [x] Four-slide accessible hero carousel (solutions, history, brands, reach)
- [x] Reusable `PageHeader` and `pageMetadata()` for inner pages
- [x] QA on Home and Solutions pages: 3 locales × 6 widths, 0 overflow, errors or broken images

## 23. Work Currently in Progress

**Owner request (MOhammed, 2026-10-04 14:19):**

> "the main slides should be 3 to 4 shows our strong history and brands. all should be multipage not single page website. you should add solutions, water pipes > Polo UV, ecosan, ... Grey water > PVC > Boroug / Silent GF Silenta ... Water heater > Aquahot, Saudi Ceramic"

**Done** (commit `c7d9f17`): the hero slides, the Solutions index and the 8 solution pages (§10).

**Done** (commits `4930069`, `85a05c5`): the rest of the multipage site, built in this order:
1. **Brands:** `/brands` index (the BrandWall plus country grouping) and `/brands/[slug]`. Each brand page shows its product lines from `solutions.ts` (filter by `line.brand`) and the solutions they belong to. Manufacturer facts such as founding years are the partner's, so use them sparingly (§9).
2. **About:** history (`timeline.ts`), services and community (the ServiceModel copy). Vision/mission is still pending the owner's approval, so leave it out until then.
3. **Locations:** offices with phones and addresses (`company.ts`), warehouses, regional offices and the `IraqMap`.
4. **Contact:** phones, WhatsApp, email, hours and offices. A form needs a backend decision, so use direct links until then.
5. **Projects:** featured projects and clients (`projects.ts`).

For any future route:
- Create `src/app/[locale]/<section>/page.tsx` using `PageHeader` and `pageMetadata()`.
- Add it to `paths` in `src/app/sitemap.ts`.
- Add its copy to all three message files.
- Run QA.

**Defaults chosen for Solutions (told to the owner):**
- "Grey water" is presented as "Drainage and grey water".
- Spec values are verbatim from the profile.
- Generic product names are translated; trademarked names stay in Latin script.

## 24. Remaining Tasks

**Critical (blocking production)**
- Owner review and merge of PR #1, then point Coolify at `main`.
- Native-speaker review of the Sorani (and Arabic) copy.

**High priority**
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
3. **QA tooling not in the repo**
   - Playwright was run from a global install with scripts in a temp folder.
   - Next step: add the tooling as a devDependency.

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
- Do not remove features or routes without checking where they are used (`sitemap.ts` lists indexable pages).
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
| `src/lib/nav.ts` | primary nav, contact link, language names |
| `src/lib/site.ts` | `SITE_URL`, canonical and hreflang helpers |
| `src/lib/fonts.ts` | font loading and CSS variables |
| `src/app/globals.css` | design tokens, Arabic-script rules, utilities |
| `src/app/[locale]/layout.tsx` | html lang/dir, providers, header/footer, skip link, base metadata |
| `src/app/[locale]/page.tsx` | Home composition and JSON-LD |
| `messages/en.json`, `ar.json`, `ckb.json` | all UI copy |
| `src/content/company.ts` | phones, email, offices, warehouses, regional offices, figures |
| `src/content/brands.ts` | brands, logos, countries, product families |
| `src/content/projects.ts`, `timeline.ts`, `iraq-map.ts` | projects and clients, milestones, map geometry |
| `src/components/layout/SiteHeader.tsx`, `SiteFooter.tsx` | site chrome |
| `src/components/sections/Hero.tsx`, `HeroCarousel.tsx` | Home hero slides |
| `src/content/solutions.ts` | solutions, product lines, specs, sources |
| `src/app/[locale]/solutions/` | Solutions index and detail pages; the pattern for new inner pages |
| `src/components/ui/PageHeader.tsx`, `src/lib/site.ts` (`pageMetadata`) | inner-page header and metadata |
| `src/app/[locale]/brands/`, `src/components/brands/BrandGrid.tsx` | Brands index and brand pages; shared logo grid |
| `src/components/solutions/ProductLineRow.tsx`, `EnquiryBand.tsx` | product-line row and sales band shared by solution and brand pages |
| `src/components/company/OfficeLines.tsx` | branch phone lines (Locations, Contact) |
| `src/app/[locale]/about/`, `locations/`, `contact/`, `projects/` | the remaining inner pages |
| `/mnt/project-files/atlas/research/content-audit.md` | source facts and conflicts (outside the repo) |

## 29. Recommended Next Step

All navigation sections are now real pages. The next task that needs no owner input:
- Add a focus trap to the mobile menu (§25.1).
- Add `@playwright/test` as a devDependency and commit the QA script (overflow, console errors, failed requests, broken images, one h1, per locale × width).

Owner inputs still open: the "23 brands" figure, the vision/mission text, a contact form decision, photography, and merging PR #1.

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

## 21. Photos, maps and water motion (2026-10-04)

- **Photos:** the 10 manufacturer-site photos from the company profile are in `public/images/brands/<slug>.jpg` (`photos` map in `src/content/brands.ts`); the p21 landmark photo is `public/images/hero/landmark.jpg`. They appear as brand page header backdrops, a flowing photo strip on Home and Brands, and hero slide backdrops. No product or project photography exists yet: add files under `public/images/` and reference them from content.
- **Maps:** every office has `mapQuery` (street and district from the profile) and an optional `mapUrl` for an exact Google Maps place. Since 2026-10-05 all six offices use `https://maps.google.com/?cid=…`. Camp Sara, Al-Shaab, Najaf, Erbil and Duhok are the places pinned on the old site's روابط page (the old "Headquarter" pin, in Al-Shaab, went to Al-Shaab). Basra is the "Atlas plast" place the owner sent (the old page showed the Najaf pin under Basra). The craftsmen app links (`craftsmenApp` in `company.ts`) are the store pages the old goo.gl/apple.co links led to; both stores now list the app as SAWA. Office lists, branch cards and the Iraq map dots link to Google Maps (opens the app on phones).
- **Terms (owner, Arabic):** خزانات الدفن / طراد, never سيفونات; حرفيين, never فنيين. A test guards this.
- **Water motion** (CSS in `globals.css`, all off with reduced motion): wave edge on dark bands (`components/water/Waves.tsx`), caustic light, Ken Burns photos, ripples on map offices, liquid-fill buttons, water progress bar in the header (`ScrollWater.tsx`).
- `SectionWipe` now observes an unclipped wrapper: Chrome reports a fully clipped element as not intersecting, which had kept the Iraq map hidden.

## 22. Icons, product photos and owner corrections (2026-10-04, later)

- **Product photos** come from the company profile PDF (`pdfimages`, alpha masks flattened on white): `public/images/solutions/<slug>-<n>.jpg`, listed per solution in `solutions.ts` (`photos`, with the brand when the profile page names it). Each solution header cross-fades them as its background (`HeaderSlides`, via `PageHeader` `slides`), like the home hero. AtlasPlast's own warehouse photos (profile p23) are `public/images/hero/warehouse-*.jpg`, used on the hero "reach" slide and the About, Locations and Solutions headers. Profile photos are ~500 px wide; replace with originals when available.
- **Icons:** `components/ui/Icon.tsx` (line icons, decorative). Each solution has an `icon`; services, hero facts, contact lines, document kinds, presence headings and brand facts use them too. `SectionGlyph` was removed.
- **Owner corrections:** stock covers **nine** months (was six); KAS is supplied as **PPR only** (the PPR-C catalogue link and PPR-C specs were removed).

## 23. Old-site items carried over (2026-10-04, late)

Added from the old atlasplast.iq (verified in the content audit): sales department line +964 780 288 0009 (WhatsApp; also a ContactPoint), Friday pickup/shipping note, warehouses 24/7 and round-the-clock delivery, Georg Fischer galvanized malleable-iron fittings (EN 10242, water supply), Bänninger PP-R · PP-RCT (water supply) and PE · PVC-U Ø 8–1000 mm (infrastructure).

Still waiting on the owner: leadership team, testimonials (consent), NASSAR, the "up to 50 years" warranty, project photos. (Vision/mission, the fuller history and YouTube were added in §24.)

## 24. Galvanized fittings, vision and mission, history, Media (2026-10-05)

Owner request (MOhammed): galvanized fittings as their own solution under Georg Fischer, produced in Austria; vision and mission on About; the fuller history; a Media tab showing the YouTube channel's videos; YouTube in Follow us.

- **Galvanized fittings:** new solution `galvanized-fittings` (9 solutions now, icon `fitting`). The `gfMalleable` line moved out of water supply. `ProductLine.madeIn` (country code) shows a "Made in" row; GF's brand country stays CH. No product photo exists: the header uses the GF building from profile p8 (`photoSubjects.gfBuilding` alt). Replace with a real photo of the fittings when the owner sends one.
- **Vision, mission, values:** `components/sections/Purpose.tsx` on About, copy in `About.purpose`. The statements combine the old site's (water and sewage networks) with the profile's (sanitaryware, p6); the values are the profile's. Told to the owner as editable.
- **History:** `timeline.ts` milestones can carry `until` (a period, shown "1990–2003") and `detail` (About only). Home and the hero year scale use `keyMilestones`; About shows all (`<Timeline full />`). Added 1990–2003 sanctions years (State Company for Construction Materials Trading), 2006–2007 move to Sulaymaniyah, 2007 ARBAK partnership, 2008 return to Baghdad, 2009 Al-Amir showroom with FABCO. Source: the old AR About page as summarised in the content audit (verbatim page could not be re-read); owner approved adding them.
- **Media:** `/[locale]/media` (nav item after Projects, sitemap). `lib/youtube.ts` reads the channel's public feed (`youtube.com/feeds/videos.xml?channel_id=UCURwlrQZe8PnV7ZUzTme-AQ`, latest 15 uploads) with `next.revalidate` 3600, and the page has `revalidate = 3600`, so new uploads appear within the hour with no redeploy. If the feed is unreachable (as in the build sandbox) it falls back to the old site's video `xatuZC65KuM`. `VideoGallery` is click-to-load (thumbnail, then a youtube-nocookie embed). VideoObject JSON-LD only for feed items with title and date.
- **YouTube** is in `company.social` (`socialNames` shared by footer and contact page) and the organization `sameAs`.
- Tests: `/media` is in the template list; third-party YouTube requests and thumbnails are ignored by the request and broken-image checks (the sandbox cannot reach them).
