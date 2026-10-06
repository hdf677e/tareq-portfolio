import "./globals.css";

const siteUrl = "https://tareqmahmud.info";

// Google Analytics 4 Measurement ID (Admin → Data streams → Web). Leave empty to turn tracking off.
const GA_ID = "";

const title = "Tareq Mahmud | Product Designer for SaaS, Fintech & Ecommerce";
const description =
  "Tareq Mahmud is a product designer (UI/UX) in Dhaka, Bangladesh with 3+ years designing SaaS, ecommerce, ERP, fintech and logistics apps. Open to full-time remote roles and freelance projects.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Tareq Mahmud" },
  description,
  applicationName: "Tareq Mahmud — Product Designer",
  authors: [{ name: "Tareq Mahmud", url: siteUrl }],
  creator: "Tareq Mahmud",
  publisher: "Tareq Mahmud",
  category: "design",
  keywords: [
    "Tareq Mahmud",
    "product designer",
    "UI/UX designer",
    "UX designer Bangladesh",
    "product designer Dhaka",
    "SaaS product designer",
    "fintech UX designer",
    "ecommerce UX designer",
    "mobile app designer",
    "dashboard design",
    "freelance product designer",
    "remote UI/UX designer",
    "UX case studies",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "profile",
    firstName: "Tareq",
    lastName: "Mahmud",
    locale: "en_US",
    url: siteUrl,
    siteName: "Tareq Mahmud — Product Designer",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  icons: { icon: "/logos/tareq-logo.svg", apple: "/logos/tareq-logo.svg" },
  formatDetection: { telephone: false },
};

export const viewport = { themeColor: "#14160e", colorScheme: "dark" };

// One connected graph: the person, the website and the profile page about them.
// Case study pages point their author at #person.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Tareq Mahmud",
      url: siteUrl,
      image: `${siteUrl}/img/tareq.webp`,
      email: "mailto:tmahmud771@gmail.com",
      jobTitle: "Product Designer",
      description:
        "Product designer (UI/UX) in Dhaka, Bangladesh with 3+ years designing ecommerce, logistics, ERP, payments and SaaS products.",
      worksFor: { "@type": "Organization", name: "Zavisoft" },
      hasOccupation: {
        "@type": "Occupation",
        name: "Product Designer",
        occupationLocation: { "@type": "Country", name: "Bangladesh" },
        skills:
          "Product design, UX research, UI design, interaction design, design systems, prototyping, Figma",
      },
      address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
      sameAs: [
        "https://www.linkedin.com/in/traeq-mahmud-uxdesigner/",
        "https://www.behance.net/mtcreation2",
        "https://dribbble.com/tareq_mahmud_ux",
      ],
      knowsAbout: [
        "Product design",
        "UX design",
        "UI design",
        "Design systems",
        "SaaS",
        "Ecommerce",
        "ERP",
        "Fintech and payments",
        "Logistics",
        "Mobile app design",
        "Web application design",
        "Figma",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Tareq Mahmud — Product Designer",
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profile`,
      url: siteUrl,
      name: title,
      description,
      inLanguage: "en",
      isPartOf: { "@id": `${siteUrl}/#website` },
      mainEntity: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                // page views are sent by the runtime on every page swap, so the tag doesn't send its own;
                // local development is never tracked
                __html: `if(!/^(localhost|127\\.0\\.0\\.1|\\[::1\\])$/.test(location.hostname)){window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false});}`,
              }}
            />
          </>
        )}
        {/* case studies live at /work/… and /project/…; the shell and runtime use relative asset paths */}
        <base href="/" />
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
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
