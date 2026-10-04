import { getTranslations } from "next-intl/server";
import type { BrandDocument } from "@/content/brands";
import { Arrow } from "@/components/ui/Arrow";
import { Ltr } from "@/components/ui/Ltr";

/** Downloadable English documents for a brand: catalogues, data sheets and certificates. */
export async function BrandDocuments({ documents }: { documents: BrandDocument[] }) {
  const t = await getTranslations("Brands.documents");

  return (
    <section aria-labelledby="documents-title" className="section-space bg-surface">
      <div className="container-page grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="grid content-start gap-3 border-t-2 border-ink pt-5 md:col-span-3">
          <h2 id="documents-title" className="eyebrow text-steel">
            {t("documents")}
          </h2>
          <p className="text-sm text-steel">{t("documentsNote")}</p>
        </div>
        <ul className="border-t border-rule md:col-span-9">
          {documents.map((doc) => {
            const external = doc.href.startsWith("http");
            const isPdf = /\.pdf($|\?)/i.test(doc.href);
            return (
              <li key={doc.href} className="border-b border-rule">
                <a
                  href={doc.href}
                  target="_blank"
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group grid gap-x-8 gap-y-1 py-5 hover:bg-paper md:grid-cols-9 md:items-baseline"
                >
                  <span className="text-sm text-atlas-blue md:col-span-3">{t(`kinds.${doc.kind}`)}</span>
                  <span lang="en" className="text-lg font-medium md:col-span-4">
                    {doc.title}
                  </span>
                  <span className="flex items-center gap-3 font-mono text-xs text-steel md:col-span-2 md:justify-end">
                    <Ltr>
                      {isPdf ? "PDF" : "WEB"}
                      {doc.sizeKb ? ` · ${doc.sizeKb >= 1024 ? `${(doc.sizeKb / 1024).toFixed(1)} MB` : `${doc.sizeKb} KB`}` : ""}
                    </Ltr>
                    <span className="sr-only">({t("opensNewTab")})</span>
                    <Arrow className="text-atlas-blue transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
