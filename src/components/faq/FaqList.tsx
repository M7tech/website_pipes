import { Fragment, type ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { offices } from "@/content/company";
import { faqValues, type Faq } from "@/content/faq";
import { Ltr } from "@/components/ui/Ltr";
import { TextLink } from "@/components/ui/TextLink";

/** Answer text with its contact placeholders filled; numbers and emails stay left-to-right. */
function answer(text: string, locale: Locale): ReactNode[] {
  const values = faqValues(locale);
  const separator = locale === "en" ? "; " : "؛ ";
  return text.split(/(\{\w+\})/).map((part, i) => {
    const key = part.match(/^\{(\w+)\}$/)?.[1];
    if (!key || !(key in values)) return part;
    if (key === "branches") {
      return (
        <Fragment key={i}>
          {offices.map((o, j) => (
            <Fragment key={o.id}>
              {j > 0 ? separator : null}
              {o.name[locale]}
              {o.phone ? (
                <>
                  {" "}
                  <Ltr className="tabular">{o.phone}</Ltr>
                </>
              ) : null}
            </Fragment>
          ))}
        </Fragment>
      );
    }
    return (
      <Ltr key={i} className="tabular">
        {values[key]}
      </Ltr>
    );
  });
}

/**
 * Questions as disclosure rows. The answers are in the server-rendered HTML whether a row is
 * open or closed, so search engines and AI crawlers read every answer without running scripts.
 */
export async function FaqList({ items, headingLevel = "h3" }: { items: Faq[]; headingLevel?: "h2" | "h3" }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Faq");
  const Heading = headingLevel;

  return (
    <ul className="grid gap-3">
      {items.map((faq) => (
        <li key={faq.id}>
          <details id={`faq-${faq.id}`} className="group rounded-card bg-surface">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 p-5 md:p-6 [&::-webkit-details-marker]:hidden">
              <Heading className="text-lg font-semibold leading-snug [:lang(ar)_&]:leading-normal [:lang(ckb)_&]:leading-normal">
                {faq.q[locale]}
              </Heading>
              <span
                aria-hidden="true"
                className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-paper text-atlas-blue transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-open:rotate-45"
              >
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                  <path d="M8 3v10M3 8h10" />
                </svg>
              </span>
            </summary>
            <div className="grid gap-4 px-5 pb-6 md:px-6">
              <p className="max-w-[72ch] text-steel">{answer(faq.a[locale], locale)}</p>
              {faq.href ? (
                <TextLink href={faq.href} className="justify-self-start text-sm">
                  {t("learnMore")}
                </TextLink>
              ) : null}
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
