// Headless verification for the CV printer. Bounded: short waits, browser always
// closed. Covers the 3D scene, the no-WebGL fallback and reduced motion.
// Run: node scripts/test/cv.cjs [url]
const { createRequire } = require('node:module');
const path = require('node:path');

function loadPlaywright() {
  const req = createRequire(__filename);
  const candidates = [
    'playwright',
    path.resolve(__dirname, '../../node_modules/playwright'),
    '/workspace/project/.recovery/verify/node_modules/playwright',
  ];
  for (const c of candidates) {
    try { return req(c); } catch { /* next */ }
  }
  throw new Error('Playwright not found');
}
const { chromium } = loadPlaywright();
const URL = process.argv[2] || 'http://localhost:12000/';
const GL = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function openDrawer(page) {
  await page.waitForSelector('[data-cvtab]', { timeout: 30000 });
  await page.click('[data-cvtab]');
  await sleep(2500);
}

async function print(page) {
  const stage = await page.$('[data-cvp-stage]');
  const box = await stage.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  const seen = [];
  for (let i = 0; i < 30; i++) {
    await sleep(400);
    const p = await page.evaluate(() => document.querySelector('[data-cvp]')?.dataset.phase || null);
    if (seen[seen.length - 1] !== p) seen.push(p);
    if (p === 'settled') break;
  }
  return seen;
}

const modeOf = (page) =>
  page.evaluate(() => {
    const r = document.querySelector('[data-cvp]');
    return r?.classList.contains('is-3d') ? '3d' : r?.classList.contains('is-2d') ? '2d' : '?';
  });

(async () => {
  const browser = await chromium.launch({ args: GL });
  const results = [];

  // 1) 3D path
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
    page.on('response', (r) => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
    const downloads = [];
    ctx.on('download', (d) => downloads.push(d.suggestedFilename()));
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
    await sleep(1000);
    await openDrawer(page);
    results.push({ path: '3d', mode: await modeOf(page), phases: (await print(page)).join(' -> '), downloads, errors: errors.slice(0, 4) });
    await ctx.close();
  }

  // 2) No-WebGL fallback
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
    await ctx.addInitScript(() => {
      const orig = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...a) {
        if (typeof type === 'string' && type.startsWith('webgl')) return null;
        return orig.call(this, type, ...a);
      };
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const downloads = [];
    ctx.on('download', (d) => downloads.push(d.suggestedFilename()));
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
    await sleep(1000);
    await openDrawer(page);
    results.push({ path: 'fallback', mode: await modeOf(page), phases: (await print(page)).join(' -> '), downloads, errors: errors.slice(0, 4) });
    await ctx.close();
  }

  // 3) Reduced motion
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const downloads = [];
    ctx.on('download', (d) => downloads.push(d.suggestedFilename()));
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await openDrawer(page);
    results.push({ path: 'reduced-motion', phases: (await print(page)).join(' -> '), downloads });
    await ctx.close();
  }

  // 4) Phone width: the scene must fit the stage, not be clipped by it.
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
    await openDrawer(page);
    const fit = await page.evaluate(() => {
      const r = (s) => {
        const e = document.querySelector(s);
        if (!e) return null;
        const b = e.getBoundingClientRect();
        return { x: b.left, w: b.width };
      };
      const stage = r('.cvp-stage');
      const art = r('.cvp-canvas') || r('[data-cvp-flat]');
      return {
        stage: stage && Math.round(stage.w),
        art: art && Math.round(art.w),
        clipped: !!(stage && art && (art.x < stage.x - 1 || art.x + art.w > stage.x + stage.w + 1)),
      };
    });
    results.push({ path: 'phone-390', stage: fit.stage, art: fit.art, clipped: fit.clipped });
    await ctx.close();
  }

  // 5) A failed texture fetch must not take the page down with it.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
    const page = await ctx.newPage();
    await page.route('**/cv/page-*.png', (r) => r.abort());
    const downloads = [];
    ctx.on('download', (d) => downloads.push(d.suggestedFilename()));
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
    await sleep(800);
    const before = await page.evaluate(() => document.body.innerText.trim().length);
    await openDrawer(page);
    await sleep(1500);
    const after = await page.evaluate(() => document.body.innerText.trim().length);
    results.push({
      path: 'texture-fail',
      pageSurvived: after > before * 0.5,
      mode: await modeOf(page),
      phases: (await print(page)).join(' -> '),
      downloads,
    });
    await ctx.close();
  }

  await browser.close();

  let ok = true;
  for (const r of results) {
    const settled = /settled/.test(r.phases || '');
    const got = (r.downloads || []).length > 0;
    const clean = !r.errors || r.errors.length === 0;
    if (r.path === 'phone-390') {
      if (r.clipped) ok = false;
    } else if (r.path === 'texture-fail') {
      if (!r.pageSurvived || r.mode !== '2d' || !settled || !got) ok = false;
    } else if (!settled || !got || !clean) {
      ok = false;
    }
    console.log(JSON.stringify(r));
  }
  console.log(ok ? 'ALL PATHS OK' : 'FAILURES PRESENT');
  process.exit(ok ? 0 : 1);
})().catch((e) => {
  console.log('FATAL:', e.message.split('\n')[0]);
  process.exit(1);
});
