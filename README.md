# Chandru M — UI/UX Designer Portfolio

Single-page, scroll-based editorial portfolio built from the Figma reference
(`AFI`, node `416:3`). Next.js (App Router) + TypeScript + Tailwind v4 + Framer Motion.

## Run locally

```bash
npm install
npm run dev      # http://localhost:12000
```

Production:

```bash
npm run build && npm run start
```

## Where to edit content

All copy lives in `src/data/` — the site reads from it, so editing one file
updates every place that value appears.

| File | What it holds |
| --- | --- |
| `src/data/site.ts` | Name, role, email, phone, location, socials, stats, SEO |
| `src/data/projects.ts` | Case studies (cards + case-study pages) |
| `src/data/services.ts` | Service cards |
| `src/data/process.ts` | Process steps + the dark stat card |
| `src/data/experience.ts` | Work timeline |
| `src/data/philosophy.ts` | Philosophy banner |
| `src/data/testimonials.ts` | Quotes |
| `src/data/tools.ts` | Toolkit list + soft skills |
| `src/data/posts.ts` | Journal entries |
| `src/data/faq.ts` | FAQ accordion |
| `src/lib/assets.ts` | Image paths |

Anything still marked `PLACEHOLDER` is a stand-in from the brief.

## Images

Reference imagery exported from Figma lives in `public/figma/` as WebP. Swap in
your own work by replacing those files (keep the names) or by pointing
`src/lib/assets.ts` at new files.

`public/figma/texture.png` is the page's dot grain. It must stay the design's
**500×500 tile** (Figma "Pixels Texture", `TILE` fill at 0.4 → 200px). Do not
replace it with a flattened full-page export: the CSS scales the image to a
200px tile, so a huge export gets averaged down into an invisible flat wash.

## Contact form

The form is wired for [Web3Forms](https://web3forms.com). Add your key to
`.env.local`:

```
NEXT_PUBLIC_WEB3FORMS_KEY=your-key
```

Without a key the form shows a clear error instead of silently doing nothing.

## The CV printer

A tab on the right edge opens a drawer that prints the CV. The sheet is not a
textured plane — it is a simulated cloth (`src/components/cv/printer/printerCore.ts`),
clipped at the slot, so it feeds out of the machine and then hangs and waves.
The real two-page document is mapped onto it and can be flipped.

The scene is a framework-free three.js module (`printerCore.ts`) mounted into a
plain `<div>` by `CvPrinter.tsx`; `PrinterFlat.tsx` is the CSS fallback. The
drawer fills the right edge and the stage takes the full height above a single
button, matching the reference layout.

The CV itself is assembled from the same data as the rest of the site
(`src/data/cv.ts`), so it cannot drift from the portfolio:

```bash
node scripts/gen-cv-images.mjs   # rebuilds public/cv/img/* from public/figma/*
node scripts/gen-cv-assets.mjs   # regenerates public/cv/{page-1,page-2}.png + the PDF
node scripts/test/cv.cjs         # headless: 3D, no-WebGL fallback, reduced motion,
                                 #         390px fit, texture-load failure
```

three.js loads only when the drawer first opens, so the portfolio's first paint
is unchanged. If the scene cannot render — no WebGL, or a texture fetch fails —
the drawer falls back to the CSS printer rather than breaking the page.

## Notes

- Fonts: Satoshi (Fontshare CDN), with a system fallback.
- Motion respects `prefers-reduced-motion`.
- `npm run typecheck` and `npm run build` are the checks to run before shipping.
