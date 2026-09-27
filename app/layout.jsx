import "./globals.css";

export const metadata = {
  title: "Tareq Mahmud — Product Designer",
  description:
    "Product Designer with 3+ years of experience designing ecommerce, logistics, ERP, payments and SaaS products.",
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
      <body>{children}</body>
    </html>
  );
}
