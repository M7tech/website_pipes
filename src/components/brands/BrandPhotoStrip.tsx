import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { brands, type Brand } from "@/content/brands";
import { CurrentStrip } from "./CurrentStrip";

function Card({ brand, alt }: { brand: Brand; alt: string }) {
  return (
    <Link href={`/brands/${brand.slug}`} className="group pressable grid w-64 shrink-0 gap-3 md:w-80">
      <span className="relative block aspect-[16/10] overflow-hidden rounded-card bg-atlas-navy">
        <Image
          src={brand.photo!.src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 320px, 256px"
          className="object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-105"
        />
      </span>
      <span lang="en" className="font-display-latin text-lg font-semibold group-hover:text-atlas-blue">
        {brand.name}
      </span>
    </Link>
  );
}

/**
 * Manufacturer photos drifting past like a current. The list is rendered twice
 * so the loop is seamless; the copy is hidden from assistive tech and keyboard.
 * With reduced motion the strip becomes a plain horizontal scroller.
 */
export async function BrandPhotoStrip({ label }: { label: string }) {
  const t = await getTranslations("Brands");
  const hero = await getTranslations("Home.hero");
  const pictured = brands.filter((b) => b.photo);
  const alt = (b: Brand) => t("photoAlt", { subject: b.photo!.subject ?? b.name });

  return (
    <CurrentStrip label={label} pause={hero("pause")} play={hero("play")}>
      <div className="current-track flex w-max gap-6" style={{ ["--current-speed" as string]: `${pictured.length * 7}s` }}>
        <ul className="flex gap-6">
          {pictured.map((b) => (
            <li key={b.slug}>
              <Card brand={b} alt={alt(b)} />
            </li>
          ))}
        </ul>
        <ul aria-hidden="true" inert className="current-dup flex gap-6">
          {pictured.map((b) => (
            <li key={b.slug}>
              <Card brand={b} alt="" />
            </li>
          ))}
        </ul>
      </div>
    </CurrentStrip>
  );
}
