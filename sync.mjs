/* Publish the current state of the site.
 *   node sync.mjs            → commit every change with a timestamped message and push
 *   node sync.mjs "message"  → same, with your own commit message
 * GitHub Actions then rebuilds and publishes dist/ to GitHub Pages within a couple of minutes.
 */
import { execSync } from "node:child_process";

const run = (cmd) => execSync(cmd, { stdio: "inherit" });
const message = process.argv.slice(2).join(" ") || `Site update ${new Date().toISOString().slice(0, 16).replace("T", " ")}`;

const status = execSync("git status --porcelain").toString().trim();
if (!status) {
  console.log("Nothing to publish: the working tree is clean.");
  process.exit(0);
}
run("git add -A");
run(`git commit -m "${message.replace(/"/g, "'")}"`);
run("git push");
console.log("\nPushed. GitHub Actions is building the site; the live page updates in about two minutes.");
