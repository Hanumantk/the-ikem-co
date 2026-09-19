import { SITE, fold, closing, headHang, propertyCard, rows, pic, pressWall, icon } from "../helpers.mjs";
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
  plate: "Los Angeles",
})}

<section class="text-fold">
  <p class="lede">Residential and commercial real estate for athletes, actors, directors, writers, and executives. Handled personally. Handled quietly.</p>
  <div class="text-fold__aside">
    <p>A licensed broker based in Los Angeles and independently licensed in six states, Ikem has closed more than $300 million in career sales, most of it for clients in the entertainment and sports community. There is no team behind the name. The person you meet at the first showing is the person at the closing table.</p>
    <a class="link" href="{{root}}about.html">About Ikem →</a>
  </div>
</section>

<!-- Reel: drop a short, muted film at public/assets/video/reel.mp4 (H.264, 1920x1080, under 8 MB). Until then the poster stands in. -->
<section class="fold fold--band fold--video">
  <video data-px data-reel autoplay muted loop playsinline preload="none" poster="{{root}}assets/img/ikem-window-dusk-1600.webp" style="--pos:50% 40%" width="1600" height="1067" data-face="0.44,0.21" data-body="0.46" aria-label="Short film of Ikem Chukumerije at home in Los Angeles">
    <source src="{{root}}assets/video/reel.mp4" type="video/mp4">
  </video>
  <div class="fold__caption">
    <p class="fold__line">Los Angeles, at the hour the light goes soft.</p>
  </div>
  <button class="fold__play" type="button" data-reel-toggle data-playing="true" hidden>${icon("pause", "link", { cls: "ic-when-playing" })}${icon("play", "link", { cls: "ic-when-paused" })}<span data-reel-label>Pause</span></button>
</section>

<section class="section section--tight">
  <div class="proof proof--3 tnum">
    <div><b>$300M+</b><span>in career sales, residential and commercial</span></div>
    <div><b>6</b><span>state licenses, independently held</span></div>
    <div><b>Top 30</b><span>Hollywood’s Top Real Estate Agents, The Hollywood Reporter, 2022</span></div>
  </div>
</section>

<section class="section defer">
  ${headHang("Properties", "A selection. The full record, including sales and homes available by introduction only, is on the properties page.")}
  <div class="cards">
    ${propertyCard({ status: "Active", statusNote: "For lease", active: true, name: "6125 Bedford Avenue, Ladera Heights", href: "{{root}}properties.html#panel-active", price: "$7,210 per month", specs: "4 bed · 3 bath · 2,919 square feet · built 1961", image: "home-bedford-day" })}
    ${propertyCard({ status: "Sold", name: "3818 Green Vista Drive, Encino", href: "{{root}}properties.html#panel-sold", price: "$15,150,000", image: "home-green-vista" })}
    ${propertyCard({ status: "Off market", name: "Available by introduction", href: "{{root}}properties.html#panel-offmarket", specs: "Homes that never reach the public market. The conversation begins privately.", image: "home-marburn-room", imageAlt: "A quiet living room, address withheld" })}
  </div>
  <p style="margin-block-start:var(--space-2xl)"><a class="link" href="{{root}}properties.html">All properties →</a></p>
</section>

${fold({ image: "ikem-dining-table", variant: "band", pos: "62% 50%", title: "Beyond the residential sale.", line: "Four practices that grew out of the same client relationships.", plate: "Plate II" })}

<section class="section defer">
  ${rows([
    { name: "Commercial Real Estate", note: "Retail, office, multifamily, and land, acquired and sold with the same discretion as a home.", href: "{{root}}services/commercial.html" },
    { name: "Sports and Entertainment", note: "Relocation, purchase, sale, and lease for athletes and entertainers, on a schedule the season sets.", href: "{{root}}services/sports-entertainment.html" },
    { name: "Property Management", note: "Homes cared for while you are on the road, on set, or between cities.", href: "{{root}}services/property-management.html" },
    { name: "Construction Advisory", note: "Counsel through renovation and ground up builds, from budget to punch list.", href: "{{root}}services/construction-advisory.html" },
  ])}
</section>

<section class="section section--rule defer">
  <div class="split">
    <ul class="hoods">
      ${neighborhoods.map((n) => `<li><a href="{{root}}neighborhoods/${n.slug}.html" data-peek="{{root}}assets/img/${n.heroImage}-1000.webp"><span class="hoods__name">${n.name}${icon("arrow-right", "quiet")}</span><span class="hoods__note">${n.short}</span></a></li>`).join("\n      ")}
    </ul>
    <div class="sticky-intro">
      <h2>Five neighborhoods, one ridge.</h2>
      <p class="muted">Ladera Heights, View Park, Windsor Hills, Baldwin Hills, and Leimert Park sit on and around the same rise of land in southwest Los Angeles. Ikem has sold here and lists here still. Each page carries past sales and notes on the local market.</p>
      <a class="link" href="{{root}}neighborhoods/index.html">The neighborhoods →</a>
    </div>
  </div>
</section>

<section class="section defer">
  ${headHang("Press", "Reported in the trade and general press, most often for the homes of people whose work is public.")}
  ${pressWall()}
  <p style="margin-block-start:var(--space-xl)"><a class="link" href="{{root}}press.html">Press and mentions →</a></p>
</section>

<section class="quote-room defer">
  <blockquote>“We couldn’t have been any happier with Ikem and his professionalism.”</blockquote>
  <p class="attribution caps"><b>Chris and Jada Paul</b> · Clients</p>
  <a class="link link--light" href="{{root}}testimonials.html">Watch the client films →</a>
</section>

<section class="section defer">
  ${headHang("Journal", "Notes on the market, the neighborhoods, and the particular work of buying and selling in public.")}
  <div class="entries">
    ${journal.map((e) => `<article class="entry">
      <p class="entry__kicker caps">${e.kicker}</p>
      <h3><a href="{{root}}journal/${e.slug}.html">${e.title}</a></h3>
      <p>${e.standfirst}</p>
      <a class="link" href="{{root}}journal/${e.slug}.html">Read →</a>
    </article>`).join("\n    ")}
  </div>
</section>

${closing({ image: "ikem-concrete-bench", pos: "60% 45%" })}
`,
};
