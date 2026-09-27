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

function imageSize(src) {
  if (src.includes("pbm-cover")) return { width: 2048, height: 1000 };
  if (src.includes("pg-dash-full")) return { width: 1171, height: 2000 };
  if (src.includes("pg-transactions")) return { width: 1600, height: 1232 };
  if (src.includes("pg-store")) return { width: 1600, height: 1602 };
  if (src.includes("pg-emi")) return { width: 1600, height: 1232 };
  if (src.includes("pk-app")) return { width: 450, height: 800 };
  if (src.includes("sf-merchant")) return { width: 450, height: 800 };
  return { width: 450, height: 800 };
}

function decisionStyle(slug) {
  if (slug === "payment-gateway") return "pg-case-decisions";
  if (slug === "packly-marketplace") return "market-decisions";
  return "sf-decisions";
}

function Sections({ project }) {
  const sections = [
    {
      id: "intro",
      label: "Introduction",
      title: project.introTitle || project.name,
      content: (
        <>
          <p className="lead">{project.description}</p>
          <p>{project.approach}</p>
        </>
      ),
    },
    {
      id: "problem",
      label: "Problem",
      title: project.problemTitle || "What needed to change",
      content: (
        <div className="problem">
          <div>
            <span className="meta">Problem</span>
            <p style={{ marginTop: 12 }}>{project.challenge}</p>
          </div>
          <div>
            <span className="meta">Design goal</span>
            <p style={{ marginTop: 12 }}>{project.goal}</p>
          </div>
        </div>
      ),
    },
    {
      id: "users",
      label: "Users",
      title: project.usersTitle || "Who the product serves",
      content: (
        <div className={project.audiences.length > 2 ? "three" : "two"}>
          {project.audiences.map((audience, index) => (
            <article className={`box${index === 0 && project.audiences.length > 2 ? " inkb" : ""}`} key={audience.title}>
              <span className="meta">{audience.label}</span>
              <h3>{audience.title}</h3>
              <p>{audience.text}</p>
            </article>
          ))}
        </div>
      ),
    },
    {
      id: "ia",
      label: "Information Architecture",
      title: project.iaTitle || "How the product is organised",
      content: (
        <div className="ia-map">
          <div className="ia-map-head">
            <b>{project.name}</b>
            <span>{project.platform}</span>
          </div>
          <div className="ia-map-grid">
            {project.areas.map(([name, items]) => (
              <article className="ia-map-card" key={name}>
                <h3>{name}</h3>
                <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
          <p className="ia-map-foot">Organised around the tasks each role needs to complete.</p>
        </div>
      ),
    },
    {
      id: "ui",
      label: "Final UI",
      title: "Selected screens from the product",
      content: (
        <>
          {project.slug === "packly-business-manager" && (
            <figure className="wide-shot">
              <div className="frame"><img src="/img/pbm-cover.jpg" alt="Packly Business Manager campaign image showing a small business owner using the app" width="2048" height="1000" loading="lazy" decoding="async" /></div>
              <figcaption>Packly Business Manager brings everyday tools for running a small business into one app.</figcaption>
            </figure>
          )}
          <div className="gallery">
            {project.screens.map(([src, title, description]) => {
              const dimensions = imageSize(src);
              return (
                <figure key={src}>
                  <div className="frame"><img src={src} alt={title} {...dimensions} loading="lazy" decoding="async" /></div>
                  <figcaption><b>{title}</b>{description}</figcaption>
                </figure>
              );
            })}
          </div>
        </>
      ),
    },
    ...(project.iteration ? [{
      id: "iteration",
      label: "Iteration",
      title: project.iteration.title,
      content: (
        <div className="versions">
          <article className="box">
            <span className="meta">{project.iteration.fromLabel}</span>
            <h3>{project.iteration.fromTitle}</h3>
            <p>{project.iteration.fromText}</p>
          </article>
          <div className="arrow" aria-hidden="true">→</div>
          <article className="box inkb">
            <span className="meta">{project.iteration.toLabel}</span>
            <h3>{project.iteration.toTitle}</h3>
            <p>{project.iteration.toText}</p>
          </article>
        </div>
      ),
    }] : []),
    {
      id: "decisions",
      label: "Key Design Decisions",
      title: "Decisions visible in the product",
      content: (
        <div className={decisionStyle(project.slug)}>
          {project.decisions.map((decision, index) => (
            <article className={project.slug === "packly-marketplace" ? "market-decision" : project.slug === "payment-gateway" ? "pg-case-decision" : "sf-decision"} key={decision.title}>
              {project.slug === "packly-marketplace" && <span className="market-decision-num">{String(index + 1).padStart(2, "0")}</span>}
              <h3>{decision.title}</h3>
              <p>{decision.text}</p>
            </article>
          ))}
        </div>
      ),
    },
    {
      id: "outcome",
      label: "Outcome",
      title: "Where it landed",
      content: (
        <div className={project.slug === "payment-gateway" ? "two" : "outcome"}>
          {project.outcomes.map((outcome) => (
            <article className="box sageb" key={outcome.title}>
              <span className="meta">{outcome.label}</span>
              <h3>{outcome.title}</h3>
              <p>{outcome.text}</p>
            </article>
          ))}
        </div>
      ),
    },
    ...(project.link ? [{
      id: "live",
      label: "Live Product",
      title: "See it in the wild",
      content: (
        <div className="live-card">
          <b>{project.name} is live.</b>
          <div className="links">
            <a className="btn btn-ink" href={project.link} target="_blank" rel="noopener noreferrer">{project.linkLabel} <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      ),
    }] : []),
  ];

  return (
    <div className="cs-layout">
      <nav className="toc" aria-label="Case study sections">
        {sections.map((section, index) => (
          <a href={`#s-${section.id}`} key={section.id}>
            <span className="meta">{String(index + 1).padStart(2, "0")}</span>{section.label}
          </a>
        ))}
      </nav>
      <div className="cs-sections">
        {sections.map((section, index) => (
          <section className="cs-sec" id={`s-${section.id}`} key={section.id} aria-labelledby={`h-${section.id}`}>
            <span className="meta">{String(index + 1).padStart(2, "0")} · {section.label}</span>
            <h2 id={`h-${section.id}`}>{section.title}</h2>
            {section.content}
          </section>
        ))}
      </div>
    </div>
  );
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const previous = projects[(projectIndex - 1 + projects.length) % projects.length];
  const next = projects[(projectIndex + 1) % projects.length];

  return (
    <>
      <StructuredData project={project} />
      <header className="nav case-nav" id="nav">
        <div className="nav-wrap">
          <div className="nav-bar">
            <a className="brand" href="/" aria-label="Tareq Mahmud, home">
              <img className="brand-logo" src="/logos/tareq-logo.svg" alt="" width="22" height="22" />
              Tareq Mahmud
            </a>
            <nav className="nav-links" aria-label="Primary">
              <a href="/#work">Work</a><a href="/#about">About</a><a href="/#why">Why me</a>
            </nav>
            <div className="nav-cta"><a className="btn btn-white" href="mailto:tmahmud771@gmail.com">Let&apos;s talk</a></div>
          </div>
        </div>
      </header>

      <main id="main" className="project-page">
        <article>
          <section className="cs-hero" aria-labelledby="project-title">
            <div className="wrap cs-hero-inner">
              <p className="crumbs meta"><a href="/#work">← Work</a><span>/</span><span>{project.category}</span></p>
              <p className="meta" style={{ color: "var(--lime)", marginBottom: 14 }}>{project.name}</p>
              <h1 id="project-title">{project.title}</h1>
              <p className="lead">{project.description}</p>
              <div className="cs-meta">
                <div><span className="meta">Role</span>{project.role}</div>
                <div><span className="meta">Platform</span>{project.platform}</div>
                <div><span className="meta">Focus</span>{project.category}</div>
                <div><span className="meta">Status</span>{project.status}</div>
              </div>
            </div>
          </section>

          <div className="cs-cover">
            <div className="wrap">
              <div className="cover-frame cover-mock">
                <div className="shot">
                  <img src={project.coverImage || project.image} alt={project.coverAlt || project.imageAlt} width={project.coverWidth || project.imageWidth} height={project.coverHeight || project.imageHeight} fetchPriority="high" />
                </div>
              </div>
            </div>
          </div>

          <div className="wrap cs-body">
            <Sections project={project} />
            <nav className="next" aria-label="More case studies">
              <a href={`/work/${previous.slug}`}><span className="meta muted">← Previous</span><span className="h3">{previous.name}</span></a>
              <a href={`/work/${next.slug}`}><span className="meta muted">Next →</span><span className="h3">{next.name}</span></a>
            </nav>
          </div>
        </article>
      </main>
    </>
  );
}
