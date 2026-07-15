import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Longevo — Türkiye'nin longevity rehberi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)",
          padding: "80px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "999px",
              background: "#00AA6C",
              color: "white",
              fontSize: "28px",
              fontWeight: 700,
              marginRight: "16px",
            }}
          >
            L
          </div>
          <div
            style={{
              fontSize: "40px",
              fontWeight: 600,
              color: "#171717",
            }}
          >
            Longevo
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "84px",
            fontWeight: 500,
            color: "#0a0a0a",
            lineHeight: 1.1,
            letterSpacing: "-2px",
          }}
        >
          Türkiye&apos;nin longevity rehberi
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "32px",
            color: "#525252",
            marginTop: "24px",
          }}
        >
          Gerçek biohacker yorumlarıyla klinik, test ve tedavi keşfet.
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "22px",
            color: "#737373",
            marginTop: "48px",
          }}
        >
          longevo.life
        </div>
      </div>
    ),
    size
  );
}
