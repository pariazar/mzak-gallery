import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site.config";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default OG image — regenerated from site.config at build time. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0a0a0b",
        color: "#e9e7e2",
        padding: 72,
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 28,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: "#8f8d95",
        }}
      >
        <span>{siteConfig.name}</span>
        <div
          style={{
            display: "flex",
            width: 20,
            height: 20,
            borderRadius: 10,
            background: "#ff4d00",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div
          style={{
            fontSize: 92,
            fontStyle: "italic",
            lineHeight: 1.02,
            maxWidth: 980,
          }}
        >
          {siteConfig.tagline}
        </div>
        <div
          style={{
            display: "flex",
            width: 220,
            height: 6,
            background: "#ff4d00",
          }}
        />
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#8f8d95" }}>
        {new URL(siteConfig.url).host}
      </div>
    </div>,
    { ...size },
  );
}
