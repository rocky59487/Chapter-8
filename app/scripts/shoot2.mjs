import { chromium } from 'playwright';
const OUT = '/tmp/claude-0/-home-user-Chapter-8/169dd050-0012-548e-9981-d0200d81b81d/scratchpad';
const BASE = 'http://localhost:4173';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

async function go(lesson, name, advance = 0) {
  await page.goto(`${BASE}/#/lesson/${lesson}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1300);
  for (let i = 0; i < advance; i++) {
    const btn = page.locator('button', { hasText: '繼續' }).first();
    if (await btn.count()) { await btn.click(); await page.waitForTimeout(900); }
  }
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log('shot', name);
}

await go('u3l1', '10-riemann', 0);     // Riemann sum teach
await go('u3l2', '11-area', 0);        // area accumulation
await go('u2l2', '12-match', 1);       // graph match (advance past intro teach)
await go('u2l1', '13-tangent', 0);     // tangent slider

// answer a TF question to see feedback footer
await page.goto(`${BASE}/#/lesson/u1l1`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
await page.locator('button', { hasText: '繼續' }).first().click();
await page.waitForTimeout(700);
await page.locator('button', { hasText: '錯誤' }).first().click();
await page.waitForTimeout(300);
await page.locator('button', { hasText: '檢查' }).first().click();
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/14-feedback.png` });
console.log('shot 14-feedback');

console.log('ERRORS:', errors.length ? errors : 'none');
await browser.close();
