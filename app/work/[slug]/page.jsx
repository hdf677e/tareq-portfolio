import { notFound } from "next/navigation";
import PortfolioShell from "../../portfolio-shell";
import { getProject, projects } from "../projects";
import { breadcrumbs, caseView, jsonLd, personRef, shellWith, siteUrl } from "../ssr";

export const dynamicParams = false;

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
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Tareq Mahmud`,
      description: project.description,
    },
  };
}

// The case study renders on the server inside the site shell, so this URL has its own
// indexable content; the runtime then mounts the full interactive layout in place.
export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const url = `${siteUrl}/work/${project.slug}`;
  const data = {
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#case-study`,
        url,
        name: `${project.name}: ${project.title}`,
        headline: project.seoTitle,
        description: project.description,
        genre: "Product design case study",
        about: project.category,
        image: `${siteUrl}${project.image}`,
        inLanguage: "en",
        author: personRef,
        creator: personRef,
        isPartOf: { "@id": `${siteUrl}/#website` },
      },
      breadcrumbs([
        { name: "Home", url: siteUrl },
        { name: "Work", url: `${siteUrl}/#work` },
        { name: project.name, url },
      ]),
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
      <PortfolioShell html={shellWith(caseView(project))} />
    </>
  );
}
