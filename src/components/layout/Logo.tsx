import Image from "next/image";

type LogoProps = { tone?: "color" | "white"; className?: string; label: string };

/** Official AtlasPlast lockup from the 2026 vector logo pack. Never mirrored in RTL. */
export function Logo({ tone = "color", className = "", label }: LogoProps) {
  return (
    <Image
      src={tone === "white" ? "/brand/atlasplast-white.svg" : "/brand/atlasplast.svg"}
      alt={label}
      width={1644}
      height={840}
      priority
      className={`h-auto ${className}`}
      unoptimized
    />
  );
}
