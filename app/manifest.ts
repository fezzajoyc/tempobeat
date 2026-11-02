import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TempoBeat — online metronome & music tools",
    short_name: "TempoBeat",
    description:
      "A precise browser metronome, a tone generator and an interval calculator — free music tools that run entirely in your browser.",
    start_url: "/en",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
