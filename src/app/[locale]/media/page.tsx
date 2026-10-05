import type { Metadata } from "next";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { videoEmbed, videoThumbnail, videoUrl, youtube } from "@/content/media";
import { channelVideos } from "@/lib/youtube";
import { ORG_ID, localeUrl, pageLd, pageMetadata } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { Arrow } from "@/components/ui/Arrow";
import { VideoGallery } from "@/components/media/VideoGallery";
import { ContactBand } from "@/components/sections/ContactBand";

/** Re-read the channel feed hourly (see lib/youtube.ts). */
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/[locale]/media">): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/media",
    title: meta("mediaTitle"),
    description: meta("mediaDescription"),
    siteName: meta("siteName"),
    imageAlt: meta("ogImageAlt"),
  });
}

export default async function MediaPage({ params }: PageProps<"/[locale]/media">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Media");
  const nav = await getTranslations("Nav");
  const meta = await getTranslations("Meta");
  const common = await getTranslations("Common");
  const format = await getFormatter();

  const feed = await channelVideos();
  const videos = feed.map((v) => {
    const title = v.title ?? t("untitled");
    return {
      id: v.id,
      title,
      playLabel: t("play", { title }),
      date: v.published
        ? { iso: v.published, text: format.dateTime(new Date(v.published), { year: "numeric", month: "long", day: "numeric" }) }
        : undefined,
    };
  });

  // Search engines get each video that has its YouTube title and date.
  const videoLd = feed
    .filter((v) => v.title && v.published)
    .map((v) => ({
      "@type": "VideoObject",
      name: v.title,
      description: v.title,
      thumbnailUrl: videoThumbnail(v.id),
      uploadDate: v.published,
      embedUrl: videoEmbed(v.id).split("?")[0],
      url: videoUrl(v.id),
      publisher: { "@id": ORG_ID },
    }));

  return (
    <>
      <JsonLd
        data={pageLd({
          locale: locale as Locale,
          path: "/media",
          type: "CollectionPage",
          name: meta("mediaTitle"),
          description: meta("mediaDescription"),
          crumbs: [
            { name: nav("home"), path: "/" },
            { name: nav("media"), path: "/media" },
          ],
          extra: videoLd.length
            ? [{ "@id": `${localeUrl(locale as Locale, "/media")}#videos`, "@type": "ItemList", itemListElement: videoLd.map((item, i) => ({ "@type": "ListItem", position: i + 1, item })) }]
            : [],
        })}
      />
      <PageHeader
        eyebrow={t("eyebrow")}
        icon="video"
        title={t("title")}
        intro={t("intro")}
        breadcrumbLabel={common("breadcrumb")}
        crumbs={[{ label: nav("home"), href: "/" }, { label: nav("media") }]}
      >
        <div>
          <a
            href={youtube.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative isolate inline-flex min-h-12 items-center gap-3 overflow-hidden bg-paper px-6 text-[0.9375rem] font-medium text-atlas-navy transition-[color,background-color,border-color,scale] duration-(--duration-base) ease-(--ease-out-expo) active:scale-[0.97] active:duration-(--duration-fast)"
          >
            <span aria-hidden="true" className="liquid -z-10 bg-white" />
            <Icon name="video" className="size-5 text-atlas-blue" />
            <span>{t("channel")}</span>
            <Arrow className="transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </a>
        </div>
      </PageHeader>

      <section aria-labelledby="videos-title" className="section-space">
        <div className="container-page grid gap-10">
          <h2 id="videos-title" className="eyebrow border-t-2 border-ink pt-5 text-steel">
            {t("videos", { count: videos.length })}
          </h2>
          <VideoGallery
            videos={videos}
            listLabel={t("all")}
            aside={
              <div className="grid gap-4 border-t-2 border-atlas-blue bg-paper p-6">
                <Icon name="video" className="size-8 text-atlas-blue" />
                <p className="text-steel">{t("more")}</p>
                <a
                  href={youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  lang="en"
                  className="inline-flex items-center gap-2 font-medium text-atlas-blue underline-offset-4 hover:underline"
                >
                  youtube.com/@atlasplast
                  <Arrow />
                </a>
              </div>
            }
          />
        </div>
      </section>

      <ContactBand />
    </>
  );
}
