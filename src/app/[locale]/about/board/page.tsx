import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { boardMembers, chairman, type Leader } from "@/content/leadership";
import { ORG_ID, SITE_URL, pageLd, pageMetadata } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHead } from "@/components/ui/SectionHead";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ContactBand } from "@/components/sections/ContactBand";

export async function generateMetadata({ params }: PageProps<"/[locale]/about/board">): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/about/board",
    title: meta("boardTitle"),
    description: meta("boardDescription"),
    siteName: meta("siteName"),
    imageAlt: meta("ogImageAlt"),
  });
}

const paragraphs = ["p1", "p2", "p3", "p4"] as const;

/** The three values the chairman names in his message (Board.message.p3). */
const values: { key: "excellence" | "integrity" | "progress"; icon: IconName }[] = [
  { key: "excellence", icon: "award" },
  { key: "integrity", icon: "shieldCheck" },
  { key: "progress", icon: "trendUp" },
];

/** About → Board of Directors: the chairman's message, then the board members. */
export default async function BoardPage({ params }: PageProps<"/[locale]/about/board">) {
  const { locale: param } = await params;
  setRequestLocale(param);
  const locale = param as Locale;
  const t = await getTranslations("Board");
  const nav = await getTranslations("Nav");
  const meta = await getTranslations("Meta");
  const common = await getTranslations("Common");

  const person = (leader: Leader) => ({
    "@type": "Person",
    name: leader.name[locale],
    jobTitle: leader.role[locale],
    image: `${SITE_URL}${leader.photo.src}`,
    worksFor: { "@id": ORG_ID },
  });

  return (
    <>
      <JsonLd
        data={pageLd({
          locale,
          path: "/about/board",
          name: meta("boardTitle"),
          description: meta("boardDescription"),
          crumbs: [
            { name: nav("home"), path: "/" },
            { name: nav("about"), path: "/about" },
            { name: t("eyebrow"), path: "/about/board" },
          ],
          extra: [chairman, ...boardMembers].map(person),
        })}
      />
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        breadcrumbLabel={common("breadcrumb")}
        crumbs={[{ label: nav("home"), href: "/" }, { label: nav("about"), href: "/about" }, { label: t("eyebrow") }]}
        aside={
          // Stands in the header's wave edge: the negative margin cancels the band's bottom padding.
          <div className="rise-from-water relative -mb-20 w-full max-w-64 sm:max-w-72 md:-mb-28 lg:max-w-80">
            {/* An open frame offset behind the photo, so the portrait reads as placed, not pasted. */}
            <div aria-hidden="true" className="absolute -end-4 -top-4 bottom-16 start-4 rounded-panel border border-atlas-sky/60 md:-end-6 md:-top-6" />
            <Image
              src={chairman.photo.src}
              width={chairman.photo.width}
              height={chairman.photo.height}
              alt={chairman.name[locale]}
              sizes="(min-width: 1024px) 20rem, (min-width: 640px) 18rem, 16rem"
              priority
              className="relative w-full rounded-t-card"
            />
          </div>
        }
      >
        <blockquote className="grid gap-6 border-s-2 border-atlas-sky ps-6">
          <p className="font-display-latin max-w-[30ch] text-[clamp(1.35rem,2.2vw,1.9rem)] font-medium leading-[1.3] [:lang(ar)_&]:leading-[1.7] [:lang(ckb)_&]:leading-[1.7]">
            {t("quote")}
          </p>
          <footer className="grid gap-1">
            <span className="text-lg font-semibold">{chairman.name[locale]}</span>
            <span className="text-on-dark-muted">{chairman.role[locale]}</span>
          </footer>
        </blockquote>
      </PageHeader>

      <section aria-labelledby="message-by" className="section-space">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* On phones the values follow the message; the hanging quote mark shows only beside it on wide screens. */}
          <div className="order-last lg:order-none lg:col-span-4">
            <div className="grid gap-8 lg:sticky lg:top-32">
              <span aria-hidden="true" className="font-display-latin hidden h-20 text-[9rem] leading-[0.85] text-atlas-sky rtl:-scale-x-100 lg:block">
                “
              </span>
              <div className="grid gap-4">
                <h2 className="eyebrow text-atlas-blue">{t("valuesTitle")}</h2>
                <ul className="divide-y divide-rule/70 rounded-card bg-surface">
                  {values.map((v) => (
                    <li key={v.key} className="flex items-center gap-4 px-5 py-4">
                      <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-atlas-blue/8 text-atlas-blue">
                        <Icon name={v.icon} />
                      </span>
                      <span className="font-display-latin text-xl font-semibold">{t(`values.${v.key}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <article className="grid content-start gap-6 lg:col-span-7 lg:col-start-6">
            {paragraphs.map((key, i) => (
              <p
                key={key}
                className={
                  i === 0
                    ? "font-display-latin text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-[1.25] [:lang(ar)_&]:leading-[1.6] [:lang(ckb)_&]:leading-[1.6]"
                    : "max-w-[62ch] text-lg leading-relaxed text-ink/85"
                }
              >
                {t(`message.${key}`)}
              </p>
            ))}
            <p id="message-by" className="mt-4 flex items-center gap-5 border-t border-rule pt-6">
              <Image
                src={chairman.photo.src}
                width={chairman.photo.width}
                height={chairman.photo.height}
                alt=""
                sizes="4rem"
                className="size-16 shrink-0 rounded-full bg-atlas-navy object-cover object-top"
              />
              <span className="grid gap-1">
                <span className="font-display-latin text-2xl font-semibold">{chairman.name[locale]}</span>
                <span className="text-steel">{chairman.role[locale]}</span>
              </span>
            </p>
          </article>
        </div>
      </section>

      <section aria-labelledby="board-title" className="section-space bg-surface">
        <div className="container-page grid gap-12">
          <SectionHead id="board-title" eyebrow={t("eyebrow")} title={t("membersTitle")} />
          <ul className="grid max-w-3xl grid-cols-2 gap-3 sm:gap-4">
            {boardMembers.map((member) => (
              <li key={member.id} className="surface-in">
                <figure className="group relative isolate overflow-hidden rounded-card bg-atlas-navy">
                  <Image
                    src={member.photo.src}
                    width={member.photo.width}
                    height={member.photo.height}
                    alt={member.name[locale]}
                    sizes="(min-width: 640px) 22rem, 50vw"
                    className="aspect-[4/5] w-full object-cover object-top transition-[scale] duration-(--duration-reveal) ease-(--ease-out-expo) group-hover:scale-[1.04]"
                  />
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-atlas-navy via-atlas-navy/70 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 grid gap-1 p-4 text-on-dark sm:p-6">
                    <span className="font-display-latin text-lg font-semibold sm:text-2xl">{member.name[locale]}</span>
                    <span className="text-sm text-on-dark-muted">{member.role[locale]}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactBand />
    </>
  );
}
