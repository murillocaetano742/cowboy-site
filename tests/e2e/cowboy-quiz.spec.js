'use strict';

const { test, expect } = require('@playwright/test');

const BASE = process.env.E2E_BASE || 'http://127.0.0.1:4397';
const QUERY = '?utm_source=validation&utm_medium=qa&utm_campaign=QUIZ_037&cid=quiz_fixture';

test.use({ channel: process.env.E2E_CHANNEL || undefined, reducedMotion: 'reduce' });

async function isolate(page) {
  const errors = [];
  const failures = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith(BASE) && response.status() >= 400) failures.push(response.url());
  });
  // No analytics collection, checkout navigation, remote APIs or orders.
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin === new URL(BASE).origin && url.pathname !== '/api/checkout') return route.continue();
    return route.fulfill({ status: 204 });
  });
  return { errors, failures };
}

async function verifyScreen(page) {
  const main = page.locator('main[data-stage]');
  await expect(main).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  const images = main.locator('img:visible');
  for (let index = 0; index < await images.count(); index += 1) {
    const image = images.nth(index);
    if (await image.getAttribute('loading') === 'lazy') continue;
    await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
  }
}

for (const width of [375, 390]) {
  test(`quiz mobile ${width}: primeiras telas, fluxo completo e kits`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width === 375 ? 812 : 844 });
    const diagnostics = await isolate(page);
    await page.goto(BASE + '/quiz/v1-direto/' + QUERY);
    const main = page.locator('main[data-stage]');
    await expect(main).toHaveAttribute('data-stage', 'intro');
    for (let screen = 1; screen <= 3; screen += 1) {
      await verifyScreen(page);
      await page.screenshot({ path: testInfo.outputPath(`intro-${screen}-${width}.png`), fullPage: true });
      const before = await main.locator('h2').textContent();
      await main.locator('button.cb-option').first().click();
      await expect.poll(() => main.evaluate(element => element.querySelector('h2')?.textContent || '')).not.toBe(before);
    }
    await expect(main).toHaveAttribute('data-stage', 'explanation');
    await verifyScreen(page);
    await main.locator('button.cb-btn').click();
    for (let transition = 0; transition < 20; transition += 1) {
      const stage = await main.getAttribute('data-stage');
      if (stage === 'precheckout') break;
      await verifyScreen(page);
      if (stage === 'testimonials' || stage === 'analyzing') {
        await expect(main).not.toHaveAttribute('data-stage', stage, { timeout: 10000 });
      } else {
        const before = await main.locator('h2').textContent();
        if (stage === 'weight_kg') await main.locator('button.cb-btn').click();
        else await main.locator('button.cb-option, button.cb-option-selected').first().click();
        await expect.poll(() => main.evaluate(element => element.querySelector('h2')?.textContent || '')).not.toBe(before);
      }
    }
    await expect(main).toHaveAttribute('data-stage', 'precheckout');
    await verifyScreen(page);
    await page.screenshot({ path: testInfo.outputPath(`oferta-${width}.png`), fullPage: true });
    const group = page.getByRole('group', { name: 'Kits disponíveis' });
    for (const quantity of [1, 2, 3]) {
      const kit = group.locator('button').filter({ hasText: new RegExp(`${quantity} frascos?`) });
      await kit.click();
      await expect(kit).toHaveAttribute('aria-pressed', 'true');
      const cta = main.locator('a.bluue-finish-button, form[data-checkout-form]');
      const href = await cta.getAttribute('href');
      if (href) {
        // Run the actual React click handler, then cancel the browser default.
        await page.evaluate(() => window.addEventListener('click', event => event.preventDefault(), { once: true }));
        await cta.click();
        const url = new URL(await cta.getAttribute('href'), BASE);
        expect(url.pathname).toBe('/api/checkout');
        expect(url.searchParams.get('quantity')).toBe(String(quantity));
        expect(url.searchParams.get('utm_source')).toBe('validation');
        expect(url.searchParams.get('utm_campaign')).toBe('QUIZ_037');
        expect(url.searchParams.get('cid')).toBe('quiz_fixture');
      } else {
        await expect(cta.locator('[name="quantity"]')).toHaveValue(String(quantity));
        await expect(cta.locator('[name="utm_source"]')).toHaveValue('validation');
        await expect(cta.locator('[name="utm_campaign"]')).toHaveValue('QUIZ_037');
        await expect(cta.locator('[name="cid"]')).toHaveValue('quiz_fixture');
      }
    }
    expect(diagnostics.errors).toEqual([]);
    expect(diagnostics.failures).toEqual([]);
    expect(page.url()).toContain('/quiz/v1-direto/');
  });
}
