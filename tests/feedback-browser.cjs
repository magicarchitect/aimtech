// Run: PLAYWRIGHT_MODULE=/path/to/playwright node tests/feedback-browser.cjs
// Every submission is intercepted; this never calls the real feedback function.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.FEEDBACK_TEST_URL || 'http://127.0.0.1:8767';
const out = process.env.FEEDBACK_TEST_REPORT || '/tmp/aimtech-feedback-browser';
fs.mkdirSync(out, { recursive: true });
(async () => {
 const browser = await chromium.launch({ headless: true });
 const results = [];
 for (const lang of ['es', 'ca']) for (const mobile of [false, true]) {
  const context = await browser.newContext({ viewport: mobile ? { width: 375, height: 812 } : { width: 1440, height: 900 }, hasTouch: mobile, isMobile: mobile });
  const page = await context.newPage(); const errors = [], submissions = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/.netlify/functions/feedback', async route => {
   submissions.push(route.request().postDataJSON());
   await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await page.goto(base + (lang === 'ca' ? '/ca/feedback/' : '/feedback/'));
  await page.locator('.is-active [data-next]').click();
  await page.locator('label.fb-option').first().click();
  await page.waitForSelector('[data-step="empresa"].is-active');
  await page.locator('[name="empresa"]').fill('TEST DOUBLE — NO SUBMISSION');
  await page.keyboard.press('Enter');
  await page.waitForSelector('[data-step="calidad"].is-active');
  const choose = async (name, value) => {
   const label = page.locator(`.fb-star:has(input[name="${name}"][value="${value}"])`);
   if (mobile) await label.tap(); else await label.click();
   await page.mouse.move(0, 0);
   assert.equal(await page.locator(`input[name="${name}"]:checked`).inputValue(), String(value));
   assert.equal(await page.locator(`[data-step="${name}"] .fb-rating-value`).textContent(), String(value).replace('.', ',') + ' / 5');
  };
  // Mouse hover previews a half without selecting it; pointer leave restores.
  if (!mobile) {
   await page.locator('.fb-star:has(input[name="calidad"][value="4.5"])').hover();
   assert.equal(await page.locator('[data-step="calidad"] [data-star="5"]').evaluate(el => el.style.getPropertyValue('--fill')), '50%');
   assert.equal(await page.locator('input[name="calidad"]:checked').count(), 0);
   await page.mouse.move(0, 0);
  }
  await choose('calidad', 3.5);
  assert.deepEqual(await page.locator('[data-step="calidad"] .fb-star-slot').evaluateAll(els => els.map(el => el.style.getPropertyValue('--fill'))), ['100%', '100%', '100%', '50%', '0%']);
  // Native arrows visit every half step, retain focus, and do not auto-advance.
  await page.locator('input[name="calidad"][value="3.5"]').focus();
  await page.keyboard.press('1');
  const visited = [];
  for (let i = 0; i < 9; i++) {
   visited.push(Number(await page.locator('input[name="calidad"]:checked').inputValue()));
   if (i < 8) await page.keyboard.press('ArrowRight');
  }
  assert.deepEqual(visited, [1,1.5,2,2.5,3,3.5,4,4.5,5]);
  for (let i=0;i<3;i++) await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(600);
  assert.equal(await page.locator('.fb-step.is-active').getAttribute('data-step'), 'calidad');
  assert.equal(await page.locator('input[name="calidad"]:checked').inputValue(), '3.5');
  assert.equal(await page.locator('.fb-star:has(input[name="calidad"]:checked)').evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
  await page.screenshot({ path: `${out}/${lang}-${mobile ? 'mobile' : 'desktop'}-half.png` });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.locator('.is-active [data-next]').click();
  await page.waitForSelector('[data-step="instructor"].is-active');
  await choose('instructor', 4.5);
  await page.locator('.is-active [data-next]').click();
  await page.waitForSelector('[data-step="materiales"].is-active');
  await choose('materiales', 2.5);
  await page.locator('.is-active [data-next]').click();
  await page.waitForSelector('[data-step="mejoras"].is-active');
  await page.locator('.is-active [data-next]').click();
  await page.waitForSelector('[data-step="identidad"].is-active');
  await page.locator('.is-active [data-next]').click();
  await page.waitForSelector('[data-step="fin"].is-active');
  assert.equal(submissions.length, 1);
  const p = submissions[0];
  assert.deepEqual([p.calidad,p.instructor,p.materiales], [3.5,4.5,2.5]);
  assert.equal(p.lang, lang); assert.deepEqual(errors, []);
  results.push({ lang, mobile, visited, ratings: [p.calidad,p.instructor,p.materiales], mockSubmission: true, errors, overflow: false });
  fs.writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 2));
  await context.close();
 }
 await browser.close(); console.log(JSON.stringify(results,null,2));
})().catch(e => { console.error(e); process.exit(1); });
