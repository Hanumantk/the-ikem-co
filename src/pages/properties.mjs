import { closing, propertyCard } from "../helpers.mjs";

const sold = [
  { name: "3818 Green Vista Drive, Encino", price: "$15,150,000", image: "home-green-vista" },
  { name: "3369 Alana Drive, Sherman Oaks", price: "$6,560,000", image: "home-alana", imagePos: "50% 40%" },
  { name: "1530 North Beverly Drive, Beverly Hills", price: "$5,145,000", image: "home-beverly" },
  { name: "4040 Mount Vernon Drive, View Park and Windsor Hills", price: "$2,950,000", image: "home-mount-vernon" },
  { name: "3957 Fairway Boulevard, View Park and Windsor Hills", price: "$1,350,000", image: "home-fairway" },
];

export default {
  path: "properties.html",
  title: "Properties · Ikem Chukumerije",
  description: "Active listings, recent sales, and off market homes available by introduction from Los Angeles broker Ikem Chukumerije.",
  over: false,
  current: "properties",
  content: `
<section class="section section--top-heavy" style="padding-block-end:var(--space-xl)">
  <div class="split">
    <div style="display:grid;gap:var(--space-lg)">
      <h1>Properties</h1>
      <p class="lede">Active listings, recent sales, and homes that are available by introduction only.</p>
    </div>
    <div class="text-fold__aside" style="align-self:end">
      <p>Sales listed here are a selection of transactions Ikem has represented. Photographs of past sales are shown with the owners’ consent.</p>
    </div>
  </div>
</section>

<section class="section" style="padding-block-start:0">
  <div data-tabs>
    <div class="tabs" role="tablist" aria-label="Property status" data-lenis-prevent>
      <button class="tab" role="tab" id="tab-active" aria-controls="panel-active" aria-selected="true">Active <span class="count">1</span></button>
      <button class="tab" role="tab" id="tab-sold" aria-controls="panel-sold" aria-selected="false" tabindex="-1">Sold <span class="count">${sold.length}</span></button>
      <button class="tab" role="tab" id="tab-offmarket" aria-controls="panel-offmarket" aria-selected="false" tabindex="-1">Off Market</button>
    </div>

    <section class="panel" id="panel-active" role="tabpanel" aria-labelledby="tab-active">
      <h2 class="panel__title">Active</h2>
      <div class="split">
        ${propertyCard({ status: "Active", statusNote: "For lease", active: true, name: "6125 Bedford Avenue, Ladera Heights", href: "{{root}}contact.html?about=6125%20Bedford%20Avenue", price: "$7,210 per month", specs: "4 bed · 3 bath · 2,919 square feet · lot of about 6,740 square feet · built 1961", image: "home-bedford-day" }).replace('class="card"', 'class="card" style="grid-template-columns:minmax(0,1fr)"')}
        <div class="prose" style="align-self:end">
          <p>A single level midcentury modern house in lower Ladera Heights, built in 1961 and unusually intact: a circular formal dining room, curved plaster ceilings, fireplaces, a walk in bar off the family room, granite and stainless in the kitchen, a three car garage, and a backyard that is private on every side.</p>
          <p>Offered for lease. Showings by appointment.</p>
          <p><a class="link" href="{{root}}contact.html?about=6125%20Bedford%20Avenue">Inquire about Bedford Avenue →</a></p>
        </div>
      </div>
    </section>

    <section class="panel" id="panel-sold" role="tabpanel" aria-labelledby="tab-sold" hidden>
      <h2 class="panel__title">Sold</h2>
      <div class="cards">
        ${sold.map((s) => propertyCard({ status: "Sold", name: s.name, href: "{{root}}contact.html", price: s.price, image: s.image, imagePos: s.imagePos })).join("\n        ")}
      </div>
      <p class="muted" style="margin-block-start:var(--space-2xl);max-width:60ch">Additional transactions, including those in the five other states where Ikem is licensed, are available on request.</p>
    </section>

    <section class="panel" id="panel-offmarket" role="tabpanel" aria-labelledby="tab-offmarket" hidden>
      <h2 class="panel__title">Off market</h2>
      <div class="split">
        <div class="prose">
          <p class="lede" style="margin-block-end:var(--space-lg)">Some of the best houses in Los Angeles change hands without a sign, a listing, or a photograph online.</p>
          <p>Ikem maintains relationships with owners who would sell for the right buyer and with buyers who would rather not be seen looking. If you are either, the conversation begins privately, and nothing about it is shared without your consent.</p>
          <p>Off market does not mean informal. The contract, the inspections, the disclosures, and the title work are the same as in a public sale. Discretion is a way of finding the buyer, not a way of skipping the diligence.</p>
          <p><a class="link" href="{{root}}contact.html?about=Off%20market%20introduction">Request an introduction →</a></p>
        </div>
        <div class="text-fold__aside" style="align-self:end">
          <p><a class="link" href="{{root}}journal/off-market-process.html">Read: Off market is not a secret. It is a process. →</a></p>
        </div>
      </div>
    </section>
  </div>
</section>

${closing({ image: "ikem-agave-sunset", pos: "28% 50%", title: "Selling, or thinking about it?", line: "Ikem will tell you honestly whether a quiet sale or a public listing serves you better.", label: "Contact Ikem →" })}
`,
};
