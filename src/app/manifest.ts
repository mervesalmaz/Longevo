import type { MetadataRoute } from "next";

/**
 * Web App Manifest — /manifest.webmanifest
 * Enables "Add to Home Screen" on iOS/Android and controls the
 * standalone PWA look if users install it.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Longevo — Türkiye'nin longevity rehberi",
    short_name: "Longevo",
    description:
      "IV terapi, NAD+, biyobelirteç testi ve daha fazlası. Türkiye'deki longevity kliniklerini gerçek biohacker yorumlarıyla keşfet.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#00AA6C",
    lang: "tr",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
