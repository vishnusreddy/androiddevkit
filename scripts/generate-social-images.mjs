// Generate the default social / Open Graph image (public/og-default.png).
//
// Renders an inline HTML template with Playwright's bundled Chromium at exactly
// 1200x630 (the dimensions declared in BaseLayout.astro's og:image meta), then
// screenshots it to a PNG. Colors mirror the light-theme tokens in
// src/styles/global.css so the banner stays in lockstep with the site brand.
//
// Usage: node scripts/generate-social-images.mjs
// After running, bump SITE.socialImage's ?v= query in src/consts.ts so social
// crawlers (WhatsApp, Facebook, X) fetch the fresh image instead of a cache.

import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/og-default.png');
const WIDTH = 1200;
const HEIGHT = 630;

// Brand tokens (light theme) — keep in sync with src/styles/global.css.
const C = {
  bg: '#fafaf9',
  surface: '#ffffff',
  surface2: '#f3f4f3',
  surface3: '#eaecea',
  border: '#e6e8e6',
  ink: '#1a1f1c',
  inkSoft: '#4c544f',
  inkFaint: '#707872',
  accent: '#0e7c42',
  accentBright: '#3ddc84',
  accentSoft: '#e9f5ee',
  logoBg: '#0d2418',
};

const FONT =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const card = (label, question) => `
  <div class="card">
    <span class="pill">${label}</span>
    <div class="q">${question}</div>
    <div class="line" style="width:78%"></div>
    <div class="line" style="width:52%"></div>
  </div>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${WIDTH}px; height: ${HEIGHT}px; }
  body {
    font-family: ${FONT};
    background: ${C.bg};
    color: ${C.ink};
    display: flex;
    -webkit-font-smoothing: antialiased;
  }
  .left {
    flex: 0 0 66%;
    padding: 64px;
    display: flex;
    flex-direction: column;
  }
  .brand { display: flex; align-items: center; gap: 18px; }
  .logo {
    width: 68px; height: 68px; border-radius: 18px;
    background: ${C.logoBg};
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mono, ui-monospace, monospace);
    color: ${C.accentBright};
    font-size: 30px; font-weight: 700; letter-spacing: -1px;
  }
  .wordmark { font-size: 34px; font-weight: 800; letter-spacing: -0.5px; }
  .wordmark .kit { color: ${C.accent}; }
  .eyebrow {
    margin-top: 68px;
    color: ${C.accent};
    font-size: 20px; font-weight: 700;
    letter-spacing: 3px; text-transform: uppercase;
  }
  .headline {
    margin-top: 18px;
    font-size: 76px; font-weight: 800;
    line-height: 1.03; letter-spacing: -2px;
    color: ${C.ink};
  }
  .sub {
    margin-top: 28px;
    font-size: 27px; font-weight: 400;
    line-height: 1.42; color: ${C.inkSoft};
    max-width: 540px;
  }
  .domain {
    margin-top: 20px;
    font-size: 24px; font-weight: 700; color: ${C.inkFaint};
  }
  .right {
    flex: 1;
    background: ${C.surface2};
    border-left: 1px solid ${C.border};
    display: flex; flex-direction: column; justify-content: center;
    gap: 26px; padding: 48px 56px 48px 40px;
  }
  .card {
    background: ${C.surface};
    border: 1px solid ${C.border};
    border-radius: 18px;
    padding: 22px 24px;
    box-shadow: 0 12px 40px -16px rgba(20, 26, 22, 0.18);
  }
  .card:nth-child(2) { transform: translateX(-24px); }
  .pill {
    display: inline-block;
    background: ${C.accentSoft};
    color: ${C.accent};
    font-size: 13px; font-weight: 700;
    letter-spacing: 1.2px; text-transform: uppercase;
    padding: 5px 11px; border-radius: 999px;
  }
  .q {
    margin-top: 14px;
    font-size: 22px; font-weight: 700; color: ${C.ink};
    line-height: 1.25;
  }
  .line {
    height: 9px; border-radius: 999px;
    background: ${C.surface3};
    margin-top: 14px;
  }
</style></head><body>
  <div class="left">
    <div class="brand">
      <div class="logo">&lt;/&gt;</div>
      <div class="wordmark">Android<span class="kit">DevKit</span></div>
    </div>
    <div class="eyebrow">Mock tests &amp; interview practice</div>
    <div class="headline">Land your next<br>Android role.</div>
    <div class="sub">Topic-wise mock tests, timed full interviews, a curated question bank, and real interview experiences.</div>
    <div class="domain">androiddevkit.com</div>
  </div>
  <div class="right">
    ${card('Coroutines', 'Explain structured concurrency')}
    ${card('System Design', 'Design an image loading pipeline')}
    ${card('Architecture', 'MVVM vs MVI trade-offs')}
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
});
await page.setContent(html, { waitUntil: 'networkidle' });
await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
await browser.close();
console.log(`Wrote ${OUT} (${WIDTH}x${HEIGHT})`);
