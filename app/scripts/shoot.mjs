import { chromium } from 'playwright';

const OUT = process.env.OUT || '/tmp/claude-0/-home-user-Chapter-8/169dd050-0012-548e-9981-d0200d81b81d/scratchpad';
const BASE = 'http://localhost:4173';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

async function shot(name, hash, wait = 900) {
  await page.goto(BASE + '/' + (hash || ''), { waitUntil: 'networkidle' });
  await page.waitForTimeout(wait);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: hash.includes('exam') });
  console.log('shot', name);
}

await shot('01-home', '#/');
// open first lesson
await page.goto(BASE + '/#/lesson/u1l1', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/02-lesson-teach.png` });
// click continue to reach a question
for (let i = 0; i < 1; i++) {
  const btn = page.locator('button', { hasText: '繼續' }).first();
  if (await btn.count()) { await btn.click(); await page.waitForTimeout(600); }
}
await page.screenshot({ path: `${OUT}/03-lesson-question.png` });
await shot('04-exam', '#/exam', 1400);

// light theme
await page.goto(BASE + '/#/', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const themeBtn = page.locator('button[title="主題"]');
if (await themeBtn.count()) { await themeBtn.click(); await page.waitForTimeout(600); }
await page.screenshot({ path: `${OUT}/05-home-light.png` });

console.log('ERRORS:', errors.length ? errors.slice(0, 20) : 'none');
await browser.close();
