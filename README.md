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

Secrets are never committed. Set variables in the hosting environment (Coolify) or in `.env.local` locally.

## Deploying with Coolify

1. Create a new application from this GitHub repository and pick the branch to deploy.
2. Build pack: Nixpacks (or a Node.js Dockerfile). Node 20.9+.
3. Install command `npm ci`, build command `npm run build`, start command `npm run start`.
4. Exposed port: `3000` (`next start` honours the `PORT` variable if Coolify sets a different one).
5. Add `NEXT_PUBLIC_SITE_URL` as a build-time variable, since it is inlined during the build.
6. Point the domain at the application and enable HTTPS in Coolify.

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
