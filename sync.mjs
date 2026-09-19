/* Publish the current state of the site.
 *   node sync.mjs            → build, commit every change with a timestamped message, push main,
 *                              then publish dist/ to the gh-pages branch that GitHub Pages serves
 *   node sync.mjs "message"  → same, with your own commit message
 * The live page updates about a minute after the push.
 */
import { execSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const sh = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", ...opts });
const out = (cmd, opts = {}) => execSync(cmd, { stdio: ["ignore", "pipe", "inherit"], ...opts }).toString().trim();
const message = process.argv.slice(2).join(" ") || `Site update ${new Date().toISOString().slice(0, 16).replace("T", " ")}`;

/* 1. Build (fails on any dash in visible copy). */
sh("node build.mjs --check");
if (!existsSync("dist/index.html")) throw new Error("dist/index.html missing after build");

/* 2. Commit and push the source. */
if (out("git status --porcelain")) {
  sh("git add -A");
  sh(`git commit -m "${message.replace(/"/g, "'")}"`);
} else {
  console.log("Source unchanged; republishing the build only.");
}
sh("git push origin main");

/* 3. Publish dist/ as the gh-pages branch, from a temporary index so the ignored folder is never staged in main. */
const tmp = mkdtempSync(join(tmpdir(), "ikem-pages-"));
const env = { ...process.env, GIT_INDEX_FILE: join(tmp, "index") };
sh("git add -f dist", { env });
const tree = out("git write-tree --prefix=dist/", { env });
const commit = out(`git commit-tree ${tree} -m "Publish ${message.replace(/"/g, "'")}"`, { env });
sh(`git push -f origin ${commit}:refs/heads/gh-pages`);
rmSync(tmp, { recursive: true, force: true });

console.log("\nPublished. The live page updates in about a minute: https://hanumantk.github.io/the-ikem-co/");
