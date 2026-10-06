import { getTranslations } from "next-intl/server";
import { SectionHead } from "@/components/ui/SectionHead";
import { TextLink } from "@/components/ui/TextLink";
import { SolutionList } from "@/components/solutions/SolutionList";

/** Home section: every solution, each linking to its page. */
export async function SolutionIndex() {
  const t = await getTranslations("Home.solutions");

  return (
    <section aria-labelledby="solutions-title" className="section-space bg-surface">
      <div className="container-page grid gap-12 md:gap-16">
        <SectionHead
          id="solutions-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          intro={t("intro")}
          action={<TextLink href="/solutions">{t("cta")}</TextLink>}
        />
        <SolutionList />
      </div>
    </section>
  );
}
