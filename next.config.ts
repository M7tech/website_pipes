import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** Baseline security headers for every response. HTTPS/HSTS is terminated by Coolify's proxy. */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

/** An old Arabic path, percent-encoded as browsers send it; `:params` stay as patterns. */
const ar = (...segments: string[]) =>
  `/ar/${segments.map((s) => (s.startsWith(":") ? s : encodeURIComponent(s))).join("/")}`;

const OLD_HOME = "شركة-أطلس-بلاست-أكثر-من-45-سنة-خبرة-في-أنا";
const AGENCIES = "الوكالات";

/**
 * The old WordPress site's pages (from its sitemaps, 2026-10-05), so bookmarks and
 * search results land on the matching new page once atlasplast.iq points here.
 * Its theme demo blog posts are left to 404. Most specific first.
 */
const oldPages: [source: string, destination: string][] = [
  [ar(OLD_HOME, "أنظمة-مياه-الشرب"), "/ar/solutions/water-supply"],
  [ar(OLD_HOME, ":rest*"), "/ar"],
  [ar("من-نحن", "اتصل-بنا"), "/ar/contact"],
  [ar("من-نحن"), "/ar/about"],
  [ar(AGENCIES, "شركة-جورج-فشر"), "/ar/brands/georg-fischer"],
  [ar(AGENCIES, "شركة-باننجر"), "/ar/brands/baenninger"],
  [ar(AGENCIES, "شركة-بولوبلاست"), "/ar/brands/poloplast"],
  [ar(AGENCIES, "شركة-فيزا"), "/ar/brands/wisa"],
  [ar(AGENCIES, "شركة-داب-dab"), "/ar/brands/dab"],
  // The agencies index, and Calpeda, which is no longer carried.
  [ar(AGENCIES, ":rest*"), "/ar/brands"],
  [ar("مشاريع"), "/ar/projects"],
  ["/ar/project/:slug*", "/ar/projects"],
  ["/project/:slug*", "/en/projects"],
  ["/home/footer", "/en"],
  ["/cart", "/en"],
  ["/checkout", "/en"],
  // The unlisted links page; Arabic was the old site's default language.
  [`/${encodeURIComponent("روابط")}`, "/ar/links"],
  [ar("روابط"), "/ar/links"],
];

const nextConfig: NextConfig = {
  // Self-contained server in .next/standalone for the Docker image (see Dockerfile).
  output: "standalone",
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      ...oldPages.map(([source, destination]) => ({ source, destination, permanent: true })),
      // Polo Egypt is shown as Boroug since 2026-10-05.
      { source: "/:locale(en|ar|ckb)/brands/polo-egypt", destination: "/:locale/brands/boroug", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Logos and share images change rarely; cache for a week, revalidate after.
        source: "/:dir(brand|brands)/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
