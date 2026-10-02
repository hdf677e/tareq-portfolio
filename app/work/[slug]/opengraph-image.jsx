import { ogSize, renderOg } from "../../og";
import { getProject, projects } from "../projects";

export const alt = "Product design case study by Tareq Mahmud";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export default async function Image({ params }) {
  const { slug } = await params;
  const p = getProject(slug);
  return renderOg({
    eyebrow: "CASE STUDY · " + p.category.toUpperCase(),
    line1: p.name,
    sub: p.title,
  });
}
