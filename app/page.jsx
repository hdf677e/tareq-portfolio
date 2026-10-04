import { readFileSync } from "node:fs";
import { join } from "node:path";
import PortfolioShell from "./portfolio-shell";

const html = readFileSync(join(process.cwd(), "app/legacy-shell.html"), "utf8");

export default function HomePage() {
  return (
    <>
      {/* the hero photo is the first thing on screen */}
      <link rel="preload" as="image" href="/media/hero-vr.webp" fetchPriority="high" />
      <PortfolioShell html={html} />
    </>
  );
}
