# ATLASPLAST WEBSITE — PROJECT HANDOFF

Last updated: 2026-10-05. Written from the repository state at commit `f43cc92` on branch `feat/home-page`. Latest changes: the tenth solution (ceramic and porcelain tiles), the redesigned Board and Contact pages, corrected Camp Sara and Al-Shaab numbers, the owner's Duhok pin, and optional full-channel listing on Media.

A copy of this file is kept at `/mnt/project-files/atlas/HANDOFF.md`. Keep the two identical.

---

## 1. Project Overview

- **What:** a new corporate website for **AtlasPlast**, replacing the current WordPress site at https://atlasplast.iq/.
- **Company:** AtlasPlast. Legal/trading name **Ufuq Al-Atlas Ltd.** (UFUQ ALATLAS LTD. – Commercial Agencies). It is an Iraqi distributor and exclusive agent for international pipe-system, drainage, sanitaryware, pump, faucet and installation-tool manufacturers. It has been in business since 1975 and opened its first showroom in 1990.
- **Purpose:** present AtlasPlast as an established, technically capable national supplier. It should help contractors, installers and project owners find solutions and brands, see projects, and contact sales.
- **Stage:** the full multipage site is built in three languages and runs on the preview domain **https://new.atlasplast.iq** (see §20).
  - Home (the approved visual benchmark, with a four-slide hero).
  - Solutions: an index plus **10** solution pages.
  - Brands: an index plus **22** brand pages.
  - Projects, Media, About (with a Board of Directors page), Locations and Contact.
  - An unlisted links page (روابط) that keeps the old site's address.
- **Not yet production:** the site lives on branch `feat/home-page` in draft PR #1. `main` still holds only the scaffold.
- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion for React, next-intl 4.
- **Deployment:** GitHub → Coolify → Linux VPS. No Vercel-specific features or dependencies.
- **Languages:**
  - English — `en` — LTR
  - Arabic — `ar` — RTL
  - Kurdish Sorani — `ckb` — RTL
- **Content sources:**
  - `ATLASProfile.pdf` (the "atlasprofile"), stored in the project's shared files at `/mnt/project-files/atlas/sources/`.
  - https://atlasplast.iq/
  - Explicit decisions by MOhammed (the owner) in the project chat.
- **Company facts must never be invented.** Every fact on the site must trace to one of these sources. Each record in `src/content/*.ts` carries a `source` field (`profile:pN`, `site:…`, `manufacturer:YYYY-MM-DD` or `confirmed:YYYY-MM-DD`).

## 2. Current Technology Stack

Versions from `package.json` / `npm ls --depth=0`:

| Package | Version | Use |
|---|---|---|
| next | 16.3.8 | App Router, Turbopack (default), `proxy.ts` (replaces middleware), static generation |
| react / react-dom | 19.2.8 | |
| typescript | 5.9.x | strict, path alias `@/*` → `src/*` |
| tailwindcss / @tailwindcss/postcss | 4.x | CSS-first config via `@theme` in `src/app/globals.css` (there is no tailwind.config file) |
| motion | 14.0.0 | imported from `motion/react`; LazyMotion + `m` components |
| next-intl | 4.14.9 | locale routing, messages, navigation |
| eslint / eslint-config-next | 9 / 16.3.8 | `npm run lint` |
| @playwright/test / playwright-core | 1.56.1 | site checks in `tests/site.spec.ts` |
| @axe-core/playwright | 4.13 | WCAG 2.1 AA checks inside the Playwright suite |

- **Fonts:** loaded with `next/font/google` in `src/lib/fonts.ts`, so they are self-hosted at build time with no runtime Google requests. The families are Inter (opsz axis, English display and text), IBM Plex Mono (400/500, spec values) and IBM Plex Sans Arabic (400/500/600).
- **No icon library:** icons are inline SVG in `src/components/ui/Icon.tsx`, `Arrow.tsx` and `PinIcon.tsx`.
- **Scripts** (`package.json`): `dev`, `build`, `start`, `lint`, `typecheck` (`next typegen && tsc --noEmit`) and `test:e2e` (`playwright test`).
- **Engines:** `node >= 20.9.0`. The Docker image uses Node 22.
- **Playwright in the cloud sandbox:** Chromium is preinstalled at `/opt/pw-browsers`; never run `playwright install` there. On a new machine run `npx playwright install chromium` once.

## 3. Project Architecture

```
.
├── AGENTS.md / CLAUDE.md     Next.js agent rules (CLAUDE.md just includes AGENTS.md). Read node_modules/next/dist/docs before using Next APIs: Next 16 differs from older versions.
├── HANDOFF.md                this file
├── README.md                 setup, checks, env vars, Coolify deploy steps, structure
├── Dockerfile, .dockerignore production image for Coolify (standalone output, Node 22 Alpine)
├── .env.example              NEXT_PUBLIC_SITE_URL and the optional YOUTUBE_API_KEY (allowed by .gitignore `!.env.example`)
├── next.config.ts            next-intl plugin, standalone output, image formats, security headers, old-site redirects
├── playwright.config.ts      site checks; uses BASE_URL when set, otherwise builds and serves on :3100
├── tests/site.spec.ts        every template × locale × width, axe, and feature tests (189 tests)
├── scripts/og-image.js       renders public/og.png from a running production server
├── messages/                 en.json, ar.json, ckb.json — ALL user-facing UI copy
├── public/
│   ├── brand/                official AtlasPlast logos (SVG, from the 2026 logo pack)
│   ├── brands/               partner manufacturer logos (SVG, cropped and optimised with svgo)
│   ├── images/               brands/, hero/, solutions/, leadership/ (photos from the company profile)
│   └── og.png                share image (1200×630)
└── src/
    ├── proxy.ts              next-intl middleware (Next 16 name for middleware)
    ├── i18n/                 routing.ts, navigation.ts, request.ts
    ├── lib/                  site.ts (URLs, hreflang, pageMetadata, pageLd), structured-data.ts, nav.ts, fonts.ts, motion.ts (easing), youtube.ts (channel feed)
    ├── content/              typed company data with sources: company, brands, solutions, projects, timeline, leadership, media, iraq-map, types
    ├── components/
    │   ├── layout/           SiteHeader (client), SiteFooter, LanguageSwitcher (client), Logo
    │   ├── sections/         Home and About sections (server by default)
    │   ├── solutions/        SolutionList, ProductLineRow, EnquiryBand
    │   ├── brands/           BrandGrid, BrandDocuments, BrandPhotoStrip, CurrentStrip (client)
    │   ├── company/          OfficeLines
    │   ├── media/            VideoGallery (client)
    │   ├── water/            Waves, ScrollWater (client)
    │   ├── seo/              JsonLd
    │   ├── motion/           MotionProvider, LineRise, SectionWipe, ScrollRule, useDirection
    │   └── ui/               ButtonLink, TextLink, Arrow, Icon, PinIcon, SectionHead, PageHeader, HeaderSlides (client), Ltr
    └── app/
        ├── globals.css       design tokens (@theme), base styles, utilities, water motion keyframes
        ├── icon.svg, apple-icon.png, manifest.ts, robots.ts, sitemap.ts, llms.txt/ and llms-full.txt/ (route handlers)
        └── [locale]/
            ├── layout.tsx    <html lang dir>, fonts, providers, header/footer, skip link
            ├── page.tsx      Home page with Organization JSON-LD
            ├── not-found.tsx
            ├── solutions/        index + [slug] (10 pages)
            ├── brands/           index + [slug] (22 pages)
            ├── about/            About + board/ (Board of Directors)
            ├── projects/, media/, locations/, contact/   single pages
            └── links/            unlisted روابط page
```

The repo has an empty, untracked `.claude/` folder and no `.github/` (no CI workflows).

**Architectural decisions:**
- **Routing:** every route lives under `src/app/[locale]/`. `localePrefix: "always"`, so `/` redirects (307) to `/en` (or to the visitor's preferred locale).
- **Static generation:**
  - `generateStaticParams` builds every locale.
  - The `[slug]` routes use `dynamicParams = false`, so unknown slugs return 404.
  - The build produces **138** static pages. Media also revalidates hourly (§10).
- **Server vs client components:** Server Components by default. Client components are only for interaction and animation: `SiteHeader`, `LanguageSwitcher`, `HeroCarousel`, `PipeSection`, `HeaderSlides`, `CurrentStrip`, `VideoGallery`, `ScrollWater` and the motion components. Section components fetch copy with `getTranslations` on the server.
- **Content:**
  - Facts (phones, offices, brands, solutions, projects, timeline, leadership, map points) live in typed modules in `src/content/`, with `Localized<T> = Record<Locale, T>` for names.
  - UI copy lives in `messages/*.json`.
  - Brand and product names stay in Latin script, marked `lang="en"` where needed.
- **Images:** logos are SVG, rendered with `next/image` using `unoptimized`. Photos are JPEGs under `public/images/`, served through `next/image` with AVIF/WebP.
- **Translations:** one JSON file per locale, with identical key structure. Top-level namespaces: `Meta`, `Common`, `Nav`, `Footer`, `Home` (hero, facts, statement, solutions, brands, projects, timeline, services, presence, contact), `Solutions`, `Projects`, `Brands`, `Countries`, `NotFound`, `About`, `Locations`, `Contact`, `ProjectsPage`, `Media`, `Links` and `Board`.

## 4. Current Sitemap

| Route | Status | Notes |
|---|---|---|
| `/` | DONE | redirects to `/en` (next-intl proxy) |
| `/en`, `/ar`, `/ckb` (Home) | DONE | approved benchmark, with a four-slide hero |
| `/{locale}/solutions` | DONE | index of the 10 solutions |
| `/{locale}/solutions/{slug}` | DONE | water-supply, drainage, water-heaters, infrastructure, galvanized-fittings, sanitaryware, tiles, pumps, faucets-valves, installation-tools. 46 product lines in all |
| `/{locale}/products` | REMOVED | returns 404; replaced by Solutions |
| `/{locale}/brands` | DONE | logo grid with country and product-line count per brand, plus the photo strip |
| `/{locale}/brands/{slug}` | DONE | 22 brands; product lines grouped by solution, "range on request" for FV-Plast and Peštan (FV-Plast also notes it is ordered direct from the manufacturer); Alvit is a QuarterBath brand and shows QuarterBath's range, documents and photo (`sisterOf`, owner 2026-10-05); technical documents for 15 brands. Topsan (Turkey, faucets, built-in valves, shower sets, valves) added 2026-10-05 at the owner's request, facts from topsanmusluk.com.tr |
| `/{locale}/projects` | DONE | all 56 projects grouped by sector (`sectorOrder`), each with its governorate and the brands supplied where known, plus the contractor list. 42 come from the owner's sheet of 2026-10-06 (`atlas/sources/projects-owner-2026-10-06.xlsx`, source `confirmed:2026-10-06`); English and Sorani names of those are transliterations to check with the owner. NASSAR, on three of them, is left out until it is a brand. Home shows the 14 marked `featured` |
| `/{locale}/media` | DONE | the YouTube channel's videos, click to load; revalidates hourly. Every public video when `YOUTUBE_API_KEY` is set, otherwise the feed's latest 15 |
| `/{locale}/about` | DONE | intro, figures, statement, vision/mission/values, a chairman teaser linking to the board page, the full history, services |
| `/{locale}/about/board` | DONE | Board of Directors: the chairman's message (owner's text 2026-10-05; ar/ckb are Claude's translations, pending review) signed Jaafar Almusawi, Chairman of the Board, Atlas Group. Header: his portrait (the owner's photo, 286×401, a larger original is wanted) standing in the wave edge with the pull quote; then the message with the three values he names (excellence, integrity, progress); then board members Omer Ibrahim and Mohammed Bajalan as photo cards; then the contact band. About stays active in the nav |
| `/{locale}/locations` | DONE | map, offices, warehouses, regional offices, branch phone lines; every office opens its exact Google Maps place |
| `/{locale}/contact` | DONE | header with the main line 6779 and a WhatsApp button; tiles for sales, projects and email (owner, 2026-10-05: the Al-Shaab WhatsApp tile is removed and the order is 6779, sales, projects, email, as in the Home contact card); hours; branch lines beside the Iraq map; a Follow band. No form yet |
| `/{locale}/links` | DONE | unlisted روابط page (old site's `/روابط/`): main line, WhatsApp, email, social, branch maps, craftsmen app. In no menu or sitemap, `noindex`. `/روابط` and `/ar/روابط` redirect (308) to `/ar/links` via `redirects()` in `next.config.ts` (see §20, old-site redirects) |
| `/{locale}/<unknown>` | DONE | localized 404 (`not-found.tsx`) |
| `/{locale}/faq` | DONE | 100 questions and answers in ten topics (`src/content/faq.ts`), FAQPage JSON-LD; linked from the footer. Solution pages show their own questions |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt`, `/icon.svg`, `/manifest.webmanifest` | DONE | sitemap lists 42 public pages in every locale (126 URLs) with image entries |

## 5. Design System

All tokens are in `src/app/globals.css`, in `@theme` and `:root`.

**Style:** modern and Apple-like since 2026-10-05 (owner asked for an apple-design review, "make it look modern"). Content sits on rounded cards and grouped lists instead of hairline rules; buttons and chips are pills; chrome that floats over content is translucent glass; type is Inter with tight display tracking. Navy bands, technical-drawing motifs (the hero pipe section) and the water theme (§14) still carry the identity.

**Colours:**
- Brand colours were sampled from the vector logo:
  - `--color-atlas-blue: #26549f`. Primary accent with 7.37:1 contrast on white, so it is safe for text.
  - `--color-atlas-sky: #3c84c2`. Decorative only, at 4.0:1; never use it for small text.
  - `--color-atlas-grey: #70767b`.
  - `--color-atlas-navy: #14284a`. Derived; used for the header, hero, page headers, contact band and theme-color.
  - `--color-atlas-navy-deep: #0e1c35`. Footer.
- Neutrals:
  - `--color-paper: #f4f5f7`. Page background.
  - `--color-surface: #ffffff`. Alternate sections.
  - `--color-rule: #dcdfe4` (list dividers, used at /70) and `--color-rule-strong: #9aa2a8`.
- `--color-atlas-mist: #9fd0f5`: light sky for eyebrows, icons and small text on navy (9:1). Use it instead of `atlas-sky` on dark.
  - `--color-steel: #59626b`. Secondary text.
  - `--color-ink: #15181b`.
- On dark backgrounds: `--color-on-dark: #f3f4f2`, `--color-on-dark-muted: #b9c3d3`, `--color-rule-dark: #2c4063`.

**Typography:**
- `--font-display` and `--font-sans` are both Inter with optical sizing (`font-display-latin` utility: `letter-spacing: -0.028em`; body text `-0.011em`, Inter's own tracking at 16px).
- `--font-mono` is IBM Plex Mono, now only for spec values and phone numbers.
- `--font-arabic` is IBM Plex Sans Arabic.
- `eyebrow` is a semibold sentence-case label (0.9375rem), coloured where it is used: `text-atlas-blue` on light, `text-atlas-mist` on navy.
- `section-title` is the heading that opens a section below the page header ("11 product lines", "Other brands").
- For `ar`/`ckb`, `:lang()` rules swap the display, eyebrow, section-title and body fonts to Plex Arabic and remove all letter-spacing.
- Body line-height in ar/ckb is 1.8. It is set on `html:lang(..) body` so that `leading-*` utilities can still tighten headings.
- Weights in use: 400/500/600; headings are mostly `font-semibold`.

**Heading scale:**
- Hero h1: `clamp(2.4rem, 6.2vw, 5.6rem)`, leading 0.98 (1.28 in ar/ckb).
- Section h2 via `SectionHead`: `clamp(2.25rem, 5vw, 4.25rem)`, leading 1.04 (1.3 in ar/ckb), max 22ch, with the eyebrow stacked above it.
- Inner-page h1 (`PageHeader`): `clamp(2.4rem, 6vw, 5.25rem)`.
- Figures: `clamp(2rem, 4vw, 3.25rem)`. Contact number: `clamp(3.5rem, 9vw, 7rem)`.

**Spacing and layout:**
- `--gutter: clamp(1rem, 3.2vw, 2.5rem)` and `--section-space: clamp(4.5rem, 10vw, 10rem)`.
- Utilities: `container-page` (max-width `--container-wide` 95rem / 1520px, with inline padding of `--gutter`) and `section-space`.
- `--container-content` is 80rem and `--container-text` is 42rem.

**Grid:** `md:grid-cols-12` where a section needs columns. `SectionHead` stacks eyebrow, heading, intro and link at the start of the container. Card grids use `gap-3`/`gap-4`.

**Radius:** `rounded-card` (1.5rem) for cards, photos and grouped lists, `rounded-tile` (1rem) for small tiles and spec panels, `rounded-panel` (2rem) for large panels (enquiry card, glass contact panel), `rounded-full` for buttons, chips and the language switch. `--radius-input: 0.75rem` for future form fields.

**Buttons:**
- `ButtonLink` variants: `primary` (blue), `secondary` (light ink pill), `inverse` (white on navy) and `inverseOutline` (glass on navy).
- All are 48px min height pills, with an arrow that nudges in the reading direction on hover, a water fill on hover or keyboard focus, and a press to `scale(0.97)`.
- `TextLink` is an Apple-style blue link with an arrow, underlined on hover.

**Cards and lists:**
- Cards are `rounded-card` on the opposite neutral (white cards on paper sections, paper cards on white sections); components that can sit on either take `tone="paper" | "surface"` (`SolutionList`, `BrandGrid`, `OfficeLines`).
- Short lists (offices, warehouses, documents, links, board values) are iOS-style grouped lists: one rounded container with `divide-y divide-rule/70` rows.
- `pressable` scales a card to 0.98 the moment it is pressed; `lift` adds a soft shadow and a 2px rise under a hovering pointer (`--shadow-lift`).
- `shelf`: below 40rem a card grid becomes a horizontal scroll-snap shelf with the next card peeking in (solutions, projects, timeline, services). It uses `contain: inline-size` so it can never widen the page. Give the element `sm:grid` and its columns for wider screens.
- `SolutionList` cards show the solution's first photo with `mix-blend-multiply`, because most photos are cut-outs on white: they sit on the card's own colour. Wide cards (to close the grid) lay out side by side.

**Materials:** `glass-navy` (site header) and `glass-on-dark` (hero and About stats, contact panel, vision and values, social tiles, header fact panels, slide dots) are translucent with `backdrop-filter`; both fall back to solid under `prefers-reduced-transparency` and `glass-on-dark` gets a solid border under `prefers-contrast: more`.

**Images:** partner logos appear in grayscale and switch to colour on hover. Photos have rounded corners; page headers cross-fade them behind the navy (`HeaderSlides`).

**Icons:** `Icon` (line icons on a 24px grid, 1.5 stroke, always decorative next to text), `Arrow` (mirrored in RTL) and `PinIcon` (on links that open Google Maps).

**Motion tokens:** `--ease-out-expo: cubic-bezier(0.22,1,0.36,1)`, `--ease-in-out: cubic-bezier(0.77,0,0.175,1)`, `--duration-fast: 160ms`, `--duration-base: 320ms`, `--duration-reveal: 700ms`. Motion (JS) uses `easeOutExpo` from `src/lib/motion.ts`, which mirrors `--ease-out-expo`; change both together.

**Header:** a sticky navy glass bar, 64px tall (80px at `md`, `--header-h`), with a pill Contact button, a segmented language switch and the water progress pipe along its foot. It overlaps the page (`-mb-[var(--header-h)]`), so content scrolls under the glass; `Hero` and `PageHeader` add `--header-h` to their top padding, and any page that does not open with one must add `mt-[var(--header-h)]` (see `not-found.tsx`). The glass is on a child layer: `backdrop-filter` on the header itself would trap the fixed mobile menu in the header's box. See §11.

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
- The **technical-drawing language**: the hero PE100 SDR11 Ø110 pipe section. Product data is set in mono with real specs (e.g. "PP-R · PP-RCT · Ø 20–200").
- **Navy bands** for the hero, page headers and contact, with paper and white alternating between other sections.
- **Cards, grouped lists and pills** (2026-10-05, replacing the earlier lists-and-hairlines look): solutions are photo cards, brands are logo tiles, projects are cards with sector chips, clients are chips.
- **Water theme** (owner, 2026-10-04: "fully animated with a water theme"): waves, caustic light, ripples, water-fill buttons and a water progress pipe. It stays restrained and is off under reduced motion.
- The logo lockup reads "PIPE SYSTEMS · SINCE 1990". This is the official artwork and must not be edited; the copy uses "Since 1975" (see §9).

## 7. RTL and Multilingual Architecture

- **Locales:** `en` (LTR), `ar` (RTL), `ckb` (RTL). These are defined in `src/i18n/routing.ts`, together with `getDirection(locale)`.
- **next-intl:**
  - `defineRouting` with `localePrefix: "always"` and `defaultLocale: "en"`.
  - `src/i18n/request.ts` loads `messages/${locale}.json`.
  - `src/i18n/navigation.ts` exports `Link`, `usePathname`, `redirect` and so on from `createNavigation`. **Always use these**, not `next/link`, for internal links.
- **Proxy:** `src/proxy.ts` is `createMiddleware(routing)`, with matcher `/((?!api|_next|_vercel|.*\\..*).*)`. Next runs `headers` → `redirects` (next.config) → the proxy → the filesystem, so the old-site redirects fire before locale detection.
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
  - Arabic and Sorani pages repaint continuously while the header water and the caustic light both run (performance only, nothing visible). Pre-existing; see §25.
  - Plex Mono has no Arabic glyphs, so never put text that may be Arabic script in `font-mono` (country labels are now sans for this reason).

## 8. Translation Status

| Area | English | Arabic | Kurdish Sorani |
|---|---|---|---|
| Meta, Common, Nav, Footer | complete | complete | complete |
| Home (all 10 namespaces) and hero slides | complete | complete | complete |
| Solutions (index, 10 solutions, 46 product lines, spec labels) | complete | complete | complete |
| Brands, Projects, About (incl. vision/mission/values), Locations, Contact, Media, NotFound | complete | complete | complete |
| Links | complete | complete | complete |
| Board (chairman's message) | owner's text | Claude's translation | Claude's translation |
| Content data (offices, warehouses, regional offices, timeline, project names, leadership names and roles) | complete | complete | complete |

**Needs human review:**
- **Kurdish Sorani has not been reviewed by a native speaker.** Claude wrote it carefully (fixes made include سعوودیە, سڕبیا, کۆماری چیک, گیرەی بۆری, `PPی` written attached, and a non-breaking space after the conjunction "و" in titles). It is still **not approved copy**. Arabic has not had a native review either.
- **The chairman's message in Arabic and Sorani** is Claude's translation of the owner's English text. The Arabic signature line is the owner's own wording.
- **Client names** (36 contractors in `src/content/projects.ts`) are shown in Latin script in every locale. Arabic/Kurdish spellings were not supplied.

**Consistent terminology:**
- Brand name: AtlasPlast / أطلس بلاست / ئەتلەس پلاست.
- Company name: Ufuq Al-Atlas Ltd. / شركة أفق الأطلس المحدودة / کۆمپانیای ئوفوق ئەلئەتلەس.
- **Owner's Arabic trade terms:** خزانات الدفن / طراد, never سيفونات; حرفيين, never فنيين ("الدعم الفني" stays). A test guards this. The Sorani equivalent of سيفونات is still open with the owner.
- Manufacturer and product names stay in Latin script (Georg Fischer, Silenta, PP-R…).
- Numerals are Western digits, wrapped in `<Ltr>`.

## 9. Content Sources

Source files are in the shared project folder (not in the repo):
- `/mnt/project-files/atlas/sources/ATLASProfile.pdf` (31 pages), plus the extracted text `ATLASProfile.txt`.
- `/mnt/project-files/atlas/sources/All_AtlasPlast_Logos_2026.pdf` (logo pack).
- `/mnt/project-files/atlas/sources/profile-images/`: 13 PNGs, mostly partner-factory photos at about 1000px.
- Full audit: `/mnt/project-files/atlas/research/content-audit.md` (Rev B; section 0 holds the final decisions).

**Precedence:** MOhammed's confirmations (newest wins) > ATLASProfile > atlasplast.iq. Much of atlasplast.iq is WordPress theme demo content; never reuse it.

**Confirmed and in use:**
- Since 1975 (first showroom 1990).
- "Hundreds of projects."
- Main phone **6779** (a normal `tel:` link). Every mobile number opens WhatsApp (`wa.me`): the site's WhatsApp line +964 783 305 6475, which is **Al-Shaab's** (owner, 2026-10-05; it was listed under Camp Sara before), projects division +964 786 660 4002 (owner, 2026-10-05; it was +964 772 267 1130 before), sales department +964 780 288 0009 (old site). Email info@atlasplast.iq.
- **Offices in Iraq** (each with an exact Google Maps place, `mapUrl` in `company.ts`):
  - Camp Sara (Baghdad) — HQ, +964 787 116 6604 (owner, 2026-10-05)
  - Al-Shaab (Baghdad) — +964 783 305 6475
  - Najaf — +964 783 700 6314
  - Basra — Al-Watan St, +964 787 116 6601
  - Erbil — Gulan St, +964 787 803 0001
  - Duhok — +964 750 991 0065
- **Map pins:** all six use `https://maps.google.com/?cid=<decimal CID>`. Camp Sara, Al-Shaab, Najaf and Erbil are the places pinned on the old site's روابط page (its "Headquarter" pin is in Al-Shaab). Basra ("Atlas plast") and Duhok ("شركة اطلس بلاست", 36.8691, 42.9351) are places the owner sent on 2026-10-05. To add one: resolve the short link (WebFetch reports the redirect), take the second hex of `!1s0x…:0x…` and convert it to decimal.
- **Warehouses:** Baghdad, Basra, Erbil, Duhok, Zakho. Open 24/7 with round-the-clock delivery, plus a Friday pickup/shipping note (old site).
- **Regional offices:** Saudi Arabia, Turkey, Syria, Egypt.
- **Hours:** Saturday to Thursday, 07:00 to 15:00 (old site).
- **Bänninger:** AtlasPlast is the exclusive agent for **central and southern Iraq**; Massary holds Kurdistan. Ranges: PP-R · PP-RCT (water supply) and PE · PVC-U Ø 8–1000 mm (infrastructure).
- The Czech agency is **FV-Plast** (ordered direct from the manufacturer through AtlasPlast, owner 2026-10-05); the Serbian agency is **Pestan**.
- **Polymelt** lines: POLO-Polymutan, Polo-Ecosan, Polo-UV, Polo-Polymutan ML5. **Poloplast:** Polo-Kal NG and Polo-Kal 3S only.
- **KAS** = kas.com.tr, supplied as **PP-R only** (not PPR-C).
- **Georg Fischer galvanized malleable-iron fittings** (EN 10242) are their own solution, made in Austria (owner, 2026-10-05).
- **Ceramic and porcelain tiles** are their own solution, the tenth (owner, 2026-10-05): Saudi Ceramics porcelain and ceramic tiles, specs from profile p10 (sizes, thickness, water absorption, R9–R11 slip, ISO 9001:2015 · SASO QM · CE · ESMA · G-Mark). Photos `tiles-1/2.jpg` from the same page.
- **Calpeda and Vitra are no longer partners.** Do not show them.
- Hussein Raad and Hassan Al-Oreibi have left; do not publish them.
- Client names: approved for publication.
- **Figures used:**
  - 600+ agents and dealers
  - 23 brands (see REQUIRES REVIEW)
  - 6,000+ engineers and plumbers trained
  - **9 months** of national demand held in stock (owner corrected six to nine on 2026-10-04)
- **Vision, mission and values** (About, `About.purpose`): the statements combine the old site's (water and sewage networks) with the profile's (sanitaryware, p6); the values are the profile's. Told to the owner as editable.
- **History:** besides the key milestones, About shows the sanctions years 1990–2003 (State Company for Construction Materials Trading), the 2006–2007 move to Sulaymaniyah, the 2007 ARBAK partnership, the 2008 return to Baghdad and the 2009 Al-Amir showroom with FABCO. Source: the old Arabic About page as summarised in the content audit; the owner approved adding them.
- **Leadership** (`src/content/leadership.ts`): Jaafar Almusawi, "Chairman of the Board, Atlas Group" (the owner's title; the profile called him CEO), and board members Omer Ibrahim and Mohammed Bajalan. Portraits from the profile's management page (p5); the owner sent the same photos to confirm. Nobody else from that page is published.
- **YouTube:** channel @atlasplast (`UCURwlrQZe8PnV7ZUzTme-AQ`), confirmed by the owner.
- **Craftsmen app:** the old روابط page linked an "Iraqi Craftsmen" app. The links (`craftsmenApp` in `company.ts`) are the store pages it led to, but both stores now list the app as **SAWA**. The owner has been asked whether to keep it.

**REQUIRES REVIEW:**
- **"23 international brands" vs 22 brands shown.** The profile says 23. After Calpeda and Vitra were removed and Topsan was added, the brand wall shows 22. Ask the owner whether the figure should change; do not change it on a guess.
- **Projects completed:** the profile says 700+ (p6) and 800+ (p23). Only "hundreds" is used.
- **Warehouse area:** the profile gives 40,000 m² + 16,000+ m² vs a 76,000 m² total, and the old site said 20,000 m². None of these is published.
- **Office count:** the profile contradicts itself (14 vs 10). Not published.
- **Financial and growth figures, market-share bars, the unnamed ISO certificate:** do not publish.
- **Profile main number +964 790 135 0331:** not used, because the owner chose 6779.
- **Boroug:** the owner supplied the Boroug logo on 2026-10-05 and asked for it in place of Polo Egypt, so the profile's Polo Egypt brand (p17) is now the Boroug brand at `/brands/boroug` (Boroug UPVC and POLO EGY PP-R). `/brands/polo-egypt` redirects there.
- **Partner-company founding years:** these are the manufacturers' facts. Use them sparingly.
- **Still waiting on the owner:** testimonials (with consent), NASSAR, the "up to 50 years" warranty, project photos.

## 10. Home Page

`src/app/[locale]/page.tsx` renders the sections in this order. All are complete in three languages.

1. **Hero carousel**: `sections/Hero.tsx` (server) composes the slides; `sections/HeroCarousel.tsx` (client) runs them.
   - The navy band has four slides, each with a photo backdrop:
     1. **Solutions**: the h1 (animated by `LineRise`), the lead, the Explore solutions and Contact sales buttons, and the `PipeSection` drawing.
     2. **Our history**: "Five decades supplying the builders of Iraq", with a `YearScale` ruler from 1975 to 2025 marking the milestones. The button goes to `/about`.
     3. **Our brands**: lists the manufacturer countries, with a 3×3 grid of white-inverted partner logos. The button goes to `/brands`.
     4. **Stock and reach**: "Nine months of national demand, held in stock", with `IraqMap tone="dark"`. The button goes to `/locations`.
   - The tab bar has numbered tabs with labels (only the active label shows on phones), plus prev, next and pause controls.
   - Each slide's visual is hidden below `md` to keep the hero short on phones.
   - Below the carousel is a `dl` of 4 figures.
2. **Statement**: `Statement.tsx`.
3. **Solutions**: `SolutionIndex.tsx` (SectionHead + `solutions/SolutionList.tsx`), "Ten solutions, one supplier.", the 10 solutions with icons.
4. **Brands**: `BrandWall.tsx`, 22 logos and the manufacturer photo strip (`BrandPhotoStrip` inside `CurrentStrip`, with a pause button).
5. **Projects**: `ProjectIndex.tsx`.
6. **Timeline**: `Timeline.tsx` with `ScrollRule` (key milestones only).
7. **Service model**: `ServiceModel.tsx`.
8. **Presence**: `Presence.tsx` + `IraqMap`; offices link to Google Maps.
9. **Contact band**: `ContactBand.tsx`. The card lists the main line 6779, then sales, projects and email (owner, 2026-10-05).

**Inner pages:**
- Every inner page opens with `PageHeader` (navy, breadcrumb, eyebrow, h1, intro). The `image` prop puts one photo under a navy wash with a slow Ken Burns (warehouse photos on About, Locations and the Solutions index; manufacturer photos on brand pages). The `slides` prop cross-fades several photos instead (`HeaderSlides`, with a pause button and dots); each solution page uses it for its product photos.
- `/solutions/[slug]`: the "01 / 10" eyebrow, intro, line count and brand names; product line rows (brand logo or the Aquahot mark, name, description, a spec `dl` in mono wrapped in `<Ltr>`, and "Made in" when `madeIn` differs from the brand's country); a navy "Need help choosing?" band; an "Other solutions" list; `BreadcrumbList` and `ItemList` JSON-LD.
- `/media`: `lib/youtube.ts` lists every public upload through the YouTube Data API when `YOUTUBE_API_KEY` is set (uploads playlist, 50 per page, up to 500), otherwise the channel's public feed (latest 15 uploads). Both use `next.revalidate` 3600, and the page has `revalidate = 3600`, so new uploads appear within the hour without a redeploy. If the feed is unreachable (as in the build sandbox) it falls back to the old site's video `xatuZC65KuM`. `VideoGallery` is click-to-load (thumbnail first, then a youtube-nocookie embed). VideoObject JSON-LD only for feed items with a title and date.
- `/about/board` and `/links`: see §4.

**Responsive:** sections stack below `md`/`lg`. The Playwright suite checks every template at 375, 768 and 1440px in all 3 locales.

## 11. Header and Navigation

`src/components/layout/SiteHeader.tsx` (client).

- **Bar:** sticky navy glass (`glass-navy` on a child layer), z-40, overlapping the page top so content scrolls under it (see §5 Header). It is `h-16`, or `md:h-20` (`--header-h`). Along its foot runs the reading-progress water pipe (`water/ScrollWater.tsx`). A test guards the overlap, the blur and the full-height mobile menu.
- **Logo:** the white lockup, sized by height (`!h-11 md:!h-14`). It links to `/`.
- **Nav items** (`src/lib/nav.ts`): Solutions, Brands, Projects, Media, About, Locations. Contact is a separate button. `/about/board` keeps About marked as current.
- **Desktop (≥ lg):**
  - An underline grows on hover and on `aria-current="page"`. Its origin flips in RTL.
  - On the end side: `LanguageSwitcher` as a segmented pill (English / العربية / کوردی) and a white pill Contact button.
- **Mobile (< lg):**
  - A two-line burger opens a full-screen navy menu under the bar.
  - The menu has large links with arrows (rows fade and rise in, staggered), plus the language switcher.
  - While it is open: page scroll is locked, the page behind is `inert`, Tab stays inside the header, Escape closes it, and focus returns to the burger. Links close the menu. A test guards this.

## 12. Footer

`src/components/layout/SiteFooter.tsx` (server). Deep navy, 12-column grid.

- **Columns:**
  - logo and tagline
  - "Explore": the nav plus Contact
  - "Offices in Iraq" (6 office names)
  - Contact (main line 6779, email)
  - Follow (Facebook, Instagram, LinkedIn, YouTube), from `company.social` and `socialNames`: round 44 px icon buttons (owner, 2026-10-06), brand glyphs from `ui/SocialIcon.tsx` (Simple Icons, CC0), the network name as `sr-only` text. The Contact page's Follow tiles show the same icons
- **Bottom bar:** © year Ufuq Al-Atlas Ltd.
- **Mobile:** the columns stack.
- **Not in the footer:** warehouses, regional offices, office addresses and phones (they are on Locations and Contact), and the روابط page (unlisted on purpose).

## 13. Components

| Component | File | Purpose / where used | Notes |
|---|---|---|---|
| `SectionHead` | `ui/SectionHead.tsx` | Section opener: coloured eyebrow stacked over a large h2, intro and action | props `eyebrow, title, intro?, id, action?, tone` (light/dark). Arabic leading override built in |
| `PageHeader` | `ui/PageHeader.tsx` | Navy opening band for inner pages: breadcrumb, eyebrow, h1, intro, optional `icon`, `aside`, children, and a backdrop: one `image` or cross-fading `slides` | use it on every new inner page |
| `HeaderSlides` | `ui/HeaderSlides.tsx` | Photo backdrop for a page header that cross-fades like the hero, with a pause button and dots | client; holds on mouse hover and keyboard focus, never after a tap |
| `ButtonLink` | `ui/ButtonLink.tsx` | CTA links (next-intl `Link`) | `variant`: primary/secondary/inverse/inverseOutline; water fill, arrow nudge (flips in RTL), press scale |
| `TextLink` | `ui/TextLink.tsx` | Underlined "All …" links | |
| `Icon` | `ui/Icon.tsx` | Line icons next to text | always decorative; `IconName` type lists them |
| `Arrow`, `PinIcon` | `ui/` | Forward arrow; map pin | `Arrow` is `rtl:-scale-x-100` |
| `Ltr` | `ui/Ltr.tsx` | `<bdi dir="ltr">` for numbers and codes in RTL | |
| `Logo` | `layout/Logo.tsx` | Official lockup via `next/image` (unoptimized, priority) | never mirrored; size it with height |
| `LanguageSwitcher` | `layout/LanguageSwitcher.tsx` | Locale links keeping the path | `className`, `onNavigate` |
| `SiteHeader` / `SiteFooter` | `layout/` | §11 and §12 | |
| `HeroCarousel` | `sections/HeroCarousel.tsx` | Tabbed hero carousel (APG pattern) | client; props `slides {id, tab, content}[]`, `labels`, `interval` (default 8000). Autoplay is driven by the CSS `hero-progress` keyframes on the active tab rule (`onAnimationEnd` advances). It pauses on mouse hover (`pointerType === "mouse"`), keyboard focus (`:focus-visible` only) and the pause button, so a tap on a phone never leaves it held; no autoplay under reduced motion. Arrow keys follow the reading direction |
| `PipeSection` | `sections/PipeSection.tsx` | Hero technical drawing | client; renders finished when reduced motion is on |
| `IraqMap` | `sections/IraqMap.tsx` | Map with office and warehouse markers; office dots link to Google Maps | props `locale, label, officeCities, warehouseCities, cityNames, tone`, `className`; never mirrored |
| `Purpose` | `sections/Purpose.tsx` | About: vision, mission, values | copy in `About.purpose` |
| `Timeline` | `sections/Timeline.tsx` | Milestones with `ScrollRule` | `full` shows all (About); otherwise `keyMilestones` |
| `SolutionList` | `solutions/SolutionList.tsx` | Solution photo cards; a shelf on phones | props `only?` (slugs), `headingLevel`, `tone`; also exports `solutionBrands()` |
| `ProductLineRow`, `EnquiryBand` | `solutions/` | Product-line row and sales band, shared by solution and brand pages | |
| `BrandGrid` | `brands/BrandGrid.tsx` | Rounded logo tiles | Brands index, Home and brand pages; prop `tone` |
| `BrandDocuments` | `brands/BrandDocuments.tsx` | Technical documents on brand pages | renders when `documents` is set in `brands.ts` |
| `BrandPhotoStrip` + `CurrentStrip` | `brands/` | Manufacturer photos drifting past; `CurrentStrip` (client) adds the pause button | the list renders twice for a seamless loop; the copy is hidden from assistive tech |
| `OfficeLines` | `company/OfficeLines.tsx` | Branch phone lines and map links | Locations, Contact (`narrow`, two columns beside the map), Links |
| `VideoGallery` | `media/VideoGallery.tsx` | Featured player plus the video list, click to load | client |
| `Waves`, `ScrollWater` | `water/` | Wave edge at the foot of dark bands; header water progress pipe | CSS motion, off under reduced motion |
| `JsonLd` | `seo/JsonLd.tsx` | Renders one `@graph` per page | builders in `lib/structured-data.ts` and `pageLd()` in `lib/site.ts` |
| `LineRise` | `motion/LineRise.tsx` | Word-mask headline reveal | splits only on spaces (keeps Arabic shaping); plain heading when reduced motion is on |
| `SectionWipe` | `motion/SectionWipe.tsx` | clip-path reveal from the reading-start edge | observes an unclipped wrapper (Chrome treats a fully clipped element as not intersecting) |
| `ScrollRule` | `motion/ScrollRule.tsx` | Timeline rule that fills with scroll (spring) | origin flips in RTL; full width when reduced motion is on |
| `MotionProvider` | `motion/MotionProvider.tsx` | `LazyMotion` (domAnimation, strict) + `MotionConfig reducedMotion="user"` | strict mode means you **must use `m.*`, not `motion.*`** |
| `useDirectionSign` | `motion/useDirection.ts` | +1 LTR / -1 RTL | |

## 14. Animation System

- **Philosophy:** purposeful and restrained, with a water theme the owner asked for. Motion explains (a drawing draws itself, a timeline fills) or carries the water identity; it never blocks content. One reveal per element, once.
- **Hero:**
  - `LineRise` rises each word out of a mask (0.9s, ease-out-expo, 45ms stagger), as a `transform` string so it runs off the main thread.
  - `PipeSection` strokes draw via `pathLength` (1.6s, staggered 0.3–1.1s), then labels fade in.
  - Slides crossfade over 0.6s (opacity only). The active tab's 3px rule fills over 8s via the CSS keyframes `hero-progress`; when it ends, the next slide shows.
- **Scroll:**
  - `SectionWipe` on the maps (1.1s, once, at 20% visibility). Its reduced-motion fallback is CSS (`.section-wipe`), because a JS branch left the server's clip-path in place after hydration and hid the maps.
  - `ScrollRule` on the timeline (spring with stiffness 120, damping 30).
  - `ScrollWater`: the header pipe scales with the scroll; inside it the `water-flow` strip slides on `transform`.
- **Water motion** (CSS in `globals.css`): wave edge on dark bands (`Waves`), caustic light, slow Ken Burns on photos, ripples on map offices, water-fill buttons and the header pipe. The Board portrait rises out of the wave edge once on load (`.rise-from-water`, transform only).
- **Photos:** the brand photo strip drifts continuously; page header photos cross-fade. Both have pause buttons (WCAG 2.2.2), hold on mouse hover and keyboard focus, and resume straight after Play on touch screens. The header dots grow with `scale` over 200ms on `--ease-in-out`.
- **Hover and press:**
  - Underline grow (320ms), the button arrow nudge, solution rows tinting with their icon filling blue, and brand logos changing from grayscale to colour.
  - The button water fill runs only on hover-capable devices (`@media (hover: hover)`) and on keyboard focus. Idle fills are paused, and the rise runs on the compositor (`.liquid-box`).
  - Buttons press to `scale(0.97)` (icon buttons `0.95`) on `--duration-fast`.
  - Only the featured video's play button pulses.
- **Mobile menu:** a 0.25s fade, with rows rising in on a `transform` string, staggered at 40ms.
- **Not implemented:** page transitions and parallax. Both are intentionally absent.
- **Easing:** everything uses `cubic-bezier(0.22, 1, 0.36, 1)`: `easeOutExpo` in `src/lib/motion.ts` for Motion, `var(--ease-out-expo)` in CSS. The one exception is the header photo dots, on `--ease-in-out`.
- **Reduced motion:**
  - `MotionConfig reducedMotion="user"`. It skips transform shorthands but not `transform` strings, so components that animate a `transform` string check `useReducedMotion()` themselves (`LineRise`, the menu rows).
  - `LineRise`, `SectionWipe` and `PipeSection` render the final state.
  - `ScrollRule` uses `motion-reduce:!scale-x-100`.
  - All water motion, Ken Burns and the hero and header-photo autoplay stop; the hero rule shows as full and its pause button is hidden. The photo strip stops and becomes a plain horizontal scroller.
  - `html` smooth scrolling is turned off.
- **Animation audit (2026-10-05):** the audit and its ten plans are in `/mnt/project-files/atlas/reviews/animation-audit.md` and `/mnt/project-files/atlas/animation-plans/`. All ten were merged into `feat/home-page` on 2026-10-05 (merge `b4a5ed1`). The plans README also lists two unplanned ideas and the open RTL repaint issue (§25).
- **Do not change:**
  - The `LazyMotion strict` + `m` pattern (bundle size).
  - The reduced-motion fallbacks and the pause buttons.
  - That the map and drawing are never mirrored.
  - That `LineRise` never splits inside a word (it would break Arabic and Sorani joining).

## 15. Responsive Design

Breakpoints are Tailwind defaults (sm 640, md 768, lg 1024, xl 1280). QA viewports: 375, 430, 768, 1024, 1440 and 1920 by hand; the suite runs 375, 768 and 1440.

- **375/430:**
  - Burger menu and single-column sections.
  - Figures in a 2×2 grid.
  - Brand wall in 2 columns (the last odd tile spans both).
  - Hero slide visuals hidden; header photos sit under a navy wash behind the text.
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
  - Page header photos fill the end side and fade into the navy.
- **1440/1920:** content is capped at 1520px plus gutters.
- **Typography:** scales fluidly with `clamp()`.
- **RTL on mobile:** verified for ar and ckb at 375 and 390, including the menu.
- **Known problems:** none open.

## 16. Images and Assets

- **AtlasPlast logos:** in `public/brand/`.
  - `atlasplast.svg` (colour, horizontal), `atlasplast-white.svg` and `atlasplast-stacked.svg`.
  - All come from the 2026 logo pack PDF via `pdftocairo` and svgo.
- **Favicon:** `src/app/icon.svg`, a viewBox crop of the stacked logo's globe mark; `apple-icon.png` and `manifest.ts` beside it.
- **Partner logos:** in `public/brands/`.
  - alvit, aquapa, ascelik, baenninger, candan, dab, fv-plast, georg-fischer, guarri, kas, ostendorf, pestan, pimtas, poloplast, polymelt, quarterbath, saudi-ceramics, shield, turan-borfit and wisa (all used).
  - `aquahot.svg` is used on the Water heaters solution page as the Aquahot line's mark.
  - **Boroug** (formerly Polo Egypt) was traced from the owner's PNG on 2026-10-05 into a two-colour SVG.
- **Photography** (all from the company profile PDF; no original photos yet):
  - `public/images/brands/<slug>.jpg`: 10 manufacturer-site photos (`photos` map in `brands.ts`). Used as brand page header backdrops, in the photo strip and as hero backdrops.
  - `public/images/hero/`: `landmark.jpg` (p21) and AtlasPlast's own warehouse photos `warehouse-*.jpg` (p23), used on the hero "reach" slide and the About, Locations and Solutions headers.
  - `public/images/solutions/<slug>-<n>.jpg`: 33 product photos extracted with `pdfimages` (alpha masks flattened on white), listed per solution in `solutions.ts` with the brand when the profile page names it. Galvanized fittings uses the owner's photo of the Georg Fischer malleable-iron range (`galvanized-fittings-2.jpg`, 960 px wide, sent 2026-10-05; original in `/mnt/project-files/atlas/sources/`). Galvanized on the left, black on the right, as sent.
  - `public/images/leadership/`: the three portraits (p5).
  - Profile photos are about 500px wide; replace them with originals when the owner sends them.
  - Never substitute AI-generated "company" photos, and never present partner-factory photos as AtlasPlast's.
- **Fonts:** self-hosted by `next/font` (§2).
- **OG image:** `public/og.png` (1200×630), rendered by `scripts/og-image.js` from a running production server on :3600. Re-run it if the branding changes.
- **Review screenshots** (not in the repo): `/mnt/project-files/atlas/preview/` and `/mnt/project-files/atlas/reviews/`.

## 17. SEO

Full SEO pass done 2026-10-04 at the owner's request ("make sure SEO is the best for the website and all pages"). New pages follow the same pattern.

**Metadata** (`pageMetadata()` in `src/lib/site.ts`, used by every page):
- Keyword-led titles per page in all three languages (`Meta.*Title` keys), e.g. "Water supply pipes in Iraq | AtlasPlast". Home uses an absolute title.
- Descriptions are kept under about 160 characters. The main line comes from `company.mainPhone` via `{phone}`, so it updates in one place.
- Canonical URL, hreflang for en/ar/ckb plus x-default → /en.
- Open Graph with `og:locale` en_US / ar_IQ / ckb_IQ and the other two as `og:locale:alternate`, plus `/og.png` with a localized alt. Twitter `summary_large_image`.
- `/links` is `noindex, follow`; the 404 page is noindex.

**Structured data** (`src/lib/structured-data.ts`, `pageLd()` in `src/lib/site.ts`, `JsonLd`; one `@graph` per page):
- Home: `Organization` (@id `SITE_URL/#organization`, logo, founding 1975, contact points, `sameAs` including YouTube) and `WebSite`, plus `WebPage`.
- Every inner page: a typed page node (`CollectionPage`, `AboutPage`, `ContactPage` or `WebPage`) and `BreadcrumbList`.
- Every page: a compact `Organization` node (same `@id`), so each page names the entity it is about.
- Solution and brand pages: an `ItemList` of `Product` nodes (name, description, brand, category, photo, specs as `additionalProperty`, country of origin when known) and a `Brand` node per manufacturer (`SITE_URL/#brand-<slug>`). Owner asked for Product schema on 2026-10-05. There are still no prices or reviews, so Search Console may list the products under "Product snippets" as missing `offers`/`review`; that is expected and only affects price/star rich results.
- Locations: one `LocalBusiness` per Iraqi office (city, phone, email, opening hours Sat–Thu 07:00–15:00, parentOrganization).
- FAQ: `FAQPage` on `/faq` (all 100) and a `FAQPage` node on each solution page with its questions. Question `@id`s point at `/faq#faq-<id>`.
- Contact: Organization `contactPoint`s (main line, projects line, sales line, WhatsApp).
- Media: `VideoObject` per feed video with a title and date.
- Board: a `Person` per leader (name, jobTitle, image, worksFor the organization).

**Other:**
- `src/app/sitemap.ts` lists 42 pages × 3 locales (126 URLs) with hreflang alternates, image entries (solution photos, brand photos and logos) and a build-time `lastModified`. Add every new public page to `paths`; `/links` stays out on purpose.
- `src/app/robots.ts` allows all and names the search and AI crawlers (OAI-SearchBot, ChatGPT-User, GPTBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Bingbot, Applebot and others), plus the sitemap and host.
- Layout metadata: `max-image-preview:large`, `max-snippet:-1`; optional `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` build variables add the ownership meta tags.
- **GEO:** `/llms.txt` (summary, key facts, solutions, brands, pages) and `/llms-full.txt` (plus product specs and every FAQ answer in en/ar/ckb) are built from `src/lib/llms.ts` out of the same content, so they never drift.
- **FAQ** (`src/content/faq.ts`): 100 questions, each with `q`/`a` in en/ar/ckb, a topic, an optional `href` and the solution pages it also appears on. Answers use only facts already published; contact details are `{mainPhone}`-style placeholders filled from `company.ts`. Arabic and Sorani are Claude's and need the same native review as the rest.
- **IndexNow:** key `10a24adcefe968996992d893b0bf54d0` (public by design) at `public/<key>.txt`, in `src/lib/indexnow.ts` and `scripts/indexnow.mjs`. `src/instrumentation.ts` submits every sitemap URL 30 s after start when `INDEXNOW_SUBMIT=true` (production only, never the preview). `npm run indexnow` does it by hand.
- `viewport.themeColor` is `#14284a`.

**Still open:** after the domain goes live, verify atlasplast.iq in Google Search Console (DNS TXT in Cloudflare is simplest), submit the sitemap, import the site into Bing Webmaster Tools from Search Console, and set `INDEXNOW_SUBMIT=true` in Coolify (all need the owner's accounts). Add original photography for richer share images.

### Brand technical documents

- Brand pages show a **Technical documents** section when `documents` is set on the brand in `src/content/brands.ts`.
- Owner decision 2026-10-04: the files come from the **manufacturers' official websites** and must be **in English**. They are linked, not re-hosted. Each has `source: "manufacturer:2026-10-04"`.
- 14 brands have documents. None were found for WISA (site timed out), Turan Borfit, Guarri, Asçelik, Boroug and Shield. Alvit shares QuarterBath's.
- Unverified: the Bänninger Range of Products PDF (34 MB, not opened). Saudi Ceramics links to its catalogue page; the files themselves are on Google Drive and were not opened.
- To self-host a file instead, put it under `public/docs/<brand>/` and use `href: "/docs/<brand>/<file>.pdf"`.

## 18. Accessibility

**In place:**
- Semantic landmarks: header/nav/main/footer and a skip link to `#main`.
- One h1 per page, with sections labelled by `aria-labelledby`.
- `dl` for the figures and `aria-current` on nav and language links.
- Visible `:focus-visible` outline: 2px Atlas Blue, or light on dark sections.
- Mobile menu: `aria-expanded`/`aria-controls`, focus kept inside, the page behind made `inert`, Escape to close, focus returned to the burger.
- Pause buttons on every moving photo set (hero, header photos, photo strip), as WCAG 2.2.2 requires.
- Alt text on logos (brand names) and portraits (names); decorative icons are hidden.
- `role="img"` + `aria-label` on the map and pipe drawing.
- `LineRise` keeps the full heading in `aria-label`, with the word spans `aria-hidden`.
- `lang`/`dir` on `<html>`, plus `lang` on Latin-script brand names and language options.
- Reduced motion is honoured (§14).
- Atlas Sky is not used for text.
- Tap targets are at least 44px (burger and icon buttons 44px, buttons 48px).
- **axe (WCAG 2.1 AA)** runs on every template in every locale in the test suite; serious and critical violations fail it.

**Known issues:**
- No forms yet; the contact form is still to be designed, with labels and errors.

## 19. Performance

- All pages are statically prerendered (SSG) with Server Components by default. Only the client components in §3 ship JS.
- Motion uses `LazyMotion` + `domAnimation` (a reduced feature bundle).
- Continuous motion runs on the compositor: the photo strip, header water, headline rise, menu rows, button fill rise and photo dots animate `transform`/`opacity`/`scale`, and idle button fills are paused.
- Fonts use `next/font` (self-hosted, `display: swap`, subset); the Arabic font loads the arabic subset only. Mono labels are not preloaded.
- Logos are lightweight SVGs (svgo-optimised). Photos go through `next/image` (AVIF/WebP, `sizes` set).

**Lighthouse 12 (2026-10-04, mobile, simulated slow 4G, standalone server; before the photos and water motion):**
- `/en`: Performance 87, Accessibility 100, Best Practices 100, SEO 92. LCP 4.0 s, TBT 60 ms, CLS 0.
- `/ar/brands/polymelt`: Performance 89, Accessibility 100, Best Practices 100, SEO 92. LCP 3.7 s.
- The SEO 92 is only the `canonical` audit, because the test ran on localhost while canonicals point to `https://atlasplast.iq`. It passes on the real domain.
- LCP is the hero lead paragraph, delayed by web-font loading (all locales share one layout, so Latin and Arabic fonts are both preloaded). A further gain would mean splitting the font loading per script.
- **Not re-measured** since photos and water motion were added. Run Lighthouse again before launch.

**Known problem:** Arabic and Sorani pages repaint continuously while the header water and the caustic light both run (§25).

## 20. Coolify Deployment

- **Repository:** https://github.com/M7tech/website_pipes
- **Preview:** https://new.atlasplast.iq. Coolify deploys branch **`feat/home-page`** automatically on every push. Canonicals still point to `https://atlasplast.iq`.
- **Production:** `main` holds only the scaffold. The site is on `feat/home-page` in **draft PR #1** (https://github.com/M7tech/website_pipes/pull/1). After the owner merges it, switch Coolify to `main` and point the live domain at it.
- **Build method: Dockerfile** (repo root, not Railpack). It is multi-stage on `node:22-alpine`, uses `output: "standalone"`, runs as a non-root user, and has a built-in `HEALTHCHECK` on `/en`. `.dockerignore` keeps tests, `.git`, env files and Markdown (except README) out of the image.
- **Build argument:** `NEXT_PUBLIC_SITE_URL=https://atlasplast.iq`, set as a build-time variable because it is inlined during the build. It defaults to `https://atlasplast.iq`.
- **Optional runtime variable:** `YOUTUBE_API_KEY` (YouTube Data API v3, server-only) makes Media list every video. Not set yet; never commit it.
- **Port:** 3000. **Health check:** host `127.0.0.1` (the server is IPv4 only; `HOSTNAME=::` crashes without IPv6 and `localhost` may resolve to `::1`), port 3000, path `/en` (`/` returns a 307 redirect), return code 200. The image includes `curl` for Coolify's check.
- **Headers** (`next.config.ts`):
  - `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN` and `Permissions-Policy` on every response.
  - A one-week cache on `/brand/*` and `/brands/*` logos.
  - HSTS is left to Coolify's proxy.
- **Without Docker:** `npm ci && npm run build && npm run start` still works.
- **Domain (DNS):** atlasplast.iq is on Cloudflare. As of 2026-10-05 the apex and `www` were proxied (orange cloud) to the old WordPress host, and `new` was DNS only to the VPS: A `159.195.113.233`, AAAA `2a0a:4cc0:61:4b8:8ec:69ff:fe1c:8f6d`. To go live: in Coolify set Domains to `https://atlasplast.iq,https://www.atlasplast.iq,https://new.atlasplast.iq` with "Redirect to non-www", then in Cloudflare point the apex and `www` A/AAAA records at the VPS, DNS only, so Coolify can issue the certificate. Leave MX and TXT records alone (the domain has email, info@atlasplast.iq).
- **Old-site redirects** (`oldPages` in `next.config.ts`): every page in the old WordPress sitemaps (2026-10-05) redirects (308) to its new page: the Arabic home and its children, About, Contact, the agencies index and agency pages (Calpeda to the brand index), Projects and project pages, `/cart`, `/checkout`, `/home/footer`, and `/روابط`. The theme demo blog posts are left to 404. Sources are percent-encoded; Next matches either letter case and trailing slashes are stripped first.
- No secrets are needed or committed. `.env*` is gitignored, except `.env.example`.

## 21. Git Status

- **Current branch:** `feat/home-page`, which tracks `origin/feat/home-page`. Clean apart from this HANDOFF update, which is committed right after it is written.
- **Recent commits** (newest first; `git log --oneline --first-parent` for the rest):
  - Modern design pass (2026-10-05, branch `design/modern` merged in): Inter, glass header, rounded cards, grouped lists, pills, phone shelves
  - `fcb0c65` docs: handoff notes for tiles, Board and Contact redesigns, branch numbers
  - `f43cc92` feat: tiles solution, livelier Board and Contact pages, branch number fixes
  - `181b5f1` docs: bring the handoff notes up to date
  - `002e3a5` docs: handoff notes for the merged animation fixes
  - `b4a5ed1` merge: animation fixes 001-010 into the preview branch
  - `5b6f973` feat: Board of Directors page under About
  - `849d3d8` fix: Basra opens its exact Google Maps place
  - `29f56dc` feat: unlisted روابط links page and exact office pins
  - `c32fe4b` feat: galvanized fittings solution, vision and mission, fuller history, Media page
  - `8b61028` feat: carry over old-site sales line, service hours, GF and Bänninger ranges
  - `314d3b5` feat: solution photos as cross-fading header backgrounds
  - `77764e5` feat: icons, solution photo sliders, nine-month stock, KAS PPR only
  - `5a8c24d` feat: photos, Google Maps links, owner trade terms and water motion
  - `5d14f71` fix(docker): make health checks reliable on Coolify
- **Other branches** (all pushed):
  - `main`: the scaffold (`ed44260`), the PR's base.
  - `anim/fixes`: the ten animation fixes, now merged into `feat/home-page`.
  - `anim/001-liquid-hover-gate`, `anim/002-pause-moving-photos`: single-plan branches already contained in `anim/fixes`. Delete only if the owner asks.
- **Merge convention:** merge commits, never rebase or force-push shared branches.
- **PR #1:** draft. There are no CI workflows (`.github/` does not exist), so run the checks in §30 locally before every push.

## 22. Completed Work

- [x] Research: website and profile audit, with conflicts resolved with the owner (`content-audit.md`)
- [x] Next.js 16 + TypeScript + Tailwind 4 + Motion + next-intl project initialised
- [x] Multilingual routing (`/en`, `/ar`, `/ckb`) with proxy redirects
- [x] English, Arabic (RTL) and Kurdish Sorani (RTL) locales, Sorani pending native review
- [x] Message catalogues with key parity across 3 languages
- [x] Design tokens, fonts (Sorani glyph coverage verified) and RTL foundation with logical properties
- [x] Logo and partner logo assets (SVG)
- [x] Header with desktop nav, language switcher and an accessible mobile menu (focus kept inside, inert page)
- [x] Footer with YouTube in Follow us
- [x] Home page, all 9 sections, with a four-slide accessible hero carousel
- [x] Solutions: index and 10 solution pages (tiles added 2026-10-05), 46 sourced product lines, photo headers
- [x] Brands: index and 22 brand pages, technical documents for 15 brands
- [x] Projects, Media (YouTube feed), About (vision/mission/values, full history), Locations and Contact
- [x] Board of Directors page under About: the chairman's message and two board members with portraits
- [x] Unlisted روابط links page with the old address redirected
- [x] Exact Google Maps places for all six offices
- [x] Owner corrections: nine months of stock, KAS PPR only, Polymelt/Poloplast lines, Arabic trade terms, WhatsApp for every mobile number
- [x] Photos from the company profile (brands, hero, solutions, leadership) and line icons
- [x] Water-themed motion with reduced-motion fallbacks
- [x] Animation audit and all ten fix plans, merged
- [x] SEO: metadata, canonical, hreflang + x-default, OG image, sitemap, robots, JSON-LD on every page
- [x] SEO/GEO pass (2026-10-05): FAQ page with 100 questions in three languages, Product/Brand/FAQPage schema, AI crawlers named in robots.txt, llms.txt and llms-full.txt, image sitemap, IndexNow, Search Console/Bing verification hooks
- [x] Board and Contact pages redesigned (2026-10-05)
- [x] Playwright + axe suite in the repo (189 tests, all passing)
- [x] Dockerfile, security headers and Coolify preview deployment
- [x] README with Coolify notes, plus `.env.example`
- [x] HANDOFF.md

## 23. Work Currently in Progress

Nothing is half-done in the code. These are waiting on the owner:
- **Craftsmen app:** both store links now show the app as "SAWA". Keep the links on the روابط page or remove them?
- **Chairman's message:** review of the Arabic and Sorani translations.
- **Chairman's photo:** the one the owner sent is 286×401 px, soft on large screens; a larger original would sharpen the Board header.
- **YouTube key (optional):** Media already shows the whole channel (11 videos on 2026-10-05) because the feed holds the latest 15. A `YOUTUBE_API_KEY` in Coolify keeps every video once the channel passes 15.

## 24. Remaining Tasks

**Critical (blocking production)**
- Owner review and merge of PR #1, then switch Coolify to `main`, connect the live domain atlasplast.iq and submit the sitemap in Search Console.
- Native-speaker review of the Sorani (and Arabic) copy.

**High priority**
- Resolve "23 brands" vs the 21 shown (§9, REQUIRES REVIEW).
- Original photography from the owner: projects and sharper originals of the profile photos.
- Contact page: decide on a form (needs a backend or email service via env vars) vs direct contact links.

**Medium priority**
- The Sorani equivalent of سيفونات (owner).
- Testimonials (with consent), NASSAR, the "up to 50 years" warranty, if the owner supplies them.
- Investigate the Arabic/Sorani repaint (§25).
- Re-run Lighthouse now that photos and motion are in.
- Arabic/Kurdish spellings of client names, if the owner supplies them.

**Polish**
- Brand logo optical sizing (some marks such as Bänninger read small).
- The two unplanned animation ideas in the plans README (office list linked to the map dots; a pause/play icon cross-fade).

## 25. Known Problems / Bugs

1. **Arabic and Sorani pages repaint while the header water and the caustics both run**
   - Affects: every ar/ckb page; performance only, nothing visible.
   - Measured on `/ar/about` with a DevTools trace: about 260–320 paints in 2 s with everything running, 0 with `caustic-drift` paused; `/en/about` paints 0. It was there before the animation fixes.
   - Suspect: the `.caustics` layer (`mix-blend-mode: screen`) in RTL. `will-change`, `contain: paint`, `overflow: clip` and `clip-path` on the bar did not remove it.
   - Next step: its own investigation and plan.
2. **"23 brands" figure vs 21 logos**
   - Affects: `src/content/company.ts` (`facts`) and the Home hero figures.
   - Cause: Calpeda and Vitra were removed.
   - Needs the owner's answer; do not change the number on a guess.

No layout, RTL or accessibility bugs are open: the full suite passes.

## 26. Decisions That Must Be Preserved

- **Content hierarchy:** owner confirmations > ATLASProfile > atlasplast.iq. Every fact records its source in `src/content`.
- **Locales and routing:** en/ar/ckb with an always-present prefix; the ckb code is used for Sorani. One component tree serves all languages, and direction comes from `dir` plus logical properties. There are no separate RTL layouts.
- **Fonts:**
  - IBM Plex Sans Arabic for ar and ckb. It is one of the few families verified to render ڕ ڵ ێ ۆ ە ڤ; Cairo, Tajawal, Rubik, Alexandria and Readex fail Sorani.
  - Inter (optical sizing) for English since 2026-10-05; Archivo + Plex Sans before.
- **Colours:** Atlas Blue is the text-safe accent. Atlas Sky is decorative only. Navy is derived from the brand blue.
- **Never mirrored:** the logo, the map and the technical drawings.
- **Design language:** modern and Apple-like: rounded cards and grouped lists, pills, glass over navy, Inter, technical drawings and a restrained water theme. The Home page is the benchmark for every new page; reuse `SectionHead`, `PageHeader`, `ButtonLink`, `TextLink`, the `pressable`/`lift`/`shelf` utilities and `container-page`/`section-space`.
- **Server Components by default.** Client components only for interaction and animation. `LazyMotion strict` with `m.*`.
- **Copy:** never hard-code UI copy; add keys to all three message files together.
- **Calpeda/Vitra:** not partners. **Hussein Raad / Hassan Al-Oreibi:** not published. No other people than the three on the board page.
- **Wording:** "Since 1975" in copy; the logo artwork keeps "since 1990". "Hundreds of projects", not a number. Main phone 6779. Nine months of stock. The owner's Arabic trade terms (§8).
- **Phones:** only 6779 is `tel:`; every mobile number opens WhatsApp. +964 783 305 6475 is Al-Shaab's, +964 787 116 6604 is Camp Sara's.
- **Maps:** offices open their exact Google Maps place (`?cid=`), never a search.
- **Unlisted روابط page:** stays out of menus and the sitemap, `noindex`, with the old address redirected.
- **Brand documents:** English, from the manufacturers' official sites, linked not re-hosted.
- **Deployment and git:** Coolify on a Node server with no Vercel dependencies. Work on feature branches with logical commits; `main` is production. The preview deploys from `feat/home-page`.

## 27. Things Claude Must NOT Do

- Do not invent AtlasPlast facts, figures, projects, certifications or people.
- Do not replace real company photography with AI-generated images, and do not present partner-factory photos as AtlasPlast's.
- Do not redesign the approved design system without a reason the owner agrees with.
- Do not create separate RTL layouts or components; use logical properties and `rtl:` only for transforms.
- Do not hard-code user-facing text; every string goes through `messages/*.json`.
- Do not introduce Vercel-only dependencies (`@vercel/*`, Edge Config, Vercel image loaders, etc.).
- Do not hard-code secrets, and never write passwords, API keys, tokens, SSH keys, private keys or credentials into the repo or this file; only env var names belong here.
- Do not change working components for stylistic preference.
- Do not hide layout bugs with ad-hoc CSS patches. Fix the cause; the Arabic leading bug, for example, was a specificity issue.
- Do not remove features or routes without checking where they are used (`sitemap.ts` lists indexable pages; `/links` is unlisted on purpose).
- Do not do large refactors before understanding dependencies.
- Do not use `next/link` for internal links (use `@/i18n/navigation`), and do not use `motion.*` (strict LazyMotion requires `m.*`).
- Do not split headings inside words (it breaks Arabic and Sorani letter joining).
- Do not put Arabic-script text in Plex Mono.
- Do not edit the logo SVGs or recolour partner logos beyond the grayscale hover treatment.
- Do not publish the REQUIRES REVIEW items in §9.
- Do not use سيفونات or فنيين in Arabic copy.
- Do not skip, disable or weaken a test to get green.
- Do not trust Next.js API knowledge from training data. Read `node_modules/next/dist/docs/` (AGENTS.md); Next 16 uses `proxy.ts`, async `params` and the generated global `PageProps`/`LayoutProps` types. Redirect sources match the percent-encoded path.

## 28. Files That Are Especially Important

| File | Controls |
|---|---|
| `AGENTS.md` / `CLAUDE.md` | Agent rules for this Next.js version |
| `package.json` | scripts, versions, engines |
| `next.config.ts` | next-intl plugin, standalone output, image formats, headers, the روابط redirects |
| `Dockerfile` | the Coolify image and health check |
| `playwright.config.ts`, `tests/site.spec.ts` | the site checks; add every new template to `paths` |
| `src/proxy.ts` | locale detection and redirects |
| `src/i18n/routing.ts` | locales, default, direction helper |
| `src/i18n/navigation.ts`, `src/i18n/request.ts` | localized links; message loading |
| `src/lib/nav.ts` | primary nav, contact link, language names |
| `src/lib/site.ts` | `SITE_URL`, canonical and hreflang helpers, `pageMetadata`, `pageLd` |
| `src/lib/structured-data.ts` | JSON-LD builders |
| `src/lib/motion.ts` | the Motion easing (mirrors `--ease-out-expo`) |
| `src/lib/youtube.ts` | the Media page's channel feed |
| `src/lib/fonts.ts` | font loading and CSS variables |
| `src/app/globals.css` | design tokens, Arabic-script rules, utilities, water motion |
| `src/app/[locale]/layout.tsx` | html lang/dir, providers, header/footer, skip link, base metadata |
| `src/app/[locale]/page.tsx` | Home composition and JSON-LD |
| `src/app/sitemap.ts` | indexable pages |
| `messages/en.json`, `ar.json`, `ckb.json` | all UI copy |
| `src/content/company.ts` | phones, email, social, offices with map links, warehouses, regional offices, figures, craftsmen app |
| `src/content/brands.ts` | brands, logos, countries, photos, documents |
| `src/content/solutions.ts` | solutions, product lines, specs, photos, sources |
| `src/content/leadership.ts` | the chairman and board members |
| `src/content/projects.ts`, `timeline.ts`, `media.ts`, `iraq-map.ts` | projects and clients, milestones, the YouTube channel, map geometry |
| `src/components/layout/SiteHeader.tsx`, `SiteFooter.tsx` | site chrome |
| `src/components/sections/Hero.tsx`, `HeroCarousel.tsx` | Home hero slides |
| `src/components/ui/PageHeader.tsx`, `HeaderSlides.tsx` | inner-page header and its photos |
| `/mnt/project-files/atlas/research/content-audit.md` | source facts and conflicts (outside the repo) |
| `/mnt/project-files/atlas/animation-plans/README.md` | animation plans, their status and open motion issues (outside the repo) |

## 29. Recommended Next Step

Everything the owner asked for so far is built and on the preview. Waiting on the owner: the craftsmen app (SAWA) question, the chairman's message translations, the "23 brands" figure, photos, a contact form decision, the Sorani word for سيفونات, and merging PR #1.

Work that needs no owner input:
- Investigate the Arabic/Sorani repaint (§25.1) and write a plan for it.
- Re-run Lighthouse on the preview and record the results in §19.

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

**Checks before every push** (there is no CI):
- `npm run lint` and `npm run typecheck`.
- `npm run build`, then serve it and run the suite against it: `npx next start -p 3800 -H 127.0.0.1` in one shell, `BASE_URL=http://127.0.0.1:3800 npx playwright test` in another. Without `BASE_URL`, Playwright builds and serves on :3100 itself and reuses any server already on that port, so do not leave another build running there.
- When a script stops servers by name, match `next-server` and check each PID's working directory first; a pattern like `next start` also matches the shell running the script.
- Turbopack refuses a `node_modules` symlinked from outside the project root, so build in a checkout with its own `node_modules`.
- Pushing `feat/home-page` redeploys the preview.
