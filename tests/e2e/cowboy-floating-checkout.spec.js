'use strict';

const { test, expect } = require('@playwright/test');
const path = require('node:path');
const BASE = process.env.E2E_BASE || 'http://127.0.0.1:4180';
const OUT = process.env.E2E_OUT || path.resolve('.local', 'cta-027-evidence');
test.use({ channel: process.env.E2E_CHANNEL || undefined });

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test.describe(`CTA 1.1 — ${viewport.width}px`, () => {
    test.use({ viewport });
    test.beforeEach(async ({ page }) => {
      // Validate the local UI without sending test traffic to production trackers.
      await page.route('https://**/*', (route) => route.abort());
    });

    for (const quantity of [1, 2, 3, 4]) {
      test(`floating checkout submits kit ${quantity} and attribution`, async ({ page }) => {
        const query = 'utm_source=validacao&utm_campaign=CTA_027&cid=76324699889';
        await page.goto(`${BASE}/v1-1?${query}`);
        const floating = page.locator('[data-floating-checkout]');
        await expect(floating).toBeHidden();
        const kit = page.locator('.kit').filter({ has: page.locator(`input[value="${quantity}"]`) });
        await kit.click();
        await expect(page.locator('[data-selected-kit]')).toHaveText(`${quantity} ${quantity === 1 ? 'frasco selecionado' : 'frascos selecionados'}`);
        // Keep the original CTA outside the viewport to exercise the floating button.
        await page.locator('#t-kit').scrollIntoViewIfNeeded();
        await expect(floating).toBeVisible();
        await expect(page.locator('[data-floating-checkout-button]')).toHaveText('Quero começar minha rotina');
        const request = page.waitForRequest((req) => new URL(req.url()).pathname === '/api/checkout');
        await page.route('**/api/checkout?**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<p>Checkout verificado localmente</p>' }));
        await page.locator('[data-floating-checkout-button]').click();
        const destination = new URL((await request).url());
        expect(destination.searchParams.get('quantity')).toBe(String(quantity));
        expect(destination.searchParams.get('utm_source')).toBe('validacao');
        expect(destination.searchParams.get('utm_campaign')).toBe('CTA_027');
        expect(destination.searchParams.get('cid')).toBe('76324699889');
      });
    }

    test('keeps original CTA and prior version intact', async ({ page }) => {
      await page.goto(`${BASE}/v1-1`);
      await page.locator('.kit').filter({ has: page.locator('input[value="2"]') }).click();
      await page.locator('#t-kit').scrollIntoViewIfNeeded();
      await expect(page.locator('[data-floating-checkout]')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
      await page.screenshot({ path: path.join(OUT, `floating-${viewport.width}.png`) });
      await page.locator('[data-checkout-button]').scrollIntoViewIfNeeded();
      await expect(page.locator('[data-floating-checkout]')).toBeHidden();
      await expect(page.locator('[data-checkout-button]')).toBeVisible();
      await page.goto(`${BASE}/v1-0`);
      await expect(page.locator('[data-floating-checkout]')).toHaveCount(0);
      await expect(page.locator('[data-checkout-button]')).toHaveCount(1);
      await expect(page.locator('.kit')).toHaveCount(4);
      await expect(page.locator('#relatos video')).toHaveCount(2);
    });

    test('keyboard selection works and unavailable kit cannot use floating checkout', async ({ page }) => {
      await page.route('**/api/config', async (route) => {
        const response = await route.fetch();
        const config = await response.json();
        config.variants = config.variants.map((variant) => ({ ...variant, checkoutAvailable: variant.quantity !== 4 }));
        await route.fulfill({ response, json: config });
      });
      await page.goto(`${BASE}/v1-1`);
      await page.locator('.kit').filter({ has: page.locator('input[value="2"]') }).click();
      await page.keyboard.press('ArrowLeft');
      await expect(page.locator('input[value="1"]')).toBeChecked();
      await page.locator('#t-kit').scrollIntoViewIfNeeded();
      await expect(page.locator('[data-floating-checkout]')).toBeVisible();
      await page.locator('.kit').filter({ has: page.locator('input[value="4"]') }).click();
      await expect(page.locator('[data-checkout-button]')).toBeDisabled();
      await expect(page.locator('[data-floating-checkout]')).toBeHidden();
      await expect(page.locator('[data-checkout-status]')).toContainText('indisponível');
    });
  });
}
