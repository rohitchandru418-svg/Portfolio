/**
 * Regenerates public/figma/texture.png — the comp's "Pixels Texture": a 500px
 * tile with a 12px grid of small grey dots, ~14% of them missing, drawn with a
 * soft halo so it anti-aliases when tiled at 0.4 scale (200px) and 15% opacity.
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SIZE = 500;
const PERIOD = 12;
const START = 4;
const DOT = [98, 98, 98];
const PEAK_ALPHA = 235;
const MISSING = 0.14;

// Deterministic so the committed tile does not churn between runs.
function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(0x5eed);
const alpha = new Float32Array(SIZE * SIZE);

for (let gy = START; gy < SIZE; gy += PERIOD) {
  for (let gx = START; gx < SIZE; gx += PERIOD) {
    if (rand() < MISSING) continue;
    const cx = gx + (rand() < 0.1 ? 1 : 0);
    const cy = gy + (rand() < 0.1 ? 1 : 0);
    const spread = 1.0 + rand() * 0.6;
    for (let dy = -4; dy <= 5; dy++) {
      for (let dx = -4; dx <= 5; dx++) {
        // Distance to a 2x2 solid core at (0,0)-(1,1), so the dot stays crisp
        // at the 0.4 scale the comp tiles it at.
        const ox = Math.max(Math.abs(dx - 0.5) - 0.5, 0);
        const oy = Math.max(Math.abs(dy - 0.5) - 0.5, 0);
        const a =
          PEAK_ALPHA *
          Math.exp(-(ox * ox + oy * oy) / (2 * spread * spread));
        if (a < 12) continue;
        const x = (cx + dx + SIZE) % SIZE;
        const y = (cy + dy + SIZE) % SIZE;
        const i = y * SIZE + x;
        if (a > alpha[i]) alpha[i] = a;
      }
    }
  }
}

const out = Buffer.alloc(SIZE * SIZE * 4);
for (let i = 0; i < SIZE * SIZE; i++) {
  out[i * 4] = DOT[0];
  out[i * 4 + 1] = DOT[1];
  out[i * 4 + 2] = DOT[2];
  out[i * 4 + 3] = Math.round(alpha[i]);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
await sharp(out, { raw: { width: SIZE, height: SIZE, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(join(root, "public/figma/texture.png"));

let opaque = 0;
for (let i = 0; i < SIZE * SIZE; i++) if (alpha[i] > 200) opaque++;
console.log(
  `texture.png ${SIZE}x${SIZE}, opaque ${((opaque / (SIZE * SIZE)) * 100).toFixed(1)}%`,
);
