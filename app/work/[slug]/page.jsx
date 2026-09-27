import { notFound } from "next/navigation";
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

function StructuredData({ project }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    headline: project.title,
    description: project.description,
    image: `${siteUrl}${project.image}`,
    url: `${siteUrl}/work/${project.slug}`,
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: "Tareq Mahmud",
      url: siteUrl,
      jobTitle: "Product Designer",
    },
      creator: { "@type": "Person", name: "Tareq Mahmud", url: siteUrl },
      keywords: project.category,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <StructuredData project={project} />
      <header className="nav case-nav">
        <div className="nav-wrap">
          <div className="nav-bar">
            <a className="brand" href="/" aria-label="Tareq Mahmud, home">
              <img
                className="brand-logo"
                src="/logos/tareq-logo.svg"
                alt=""
                width="22"
                height="22"
              />
              Tareq Mahmud
            </a>
            <nav className="nav-links" aria-label="Primary">
              <a href="/#work">Work</a>
              <a href="/#about">About</a>
              <a href="/#why">Why me</a>
            </nav>
            <div className="nav-cta">
              <a className="btn btn-white" href="mailto:tmahmud771@gmail.com">
                Let&apos;s talk
              </a>
            </div>
          </div>
        </div>
      </header>

      <main id="main" className="project-page">
        <article>
          <header className="cs-hero" aria-labelledby="project-title">
            <div className="wrap cs-hero-inner">
              <p className="crumbs meta">
                <a href="/#work">← Selected work</a>
                <span>/</span>
                <span>{project.category}</span>
              </p>
              <p className="meta project-name">{project.name}</p>
              <h1 id="project-title">{project.title}</h1>
              <p className="lead">{project.description}</p>
              <dl className="cs-meta">
                <div><dt className="meta">Role</dt><dd>{project.role}</dd></div>
                <div><dt className="meta">Platform</dt><dd>{project.platform}</dd></div>
                <div><dt className="meta">Focus</dt><dd>{project.category}</dd></div>
                <div><dt className="meta">Status</dt><dd>{project.status}</dd></div>
              </dl>
            </div>
          </header>

          <div className="cs-cover">
            <div className="wrap">
              <figure className="project-cover">
                <img
                  src={project.image}
                  alt={project.imageAlt}
                  width={project.imageWidth}
                  height={project.imageHeight}
                  fetchPriority="high"
                />
                <figcaption>{project.name} · Product design by Tareq Mahmud</figcaption>
              </figure>
            </div>
          </div>

          <div className="wrap cs-body">
            <div className="project-content">
              <section className="cs-sec" aria-labelledby="challenge-title">
                <span className="meta">01 · The challenge</span>
                <h2 id="challenge-title">The product problem</h2>
                <p className="lead">{project.challenge}</p>
              </section>

              <section className="cs-sec" aria-labelledby="approach-title">
                <span className="meta">02 · Product design approach</span>
                <h2 id="approach-title">Designing around real work</h2>
                <p>{project.approach}</p>
                <div className="project-skills" aria-label="Design disciplines">
                  <span>Product design</span><span>UX architecture</span>
                  <span>Information architecture</span><span>Interaction design</span>
                  <span>Web and mobile UI</span>
                </div>
              </section>

              <section className="cs-sec" aria-labelledby="decisions-title">
                <span className="meta">03 · Key design decisions</span>
                <h2 id="decisions-title">Decisions visible in the product</h2>
                <div className="project-decisions">
                  {project.decisions.map((decision, index) => (
                    <article className="project-decision" key={decision.title}>
                      <span className="meta">{String(index + 1).padStart(2, "0")}</span>
                      <h3>{decision.title}</h3>
                      <p>{decision.text}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="cs-sec" aria-labelledby="outcome-title">
                <span className="meta">04 · Outcome</span>
                <h2 id="outcome-title">Where it landed</h2>
                <div className="box sageb project-outcome">
                  <p>{project.outcome}</p>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      {project.linkLabel} <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </section>
            </div>

            <aside className="project-contact">
              <div>
                <span className="meta">Have a product challenge?</span>
                <h2>Let&apos;s make the complex feel simple.</h2>
              </div>
              <a className="btn btn-lime" href="mailto:tmahmud771@gmail.com">
                Talk about your project <span aria-hidden="true">→</span>
              </a>
            </aside>

            <nav className="project-more" aria-label="More product design case studies">
              {projects.filter((item) => item.slug !== project.slug).map((item) => (
                <a href={`/work/${item.slug}`} key={item.slug}>
                  <span className="meta">{item.category}</span>
                  <span>{item.name} <span aria-hidden="true">→</span></span>
                </a>
              ))}
            </nav>
          </div>
        </article>
      </main>
    </>
  );
}
