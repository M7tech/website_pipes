import { getTranslations } from "next-intl/server";
import { PurposeMotion } from "./PurposeMotion";

const statements = [
  { key: "vision", icon: "eye" },
  { key: "mission", icon: "target" },
] as const;

const values = [
  { key: "quality", icon: "award" },
  { key: "integrity", icon: "shieldCheck" },
  { key: "respect", icon: "heart" },
  { key: "innovation", icon: "bulb" },
  { key: "consistency", icon: "layers" },
  { key: "teamwork", icon: "users" },
] as const;

/**
 * About: vision, mission and values. The statements combine the old site's
 * (water and sewage networks) with the company profile's (sanitaryware, p6);
 * the values are the profile's.
 */
export async function Purpose() {
  const t = await getTranslations("About.purpose");

  return (
    <PurposeMotion
      eyebrow={t("eyebrow")}
      statements={statements.map(({ key, icon }) => ({
        key,
        icon,
        title: t(`${key}Title`),
        text: t(key),
      }))}
      valuesTitle={t("valuesTitle")}
      values={values.map(({ key, icon }) => ({ key, icon, label: t(`values.${key}`) }))}
    />
  );
}
