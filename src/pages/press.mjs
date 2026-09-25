import { SITE, closing, runhead, rows, pressWall } from "../helpers.mjs";

export default {
  path: "press.html",
  title: "Press · Ikem Chukumerije",
  description: "Coverage of Ikem Chukumerije and the transactions he has represented in The Hollywood Reporter, Variety, Robb Report, the Los Angeles Times, Inman, and Architectural Digest.",
  over: false,
  current: "press",
  content: `
<section class="section section--top-heavy">
  <div class="split">
    <div style="display:grid;gap:var(--space-lg)">
      <h1>Press</h1>
      <p class="lede">Reported coverage of Ikem and the homes he has represented, most of them belonging to people whose work is public.</p>
    </div>
    <div class="text-fold__aside dropcap" style="align-self:end">
      <p>For interviews, comment on the Los Angeles luxury market, or the sports and entertainment sector, write to <a href="mailto:${SITE.email}" style="border-block-end:1px solid var(--color-rule)">${SITE.email}</a>.</p>
    </div>
  </div>
</section>

<section class="section section--tight">
  ${pressWall()}
</section>

<section class="section">
  ${runhead("Clippings", "Press", 1)}
  <p class="muted" style="max-width:56ch;margin-block-end:var(--space-xl)">Add the article links as they are gathered; each row becomes a link once a URL is present.</p>
  <!-- TODO: Add href to each row (rows() renders a link when href is present). -->
  ${rows([
    { key: "2022", name: "Hollywood’s Top 30 Real Estate Agents", note: "The Hollywood Reporter" },
    { key: "2022", name: "Power Broker Awards", note: "The Hollywood Reporter" },
    { key: "2022", name: "Elaine Welteroth’s Los Angeles home tour", note: "Architectural Digest" },
    { key: "2022", name: "Lonzo Ball’s $7.3 million purchase", note: "Architectural Digest" },
    { key: "2021", name: "Ava DuVernay’s property sale", note: "Los Angeles Times" },
    { key: "2020", name: "Showbiz Real Estate Elite", note: "Variety" },
    { key: "Feature", name: "Robb Report", note: "Link to follow" },
    { key: "Feature", name: "Inman", note: "Link to follow" },
  ], { compact: true })}
</section>

${closing({ title: "Working on a story?", line: "Ikem speaks on the Los Angeles market, and on the particular real estate needs of athletes and entertainers.", label: "Press inquiries →", href: `mailto:${SITE.email}` })}
`,
};
