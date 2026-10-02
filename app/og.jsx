import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// Shared social-card layout (LinkedIn, X, WhatsApp, Slack previews) in the site's colours.
export function renderOg({ eyebrow, line1, line2, sub }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#14160e",
          color: "#f4f4ee",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 22, height: 22, borderRadius: 999, background: "#b9e25b" }} />
          <span style={{ fontSize: 26 }}>Tareq Mahmud</span>
          <span style={{ color: "#a7aa9c", fontSize: 18, marginLeft: 8 }}>{eyebrow}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 68, lineHeight: 1.05, letterSpacing: -3 }}>{line1}</div>
          {line2 ? (
            <div style={{ display: "flex", fontSize: 68, lineHeight: 1.05, letterSpacing: -3, color: "#b9e25b" }}>
              {line2}
            </div>
          ) : null}
          <div style={{ display: "flex", color: "#c5c7bd", fontSize: 26, marginTop: 8 }}>{sub}</div>
        </div>
        <div style={{ color: "#a7aa9c", fontSize: 21 }}>tareqmahmud.info</div>
      </div>
    ),
    ogSize
  );
}
