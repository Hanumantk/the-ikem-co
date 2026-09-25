# The Ikem Co. — website

Personal brand site for Ikem Chukumerije. Static HTML, no framework, no dependencies. Built for speed: one CSS file, one small script, responsive WebP photography, fonts from Google Fonts.

## Publishing

The site lives at **https://hanumantk.github.io/the-ikem-co/**. Source is the `main` branch of `github.com/Hanumantk/the-ikem-co`; the built pages are served by GitHub Pages from the `gh-pages` branch. `dist/` is never committed to `main`.

To put your latest changes live:

```bash
npm run sync
```

That builds (the dash check must pass), commits everything, pushes `main`, and publishes `dist/` to `gh-pages`. The live page updates in about a minute. Pass a message if you like: `node sync.mjs "New sold record"`.

If you would rather have GitHub build the site itself on every push, grant the CLI the workflow scope once (`gh auth refresh -h github.com -s workflow`) and commit a Pages workflow under `.github/workflows/`; the sync script’s gh-pages step can then be dropped. When a custom domain is ready, add it under the repository’s Pages settings and update `url` in `src/helpers.mjs`.

## Run it

```bash
npm run dev
```

That builds `dist/` and serves it at http://localhost:5173. Or separately: `npm run build` then `npm run serve`. Node 18 or later is all you need.

To deploy, upload the contents of `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, S3). If your host supports it, point the 404 page at `dist/404.html`.

## Where things live

| Path | What it is |
| --- | --- |
| `src/pages/*.mjs` | One module per top level page (home, about, press, testimonials, properties, contact, indexes). |
| `src/data/neighborhoods.mjs` | The five neighborhood pages: prose, market notes, sales tables. |
| `src/data/services.mjs` | The four service pages. |
| `src/data/journal.mjs` | Journal essays. Add an object to publish a new one. |
| `src/partials.mjs` | Header, menu, footer, and the page layout. Site wide contact details are in `src/helpers.mjs` under `SITE`. |
| `public/css/tokens.css` | Colours, type, spacing, motion tokens. The whole look is tuned here. |
| `public/css/site.css` | Layout and components. |
| `public/js/site.js` | Menu, tabs, forms, testimonial films. Everything degrades to plain HTML without it. |
| `public/assets/img/` | Photography (responsive WebP + JPEG): portraits as `ikem-*`, properties as `home-*`, logo, placeholder slots. |
| `public/assets/video/` | Empty. Drop films here (see below). |
| `build.mjs` | Generates `dist/` and fails the build if any visible copy contains a dash. |

## Before launch: the short list

1. **Form endpoint.** In `src/helpers.mjs`, replace `https://formspree.io/f/REPLACE_ME` with your Formspree form id (or your own endpoint). Both the contact form and the newsletter form post there. Until then the forms show the fallback message with your phone and email.
2. **Email and domain.** `SITE.email` currently uses the existing address; change it when the new domain is decided, and set `SITE.url` for canonical and Open Graph tags.
3. **Reel.** Add `public/assets/video/reel.mp4` (H.264, 1920×1080, muted, under 8 MB). The home page poster stands in until then.
4. **Client films.** Add `public/assets/video/testimonial-paul.mp4`, `testimonial-attia.mp4`, `testimonial-carlson.mp4`. Optional posters go in `public/assets/img/` and are referenced from `src/pages/testimonials.mjs`.
5. **Property and neighborhood photography.** Every property card and neighborhood hero now carries a photograph taken from the listing pages on milliondollarliving.com (the `home-*` entries in `IMAGES` in `src/helpers.mjs`, generated as 640 / 1000 / 1600 WebP plus a JPEG fallback). Two neighborhoods have no listing of their own on that site, so their heroes show a nearby sale (the alt text names the address; photographs carry no visible caption): Baldwin Hills uses 5528 Marburn Avenue and Leimert Park uses 1920 Spaulding Avenue. Replace them with true neighborhood photography when you have it by changing `heroImage` in `src/data/neighborhoods.mjs`. Confirm with the owners of past sales that their photographs may appear here. The grey `slot(...)` helper remains for any future card without a photograph.
6. **Press logos.** The press wall shows each outlet’s wordmark in its own colours (SVG files in `public/assets/press/`); the outlet’s name is the image’s alt text. The Hollywood Reporter, Variety, Los Angeles Times, and Architectural Digest are in place; Robb Report and Inman fall back to typographic marks until you drop `robb-report.svg` and `inman.svg` into that folder (the list is `PRESS` in `src/helpers.mjs`). These are trademarks used to state factual coverage; confirm each outlet’s brand guidelines before launch. Also add article URLs to the clippings on `press.html`; a row becomes a link once it has an `href`.
7. **Sales records.** Add closed transactions to `src/data/neighborhoods.mjs` (`sales`) and `src/pages/properties.mjs` (`sold`). The Fairway Boulevard and Mount Vernon Drive sales are labelled “View Park and Windsor Hills” because both sit in the shared 90043 area; tighten the label if you prefer.
8. **Review the prose.** Neighborhood histories and the journal essays were written as first drafts in your voice from public record. Read them before publishing.
9. **Client portal.** `client-login.html` is a placeholder page. Point the “Client Login” link in `src/partials.mjs` at the portal when it exists.

## House rules baked into the build

- **No dashes in copy.** `node build.mjs --check` scans every page’s visible text and spoken attributes and fails if it finds a hyphen, en dash, or em dash. Write “off market”, “midcentury”, “ultra high net worth”.
- **No black, no blue, no gold.** The palette is linen, stone, umber, and the forest green from the wordmark. All colours are OKLCH tokens in `tokens.css`; nothing is hard coded elsewhere.
- **One accent.** Forest green appears only on focus rings, the active tab, hover states, and the active listing dot.
- **Two typefaces, three weights.** Cormorant Garamond for display, EB Garamond for text; headings are never italic. Hierarchy is carried by weight as much as size: `--wt-bold` (700) for page, photo, and section headings; `--wt-light` (300) for the pull quote, the drop cap, step numbers, and the menu; `--wt-regular` (400) for ledes and prose; `--wt-strong` (600) for every item title inside a list or collection (property names, service and press rows, neighborhood names, journal titles, step titles, definitions) and for the proof strip numbers and the small voices that must read first: section labels, prices, buttons, links, form labels, and the wordmark. Only those weights are loaded from Google Fonts.
- **Action buttons share one motion language.** Text links draw an accent hairline in from the left (and let it out to the right); the outlined submit button fills with ink rising from its baseline; the small caps controls (Menu, Close, Client Login, the reel toggle, Subscribe) draw a hairline under the label; tabs show a neutral hairline on hover and keep the accent line for the selected tab. Every control has all eight states; the submit button also shows loading, error (clears when you edit the form), and success (label swaps to its `data-done` text). `buttons.preview.html` at the project root renders every state side by side for review and can be deleted.
- **Icons are Phosphor, and weight is state.** The nine icons the site uses (arrow, list, x, play, pause, caret, warning, check, notch) are inlined once per page as SVG symbols from `src/data/phosphor.json` (extracted from the Phosphor font files; MIT, licence beside it). Each icon carries up to three layers and the weight steps up with state. Roles in `ICON_ROLES` in `src/helpers.mjs`: navigation controls are regular at rest and bold on hover or press; arrows on text links are light, regular on hover, bold when pressed; arrows beside list items are thin, light on hover; the film play glyph is regular and fills on hover; static marks (error, success, loading) are regular. Copy still uses a plain → and the build swaps it for the icon, so writers never touch SVG. The Equal Housing mark in the footer is a legal logo, not a UI icon, and stays.
- **Portrait budget: two.** After client feedback (2026-09-24) the portraits are used exactly twice: the staircase photograph in the home hero and one modest portrait on About. Every other image is property or neighborhood photography (`home-*`). Unused portrait files were deleted; only `ikem-agave-sunset` and `ikem-portrait-hands` remain in `IMAGES`.
- **Signature details.** A running head with a hairline and a right aligned folio opens each section (`runhead(label, page, n)`); the first paragraph of each page carries a drop cap (`.dropcap`); one italic Cormorant pull quote per page where a quote exists (`pullq()`); page closings are typographic (`closing()`), with the phone and email as text.
- **Layout rhythm.** The large statement left / small paragraph right layout is allowed once per page. Other sections use a centered statement (`statement()`), an edge to edge hairline table (`.section.bleed` with `defs(…, { table: true })` or `folios()`), a one third / two thirds split with the small column on the left (`.split--thirds`), or a numbered list with large folio numerals (`folios()`). Listings are large photographs with the address and price on a hairline (`listing()`), no boxes.
- **Navigation.** Desktop shows a masthead with seven links and Client Login; the disclosure menu and its floating button appear below 60rem.
- **Photography first.** Full bleed folds carry the pages; text sits in narrow bands between them.
- **Scroll.** Lenis smooth scrolling runs on every page (vendored at `public/js/lenis.min.js`, no CDN). Dialogs and the property tab strip are excluded so they scroll natively.
- **Motion stack.** Lenis is the only smooth scroll engine (vendored, `public/js/lenis.min.js`); GSAP 3.13 with ScrollTrigger (vendored, GreenSock standard licence) is the animation system. GSAP’s ticker drives Lenis and Lenis reports to ScrollTrigger, so there is one clock. The first fold on each page plays a short intro (title word by word, then the line and link); every other heading arrives word by word once as it enters the viewport, with its supporting line following. Split words are decorative (`aria-hidden`) and the unsplit heading stays in a visually hidden span; without JavaScript the headings are plain and fully visible; if GSAP fails to load a CSS guard reveals the first fold after 2.4 s. Under `prefers-reduced-motion: reduce` none of it runs and the page renders in its final state. No Three.js: nothing in a photographic editorial site needs a shader.
- **Photographs drift in their frames.** Every photo sits in a frame 10 to 34 % shorter (chosen per photo so the image is never enlarged beyond its natural width) and 4 % narrower than the image, drifts through the frame at a constant rate as it crosses the viewport (roughly a third of the frame height on the wide folds), eases in a beat behind the page, and carries a slight zoom anchored on the face. On the way out the photo keeps sliding past the frame’s top edge, which is allowed only once that edge has scrolled above the viewport, so no gap is ever visible. Tune `OVERHANG`, `ZOOM`, and `EASE` at the top of the parallax block in `public/js/site.js` (the CSS box size in `site.css` must match `OVERHANG` and `OVERSCAN`). `site.js` also reads the `data-face` fraction on each image (set in `IMAGES` in `src/helpers.mjs`, as `"x,y"` from the top left) plus a `data-body` mark (mid torso, as a fraction of image height) and positions the crop so head to waist stays in frame at any viewport and at every point of the drift; on narrow screens the subject is centred so the shoulders are not cut. When you add a new photograph, add its face coordinates too; without them the image simply centers.
- **Hover previews.** Any link with `data-peek="<image url>"` shows that photo trailing the cursor (the neighborhood list on the home page uses each neighborhood’s hero). Mouse and trackpad only; touch never sees it. The photo is preloaded on the first hover, follows with a light lag, and flips to the other side of the cursor near the viewport edge.
- **Reduced motion is respected.** With the OS setting on, Lenis is not started and photographs hold still at their face aware position.

## Polish pass (2026-09-24)

- The numbered folio list appears in two places only: the Services practices and About’s How Ikem works. Home shows the neighborhoods as a row of five tall photographs (`tiles()`) and the services as one typographic line (`.practices`).
- The proof strip and the press row are grids (three columns from 900 px; six, three, and two columns for the press logos), so no item wraps alone.
- Services carries one photograph (`photo()`) between the statement and the practices list. About’s story runs at a reading size in a seven column measure with the pull quote sticky in the margin (`.story`).
- Reveals: only a page title is split into words; everything else fades once, from 10% into the viewport.

## Design record

The Hallmark stamp at the top of `public/css/tokens.css` records the macrostructure (Photographic), theme (custom: light / roman serif / forest accent), nav (N9), footer (Ft7), and the pre-emit critique scores. `.hallmark/log.json` keeps the run history for future redesigns.
