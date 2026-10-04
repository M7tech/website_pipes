import { CITY_POINTS, IRAQ_PATH, IRAQ_VIEWBOX } from "@/content/iraq-map";
import type { Localized } from "@/content/types";
import type { Locale } from "@/i18n/routing";

type City = keyof typeof CITY_POINTS;

type IraqMapProps = {
  locale: Locale;
  label: string;
  officeCities: City[];
  warehouseCities: City[];
  cityNames: Record<City, Localized>;
};

/** Labels sit east of the point, except where neighbours crowd them. */
const labelSide: Partial<Record<City, "west">> = { zakho: "west", najaf: "west", basra: "west" };

/**
 * Geographic map of Iraq. It is never mirrored in RTL: geography has a fixed orientation.
 */
export function IraqMap({ locale, label, officeCities, warehouseCities, cityNames }: IraqMapProps) {
  const cities = Object.keys(CITY_POINTS) as City[];
  return (
    <svg viewBox={IRAQ_VIEWBOX} role="img" aria-label={label} className="h-auto w-full" style={{ direction: "ltr" }}>
      <path d={IRAQ_PATH} className="fill-surface stroke-ink" strokeWidth="1.25" strokeLinejoin="round" />
      {cities.map((city) => {
        const [x, y] = CITY_POINTS[city];
        const office = officeCities.includes(city);
        const warehouse = warehouseCities.includes(city);
        const west = labelSide[city] === "west";
        return (
          <g key={city}>
            {warehouse ? (
              <rect x={x - 9} y={y - 9} width="18" height="18" className="fill-none stroke-atlas-blue" strokeWidth="1.5" />
            ) : null}
            {office ? <circle cx={x} cy={y} r="5" className="fill-atlas-blue" /> : null}
            <text
              x={west ? x - 16 : x + 16}
              y={y + 5}
              textAnchor={west ? "end" : "start"}
              className="fill-ink"
              fontSize="20"
              fontFamily={locale === "en" ? "var(--font-plex)" : "var(--font-plex-arabic)"}
            >
              {cityNames[city][locale]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
