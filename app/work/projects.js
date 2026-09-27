export const projects = [
  {
    slug: "steadfast-merchant",
    name: "Steadfast Merchant App",
    seoTitle: "Steadfast Merchant App UX Case Study",
    category: "Logistics · Merchant operations",
    title: "Designing a mobile app for high-volume parcel operations",
    description:
      "A product design case study for the Steadfast Merchant app: parcel booking, delivery tracking, payouts and performance tools for businesses shipping in Bangladesh.",
    role: "Mid UI/UX Designer, Zavisoft",
    platform: "Mobile app",
    status: "Live on Google Play",
    image: "/img/sf-mockup.webp",
    imageWidth: 1400,
    imageHeight: 1321,
    imageAlt:
      "Steadfast Merchant app screens for parcel booking, parcel summaries and merchant payments",
    challenge:
      "Merchants handle many parcels at once. Each parcel has a delivery status, recipient, rider, delivery charge and cash-on-delivery amount. The app needed to make high-volume work and operational data easier to scan and act on.",
    approach:
      "I organized the experience around the jobs merchants repeat: booking parcels, checking delivery progress, requesting payouts and reviewing customer delivery history. Frequent actions sit close to home, while detailed information stays available in focused views.",
    decisions: [
      {
        title: "Put delivery status before detail",
        text: "Status summaries help merchants see where parcels are waiting before opening a list. Each status is a clear entry point to the parcels that need attention.",
      },
      {
        title: "Explain the available payout",
        text: "The wallet leads with the amount a merchant can request, followed by the delivered amount and the charges that explain the balance.",
      },
      {
        title: "Make customer checks part of booking",
        text: "Delivery success and complaint history are available by phone number, helping merchants check customer context before sending a parcel.",
      },
    ],
    outcome:
      "The Steadfast Merchant app is live on Google Play. Its main flows bring parcel booking, tracking, payment tasks and merchant performance into one mobile experience.",
    link: "https://play.google.com/store/apps/details?id=com.steadfast.steadfastmerchant",
    linkLabel: "View on Google Play",
  },
  {
    slug: "packly-business-manager",
    name: "Packly Business Manager",
    seoTitle: "Packly Business Manager Product Design Case Study",
    category: "SaaS · ERP · Ecommerce",
    title: "Designing a business operating system for modern merchants",
    description:
      "A product design case study for Packly Business Manager, a mobile and web platform for products, inventory, orders, sales, customers and campaigns.",
    role: "Mid UI/UX Designer, Zavisoft",
    platform: "Mobile app and web",
    status: "Live · V1 and V2",
    image: "/img/pbm-cover.jpg",
    imageWidth: 2048,
    imageHeight: 1000,
    imageAlt:
      "Packly Business Manager campaign image showing a merchant using the business app",
    challenge:
      "A single sale can involve products, stock, orders, payments and more than one channel. The product had to connect those jobs without making a broad business system feel difficult for merchants with different levels of technical experience.",
    approach:
      "I designed the mobile app for daily merchant work and the web platform for larger-scale operations. The information architecture groups the product into catalogue, inventory, orders, sales, money and growth, with one model shared across mobile and web.",
    decisions: [
      {
        title: "Group tools by the merchant’s job",
        text: "Catalogue, inventory, orders, sales, money and growth form recognizable areas, so merchants can find the work they came to do.",
      },
      {
        title: "Show queue size in the list filters",
        text: "Counts beside product and order statuses expose the size of each queue before a merchant opens it.",
      },
      {
        title: "Make order cards useful at a glance",
        text: "Order ID, amount, payment type, customer and item count appear together to support faster triage.",
      },
      {
        title: "Evolve the system from V1 to V2",
        text: "The second version simplifies common workflows and clarifies hierarchy while retaining the product’s core merchant jobs.",
      },
    ],
    outcome:
      "Packly Business Manager is live on app and web. Two versions have been released to merchants, with the second version focused on clearer organization and faster everyday workflows.",
    link: "https://business.packly.com/sell-with-us",
    linkLabel: "Visit the web platform",
  },
  {
    slug: "packly-marketplace",
    name: "Packly Marketplace",
    seoTitle: "Packly Marketplace Ecommerce UX Case Study",
    category: "Ecommerce · Multi-vendor",
    title: "Designing one shopping journey across many sellers",
    description:
      "A multi-vendor ecommerce product design case study covering Packly Marketplace product discovery, shopping, cart, checkout and orders across web and mobile.",
    role: "Mid UI/UX Designer, Zavisoft",
    platform: "Web and mobile",
    status: "V1 live · V2 in development",
    image: "/img/packly-web-home.webp",
    imageWidth: 800,
    imageHeight: 500,
    imageAlt: "Packly Marketplace ecommerce storefront and product discovery page",
    challenge:
      "A marketplace should feel like one store to the customer while products, stock and orders remain connected to their individual sellers. The experience needed to support discovery and purchase without hiding who fulfills each order.",
    approach:
      "I worked across the customer shopping journey and the vendor experience behind it: home and campaigns, categories, product details, cart, checkout and order management. V1 established the marketplace foundation; V2 reworks the architecture for a larger catalogue and a smoother purchase path.",
    decisions: [
      {
        title: "Group cart items by shop",
        text: "Keeping each seller’s items together makes multi-shop checkout easier to understand and clarifies who ships each part of an order.",
      },
      {
        title: "Make category paths visible",
        text: "Top-level categories and expandable groups help shoppers browse a broad catalogue without relying on deep menus.",
      },
      {
        title: "Bring campaigns into product discovery",
        text: "Seasonal promotions and flash sales appear near the home entry point, with discounts and countdowns visible on product cards.",
      },
    ],
    outcome:
      "Packly Marketplace V1 is live on web and app, with V2 in development. The marketplace is designed alongside Packly Business Manager, connecting the customer journey with seller operations.",
    link: "https://www.packly.com/",
    linkLabel: "Visit Packly.com",
  },
  {
    slug: "payment-gateway",
    name: "Payment Gateway Ecosystem",
    seoTitle: "Payment Gateway Product Design Case Study",
    category: "Fintech · Payments",
    title: "Designing three connected products around every payment",
    description:
      "A fintech product design case study connecting a payment gateway app, merchant panel and admin panel around payment processing, transactions and settlement.",
    role: "Mid UI/UX Designer, Zavisoft",
    platform: "Gateway app and web panels",
    status: "Three connected products",
    image: "/img/pg-dash-top.webp",
    imageWidth: 1171,
    imageHeight: 605,
    imageAlt:
      "Payment gateway merchant analytics dashboard with transaction and settlement data",
    challenge:
      "Payers want to know whether a payment went through. Merchants need to distinguish a successful payment from money still awaiting settlement. Admins need to monitor activity and administer merchants. Each role sees the same payment from a different angle.",
    approach:
      "I designed the gateway application, merchant panel and admin panel as one payment ecosystem. The experiences cover payment processing, transaction management, merchant operations, monitoring and administration, with each role focused on its own decisions.",
    decisions: [
      {
        title: "Show payment and settlement separately",
        text: "A payment can succeed before its funds settle. Separate statuses make the difference visible in transaction lists.",
      },
      {
        title: "Put fees and net beside the gross amount",
        text: "Merchants can see the gateway fee and expected net without opening each transaction.",
      },
      {
        title: "Keep context beside configuration",
        text: "Store and EMI settings pair the form with a summary, helping merchants understand the configuration they are editing.",
      },
      {
        title: "Make sensitive settings deliberate",
        text: "Secret keys are masked, and webhook event controls use clear on and off states.",
      },
    ],
    outcome:
      "The gateway app, merchant panel and admin panel form one connected system. Payment and settlement information uses a consistent language across payers, merchants and administrators.",
  },
];

export function getProject(slug) {
  return projects.find((project) => project.slug === slug);
}
