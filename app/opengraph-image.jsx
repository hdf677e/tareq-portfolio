import { ogSize, renderOg } from "./og";

export const alt =
  "Tareq Mahmud, product designer for SaaS, fintech, ecommerce and logistics products";
export const size = ogSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOg({
    eyebrow: "PRODUCT DESIGNER · UI/UX · DHAKA, BANGLADESH",
    line1: "Complex workflows,",
    line2: "made simple.",
    sub: "SaaS · Ecommerce · ERP · Fintech · Logistics",
  });
}
