import { chromium } from 'playwright';
const BASE = 'http://localhost:4173';
const OUT = '/tmp/claude-0/-home-user-Chapter-8/169dd050-0012-548e-9981-d0200d81b81d/scratchpad';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 460, height: 920 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));

// Test 1: checkpoint fill question (u1cp) -> answer -1/8
await page.goto(`${BASE}/#/lesson/u1cp`, { waitUntil: 'networkidle' });
await page.waitForTimeout(900);
await page.locator('input').first().fill('-1/8');
await page.locator('button', { hasText: '檢查' }).click();
await page.waitForTimeout(700);
const verdict1 = await page.locator('text=答對了').count();
await page.screenshot({ path: `${OUT}/30-fill-correct.png` });
console.log('fill -1/8 correct?', verdict1 > 0);

// Test 2: exam -> answer everything correctly, submit
await page.goto(`${BASE}/#/exam`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
// TF answers in order: false,true,false,true,true,true,false
const tf = [false, true, false, true, true, true, false];
// each TF card has 正確 / 錯誤 buttons; collect cards by question blocks is complex,
// simpler: click buttons by walking all 正確/錯誤 pairs in order.
const correctBtns = page.locator('button', { hasText: '正確' });
const wrongBtns = page.locator('button', { hasText: '錯誤' });
for (let i = 0; i < tf.length; i++) {
  if (tf[i]) await correctBtns.nth(i).click();
  else await wrongBtns.nth(i).click();
}
const fills = page.locator('input');
const fc = await fills.count();
const ans = ['-1/8', '1/3', '1/2', '-4', '2', '-34/3', '17/2', '182/3', '1/5', '1', 'k<-4 或 k>0', '-1', '43', '9'];
for (let i = 0; i < fc; i++) await fills.nth(i).fill(ans[i] ?? '0');
// matching: select 圖1->C, 圖2->E, 圖3->H
const leftBtns = page.locator('button', { hasText: '點此選擇' });
const lc = await leftBtns.count();
const pairTargets = ['C', 'E', 'H'];
for (let i = 0; i < lc; i++) {
  await leftBtns.nth(0).click(); // re-query each time as labels change
  await page.waitForTimeout(150);
  await page.locator(`button:has-text("${pairTargets[i]}")`).last().click();
  await page.waitForTimeout(150);
}
await page.locator('button', { hasText: '交卷並看成績' }).click();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/31-exam-scored.png` });
const banner = await page.locator('text=分').first().textContent().catch(() => '');
console.log('exam banner:', banner);
console.log('ERRORS:', errs.length ? errs : 'none');
await b.close();
