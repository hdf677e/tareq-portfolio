import "./globals.css";

const siteUrl = "https://tareqmahmud.info";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tareq Mahmud | Product Designer for SaaS, Ecommerce & Fintech",
    template: "%s | Tareq Mahmud",
  },
  description:
    "Product designer in Dhaka, Bangladesh, with 3+ years designing SaaS, ecommerce, ERP, fintech and logistics products for real businesses.",
  applicationName: "Tareq Mahmud — Product Designer",
  authors: [{ name: "Tareq Mahmud", url: siteUrl }],
  creator: "Tareq Mahmud",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Tareq Mahmud — Product Designer",
    title: "Tareq Mahmud | Product Designer for SaaS, Ecommerce & Fintech",
    description:
      "Product designer in Dhaka, Bangladesh, creating clear workflows for SaaS, ecommerce, ERP, fintech and logistics products.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tareq Mahmud | Product Designer",
    description:
      "Product designer in Dhaka, Bangladesh, designing SaaS, ecommerce, ERP, fintech and logistics products.",
  },
  icons: { icon: "/logos/tareq-logo.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300..600&family=Geist+Mono:wght@400;500&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@4.9.0/fonts/remixicon.css"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Tareq Mahmud",
              url: siteUrl,
              image: `${siteUrl}/img/tareq.webp`,
              jobTitle: "Product Designer",
              description:
                "Product designer in Dhaka, Bangladesh, with 3+ years of experience designing ecommerce, logistics, ERP, payments and SaaS products.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Dhaka",
                addressCountry: "BD",
              },
              sameAs: [
                "https://www.linkedin.com/in/traeq-mahmud-uxdesigner/",
                "https://www.behance.net/mtcreation2",
                "https://dribbble.com/tareq_mahmud_ux",
              ],
              knowsAbout: [
                "Product design",
                "UX design",
                "SaaS",
                "Ecommerce",
                "ERP",
                "Fintech and payments",
                "Logistics",
                "Mobile app design",
                "Web application design",
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
