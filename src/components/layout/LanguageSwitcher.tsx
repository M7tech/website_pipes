"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { languageNames } from "@/lib/nav";

/** Switches language while keeping the current page. Each language is named in its own script. */
export function LanguageSwitcher({ className = "", onNavigate }: { className?: string; onNavigate?: () => void }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations("Nav");

  return (
    <nav aria-label={t("language")} className={className}>
      <ul className="flex items-center gap-0.5 rounded-full bg-white/8 p-1">
        {routing.locales.map((l) => (
          <li key={l}>
            <Link
              href={pathname}
              locale={l}
              lang={l}
              hrefLang={l}
              aria-current={l === locale ? "true" : undefined}
              onClick={onNavigate}
              className={`block rounded-full px-3 py-1 text-sm transition-colors duration-(--duration-base) ${
                l === locale ? "bg-white/16 text-white" : "text-on-dark-muted hover:text-white"
              } ${l === "en" ? "font-sans" : "font-arabic"}`}
            >
              {languageNames[l]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
