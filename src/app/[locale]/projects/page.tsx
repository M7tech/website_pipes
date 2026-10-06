import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { brandBySlug } from "@/content/brands";
import { clients, governorateNames, projects, sectorOrder } from "@/content/projects";
import { pageLd, pageMetadata } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactBand } from "@/components/sections/ContactBand";

export async function generateMetadata({ params }: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/projects",
    title: meta("projectsTitle"),
    description: meta("projectsDescription"),
    siteName: meta("siteName"),
    imageAlt: meta("ogImageAlt"),
  });
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ProjectsPage");
  const home = await getTranslations("Home.projects");
  const sectors = await getTranslations("Projects.sectors");
  const nav = await getTranslations("Nav");
  const meta = await getTranslations("Meta");
  const common = await getTranslations("Common");
  const sectorsShown = sectorOrder.filter((sector) => projects.some((p) => p.sector === sector));

  return (
    <>
      <JsonLd
        data={pageLd({
          locale: locale as Locale,
          path: "/projects",
          type: "CollectionPage",
          name: meta("projectsTitle"),
          description: meta("projectsDescription"),
          crumbs: [
            { name: nav("home"), path: "/" },
            { name: nav("projects"), path: "/projects" },
          ],
        })}
      />
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
        breadcrumbLabel={common("breadcrumb")}
        crumbs={[{ label: nav("home"), href: "/" }, { label: nav("projects") }]}
      />

      <section aria-labelledby="selected-title" className="section-space">
        <div className="container-page grid gap-10">
          <h2 id="selected-title" className="section-title">
            {t("selected")}
          </h2>
          <div className="grid gap-3 md:gap-4">
            {sectorsShown.map((sector) => (
              <div key={sector} className="grid gap-x-8 gap-y-4 rounded-card bg-surface p-6 md:grid-cols-12 md:p-8">
                <h3 className="md:col-span-3">
                  <span className="inline-flex rounded-full bg-atlas-blue/8 px-3 py-1 text-sm font-semibold text-atlas-blue">{sectors(sector)}</span>
                </h3>
                <ul className="grid gap-x-8 gap-y-3 md:col-span-9 md:grid-cols-2">
                  {projects
                    .filter((p) => p.sector === sector)
                    .map((p) => (
                      <li key={p.slug} className="grid content-start gap-1">
                        <span className="font-display-latin text-[clamp(1.25rem,2vw,1.625rem)] font-semibold leading-snug">
                          {p.name[locale as Locale]}
                        </span>
                        {p.governorate || p.brands?.length ? (
                          <span className="flex flex-wrap gap-x-2 text-sm text-steel">
                            {p.governorate ? <span>{governorateNames[p.governorate][locale as Locale]}</span> : null}
                            {p.brands?.map((b) => (
                              <span key={b} lang="en" className="before:me-2 before:content-['·'] first:before:hidden">
                                {brandBySlug(b).name}
                              </span>
                            ))}
                          </span>
                        ) : null}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="clients-title" className="section-space bg-surface">
        <div className="container-page grid gap-10">
          <h2 id="clients-title" className="section-title">
            {home("clientsTitle")}
          </h2>
          <div className="grid gap-5">
            <ul lang="en" dir="ltr" className="flex flex-wrap gap-2 text-ink/85 rtl:justify-end">
              {clients.map((client) => (
                <li key={client} className="rounded-full bg-paper px-4 py-2">
                  {client}
                </li>
              ))}
            </ul>
            <p className="text-steel">{home("more")}</p>
          </div>
        </div>
      </section>
      <ContactBand />
    </>
  );
}
