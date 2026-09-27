import { notFound, redirect } from "next/navigation";
import { getProject, projects } from "../projects";

const siteUrl = "https://tareqmahmud.info";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const title = project.seoTitle;
  const url = `${siteUrl}/work/${project.slug}`;
  return {
    title,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${title} | Product Design by Tareq Mahmud`,
      description: project.description,
      images: [{ url: project.image, alt: project.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Tareq Mahmud`,
      description: project.description,
      images: [project.image],
    },
  };
}

// Case studies use the original single-page design and hash-based navigation.
// Send direct SEO URLs back to that experience so they include the full layout
// and footer instead of creating a visually different standalone page.
export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  redirect(`/#${project.slug}`);
}
