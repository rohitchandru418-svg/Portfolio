/**
 * Generates the CV assets the printer ships with:
 *
 *   public/cv/page-1.png   front sheet texture
 *   public/cv/page-2.png   back sheet texture
 *   public/cv/Chandru-M-CV.pdf   the file the printer downloads
 *
 * Everything is derived from the /cv route, so the printed sheet, the PDF and
 * the portfolio can never disagree. Assets are committed, so the deployed site
 * needs no browser at runtime.
 *
 * Requires Playwright and a running server:
 *   node scripts/gen-cv-assets.mjs [baseUrl]
 */
import { createRequire } from "node:module";
import { mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const base = process.argv[2] || "http://localhost:12000";
const outDir = resolve(root, "public/cv");

// Playwright is a dev-only tool and may live outside the project (CI, recovery).
function loadPlaywright() {
  const candidates = [
    "playwright",
    resolve(root, "node_modules/playwright"),
    "/workspace/project/.recovery/verify/node_modules/playwright",
  ];
  for (const c of candidates) {
    try {
      const req = createRequire(import.meta.url);
      return req(c);
    } catch {
      /* try next */
    }
  }
  throw new Error("Playwright not found. Install it or point one of the fallback paths at it.");
}

const { chromium } = loadPlaywright();
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 1200 }, deviceScaleFactor: 2 });

await page.goto(`${base}/cv`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.evaluate(() => document.fonts.ready);

// Reveal the off-screen pages so they can be captured at their true position.
await page.evaluate(() => {
  const doc = document.querySelector("[data-cv-doc]");
  if (doc) {
    doc.style.position = "static";
    doc.style.left = "0";
  }
});
await page.waitForTimeout(300);

for (const n of [1, 2]) {
  const el = await page.$(`[data-cv-page="${n}"]`);
  if (!el) throw new Error(`page ${n} not found`);
  const file = resolve(outDir, `page-${n}.png`);
  await el.screenshot({ path: file });
  console.log("wrote", file);
}

// PDF: normal flow, one A4 page per sheet, backgrounds on.
await page.addStyleTag({
  content: `@page { size: A4; margin: 0 }
            [data-cv-doc] { position: static !important; left: 0 !important; gap: 0 !important; }
            [data-cv-page] { break-after: page; }
            [data-cv-page]:last-child { break-after: auto; }`,
});
await page.pdf({
  path: resolve(outDir, "Chandru-M-CV.pdf"),
  format: "A4",
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});
console.log("wrote", resolve(outDir, "Chandru-M-CV.pdf"));

await browser.close();

// The printer loads the sheets as webp textures; the PNGs stay as the source.
const sharp = (await import("sharp")).default;
for (const n of [1, 2]) {
  await sharp(resolve(outDir, `page-${n}.png`))
    .webp({ quality: 88, effort: 6 })
    .toFile(resolve(outDir, `page-${n}.webp`));
  console.log("wrote", resolve(outDir, `page-${n}.webp`));
}

for (const f of ["page-1.png", "page-2.png", "page-1.webp", "page-2.webp", "Chandru-M-CV.pdf"]) {
  const p = resolve(outDir, f);
  if (!existsSync(p)) throw new Error("missing output: " + f);
}
console.log("done");
