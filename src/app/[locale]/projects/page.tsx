import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { clients, featuredProjects, type Sector } from "@/content/projects";
import { pageMetadata } from "@/lib/site";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactBand } from "@/components/sections/ContactBand";

export async function generateMetadata({ params }: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: "Nav" });
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/projects",
    title: nav("projects"),
    description: meta("projectsDescription"),
    siteName: meta("siteName"),
  });
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ProjectsPage");
  const home = await getTranslations("Home.projects");
  const sectors = await getTranslations("Projects.sectors");
  const nav = await getTranslations("Nav");
  const common = await getTranslations("Common");
  const sectorOrder = [...new Set(featuredProjects.map((p) => p.sector))] as Sector[];

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
        breadcrumbLabel={common("breadcrumb")}
        crumbs={[{ label: nav("home"), href: "/" }, { label: nav("projects") }]}
      />

      <section aria-labelledby="selected-title" className="section-space">
        <div className="container-page grid gap-10">
          <h2 id="selected-title" className="eyebrow border-t-2 border-ink pt-5 text-steel">
            {t("selected")}
          </h2>
          <div className="grid">
            {sectorOrder.map((sector) => (
              <div key={sector} className="grid gap-x-8 gap-y-3 border-b border-rule py-8 md:grid-cols-12">
                <h3 className="eyebrow pt-1.5 text-atlas-blue md:col-span-3">{sectors(sector)}</h3>
                <ul className="grid gap-x-8 gap-y-3 md:col-span-9 md:grid-cols-2">
                  {featuredProjects
                    .filter((p) => p.sector === sector)
                    .map((p) => (
                      <li
                        key={p.slug}
                        className="font-display-latin text-[clamp(1.25rem,2vw,1.625rem)] font-medium leading-snug"
                      >
                        {p.name[locale as Locale]}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="clients-title" className="section-space bg-surface">
        <div className="container-page grid gap-6 md:grid-cols-12 md:gap-8">
          <h2 id="clients-title" className="eyebrow border-t-2 border-ink pt-5 text-steel md:col-span-3">
            {home("clientsTitle")}
          </h2>
          <div className="grid gap-4 md:col-span-9 md:pt-5">
            <ul lang="en" className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {clients.map((client) => (
                <li key={client} className="border-b border-rule py-3 text-ink/85">
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
