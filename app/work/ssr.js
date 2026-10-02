// Server-rendered first paint for /work/<slug> and /project/<slug>.
// Crawlers (and visitors before JavaScript runs) get the real page content in the HTML,
// using the same classes as the runtime's case and project layouts; the runtime then
// mounts the full interactive page in place.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { projects, shots } from "./projects";

export const siteUrl = "https://tareqmahmud.info";

const shell = readFileSync(join(process.cwd(), "app/legacy-shell.html"), "utf8");
const VIEW_OPEN = '<div id="view">';
const VIEW_CLOSE = "\n  </div>\n</main>";

// the shell with its #view content swapped for this page's markup
export function shellWith(viewHtml) {
  const a = shell.indexOf(VIEW_OPEN);
  const b = shell.indexOf(VIEW_CLOSE, a);
  if (a < 0 || b < 0) return shell;
  return shell.slice(0, a + VIEW_OPEN.length) + "\n" + viewHtml + shell.slice(b);
}

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const back = `<a class="pj-back" href="/"><span class="pj-back-icon" aria-hidden="true"><i class="ri-arrow-left-line"></i></span>Back to home</a>`;

function moreCards(title, cards) {
  return `<section class="pj-more" aria-labelledby="pj-more-title">
    <div class="pj-more-head"><h2 id="pj-more-title">${esc(title)}</h2></div>
    <div class="pj-track">${cards
      .map(
        (o) => `
      <a class="pj-card" href="${o.href}">
        <span class="pj-card-img"><img src="${o.image}" alt="${esc(o.alt)}" loading="lazy" decoding="async"></span>
        <span class="pj-card-meta"><b>${esc(o.name)}</b><span>${esc(o.cat)}</span></span>
      </a>`
      )
      .join("")}
    </div>
  </section>`;
}

const block = (id, label, body) =>
  `<section class="cx-block" id="s-${id}" aria-labelledby="h-${id}"><p class="cx-label">${label}</p><div class="cx-content">${body}</div></section>`;

export function caseView(p) {
  const facts = [
    ["Role", p.role],
    ["Platform", p.platform],
    ["Category", p.category],
    ["Status", p.status],
  ].filter((f) => f[1]);
  const others = projects
    .filter((o) => o.slug !== p.slug)
    .map((o) => ({ href: `/work/${o.slug}`, image: o.image, alt: o.imageAlt, name: o.name, cat: o.category }));
  return `<div class="cx">
    <div class="cx-details">
      ${back}
      <div class="cx-banner"><div class="cover-frame cover-full"><img src="${p.image}" alt="${esc(p.imageAlt)}" width="${p.imageWidth}" height="${p.imageHeight}" fetchpriority="high" decoding="async"></div></div>
      ${block(
        "overview",
        "Overview",
        `<h1 id="cs-title" tabindex="-1">${esc(p.name)}</h1>
        <p class="cx-overline">${esc(p.title)}</p><p>${esc(p.description)}</p>
        <dl class="cx-facts">${facts.map((f) => `<div><dt>${f[0]}</dt><dd>${esc(f[1])}</dd></div>`).join("")}</dl>`
      )}
      ${block("problem", "Problem", `<h2 id="h-problem">The challenge</h2><p>${esc(p.challenge)}</p>`)}
      ${block(
        "solution",
        "Solution",
        `<h2 id="h-solution">The approach</h2><p>${esc(p.approach)}</p>
        <ul class="cx-list">${p.decisions.map((d) => `<li><b>${esc(d.title)}.</b> ${esc(d.text)}</li>`).join("")}</ul>`
      )}
      ${block(
        "outcome",
        "Outcome",
        `<h2 id="h-outcome">Where it landed</h2><p>${esc(p.outcome)}</p>${
          p.link ? `<p><a href="${p.link}" target="_blank" rel="noopener">${esc(p.linkLabel)} ↗</a></p>` : ""
        }`
      )}
      ${moreCards("More work", others)}
    </div>
  </div>`;
}

export function shotView(p) {
  const tags = p.category.split(" · ").concat(p.platform);
  const frame = (src, alt, cls, eager) =>
    `<figure class="pj-frame ${cls}"><img src="${src}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></figure>`;
  const others = shots
    .filter((o) => o.slug !== p.slug)
    .map((o) => ({ href: `/project/${o.slug}`, image: o.image, alt: o.imageAlt, name: o.name, cat: o.category }));
  return `<main class="pj" aria-labelledby="shot-title">
    ${back}
    <header class="pj-head"><h1 id="shot-title" tabindex="-1">${esc(p.name)}</h1></header>
    ${frame(p.image, p.imageAlt, "pj-banner", true)}
    <div class="pj-desc">
      <div class="pj-desc-head">
        <div class="pj-by">
          <img class="pj-avatar" src="/img/tareq.webp" alt="Tareq Mahmud" width="40" height="40">
          <span><b>Tareq Mahmud</b>Product Designer</span>
        </div>
      </div>
      <div class="pj-desc-body">
        <p>${esc(p.text)}</p>
        <ul class="pj-tags" aria-label="Tags">${tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      </div>
    </div>
    <div class="pj-pair">${p.pair.map((src, k) => frame(src, `${p.name} design, screen ${k + 2}`, "pj-half")).join("")}</div>
    ${frame(p.wide, `${p.name} design, full page`, "pj-wide")}
    ${moreCards("More work", others)}
  </main>`;
}

// JSON-LD helpers
export const personRef = { "@id": `${siteUrl}/#person` };

export function breadcrumbs(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
}

export const jsonLd = (data) => JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c");
