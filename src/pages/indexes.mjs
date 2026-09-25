import { SITE, closing, runhead, folios, listing, journalTable, leadForm, statement, photo } from "../helpers.mjs";
import neighborhoods from "../data/neighborhoods.mjs";
import services from "../data/services.mjs";
import journal from "../data/journal.mjs";

export const neighborhoodsIndex = {
  path: "neighborhoods/index.html",
  title: "Neighborhoods · Ikem Chukumerije",
  description: "Ladera Heights, View Park, Windsor Hills, Baldwin Hills, and Leimert Park: past sales and local market notes from Los Angeles broker Ikem Chukumerije.",
  over: false,
  current: "neighborhoods",
  content: `
<section class="section section--top-heavy">
  <div class="split">
    <div style="display:grid;gap:var(--space-lg)">
      <h1>Neighborhoods</h1>
      <p class="lede">Five neighborhoods on and around the same ridge in southwest Los Angeles, each with its own architecture, history, and market.</p>
    </div>
    <div class="text-fold__aside dropcap" style="align-self:end">
      <p>Ikem has sold here and lists here still. Each page carries past sales he represented, notes on what buyers ask, and what tends to sell. For current pricing, ask him directly.</p>
    </div>
  </div>
</section>

<section class="section">
  ${runhead("The five", "Neighborhoods", 1)}
  <div class="listings listings--2">
    ${neighborhoods.map((n) => listing({ name: n.name, href: `{{root}}neighborhoods/${n.slug}.html`, specs: n.short, image: n.heroImage, imagePos: n.heroPos })).join("\n    ")}
  </div>
</section>

${closing({ title: "Not sure which hill?", line: "Ikem will drive them with you in an afternoon.", label: "Contact Ikem →" })}
`,
};

export const servicesIndex = {
  path: "services/index.html",
  title: "Services · Ikem Chukumerije",
  description: "Commercial real estate, sports and entertainment real estate, property management, and construction advisory from Los Angeles broker Ikem Chukumerije.",
  over: false,
  current: "services",
  content: `
<section class="section section--top-heavy section--lead-in">
  <div style="display:grid;gap:var(--space-lg);max-width:60rem">
    <p class="caps muted">Services</p>
    <h1>Beyond the residential sale.</h1>
    <p class="lede">Four practices that grew out of the same client relationships.</p>
  </div>
</section>

${statement("The residential sale is where most relationships begin. It is rarely <em>where they end.</em>")}

${photo("home-beverly", "1530 North Beverly Drive, Beverly&nbsp;Hills&nbsp;·&nbsp;Sold", { pos: "50% 60%" })}

<section class="section bleed">
  ${runhead("The practices", "Services", 1)}
  <div class="wrap" style="margin-block-end:var(--space-2xl)">
    <div class="prose prose--wide dropcap" style="color:var(--color-ink-2)">
      <p>Clients who buy a home tend to need, sooner or later, an income property, a manager for the house while they travel, counsel on a renovation, or a move on short notice. Ikem would rather handle those himself than hand them to a stranger.</p>
    </div>
  </div>
  ${folios(services.map((s) => ({ name: s.name, note: s.short, href: `{{root}}services/${s.slug}.html` })))}
</section>

${closing()}
`,
};

export const journalIndex = {
  path: "journal/index.html",
  title: "Journal · Ikem Chukumerije",
  description: "Notes from Los Angeles broker Ikem Chukumerije on the market, the neighborhoods, and the particular work of buying and selling in public.",
  over: false,
  current: "journal",
  content: `
<section class="section section--top-heavy">
  <div class="split">
    <div style="display:grid;gap:var(--space-lg)">
      <h1>Journal</h1>
      <p class="lede">Notes on the market, the neighborhoods, and the particular work of buying and selling in public.</p>
    </div>
    <div class="text-fold__aside dropcap" style="align-self:end">
      <p>Written by Ikem, published when there is something worth saying. The same notes reach subscribers by email a few times a year.</p>
      <a class="link" href="#foot-email">Subscribe →</a>
    </div>
  </div>
</section>

<section class="section">
  ${runhead("Essays", "Journal", 1)}
  ${journalTable(journal)}
</section>

${closing({ title: "A question the journal hasn’t answered?", line: "Ask it directly. By appointment.", label: "Contact Ikem →" })}
`,
};

export const contact = {
  path: "contact.html",
  title: "Contact · Ikem Chukumerije",
  description: "Reach Los Angeles broker Ikem Chukumerije by phone, email, or the form. Replies are personal, and discretion is the default.",
  over: false,
  current: "contact",
  head: `<script>
  /* Preselect the topic when arriving from a service or property page (?about=...) */
  document.addEventListener("DOMContentLoaded", function () {
    var about = new URLSearchParams(location.search).get("about");
    if (!about) return;
    var sel = document.getElementById("inquiry-interest");
    var msg = document.getElementById("inquiry-message");
    var opts = Array.prototype.slice.call(sel.options);
    var hit = opts.find(function (o) { return o.text.toLowerCase().indexOf(about.toLowerCase()) >= 0; });
    if (hit) sel.value = hit.value; else if (msg && !msg.value) msg.value = "Regarding " + about + ". ";
  });
</script>`,
  content: `
<section class="section section--top-heavy">
  <div class="split">
    <div style="display:grid;gap:var(--space-2xl)">
      <div style="display:grid;gap:var(--space-lg)">
        <h1>Contact</h1>
        <p class="lede">A few lines is enough. Ikem replies personally.</p>
      </div>
      ${leadForm({ id: "inquiry" })}
    </div>
    <aside class="contact-aside">
      ${runhead("Reach Ikem", "Contact", 1)}
      <dl>
        <div><dt>Telephone</dt><dd><a href="${SITE.phoneHref}">${SITE.phone}</a></dd></div>
        <div><dt>Email</dt><dd><a href="mailto:${SITE.email}">${SITE.email}</a></dd></div>
        <div><dt>Meetings</dt><dd>By appointment, in Los Angeles or wherever the work is.</dd></div>
        <div><dt>Licensed</dt><dd>California DRE ${SITE.dre}, and independently in five further states.</dd></div>
      </dl>
    </aside>
  </div>
</section>
`,
};

export const clientLogin = {
  path: "client-login.html",
  title: "Client Login · Ikem Chukumerije",
  description: "The private client portal for The Ikem Co. is in preparation.",
  over: false,
  current: "client",
  content: `
<section class="section section--top-heavy" style="min-height:60svh">
  <div class="split">
    <div style="display:grid;gap:var(--space-lg)">
      <h1>Client portal</h1>
      <p class="lede">A private space for active clients is in preparation: documents, timelines, and showing schedules in one place.</p>
      <div class="prose dropcap">
        <p>Until it opens, everything moves the way it always has, by phone and by email, directly with Ikem. Existing clients who need a document today should call.</p>
        <p><a class="link" href="${SITE.phoneHref}">${SITE.phone} →</a></p>
      </div>
    </div>
    <div class="text-fold__aside" style="align-self:end">
      <p>Once the portal is live, this page becomes the sign in. Access will be by invitation to clients under representation.</p>
      <a class="link" href="{{root}}contact.html">Contact Ikem →</a>
    </div>
  </div>
</section>
`,
};

export const notFound = {
  path: "404.html",
  title: "Page not found · Ikem Chukumerije",
  description: "That page is not here.",
  over: false,
  current: "",
  content: `
<section class="section section--top-heavy" style="min-height:60svh">
  <div style="display:grid;gap:var(--space-lg);max-width:40ch">
    <h1>That page isn’t here.</h1>
    <p class="lede">The address may have changed, or it never existed.</p>
    <p><a class="link" href="{{root}}index.html">Back to the beginning →</a></p>
  </div>
</section>
`,
};
