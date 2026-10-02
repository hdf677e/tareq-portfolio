import { notFound } from "next/navigation";
import PortfolioShell from "../../portfolio-shell";
import { getShot, shots } from "../../work/projects";
import { breadcrumbs, jsonLd, personRef, shellWith, shotView, siteUrl } from "../../work/ssr";

export const dynamicParams = false;

export function generateStaticParams() {
  return shots.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const shot = getShot(slug);
  if (!shot) return {};
  const url = `${siteUrl}/project/${shot.slug}`;
  return {
    title: shot.seoTitle,
    description: shot.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${shot.seoTitle} | Tareq Mahmud`,
      description: shot.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${shot.seoTitle} | Tareq Mahmud`,
      description: shot.description,
    },
  };
}

export default async function ShotPage({ params }) {
  const { slug } = await params;
  const shot = getShot(slug);
  if (!shot) notFound();
  const url = `${siteUrl}/project/${shot.slug}`;
  const data = {
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#project`,
        url,
        name: shot.name,
        headline: shot.seoTitle,
        description: shot.description,
        genre: shot.category,
        image: [shot.image, ...shot.pair, shot.wide].map((src) => `${siteUrl}${src}`),
        inLanguage: "en",
        author: personRef,
        creator: personRef,
        isPartOf: { "@id": `${siteUrl}/#website` },
      },
      breadcrumbs([
        { name: "Home", url: siteUrl },
        { name: "More work", url: `${siteUrl}/#more-work` },
        { name: shot.name, url },
      ]),
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
      <PortfolioShell html={shellWith(shotView(shot))} />
    </>
  );
}
