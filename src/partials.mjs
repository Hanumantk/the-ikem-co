import { SITE, newsletterForm, icon, iconSprite, replaceArrows } from "./helpers.mjs";

export const PRIMARY = [
  { key: "about", label: "About", href: "about.html" },
  { key: "properties", label: "Properties", href: "properties.html" },
  { key: "neighborhoods", label: "Neighborhoods", href: "neighborhoods/index.html" },
  { key: "services", label: "Services", href: "services/index.html" },
  { key: "journal", label: "Journal", href: "journal/index.html" },
  { key: "press", label: "Press", href: "press.html" },
  { key: "testimonials", label: "Testimonials", href: "testimonials.html" },
  { key: "contact", label: "Contact", href: "contact.html" },
];

/* The masthead carries seven links; Testimonials lives in the footer and the small screen menu. */
const MASTHEAD = PRIMARY.filter((p) => p.key !== "testimonials");

export const NEIGHBORHOODS_NAV = [
  { label: "Ladera Heights", href: "neighborhoods/ladera-heights.html" },
  { label: "View Park", href: "neighborhoods/view-park.html" },
  { label: "Windsor Hills", href: "neighborhoods/windsor-hills.html" },
  { label: "Baldwin Hills", href: "neighborhoods/baldwin-hills.html" },
  { label: "Leimert Park", href: "neighborhoods/leimert-park.html" },
];

export const SERVICES_NAV = [
  { label: "Commercial Real Estate", href: "services/commercial.html" },
  { label: "Sports and Entertainment", href: "services/sports-entertainment.html" },
  { label: "Property Management", href: "services/property-management.html" },
  { label: "Construction Advisory", href: "services/construction-advisory.html" },
];

export function header({ over = false, current = "" } = {}) {
  const links = MASTHEAD.map((p) => `<a href="{{root}}${p.href}"${p.key === current ? ' aria-current="page"' : ""}>${p.label}</a>`).join("\n    ");
  return `<header class="site-head${over ? " site-head--over" : ""}">
  <a class="wordmark" href="{{root}}index.html" aria-label="The Ikem Co., home">The Ikem<sup>®</sup> Co.</a>
  <nav class="site-nav" aria-label="Primary">
    ${links}
  </nav>
  <div class="site-head__right">
    <a class="site-head__login" href="{{root}}client-login.html">Client Login</a>
    <button class="menu-toggle" type="button" data-menu-open aria-haspopup="dialog" aria-controls="site-menu" aria-expanded="false">${icon("list", "nav")}<span>Menu</span></button>
  </div>
</header>
<button class="menu-float" type="button" data-menu-open aria-haspopup="dialog" aria-controls="site-menu" aria-expanded="false" tabindex="-1">${icon("list", "nav")}<span>Menu</span></button>`;
}

export function menu(current) {
  const primary = PRIMARY.map((p) => `<li><a href="{{root}}${p.href}"${p.key === current ? ' aria-current="page"' : ""}>${p.label}${icon("arrow-right", "quiet")}</a></li>`).join("\n      ");
  const list = (items) => items.map((i) => `<li><a href="{{root}}${i.href}">${i.label}</a></li>`).join("\n          ");
  return `<dialog id="site-menu" class="menu" aria-label="Site menu">
  <div class="menu__inner" data-lenis-prevent>
    <div class="menu__bar">
      <span class="wordmark" aria-hidden="true">The Ikem<sup>®</sup> Co.</span>
      <button class="menu-close" type="button" data-menu-close>${icon("x", "nav")}<span>Close</span></button>
    </div>
    <div class="menu__grid">
      <ul class="menu__primary">
      ${primary}
      </ul>
      <div class="menu__secondary">
        <div>
          <p class="menu__label caps">Neighborhoods</p>
          <ul>
          ${list(NEIGHBORHOODS_NAV)}
          </ul>
        </div>
        <div>
          <p class="menu__label caps">Services</p>
          <ul>
          ${list(SERVICES_NAV)}
          </ul>
        </div>
        <div>
          <p class="menu__label caps">Clients</p>
          <ul>
            <li><a href="{{root}}client-login.html">Client Login</a></li>
            <li><a href="{{root}}testimonials.html">Client films</a></li>
          </ul>
        </div>
        <div>
          <p class="menu__label caps">Reach Ikem</p>
          <ul>
            <li><a href="${SITE.phoneHref}">${SITE.phone}</a></li>
            <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
          </ul>
        </div>
      </div>
    </div>
    <p class="menu__foot">${SITE.person} · Broker · DRE ${SITE.dre}</p>
  </div>
</dialog>`;
}

export function footer() {
  const links = [...PRIMARY, { label: "Client Login", href: "client-login.html" }]
    .map((p) => `<a href="{{root}}${p.href}">${p.label}</a>`).join("\n      ");
  return `<footer class="site-foot">
  <div class="site-foot__brand">
    <img class="site-foot__logo" src="{{root}}assets/img/logo.png" width="560" height="233" alt="The Ikem Co." loading="lazy" decoding="async">
    <p class="site-foot__licence">${SITE.person} · Licensed Real Estate Broker · California DRE ${SITE.dre}. Independently licensed in six states. Information is deemed reliable but not guaranteed.</p>
    <p class="site-foot__eho">Equal Housing Opportunity</p>
  </div>
  <div class="site-foot__news">
    <p>A few letters a year on the market, the neighborhoods, and the work.</p>
    ${newsletterForm({ id: "foot" })}
  </div>
  <div class="site-foot__bottom">
    <nav class="site-foot__links" aria-label="Footer">
      ${links}
    </nav>
    <p class="site-foot__copy">© ${SITE.year} ${SITE.name} · <a href="${SITE.phoneHref}">${SITE.phone}</a> · <a href="mailto:${SITE.email}">${SITE.email}</a></p>
  </div>
</footer>`;
}

export function layout({ title, description, root, over, current, content, head = "", bodyClass = "" }) {
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${description}">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="website">
<meta property="og:image" content="${SITE.url}assets/img/home-bedford-dusk.jpg">
<meta name="theme-color" content="#153b2e">
<link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap">
<link rel="stylesheet" href="${root}css/tokens.css">
<link rel="stylesheet" href="${root}css/site.css">
${head}
<script>document.documentElement.className='js'</script>
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ""}>
<a class="skip" href="#main">Skip to content</a>
${header({ over, current })}
<main id="main">
${replaceArrows(content)}
</main>
${footer()}
${menu(current)}
<script src="${root}js/lenis.min.js" defer></script>
<script src="${root}js/gsap.min.js" defer></script>
<script src="${root}js/ScrollTrigger.min.js" defer></script>
<script src="${root}js/site.js" defer></script>
${iconSprite()}
</body>
</html>
`;
}
