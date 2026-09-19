/* Static build for The Ikem Co.
 *   node build.mjs            → writes dist/
 *   node build.mjs --check    → build, then fail if any visible copy contains a dash
 * No dependencies. Node 18 or later.
 */
import { mkdirSync, writeFileSync, cpSync, rmSync, existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { layout } from "./src/partials.mjs";
import { neighborhoodPage, servicePage, essayPage } from "./src/templates.mjs";
import neighborhoods from "./src/data/neighborhoods.mjs";
import services from "./src/data/services.mjs";
import journal from "./src/data/journal.mjs";
import home from "./src/pages/home.mjs";
import about from "./src/pages/about.mjs";
import press from "./src/pages/press.mjs";
import testimonials from "./src/pages/testimonials.mjs";
import properties from "./src/pages/properties.mjs";
import { neighborhoodsIndex, servicesIndex, journalIndex, contact, clientLogin, notFound } from "./src/pages/indexes.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "dist");

const pages = [
  home, about, press, testimonials, properties,
  neighborhoodsIndex, ...neighborhoods.map(neighborhoodPage),
  servicesIndex, ...services.map(servicePage),
  journalIndex, ...journal.map((e) => essayPage(e, journal)),
  contact, clientLogin, notFound,
];

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(here, "public"), out, { recursive: true });

/* Cache busting: stylesheets and scripts are linked with a short content hash, so a change
 * reaches visitors as soon as the page does instead of waiting out the CDN and browser cache. */
const ASSETS = ["css/tokens.css", "css/site.css", "js/lenis.min.js", "js/site.js"];
const assetVersion = Object.fromEntries(ASSETS.map((a) => [a, createHash("sha1").update(readFileSync(join(here, "public", a))).digest("hex").slice(0, 8)]));
const versionAssets = (html) => ASSETS.reduce((h, a) => h.split(`${a}"`).join(`${a}?v=${assetVersion[a]}"`), html);

for (const page of pages) {
  const depth = page.path.split("/").length - 1;
  const root = depth === 0 ? "./" : "../".repeat(depth);
  let html = layout({ ...page, root, head: page.head || "" });
  html = html.replaceAll("{{root}}", root);
  html = versionAssets(html);
  const file = join(out, page.path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log("wrote", page.path);
}

/* ------------------------------------------------------------------ */
/* Copy check: no dashes anywhere the reader can see or hear.           */
/* ------------------------------------------------------------------ */
if (process.argv.includes("--check")) {
  const problems = [];
  const walk = (dir) => readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });
  for (const file of walk(out)) {
    const html = readFileSync(file, "utf8");
    // Visible text: strip scripts, styles, comments, then tags.
    const visible = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]+>/g, " ");
    // Spoken text: alt, aria-label, title, placeholder, and option labels.
    const spoken = [...html.matchAll(/\b(?:alt|aria-label|title|placeholder|data-success|data-failure|data-required)="([^"]*)"/g)].map((m) => m[1]).join(" ");
    for (const [label, text] of [["visible", visible], ["attribute", spoken]]) {
      const lines = text.split("\n");
      lines.forEach((line, i) => {
        if (/[-–—]/.test(line)) problems.push(`${relative(here, file).split(sep).join("/")} (${label}): ${line.trim().slice(0, 120)}`);
      });
    }
  }
  if (problems.length) {
    console.error(`\nDash check failed (${problems.length}):`);
    problems.forEach((p) => console.error("  " + p));
    process.exit(1);
  }
  console.log(`\nDash check passed across ${pages.length} pages.`);
}
