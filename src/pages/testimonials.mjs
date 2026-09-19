import { SITE, closing, headHang, icon } from "../helpers.mjs";

const films = [
  { id: "paul", name: "Chris and Jada Paul", quote: "We couldn’t have been any happier with Ikem and his professionalism.", role: "Clients" },
  { id: "attia", name: "Joseph Attia", quote: "His level of service is excellent. He offers candid information.", role: "Client" },
  { id: "carlson", name: "The Carlsons", quote: "His involvement … creative solutions are the reasons we are homeowners.", role: "Clients" },
];

function film(f) {
  return `<figure class="film">
  <!-- TODO: Add public/assets/video/testimonial-${f.id}.mp4 (H.264, 1920x1080) and a poster at assets/img/testimonial-${f.id}.jpg -->
  <button class="film__poster" type="button" data-film="{{root}}assets/video/testimonial-${f.id}.mp4" data-film-name="${f.name}" aria-label="Play the film with ${f.name}">
    <span class="film__glyph" aria-hidden="true">${icon("play", "play")}</span>
    <span class="film__name" aria-hidden="true">${f.name}</span>
  </button>
  <blockquote>“${f.quote}”</blockquote>
  <figcaption class="caps">${f.name} · ${f.role}</figcaption>
</figure>`;
}

export default {
  path: "testimonials.html",
  title: "Client Films · Ikem Chukumerije",
  description: "Past clients of Los Angeles broker Ikem Chukumerije, in their own words, on film and in writing.",
  over: false,
  current: "testimonials",
  content: `
<section class="section section--top-heavy">
  <div class="split">
    <div style="display:grid;gap:var(--space-lg)">
      <h1>Client films</h1>
      <p class="lede">Past clients, in their own words. The films are short, and the written version sits beneath each one.</p>
    </div>
    <div class="text-fold__aside" style="align-self:end">
      <p>Every client named here has agreed to be named. Many of the people Ikem represents prefer not to be, and that preference is honored without exception.</p>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="films">
    ${films.map(film).join("\n    ")}
  </div>
</section>

<section class="section section--rule defer">
  ${headHang("Add your voice", "If Ikem has represented you and you would like to be part of this page, on film or in writing, write to him directly.")}
  <a class="link" href="mailto:${SITE.email}?subject=A%20few%20words%20for%20the%20site">${SITE.email} →</a>
</section>

${closing({ image: "ikem-dining-table", pos: "62% 50%", title: "The next conversation could be yours.", line: "By appointment, in person or by phone.", label: "Contact →" })}

<dialog id="film-dialog" class="film-dialog" aria-label="Client film" data-lenis-prevent>
  <div class="film-dialog__bar">
    <span class="caps" data-film-title></span>
    <button class="menu-close" type="button" data-film-close>${icon("x", "nav")}<span>Close</span></button>
  </div>
  <video controls playsinline preload="metadata"></video>
  <p class="film-dialog__note" data-film-note hidden></p>
</dialog>
`,
};
