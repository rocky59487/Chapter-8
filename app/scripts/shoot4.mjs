import { chromium } from 'playwright';
const OUT = '/tmp/claude-0/-home-user-Chapter-8/169dd050-0012-548e-9981-d0200d81b81d/scratchpad';
const BASE = 'http://localhost:4173';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', (e) => errs.push('PAGEERR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('CERT')) errs.push('CONSOLE: ' + m.text()); });

async function shot(name, hash, wait = 1100, advance = 0) {
  await page.goto(`${BASE}/${hash}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(wait);
  for (let i = 0; i < advance; i++) {
    const btn = page.locator('button', { hasText: '繼續' }).first();
    if (await btn.count()) { await btn.click(); await page.waitForTimeout(800); }
  }
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log('shot', name);
}

await shot('40-home-nav', '#/', 1000);
await shot('41-warmup', '#/lesson/u1l0', 1200);
// reach the order question in u1l3 (advance through teach steps)
await shot('42-order', '#/lesson/u1l3', 1200, 3);
await shot('43-profile', '#/profile', 900);
await shot('44-u2-warmup', '#/lesson/u2l0', 1300);

console.log('ERRORS:', errs.length ? errs.slice(0, 15) : 'none');
await b.close();
