import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { boardMembers, chairman, type Leader } from "@/content/leadership";
import { ORG_ID, SITE_URL, pageLd, pageMetadata } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";

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

function Portrait({ leader, locale, sizes, priority = false }: { leader: Leader; locale: Locale; sizes: string; priority?: boolean }) {
  return (
    <Image
      src={leader.photo.src}
      width={leader.photo.width}
      height={leader.photo.height}
      alt={leader.name[locale]}
      sizes={sizes}
      priority={priority}
      className="aspect-[4/5] w-full bg-surface object-cover object-top"
    />
  );
}

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
      />

      <section aria-labelledby="message-by" className="section-space">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Signed at the end of the message, so the portrait needs no caption. */}
          <div className="max-w-80 lg:col-span-4 lg:max-w-none">
            <Portrait leader={chairman} locale={locale} sizes="(min-width: 1024px) 28vw, 20rem" priority />
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
            <p id="message-by" className="mt-4 grid gap-1 border-t border-rule pt-6">
              <span className="text-xl font-semibold">{chairman.name[locale]}</span>
              <span className="text-steel">{chairman.role[locale]}</span>
            </p>
          </article>
        </div>
      </section>

      <section aria-labelledby="board-title" className="section-space bg-surface">
        <div className="container-page grid gap-10">
          <h2 id="board-title" className="eyebrow border-t-2 border-ink pt-5 text-steel">
            {t("membersTitle")}
          </h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {boardMembers.map((member) => (
              <li key={member.id}>
                <figure className="grid gap-4">
                  <Portrait leader={member} locale={locale} sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 45vw" />
                  <figcaption className="grid gap-1">
                    <span className="text-lg font-semibold">{member.name[locale]}</span>
                    <span className="text-sm text-steel">{member.role[locale]}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
