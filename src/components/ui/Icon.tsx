import type { ReactNode } from "react";

/**
 * Line icons (24 px grid, 1.5 stroke) that name an idea next to its text.
 * Always decorative: the adjacent text carries the meaning.
 */
const icons = {
  // Solutions
  waterSupply: (
    <>
      <path d="M3 8h9a4 4 0 0 1 4 4v9" />
      <path d="M3 12h7a2 2 0 0 1 2 2v7" />
      <path d="M19 3.5s2 2.2 2 3.6a2 2 0 0 1-4 0c0-1.4 2-3.6 2-3.6z" />
    </>
  ),
  drainage: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 8.5h8M6.5 12h11M8 15.5h8" />
    </>
  ),
  waterHeater: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="3" />
      <path d="M12 17.5c-1.2 0-2-.9-2-2 0-1.6 2-3.3 2-3.3s2 1.7 2 3.3c0 1.1-.8 2-2 2z" />
      <path d="M10 6.5h4" />
    </>
  ),
  network: (
    <>
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="12" cy="18.5" r="2" />
      <path d="M7 6h10M6 7.8l5 9M18 7.8l-5 9" />
    </>
  ),
  toilet: (
    <>
      <path d="M6 3h5v8H6z" />
      <path d="M4.5 11h15c0 3.6-2.6 6-6 6h-3c-3.4 0-6-2.4-6-6z" />
      <path d="M9 17l-1 4h8l-1-4" />
    </>
  ),
  pump: (
    <>
      <circle cx="10" cy="13" r="6" />
      <circle cx="10" cy="13" r="1.5" />
      <path d="M16 11h5v4h-5M8 7V3h4v4" />
    </>
  ),
  faucet: (
    <>
      <path d="M3 9h9a5 5 0 0 1 5 5v1h-3v-1a2 2 0 0 0-2-2H3" />
      <path d="M7 9V5M5 5h4" />
      <path d="M15.5 18s1 1.1 1 1.8a1 1 0 0 1-2 0c0-.7 1-1.8 1-1.8z" />
    </>
  ),
  wrench: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" />,
  tiles: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  // Threaded elbow: two pipe walls turning 90 degrees, with a collar at each end.
  fitting: (
    <>
      <path d="M3 6.5h8a7 7 0 0 1 7 7V21" />
      <path d="M3 11.5h8a2 2 0 0 1 2 2V21" />
      <path d="M5.5 5v8M11.5 18.5h8" />
    </>
  ),
  // Company facts and services
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14l-1.5 7 5-3 5 3-1.5-7" />
    </>
  ),
  graduation: (
    <>
      <path d="M2 9l10-5 10 5-10 5z" />
      <path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6" />
    </>
  ),
  warehouse: (
    <>
      <path d="M3 21V9l9-5 9 5v12" />
      <path d="M7 21v-8h10v8M7 17h10" />
    </>
  ),
  truck: (
    <>
      <path d="M2 6h11v10H2zM13 9h4l4 4v3h-8" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  helmet: (
    <>
      <path d="M3 17h18M5 17a7 7 0 0 1 14 0" />
      <path d="M10 10.5V6.5h4v4" />
    </>
  ),
  headset: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <path d="M4 14h3v5H4zM17 14h3v5h-3zM20 19a3 3 0 0 1-3 3h-3" />
    </>
  ),
  shieldCheck: (
    <>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12V3h9l9 9-9 9z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </>
  ),
  trendUp: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  // Vision, mission and values
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.8" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 17.5h6M10 21h4" />
      <path d="M9 17.5c0-2-2.5-3.5-2.5-7a5.5 5.5 0 0 1 11 0c0 3.5-2.5 5-2.5 7" />
    </>
  ),
  // Contact
  phone: <path d="M5 3.5h4l2 5-2.5 1.5a11 11 0 0 0 5.5 5.5L15.5 13l5 2v4a2 2 0 0 1-2 2A16.5 16.5 0 0 1 3 5.5a2 2 0 0 1 2-2z" />,
  whatsapp: (
    <>
      <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.6z" />
      <path d="M9 8.5c0 3.6 2.9 6.5 6.5 6.5l.9-1.6-2.1-1-1 .9a4 4 0 0 1-1.6-1.6l.9-1-1-2.1z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  building: <path d="M4 21V4h10v17M14 9h6v12M7 8h4M7 12h4M7 16h4M2 21h20" />,
  layers: <path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5" />,
  // Media
  video: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="3.5" />
      <path d="M10 9.2v5.6l4.8-2.8z" />
    </>
  ),
  // Documents
  book: <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5zM4 19.5A1.5 1.5 0 0 0 5.5 21H20v-3" />,
  fileText: <path d="M6 3h8l5 5v13H6zM14 3v5h5M9 13h7M9 17h7" />,
  certificate: (
    <>
      <path d="M20 13V4H4v11h7M8 8h8M8 11h4" />
      <circle cx="16.5" cy="15.5" r="2.5" />
      <path d="M15 17.6l-.5 3.4 2-1 2 1-.5-3.4" />
    </>
  ),
  download: <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />,
  pin: (
    <>
      <path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 0 0-13 0c0 5 6.5 11 6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof icons;

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-6 shrink-0 ${className}`}
    >
      {icons[name]}
    </svg>
  );
}
