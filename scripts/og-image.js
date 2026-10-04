/* eslint-disable @typescript-eslint/no-require-imports */
// Renders public/og.png (1200x630 share image) and src/app/apple-icon.png.
// Needs a production server on :3600 (fonts load from it) and Playwright: NODE_PATH=$(npm root -g) node scripts/og-image.js
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const home = await (await fetch('http://localhost:3600/en')).text();
  const css = [...home.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(m => m[1]);
  const htmlClass = home.match(/<html[^>]*class="([^"]+)"/)[1];
  const logo = fs.readFileSync('public/brand/atlasplast-white.svg', 'utf8');
  const page = `<!doctype html><html class="${htmlClass}"><head><base href="http://localhost:3600/">${css.map(h => `<link rel="stylesheet" href="${h}">`).join('')}
<style>body{margin:0;width:1200px;height:630px;background:#14284a;color:#f3f4f2;overflow:hidden;font-family:var(--font-plex)}
.wrap{position:relative;height:100%;padding:72px 80px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between}
.logo svg{height:150px;width:auto;display:block}
h1{font-family:var(--font-archivo);font-stretch:112%;letter-spacing:-.02em;font-weight:600;font-size:56px;line-height:1.02;margin:0;max-width:15ch}
.meta{display:flex;gap:40px;font-family:var(--font-plex-mono);font-size:22px;letter-spacing:.08em;text-transform:uppercase;color:#b9c3d3;border-top:1px solid #2c4063;padding-top:24px}
.ring{position:absolute;inset-inline-end:-120px;top:50%;transform:translateY(-50%);width:560px;height:560px}
</style></head><body><div class="wrap">
<div class="logo">${logo}</div>
<h1>Pipe systems and sanitaryware for Iraq.</h1>
<div class="meta"><span>Since 1975</span><span>atlasplast.iq</span><span>Baghdad · Erbil · Basra</span></div>
<svg class="ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#3c84c2" stroke-width="9"/><circle cx="50" cy="50" r="46" fill="none" stroke="#2c4063" stroke-width=".4"/><circle cx="50" cy="50" r="33" fill="none" stroke="#2c4063" stroke-width=".4"/></svg>
</div></body></html>`;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('http://localhost:3600/en');
  await p.setContent(page, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: 'public/og.png' });
  // apple touch icon from the app icon
  const icon = fs.readFileSync('src/app/icon.svg', 'utf8');
  await p.setViewportSize({ width: 180, height: 180 });
  await p.setContent(`<body style="margin:0;background:#fff"><div style="width:180px;height:180px;display:grid;place-items:center">${icon.replace('<svg', '<svg width="150" height="150"')}</div></body>`);
  await p.screenshot({ path: 'src/app/apple-icon.png' });
  await b.close();
})();
