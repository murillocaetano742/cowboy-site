'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const BASE = process.env.E2E_BASE || 'http://127.0.0.1:4209';
const ORIGIN = 'https://cowboyenergiamasculina.com.br';
const GOOGLE_TAG_FIXTURE = process.env.GOOGLE_TAG_FIXTURE;

test.use({ channel: process.env.E2E_CHANNEL || undefined, reducedMotion: 'reduce' });

for (const buttonName of ['Quero começar minha rotina', 'Continuar para a compra']) {
test(`Google linker reaches checkout via ${buttonName}`, async ({ page }) => {
  test.skip(!GOOGLE_TAG_FIXTURE, 'Requires a local copy of the public Google SDK; see GA4-029.');
  let firstHop;
  let checkoutDestination;
  if (buttonName === 'Continuar para a compra') await page.setViewportSize({ width: 390, height: 844 });
  const diagnostics = [];
  page.on('request', request => diagnostics.push('request ' + new URL(request.url()).origin + new URL(request.url()).pathname));
  page.on('pageerror', error => diagnostics.push('pageerror ' + error.message));
  page.on('requestfailed', request => diagnostics.push('failed ' + request.failure()?.errorText));
  // Exercise the real public Google SDK with local page/API responses. All
  // analytics collection and other third-party requests are intercepted: no
  // test events, purchases, or personal data are sent to analytics providers.
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname === 'www.googletagmanager.com' && url.pathname === '/gtag/js') {
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(GOOGLE_TAG_FIXTURE, 'utf8') });
    }
    if (['cowboyenergiamasculina.com.br', 'www.cowboyenergiamasculina.com.br'].includes(url.hostname)) {
      const local = BASE + url.pathname + url.search;
      if (url.pathname === '/api/checkout') {
        firstHop = url;
        const response = await route.fetch({ url: local, maxRedirects: 0 });
        checkoutDestination = new URL(response.headers().location);
        return route.fulfill({ status: 200, contentType: 'text/html', body: '<p>Checkout verificado localmente</p>' });
      }
      const response = await route.fetch({ url: local });
      return route.fulfill({ response });
    }
    return route.fulfill({ status: 204 });
  });
  const googleInitialized = page.waitForRequest(request => {
    const url = new URL(request.url());
    return url.pathname === '/g/collect' && (url.hostname === 'analytics.google.com' || url.hostname.endsWith('google-analytics.com'));
  }, { timeout: 15000 }).catch(() => { throw new Error(diagnostics.join('\n')); });
  await page.goto(ORIGIN + '/?utm_source=validation&utm_campaign=GA4_029&cid=validation');
  await googleInitialized;
  const form = page.locator('[data-checkout-form]');
  await expect(form).toHaveAttribute('action', 'https://www.cowboyenergiamasculina.com.br/api/checkout');
  if (buttonName === 'Continuar para a compra') {
    await page.locator('.kit').filter({ has: page.locator('input[value="2"]') }).click();
  }
  await page.getByRole('button', { name: buttonName, exact: true }).click();
  await expect(page.getByText('Checkout verificado localmente')).toBeVisible();
  expect(firstHop.hostname).toBe('www.cowboyenergiamasculina.com.br');
  const linker = firstHop.searchParams.get('_gl');
  expect(linker).toMatch(/^1\*[^*]+\*/);
  expect(checkoutDestination.searchParams.get('_gl')).toBe(linker);
  expect(checkoutDestination.hostname).toBe('cowboy-energia.mycartpanda.com');
  expect(checkoutDestination.pathname).toBe('/checkout/211742746:1');
  expect(checkoutDestination.searchParams.get('utm_campaign')).toBe('GA4_029');
  expect(checkoutDestination.searchParams.get('cid')).toBe('validation');
});
}
