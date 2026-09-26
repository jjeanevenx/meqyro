import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Meqyro",
    short_name: "Meqyro",
    description: "Discover more about you.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f8fc",
    theme_color: "#071431",
  };
}
