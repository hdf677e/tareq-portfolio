import { projects, shots } from "./work/projects";

const siteUrl = "https://tareqmahmud.info";
const lastModified = new Date();

export default function sitemap() {
  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      images: [`${siteUrl}/img/tareq.webp`],
    },
    ...projects.map((project) => ({
      url: `${siteUrl}/work/${project.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      images: [`${siteUrl}${project.image}`],
    })),
    ...shots.map((shot) => ({
      url: `${siteUrl}/project/${shot.slug}`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.7,
      images: [shot.image, ...shot.pair, shot.wide].map((src) => `${siteUrl}${src}`),
    })),
  ];
}
