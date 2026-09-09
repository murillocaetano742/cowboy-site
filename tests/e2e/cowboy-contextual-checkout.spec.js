'use strict';

const { test, expect } = require('@playwright/test');
const path = require('node:path');
const BASE = process.env.E2E_BASE || 'http://127.0.0.1:4198';
const OUT = process.env.E2E_OUT || path.resolve('.local', 'cta-028-evidence');

test.use({ channel: process.env.E2E_CHANNEL || undefined, reducedMotion: 'reduce' });

async function scrollKitsTo(page, edge, target) {
  await page.locator('.kits').evaluate((element, position) => {
    const box = element.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + box[position.edge] - position.target, behavior: 'instant' });
  }, { edge, target });
}

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test.describe(`CTA 1.2 — ${viewport.width}px`, () => {
    test.use({ viewport });
    test.beforeEach(async ({ page }) => {
      // Local verification must never send simulated purchases to external trackers.
      await page.route('https://**/*', (route) => route.abort());
    });

    test('appears on reaching products without a click, leaves both boundaries and returns', async ({ page }) => {
      await page.goto(`${BASE}/v1-2`);
      const floating = page.locator('[data-floating-checkout]');
      const menu = page.locator('[data-pill]');
      await expect(floating).toBeHidden();
      await scrollKitsTo(page, 'top', viewport.height + 10);
      await expect(floating).toBeHidden();
      if (viewport.width < 900) await expect(menu).toBeVisible();

      await scrollKitsTo(page, 'top', viewport.height - 120);
      await expect(floating).toBeVisible();
      await expect(page.locator('input[value="2"]')).toBeChecked();
      await expect(page.locator('[data-floating-checkout-button]')).toHaveText('Continuar para a compra');
      await expect(menu).toBeHidden();

      await scrollKitsTo(page, 'top', 110);
      await expect(floating).toBeVisible();
      await expect(menu).toBeHidden();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
      await page.screenshot({ path: path.join(OUT, `products-${viewport.width}.png`) });

      const headerBottom = await page.locator('.header').evaluate(e => e.getBoundingClientRect().bottom);
      await scrollKitsTo(page, 'bottom', headerBottom + 10);
      await expect(floating).toBeVisible();
      await scrollKitsTo(page, 'bottom', headerBottom - 10);
      await expect(floating).toBeHidden();
      if (viewport.width < 900) await expect(menu).toBeVisible();
      await page.screenshot({ path: path.join(OUT, `after-products-${viewport.width}.png`) });

      await scrollKitsTo(page, 'bottom', headerBottom + 120);
      await expect(floating).toBeVisible();
      await expect(menu).toBeHidden();
      await scrollKitsTo(page, 'top', viewport.height + 10);
      await expect(floating).toBeHidden();
      if (viewport.width < 900) await expect(menu).toBeVisible();
    });

    for (const quantity of [1, 2, 3, 4]) {
      test(`submits kit ${quantity} and attribution through the native form`, async ({ page }) => {
        await page.goto(`${BASE}/v1-2?utm_source=validacao&utm_campaign=CTA_028&cid=76324699889`);
        await page.locator('.kit').filter({ has: page.locator(`input[value="${quantity}"]`) }).click();
        await scrollKitsTo(page, 'top', 110);
        await expect(page.locator('[data-floating-checkout]')).toBeVisible();
        const request = page.waitForRequest(req => new URL(req.url()).pathname === '/api/checkout');
        await page.route('**/api/checkout?**', route => route.fulfill({ status: 200, contentType: 'text/html', body: '<p>Checkout verificado localmente</p>' }));
        await page.locator('[data-floating-checkout-button]').click();
        const destination = new URL((await request).url());
        expect(destination.searchParams.get('quantity')).toBe(String(quantity));
        expect(destination.searchParams.get('utm_source')).toBe('validacao');
        expect(destination.searchParams.get('utm_campaign')).toBe('CTA_028');
        expect(destination.searchParams.get('cid')).toBe('76324699889');
      });
    }

    test('preserves the original CTA and both published versions', async ({ page }) => {
      await page.goto(`${BASE}/v1-2`);
      // Align the original button near the top: on a tall desktop viewport,
      // scrollIntoViewIfNeeded can leave the final product card in view as well.
      await page.locator('[data-checkout-button]').evaluate(element => {
        window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top - 100, behavior: 'instant' });
      });
      await expect(page.locator('[data-checkout-button]')).toHaveText('Quero começar minha rotina');
      await expect(page.locator('[data-floating-checkout]')).toBeHidden();
      await page.goto(`${BASE}/v1-1`);
      await expect(page.locator('[data-floating-checkout]')).toBeHidden();
      await scrollKitsTo(page, 'top', 110);
      await expect(page.locator('[data-floating-checkout]')).toBeHidden();
      await page.locator('.kit').filter({ has: page.locator('input[value="2"]') }).click();
      await page.locator('#t-kit').scrollIntoViewIfNeeded();
      await expect(page.locator('[data-floating-checkout]')).toBeVisible();
      await expect(page.locator('[data-floating-checkout-button]')).toHaveText('Quero começar minha rotina');
      await page.goto(`${BASE}/v1-0`);
      await expect(page.locator('[data-floating-checkout]')).toHaveCount(0);
      await expect(page.locator('.kit')).toHaveCount(4);
      await expect(page.locator('#relatos video')).toHaveCount(2);
    });

    test('handles keyboard, unavailable kits and viewport resizing', async ({ page }) => {
      await page.route('**/api/config', async route => {
        const response = await route.fetch();
        const config = await response.json();
        config.variants = config.variants.map(variant => ({ ...variant, checkoutAvailable: variant.quantity !== 4 }));
        await route.fulfill({ response, json: config });
      });
      await page.goto(`${BASE}/v1-2`);
      await page.locator('.kit').filter({ has: page.locator('input[value="2"]') }).click();
      await page.keyboard.press('ArrowLeft');
      await expect(page.locator('input[value="1"]')).toBeChecked();
      await scrollKitsTo(page, 'top', 110);
      await expect(page.locator('[data-floating-checkout]')).toBeVisible();
      await page.setViewportSize({ width: viewport.width, height: viewport.height - 150 });
      await expect(page.locator('[data-floating-checkout]')).toBeVisible();
      await page.locator('.kit').filter({ has: page.locator('input[value="4"]') }).click();
      await expect(page.locator('[data-checkout-button]')).toBeDisabled();
      await expect(page.locator('[data-floating-checkout]')).toBeHidden();
      await page.locator('.kit').filter({ has: page.locator('input[value="3"]') }).click();
      await expect(page.locator('[data-floating-checkout]')).toBeVisible();
    });

    if (viewport.width < 900) {
      test('chapter menu can navigate to products and is then replaced by the buy button', async ({ page }) => {
        await page.goto(`${BASE}/v1-2`);
        await page.locator('#t-garantia').scrollIntoViewIfNeeded();
        await page.locator('[data-pill-open]').click();
        await expect(page.locator('[data-sheet]')).toBeVisible();
        await expect(page.locator('[data-floating-checkout]')).toBeHidden();
        await page.locator('[data-sheet]').getByRole('link', { name: '6 Escolher kit', exact: true }).click();
        await expect(page.locator('[data-sheet]')).toBeHidden();
        await scrollKitsTo(page, 'top', 110);
        await expect(page.locator('[data-floating-checkout]')).toBeVisible();
        await expect(page.locator('[data-pill]')).toBeHidden();
      });
    }
  });
}
