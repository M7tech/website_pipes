import { getTranslations } from "next-intl/server";
import { company } from "@/content/company";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Ltr } from "@/components/ui/Ltr";

/** Navy call-to-action band with the main sales line, used on solution and brand pages. */
export async function EnquiryBand({ title, text }: { title: string; text: string }) {
  const t = await getTranslations("Solutions.labels");
  const contact = await getTranslations("Home.contact");

  return (
    <section aria-labelledby="enquire-title" className="on-dark bg-atlas-navy text-on-dark">
      <div className="container-page grid gap-8 py-14 md:grid-cols-12 md:items-end md:gap-8 md:py-20">
        <div className="grid gap-4 md:col-span-7">
          <h2
            id="enquire-title"
            className="font-display-latin text-[clamp(1.875rem,3.6vw,3rem)] font-semibold leading-[1.05] [:lang(ar)_&]:leading-[1.35] [:lang(ckb)_&]:leading-[1.35]"
          >
            {title}
          </h2>
          <p className="max-w-[48ch] text-on-dark-muted">{text}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 md:col-span-5 md:justify-end">
          <ButtonLink href="/contact" variant="inverse">
            {t("enquireCta")}
          </ButtonLink>
          <a href={`tel:${company.mainPhone}`} className="grid">
            <span className="text-sm text-on-dark-muted">{contact("mainLine")}</span>
            <span className="font-display-latin text-3xl font-semibold tabular">
              <Ltr>{company.mainPhone}</Ltr>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
