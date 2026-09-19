import { fold, closing, headHang, rows, steps, defs, pic, leadForm } from "./helpers.mjs";

/* ------------------------------------------------------------------ */
/* Neighborhood landing page                                           */
/* ------------------------------------------------------------------ */
export function neighborhoodPage(n) {
  const salesBlock = n.sales.length
    ? rows(n.sales, { compact: true }) + (n.salesNote ? `<p class="muted" style="margin-block-start:var(--space-lg)">${n.salesNote}</p>` : "")
    : `<p class="muted">${n.salesNote}</p>`;

  return {
    path: `neighborhoods/${n.slug}.html`,
    title: `${n.name} Real Estate · Ikem Chukumerije`,
    description: `${n.name}: ${n.short} Past sales and local market notes from Los Angeles broker Ikem Chukumerije.`,
    over: true,
    current: "neighborhoods",
    content: `
${fold({ image: n.heroImage, pos: n.heroPos, priority: true, variant: "band", title: n.name, titleSmall: false, line: n.tagline, plate: n.heroPlate })}

<section class="text-fold">
  <p class="lede">${n.lede}</p>
  <div class="text-fold__aside">
    <p>${n.aside}</p>
    <a class="link" href="{{root}}neighborhoods/index.html">All five neighborhoods →</a>
  </div>
</section>

<section class="section section--rule defer">
  <div class="split">
    <div class="prose">
      ${n.prose}
      ${n.essay ? `<p><a class="link" href="${n.essay.href}">${n.essay.label}</a></p>` : ""}
    </div>
    <div class="sticky-intro">
      <h2>Market notes</h2>
      <p class="muted">Observations from working the neighborhood, updated as the market moves. For current comparable sales and pricing, ask Ikem directly.</p>
    </div>
  </div>
  <div style="margin-block-start:var(--space-2xl)">
    ${defs(n.market)}
  </div>
</section>

<section class="section defer">
  ${headHang(`Sales in ${n.name}`, "Transactions represented by Ikem. The record grows as they close.")}
  ${salesBlock}
</section>

${closing({ image: n.closingImage, pos: n.closingPos, title: `Thinking about ${n.name}?`, line: "Walk it with someone who has sold here. By appointment.", label: "Contact Ikem →" })}
`,
  };
}

/* ------------------------------------------------------------------ */
/* Service page                                                        */
/* ------------------------------------------------------------------ */
export function servicePage(s) {
  return {
    path: `services/${s.slug}.html`,
    title: `${s.name} · Ikem Chukumerije`,
    description: `${s.short} ${s.name} from Los Angeles broker Ikem Chukumerije.`,
    over: false,
    current: "services",
    content: `
<section class="section section--top-heavy">
  <div class="split split--reverse">
    <figure style="margin:0">
      ${pic(s.image, { sizes: "(min-width: 60rem) 40vw, 100vw", loading: "eager", pos: s.pos, frame: "portrait" })}
    </figure>
    <div style="display:grid;gap:var(--space-xl);align-content:start">
      <p class="caps muted">Services</p>
      <h1>${s.name}</h1>
      <p class="lede">${s.lede}</p>
      <div class="prose">${s.intro}</div>
      <a class="link" href="{{root}}contact.html?about=${encodeURIComponent(s.name)}">Discuss ${s.name.toLowerCase()} →</a>
    </div>
  </div>
</section>

<section class="section section--rule defer">
  <div class="split">
    <div>
      ${headHang("What this covers")}
      <div class="prose">
        <ul>
          ${s.covers.map((c) => `<li>${c}</li>`).join("\n          ")}
        </ul>
      </div>
    </div>
    <div>
      ${headHang("How an engagement runs")}
      ${steps(s.steps)}
    </div>
  </div>
</section>

<section class="section section--rule defer">
  ${headHang("The other practices")}
  ${rows(
    [
      { name: "Commercial Real Estate", href: "{{root}}services/commercial.html" },
      { name: "Sports and Entertainment", href: "{{root}}services/sports-entertainment.html" },
      { name: "Property Management", href: "{{root}}services/property-management.html" },
      { name: "Construction Advisory", href: "{{root}}services/construction-advisory.html" },
    ].filter((r) => !r.href.endsWith(`${s.slug}.html`)),
    { compact: true }
  )}
</section>

${closing({ image: s.closingImage, pos: s.closingPos, title: "Begin a conversation.", line: "By appointment, in person or by phone.", label: "Contact →" })}
`,
  };
}

/* ------------------------------------------------------------------ */
/* Journal essay                                                       */
/* ------------------------------------------------------------------ */
export function essayPage(e, all) {
  const others = all.filter((o) => o.slug !== e.slug);
  return {
    path: `journal/${e.slug}.html`,
    title: `${e.title} · Journal · Ikem Chukumerije`,
    description: e.standfirst,
    over: false,
    current: "journal",
    content: `
<article class="article wrap">
  <header class="article__head">
    <p class="kicker caps">${e.kicker} · Journal</p>
    <h1>${e.title}</h1>
    <p class="lede" style="font-size:var(--text-md)">${e.standfirst}</p>
  </header>
  <div class="prose">
    ${e.body}
    <p class="muted" style="margin-block-start:var(--space-xl)">Ikem Chukumerije is a licensed real estate broker in Los Angeles. This essay is general commentary, not legal or tax advice; speak with your own counsel about your situation.</p>
  </div>
</article>

<section class="section section--rule defer">
  ${headHang("Also in the journal")}
  ${rows(others.map((o) => ({ key: o.kicker, name: o.title, note: o.standfirst, href: `{{root}}journal/${o.slug}.html` })), { compact: true })}
</section>

${closing({ image: "ikem-window-dusk", pos: "50% 40%", title: "Talk it through.", line: "The essays are general. Your situation is not. By appointment.", label: "Contact Ikem →" })}
`,
  };
}
