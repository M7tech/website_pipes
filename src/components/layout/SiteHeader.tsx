"use client";

import { ScrollWater } from "@/components/water/ScrollWater";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { Link, usePathname } from "@/i18n/navigation";
import { primaryNav, contactHref } from "@/lib/nav";
import { easeOutExpo } from "@/lib/motion";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Arrow } from "@/components/ui/Arrow";

export function SiteHeader() {
  const t = useTranslations("Nav");
  const brand = useTranslations("Common")("brandName");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const headerRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // While the mobile menu is open: lock page scroll, make the page behind it inert,
  // keep Tab inside the header, close on Escape, and return focus to the burger on close.
  useEffect(() => {
    if (!open) return;
    const behind = [document.getElementById("main"), document.getElementById("site-footer")];
    behind.forEach((el) => el?.setAttribute("inert", ""));
    document.documentElement.style.overflow = "hidden";
    const burger = burgerRef.current;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab" || !headerRef.current) return;
      const focusable = [
        ...headerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ].filter((el) => el.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      behind.forEach((el) => el?.removeAttribute("inert"));
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      burger?.focus();
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header ref={headerRef} className="on-dark sticky top-0 z-40 bg-atlas-navy text-on-dark">
      <div className="container-page flex h-16 items-center justify-between gap-6 md:h-20">
        <Link href="/" className="shrink-0" aria-label={brand}>
          <Logo tone="white" label={brand} className="!h-11 !w-auto md:!h-14" />
        </Link>

        <nav aria-label={t("label")} className="hidden lg:block">
          <ul className="flex items-center gap-6 xl:gap-8">
            {primaryNav.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="relative py-2 text-[0.9375rem] text-on-dark/90 transition-colors hover:text-white aria-[current=page]:text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-(--duration-base) hover:after:scale-x-100 aria-[current=page]:after:scale-x-100 rtl:after:origin-right"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher />
          <Link
            href={contactHref}
            className="group inline-flex min-h-11 items-center gap-2 border border-on-dark/50 px-4 text-sm transition-[color,background-color,border-color,scale] duration-(--duration-base) ease-(--ease-out-expo) hover:border-white hover:bg-white/10 active:scale-[0.97] active:duration-(--duration-fast)"
          >
            {t("contact")}
            <Arrow />
          </Link>
        </div>

        <button
          ref={burgerRef}
          type="button"
          className="-me-2 inline-flex size-11 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t("closeMenu") : t("openMenu")}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className="relative block h-3 w-6">
            <span className={`absolute inset-x-0 top-0 h-px bg-current transition-transform duration-(--duration-base) ${open ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-(--duration-base) ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <m.div
            id="mobile-menu"
            className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-atlas-navy md:top-20 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <nav aria-label={t("label")} className="container-page flex min-h-full flex-col py-8">
              <ul className="border-t border-rule-dark">
                {[...primaryNav, { key: "contact", href: contactHref } as const].map((item, i) => (
                  <m.li
                    key={item.key}
                    className="border-b border-rule-dark"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(12px)" }}
                    animate={reduce ? { opacity: 1 } : { opacity: 1, transform: "translateY(0px)" }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.4, ease: easeOutExpo }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="font-display-latin flex items-center justify-between py-4 text-[1.75rem] font-medium"
                    >
                      {t(item.key)}
                      <Arrow className="text-on-dark-muted" />
                    </Link>
                  </m.li>
                ))}
              </ul>
              <LanguageSwitcher className="mt-8 -ms-2.5" onNavigate={() => setOpen(false)} />
            </nav>
          </m.div>
        ) : null}
      </AnimatePresence>
      <ScrollWater />
    </header>
  );
}
