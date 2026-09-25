/* Shared HTML helpers for the build. Pure functions returning strings. */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const HERE = dirname(fileURLToPath(import.meta.url));

/* ------------------------------------------------------------------ */
/* Icons: Phosphor (MIT, src/data/phosphor-LICENSE.txt), inlined as    */
/* <symbol>s once per page. Weight carries state.                       */
/* ------------------------------------------------------------------ */
const PHOSPHOR = JSON.parse(readFileSync(join(HERE, "data", "phosphor.json"), "utf8"));
export const ICON_ROLES = {
  nav:   { rest: "regular", hover: "bold",    active: "bold" },
  link:  { rest: "light",   hover: "regular", active: "bold" },
  quiet: { rest: "thin",    hover: "light",   active: "regular" },
  field: { rest: "light",   hover: "regular", active: "regular" },
  play:  { rest: "regular", hover: "fill",    active: "fill" },
  mark:  { rest: "regular" },
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

/* Responsive image manifest. Two portraits remain in use (the home hero and the About page);
 * everything else is property and neighborhood photography from the listing pages on
 * milliondollarliving.com. */
export const IMAGES = {
  "ikem-agave-sunset":   { w: 1600, h: 1067, sizes: [640, 1000, 1600], face: "0.20,0.11", body: "0.38", alt: "Ikem Chukumerije in a cream suit on an outdoor stair beside an agave, hills and a low sun behind him" },
  "ikem-portrait-hands": { w: 1067, h: 1600, sizes: [640, 1000, 1067], alt: "Portrait of Ikem Chukumerije in a cream double breasted suit, fingertips together" },
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
 * opts: alt, sizes, loading, priority, pos, posM, cls, frame ("portrait" | "wide") for a drifting frame,
 * px:false for a static image. Photographs carry data-px (drift) unless px is false.
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

/** Full bleed photographic fold: the home hero and the neighborhood heroes. */
export function fold({ image, slotKind, variant = "band", title, titleSmall = true, line, link, priority = false, pos, posM, alt, eyebrow, id, masthead = false, explore = false }) {
  const media = image
    ? pic(image, { priority, pos, posM, alt, sizes: "100vw" })
    : slot(slotKind || "16x9", alt || "Photograph to follow", { pos });
  const parts = [];
  const tcls = `fold__title${masthead ? " fold__title--wide" : ""}`;
  if (title) parts.push(variant === "hero" ? `<h1 class="${tcls}">${title}</h1>` : `<h2 class="${tcls}">${title}</h2>`);
  if (line) parts.push(`<p class="fold__line">${line}</p>`);
  if (eyebrow) parts.push(`<p class="caps">${eyebrow}</p>`);
  if (link) parts.push(`<a class="link link--light" href="${link.href}">${link.label}</a>`);
  if (explore) parts.push(`<button class="fold__explore caps-ctl" type="button" data-explore hidden><span>Scroll to explore</span>${icon("arrow-right", "quiet")}</button>`);
  return `<section class="fold fold--${variant}${masthead ? " fold--masthead" : ""}"${id ? ` id="${id}"` : ""}>
  ${media}
  <div class="fold__caption${masthead ? " fold__caption--masthead" : ""}">
    ${parts.join("\n    ")}
  </div>
</section>`;
}

/** Signature: running head with a hairline above, the label at left and a folio at right. */
export function runhead(label, page, n) {
  const folio = `<b>${SITE.name}</b> · ${page} · ${String(n).padStart(2, "0")}`;
  return `<div class="runhead"><span class="caps">${label}</span><span class="caps runhead__folio">${folio}</span></div>`;
}

/** Signature: the single italic pull quote a page is allowed. */
export function pullq(quote, who, role) {
  return `<blockquote class="pullq">
  <p>“${quote}”</p>
  <footer class="caps"><b>${who}</b>${role ? ` · ${role}` : ""}</footer>
</blockquote>`;
}

/** A single centered statement with a lot of air around it. */
export function statement(text, { caps, heading = false } = {}) {
  return `<section class="statement">
  ${caps ? `<p class="caps">${caps}</p>` : ""}
  ${heading ? `<h2>${text}</h2>` : `<p>${text}</p>`}
</section>`;
}

/** Closing block used at the end of most pages: quiet, typographic, the phone and email as text.
 *  image and pos are accepted for compatibility and ignored. */
export function closing({ title = "Begin a <em>conversation.</em>", line = "By appointment, in person or by phone.", href = "{{root}}contact.html", label = "Contact →" } = {}) {
  return `<section class="close">
  <div>
    <h2>${title}</h2>
    <p class="close__line">${line}</p>
  </div>
  <div class="close__means">
    <a href="${SITE.phoneHref}">${SITE.phone}</a>
    <a href="mailto:${SITE.email}">${SITE.email}</a>
    <a class="link" href="${href}">${label}</a>
  </div>
</section>`;
}

export function headHang(title, para) {
  return `<header class="head-hang">
  <h2>${title}</h2>${para ? `\n  <p>${para}</p>` : ""}
</header>`;
}

/** Listing: a large photograph, then the address and price on one hairline. */
export function listing({ status, statusNote, name, href, price, specs, active = false, image, imagePos, imageAlt, lead = false, sizes }) {
  const media = image
    ? pic(image, { px: false, pos: imagePos, alt: imageAlt, sizes: sizes || (lead ? "100vw" : "(min-width: 60rem) 50vw, 100vw") })
    : slot("4x3", `${name}, photograph to follow`);
  return `<article class="listing${lead ? " listing--lead" : ""}">
  <a class="listing__media" href="${href}" tabindex="-1" aria-hidden="true">${media}</a>
  <div class="listing__line">
    <h3 class="listing__name"><a href="${href}">${name}</a></h3>
    ${price ? `<p class="listing__price">${price}</p>` : ""}
    ${status ? `<p class="listing__status caps"><i class="${active ? "is-active" : ""}"></i>${status}${statusNote ? ` · ${statusNote}` : ""}</p>` : ""}
    ${specs ? `<p class="listing__specs">${specs}</p>` : ""}
  </div>
</article>`;
}

/** Numbered list with large folio numerals. Items with href are links. */
export function folios(items) {
  const li = items.map((it) => {
    const inner = `<span class="folio__name">${it.name}</span>${it.note ? `<span class="folio__note">${it.note}</span>` : ""}${it.href ? `<span class="folio__arrow" aria-hidden="true">${icon("arrow-right", "quiet")}</span>` : ""}`;
    const attrs = it.peek ? ` data-peek="${it.peek}"` : "";
    return it.href ? `<li><a href="${it.href}"${attrs}>${inner}</a></li>` : `<li><div class="folio">${inner}</div></li>`;
  }).join("\n");
  return `<ol class="folios">\n${li}\n</ol>`;
}

/** Deck: a row of property cards. Inside a [data-showcase] wrapper the script pins the hero and slides
 *  the row in from the right; otherwise it is a native horizontal snap row. */
export function deck({ lead, cards }) {
  const total = String(cards.length).padStart(2, "0");
  const leadCard = lead ? `<article class="card card--lead">
    <div class="card__panel">
      <p class="caps card__kicker">${lead.kicker}</p>
      <p class="card__lead">${lead.text}</p>
      <a class="link" href="${lead.href}">${lead.label}</a>
    </div>
  </article>` : "";
  const items = cards.map((c, i) => `<article class="card${c.active ? " card--active" : ""}">
    <a class="card__media" href="${c.href}" tabindex="-1" aria-hidden="true">${pic(c.image, { px: false, pos: c.pos, alt: c.alt, sizes: "(min-width: 60rem) 48rem, 78vw" })}</a>
    <div class="card__panel">
      <p class="caps card__status"><i class="${c.active ? "is-active" : ""}"></i>${c.status}</p>
      <h3 class="card__name"><a href="${c.href}">${c.name}</a></h3>
      ${c.price ? `<p class="card__price">${c.price}</p>` : ""}
      ${c.specs ? `<p class="card__specs">${c.specs}</p>` : ""}
      <p class="caps card__count"><span class="tnum">${String(i + 1).padStart(2, "0")}</span> / <span class="tnum">${total}</span></p>
      <a class="card__go" href="${c.href}" aria-label="${c.name}">${icon("arrow-right", "link")}</a>
    </div>
  </article>`).join("\n  ");
  return `<div class="deck" data-deck>
  ${leadCard}
  ${items}
</div>`;
}

/** Facts row: large light numerals with a small label beneath each, on a hairline. */
export function facts(items) {
  return `<div class="facts tnum">\n${items.map((f) => `<p><b>${f.n}</b><span class="caps">${f.label}</span></p>`).join("\n")}\n</div>`;
}

/** Tour: a photograph that stays put while the reader moves down a list; the photograph changes with the list. */
export function tour(items) {
  const pics = items.map((t, i) => `<div class="tour__pic${i === 0 ? " is-on" : ""}" data-tour-pic="${i}">${pic(t.image, { px: false, pos: t.pos, sizes: "(min-width: 60rem) 40vw, 100vw" })}</div>`).join("\n    ");
  const li = items.map((t, i) => `<li data-tour-item="${i}"${i === 0 ? ' class="is-current"' : ""}><a href="${t.href}"><span class="tour__name">${t.name}</span>${t.note ? `<span class="tour__note">${t.note}</span>` : ""}</a></li>`).join("\n    ");
  return `<div class="tour" data-tour>
  <div class="tour__media" aria-hidden="true">
    ${pics}
  </div>
  <ol class="tour__list">
    ${li}
  </ol>
</div>`;
}

/** Photo row: tall tiles in one row, the name set in the serif beneath. No description, no arrow, no border. */
export function tiles(items) {
  const li = items.map((t) => `<li><a href="${t.href}">${pic(t.image, { px: false, pos: t.pos, sizes: "(min-width: 60rem) 20vw, 70vw" })}<span class="tile__name">${t.name}</span></a></li>`);
  return `<ul class="tiles">\n${li.join("\n")}\n</ul>`;
}

/** One photograph, edge to edge, with a single line of small caps beneath. */
export function photo(image, caption, opts = {}) {
  return `<figure class="photo">
  ${pic(image, { px: false, pos: opts.pos, alt: opts.alt, sizes: "100vw" })}
  ${caption ? `<figcaption class="caps muted">${caption}</figcaption>` : ""}
</figure>`;
}

/** Journal entries as a hairline table: kicker, title, standfirst. */
export function journalTable(entries) {
  return `<ul class="journal">
${entries.map((e) => `<li><a href="{{root}}journal/${e.slug}.html"><span class="journal__kicker caps">${e.kicker}</span><span class="journal__title">${e.title}</span><span class="journal__standfirst">${e.standfirst}</span></a></li>`).join("\n")}
</ul>`;
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

export function defs(items, { table = false } = {}) {
  return `<dl class="defs${table ? " defs--table" : ""}">\n${items.map((d) => `<div><dt>${d.term}</dt><dd>${d.body}</dd></div>`).join("\n")}\n</dl>`;
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

export function newsletterForm({ id = "nl" } = {}) {
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
/* Press wall: official wordmarks on one hairline row.                 */
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
      return `<li class="has-logo"><img class="press-logo" src="{{root}}assets/press/${o.file}" alt="${o.name}" width="${Math.round(ratio * 100)}" height="100" loading="lazy" decoding="async" style="--ratio:${ratio.toFixed(3)}"></li>`;
    }
    return `<li><span class="mark${o.serif ? " mark--serif" : ""}">${o.name}</span></li>`;
  });
  return `<ul class="press-wall">\n  ${cells.join("\n  ")}\n</ul>`;
}
