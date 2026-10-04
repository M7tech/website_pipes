/**
 * Moving water surface for the foot of a dark band. Three wave layers drift at
 * different speeds; the front layer is filled with the colour of the section
 * below (`fillClass`), so the band appears to end in water. Decorative only.
 */
const WAVE =
  "M0 40 C 150 75 450 5 600 40 C 750 75 1050 5 1200 40 C 1350 75 1650 5 1800 40 C 1950 75 2250 5 2400 40 V 80 H 0 Z";

const layers = [
  { speed: "22s", opacity: 0.25, height: "100%" },
  { speed: "15s", opacity: 0.45, height: "82%" },
  { speed: "10s", opacity: 1, height: "64%" },
];

export function Waves({ fillClass = "fill-paper", className = "" }: { fillClass?: string; className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 bottom-0 h-12 overflow-hidden md:h-20 ${className}`} style={{ direction: "ltr" }}>
      {layers.map((l, i) => (
        <svg
          key={i}
          viewBox="0 0 2400 80"
          preserveAspectRatio="none"
          className={`wave-layer absolute bottom-0 left-0 w-[200%] ${fillClass}`}
          style={{ opacity: l.opacity, height: l.height, ["--wave-speed" as string]: l.speed }}
        >
          <path d={WAVE} />
        </svg>
      ))}
    </div>
  );
}
