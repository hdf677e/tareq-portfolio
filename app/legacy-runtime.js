export function initLegacyPortfolio(){
if (window.__portfolioRuntimeStarted) return;
window.__portfolioRuntimeStarted = true;
"use strict";
document.documentElement.classList.add('js');

/* ---------- small helpers ---------- */
const ARROW = '<i class="ri-arrow-right-line" aria-hidden="true"></i>';
const EXT = '<i class="ri-external-link-line" aria-hidden="true"></i>';
const PLUS = '<i class="ri-add-line" aria-hidden="true"></i>';
const SIZES = {phone:[450,800], 'pk-v2-home':[1200,1123], web:[800,500], 'pg-dash-top':[1171,605], 'pg-dash-full':[1171,2000], 'bd-web-home':[800,340], 'dcr-mobile':[800,1340], 'pbm-web-login':[800,502]};
function dims(name){ if(SIZES[name]) return SIZES[name]; return /-(app|merchant)-/.test(name) ? SIZES.phone : SIZES.web; }
function img(name, alt, eager){
  const [w,h] = dims(name);
  return `<img src="img/${name}.webp" alt="${alt}" width="${w}" height="${h}" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async">`;
}
function pgImg(n, alt, eager){
  const h={'pg-transactions':1232,'pg-store':1602,'pg-emi':1232}[n];
  return `<img src="img/${n}.webp" srcset="img/${n}-sm.webp 800w, img/${n}.webp 1600w" sizes="(max-width:900px) 92vw, 900px" alt="${alt}" width="1600" height="${h}" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async">`;
}
const phone = (n, alt, eager) => `<div class="phone">${img(n, alt, eager)}</div>`;
const fig = (n, t, c) => `<figure><div class="frame">${img(n, t)}</div><figcaption><b>${t}</b>${c||''}</figcaption></figure>`;
const todo = (label, items) => `<div class="todo"><span class="meta">${label}</span><ul>${items.map(i=>`<li>[${i}]</li>`).join('')}</ul></div>`;
const ext = (href, label, cls) => `<a class="${cls||'btn btn-ink'}" href="${href}" target="_blank" rel="noopener">${label} ${EXT}</a>`;
function scope(root, sub, nodes, note){
  return `<div class="scope"><div class="scope-root"><b>${root}</b><span>${sub}</span></div><div class="scope-grid">${
    nodes.map(n=>`<div class="scope-node"><b>${n[0]}</b><ul>${n[1].map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join('')
  }</div>${note?`<p class="scope-note">${note}</p>`:''}</div>`;
}
function decisions(list){
  return `<div class="decisions">${list.map(d=>`<div class="decision"><h3>${d[0]}</h3><p>${d[1]}</p>${d[2]?`<div class="frame">${img(d[2], d[0])}</div>`:'<span></span>'}</div>`).join('')}</div>`;
}
function roleMap(){
  return `<div class="rm-flow" aria-label="Payment flow"><span>Payment</span><i></i><span>Transaction</span><i></i><span>Settlement</span><i></i><span>Monitoring</span></div>
  <div class="rm-row">
    <div class="rm-node"><b>Gateway app</b><span>Where the payment happens. Payment processing.</span></div>
    <div class="rm-node"><b>Merchant panel</b><span>Transactions, merchant operations, settlement.</span></div>
    <div class="rm-node"><b>Admin panel</b><span>Monitoring and administration across merchants.</span></div>
  </div>
  <div class="rm-bus">One consistent design language across every role</div>`;
}

/* ---------- selected work grid ----------
   9 cards, 4-column bento: size 'wide' spans 2 columns.
   Layout per row: [1, wide, 1] · [wide, 1, 1] · [1, wide, 1]
   href: '#slug' opens a case study, 'https://…' opens in a new tab. */
const WORK = [
  { name:'Steadfast Merchant App', cat:'Mobile App', size:'', href:'#steadfast-merchant', image:'img/work/steadfast-merchant-app.webp',
    desc:'Orders, parcels, payments and delivery performance for businesses shipping with Steadfast.' },
  { name:'Packly Business Manager', cat:'SaaS · Web App', size:'wide', href:'#packly-business-manager', image:'img/work/packly-business-manager-web.webp',
    desc:'A business operating system for products, inventory, orders, sales and campaigns across channels.' },
  { name:'Packly Marketplace', cat:'Ecommerce App', size:'', href:'#packly-marketplace', image:'img/work/packly-marketplace-app.webp',
    desc:'A multi-vendor marketplace from product discovery to checkout and orders.' },
  { name:'Payment Gateway', cat:'Fintech · Dashboard', size:'wide', href:'#payment-gateway', image:'img/work/payment-gateway-dashboard.webp',
    desc:'Transactions, settlements, refunds and disputes for merchants in one dashboard.' },
  { name:'Packly Drive', cat:'Mobile App', size:'', href:'https://packlydrive.com/', image:'img/work/packly-drive-app.webp',
    desc:'Browse, compare and rent cars in the UAE by category, brand and price.' },
  { name:'BonsaiHD', cat:'Streaming App', size:'', href:'#bonsaihd', image:'img/work/bonsaihd-app.webp',
    desc:'A movie and series streaming app built around discovery and quick playback.' },
  { name:'Packly Business Manager V2', cat:'Mobile App', size:'', href:'#packly-business-manager-v2', image:'img/work/packly-business-manager-app-v2.webp',
    desc:'The redesigned merchant app: order status, commerce tools and inventory at a glance.' },
  { name:'Packly Drive', cat:'Web Design', size:'wide', href:'https://packlydrive.com/', image:'img/work/packly-drive-web.webp',
    desc:'Car rental website for Dubai: search thousands of cars, airport transfers, yachts and drivers.' },
  { name:'Packly Business Manager', cat:'Mobile App', size:'', href:'#packly-business-manager', image:'img/work/packly-business-manager-app.webp',
    desc:'Products, sales, stock and e-shop management for merchants on the go.' }
];

function workCard(p){
  const tag = p.href ? 'a' : 'div';
  const link = p.href ? ` href="${p.href}"${/^https?:/.test(p.href) ? ' target="_blank" rel="noopener"' : ''}` : '';
  return `<${tag} class="wk-card${p.size ? ' wk-' + p.size : ''}"${link} aria-label="${p.name}, ${p.cat}">
    <div class="wk-media">
      <img src="${p.image}" alt="" width="${p.size ? 2000 : 1160}" height="${p.size ? 1346 : 1600}" loading="lazy" decoding="async">
      <div class="wk-over"><p>${p.desc}</p></div>
    </div>
    <div class="wk-name"><b>${p.name}</b><span>${p.cat}</span></div>
  </${tag}>`;
}



/* ---------- more work ---------- */
const MORE = [
  { n:'05', name:'Steadfast Courier Portal', tint:'#cfe9dc', short:'Daily delivery tools for couriers: parcels, delivery status and customer details, built for speed and repeat tasks.', cat:'Logistics · Operations', platform:'Web', thumb:'sf-web-home', thumbAlt:'steadfast.com.bd home page',
    text:'The courier-facing platform for daily delivery work: parcel management, delivery status, customer information and operational workflows. A practical interface built for speed, clarity and repetitive tasks.',
    links:[['https://steadfast.com.bd/','steadfast.com.bd']] },
  { n:'06', name:'Dubai Car Rental', tint:'#d6e2ee', short:'Customer website, booking panel and car listing management for a Dubai car-rental service.', cat:'Rental · Booking · V1 & V2', platform:'Web', thumb:'dcr-web-home', thumbAlt:'Packly Drive car rental home page',
    text:'A complete car-rental experience for the Dubai market: customer website, booking panel, car listing management and the internal workflows behind it. Focused on simple vehicle discovery and booking, and scalable tools for teams managing listings and reservations.',
    links:[['https://packlydrive.com/','packlydrive.com']] },
  { n:'07', name:'HRM Platform', tint:'#e2dbf1', short:'Employees, attendance, leave and payroll-related workflows, organised into one clear admin.', cat:'SaaS · HR', platform:'Web', thumb:'hrm-web-login', thumbAlt:'HRM platform sign-in screen',
    text:'An HR management platform for employee management, attendance, leave, payroll-related operations and admin processes. Complex HR requirements turned into structured, easy-to-navigate screens.',
    links:[['https://zavisoft.packlybd.com/login','Live product']] },
  { n:'08', name:'BanglaDrop Logistics', tint:'#f3dccd', short:'Customer website and admin panel for cross-border shipping and logistics operations.', cat:'Logistics · Cross-border', platform:'Web + Admin', thumb:'bd-web-home', thumbAlt:'BanglaDrop home page',
    text:'The BanglaDrop ecosystem: customer-facing website and admin panel for shipment workflows, operations and logistics administration, with a focus on clarity across high-volume work.',
    links:[['https://bangladrop.com/','bangladrop.com']] },
  { n:'09', name:'Packly Marketplace V2', tint:'#d3ece5', short:'The second version of the Packly multi-vendor store: campaign-led home, flash sales, daily picks and Packly Play short videos.', cat:'Ecommerce · Multi-vendor · V2', platform:'Web', thumb:'pk-v2-home', thumbAlt:'Packly marketplace V2 home page',
    text:'Second iteration of the Packly multi-vendor commerce platform, reworking the product architecture and UX into a more scalable, conversion-focused experience. In development.',
    links:[] },
  { n:'10', name:'GhorerBazar', tint:'#f1e3c6', short:'Shopping app and website, internal ERP screens, and the Figma design system behind them.', cat:'Ecommerce · ERP · Design system', platform:'Web + App', thumb:'gb-web-home', thumbAlt:'GhorerBazar shop home page',
    text:'End-to-end shopping experience across the app and website: discovery, search, categories, cart, checkout, order tracking, accounts and promotions. Also internal ERP screens for inventory, finance, HR and orders, and the Figma design system behind both.',
    links:[['https://ghorerbazar.com/','ghorerbazar.com'],['https://play.google.com/store/apps/details?id=com.ghorerbazar.official','Android app']] }
];
function superAppArt(){
  return `<div class="services" role="img" aria-label="Packly Super App service structure">
    <div class="hub"><b>Packly Super App</b><span>One account, one navigation, shared discovery</span></div>
    <div><b>Packly Food</b><span>Service</span></div><div><b>Packly Courier</b><span>Service</span></div><div><b>Packly E-commerce</b><span>Service</span></div></div>`;
}
// musemind rhythm: wide (left) · short + tall · wide (right) · tall + short
const MW_LAYOUT = ['wide-l', 'short', 'tall', 'wide-r', 'tall', 'short'];
function rowItem(p, i){
  const kind = MW_LAYOUT[i % MW_LAYOUT.length];
  const tags = [...p.cat.split(' · '), p.platform].filter(Boolean).map(t => `<span class="mw-tag">${t}</span>`).join('');
  const inner = `<div class="mw-shot">${p.thumb ? img(p.thumb, p.thumbAlt) : superAppArt()}<span class="mw-plus" aria-hidden="true">${PLUS}</span></div>
    <div class="mw-body">
      <h4>${p.name}</h4>
      <p class="mw-desc">${p.short}</p>
      <div class="mw-tags">${tags}</div>
    </div>`;
  if(i === 0) return `<a class="mw mw-${kind} mw-intro" href="#${shotHash(p)}" aria-label="${p.name}, view project">
    <div class="mw-stick">${inner}</div><div class="mw-pin" aria-hidden="true"></div>
  </a>`;
  return `<a class="mw mw-${kind} rv" href="#${shotHash(p)}" aria-label="${p.name}, view project">
    ${inner}
  </a>`;
}

/* ---------- project pages (More work) ----------
   URL: #project/<slug>. Layout: banner, description, two images side by side,
   one wide image. Images per project on its MORE entry:
     banner: 'img/work/more/<slug>/banner.webp'           2400 x 1350
     pair:   ['img/.../1.webp', 'img/.../2.webp']         1200 x 900 each
     wide:   'img/work/more/<slug>/wide.webp'             2400 x 1350
   The banner falls back to the project thumbnail. Missing images show a
   labelled placeholder on localhost and are left out on the live site. */
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const shotHash = p => `project/${slugify(p.name)}`;
const SHOTS = Object.fromEntries(MORE.map(p => [shotHash(p), p]));
const DEV = ['localhost', '127.0.0.1'].includes(location.hostname);

function shotFrame(src, alt, size, cls, eager){
  if(src) return `<figure class="pj-frame ${cls}"><img src="${src}" alt="${alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></figure>`;
  return DEV ? `<figure class="pj-frame ${cls} pj-empty" aria-hidden="true"><span>${size}</span></figure>` : '';
}

// "More work"-style card carousel: heading, arrow buttons, snapping track (wired by wireMoreTrack)
// all WORK cards for the carousels, optionally leaving out the current one (by its hash slug)
const caseCards = skip => WORK.filter(w => skip ? w.href !== '#' + skip : true).map(w => ({
  href: w.href,
  image: w.image,
  name: w.name,
  cat: w.cat
}));

function moreTrack(title, cards){
  return `<section class="pj-more" aria-labelledby="pj-more-title">
    <div class="pj-more-head">
      <h2 id="pj-more-title">${title}</h2>
      <div class="pj-more-nav">
        <button type="button" class="pj-arrow" data-dir="-1" aria-label="Previous projects"><i class="ri-arrow-left-line" aria-hidden="true"></i></button>
        <button type="button" class="pj-arrow" data-dir="1" aria-label="Next projects"><i class="ri-arrow-right-line" aria-hidden="true"></i></button>
      </div>
    </div>
    <div class="pj-track">${cards.map(o => `
      <a class="pj-card" href="${o.href}">
        <span class="pj-card-img"><img src="${o.image}" alt="" loading="lazy" decoding="async"></span>
        <span class="pj-card-meta"><b>${o.name}</b><span>${o.cat}</span></span>
      </a>`).join('')}
    </div>
  </section>`;
}

function buildShot(hash){
  const p = SHOTS[hash];
  const tags = p.cat.split(' · ').concat(p.platform);
  const pair = [0, 1].map(k => shotFrame(p.pair && p.pair[k], `${p.name} screen ${k + 2}`, '1200 × 900', 'pj-half')).join('');
  const el = document.createElement('div');
  el.innerHTML = `
  <main class="pj" aria-labelledby="shot-title">
    <a class="pj-back" href="#"><span class="pj-back-icon" aria-hidden="true"><i class="ri-arrow-left-line"></i></span>Back to home</a>
    <header class="pj-head">
      <h1 id="shot-title" tabindex="-1">${p.name}</h1>
    </header>
    ${shotFrame(p.banner || `img/${p.thumb}.webp`, p.thumbAlt, '2400 × 1350', 'pj-banner', true)}
    <div class="pj-desc">
      <div class="pj-desc-head">
        <div class="pj-by">
          <img class="pj-avatar" src="img/tareq.webp" alt="" width="40" height="40">
          <span><b>Tareq Mahmud</b>Product Designer</span>
        </div>
      </div>
      <div class="pj-desc-body">
        <p>${p.text}</p>
        <ul class="pj-tags" aria-label="Tags">${tags.map(t => `<li>${t}</li>`).join('')}</ul>
      </div>
    </div>
    ${pair ? `<div class="pj-pair">${pair}</div>` : ''}
    ${shotFrame(p.wide, `${p.name} screen 4`, '2400 × 1350', 'pj-wide')}
    ${moreTrack('More work', caseCards())}
  </main>`;
  const frag = document.createDocumentFragment();
  while(el.firstChild) frag.appendChild(el.firstChild);
  return frag;
}

/* ---------- case studies ---------- */
const PB = 'https://play.google.com/store/apps/details?id=';
const CASES = {
'steadfast-merchant': {
  name:'Steadfast Merchant App', eyebrow:'Case study 01 · Logistics',
  title:'Helping merchants run high-volume shipping from their phone',
  lead:'The everyday tool for businesses that ship with Steadfast: booking parcels, following deliveries, getting paid and reading how the business is doing.',
  meta:[['Role','Mid UI/UX Designer, Zavisoft'],['Platform','Mobile app'],['Scope','End-to-end merchant experience'],['Status',`<a href="${PB}com.steadfast.steadfastmerchant" target="_blank" rel="noopener">Live on Google Play ↗</a>`]],
  cover:`<div class="cover-frame cover-mock"><img src="img/sf-mockup.webp" srcset="img/sf-mockup-sm.webp 800w, img/sf-mockup.webp 1400w" sizes="(max-width:900px) 92vw, 820px" alt="Steadfast Merchant app: add parcel, home and parcel summary screens" width="1400" height="1321" fetchpriority="high" decoding="async"></div>`,
  sections:[
   ['intro','Introduction','A merchant app for a courier network', `<p class="lead">Steadfast is a courier service in Bangladesh. Merchants use the app to send parcels and manage everything that happens after.</p><p>I designed the end-to-end merchant experience: orders, shipments, payments, delivery operations and business performance, in one streamlined mobile app.</p>`],
   ['context','Context','Many parcels, each with its own money trail', `<p>Every parcel carries a status, a delivery charge, a cash-on-delivery amount, a recipient and a rider. A merchant might have hundreds in motion. The app has to keep all of that readable at volume, not just for one parcel at a time.</p>`],
   ['problem','Problem','What needed to change', `<div class="problem"><div><span class="meta">Problem</span><p style="margin-top:12px">High-volume merchant workflows were slow to move through, and operational data was hard to understand and act on.</p></div><div><span class="meta">Goal</span><p style="margin-top:12px">Make daily operations fast, and make the numbers readable at a glance.</p></div></div>`],
   ['users','Users','Who the app serves', `<div class="two"><div class="box inkb"><span class="meta">Primary</span><h3>Merchants</h3><p>Businesses sending parcels through Steadfast. They book pickups, track parcels, check customers and request payments.</p></div><div class="box"><span class="meta">Secondary</span><h3>Merchants with online stores</h3><p>Merchants who connect their website to Steadfast. The app gives them API keys and plugins without a support call.</p></div></div>`],
   ['focus','Challenges','Four things the design had to get right', `<div class="focus-list"><div><b>Speed</b><span>Frequent tasks one tap from home.</span></div><div><b>Clarity</b><span>Status and money visible without digging.</span></div><div><b>Hierarchy</b><span>Summary first, detail on demand.</span></div><div><b>Efficiency</b><span>Fewer steps for tasks repeated every day.</span></div></div>`],
   ['ia','Information Architecture','How the app is organised', `<div class="ia-map">
      <div class="ia-map-head"><b>Merchant app</b><span>Home as a task launcher</span></div>
      <div class="ia-map-grid">
        <article class="ia-map-card"><h3>Parcels</h3><ul><li>Add parcel and parcel details</li><li>Pickup request</li><li>Express delivery and pick &amp; drop</li></ul></article>
        <article class="ia-map-card"><h3>Money</h3><ul><li>Wallet balance and summary</li><li>Payment request</li><li>Add balance</li></ul></article>
        <article class="ia-map-card"><h3>Performance</h3><ul><li>Parcel summary by status</li><li>Period filter</li><li>Cancellations</li></ul></article>
        <article class="ia-map-card"><h3>Customers</h3><ul><li>Fraud check</li><li>Delivery success rate</li><li>Complaint history</li></ul></article>
        <article class="ia-map-card"><h3>Network</h3><ul><li>Coverage search</li><li>Pickup points</li><li>Pricing</li></ul></article>
        <article class="ia-map-card"><h3>Support &amp; tools</h3><ul><li>Tickets and support</li><li>API keys</li><li>Plugins</li></ul></article>
      </div>
      <p class="ia-map-foot">Frequent parcel actions lead; money, performance and support tools stay grouped by task.</p>
    </div>`],
   ['ui','Final UI','Selected screens from the live app', `<div class="gallery">${fig('sf-merchant-1','Home and parcel details','Frequent actions on top. Parcel details with COD, charges, recipient and rider.')}${fig('sf-merchant-summary','Parcel summary','Every status as a tile with one number.')}${fig('sf-merchant-wallet','Wallet','Requestable amount first, calculation beneath.')}${fig('sf-merchant-fraud','Fraud check','Customer success rate before booking.')}</div>`],
   ['decisions','Key Design Decisions','Decisions visible in the shipped product', `<div class="sf-decisions">
      <article class="sf-decision"><h3>Put parcel status first</h3><p>Show each delivery state as a countable tile, so merchants can spot where parcels are waiting before opening a list.</p></article>
      <article class="sf-decision"><h3>Explain the available payout</h3><p>Lead with the requestable balance, then show delivered amount, delivery charge and COD charge behind the total.</p></article>
      <article class="sf-decision"><h3>Make customer checks quick</h3><p>Let merchants look up delivery success and reported complaints by phone number before booking a parcel.</p></article>
      <article class="sf-decision"><h3>Turn home into a task launcher</h3><p>Place frequent booking actions first and group the remaining tools in a scannable grid.</p></article>
    </div>`],
   ['outcome','Outcome','Where it landed', `<div class="outcome"><div class="box sageb"><span class="meta">Shipped</span><h3>Live on Google Play</h3><p>In daily use by Steadfast merchants.</p></div><div class="box sageb"><span class="meta">Workflow</span><h3>Simpler high-volume workflows</h3><p>Booking, tracking and payment tasks grouped around what merchants do most.</p></div><div class="box sageb"><span class="meta">Data</span><h3>Readable operational data</h3><p>Status, money and customer risk shown as summaries first.</p></div></div>`],
   ['live','Live Product','See it in the wild', `<div class="live-card"><b>Steadfast Merchant is live.</b><div class="links">${ext(PB+'com.steadfast.steadfastmerchant','Google Play')}${ext('https://steadfast.com.bd/','steadfast.com.bd')}</div></div>`]
  ]},

'packly-business-manager': {
  name:'Packly Business Manager', eyebrow:'Case study 02 · SaaS / ERP',
  title:'Designing a business operating system for modern merchants',
  lead:'One product, on mobile and web, where Packly merchants manage products, stock, orders, sales, customers and campaigns across more than one sales channel.',
  meta:[['Role','Mid UI/UX Designer, Zavisoft'],['Platform','Mobile app + Web'],['Versions','V1 and V2'],['Status',`<a href="${PB}com.packlybusiness.app" target="_blank" rel="noopener">Live ↗</a>`]],
  cover:`<div class="cover-frame" style="padding:0!important;background:none"><img src="img/pbm-hero.webp" alt="Packly Business Manager: finance, dashboard and POS sale screens" width="2000" height="1125" fetchpriority="high" decoding="async" style="width:100%;height:auto;display:block"></div>`,
  sections:[
   ['intro','Introduction','A back office in the merchant\'s pocket', `<p class="lead">Packly Business Manager is where merchants run their business on Packly.</p><p>I designed the mobile app for everyday merchant work and the web platform for merchants operating at a larger scale, and evolved both from V1 to V2.</p>`],
   ['context','Context','A lot of business in one product', `<p>The product covers the full operating loop of a merchant. Each area is a product in its own right, and they all depend on each other.</p><div class="chips" style="margin-top:4px">${['Products','Inventory','Orders','Sales','Customers','Campaigns','Warehouses','Multiple channels','Marketplace operations'].map(x=>`<span class="chip" style="color:var(--text);border-color:var(--line)">${x}</span>`).join('')}</div><figure class="wide-shot" style="margin-top:24px"><div class="frame"><img src="img/pbm-cover.jpg" alt="Packly Business Manager campaign image showing a small business owner using the app" width="2048" height="1000" loading="lazy" decoding="async"></div><figcaption>Packly Business Manager brings the tools for running a small business into one mobile app.</figcaption></figure>`],
   ['problem','Problem','Complex workflows, mixed experience levels', `<div class="problem"><div><span class="meta">Problem</span><p style="margin-top:12px">Merchant workflows are complex. One sale touches products, stock, orders, payments and sometimes several channels at once.</p></div><div><span class="meta">Challenge</span><p style="margin-top:12px">Make a complex business system understandable for merchants with varying levels of technical knowledge.</p></div></div>`],
   ['users','Users','Two platforms, two ways of working', `<div class="two"><div class="box inkb"><span class="meta">Mobile app</span><h3>Merchants on the move</h3><p>Everyday tasks: adding products, checking stock, handling orders, POS billing and payouts.</p></div><div class="box"><span class="meta">Web platform</span><h3>Merchants at larger scale</h3><p>Complex dashboards and workflows for inventory, orders, products, sales, campaigns and multi-channel management.</p></div></div>`],
   ['ia','Information Architecture','How the product is structured', `<div class="ia-map">
      <div class="ia-map-head"><b>Business Manager</b><span>One model across mobile and web</span></div>
      <div class="ia-map-grid">
        <article class="ia-map-card"><h3>Catalogue</h3><ul><li>Products and variants</li><li>SKU and pricing</li><li>Active, inactive and draft</li></ul></article>
        <article class="ia-map-card"><h3>Inventory</h3><ul><li>Stock levels</li><li>Warehouses</li><li>Low-stock visibility</li></ul></article>
        <article class="ia-map-card"><h3>Orders</h3><ul><li>Status tabs and returns</li><li>COD and paid orders</li></ul></article>
        <article class="ia-map-card"><h3>Sales</h3><ul><li>POS billing</li><li>Seller center and shop</li><li>Multiple channels</li></ul></article>
        <article class="ia-map-card"><h3>Money</h3><ul><li>Payouts</li><li>Earnings breakdown</li><li>Reports</li></ul></article>
        <article class="ia-map-card"><h3>Growth</h3><ul><li>Customers</li><li>Campaigns</li><li>Marketplace operations</li></ul></article>
      </div>
      <p class="ia-map-foot">Core merchant workflows grouped by the job they support.</p>
    </div>`],
   ['iteration','Iteration','From V1 to V2', `<div class="versions"><div class="box"><span class="meta">V1</span><h3>Cover the core jobs</h3><p>The first release of the app and web platform, covering products, inventory, orders, sales, customers and business operations.</p></div><div class="arrow">${ARROW}</div><div class="box inkb"><span class="meta">V2</span><h3>Make them faster</h3><p>Simplified workflows, a clearer information hierarchy, and everyday merchant tasks that take less time to complete.</p></div></div>`],
   ['ui','Final UI · Mobile','Selected screens from the live app', `<div class="gallery">${fig('pbm-app-inventory','Product list','Status filters with counts, stock and price on each row.')}${fig('pbm-app-orders','Shop orders','Order ID, amount, payment type and customer in one card.')}${fig('pbm-app-pos','POS sale','Search, scan and image-first product grid.')}${fig('pbm-app-payouts','Payouts','Available balance and the full earnings breakdown.')}</div>`],
   ['decisions','Key Design Decisions','Decisions visible in the shipped product', `<div class="sf-decisions">
      <article class="sf-decision"><h3>Show queue size on the filter</h3><p>Counts beside status filters help merchants see how much work is waiting before opening a list.</p></article>
      <article class="sf-decision"><h3>Put the details needed to act on each order</h3><p>Order cards bring ID, amount, payment type, customer and item count into the list for quick triage.</p></article>
      <article class="sf-decision"><h3>Explain the payout line by line</h3><p>Show the requestable balance first, then delivered amount, delivery charge, commission and COD charge.</p></article>
      <article class="sf-decision"><h3>Make POS ready for the counter</h3><p>Keep search and scan shortcuts close, with a product grid that puts images and prices up front.</p></article>
    </div>`],
   ['outcome','Outcome','Where it landed', `<div class="outcome"><div class="box sageb"><span class="meta">Shipped</span><h3>Live on app and web</h3><p>Two versions released to Packly merchants.</p></div><div class="box sageb"><span class="meta">Workflow</span><h3>Simpler everyday tasks</h3><p>V2 reduced the effort of common merchant jobs.</p></div><div class="box sageb"><span class="meta">Structure</span><h3>Clearer hierarchy</h3><p>A complex system organised into areas merchants recognise.</p></div></div>`],
   ['live','Live Product','See it in the wild', `<div class="live-card"><b>Packly Business Manager is live.</b><div class="links">${ext(PB+'com.packlybusiness.app','Google Play')}${ext('https://business.packly.com/sell-with-us','Web platform')}</div></div>`]
  ]},

'packly-marketplace': {
  name:'Packly Marketplace', eyebrow:'Case study 03 · Ecommerce',
  title:'One store for customers, many shops behind it',
  lead:'A multi-vendor marketplace covering the customer journey from discovery to checkout and orders, and the vendor experience that powers it.',
  meta:[['Role','Mid UI/UX Designer, Zavisoft'],['Platform','Web + Mobile'],['Versions','V1 live · V2 in development'],['Status','<a href="https://www.packly.com/" target="_blank" rel="noopener">packly.com ↗</a>']],
  cover:`<div class="cover-frame"><div class="shot">${img('packly-web-home','Packly marketplace home page',1)}</div></div>`,
  sections:[
   ['intro','Introduction','A marketplace in two iterations', `<p class="lead">Packly is a multi-vendor commerce platform in Bangladesh.</p><p>I designed two iterations of it, covering customer shopping journeys, product discovery, vendor experiences, checkout, order management and marketplace workflows.</p>`],
   ['context','Context','Three sides of one purchase', `<div class="three"><div class="box"><span class="meta">Customer</span><h3>Finds and buys</h3><p>Discovers products, compares, adds to cart from several shops, checks out and follows orders.</p></div><div class="box inkb"><span class="meta">Marketplace</span><h3>Connects</h3><p>Categories, search, campaigns and order management tie buyers and sellers together.</p></div><div class="box"><span class="meta">Vendor</span><h3>Sells</h3><p>Runs a shop, lists products and fulfils orders, with tools in <a href="#packly-business-manager">Business Manager</a>.</p></div></div>`],
   ['problem','Problem','One store, many sellers', `<div class="problem"><div><span class="meta">Problem</span><p style="margin-top:12px">A marketplace has to feel like one store to the customer, while every seller's products, stock and orders stay separate.</p></div><div><span class="meta">Challenge</span><p style="margin-top:12px">Iterate the product architecture and UX into a more scalable, conversion-focused commerce experience.</p></div></div>`],
   ['flow','User Flow','The customer journey', `<div class="focus-list f5"><div><b>Discover</b><span>Home, campaigns, search</span></div><div><b>Browse</b><span>Categories, listings</span></div><div><b>Decide</b><span>Product details, variants</span></div><div><b>Cart</b><span>Grouped by shop</span></div><div><b>Order</b><span>Checkout, tracking</span></div></div>`],
   ['ui','Final UI','Selected screens from the live product', `<div class="gallery">${fig('pk-app-home','Home','Search, banner, campaigns and categories above the fold.')}${fig('pk-app-categories','Categories','Two-level browsing with image tiles.')}${fig('pk-app-flash','Flash sale','Countdown and discount on every card.')}${fig('pk-app-cart','Cart','Items grouped under each shop.')}</div><p class="scope-note">Screens from the Packly shopping app on Google Play and packly.com.</p>`],
   ['decisions','Key Design Decisions','Decisions visible in the shipped product', `<div class="market-decisions">
      <article class="market-decision"><span class="market-decision-num">01</span><h3>Group cart items by shop</h3><p>Keep each seller’s items together so customers can check out across shops and still see who fulfils each order.</p></article>
      <article class="market-decision"><span class="market-decision-num">02</span><h3>Make category paths visible</h3><p>Use top-level categories and expandable groups to help shoppers browse a large catalogue without deep menus.</p></article>
      <article class="market-decision"><span class="market-decision-num">03</span><h3>Bring campaigns into discovery</h3><p>Place seasonal offers and flash sales near the home entry point. Show the discount and countdown on product cards so shoppers can scan the offer before opening it.</p></article>
    </div>`],
   ['iteration','Iteration','V1 to V2', `<div class="versions"><div class="box"><span class="meta">V1 · Live</span><h3>The marketplace foundation</h3><p>Customer journeys, vendor experiences, checkout and order management.</p></div><div class="arrow">${ARROW}</div><div class="box inkb"><span class="meta">V2 · In development</span><h3>Scalable and conversion-focused</h3><p>Reworked architecture and UX for a larger catalogue and a smoother path to purchase.</p></div></div><figure class="wide-shot"><div class="frame">${img('pk-v2-home','Packly marketplace V2 home page')}</div><figcaption>V2 home page: campaign shortcuts, hero promotions, combo and winter sales, flash sale with countdown, daily picks, app download and Packly Play short videos.</figcaption></figure>`],
   ['outcome','Outcome','Where it landed', `<div class="outcome"><div class="box sageb"><span class="meta">Shipped</span><h3>Live on web and app</h3><p>V1 in market, V2 under development.</p></div><div class="box sageb"><span class="meta">Structure</span><h3>One journey, many sellers</h3><p>Multi-vendor complexity kept out of the customer's way.</p></div><div class="box sageb"><span class="meta">Ecosystem</span><h3>Connected to vendor tools</h3><p>Designed alongside Packly Business Manager.</p></div></div>`],
   ['live','Live Product','See it in the wild', `<div class="live-card"><b>Packly Marketplace is live.</b><div class="links">${ext('https://www.packly.com/','packly.com')}${ext(PB+'com.packly.app','Google Play')}</div></div>`]
  ]},

'payment-gateway': {
  name:'Payment Gateway Ecosystem', eyebrow:'Case study 04 · Fintech',
  title:'Three connected products around every payment',
  lead:'The gateway people pay through, the merchant panel businesses run their money from, and the admin tools that oversee it all.',
  meta:[['Role','Mid UI/UX Designer, Zavisoft'],['Platform','Gateway app + Web panels'],['Scope','3 connected products'],['Industry','Fintech · Payments']],
  cover:`<div class="cover-frame" style="padding-bottom:clamp(20px,4vw,56px)"><div class="shot" style="border-radius:12px;border:1px solid var(--line);max-width:1100px">${pgImg('pg-transactions','Merchant panel transactions list',1)}</div></div>`,
  sections:[
   ['intro','Introduction','One payment, three points of view', `<p class="lead">I designed multiple products within a payment ecosystem: the payment gateway application, the merchant panel and the admin panel.</p><p>Together they cover payment processing, transaction management, merchant operations, monitoring and administration.</p>`],
   ['problem','Problem','Different roles, same money', `<div class="pg-case-problem">
      <article><span class="pg-case-index">01 · Customer</span><h3>“Did my payment go through?”</h3><p>Customers need clear payment choices, a visible amount and a definite result.</p></article>
      <article><span class="pg-case-index">02 · Merchant</span><h3>“When will the money arrive?”</h3><p>Merchants need to distinguish a successful payment from funds still awaiting settlement.</p></article>
      <article><span class="pg-case-index">03 · Admin</span><h3>“What needs attention?”</h3><p>Admins need to monitor payment activity and manage merchants across the system.</p></article>
    </div><div class="pg-case-challenge"><span>Design challenge</span><p>Connect these views around one payment lifecycle while keeping each role focused on the decisions they own.</p></div>`],
   ['users','Users','One payment, three jobs', `<div class="pg-case-roles">
      <article class="pg-case-role"><span class="pg-case-index">01 · Gateway app</span><h3>Payers</h3><b>Complete a payment</b><p>Choose a method, review the amount and confirm the result.</p></article>
      <article class="pg-case-role"><span class="pg-case-index">02 · Merchant panel</span><h3>Merchants</h3><b>Run payment operations</b><p>Track transactions, configure stores and EMI, and follow settlements.</p></article>
      <article class="pg-case-role"><span class="pg-case-index">03 · Admin panel</span><h3>Admins</h3><b>Oversee activity</b><p>Monitor payment activity and administer merchant accounts.</p></article>
    </div>`],
   ['ui','Final UI','The merchant panel', `<figure class="wide-shot"><div class="frame">${pgImg('pg-transactions','Transactions')}</div><figcaption><b>Transactions.</b> Status summary cards, status tabs with counts, and every row showing method, amount, fee, net, payment status and settlement status.</figcaption></figure>
     <figure class="wide-shot"><div class="frame">${img('pg-dash-full','Payment gateway analytics')}</div><figcaption><b>Report &amp; analytics.</b> KPIs with trends, transaction performance, payment-method mix, refunds, chargebacks, collection breakdown and a monthly report.</figcaption></figure>
     <div class="two"><figure class="wide-shot"><div class="frame">${pgImg('pg-store','Store settings')}</div><figcaption><b>Store settings.</b> Payment methods, API keys, webhooks and checkout redirects for one store, with a live summary on the side.</figcaption></figure>
     <figure class="wide-shot"><div class="frame">${pgImg('pg-emi','EMI configuration')}</div><figcaption><b>EMI configuration.</b> Bank EMI rules, tenure plans with interest and monthly amount, and eligible card networks.</figcaption></figure></div>`],
   ['decisions','Key Design Decisions','Decisions visible in the product', `<div class="pg-case-decisions">
      <article class="pg-case-decision"><h3>Show payment and settlement separately</h3><p>A payment can succeed before funds are settled. Separate statuses make that difference visible in the transaction list.</p></article>
      <article class="pg-case-decision"><h3>Put fee and net beside the amount</h3><p>Merchants can see the gross amount, gateway fee and expected net without opening each transaction.</p></article>
      <article class="pg-case-decision"><h3>Keep the summary beside the settings</h3><p>Store and EMI forms pair configuration with a summary, so merchants can review what they are changing.</p></article>
      <article class="pg-case-decision"><h3>Make sensitive settings deliberate</h3><p>Mask secret keys and let merchants control webhook events with clear on/off states.</p></article>
    </div>`],
   ['outcome','Outcome','Where it landed', `<div class="two"><div class="box sageb"><span class="meta">Delivered</span><h3>Three connected products</h3><p>Gateway, merchant panel and admin panel designed as one system.</p></div><div class="box sageb"><span class="meta">Consistency</span><h3>One language across roles</h3><p>The same payment reads the same way to payer, merchant and admin.</p></div></div>`]
  ]},

'bonsaihd': {
  name:'BonsaiHD', eyebrow:'Case study 05 · Streaming',
  title:'Designing a streaming app that helps you find what to watch',
  lead:'A mobile streaming platform for movies and series, built around personalised discovery, mood-based AI recommendations, social viewing and a subscription that earns its value before asking.',
  meta:[['Role','Product Designer'],['Platform','Mobile app (iOS & Android)'],['Features','Streaming · AI · Social viewing · VIP'],['Status','Shipped']],
  cover:`<div class="cover-frame" style="padding:0!important;background:none"><img src="img/bonsai-hero.webp" alt="BonsaiHD streaming app: home, movie detail and VIP upgrade screens" width="2000" height="1125" fetchpriority="high" decoding="async" style="width:100%;height:auto;display:block"></div>`,
  sections:[
   ['intro','Introduction','From opening the app to pressing Play', `<p class="lead">BonsaiHD is a streaming service for movies and series.</p><p>I designed the complete experience: a personalised home, movie and series detail pages, a mood-based AI recommendation tool, social watch parties, a VIP subscription and the full profile flow.</p>`],
   ['context','Context','A library isn\'t enough', `<p>Streaming users spend as much time deciding what to watch as they do watching. Most apps surface the same trending rows every session. BonsaiHD needed a discovery model that felt mood-aware and personal, not just popularity-ranked.</p>`],
   ['problem','Problem','What needed solving', `<div class="problem"><div><span class="meta">Problem</span><p style="margin-top:12px">Browsing felt generic. Users opened the app knowing they wanted to watch something but couldn't quickly find what matched how they felt right now.</p></div><div><span class="meta">Goal</span><p style="margin-top:12px">Make the path from opening the app to pressing Play shorter — through smarter discovery, an AI shortcut and a social layer for watching with others.</p></div></div>
   <div class="focus-list" style="margin-top:24px">
     <div><b>Discovery</b><span>Trending rows feel the same every session.</span></div>
     <div><b>Mood gap</b><span>Users know a feeling, not a title.</span></div>
     <div><b>Social</b><span>No way to watch together remotely.</span></div>
     <div><b>Conversion</b><span>VIP upsell appeared before value was clear.</span></div>
   </div>`],
   ['ia','Key Features','What the app does', `<div class="focus-list">
     <div><b>Personalised home</b><span>Just For You row, K-Drama picks, new releases and editorial sections.</span></div>
     <div><b>Ask Bonsai AI</b><span>A mood-based chatbot that finds one best match and surfaces more options below it.</span></div>
     <div><b>Watch With Friends</b><span>Create a room, share a code or QR link, invite up to 8 people, watch in sync.</span></div>
     <div><b>VIP subscription</b><span>Popular Plan and Standard Plan with 7-day trial, shown at the right moment with a time-limited offer.</span></div>
   </div>`],
   ['iteration','Subscription Design','Making the upgrade feel earned', `<div class="versions"><div class="box"><span class="meta">Before</span><h3>Hard gate, no context</h3><p>The VIP wall appeared as a blocker with no visible feature comparison or reason to upgrade.</p></div><div class="arrow">→</div><div class="box inkb"><span class="meta">After</span><h3>Value before commitment</h3><p>The paywall shows features first, a countdown makes the offer concrete, and a 7-day trial lowers the risk of signing up.</p></div></div>`],
   ['decisions','Key Design Decisions','Decisions visible in the shipped product', `<div class="sf-decisions">
     <article class="sf-decision"><h3>Lead with mood, not genre</h3><p>Ask Bonsai AI opens with a mood selector — emoji-based, immediate — because users often know how they feel before they know what they want to watch.</p></article>
     <article class="sf-decision"><h3>Surface one best match at 98%</h3><p>The AI result shows a single prominent card with an instant Play button. One confident answer beats a wall of options.</p></article>
     <article class="sf-decision"><h3>Make the offer visible and honest</h3><p>A live countdown ("Offer ends in 00:59:54") creates urgency that's concrete and transparent, not manufactured by dark patterns.</p></article>
     <article class="sf-decision"><h3>Treat the profile as a record, not just settings</h3><p>Movies and series watched counts give users a reason to visit profile beyond account management. Stats make the product feel personal.</p></article>
   </div>`],
   ['users','Who the App Serves', 'Three viewer types', `<div class="two"><div class="box inkb"><span class="meta">Primary</span><h3>The casual browser</h3><p>Opens the app without a title in mind. Needs discovery that narrows fast — mood chips, AI recommendations, personalised rows.</p></div><div class="box"><span class="meta">Secondary</span><h3>The social watcher</h3><p>Watches with friends or follows what others are watching. Needs Watch With Friends, shared lists and Friends activity.</p></div></div>
   <div class="two" style="margin-top:16px"><div class="box"><span class="meta">Tertiary</span><h3>The power subscriber</h3><p>Heavy viewer who wants offline downloads, early access to new releases and ad-free playback — the core VIP audience.</p></div><div class="box"><span class="meta">Upsell target</span><h3>The free user</h3><p>Uses the core experience but hasn't committed. The subscription is designed to convert this user by showing value before the ask.</p></div></div>`],
   ['focus','Design Challenges','Four things the design had to get right', `<div class="focus-list">
     <div><b>Speed to play</b><span>Reduce the number of decisions between opening the app and pressing Play.</span></div>
     <div><b>AI that feels useful</b><span>Make Bonsai AI a genuine shortcut, not a chatbot gimmick.</span></div>
     <div><b>Social without friction</b><span>Watch parties need to be easy to start and join — room codes and QR links, nothing that needs a separate account.</span></div>
     <div><b>Subscription that converts</b><span>The VIP tier had to earn its price by demonstrating value, not blocking access.</span></div>
   </div>`],
   ['flow','Core User Journeys','From intent to action', `<div class="focus-list f4">
     <div><b>Browse → Play</b><span>Home → Just For You → movie detail → Watch Now</span></div>
     <div><b>AI → Play</b><span>Ask Bonsai AI → mood → best match card → Play</span></div>
     <div><b>Party → Watch</b><span>Detail → Watch With Friends → room → invite → Start Party</span></div>
     <div><b>Free → VIP</b><span>Paywall → plan comparison → time-limited offer → trial start</span></div>
   </div>`],
   ['outcome','Outcome','Where it landed', `<div class="outcome"><div class="box sageb"><span class="meta">Shipped</span><h3>Complete streaming product</h3><p>Discovery, AI, social viewing and subscription designed as one experience.</p></div><div class="box sageb"><span class="meta">AI layer</span><h3>Mood-to-movie in one tap</h3><p>Ask Bonsai AI takes a mood and returns a single best match — no browsing required.</p></div><div class="box sageb"><span class="meta">Social</span><h3>Watch With Friends for 8</h3><p>Room codes and QR sharing let groups of up to 8 watch together in sync.</p></div></div>`]
  ]},

'packly-business-manager-v2': {
  name:'Packly Business Manager V2', eyebrow:'Case study 06 · SaaS / Mobile',
  title:'Redesigning the merchant app for clarity and speed',
  lead:'A ground-up redesign of the Packly Business Manager mobile app — a cleaner home, smarter product management, and performance analytics merchants can read at a glance.',
  meta:[['Role','Mid UI/UX Designer, Zavisoft'],['Platform','Mobile app (Android)'],['Version','V2 — redesign of V1'],['Status',`<a href="https://play.google.com/store/apps/details?id=com.packlybusiness.app" target="_blank" rel="noopener">Live on Google Play ↗</a>`]],
  cover:`<div class="cover-frame" style="padding:0!important;background:none"><img src="img/pbmv2-hero.webp" alt="Packly Business Manager V2: My Shop, home and analytics screens" width="2000" height="1125" fetchpriority="high" decoding="async" style="width:100%;height:auto;display:block"></div>`,
  sections:[
   ['intro','Introduction','From V1 to a faster, cleaner merchant tool', `<p class="lead">Packly Business Manager is the merchant's command centre on Packly.</p><p>I redesigned the V2 mobile app from the ground up — restructuring the home, rebuilding product management, and adding an analytics screen that puts earnings and performance numbers front and centre.</p>`],
   ['context','Context','A lot to manage, not enough clarity', `<p>Packly merchants use the app every day to track orders, manage products, check performance and run their shop. V1 covered all the jobs. V2 needed to make each one faster — especially for merchants handling high volumes of orders and large product catalogues.</p>`],
   ['problem','Problem','What needed changing', `<div class="problem"><div><span class="meta">Problem</span><p style="margin-top:12px">The home was dense and hard to scan. Key numbers — order counts, earnings, channel performance — required too many steps to reach. Product management lacked clear status visibility.</p></div><div><span class="meta">Goal</span><p style="margin-top:12px">Restructure the information hierarchy so the most-used data is always one look away, and the most-common tasks are one tap from home.</p></div></div>
   <div class="focus-list" style="margin-top:24px">
     <div><b>Home clarity</b><span>Order status buried in navigation, not visible on load.</span></div>
     <div><b>Analytics</b><span>Earnings and KPIs required multiple screens to piece together.</span></div>
     <div><b>Product management</b><span>No clear status filters; adding a product was a single long form.</span></div>
     <div><b>Shop tools</b><span>Seller profile and shop management not accessible from home.</span></div>
   </div>`],
   ['ia','Key Features','What the redesign delivers', `<div class="focus-list">
     <div><b>Redesigned home</b><span>Order status tiles (Pending, Processing, Delivered) at the top — visible the moment you open the app. Packly Commerce and Product &amp; Inventory shortcuts grouped separately.</span></div>
     <div><b>Analytics screen</b><span>Net earnings chart with period comparison, four KPI tiles (Total Sales, Total Orders, Total Expense, Gross Profit) and trend indicators vs previous period.</span></div>
     <div><b>Product management</b><span>Status-filtered list (All, My Product, Draft, Trash) with product name, SKU, price, stock and status badge on each row. Add Product uses a stepped form with drag-to-reorder image upload.</span></div>
     <div><b>My Shop</b><span>Seller profile with followers, product count and rating score. In-app shop and product listing management.</span></div>
   </div>`],
   ['iteration','V1 → V2','How the redesign changed the product', `<div class="versions"><div class="box"><span class="meta">V1</span><h3>Full feature coverage</h3><p>Every merchant job covered in one app — products, inventory, orders, sales, customers, campaigns and payouts.</p></div><div class="arrow">→</div><div class="box inkb"><span class="meta">V2</span><h3>Faster, clearer, better organised</h3><p>Same feature set, rebuilt information hierarchy. Daily tasks are now visible or reachable in one tap from a cleaner home.</p></div></div>`],
   ['decisions','Key Design Decisions','Decisions visible in the shipped product', `<div class="sf-decisions">
     <article class="sf-decision"><h3>Surface order status first</h3><p>Pending, Processing and Delivered counts sit at the very top of home as prominent tiles — the first thing merchants see when they open the app.</p></article>
     <article class="sf-decision"><h3>Group tools by mental model</h3><p>Packly Commerce (shop-facing: My Shop, Reviews, Returns) and Product &amp; Inventory (stock-facing: Products, Purchase, Sales, Stock) are different jobs, so they live in separate sections.</p></article>
     <article class="sf-decision"><h3>Show earnings in context</h3><p>The analytics chart plots net earnings against a trend line with previous-period comparison, so merchants can see direction without doing the maths themselves.</p></article>
     <article class="sf-decision"><h3>Break product creation into steps</h3><p>A two-step Add Product flow (Basic Information → Advanced Details) with drag-to-reorder image upload replaces the original single scrolling form.</p></article>
   </div>`],
   ['users','Who the App Serves','Merchants at different scales', `<div class="two"><div class="box inkb"><span class="meta">Primary</span><h3>Merchant owner</h3><p>Checks order status daily, monitors earnings and channel performance, manages the product catalogue and runs the shop.</p></div><div class="box"><span class="meta">Secondary</span><h3>Merchant manager</h3><p>Handles product listing, order management and inventory on behalf of the owner — uses the app throughout the day.</p></div></div>`],
   ['focus','Design Challenges','Four things the redesign had to get right', `<div class="focus-list">
     <div><b>Scannability</b><span>The most important numbers visible without scrolling or tapping.</span></div>
     <div><b>Task speed</b><span>Frequent actions (check orders, add a product, see earnings) reachable in one tap.</span></div>
     <div><b>Product scale</b><span>A list of 120+ products needs clear filters and status badges, not just a flat scroll.</span></div>
     <div><b>Shop in-app</b><span>Merchants needed to manage their Packly seller profile without leaving the app.</span></div>
   </div>`],
   ['flow','Core User Journeys','From intent to action', `<div class="focus-list f4">
     <div><b>Daily check</b><span>Home → order tiles → channel mix → act on priority orders</span></div>
     <div><b>Product work</b><span>Products tab → status filter → select item → edit or add new</span></div>
     <div><b>Performance</b><span>Analytics tab → earnings chart → KPI tiles → period comparison</span></div>
     <div><b>Shop</b><span>Packly Commerce → My Shop → profile, followers, ratings, listings</span></div>
   </div>`],
   ['outcome','Outcome','Where it landed', `<div class="outcome"><div class="box sageb"><span class="meta">Shipped</span><h3>Live on Google Play</h3><p>V2 released to Packly merchants as the primary mobile management tool.</p></div><div class="box sageb"><span class="meta">Home</span><h3>Orders visible on open</h3><p>Pending, Processing and Delivered counts surface immediately without any navigation.</p></div><div class="box sageb"><span class="meta">Analytics</span><h3>Performance at a glance</h3><p>Net earnings, sales, orders, expense and profit in one screen with trend context.</p></div></div>`]
  ]}
};
const ORDER = ['steadfast-merchant','packly-business-manager','packly-marketplace','payment-gateway','bonsaihd','packly-business-manager-v2'];



/* ---------- views ---------- */
const view = document.getElementById('view');
const tplHome = document.getElementById('tpl-home');
const tplContact = document.getElementById('tpl-contact');
let current = null;

function buildHome(){
  const frag = tplHome.content.cloneNode(true);
  frag.getElementById('work-grid').innerHTML = WORK.map(workCard).join('');
  frag.getElementById('rows').innerHTML = MORE.map(rowItem).join('');
  return frag;
}
/* ---------- Payment Gateway case study ---------- */
function buildStory(c, prev, prevSlug, next, nextSlug){
  const customerSteps = [
    ['Choose a payment method','Card, mobile banking or net banking. The amount stays visible.','pg-customer-card','Choose a payment method, with card form and payment options'],
    ['Select a route','Offer familiar local wallet choices in one place.','pg-customer-mobile-banking','Mobile banking payment options including bKash, Nagad and Rocket'],
    ['Choose a bank','Show participating banks and their available EMI plans.','pg-customer-emi-banks','Participating banks list with available installment plans'],
    ['Review the plan','Make tenure, interest and monthly amount comparable before confirmation.','pg-customer-emi-plan','Selected three month installment plan with monthly payment'],
    ['Confirm the result','Give the customer a clear success state and a useful receipt.','pg-customer-receipt','Payment receipt confirming successful payment']
  ];
  const image = (name, alt, eager=false) => `<img src="img/${name}.png" alt="${alt}" width="945" height="2048" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async">`;
  const customerCards = customerSteps.map((s,k)=>`<article class="pg-flow-card"><figure>${image(s[2],s[3],k===0)}</figure><div class="pg-flow-caption"><b>${String(k+1).padStart(2,'0')} · ${s[0]}</b><p>${s[1]}</p></div></article>`).join('');
  const el=document.createElement('div');
  const uiCards = [
    ['Transactions','pg-transactions','Transactions screen with payment and settlement status, filters and net amount.'],
    ['Analytics','pg-dash-full','Merchant analytics showing collection, payment method mix and settlement figures.'],
    ['Store settings','pg-store','Store configuration with payment methods, keys and a persistent summary.'],
    ['EMI settings','pg-emi','EMI configuration with bank plans and installment details.']
  ].map(x=>`<figure class="pg-ui-card"><div class="frame">${pgImg(x[1],x[2],false)}</div><figcaption><b>${x[0]}</b>${x[2]}</figcaption></figure>`).join('');
  el.innerHTML = `
  <div class="pg-story">
    <section class="pg-hero">
      <div class="wrap">
        <p class="pg-crumb"><a href="#work">← Projects</a><span>/</span><span>Project details</span></p>
        <div class="pg-hero-grid">
          <div>
            <p class="pg-eyebrow">Case study 04 · Fintech</p>
            <h1 id="cs-title" tabindex="-1">Payment Gateway Ecosystem</h1>
            <p class="pg-hero-copy">Designing the customer payment journey and the connected tools merchants and admins use to manage each transaction.</p>
            <div class="pg-meta-row">
              <div><span>Industry</span><b>Fintech · Payments</b></div>
              <div><span>Service</span><b>Product design</b></div>
              <div><span>My role</span><b>UI/UX Designer · Zavisoft</b></div>
              <div><span>Scope</span><b>Customer checkout + web panels</b></div>
            </div>
          </div>
          <div class="pg-hero-art" aria-label="Customer checkout and payment receipt screens">
            <div class="pg-hero-shot main">${image('pg-customer-card','Customer payment screen with card and mobile banking options',true)}</div>
            <div class="pg-hero-shot method">${image('pg-customer-mobile-banking','Mobile banking payment method selection screen')}</div>
            <div class="pg-hero-shot receipt">${image('pg-customer-receipt','Customer payment success receipt')}</div>
          </div>
        </div>
      </div>
    </section>
    <section class="pg-section">
      <div class="wrap">
        <div class="pg-section-head"><p class="pg-label">Project description</p><div><h2>One payment system, designed for three roles.</h2><p class="pg-deck">A customer chooses how to pay and needs a clear result. A merchant tracks transactions and settlements. An admin monitors activity across the system. I designed connected experiences around the same payment lifecycle.</p></div></div>
      </div>
    </section>
    <section class="pg-section soft">
      <div class="wrap">
        <div class="pg-section-head"><p class="pg-label">Problem &amp; challenge</p><div><h2>Make a complex money journey easy to read.</h2></div></div>
        <div class="pg-problem-grid">
          <article><span class="meta">The problem</span><h3>A payment can be successful before its funds are settled.</h3><p>For the customer, the key question is whether payment went through. For the merchant, the next question is how much will arrive and when.</p></article>
          <article><span class="meta">The challenge</span><h3>Keep each step clear without losing the full picture.</h3><p>Checkout, EMI selection, transaction tracking and settlement details belong to different moments and roles, but all refer to the same payment.</p></article>
        </div>
      </div>
    </section>
    <section class="pg-section">
      <div class="wrap">
        <div class="pg-section-head"><p class="pg-label">Our solution</p><div><h2>Three design decisions connect the experience.</h2></div></div>
        <div class="pg-solution-grid">
          <article><span class="num">01</span><h3>Keep payment choices and amount together</h3><p>Card, mobile banking and net banking sit alongside the amount due, so the customer can choose without losing context.</p></article>
          <article><span class="num">02</span><h3>Make EMI terms comparable before confirmation</h3><p>Bank, tenure, interest and monthly payment appear as a structured choice; confirmation repeats the selected plan.</p></article>
          <article><span class="num">03</span><h3>Separate paid from settled</h3><p>The merchant table shows payment and settlement status separately, with fee and net amount beside the transaction.</p></article>
        </div>
      </div>
    </section>
    <section class="pg-section soft" id="pg-flow">
      <div class="wrap">
        <div class="pg-section-head"><p class="pg-label">Design process · Customer flow</p><div><h2>From payment method to confirmation.</h2><p class="pg-deck">The customer screens make the sequence tangible: choose a method, select a route or bank, review EMI, then receive a receipt.</p></div></div>
        <div class="pg-flowline" aria-label="Payment steps"><span>Choose method</span><span>Select route</span><span>Choose bank</span><span>Review EMI</span><span>Confirmation</span></div>
        <div class="pg-flow-grid">${customerCards}</div>
      </div>
    </section>
    <section class="pg-section">
      <div class="wrap">
        <div class="pg-section-head"><p class="pg-label">Style &amp; components</p><div><h2>Use the same visual cues for the same money states.</h2><p class="pg-deck">The interface repeats a small set of patterns so customers and operators can recognise choices, payment states and amounts quickly.</p></div></div>
        <div class="pg-principles">
          <article><b>State is explicit</b><p>Labels distinguish paid, pending, failed, refunded and settled states.</p></article>
          <article><b>Money is explained</b><p>Amounts, gateway fees and net settlement are shown as separate values.</p></article>
          <article><b>Selection is visible</b><p>Payment method, bank and EMI plan choices use clear active states.</p></article>
        </div>
      </div>
    </section>
    <section class="pg-section soft" id="pg-decisions">
      <div class="wrap">
        <div class="pg-section-head"><p class="pg-label">Final UI design · Merchant tools</p><div><h2>The merchant side carries the payment story forward.</h2><p class="pg-deck">Transaction tracking, analytics and configuration keep the operational details close to the actions merchants need to take.</p></div></div>
        <div class="pg-ui-grid">${uiCards}</div>
      </div>
    </section>
    <section class="pg-section">
      <div class="wrap">
        <div class="pg-section-head"><p class="pg-label">Workflow scenario</p><div><h2>One event, followed through the ecosystem.</h2></div></div>
        <div class="pg-workflow"><div>Customer selects a method</div><div>Gateway processes payment</div><div>Merchant reviews transaction</div><div>Funds move to settlement</div><div>Admin monitors activity</div></div>
      </div>
    </section>
    <section class="pg-section soft">
      <div class="wrap">
        <div class="pg-section-head"><p class="pg-label">The result</p><div><h2>A connected payment experience, from choice to reconciliation.</h2><p class="pg-deck">The delivered design covers customer payment methods and EMI, merchant transaction and settlement visibility, and the shared patterns that connect those experiences to administration.</p></div></div>
        <nav class="pg-next" aria-label="More case studies">
          <a href="#${prevSlug}"><span class="meta">← Previous project</span><span>${prev.name}</span></a>
          <a href="#${nextSlug}"><span class="meta">Next project →</span><span>${next.name}</span></a>
        </nav>
      </div>
    </section>
  </div>`;
  const frag=document.createDocumentFragment(); while(el.firstChild) frag.appendChild(el.firstChild); return frag;
}

function buildCleanPaymentStory(prev, prevSlug, next, nextSlug){
  const screens = [
    ['01','Choose a method','Keep the amount visible while the customer picks card, mobile banking or net banking.','pg-customer-card','Payment method selection with card form and supported methods'],
    ['02','Select a route','Show familiar mobile banking options in one clear step.','pg-customer-mobile-banking','Mobile banking options including bKash, Nagad and Rocket'],
    ['03','Choose a bank','Let customers compare available banks and installment plans.','pg-customer-emi-banks','Participating banks and installment options'],
    ['04','Review the plan','Make tenure, interest and monthly cost easy to compare.','pg-customer-emi-plan','Installment plan selection with monthly amount'],
    ['05','See confirmation','Close the journey with a payment result and receipt details.','pg-customer-receipt','Payment success receipt']
  ];
  const screenImg = (name, alt, eager=false) => `<img src="img/${name}.png" alt="${alt}" width="945" height="2048" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async">`;
  const stepCards = screens.map((s,i)=>`<article class="pg-clean-step"><figure>${screenImg(s[3],s[4],i===0)}</figure><h3><span class="pg-clean-label">${s[0]} / </span>${s[1]}</h3><p>${s[2]}</p></article>`).join('');
  const el=document.createElement('div');
  el.innerHTML=`
  <main class="pg-clean">
    <header class="pg-clean-hero">
      <div class="wrap">
        <p class="pg-clean-crumb"><a href="#work">← Work</a><span>/</span><span>Case study 04 · Fintech</span></p>
        <div class="pg-clean-intro">
          <div><p class="pg-clean-kicker">Payment Gateway Ecosystem</p><h1 id="cs-title" tabindex="-1">A clearer path through every payment.</h1></div>
          <p class="pg-clean-lead">Customer checkout, merchant operations and admin tools designed around one shared payment journey.</p>
        </div>
        <div class="pg-clean-meta">
          <div><span>Role</span><b>Mid UI/UX Designer · Zavisoft</b></div>
          <div><span>Scope</span><b>Customer checkout + web panels</b></div>
          <div><span>Platform</span><b>Gateway app · Merchant · Admin</b></div>
        </div>
      </div>
    </header>
    <section class="wrap" aria-label="Customer payment screens">
      <div class="pg-clean-cover">
        <figure>${screenImg('pg-customer-card','Customer checkout screen with payment methods',true)}</figure>
        <figure>${screenImg('pg-customer-receipt','Customer payment receipt')}</figure>
      </div>
    </section>
    <section class="pg-clean-section">
      <div class="wrap">
        <div class="pg-clean-heading"><p class="pg-clean-label">The project</p><div><h2>One payment. Different questions at every step.</h2><p class="pg-clean-copy">Customers need to know how to pay and whether it worked. Merchants need to understand transaction status and what will be settled. Admins need a clear view across activity. The design connects those needs without making each screen carry every detail.</p></div></div>
        <div class="pg-clean-columns">
          <article class="pg-clean-note"><h3>Customer checkout</h3><p>Payment methods, local banking options, installment plans and confirmation screens guide the payer from choice to receipt.</p></article>
          <article class="pg-clean-note"><h3>Merchant operations</h3><p>Transaction and settlement details sit together so merchants can follow a payment after the customer leaves checkout.</p></article>
        </div>
      </div>
    </section>
    <section class="pg-clean-section" id="pg-customer-flow">
      <div class="wrap">
        <div class="pg-clean-heading"><p class="pg-clean-label">Customer experience</p><div><h2>From choosing how to pay to getting a clear receipt.</h2><p class="pg-clean-copy">The supplied screens show the customer flow, including mobile banking and EMI choices. Each step keeps the next decision visible and understandable.</p></div></div>
        <div class="pg-clean-steps">${stepCards}</div>
      </div>
    </section>
    <section class="pg-clean-section">
      <div class="wrap">
        <div class="pg-clean-heading"><p class="pg-clean-label">Merchant experience</p><div><h2>Keep payment and settlement status easy to scan.</h2><p class="pg-clean-copy">The transactions view brings key payment details into one working surface, helping merchants review status, amounts and settlement information in context.</p></div></div>
        <figure class="pg-clean-merchant">${pgImg('pg-transactions','Merchant transactions list with payment and settlement details',false)}<figcaption class="pg-clean-merchant-caption"><b>Transactions</b><span>Status, amount, fee and net settlement are visible in the same view.</span></figcaption></figure>
      </div>
    </section>
    <section class="pg-clean-section">
      <div class="wrap">
        <div class="pg-clean-end">
          <p class="pg-clean-label">Designed across the payment journey</p>
          <h2>Checkout and operations, connected by a shared view of each payment.</h2>
          <p>The work spans customer payment choices and receipts, merchant transaction management, and admin oversight. The case study focuses on the customer flow and the merchant transaction view shown here.</p>
          <nav class="pg-clean-next" aria-label="More case studies">
            <a href="#${prevSlug}"><span class="meta">← Previous project</span><span>${prev.name}</span></a>
            <a href="#${nextSlug}"><span class="meta">Next project →</span><span>${next.name}</span></a>
          </nav>
        </div>
      </div>
    </section>
  </main>`;
  const frag=document.createDocumentFragment(); while(el.firstChild) frag.appendChild(el.firstChild); return frag;
}

/* Case study layout (from the Excalidraw wireframe), one 1024px column:
   back, banner image, Overview, two images, Problem, Solution, wide image + two
   images, Research, Outcome, closing image. Each text block is a label | content
   row in Orbix-style typography. Existing section content is regrouped by id;
   'ui' screens fill the image slots below. */
// [id, label, source sections]; every block renders as Orbix-style typography
const CASE_BLOCKS = [
  ['problem', 'Problem', ['context', 'problem']],
  ['solution', 'Solution', ['ia', 'iteration', 'decisions']],
  ['research', 'Research', ['users', 'focus', 'flow']],
  ['outcome', 'Outcome', ['outcome']],
];
// [file, title, caption, isPhone]; null = no image yet (placeholder on localhost only)
const CASE_SHOTS = {
  'steadfast-merchant': {
    pair1: [['sf-merchant-1.webp', 'Home and parcel details', 'Frequent actions on top. Parcel details with COD, charges, recipient and rider.', 1],
            ['sf-merchant-summary.webp', 'Parcel summary', 'Every status as a tile with one number.', 1]],
    wide: null,
    pair2: [['sf-merchant-wallet.webp', 'Wallet', 'Requestable amount first, calculation beneath.', 1],
            ['sf-merchant-fraud.webp', 'Fraud check', 'Customer success rate before booking.', 1]],
    end: null },
  'packly-business-manager': {
    pair1: [['pbm-finance-accounts.webp', 'Finance — Accounts', 'Cash in hand, bank balance and linked accounts side by side.'],
            ['pbm-finance-report.webp', 'Finance — Reports', 'Business overview, stock and purchase-and-sales reports grouped by type.']],
    wide: ['pbm-screens.webp', 'Dashboard, Finance & POS', 'Three core screens of the V1 app: the merchant dashboard, finance module and POS sale product grid.'],
    pair2: [['pbm-pos-sale.webp', 'POS Sale', 'Scan or search product grid with filter shortcut — built for fast counter billing.'],
            ['pbm-product-list.webp', 'Product list', 'All, Active, Inactive and Draft filter tabs with name, SKU, price, stock and status on each row.']],
    end: ['pbm-overview.webp', 'App overview', 'Five key screens: dashboard, product list, POS sale, finance accounts and finance report — the full Packly Business Manager V1 experience.'] },
  'packly-marketplace': {
    pair1: [['pk-app-home.webp', 'Home', 'Search, banner, campaigns and categories above the fold.', 1],
            ['pk-app-categories.webp', 'Categories', 'Two-level browsing with image tiles.', 1]],
    wide: ['pk-v2-home.webp', 'Marketplace V2', 'The V2 home in development: campaign-led, with flash sales and daily picks.'],
    pair2: [['pk-app-flash.webp', 'Flash sale', 'Countdown and discount on every card.', 1],
            ['pk-app-cart.webp', 'Cart', 'Items grouped under each shop.', 1]],
    end: null },
  'payment-gateway': {
    pair1: [['pg-store.webp', 'Store settings', 'Payment methods, API keys, webhooks and checkout redirects for one store, with a live summary on the side.'],
            ['pg-emi.webp', 'EMI configuration', 'Bank EMI rules, tenure plans with interest and monthly amount, and eligible card networks.']],
    wide: ['pg-transactions.webp', 'Transactions', 'Status summary cards, status tabs with counts, and every row showing method, amount, fee, net, payment status and settlement status.'],
    pair2: [['pg-customer-card.png', 'Card payment', 'The customer chooses a method and sees the amount before paying.', 1],
            ['pg-customer-receipt.png', 'Receipt', 'A definite result the customer can keep.', 1]],
    end: ['pg-dash-full.webp', 'Report & analytics', 'KPIs with trends, transaction performance, payment-method mix, refunds, chargebacks, collection breakdown and a monthly report.'] },
  'packly-business-manager-v2': {
    pair1: [['pbmv2-analytics.webp', 'Analytics', 'Net earnings chart with period filter, and four KPI tiles — total sales, orders, expense and gross profit with trend vs previous period.'],
            ['pbmv2-products.webp', 'Product list', 'Status-filtered list (All, My Product, Draft, Trash) with name, SKU, price, stock and status badge on every row.']],
    wide: ['pbmv2-screens.webp', 'My Shop, Home & Analytics', 'Three core screens of the V2 redesign: the seller shop profile, the restructured merchant home and the analytics dashboard.'],
    pair2: [['pbmv2-add-product.webp', 'Add Product', 'Step 1 of the two-step product creation flow: name, category, drag-to-reorder images and product details.'],
            ['pbmv2-home.webp', 'Home', 'Order status tiles up front, followed by Packly Commerce and Product & Inventory shortcuts, and channel sales at the bottom.']],
    end: ['pbmv2-overview.webp', 'App overview', 'Five key screens: home, analytics, add product, product list and My Shop — the full Packly Business Manager V2 experience.'] },
  'bonsaihd': {
    pair1: [['bonsai-ai-result.webp', 'Ask Bonsai AI — result', 'Mood matched to a 98% best pick. One prominent card, instant Play.'],
            ['bonsai-ai-mood.webp', 'Ask Bonsai AI — mood selector', 'The chatbot opens with a mood question and emoji-based chips to start the recommendation flow.']],
    wide: ['bonsai-watch-party.webp', 'Watch With Friends', 'Room code, QR link, seat visualisation and one-tap invite for up to 8 people — alongside the video player with sync controls.'],
    pair2: [['bonsai-vip.webp', 'VIP upgrade', 'Countdown offer, feature checklist and plan comparison before asking for commitment.'],
            ['bonsai-profile.webp', 'Profile', 'Movies and series watched, upgrade banner, watchlist, history, downloads and settings.']],
    end: ['bonsai-screens.webp', 'App overview', 'Profile, paywall, VIP state, home with AI recommendation and chatbot — the full BonsaiHD experience across screens.'] },
};

function caseFig(im, size, cls){
  if(!im) return DEV ? `<figure class="cx-fig ${cls}"><div class="cx-frame pj-empty" aria-hidden="true"><span>${size}</span></div></figure>` : '';
  const [file, title, cap, phone] = im;
  return `<figure class="cx-fig ${cls}${phone ? ' is-phone' : ''}"><div class="cx-frame"><img src="img/${file}" alt="${title}" loading="lazy" decoding="async"></div><figcaption><b>${title}.</b> ${cap}</figcaption></figure>`;
}

// Flatten a section's card components into paragraphs and list items.
const CASE_ITEM = 'article, .box, .ia-map-card, .focus-list > div, .problem > div, .pg-case-challenge, .pg-case-role';
function caseItems(html){
  const t = document.createElement('div'); t.innerHTML = html;
  const clean = x => x.replace(/\s+/g, ' ').trim().replace(/[.:]$/, '');
  const paras = [...t.children].filter(e => e.tagName === 'P').map(e => e.innerHTML.trim()).filter(Boolean);
  const items = [...t.querySelectorAll(CASE_ITEM)].filter(n => !n.querySelector(CASE_ITEM)).map(n => {
    const titleEl = n.querySelector('h3') || n.querySelector('b');
    // a label is small text placed before the title (e.g. PRIMARY, 01 · Gateway app); text after it is body copy
    const before = e => !titleEl || (e.compareDocumentPosition(titleEl) & Node.DOCUMENT_POSITION_FOLLOWING);
    const labelEl = [...n.querySelectorAll('.meta, .pg-case-index, span')].find(e => e !== titleEl && !e.closest('li') && !e.contains(titleEl) && before(e));
    const title = titleEl ? clean(titleEl.textContent) : labelEl ? clean(labelEl.textContent) : '';
    const tag = titleEl && labelEl ? clean(labelEl.textContent).replace(/^\d+\s*(·\s*)?/, '') : '';
    const text = [...n.querySelectorAll('p, span, b')].filter(e => e !== titleEl && e !== labelEl && !e.closest('li') && !e.querySelector('p, span, b'))
      .map(e => e.textContent.trim()).filter(Boolean);
    const list = [...n.querySelectorAll('li')].map(l => clean(l.textContent));
    const joined = [...text, list.length ? list.join(', ') + '.' : ''].filter(Boolean)
      .reduce((acc, x) => acc ? acc + (/[.!?]$/.test(acc) ? ' ' : '. ') + x : x, '');
    return { title, tag, text: joined };
  }).filter(it => it.title);
  const notes = [...t.querySelectorAll('.ia-map-foot')].map(e => e.textContent.trim());
  return { paras, items, notes };
}

function buildCase(slug){
  const c = CASES[slug];
  const shots = CASE_SHOTS[slug] || {};
  const byId = Object.fromEntries(c.sections.map(sc => [sc[0], sc]));
  const row = list => (list && list.some(Boolean)) || DEV ? `<div class="cx-row">${[0, 1].map(k => caseFig(list && list[k], '1200 × 900', '')).join('')}</div>` : '';
  const media = (...parts) => { const h = parts.join('').trim(); return h ? `<div class="cx-media">${h}</div>` : ''; };
  const block = (id, label, body) => `<section class="cx-block rv" id="s-${id}" aria-labelledby="h-${id}"><p class="cx-label">${label}</p><div class="cx-content">${body}</div></section>`;
  const list = items => items.length ? `<ul class="cx-list">${items.map(it => `<li><b>${it.tag ? it.tag + ' · ' : ''}${it.title}${/[?!.”"]$/.test(it.title) ? '' : '.'}</b> ${it.text}</li>`).join('')}</ul>` : '';
  const render = sc => {
    const d = caseItems(sc[3]);
    return d.paras.map(x => `<p>${x}</p>`).join('') + list(d.items) + d.notes.map(x => `<p>${x}</p>`).join('');
  };
  const textBlock = ([id, label, ids]) => {
    const secs = ids.map(x => byId[x]).filter(Boolean);
    if(!secs.length) return '';
    return block(id, label, secs.map((sc, k) => `${k ? `<h3 class="cx-sub">${sc[2]}</h3>` : `<h2 id="h-${id}">${sc[2]}</h2>`}${render(sc)}`).join(''));
  };
  const intro = byId.intro ? caseItems(byId.intro[3]).paras.map(x => `<p>${x}</p>`).join('') : '';
  const overview = block('overview', 'Overview', `<h1 id="cs-title" tabindex="-1">${c.name}</h1>
    <p class="cx-overline">${c.title}</p><p>${c.lead}</p>${intro}
    <dl class="cx-facts">${c.meta.map(m => `<div><dt>${m[0]}</dt><dd>${m[1]}</dd></div>`).join('')}</dl>`);
  const [problem, solution, research, outcome] = CASE_BLOCKS.map(textBlock);

  // Layout from the case study wireframe: back, image, Overview, two images,
  // Problem, Solution, image + two images, Research, Outcome, image.
  const el = document.createElement('div');
  el.innerHTML = `
  <div class="cx">
    <div class="cx-details">
      <a class="pj-back" href="#"><span class="pj-back-icon" aria-hidden="true"><i class="ri-arrow-left-line"></i></span>Back to home</a>
      <div class="cx-banner">${c.cover}</div>
      ${overview}
      ${media(row(shots.pair1))}
      ${problem}
      ${solution}
      ${media(caseFig(shots.wide, '2400 × 1350', 'cx-wide'), row(shots.pair2))}
      ${research}
      ${outcome}
      ${media(caseFig(shots.end, '2400 × 1350', 'cx-wide'))}
      ${moreTrack('More work', caseCards(slug))}
    </div>
  </div>`;
  const frag = document.createDocumentFragment();
  while(el.firstChild) frag.appendChild(el.firstChild);
  return frag;
}

// project page "More work" track: arrows scroll by one card, and grey out at the ends
function wireMoreTrack(){
  const track = view.querySelector('.pj-track');
  if(!track) return;
  const [prev, next] = view.querySelectorAll('.pj-arrow');
  const update = () => {
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  };
  view.querySelectorAll('.pj-arrow').forEach(b => b.addEventListener('click', () => {
    const card = track.querySelector('.pj-card');
    const step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : track.clientWidth * 0.8;
    track.scrollBy({ left: step * +b.dataset.dir, behavior: 'smooth' });
  }));
  track.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(track);
  update();
}

// First More-work card: pinned while a circular mask opens with scroll (musemind-style)
let destroyHome = null;
function mountIntroReveal(){
  const card = view.querySelector('.mw-intro');
  if(!card || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const shot = card.querySelector('.mw-shot'), pic = shot.querySelector('img'), body = card.querySelector('.mw-body');
  const clamp = v => Math.min(1, Math.max(0, v));
  let raf = 0;
  const tick = () => {
    raf = 0;
    const vh = innerHeight, top = card.getBoundingClientRect().top;
    const pin = card.querySelector('.mw-pin').offsetHeight;
    const p = clamp((vh * 0.9 - top) / (vh * 0.9 - 100 + pin * 0.6));
    const e = p * p * (3 - 2 * p);
    const full = Math.hypot(shot.offsetWidth, shot.offsetHeight) / 2 + 2;
    shot.style.clipPath = p >= 1 ? 'none' : `circle(${48 + (full - 48) * e}px at 50% 50%)`;
    if(pic) pic.style.scale = String(1.1 - 0.1 * e);
    const t = clamp((p - 0.85) / 0.15);
    body.style.opacity = t;
    body.style.translate = `0 ${30 * (1 - t)}px`;
  };
  const onScroll = () => { if(!raf) raf = requestAnimationFrame(tick); };
  card.classList.add('is-live');
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  tick();
  destroyHome = () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
}

// More-work images tilt away from the pointer, with a sheen that follows it
function wireCardTilt(){
  if(!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  view.querySelectorAll('.mw-shot').forEach(shot => {
    let raf = 0, ev = null;
    const apply = () => {
      raf = 0;
      const r = shot.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
      shot.style.setProperty('--tx', (x - 0.5).toFixed(3));
      shot.style.setProperty('--ty', (y - 0.5).toFixed(3));
      shot.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      shot.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    };
    shot.addEventListener('pointerenter', () => shot.classList.add('is-tilt'));
    shot.addEventListener('pointermove', e => { ev = e; if(!raf) raf = requestAnimationFrame(apply); });
    shot.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf); raf = 0;
      shot.classList.remove('is-tilt');
      shot.style.setProperty('--tx', 0); shot.style.setProperty('--ty', 0);
    });
  });
}

function mount(kind, slug){
  if(destroyHome){ destroyHome(); destroyHome = null; }
  const frag = kind==='home' ? buildHome() : kind==='shot' ? buildShot(slug) : buildCase(slug);
  frag.appendChild(tplContact.content.cloneNode(true));
  view.replaceChildren(frag);
  current = kind==='home' ? 'home' : slug;
  document.title = kind==='home' ? 'Tareq Mahmud' : (kind==='shot' ? SHOTS[slug] : CASES[slug]).name + ' · Tareq Mahmud';
  wireView();
  if(kind==='home'){ mountIntroReveal(); wireCardTilt(); }
  if(kind==='shot' || kind==='case') wireMoreTrack();
}

let swapping = false;
function go(){
  const h = decodeURIComponent(location.hash.slice(1));
  const kind = CASES[h] ? 'case' : SHOTS[h] ? 'shot' : 'home';
  const wantCase = kind !== 'home';
  const target = wantCase ? null : (h || 'top');
  const needSwap = wantCase ? current !== h : current !== 'home';
  const finish = () => {
    if(wantCase){ window.scrollTo({top:0, behavior:'instant'}); focusTitle(kind==='shot' ? 'shot-title' : 'cs-title'); }
    else {
      const el = document.getElementById(target);
      if(el && target !== 'top'){ requestAnimationFrame(()=>el.scrollIntoView({behavior: needSwap ? 'instant':'smooth', block:'start'})); }
      else if(needSwap || target==='top'){ window.scrollTo({top:0, behavior: needSwap?'instant':'smooth'}); }
    }
  };
  if(!needSwap){ finish(); return; }
  if(current === null){ mount(kind, h); finish(); return; }
  if(swapping) return;
  swapping = true;
  view.classList.add('leaving');
  setTimeout(()=>{ mount(kind, h); finish(); requestAnimationFrame(()=>{ view.classList.remove('leaving'); swapping=false; }); }, 220);
}
function focusTitle(id){ const t = document.getElementById(id); if(t) t.focus({preventScroll:true}); }

/* ---------- per-view wiring ---------- */
let io, spy, pxRaf=0, pxEls=[];
function wireView(){
  // how-i-work carousel (transform-based, so every step can be active)
  const track = view.querySelector('#hwTrack');
  if(track){
    const vp=track.parentElement, cardsEl=[...track.children], pills=[...view.querySelectorAll('.hw-seg')], bars=pills.map(p=>p.querySelector('i'));
    const prev=view.querySelector('#hwPrev'), next=view.querySelector('#hwNext'), sec=track.closest('.hw');
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const N=cardsEl.length, DUR=4500;
    let cur=0, x=0, stopped=reduce, paused=false, inView=false, raf=0, t0=0, elapsed=0;
    const maxX=()=>Math.max(0, track.scrollWidth - vp.clientWidth);
    const targetX=i=>Math.min(cardsEl[i].offsetLeft - cardsEl[0].offsetLeft, maxX());
    const setX=v=>{ x=v; track.style.setProperty('--x', (-v)+'px'); };
    const setP=(k,v,ease)=>{ bars[k].classList.toggle('ease',!!ease); bars[k].style.setProperty('--p',v); };
    function goTo(i){
      cur=(i+N)%N; setX(targetX(cur));
      cardsEl.forEach((c,k)=>c.classList.toggle('on',k===cur));
      pills.forEach((p,k)=>{ p.classList.toggle('on',k===cur); p.classList.toggle('done',k<cur); p.setAttribute('aria-current',k===cur?'step':'false'); });
      bars.forEach((b,k)=>setP(k, k<cur?1:(k===cur?(stopped?1:0):0), true));
      prev.disabled=cur===0; elapsed=0; t0=performance.now();
    }
    // autoplay with a live progress line toward the next pill
    function loop(now){
      raf=requestAnimationFrame(loop);
      if(stopped||paused||!inView){ t0=now-elapsed; return; }
      elapsed=now-t0;
      setP(cur, Math.min(1,elapsed/DUR), false);
      if(elapsed>=DUR) goTo(cur+1);
    }
    const stop=()=>{ stopped=true; setP(cur,1,true); };
    prev.addEventListener('click',()=>{stop(); goTo(cur-1);});
    next.addEventListener('click',()=>{stop(); goTo(cur+1);});
    pills.forEach(p=>p.addEventListener('click',()=>{stop(); goTo(+p.dataset.go);}));
    track.addEventListener('keydown',e=>{ if(e.key==='ArrowRight'){e.preventDefault();stop();goTo(Math.min(N-1,cur+1));} if(e.key==='ArrowLeft'){e.preventDefault();stop();goTo(Math.max(0,cur-1));} });
    // pause only while the visitor is actually hovering the cards (real pointer movement, not page scroll) or keyboard-focused
    vp.addEventListener('pointermove',e=>{ if(e.pointerType==='mouse') paused=true; });
    vp.addEventListener('pointerleave',()=>paused=false);
    sec.addEventListener('focusin',e=>{ if(e.target.matches(':focus-visible')) paused=true; });
    sec.addEventListener('focusout',()=>paused=false);
    // drag / swipe
    let sx=0, sy=0, bx=0, dragging=false, moved=false;
    track.addEventListener('pointerdown',e=>{ dragging=true; moved=false; sx=e.clientX; sy=e.clientY; bx=x; track.setPointerCapture(e.pointerId); });
    track.addEventListener('pointermove',e=>{ if(!dragging) return; const dx=e.clientX-sx;
      if(!moved && Math.abs(dx)>6 && Math.abs(dx)>Math.abs(e.clientY-sy)){ moved=true; track.classList.add('drag'); stop(); }
      if(moved){ let v=bx-dx; const m=maxX(); if(v<0) v=v/3; if(v>m) v=m+(v-m)/3; setX(v); } });
    const end=e=>{ if(!dragging) return; dragging=false; track.classList.remove('drag');
      if(moved){ const dx=e.clientX-sx; let i=cur; if(dx<-50) i=Math.min(N-1,cur+1); else if(dx>50) i=Math.max(0,cur-1);
        // if dragged far, jump to the nearest card
        let best=i,d=1e9; cardsEl.forEach((c,k)=>{ const dd=Math.abs(targetX(k)-x); if(dd<d){d=dd;best=k;} }); if(Math.abs(dx)>220) i=best;
        goTo(i); }
      else { const c=e.target.closest('.hw-card'); if(c){ stop(); goTo(+c.dataset.i); } } };
    track.addEventListener('pointerup',end); track.addEventListener('pointercancel',end);
    addEventListener('resize',()=>{ track.classList.add('drag'); goTo(cur); requestAnimationFrame(()=>track.classList.remove('drag')); },{passive:true});
    goTo(0);
    raf=requestAnimationFrame(loop);
    if('IntersectionObserver' in window){
      new IntersectionObserver(es=>es.forEach(e=>{ inView=e.isIntersecting; if(inView) sec.classList.add('in'); }),{threshold:.25}).observe(sec);
    } else { inView=true; sec.classList.add('in'); }
    if(reduce) sec.classList.add('in');
  }
  // why-me ring
  const wb=view.querySelector('.why-b');
  if(wb){ if('IntersectionObserver' in window){ const o=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ wb.classList.add('seen'); o.disconnect(); } }),{threshold:.4}); o.observe(wb); } else wb.classList.add('seen'); }
  // capabilities tabs
  const ctabs=[...view.querySelectorAll('.cap-tab')], cpan=[...view.querySelectorAll('.cap-panel')];
  if(ctabs.length){
    let capCur=-1;
    const sel=i=>{ if(i===capCur) return; capCur=i;
      ctabs.forEach((t,k)=>{ const on=k===i; t.classList.toggle('on',on); t.setAttribute('aria-selected',String(on)); t.tabIndex=on?0:-1; });
      cpan.forEach((p,k)=>{ const on=k===i; p.hidden=!on; p.classList.toggle('on',on); }); };
    ctabs.forEach((t,i)=>{
      t.addEventListener('click',()=>sel(i));
      t.addEventListener('mouseenter',()=>{ if(matchMedia('(hover:hover)').matches) sel(i); });
      t.addEventListener('keydown',e=>{ const n=ctabs.length;
        if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();const j=(i+1)%n;sel(j);ctabs[j].focus();}
        if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();const j=(i-1+n)%n;sel(j);ctabs[j].focus();} });
    });
    sel(0);
  }
  // expandable rows
  view.querySelectorAll('.row-btn-unused').forEach(b=>b.addEventListener('click',()=>{
    const open = b.getAttribute('aria-expanded')==='true';
    b.setAttribute('aria-expanded', String(!open));
    document.getElementById(b.getAttribute('aria-controls')).hidden = open;
  }));
  // copy email
  view.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>{
    const v = b.getAttribute('data-copy');
    const setL=t=>{ const sp=b.querySelectorAll('.bl > span'); if(sp.length){ sp[0].textContent=t; sp[1].textContent=t; } else b.textContent=t; };
    const done = ()=>{ setL('Copied'); setTimeout(()=>setL('Copy'),1600); };
    // 1) legacy copy works inside sandboxed frames where the Clipboard API is often blocked
    const legacy=()=>{ try{ const ta=document.createElement('textarea'); ta.value=v; ta.setAttribute('readonly',''); ta.style.cssText='position:fixed;top:0;left:0;opacity:0;pointer-events:none';
        document.body.appendChild(ta); ta.focus(); ta.select(); ta.setSelectionRange(0,v.length); const ok=document.execCommand('copy'); ta.remove(); b.focus(); return ok; }catch(e){ return false; } };
    if(legacy()){ done(); return; }
    // 2) modern API, 3) fall back to selecting the address for manual copy
    let settled=false; const fail=()=>{ if(!settled){ settled=true; selectEmail(b); } };
    try{ navigator.clipboard.writeText(v).then(()=>{ settled=true; done(); }, fail); setTimeout(fail,1200); }catch(e){ fail(); }
  }));
  // reveal: only elements below the fold get a pre-state
  if(io) io.disconnect();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if('IntersectionObserver' in window && !reduce){
    io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.remove('pre'); io.unobserve(e.target); } }),{rootMargin:'0px 0px -8% 0px'});
    // headings: split into words (text nodes only, keeps inner spans)
    view.querySelectorAll('.h2, .cs-sec h2, .contact h2, .ab-lead, .statement, .pg-section h2').forEach(h=>{
      if(h.dataset.split) return; h.dataset.split='1'; let i=0;
      const walk=n=>{ [...n.childNodes].forEach(c=>{ if(c.nodeType===3){ const f=document.createDocumentFragment();
            c.textContent.split(/(\s+)/).forEach(w=>{ if(!w) return; if(/^\s+$/.test(w)){ f.appendChild(document.createTextNode(w)); return; }
              const sp=document.createElement('span'); sp.className='bw'; sp.style.setProperty('--i',i++); sp.textContent=w; f.appendChild(sp); });
            c.replaceWith(f); } else if(c.nodeType===1 && !c.classList.contains('bw')) walk(c); }); };
      walk(h); h.classList.add('bwrap'); });
    // paragraphs / eyebrows / buttons fade in from blur
    view.querySelectorAll('.eyebrow, .sec-head p, .hw-head .hw-nav, .ab-text > p:not(.ab-lead), .ab-actions, .cs-sec p, .more-head p, .why-head .eyebrow, .cap-tabs, .contact-card, .c-actions, .c-sign').forEach((el,k)=>{ if(!el.closest('.hero')) el.classList.add('bt'); });
    // stagger siblings in grids
    view.querySelectorAll('.wk-grid, .mw-grid, .why-grid, .gallery, .outcome, .three, .two').forEach(g=>{ [...g.children].forEach((c,k)=>{ c.classList.add('rv'); c.style.setProperty('--d',(k%3)*0.09+'s'); }); });
    view.querySelectorAll('.rv, .bwrap, .bt').forEach(el=>{ if(el.getBoundingClientRect().top > innerHeight*0.92 && !el.closest('.hero')){ el.classList.add('pre'); io.observe(el); } });
  }
  // parallax
  if(pxRaf) cancelAnimationFrame(pxRaf);
  // only elements that have hidden overflow room get parallax, and the shift is clamped to that room
  pxEls = reduce ? [] : [
    ...[...view.querySelectorAll('.why-bg')].map(e=>[e,0.06]),
    ...[...view.querySelectorAll('.ab-photo img')].map(e=>[e,0.05]),
    ...[...view.querySelectorAll('.hero-media video')].map(e=>[e,0.24]),
  ];
  pxEls.forEach(([e])=>e.setAttribute('data-px',''));
  const pxTick=()=>{ const vh=innerHeight;
    pxEls.forEach(([e,k])=>{ const r=e.getBoundingClientRect(); if(r.bottom<-200||r.top>vh+200) return;
      const room=(e.offsetHeight-e.parentElement.clientHeight)/2; const c=(r.top+r.height/2)-vh/2;
      const v=Math.max(-room,Math.min(room,-c*k)); e.style.translate='0 '+v.toFixed(1)+'px'; });
    pxRaf=0; };
  if(!window.__pxBound){ window.__pxBound=true; addEventListener('scroll',()=>{ if(!pxRaf) pxRaf=requestAnimationFrame(()=>window.__pxTick()); },{passive:true}); addEventListener('resize',()=>{ if(!pxRaf) pxRaf=requestAnimationFrame(()=>window.__pxTick()); }); }
  window.__pxTick=pxTick; pxTick();
  // case study TOC spy
  if(spy) spy.disconnect();
  const tocLinks = view.querySelectorAll('.toc a');
  if(tocLinks.length){
    spy = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ tocLinks.forEach(a=>a.classList.toggle('on', a.dataset.sec===e.target.id)); } }),{rootMargin:'-30% 0px -60% 0px'});
    view.querySelectorAll('.cs-sec').forEach(s=>spy.observe(s));
  }
}
function selectEmail(b){
  const a = b.parentElement.querySelector('.email');
  const r = document.createRange(); r.selectNodeContents(a);
  const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  const setL=t=>{ const sp=b.querySelectorAll('.bl > span'); if(sp.length){ sp[0].textContent=t; sp[1].textContent=t; } else b.textContent=t; };
  setL('Press ⌘/Ctrl+C');
  setTimeout(()=>setL('Copy'),2400);
}

/* in-page anchors inside a case study scroll without leaving it */
document.addEventListener('click', e=>{
  const a = e.target.closest('a[href^="#"]');
  if(!a) return;
  const id = a.getAttribute('href').slice(1);
  closeMenu();
  if(current !== 'home' && !CASES[id] && !SHOTS[id]){
    const el = document.getElementById(id);
    if(el && view.contains(el)){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
  }
});

/* ---------- nav: compress on scroll, section highlight ---------- */
const nav = document.getElementById('nav');
let ticking=false;
addEventListener('scroll', ()=>{ if(ticking) return; ticking=true; requestAnimationFrame(()=>{
  nav.classList.toggle('compact', scrollY > 40);
  if(current==='home'){
    let on=null;
    ['work','why','about','contact'].forEach(id=>{ const el=document.getElementById(id); if(el && el.getBoundingClientRect().top < innerHeight*0.4) on=id; });
    document.querySelectorAll('.nav-links a').forEach(a=>a.setAttribute('aria-current', String(a.getAttribute('href')==='#'+on)));
  } else {
    document.querySelectorAll('.nav-links a').forEach(a=>a.setAttribute('aria-current', String(a.getAttribute('href')==='#work')));
  }
  ticking=false; }); }, {passive:true});

/* ---------- mobile menu ---------- */
const menuBtn = document.getElementById('menuBtn');
function closeMenu(){ document.body.classList.remove('menu-open'); menuBtn.setAttribute('aria-expanded','false'); menuBtn.setAttribute('aria-label','Open menu'); }
menuBtn.addEventListener('click', ()=>{
  const open = !document.body.classList.contains('menu-open');
  document.body.classList.toggle('menu-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open?'Close menu':'Open menu');
});
addEventListener('keydown', e=>{ if(e.key==='Escape') closeMenu(); });

addEventListener('hashchange', go);
go();
}
