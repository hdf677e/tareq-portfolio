import { ogSize, renderOg } from "../../og";
import { getShot, shots } from "../../work/projects";

export const alt = "Design project by Tareq Mahmud";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return shots.map(({ slug }) => ({ slug }));
}

export default async function Image({ params }) {
  const { slug } = await params;
  const p = getShot(slug);
  return renderOg({
    eyebrow: p.category.toUpperCase(),
    line1: p.name,
    sub: p.description,
  });
}
