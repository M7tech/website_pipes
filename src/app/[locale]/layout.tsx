import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, getDirection, type Locale } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MotionProvider } from "@/components/motion/MotionProvider";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("homeTitle"), template: `%s | ${t("siteName")}` },
    description: t("homeDescription"),
    applicationName: t("siteName"),
    // Full-size image previews and unlimited snippets in search results and AI answers.
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    // Search Console and Bing Webmaster Tools ownership tags, set as build variables when used.
    verification: {
      ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
      ...(process.env.BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } } : {}),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#14284a",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Common" });

  return (
    <html lang={locale} dir={getDirection(locale as Locale)} className={fontVariables}>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <MotionProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:bg-surface focus:px-4 focus:py-2"
            >
              {t("skipToContent")}
            </a>
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
