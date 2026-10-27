// Earlier versions of each project, recovered from its git history (see design/evolution), as web images.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
const E = "design/evolution/";
const jobs = [
  ["shortlist", 1, E + "shortlist-7895cf1.png"],
  ["shortlist", 2, E + "shortlist-2fd1675.png"],
  ["shortlist", 3, E + "shortlist-a9135f2.png"],
  ["fitflow", 1, E + "fitflow-landing-f59ae1f.jpg"],
  ["fitflow", 2, E + "fitflow-today-f59ae1f.jpg"],
  ["fitflow", 3, E + "fitflow-landing-d041fcf.jpg"],
  ["fitflow", 4, E + "fitflow-landing-bc83681.jpg"],
  ["fitflow", 5, E + "fitflow-today-bc83681.jpg"],
  ["creators", 1, E + "creators-home-8918651.png"],
  ["creators", 2, E + "creators-home-a4a9ef5.png"],
  ["solune", 0, "../solune-afterdark/design/boards/solune-concentrate.png"],
  ["solune", 1, E + "solune-v1-journey.jpg"],
  ["solune", 2, E + "solune-v2-book.jpg"],
  ["solune", 3, E + "solune-v3-horizon.jpg"],
  ["comet", 1, "../comet-mumbai/design/source/1.webp"],
  ["comet", 2, "../comet-mumbai/design/source/2.webp"],
  ["comet", 3, "../comet-mumbai/design/source/3.webp"],
];
for (const [slug, n, src] of jobs) {
  await mkdir(`public/img/work/${slug}`, { recursive: true });
  for (const w of [800, 1600]) await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`public/img/work/${slug}/evo-${n}-${w}.webp`);
}
console.log("done", jobs.length);
