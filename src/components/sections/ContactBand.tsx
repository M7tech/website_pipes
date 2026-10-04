import { getTranslations } from "next-intl/server";
import { company } from "@/content/company";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Ltr } from "@/components/ui/Ltr";

export async function ContactBand() {
  const t = await getTranslations("Home.contact");
  const whatsappDigits = company.whatsapp.replace(/\D/g, "");

  const lines = [
    { label: t("whatsapp"), value: company.whatsapp, href: `https://wa.me/${whatsappDigits}` },
    { label: t("projects"), value: company.projectsPhone, href: `tel:${company.projectsPhone.replace(/\s/g, "")}` },
    { label: t("email"), value: company.email, href: `mailto:${company.email}` },
  ];

  return (
    <section aria-labelledby="contact-title" className="on-dark section-space bg-atlas-navy text-on-dark">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="grid content-start gap-6 border-t-2 border-on-dark pt-5 lg:col-span-6">
          <p className="eyebrow text-on-dark-muted">{t("eyebrow")}</p>
          <h2
            id="contact-title"
            className="font-display-latin max-w-[16ch] text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1] [:lang(ar)_&]:leading-[1.3] [:lang(ckb)_&]:leading-[1.3]"
          >
            {t("title")}
          </h2>
          <p className="text-on-dark-muted">{t("hours")}</p>
          <div>
            <ButtonLink href="/contact" variant="inverse">
              {t("cta")}
            </ButtonLink>
          </div>
        </div>

        <div className="grid content-start gap-0 lg:col-span-5 lg:col-start-8">
          <a href={`tel:${company.mainPhone}`} className="group grid gap-2 border-t border-rule-dark py-6">
            <span className="eyebrow text-on-dark-muted">{t("mainLine")}</span>
            <span className="font-display-latin text-[clamp(3.5rem,9vw,7rem)] font-semibold leading-none tabular group-hover:text-white">
              <Ltr>{company.mainPhone}</Ltr>
            </span>
          </a>
          {lines.map((line) => (
            <a
              key={line.label}
              href={line.href}
              {...(line.href.startsWith("https") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule-dark py-4 hover:text-white"
            >
              <span className="text-on-dark-muted">{line.label}</span>
              <span className="font-mono tabular">
                <Ltr>{line.value}</Ltr>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
