"use client";

import { useEffect } from "react";

export default function PortfolioShell({ html }) {
  useEffect(() => {
    import("./legacy-runtime").then(({ initLegacyPortfolio }) => {
      initLegacyPortfolio();
    });
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
