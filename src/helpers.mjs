/* Shared HTML helpers for the build. Pure functions returning strings. */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const HERE = dirname(fileURLToPath(import.meta.url));

/* ------------------------------------------------------------------ */
/* Icons: Phosphor (MIT, src/data/phosphor-LICENSE.txt), inlined as    */
/* <symbol>s once per page. Weight carries state. Each role names the  */
/* weight at rest, on hover or focus, and while pressed.               */
/* ------------------------------------------------------------------ */
const PHOSPHOR = JSON.parse(readFileSync(join(HERE, "data", "phosphor.json"), "utf8"));
export const ICON_ROLES = {
  nav:   { rest: "regular", hover: "bold",    active: "bold" },     /* menu open and close: the primary controls */
  link:  { rest: "light",   hover: "regular", active: "bold" },     /* arrows on text links and small buttons */
  quiet: { rest: "thin",    hover: "light",   active: "regular" },  /* arrows beside list items, secondary to the words */
  field: { rest: "light",   hover: "regular", active: "regular" },  /* form furniture */
  play:  { rest: "regular", hover: "fill",    active: "fill" },     /* film posters: the glyph fills as you commit */
  mark:  { rest: "regular" },                                       /* static marks */
};
const usedSymbols = new Set();

export function icon(name, role = "link", opts = {}) {
  const r = ICON_ROLES[role];
  if (!r) throw new Error(`Unknown icon role ${role}`);
  const uses = ["rest", "hover", "active"].filter((k) => r[k]).map((k) => {
    if (!PHOSPHOR[r[k]] || !PHOSPHOR[r[k]][name]) throw new Error(`No Phosphor icon ${name} at weight ${r[k]}`);
    const id = `ph-${name}-${r[k]}`;
    usedSymbols.add(id);
    return `<use class="ic__${k}" href="#${id}"/>`;
  });
  return `<svg class="ic ic--${role}${opts.cls ? " " + opts.cls : ""}" viewBox="0 0 1024 1024" aria-hidden="true" focusable="false">${uses.join("")}</svg>`;
}

/** Symbol sheet for every icon and weight used anywhere on the site. Emitted once at the end of <body>. */
export function iconSprite() {
  const syms = [...usedSymbols].sort().map((id) => {
    const m = id.match(/^ph-(.+)-(thin|light|regular|bold|fill)$/);
    const paths = PHOSPHOR[m[2]][m[1]].paths.map((d) => `<path d="${d}"/>`).join("");
    return `<symbol id="${id}" viewBox="0 0 1024 1024">${paths}</symbol>`;
  });
  return `<svg class="ic-sprite" aria-hidden="true" focusable="false" width="0" height="0">${syms.join("")}</svg>`;
}

/** Copy is written with a plain arrow; the build swaps it for the icon in the right role. */
export function replaceArrows(html) {
  return html
    .replace(/(<span class="rows__arrow" aria-hidden="true">)→(<\/span>)/g, `$1${icon("arrow-right", "quiet")}$2`)
    .replace(/ ?→/g, icon("arrow-right", "link"));
}

export const SITE = {
  name: "The Ikem Co.",
  person: "Ikem Chukumerije",
  phone: "310.927.2344",
  phoneHref: "tel:+13109272344",
  // TODO: swap for the address on the new domain once it is decided.
  email: "ikem@milliondollarliving.com",
  dre: "01751046",
  // TODO: replace REPLACE_ME with a Formspree (or similar) form id, or point the action at your own endpoint.
  formEndpoint: "https://formspree.io/f/REPLACE_ME",
  year: "2026",
  // GitHub Pages address for now; swap for the final domain when it is decided (canonical and Open Graph URLs).
  url: "https://hanumantk.github.io/the-ikem-co/",
};

/* Responsive image manifest, generated from the supplied photography. */
export const IMAGES = {
  "ikem-agave-sunset":   { w: 1600, h: 1067, sizes: [640, 1000, 1600], face: "0.20,0.11", body: "0.38", alt: "Ikem Chukumerije in a cream suit on an outdoor stair beside an agave, hills and a low sun behind him" },
  "ikem-window-dusk":    { w: 1600, h: 1067, sizes: [640, 1000, 1600], face: "0.44,0.21", body: "0.46", alt: "Ikem Chukumerije seated by floor to ceiling glass at dusk, looking toward the ocean" },
  "ikem-dining-table":   { w: 1600, h: 1067, sizes: [640, 1000, 1600], face: "0.65,0.22", body: "0.48", alt: "Ikem Chukumerije in a brown suit seated at a light wood dining table, sky through the glass behind" },
  "ikem-concrete-bench": { w: 1600, h: 1067, sizes: [640, 1000, 1600], face: "0.62,0.20", body: "0.48", alt: "Ikem Chukumerije seated on a built in bench against a board formed concrete wall" },
  "ikem-living-room":    { w: 1067, h: 1600, sizes: [640, 1000, 1067], face: "0.53,0.21", body: "0.42", alt: "Ikem Chukumerije standing in a living room with ocean views, one hand in his pocket" },
  "ikem-portrait-hands": { w: 1067, h: 1600, sizes: [640, 1000, 1067], face: "0.51,0.16", body: "0.46", alt: "Portrait of Ikem Chukumerije in a cream double breasted suit, fingertips together" },
  "ikem-seated-grey":    { w: 1067, h: 1600, sizes: [640, 1000, 1067], face: "0.49,0.19", body: "0.42", alt: "Ikem Chukumerije in a grey suit seated in a low chair, forearms on his knees" },
  "ikem-glass-door":     { w: 1067, h: 1600, sizes: [640, 1000, 1067], face: "0.49,0.15", body: "0.38", alt: "Ikem Chukumerije standing at a glass door with the hills and coastline reflected around him" },
  "ikem-leaning-door":   { w: 1047, h: 1600, sizes: [640, 1000, 1047], face: "0.55,0.16", body: "0.42", alt: "Ikem Chukumerije leaning against a door frame, hand in his pocket, sea behind" },
  "ikem-bench-seated":   { w: 1067, h: 1600, sizes: [640, 1000, 1067], face: "0.51,0.16", body: "0.42", alt: "Ikem Chukumerije seated on a stone bench in a courtyard, legs crossed" },
  "ikem-stair-rail":     { w: 1067, h: 1600, sizes: [640, 1000, 1067], face: "0.52,0.18", body: "0.40", alt: "Ikem Chukumerije on an exterior stair, one hand on the steel rail, hills behind" },
  "ikem-terrace-table":  { w: 1067, h: 1600, sizes: [640, 1000, 1067], face: "0.44,0.07", body: "0.30", alt: "Ikem Chukumerije standing at a set terrace table at sunset" },
  /* Property and neighborhood photography, taken from the listing pages on milliondollarliving.com.
   * No face data: the drift centres the frame instead. */
  "home-bedford-day": { w: 1600, h: 1067, sizes: [640, 1000, 1600], alt: "6125 Bedford Avenue, a single level midcentury house in Ladera Heights with a stone facade, a wide drive, and palms" },
  "home-bedford-dusk": { w: 1600, h: 1067, sizes: [640, 1000, 1600], alt: "6125 Bedford Avenue at dusk, a low midcentury roofline and lit windows under a pink sky" },
  "home-green-vista": { w: 1200, h: 899, sizes: [640, 1000, 1200], alt: "3818 Green Vista Drive, Encino, seen from above at dusk with the pool and lawn lit" },
  "home-alana": { w: 1600, h: 900, sizes: [640, 1000, 1600], alt: "3369 Alana Drive, Sherman Oaks, a long lawn and pool with the house and hills at sunset" },
  "home-beverly": { w: 1600, h: 1048, sizes: [640, 1000, 1600], alt: "1530 North Beverly Drive, Beverly Hills, a two story house lit at night behind a gated drive" },
  "home-mount-vernon": { w: 1600, h: 1003, sizes: [640, 1000, 1600], alt: "4040 Mount Vernon Drive, View Park, a white two story colonial house lit at dusk" },
  "home-fairway": { w: 1600, h: 971, sizes: [640, 1000, 1600], alt: "3957 Fairway Boulevard, Windsor Hills, a single story house beneath a mature tree" },
  "home-marburn": { w: 1600, h: 1067, sizes: [640, 1000, 1600], alt: "5528 Marburn Avenue, a white house at dusk with its pool lit in the foreground" },
  "home-spaulding": { w: 1600, h: 1066, sizes: [640, 1000, 1600], alt: "1920 Spaulding Avenue, a Spanish bungalow with an arched porch and a fire pit in the front garden" },
  "home-marburn-room": { w: 1600, h: 1067, sizes: [640, 1000, 1600], alt: "A quiet staged living room with pale oak floors and a fireplace" },
};

/**
 * Responsive picture element.
 * opts: alt (override), sizes, loading ("lazy" | "eager"), priority (bool), pos (object-position fallback),
 *       posM (mobile fallback), cls, frame ("portrait" | "wide" | "square") wraps the picture in a parallax frame.
 * Every photograph carries data-px (parallax drift) for site.js unless opts.px is false (static card
 * images); portraits also carry data-face and data-body for the face aware crop.
 */
export function pic(name, opts = {}) {
  const img = IMAGES[name];
  if (!img) throw new Error(`Unknown image ${name}`);
  const posVars = [opts.pos ? `--pos:${opts.pos}` : "", opts.posM ? `--pos-m:${opts.posM}` : ""].filter(Boolean).join(";");
  const srcset = img.sizes.map((w) => `{{root}}assets/img/${name}-${w}.webp ${w}w`).join(", ");
  const sizes = opts.sizes || "100vw";
  const loading = opts.priority ? "" : ` loading="${opts.loading || "lazy"}"`;
  const priority = opts.priority ? ` fetchpriority="high"` : "";
  const style = posVars ? ` style="${posVars}"` : "";
  const cls = opts.cls ? ` class="${opts.cls}"` : "";
  const face = img.face ? ` data-face="${img.face}" data-body="${img.body}"` : "";
  const picture = `<picture${opts.px === false ? "" : " data-px"}>
  <source type="image/webp" srcset="${srcset}" sizes="${sizes}">
  <img src="{{root}}assets/img/${name}.jpg" width="${img.w}" height="${img.h}" alt="${opts.alt ?? img.alt}" decoding="async"${face}${loading}${priority}${style}${cls}>
</picture>`;
  return opts.frame ? `<div class="px px--${opts.frame}">${picture}</div>` : picture;
}

/** Image slot for photography that does not exist yet. */
export function slot(kind = "4x3", alt = "Photograph to follow", opts = {}) {
  const dims = kind === "16x9" ? [1600, 900] : [1200, 900];
  const style = opts.pos ? ` style="--pos:${opts.pos}"` : "";
  return `<!-- TODO: Replace with real photograph, target size ${dims[0]}x${dims[1]} or larger -->
<img src="{{root}}assets/img/slot-${kind}.svg" width="${dims[0]}" height="${dims[1]}" alt="${alt}" loading="lazy" decoding="async"${style}>`;
}

/** Full bleed photographic fold (H6). */
/* plate is accepted for compatibility and no longer rendered: photographs carry no caption plate. */
export function fold({ image, slotKind, variant = "band", title, titleSmall = true, line, link, plate, priority = false, pos, posM, alt, eyebrow, id }) {
  const media = image
    ? pic(image, { priority, pos, posM, alt, sizes: "100vw" })
    : slot(slotKind || "16x9", alt || "Photograph to follow", { pos });
  const parts = [];
  if (eyebrow) parts.push(`<p class="caps">${eyebrow}</p>`);
  if (title) parts.push(variant === "hero"
    ? `<h1 class="fold__title">${title}</h1>`
    : `<h2 class="fold__title${titleSmall ? " fold__title--s" : ""}">${title}</h2>`);
  if (line) parts.push(`<p class="fold__line">${line}</p>`);
  if (link) parts.push(`<a class="link link--light" href="${link.href}">${link.label}</a>`);
  return `<section class="fold fold--${variant}"${id ? ` id="${id}"` : ""}>
  ${media}
  <div class="fold__caption">
    ${parts.join("\n    ")}
  </div>
</section>`;
}

/** Closing fold used at the end of most pages. */
export function closing({ image = "ikem-concrete-bench", pos, title = "Begin a conversation.", line = "By appointment, in person or by phone.", href = "{{root}}contact.html", label = "Contact →" } = {}) {
  return fold({ image, pos, variant: "short", title, line, link: { href, label }, plate: SITE.phone });
}

export function headHang(title, para) {
  return `<header class="head-hang">
  <h2>${title}</h2>${para ? `\n  <p>${para}</p>` : ""}
</header>`;
}

/** Property card (F6). */
export function propertyCard({ status, statusNote, name, href, price, specs, active = false, image, imagePos, imageAlt, slotAlt }) {
  const media = image ? pic(image, { px: false, pos: imagePos, alt: imageAlt, sizes: "(min-width: 60rem) 33vw, (min-width: 40rem) 50vw, 100vw" }) : slot("4x3", slotAlt || `${name}, photograph to follow`);
  return `<article class="card">
  <a class="card__media" href="${href}" tabindex="-1" aria-hidden="true">${media}</a>
  <p class="card__status caps"><i class="${active ? "is-active" : ""}"></i>${status}${statusNote ? ` · ${statusNote}` : ""}</p>
  <h3 class="card__name"><a href="${href}">${name}</a></h3>
  ${price ? `<p class="card__price tnum">${price}</p>` : ""}
  ${specs ? `<p class="card__specs">${specs}</p>` : ""}
</article>`;
}

export function rows(items, { compact = false } = {}) {
  const li = items.map((it) => {
    const inner = `${it.key ? `<span class="rows__key">${it.key}</span>` : ""}<span class="rows__name">${it.name}</span>${it.note ? `<span class="rows__note">${it.note}</span>` : ""}${it.value ? `<span class="rows__value">${it.value}</span>` : ""}${it.href ? `<span class="rows__arrow" aria-hidden="true">→</span>` : ""}`;
    return it.href
      ? `<li><a href="${it.href}">${inner}</a></li>`
      : `<li><div class="row">${inner}</div></li>`;
  }).join("\n");
  return `<ul class="rows${compact ? " rows--compact" : ""}">\n${li}\n</ul>`;
}

export function steps(items) {
  return `<ol class="steps">\n${items.map((s) => `<li><h3>${s.title}</h3><p>${s.body}</p></li>`).join("\n")}\n</ol>`;
}

export function defs(items) {
  return `<dl class="defs">\n${items.map((d) => `<div><dt>${d.term}</dt><dd>${d.body}</dd></div>`).join("\n")}\n</dl>`;
}

/** Lead capture form. */
export function leadForm({ id = "inquiry", interest } = {}) {
  const options = ["Buying a home", "Selling a home", "Leasing", "Off market introduction", "Commercial real estate", "Property management", "Construction advisory", "Press or speaking", "Something else"];
  return `<form class="form" id="${id}" action="${SITE.formEndpoint}" method="POST" data-form novalidate
  data-success="Received. Ikem will reply personally, usually within one business day."
  data-failure="That didn’t send. Call ${SITE.phone} or email ${SITE.email} and it will be handled.">
  <input type="hidden" name="_subject" value="Website inquiry, theikemco">
  <div class="form__body">
    <div class="form__row">
      <div class="field">
        <label for="${id}-name">Name</label>
        <input id="${id}-name" name="name" type="text" autocomplete="name" required data-required="Your name is needed so the reply can be addressed to you.">
        <p class="hint" aria-live="polite"></p>
      </div>
      <div class="field">
        <label for="${id}-email">Email address</label>
        <input id="${id}-email" name="email" type="email" autocomplete="email" inputmode="email" required data-required="An email address is needed for the reply." placeholder="name@domain.com">
        <p class="hint" aria-live="polite"></p>
      </div>
    </div>
    <div class="form__row">
      <div class="field">
        <label for="${id}-phone">Phone <span class="muted">(optional)</span></label>
        <input id="${id}-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="310.000.0000">
        <p class="hint"></p>
      </div>
      <div class="field field--select">
        <label for="${id}-interest">This is about</label>
        <select id="${id}-interest" name="interest">
          ${options.map((o) => `<option${o === interest ? " selected" : ""}>${o}</option>`).join("\n          ")}
        </select>${icon("caret-down", "field")}
        <p class="hint"></p>
      </div>
    </div>
    <div class="field">
      <label for="${id}-message">A few lines on what you have in mind</label>
      <textarea id="${id}-message" name="message" rows="5" required data-required="A sentence or two helps the first call go further."></textarea>
      <p class="hint" aria-live="polite">Nothing you write here is shared. Discretion is the default.</p>
    </div>
    <div class="field visually-hidden" aria-hidden="true">
      <label for="${id}-company">Leave this field empty</label>
      <input id="${id}-company" name="company_website" type="text" tabindex="-1" autocomplete="off">
    </div>
    <div class="form__actions">
      <button class="btn" type="submit" data-done="Sent">Send${icon("arrow-right", "link")}</button>
      <p class="form__status" role="status" aria-live="polite"></p>
    </div>
  </div>
  <div class="form__done">
    <h3>Received.</h3>
    <p>Ikem will reply personally, usually within one business day. If it is urgent, call ${SITE.phone}.</p>
  </div>
</form>`;
}

export function newsletterForm({ id = "nl", light = false } = {}) {
  return `<form class="nl" action="${SITE.formEndpoint}" method="POST" data-form novalidate
  data-success="You are on the list. The first letter will arrive when there is something worth saying."
  data-failure="That didn’t go through. Email ${SITE.email} with the word Subscribe and it will be added by hand.">
  <input type="hidden" name="_subject" value="Newsletter signup, theikemco">
  <input type="hidden" name="list" value="letters">
  <label class="visually-hidden" for="${id}-email">Email address</label>
  <div class="nl__row">
    <input id="${id}-email" name="email" type="email" inputmode="email" autocomplete="email" required placeholder="name@domain.com" data-required="An email address is needed.">
    <button type="submit" data-done="Subscribed">Subscribe</button>
  </div>
  <p class="hint" aria-live="polite" data-default="A few letters a year. Unsubscribe in one click.">A few letters a year. Unsubscribe in one click.</p>
</form>`;
}

/* ------------------------------------------------------------------ */
/* Press wall: official wordmark files (vendored SVGs) rendered as ink  */
/* coloured masks before each outlet's name. An outlet without a file   */
/* falls back to its typographic mark. Drop a new SVG into              */
/* public/assets/press and add it here.                                 */
/* ------------------------------------------------------------------ */
export const PRESS = [
  { name: "The Hollywood Reporter", file: "hollywood-reporter.svg", serif: false },
  { name: "Variety", file: "variety.svg", serif: true },
  { name: "Robb Report", file: "robb-report.svg", serif: false },
  { name: "Los Angeles Times", file: "la-times.svg", serif: true },
  { name: "Inman", file: "inman.svg", serif: false },
  { name: "Architectural Digest", file: "architectural-digest.svg", serif: false },
];

function svgRatio(file) {
  const p = join(HERE, "..", "public", "assets", "press", file);
  if (!existsSync(p)) return null;
  const svg = readFileSync(p, "utf8");
  const open = (svg.match(/<svg[^>]*>/i) || [""])[0];
  const vb = open.match(/viewBox="([^"]+)"/i);
  if (vb) {
    const parts = vb[1].trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts[3] > 0) return parts[2] / parts[3];
  }
  const w = parseFloat((open.match(/\swidth="([\d.]+)/i) || [])[1]);
  const hh = parseFloat((open.match(/\sheight="([\d.]+)/i) || [])[1]);
  return w > 0 && hh > 0 ? w / hh : null;
}

export function pressWall() {
  const cells = PRESS.map((o) => {
    const ratio = svgRatio(o.file);
    if (ratio) {
      /* Official wordmark in its own colours; the outlet's name lives in the alt text. */
      return `<li class="has-logo"><img class="press-logo" src="{{root}}assets/press/${o.file}" alt="${o.name}" width="${Math.round(ratio * 100)}" height="100" loading="lazy" decoding="async" style="--ratio:${ratio.toFixed(3)}"></li>`;
    }
    return `<li><span class="mark${o.serif ? " mark--serif" : ""}">${o.name}</span></li>`;
  });
  return `<ul class="press-wall">\n  ${cells.join("\n  ")}\n</ul>`;
}
