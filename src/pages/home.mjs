import { SITE, fold, closing, runhead, listing, tiles, pullq, journalTable, pressWall } from "../helpers.mjs";
import journal from "../data/journal.mjs";
import neighborhoods from "../data/neighborhoods.mjs";

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: SITE.person,
  alternateName: SITE.name,
  telephone: "+1 310 927 2344",
  email: SITE.email,
  url: SITE.url,
  areaServed: ["Los Angeles", "Ladera Heights", "View Park", "Windsor Hills", "Baldwin Hills", "Leimert Park"],
  knowsAbout: ["Luxury residential real estate", "Commercial real estate", "Sports and entertainment relocation", "Property management", "Construction advisory"],
  identifier: { "@type": "PropertyValue", propertyID: "California DRE", value: SITE.dre },
});

export default {
  path: "index.html",
  title: "Ikem Chukumerije · Los Angeles Real Estate Broker",
  description: "Residential and commercial real estate for athletes, actors, directors, writers, and executives. Licensed broker in six states, more than $300 million in career sales, based in Los Angeles.",
  over: true,
  current: "home",
  head: `<link rel="preload" as="image" href="{{root}}assets/img/ikem-agave-sunset-1600.webp" imagesrcset="{{root}}assets/img/ikem-agave-sunset-640.webp 640w, {{root}}assets/img/ikem-agave-sunset-1000.webp 1000w, {{root}}assets/img/ikem-agave-sunset-1600.webp 1600w" imagesizes="100vw" type="image/webp">
<script type="application/ld+json">${jsonLd}</script>`,
  content: `
${fold({
  image: "ikem-agave-sunset",
  variant: "hero",
  priority: true,
  pos: "28% 50%",
  posM: "12% 50%",
  title: "Ikem Chukumerije",
  line: "Broker to the people on the field, on the screen, and behind the camera.",
  eyebrow: "Los Angeles, at the hour the light goes soft.",
})}

<section class="section">
  ${runhead("Properties", "Home", 1)}
  <p class="muted" style="max-width:52ch;margin-block-end:var(--space-xl)">A selection. The full record, including sales and homes available by introduction only, is on the properties page.</p>
  <div class="listings listings--home">
    ${listing({ lead: true, status: "Active", statusNote: "For lease", active: true, name: "6125 Bedford Avenue, Ladera Heights", href: "{{root}}properties.html#panel-active", price: "$7,210 per month", specs: "4 bed · 3 bath · 2,919 square feet · built 1961", image: "home-bedford-day" })}
    ${listing({ status: "Sold", name: "3818 Green Vista Drive, Encino", href: "{{root}}properties.html#panel-sold", price: "$15,150,000", image: "home-green-vista" })}
    ${listing({ status: "Off market", name: "Available by introduction", href: "{{root}}properties.html#panel-offmarket", specs: "Homes that never reach the public market. The conversation begins privately.", image: "home-marburn-room", imageAlt: "A quiet living room, address withheld" })}
  </div>
  <p style="margin-block-start:var(--space-xl)"><a class="link" href="{{root}}properties.html">All properties →</a></p>
</section>

<section class="section">
  ${runhead("Neighborhoods", "Home", 2)}
  <div class="intro-row">
    <h2>Five neighborhoods, one ridge.</h2>
    <p class="muted">Ladera Heights, View Park, Windsor Hills, Baldwin Hills, and Leimert Park sit on and around the same rise of land in southwest Los Angeles. Ikem has sold here and lists here still. Each page carries past sales and notes on the local market.</p>
  </div>
  ${tiles(neighborhoods.map((n) => ({ name: n.name, href: `{{root}}neighborhoods/${n.slug}.html`, image: n.heroImage, pos: n.heroPos })))}
  <p style="margin-block-start:var(--space-xl)"><a class="link" href="{{root}}neighborhoods/index.html">The neighborhoods →</a></p>
</section>

<section class="statement">
  <p>Residential and commercial real estate for athletes, actors, directors, writers, and executives. Handled personally. Handled quietly.</p>
  <div class="dropcap" style="max-width:56ch;text-align:start;color:var(--color-ink-2)">
    <p>A licensed broker based in Los Angeles and independently licensed in six states, Ikem has closed more than $300 million in career sales, most of it for clients in the entertainment and sports community. There is no team behind the name. The person you meet at the first showing is the person at the closing table.</p>
  </div>
  <a class="link" href="{{root}}about.html">About Ikem →</a>
</section>

<div class="strip tnum">
  <p class="caps"><b>$300M+</b> in career sales, residential and commercial</p>
  <p class="caps"><b>6</b> state licenses, independently held</p>
  <p class="caps"><b>Top 30</b> Hollywood’s Top Real Estate Agents, The Hollywood Reporter, 2022</p>
</div>

<section class="section practices">
  <p class="caps muted">Services</p>
  <p class="practices__names"><span class="practices__name">Commercial Real Estate</span> <span class="practices__dot" aria-hidden="true">·</span> <span class="practices__name">Sports and Entertainment</span> <span class="practices__dot" aria-hidden="true">·</span> <span class="practices__name">Property Management</span> <span class="practices__dot" aria-hidden="true">·</span> <span class="practices__name">Construction Advisory</span></p>
  <p class="practices__line">Four practices that grew out of the same client relationships.</p>
  <a class="link" href="{{root}}services/index.html">All services →</a>
</section>

<section class="section">
  ${runhead("Press", "Home", 3)}
  <p class="muted" style="max-width:52ch;margin-block-end:var(--space-xl)">Reported in the trade and general press, most often for the homes of people whose work is public.</p>
  ${pressWall()}
  <p style="margin-block-start:var(--space-xl)"><a class="link" href="{{root}}press.html">Press and mentions →</a></p>
</section>

<section class="section section--rule">
  ${pullq("We couldn’t have been any happier with Ikem and his professionalism.", "Chris and Jada Paul", "Clients")}
  <p style="text-align:center;margin-block-start:var(--space-xl)"><a class="link" href="{{root}}testimonials.html">Watch the client films →</a></p>
</section>

<section class="section">
  ${runhead("Journal", "Home", 4)}
  <p class="muted" style="max-width:52ch;margin-block-end:var(--space-xl)">Notes on the market, the neighborhoods, and the particular work of buying and selling in public.</p>
  ${journalTable(journal)}
</section>

${closing()}
`,
};
