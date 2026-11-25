/**
 * Rewrites absolute /figma/ asset URLs in a static export to sit under BASE_PATH.
 *
 * next build prefixes basePath onto <Link> hrefs and /_next/* automatically, but
 * NOT onto plain <img src> or CSS url() — so a GitHub Pages project site
 * (served under /<repo>/) would load no images. This runs after the export.
 *
 * Usage: node scripts/prefix-export.mjs <out-dir> <base-path>
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";

const [, , outDir = "out", basePath = ""] = process.argv;
const prefix = basePath.replace(/\/$/, "");
if (!prefix) {
  console.log("no base path — nothing to rewrite");
  process.exit(0);
}

const EXT = new Set([".html", ".txt", ".css", ".js", ".json", ".xml"]);

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let files = 0;
let hits = 0;
for await (const file of walk(outDir)) {
  if (!EXT.has(extname(file))) continue;
  const src = await readFile(file, "utf8");
  if (!src.includes("/figma/")) continue;
  const out = src.replaceAll('"/figma/', `"${prefix}/figma/`)
                 .replaceAll("'/figma/", `'${prefix}/figma/`)
                 .replaceAll("(/figma/", `(${prefix}/figma/`);
  if (out !== src) {
    await writeFile(file, out);
    files++;
    hits += (src.match(/\/figma\//g) || []).length;
  }
}
console.log(`rewrote ${hits} /figma/ references across ${files} files under ${prefix}/`);