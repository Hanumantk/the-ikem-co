import { fold, closing, headHang, rows, defs, pic } from "../helpers.mjs";

export default {
  path: "about.html",
  title: "About Ikem Chukumerije · Los Angeles Broker",
  description: "Ikem Chukumerije, licensed real estate broker in Los Angeles and six states. His story, his practice, and the people he represents.",
  over: false,
  current: "about",
  content: `
<section class="section section--top-heavy">
  <div class="split split--reverse">
    <figure style="margin:0">
      ${pic("ikem-portrait-hands", { sizes: "(min-width: 60rem) 40vw, 100vw", priority: true, pos: "50% 20%", frame: "portrait" })}
    </figure>
    <div style="display:grid;gap:var(--space-xl);align-content:start">
      <div style="display:grid;gap:var(--space-sm)">
        <h1>Ikem Chukumerije</h1>
        <p class="caps muted">Pronounced EE kem · chu ku MARY jay</p>
      </div>
      <p class="lede">Broker. Los Angeles. Licensed in six states. Most of a career spent representing people whose work is public.</p>
      <div class="prose">
        <p>Ikem’s given name is Ikemefula. In Igbo it means “my efforts will not be in vain,” and it is a fair summary of how he works: thoroughly, personally, and to a conclusion.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section--rule">
  <div class="split">
    <div class="prose">
      <h2 style="margin-block-start:0">The story</h2>
      <p>The son of two educators, Ikem came to real estate with a teacher’s habits. He explains the market before he asks for a decision. He shows the comparable sales, the inspection reports, and the risks, and he expects clients to read them. The people he represents make consequential decisions for a living; he treats them as capable of making this one.</p>
      <p>Over the course of his career he has closed more than $300 million in residential and commercial sales, first across California and then in the states where he now holds independent licenses, six in all. Most of that work has been for professional athletes, actors, directors, writers, and executives in the entertainment and sports community.</p>
      <p>That work led him to found Sports Relocation, a boutique practice for athletes and entertainers whose moves are dictated by a trade, a contract, or a production schedule rather than by a season of house hunting. The same instincts run through his commercial practice, his property management work, and the construction advisory he offers clients who are building or renovating.</p>
      <p>The Hollywood Reporter named him one of Hollywood’s Top 30 Real Estate Agents in 2022 and included him in its Power Broker Awards the same year. Variety placed him among its Showbiz Real Estate Elite in 2020. Transactions he has represented have been covered in Architectural Digest, the Los Angeles Times, Robb Report, and Inman.</p>
      <p>He is now extending the same practice to ultra high net worth clients beyond entertainment and sport: founders, executives, and families for whom discretion is not a preference but a requirement.</p>
    </div>
    <aside class="sticky-intro">
      <blockquote class="pull" style="margin:0;padding-block:0;border:0;display:grid;gap:var(--space-md)">
        <p style="font-family:var(--font-display);font-size:var(--text-lg);line-height:1.25;max-width:24ch">“His level of service is excellent. He offers candid information.”</p>
        <footer class="caps muted">Joseph Attia · Client</footer>
      </blockquote>
    </aside>
  </div>
</section>

${fold({ image: "ikem-concrete-bench", variant: "band", pos: "60% 45%", title: "Restraint, repeated, becomes a signature.", plate: "Los Angeles" })}

<section class="section defer">
  ${headHang("How Ikem works")}
  ${defs([
    { term: "Education first", body: "Every engagement begins with the market, not the listing. You will see the comparable sales, the pace at which homes are trading, and the risks before you are asked to decide anything." },
    { term: "Discretion by default", body: "No client is named without consent. Showings, offers, and closings are structured to keep private what should stay private, including the use of entities and off market channels where they serve you." },
    { term: "Due diligence, in writing", body: "Inspections are read, not filed. Title, permits, and the seller’s disclosures are reviewed line by line, and the questions they raise are put to the other side in writing." },
    { term: "One broker", body: "There is no team behind the name. The broker you meet at the first showing is the broker at the closing table, and the broker who answers the phone a year later." },
  ])}
</section>

<section class="section section--rule defer">
  <div class="gallery">
    <figure>${pic("ikem-stair-rail", { sizes: "(min-width: 60rem) 40vw, 50vw", pos: "50% 30%", frame: "portrait" })}</figure>
    <figure>${pic("ikem-seated-grey", { sizes: "(min-width: 60rem) 25vw, 50vw", frame: "portrait" })}</figure>
    <figure>${pic("ikem-glass-door", { sizes: "(min-width: 60rem) 33vw, 50vw", frame: "portrait" })}</figure>
    <figure class="is-wide">${pic("ikem-window-dusk", { sizes: "(min-width: 60rem) 58vw, 100vw", frame: "wide" })}</figure>
    <figure>${pic("ikem-terrace-table", { sizes: "(min-width: 60rem) 33vw, 50vw", frame: "portrait" })}</figure>
  </div>
</section>

<section class="section defer">
  ${headHang("Recognition")}
  ${rows([
    { key: "2022", name: "Hollywood’s Top 30 Real Estate Agents", note: "The Hollywood Reporter" },
    { key: "2022", name: "Power Broker Awards", note: "The Hollywood Reporter" },
    { key: "2020", name: "Showbiz Real Estate Elite", note: "Variety" },
  ], { compact: true })}
  <p style="margin-block-start:var(--space-xl)"><a class="link" href="{{root}}press.html">All press →</a></p>
</section>

${closing({ image: "ikem-window-dusk", pos: "50% 40%" })}
`,
};
