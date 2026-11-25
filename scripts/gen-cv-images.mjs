/**
 * Generates the smaller image copies the CV prints with:
 *
 *   public/cv/img/portrait.webp    the headshot on page 1
 *   public/cv/img/work-0N.webp     the four "Selected work" thumbnails
 *
 * The site serves full-size art; the printed sheet only ever needs a few hundred
 * pixels, so shipping the originals would bloat the CV PDF for no visible gain.
 * Committed, like the rest of public/cv.
 *
 * Usage: node scripts/gen-cv-images.mjs
 */
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "public/cv/img");
mkdirSync(out, { recursive: true });

const jobs = [
  { src: "public/figma/about-portrait.webp", dest: "portrait.webp", width: 520, quality: 82 },
  ...["01", "02", "03", "04"].map((n) => ({
    src: `public/figma/work-${n}.webp`,
    dest: `work-${n}.webp`,
    width: 720,
    quality: 80,
  })),
];

for (const j of jobs) {
  await sharp(resolve(root, j.src))
    .resize({ width: j.width, withoutEnlargement: true })
    .webp({ quality: j.quality, effort: 6 })
    .toFile(resolve(out, j.dest));
  console.log("wrote", resolve(out, j.dest));
}