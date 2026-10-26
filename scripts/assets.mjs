// Builds every image the site uses into public/img, in the widths the pages ask for (WebP).
// Sources: design/photos (portraits and their cutouts) and the project repos next to this one.
// The site is a static export (GitHub Pages), so images are prepared here, not at request time.
//   node scripts/assets.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const DOCS = path.resolve("..");
const CSS = process.env.CSS_SHOTS ?? "C:/Users/anujl/AppData/Local/Temp/claude/C--Users-anujl-Shelfie/ae11e36b-982d-4709-b1cf-93861937515e/scratchpad/css/screenshots";

const jobs = [
  // portraits
  ["design/photos/sunglasses-cut.png", "me/sunglasses-cut", [700, 900, 1200, 1800], { alpha: true }],
  ["design/photos/portrait-dark-cut.png", "me/portrait-cut", [600, 1100], { alpha: true }],
  ["design/photos/profile-beige.webp", "me/profile", [800, 1400]],
  ["design/photos/portrait-dark.webp", "me/portrait", [600, 1200]],
  // Shortlist
  ...["match", "evidence", "landing", "tailored-diff", "mobile", "overview"].map((n) => [`${DOCS}/AI-Resume-Assistant/docs/screenshots/shortlist-${n}.png`, `work/shortlist/${n}`, [800, 1600]]),
  // Margin
  ...["summary-citation", "home", "dark", "key-facts", "mobile", "ask"].map((n) => [`${DOCS}/AI-Document-Summarizer/docs/screenshots/margin-${n}.png`, `work/margin/${n}`, [800, 1600]]),
  // FITFLOW
  ...["today", "landing", "overview-dark", "compose", "sequences", "mobile-today", "today-dark"].map((n) => [`${DOCS}/fitflow-showcase/public/screens/${n}.jpg`, `work/fitflow/${n}`, [800, 1600]]),
  // Creators Store
  ...["home", "home-dark", "dashboard", "payments", "fees", "home-mobile"].map((n) => [`${CSS}/${n}.png`, `work/creators/${n}`, [800, 1600]]),
  // COMET 2.0
  ...["01-local-lateral-hero", "03-postcard-lateral", "05-box-terracotta", "06-campaign-box-and-shoe"].map((n) => [`${DOCS}/comet-mumbai/design/photo/web/${n}.jpg`, `work/comet/${n.slice(3)}`, [800, 1600]]),
  // Solune & Afterdark
  ...["01-hero-solune", "02-hero-afterdark", "03-publication-spread", "04-pour-bar", "05-night-dial"].map((n) => [`${DOCS}/solune-afterdark/design/showcase/${n}.png`, `work/solune/${n.slice(3)}`, [800, 1600]]),
];

let n = 0;
for (const [src, out, widths, opt = {}] of jobs) {
  if (!existsSync(src)) { console.log("missing", src); continue; }
  await mkdir(path.dirname(`public/img/${out}`), { recursive: true });
  for (const w of widths) {
    await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: opt.alpha ? 86 : 80, alphaQuality: 90, effort: 5 }).toFile(`public/img/${out}-${w}.webp`);
    n++;
  }
}
console.log(`wrote ${n} images`);
