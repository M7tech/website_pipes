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
  /** "dark" draws the outline for navy backgrounds (hero). */
  tone?: "light" | "dark";
  className?: string;
  /** Office cities become links (Google Maps) when given. */
  cityLinks?: Partial<Record<City, { href: string; label: string }>>;
};

/** Labels sit east of the point, except where neighbours crowd them. */
const labelSide: Partial<Record<City, "west">> = { zakho: "west", najaf: "west", basra: "west" };

/**
 * Geographic map of Iraq. It is never mirrored in RTL: geography has a fixed orientation.
 */
export function IraqMap({ locale, label, officeCities, warehouseCities, cityNames, tone = "light", className = "", cityLinks }: IraqMapProps) {
  const dark = tone === "dark";
  const cities = Object.keys(CITY_POINTS) as City[];
  return (
    <svg
      viewBox={IRAQ_VIEWBOX}
      role={cityLinks ? "group" : "img"}
      aria-label={label}
      className={`h-auto w-full ${className}`}
      style={{ direction: "ltr" }}
    >
      <path d={IRAQ_PATH} className={dark ? "fill-atlas-navy-deep/40 stroke-on-dark-muted" : "fill-surface stroke-ink"} strokeWidth="1.25" strokeLinejoin="round" />
      {cities.map((city) => {
        const [x, y] = CITY_POINTS[city];
        const office = officeCities.includes(city);
        const warehouse = warehouseCities.includes(city);
        const west = labelSide[city] === "west";
        const link = cityLinks?.[city];
        const marker = (
          <>
            {warehouse ? (
              <rect x={x - 9} y={y - 9} width="18" height="18" className={dark ? "fill-none stroke-atlas-sky" : "fill-none stroke-atlas-blue"} strokeWidth="1.5" />
            ) : null}
            {office ? (
              <>
                {/* Water ripple: expanding rings around each office (static when motion is reduced). */}
                <circle cx={x} cy={y} r="5" className={`ripple-ring ${dark ? "stroke-on-dark" : "stroke-atlas-blue"}`} fill="none" strokeWidth="1.5" />
                <circle cx={x} cy={y} r="5" className={`ripple-ring ripple-ring-late ${dark ? "stroke-on-dark" : "stroke-atlas-blue"}`} fill="none" strokeWidth="1.5" />
                <circle cx={x} cy={y} r="5" className={dark ? "fill-on-dark" : "fill-atlas-blue"} />
              </>
            ) : null}
            <text
              x={west ? x - 16 : x + 16}
              y={y + 5}
              textAnchor={west ? "end" : "start"}
              className={dark ? "fill-on-dark" : "fill-ink"}
              fontSize="20"
              fontFamily={locale === "en" ? "var(--font-plex)" : "var(--font-plex-arabic)"}
            >
              {cityNames[city][locale]}
            </text>
          </>
        );
        return link ? (
          <a key={city} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label} className="map-link">
            {marker}
          </a>
        ) : (
          <g key={city}>{marker}</g>
        );
      })}
    </svg>
  );
}
