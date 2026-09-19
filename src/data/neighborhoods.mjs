/* Neighborhood landing pages. Prose is written to be accurate as of 2026; review before publishing.
 * heroImage is a home Ikem has represented, taken from his listing pages; where none sits inside the
 * neighborhood itself the alt text names the address (heroPlate is kept but no longer shown). Swap in
 * neighborhood photography when it exists.
 * Sales tables list only transactions already published on Ikem’s existing site. Add more as they close.
 */
export default [
  {
    slug: "ladera-heights",
    name: "Ladera Heights",
    tagline: "Wide lots, long light, and the quietest streets on the ridge.",
    short: "Wide lots and midcentury houses on unincorporated county land, minutes from the coast.",
    lede: "Ladera Heights is where Los Angeles keeps its lot size. Ranch and midcentury houses sit on land that often runs past a quarter acre, on streets that curve with the hill and end without through traffic.",
    aside: "Unincorporated Los Angeles County · ZIP 90056 · Bordered by Culver City, Westchester, Inglewood, and the Baldwin Hills · Upper and Lower Ladera each with their own character.",
    closingImage: "ikem-window-dusk",
    closingPos: "50% 40%",
    heroImage: "home-bedford-dusk",
    heroPos: "50% 55%",
    heroPlate: "6125 Bedford Avenue · For lease",
    prose: `<p>Ladera Heights was laid out between the 1940s and the 1960s on the western slope of the Baldwin Hills, and it has kept the proportions of that era: single level houses set well back from the curb, three car garages, backyards that hold a pool and still leave room for a lawn. The upper streets look toward the ocean and, on clear evenings, toward Catalina. The lower streets, closer to Slauson and Centinela, are flatter and a little more traditional in their architecture.</p>
<p>The neighborhood is unincorporated, which means the county rather than the city handles permits, roads, and services. Buyers unfamiliar with the distinction often assume it is a disadvantage. In practice it produces a slower pace of change and a strong, organized community of homeowners. The Ladera Heights Civic Association has been active for decades.</p>
<p>Ladera is ten minutes from the airport, fifteen from the studios in Culver City, and twenty from the beach without a freeway. For clients who fly weekly, film on the Westside, and want a house rather than a compound, it is often the first place Ikem suggests.</p>`,
    market: [
      { term: "Housing stock", body: "Predominantly 1950s and 1960s ranch and midcentury houses, many still with original details: clerestory windows, terrazzo, curved plaster ceilings. A growing number of tasteful renovations and a small number of full rebuilds." },
      { term: "What buyers ask", body: "About the county’s permit process, the flight path from LAX (it varies block by block, and Ikem will walk it with you at the hour that matters), and the differences between Upper and Lower Ladera." },
      { term: "What sells", body: "Single level houses with updated systems and intact character. Lot size and privacy command the premium here, more than square footage." },
    ],
    sales: [
      { key: "For lease", name: "6125 Bedford Avenue", note: "Lower Ladera Heights · 4 bed · 3 bath · 2,919 square feet · built 1961", value: "$7,210 per month", href: "{{root}}properties.html#panel-active" },
    ],
    salesNote: "Additional Ladera Heights sales will be added as they close.",
    essay: null,
  },
  {
    slug: "view-park",
    name: "View Park",
    tagline: "A National Register district with the city at its feet.",
    short: "A National Register historic district of 1920s to 1950s architecture with downtown views.",
    lede: "View Park is one of the largest residential historic districts in the country, and it earns the title. Spanish Colonial Revival, Tudor Revival, Streamline Moderne, and midcentury houses line streets that were laid out for the view and still deliver it.",
    aside: "Unincorporated Los Angeles County · ZIPs 90043 and 90008 · Listed on the National Register of Historic Places in 2016 · Views of downtown and the Hollywood Hills.",
    closingImage: "ikem-dining-table",
    closingPos: "60% 50%",
    heroImage: "home-mount-vernon",
    heroPos: "50% 50%",
    heroPlate: "4040 Mount Vernon Drive · Sold",
    prose: `<p>Development began in 1923 on the north face of the Baldwin Hills, and the best houses were built over the following three decades by architects working in the revival styles of the period. The result is a neighborhood with the coherence of a single design idea and the variety of a hundred hands. Arched loggias sit beside streamlined stucco; a Tudor gable looks across the street at a low ranch with a butterfly roof.</p>
<p>From the 1960s View Park became home to many of the most prominent Black families in Los Angeles. Ray Charles and Tina Turner both lived here. That history is part of the neighborhood’s character and part of why the 2016 National Register listing mattered to residents: it recognized the architecture and the community together.</p>
<p>Because View Park is unincorporated, renovation rules come from the county rather than the city. The National Register listing itself is honorific, but buyers planning significant work should understand which properties are contributing structures and what the county asks of them. Ikem has written about this in the journal and walks clients through it before an offer.</p>`,
    market: [
      { term: "Housing stock", body: "Roughly 1,800 homes, most built between the 1920s and the 1950s. Two story revival houses on the view streets, single level ranches on the flatter blocks, and a handful of significant midcentury designs." },
      { term: "What buyers ask", body: "What the historic listing permits and forbids, whether a house qualifies for the Mills Act property tax program, and how the views differ from Olympiad Drive to Valley Ridge to the lower blocks." },
      { term: "What sells", body: "Houses with their original architecture intact and their systems brought current. Buyers here have usually decided on View Park before they decide on a house; condition and provenance settle the price." },
    ],
    sales: [
      { key: "Sold", name: "4040 Mount Vernon Drive", note: "View Park and Windsor Hills", value: "$2,950,000", href: "{{root}}properties.html#panel-sold" },
      { key: "Sold", name: "3957 Fairway Boulevard", note: "View Park and Windsor Hills", value: "$1,350,000", href: "{{root}}properties.html#panel-sold" },
    ],
    salesNote: null,
    essay: { href: "{{root}}journal/view-park-explained.html", label: "Read: View Park, explained →" },
  },
  {
    slug: "windsor-hills",
    name: "Windsor Hills",
    tagline: "Curving hillside streets and a long view west.",
    short: "Curving hillside streets south of Slauson, with quiet blocks and long views west.",
    lede: "Windsor Hills is View Park’s quieter neighbor to the south: the same hill, the same era, a slightly smaller scale, and on the western streets an unobstructed line to the ocean.",
    aside: "Unincorporated Los Angeles County · ZIP 90043 · South of Slauson Avenue, above Inglewood · Developed from the late 1930s.",
    closingImage: "ikem-concrete-bench",
    closingPos: "50% 50%",
    heroImage: "home-fairway",
    heroPos: "50% 45%",
    heroPlate: "3957 Fairway Boulevard · Sold",
    prose: `<p>The streets of Windsor Hills follow the contour of the land rather than a grid, which gives the neighborhood its particular calm. Houses built in the late 1930s and through the 1940s, many in the Minimal Traditional and early ranch styles, sit on lots that step down the slope. Front yards are generous; the best backyards look toward the sea.</p>
<p>Windsor Hills shares View Park’s unincorporated status, its ZIP code, and much of its history, and the two are often treated as one market. They are not quite. Windsor Hills houses tend to be a little smaller and a little later, and prices have historically sat just below View Park’s for comparable condition, which has made it the entry point for buyers who want the hill.</p>
<p>The K Line station at Hyde Park is a short drive down Slauson, and the neighborhood is closer than View Park to the Inglewood stadium and arena district, which has changed the calculus for clients who work there.</p>`,
    market: [
      { term: "Housing stock", body: "Late 1930s and 1940s houses, mostly single level, with a scattering of larger view homes on the western ridge. Original hardwood, casement windows, and tiled baths are common and valued." },
      { term: "What buyers ask", body: "How Windsor Hills differs from View Park, which streets have the ocean view and which have the city view, and what the drive to the Westside looks like at seven in the morning." },
      { term: "What sells", body: "Well kept originals on view streets, and thoughtful renovations that respected the house’s scale. Overbuilt additions are the exception here and the market treats them as such." },
    ],
    sales: [
      { key: "Sold", name: "4040 Mount Vernon Drive", note: "View Park and Windsor Hills", value: "$2,950,000", href: "{{root}}properties.html#panel-sold" },
      { key: "Sold", name: "3957 Fairway Boulevard", note: "View Park and Windsor Hills", value: "$1,350,000", href: "{{root}}properties.html#panel-sold" },
    ],
    salesNote: null,
    essay: null,
  },
  {
    slug: "baldwin-hills",
    name: "Baldwin Hills",
    tagline: "Modern houses on the ridge, a park at the door.",
    short: "Ridge top modern homes above Kenneth Hahn park, and the Village Green below.",
    lede: "Baldwin Hills holds two very different ideas of Los Angeles living: midcentury modern houses along the ridge of the Estates, and the Village Green below, a 1940s garden community that is a National Historic Landmark.",
    aside: "City of Los Angeles · ZIPs 90008 and 90016 · Kenneth Hahn State Recreation Area and the Baldwin Hills Scenic Overlook · Baldwin Hills Estates, Baldwin Vista, and Village Green.",
    closingImage: "ikem-agave-sunset",
    closingPos: "30% 50%",
    heroImage: "home-marburn",
    heroPos: "50% 50%",
    heroPlate: "Nearby · 5528 Marburn Avenue",
    prose: `<p>The Baldwin Hills Estates were built from the 1950s on streets whose names all begin with Don, which is why residents call the neighborhood the Dons. The houses are post and beam and low slung, with walls of glass that take in the basin from downtown to the ocean. Several were designed by architects whose names now command a premium; many more were built by developers who had absorbed the same lessons about light and site.</p>
<p>Below the ridge, the Village Green is a garden apartment community completed in 1942 and designated a National Historic Landmark in 2001. Its low buildings sit in continuous lawn with cars kept to the perimeter, an idea about density and green space that still feels ahead of its time. Baldwin Vista, to the north, is a neighborhood of 1940s and 1950s houses on quiet slopes.</p>
<p>What ties the area together is the park. Kenneth Hahn State Recreation Area and the Scenic Overlook put hundreds of acres of trail and open space at the end of the street, which for clients who train, or simply walk, is a daily fact rather than an amenity.</p>`,
    market: [
      { term: "Housing stock", body: "Midcentury modern houses in the Estates, often single level with view decks and pools; 1940s and 1950s houses in Baldwin Vista; garden apartments and townhomes in the Village Green, where sales are governed by the community’s historic standards." },
      { term: "What buyers ask", body: "Which houses on the ridge have the protected views, how the historic landmark status affects the Village Green, and what a renovation of a post and beam house actually costs to do properly." },
      { term: "What sells", body: "Ridge houses with the view and the architecture intact. Buyers come for the specific quality of these houses and pay for provenance, glass, and light." },
    ],
    sales: [],
    salesNote: "Baldwin Hills sales will be added to this page as they close. Ask Ikem about recent activity on the ridge, including homes that did not reach the public market.",
    essay: null,
  },
  {
    slug: "leimert-park",
    name: "Leimert Park",
    tagline: "The Olmsted planned village that became a cultural capital.",
    short: "The 1928 Olmsted planned village that remains the cultural heart of Black Los Angeles.",
    lede: "Leimert Park was planned in 1928 by Walter H. Leimert with the Olmsted Brothers, and the plan still reads on the ground: tree lined streets, Spanish Colonial Revival houses, and a village center at Degnan Boulevard that has been the cultural heart of Black Los Angeles for half a century.",
    aside: "City of Los Angeles · ZIPs 90008 and 90043 · Leimert Park Village, the Vision Theatre, and the K Line station opened in 2022.",
    closingImage: "ikem-window-dusk",
    closingPos: "45% 45%",
    heroImage: "home-spaulding",
    heroPos: "50% 45%",
    heroPlate: "Nearby · 1920 Spaulding Avenue",
    prose: `<p>The Olmsted plan gave Leimert Park what most Los Angeles neighborhoods lack: a center. The Village at Degnan Boulevard and 43rd Place was designed as a walkable commercial core, and it remains one, anchored by the Vision Theatre, built in 1931 as the Leimert Theatre and restored by the city, and by a generation of galleries, bookshops, and music rooms that made the neighborhood synonymous with jazz, drum circles, and the arts.</p>
<p>The residential streets are among the most consistent in the city. Spanish Colonial Revival houses of the late 1920s and 1930s, most with their original tile, arches, and hardwood, sit on modest lots under mature trees. The scale is intimate and the streets are quiet a block from the Village.</p>
<p>The Metro K Line’s Leimert Park station opened in 2022, putting the neighborhood on rail to Expo and, eventually, to the airport. Prices have moved accordingly, and Leimert Park now draws buyers who would once have looked only west.</p>`,
    market: [
      { term: "Housing stock", body: "1920s and 1930s Spanish Colonial Revival houses, with some later Traditional and ranch infill. Many are unaltered and well cared for; a rising number have been carefully restored." },
      { term: "What buyers ask", body: "About the Village and its calendar, about parking and the K Line, and about which blocks sit closest to the center without hearing it on a Sunday afternoon." },
      { term: "What sells", body: "Houses that kept their Spanish detail and gained modern kitchens and systems. The neighborhood rewards restraint in renovation and punishes the flip." },
    ],
    sales: [],
    salesNote: "Leimert Park sales will be added to this page as they close. Ask Ikem about the streets he is watching.",
    essay: null,
  },
];
