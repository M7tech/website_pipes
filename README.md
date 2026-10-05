# AtlasPlast website

Corporate website for AtlasPlast (Ufuq Al-Atlas Ltd.), in English, Arabic and Kurdish (Sorani).

Built with Next.js (App Router), TypeScript, Tailwind CSS 4, Motion for React and next-intl.
No hosting-provider-specific dependencies: it runs on any Node.js server.

## Requirements

- Node.js 20.9 or newer
- npm

## Local development

```bash
npm install
cp .env.example .env.local   # optional; defaults to https://atlasplast.iq
npm run dev
```

Open http://localhost:3000. The root redirects to `/en`; the other locales are `/ar` and `/ckb`.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public origin used for canonical URLs, hreflang, sitemap and Open Graph. Defaults to `https://atlasplast.iq`. |
| `YOUTUBE_API_KEY` | Optional | Server-only YouTube Data API v3 key. With it the Media page lists every public video on the channel; without it, the latest 15 from the public feed. Set it as a runtime variable in Coolify (not a build argument). |

Secrets are never committed. Set variables in the hosting environment (Coolify) or in `.env.local` locally.

## Deploying with Coolify

The repository includes a production `Dockerfile` (Next.js `output: "standalone"`, Node 22 Alpine, non-root user, built-in health check).

1. In Coolify, create a new application from this GitHub repository and pick the branch to deploy (`main` once PR #1 is merged).
2. Build pack: **Dockerfile**.
3. Add `NEXT_PUBLIC_SITE_URL` (e.g. `https://atlasplast.iq`) as a **build-time** variable/build argument, since it is inlined during the build.
4. Exposed port: `3000`. Health check (Coolify → Configuration → Healthcheck): scheme `http`, host `127.0.0.1` (not `localhost`), port `3000`, path `/en`, return code `200`. Or leave Coolify's check off; the image has its own `HEALTHCHECK`.
5. Point the domain at the application and enable HTTPS in Coolify. HSTS is set by Coolify's proxy; the app sends the other security headers itself.

Without Docker (Nixpacks or a plain Node host): `npm ci`, `npm run build`, then `npm run start` (port 3000, honours `PORT`).

## Quality checks

- `npm run lint` and `npm run typecheck`
- `npm run test:e2e`: Playwright checks every page template in en/ar/ckb at 375, 768 and 1440 px (overflow, console errors, failed requests, broken images, lang/dir, one h1) plus axe WCAG 2.1 AA and the mobile menu focus. It builds and starts the site itself, or set `BASE_URL` to test a running server. Run `npx playwright install chromium` once on a new machine.

## Project structure

```
messages/            UI copy per locale (en.json, ar.json, ckb.json). No UI text is hard-coded.
src/app/             Routes: /[locale] pages, sitemap, robots, icon
src/components/      layout (header, footer), sections (Home), motion, ui
src/content/         Company facts, brands, projects, timeline, map data, each with its source
src/i18n/            next-intl routing, navigation and request config
src/proxy.ts         Locale detection and redirects
public/brand/        Official AtlasPlast logos (2026 logo pack)
public/brands/       Partner manufacturer logos
```

## Content rules

- Facts come only from the AtlasPlast company profile, atlasplast.iq, or decisions confirmed by AtlasPlast. Each record in `src/content/` names its source.
- Arabic and Kurdish (Sorani) are right-to-left. Use logical CSS properties (`ms-`, `pe-`, `start-`, `end-`), never `left`/`right`.
- The Kurdish copy should be reviewed by a native Sorani speaker before launch.
