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

        <ol className="shelf gap-3 sm:grid sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <li key={project.slug} className="grid min-h-36 content-between gap-6 rounded-card bg-paper p-6 md:min-h-40">
              <span className="inline-flex justify-self-start rounded-full bg-surface px-3 py-1 text-sm font-medium text-atlas-blue">
                {sectors(project.sector)}
              </span>
              <span className="font-display-latin text-[clamp(1.25rem,1.9vw,1.5rem)] font-semibold leading-snug">
                {project.name[locale]}
              </span>
            </li>
          ))}
        </ol>

        <div className="grid gap-5">
          <h3 className="eyebrow text-steel">{t("clientsTitle")}</h3>
          <ul lang="en" dir="ltr" className="flex flex-wrap gap-2 text-[0.9375rem] text-ink/80 rtl:justify-end">
            {clients.map((client) => (
              <li key={client} className="rounded-full bg-paper px-3.5 py-1.5">
                {client}
              </li>
            ))}
          </ul>
          <p className="text-steel">{t("more")}</p>
        </div>
      </div>
    </section>
  );
}
