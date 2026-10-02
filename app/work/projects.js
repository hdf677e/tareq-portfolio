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
    image: "/img/sf-cs-banner.webp",
    imageWidth: 2000,
    imageHeight: 1125,
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
    image: "/img/pbm-web-banner.webp",
    imageWidth: 2000,
    imageHeight: 1125,
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
    image: "/img/pkv2-banner.webp",
    imageWidth: 2000,
    imageHeight: 1125,
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
  {
    slug: "bonsaihd",
    name: "BonsaiHD",
    seoTitle: "BonsaiHD Streaming App UX Case Study",
    category: "Streaming · Mobile app",
    title: "Designing a streaming app that helps you find what to watch",
    description:
      "A streaming app UX case study: personalised discovery, mood-based AI recommendations, watch parties with friends and a VIP subscription that shows its value first.",
    role: "Product Designer",
    platform: "Mobile app (iOS and Android)",
    status: "Shipped",
    image: "/img/bonsai-hero.webp",
    imageWidth: 2000,
    imageHeight: 1125,
    imageAlt: "BonsaiHD streaming app: home, movie detail and VIP upgrade screens",
    challenge:
      "Streaming users spend as much time deciding what to watch as they do watching. Browsing felt generic: people opened the app wanting to watch something but could not quickly find what matched how they felt.",
    approach:
      "I designed the complete experience: a personalised home, movie and series details, a mood-based AI recommendation tool, social watch parties, a VIP subscription and the full profile flow, all aimed at shortening the path from opening the app to pressing Play.",
    decisions: [
      {
        title: "Lead with mood, not genre",
        text: "Ask Bonsai AI starts from how the viewer feels, returns one best match and offers more options below it.",
      },
      {
        title: "Make watching together simple",
        text: "Watch With Friends creates a room shared by code or QR link, with up to eight people watching in sync.",
      },
      {
        title: "Show value before the paywall",
        text: "The VIP screen leads with features, a time-limited offer and a 7-day trial instead of a hard gate.",
      },
    ],
    outcome:
      "BonsaiHD shipped with personalised discovery, AI recommendations, social viewing and a subscription flow that earns the upgrade.",
  },
  {
    slug: "packly-business-manager-v2",
    name: "Packly Business Manager V2",
    seoTitle: "Packly Business Manager V2 App Redesign Case Study",
    category: "SaaS · Mobile app redesign",
    title: "Redesigning the merchant app for clarity and speed",
    description:
      "A mobile app redesign case study: a cleaner merchant home, status-based product management and analytics that show earnings and KPIs at a glance.",
    role: "Mid UI/UX Designer, Zavisoft",
    platform: "Mobile app (Android)",
    status: "Live on Google Play",
    image: "/img/pbmv2-hero.webp",
    imageWidth: 2000,
    imageHeight: 1125,
    imageAlt: "Packly Business Manager V2: My Shop, home and analytics screens",
    challenge:
      "The V1 home was dense and hard to scan. Order counts, earnings and channel performance took too many steps to reach, and product management lacked clear status visibility.",
    approach:
      "I redesigned the app from the ground up: restructured the home, rebuilt product management and added an analytics screen that puts earnings and performance first, so the most-used data is one look away and common tasks are one tap from home.",
    decisions: [
      {
        title: "Order status on the home screen",
        text: "Pending, processing and delivered tiles are visible the moment the app opens.",
      },
      {
        title: "Analytics in one view",
        text: "A net earnings chart with period comparison and four KPI tiles replaces several screens.",
      },
      {
        title: "Status-filtered products",
        text: "All, My Product, Draft and Trash filters with SKU, price, stock and status on each row; adding a product is a stepped form.",
      },
    ],
    outcome:
      "Packly Business Manager V2 is live on Google Play with a faster home, clearer product management and readable analytics.",
    link: "https://play.google.com/store/apps/details?id=com.packlybusiness.app",
    linkLabel: "View on Google Play",
  },
  {
    slug: "packly-drive",
    name: "Packly Drive",
    seoTitle: "Packly Drive Car Rental Website UX Case Study",
    category: "Car rental · Marketplace",
    title: "Helping people in Dubai find the right car in one search",
    description:
      "A car rental marketplace UX case study for Dubai: search-first home, category browsing and car cards that show price and host trust before the click.",
    role: "Mid UI/UX Designer, Zavisoft",
    platform: "Web and mobile app",
    status: "Live · V1 and V2",
    image: "/img/pd-banner.webp",
    imageWidth: 2000,
    imageHeight: 1125,
    imageAlt: "Packly Drive home page: car search over a white sports car",
    challenge:
      "Renters in Dubai compare car type, brand, price, distance limits and host trust across thousands of cars from many rental companies. It was hard to narrow down to a trusted car at an understood price.",
    approach:
      "I designed the customer website across two versions: a search-first home, categories, listings, car cards and the paths into booking and the app, with services and host tools one level away.",
    decisions: [
      {
        title: "Search as the front door",
        text: "Type, brand and rent-or-buy sit in one bar at the top of the home page.",
      },
      {
        title: "Browse by need",
        text: "Categories like luxury, SUV, sports, affordable and monthly help renters start from what they need.",
      },
      {
        title: "Trust and price on every card",
        text: "Verified badges, ratings, trips, host name and day or month prices with distance limits appear before a car is opened.",
      },
    ],
    outcome:
      "Packly Drive is live with two versions of the website, getting renters from the home page to a shortlist faster.",
    link: "https://packlydrive.com/",
    linkLabel: "Visit packlydrive.com",
  },
];

export function getProject(slug) {
  return projects.find((project) => project.slug === slug);
}

// "More work" project pages (live at /project/<slug>)
export const shots = [
  {
    slug: "papi-s-grill",
    name: "Papi’s Grill",
    seoTitle: "Papi’s Grill Restaurant Website Redesign",
    category: "Restaurant · Website Redesign",
    platform: "Web",
    description:
      "Website redesign for Papi’s Grill, an Afro-fusion restaurant and bar: a bold food-first hero, menu, reservations and events.",
    text: "A redesign of the Papi’s Grill restaurant and bar website. The new home page leads with the food and a bold headline, and puts the key actions up front: browse the menu, book a reservation, see upcoming events and get in touch.",
    image: "/img/papis-grill-home.webp",
    imageAlt: "Papi’s Grill restaurant home page",
    pair: ["/img/papis-grill-1.webp", "/img/papis-grill-2.webp"],
    wide: "/img/papis-grill-wide.webp",
  },
  {
    slug: "fitchat-ai",
    name: "Fitchat AI",
    seoTitle: "Fitchat AI Fitness Coach App Design",
    category: "AI · Health & Fitness",
    platform: "Mobile App",
    description:
      "AI fitness coach app design: chat about your goals and get tailored tips and generated workout videos.",
    text: "A mobile app where people chat with an AI fitness coach. Users describe their goals and progress in plain words, and the assistant replies with tailored advice and generated workout videos. The chat stays simple, with photo, file and voice input in one compact bar.",
    image: "/img/fitchat-ai-chat.webp",
    imageAlt: "Fitchat AI chat screen on a phone",
    pair: ["/img/fitchat-1.webp", "/img/fitchat-2.webp"],
    wide: "/img/fitchat-wide.webp",
  },
  {
    slug: "melabs-creative-studio",
    name: "MeLABS Creative Studio",
    seoTitle: "MeLABS Creative Studio Website Design",
    category: "Creative Studio · Web Design",
    platform: "Web",
    description:
      "Website design for MeLABS, a Dhaka creative studio: bold black hero, services at a glance and an interactive project list.",
    text: "A website for MeLABS, a creative studio in Dhaka offering branding, social media, model photography and web design. A striking black hero introduces the studio and its services, followed by a project list where hovering a name brings up its photos, so the work speaks first.",
    image: "/img/melabs-home.webp",
    imageAlt: "MeLABS creative studio home page",
    pair: ["/img/melabs-1.webp", "/img/melabs-2.webp"],
    wide: "/img/melabs-wide.webp",
  },
  {
    slug: "constra-fitness",
    name: "Constra Fitness",
    seoTitle: "Constra Fitness Website Design",
    category: "Fitness · Web Design",
    platform: "Web",
    description:
      "Fitness brand website design for Constra: bold hero, class bookings, trainer stats and an app download.",
    text: "A website for Constra, a fitness brand. The hero pairs a bold headline with clear next steps: join, book an upcoming class like Pilates, or scan a code to download the app. Member and trainer numbers build trust, and a floating menu keeps programs, blog and sign-up one tap away.",
    image: "/img/constra-home.webp",
    imageAlt: "Constra fitness website home page",
    pair: ["/img/constra-1.webp", "/img/constra-2.webp"],
    wide: "/img/constra-wide.webp",
  },
  {
    slug: "royale-luxury-hotel",
    name: "Royale Luxury Hotel",
    seoTitle: "Royale Luxury Hotel Website Design",
    category: "Hospitality · Web Design",
    platform: "Web",
    description:
      "Luxury hotel website design for Royale in Bali: cinematic hero, rooms and suites, experiences and easy reservations.",
    text: "A website for Royale, a luxury hotel in Bali. A dark, cinematic hero with elegant serif type sets the mood, a numbered section bar guides guests through rooms and suites, experiences, testimonials and gallery, and Reserve Now stays in reach throughout.",
    image: "/img/royale-hotel-home.webp",
    imageAlt: "Royale luxury hotel website home page",
    pair: ["/img/royale-1.webp", "/img/royale-2.webp"],
    wide: "/img/royale-wide.webp",
  },
  {
    slug: "noorayn-academy",
    name: "Noorayn Academy",
    seoTitle: "Noorayn Academy Online Learning Website Design",
    category: "Education · Web Design",
    platform: "Web",
    description:
      "Website design for an online Qur’an and Arabic academy: 1-to-1 classes with certified tutors, courses and a free evaluation.",
    text: "A website for Noorayn Academy, which teaches Qur’an, Tajweed, Hifz and Arabic through live 1-to-1 online classes. The hero explains the offer in one line and leads to a free evaluation, with learner numbers, ratings, round-the-clock support and certified teachers building trust right away.",
    image: "/img/noorayn-academy-home.webp",
    imageAlt: "Noorayn Academy website home page",
    pair: ["/img/noorayn-1.webp", "/img/noorayn-2.webp"],
    wide: "/img/noorayn-wide.webp",
  },
];

export function getShot(slug) {
  return shots.find((shot) => shot.slug === slug);
}
