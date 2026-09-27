import { ImageResponse } from "next/og";

export const alt =
  "Tareq Mahmud, product designer for SaaS, ecommerce, fintech and logistics products";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 999,
              background: "#b9e25b",
            }}
          />
          <span style={{ fontSize: 26 }}>Tareq Mahmud</span>
          <span style={{ color: "#a7aa9c", fontSize: 18, marginLeft: 8 }}>
            PRODUCT DESIGNER · DHAKA, BANGLADESH
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 70, lineHeight: 1.05, letterSpacing: -3 }}>
            Complex products,
          </div>
          <div style={{ display: "flex", fontSize: 70, lineHeight: 1.05, letterSpacing: -3 }}>
            <span style={{ color: "#b9e25b" }}>made simple.</span>
          </div>
          <div style={{ display: "flex", color: "#c5c7bd", fontSize: 25, marginTop: 8 }}>
            SaaS · Ecommerce · ERP · Fintech · Logistics
          </div>
        </div>
        <div style={{ color: "#a7aa9c", fontSize: 21 }}>tareqmahmud.info</div>
      </div>
    ),
    size,
  );
}
