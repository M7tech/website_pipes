import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { clients, featuredProjects } from "@/content/projects";
import { SectionHead } from "@/components/ui/SectionHead";
import { TextLink } from "@/components/ui/TextLink";

export async function ProjectIndex() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Home.projects");
  const sectors = await getTranslations("Projects.sectors");

  return (
    <section aria-labelledby="projects-title" className="section-space bg-surface">
      <div className="container-page grid gap-12 md:gap-16">
        <SectionHead
          id="projects-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          intro={t("intro")}
          action={<TextLink href="/projects">{t("cta")}</TextLink>}
        />

        <ol className="grid border-t border-ink md:grid-cols-2 md:gap-x-8">
          {featuredProjects.map((project) => (
            <li key={project.slug} className="flex items-baseline justify-between gap-6 border-b border-rule py-5">
              <span className="font-display-latin text-[clamp(1.25rem,2vw,1.625rem)] font-medium leading-snug">
                {project.name[locale]}
              </span>
              <span className="eyebrow shrink-0 text-steel">{sectors(project.sector)}</span>
            </li>
          ))}
        </ol>

        <div className="grid gap-6 md:grid-cols-12 md:gap-8">
          <h3 className="eyebrow text-steel md:col-span-3 md:pt-1">{t("clientsTitle")}</h3>
          <div className="grid gap-4 md:col-span-9">
          <ul lang="en" dir="ltr" className="flex flex-wrap gap-x-2 gap-y-2 text-[0.9375rem] text-ink/80 rtl:justify-end">
            {clients.map((client) => (
              <li key={client} className="after:ms-2 after:text-rule-strong after:content-['/'] last:after:content-none">
                {client}
              </li>
            ))}
          </ul>
          <p className="text-steel">{t("more")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
