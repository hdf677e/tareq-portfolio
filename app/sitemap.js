import { projects } from "./work/projects";

const siteUrl = "https://tareqmahmud.info";

export default function sitemap() {
  return [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map((project) => ({
      url: `${siteUrl}/work/${project.slug}`,
      changeFrequency: "yearly",
      priority: 0.8,
      images: [`${siteUrl}${project.image}`],
    })),
  ];
}
