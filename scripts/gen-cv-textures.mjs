// The printer maps the CV onto its sheet as a texture. WebP keeps that texture
// small enough to load instantly; a half-size copy is served to coarse pointers
// and small screens (the reference does the same).
//
//   node scripts/gen-cv-textures.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = (n) => join(root, "public", "cv", `page-${n}.png`);
const out = (n, suffix) => join(root, "public", "cv", `page-${n}${suffix}.webp`);

for (const n of [1, 2]) {
  await sharp(src(n)).webp({ quality: 82 }).toFile(out(n, ""));
  await sharp(src(n)).resize({ width: 768 }).webp({ quality: 78 }).toFile(out(n, "-sm"));
  console.log(`wrote page-${n}.webp + page-${n}-sm.webp`);
}
