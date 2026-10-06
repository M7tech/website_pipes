import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AtlasPlast",
    short_name: "AtlasPlast",
    description: "Pipe systems, drainage, sanitaryware and pumps for Iraq, since 1975.",
    start_url: "/",
    display: "browser",
    background_color: "#f3f4f2",
    theme_color: "#14284a",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
