'use strict';

// Manual public-checkout QA. No login, customer data, order or payment submission.
// Theme assets are fulfilled from this worktree; the checkout and prices stay real.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('@playwright/test');
const { APPMAX_PUBLIC_CHECKOUT_URLS } = require('#commerce');

const ROOT = path.resolve(__dirname, '../..');
const LIVE = process.argv.includes('--live');
const OUT = path.join(ROOT, '.local', 'com-036-qa', LIVE ? 'live' : '');
const ORIGIN = 'https://cowboyenergiamasculina.com.br';
const JS = `${ORIGIN}/assets/js/cowboy-appmax.js?v=20260917-1`;
const THEME_PATHS = new Map([
  ['/assets/css/cowboy-appmax.css', ['assets/css/cowboy-appmax.css', 'text/css']],
  ['/assets/js/cowboy-appmax.js', ['assets/js/cowboy-appmax.js', 'application/javascript']],
]);
const READ_ONLY_PRICE_PATHS = new Set(['/one-checkout/check-price-pix', '/one-checkout/check-price-boleto']);
const CHECKOUT_PATHS = new Set(Object.values(APPMAX_PUBLIC_CHECKOUT_URLS).map((url) => new URL(url).pathname));
const EXPECTED = {
  1: { first: '1 x R$ 106,65', last: '12 x R$ 11,54', freight: '26,75' },
  2: { first: '1 x R$ 154,80', last: '12 x R$ 16,75', freight: '0,00' },
  3: { first: '1 x R$ 199,90', last: '12 x R$ 21,64', freight: '0,00' },
};

function tracking(url) {
  return /utmify|google-analytics|googletagmanager|facebook|newrelic|nr-data|recaptcha/i.test(url.hostname + url.pathname)
    || /\/tracking\/|cowboy-(?:google|pixel)\.js/.test(url.pathname);
}

async function snapshot(page) {
  return page.evaluate(() => {
    const clean = (value) => value.replace(/\s+/g, ' ').trim();
    const visible = (element) => Boolean(element.getClientRects().length) && getComputedStyle(element).visibility !== 'hidden';
    const customer = document.querySelector('#form-customer');
    return {
      customerAction: customer.action,
      customerMethod: customer.method,
      formContracts: [...document.querySelectorAll('form')].map((form) => ({ id: form.id, action: form.action, method: form.method, onsubmit: form.getAttribute('onsubmit') })),
      populatedCustomerFields: [...customer.querySelectorAll('input[type=text],input[type=email],input[type=tel]')].filter((element) => element.value).length,
      installments: [...document.querySelectorAll('#installments option')].map((element) => clean(element.textContent)),
      selectedInstallment: document.querySelector('#installments').value,
      freight: [...document.querySelectorAll('#form-creditcard .form-check-label')].map((element) => clean(element.textContent)),
      submits: [...document.querySelectorAll('input[type=submit],button[type=submit]')].map((element) => ({
        id: element.id, type: element.type, disabled: element.disabled, text: element.value || clean(element.textContent),
      })),
      visibleErrors: [...document.querySelectorAll('.invalid-feedback,.alert-danger,[role=alert]')].filter(visible).map((element) => clean(element.textContent)),
    };
  });
}

async function waitForActivePane(page, paneId = 'creditcard') {
  await page.waitForFunction((id) => {
    const pane = document.getElementById(id);
    return pane && pane.classList.contains('active') && Number(getComputedStyle(pane).opacity) === 1
      && !pane.getAnimations().some((animation) => animation.playState === 'running');
  }, paneId, { timeout: 5000 });
}

async function paymentPresentation(page) {
  return page.locator('#form-creditcard').evaluate((element) => {
    const result = [];
    for (let node = element; node; node = node.parentElement) result.push({ tag: node.tagName, id: node.id, opacity: getComputedStyle(node).opacity, pointerEvents: getComputedStyle(node).pointerEvents });
    return result;
  });
}

async function verifyTabs(page) {
  const results = [];
  for (const [id, target] of [['home-tab-creditcard', '#number'], ['home-tab-boleto', '#cpfboleto'], ['home-tab-pix', '#getQrCode']]) {
    const tab = page.locator(`#${id}`);
    await tab.focus();
    await page.keyboard.press('Enter');
    await page.locator(target).waitFor({ state: 'visible' });
    await waitForActivePane(page, id.replace('home-tab-', ''));
    assert.equal(await tab.getAttribute('aria-selected'), 'true', `${id}: native tab must activate with Enter`);
    results.push({ id, keyboardActivated: true, targetVisible: true });
  }
  await page.locator('#home-tab-creditcard').focus();
  await page.keyboard.press('Enter');
  await waitForActivePane(page);
  const tabOrder = [];
  await page.locator('#firstname').focus();
  for (let index = 0; index < 18; index += 1) {
    tabOrder.push(await page.evaluate(() => document.activeElement.id));
    await page.keyboard.press('Tab');
  }
  for (const id of ['home-tab-creditcard', 'home-tab-boleto', 'home-tab-pix']) assert.ok(tabOrder.includes(id), `${id}: reachable with Tab`);
  return { results, tabOrder };
}

async function scenario(browser, quantity, viewport) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: 900 }, locale: 'pt-BR', serviceWorkers: 'block' });
  const blocked = new Set();
  const priceQueries = new Set();
  const errors = [];
  const themeResponses = [];
  try {
    await context.route('**/*', async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      const asset = url.origin === ORIGIN ? THEME_PATHS.get(url.pathname) : null;
      if (asset && ['GET', 'HEAD'].includes(request.method())) {
        if (LIVE) return route.continue();
        return route.fulfill({ status: 200, contentType: asset[1], body: fs.readFileSync(path.join(ROOT, asset[0])) });
      }
      const own = url.hostname === 'cowboyenergia.carrinho.app';
      const priceQuery = own && request.method() === 'POST' && READ_ONLY_PRICE_PATHS.has(url.pathname);
      const media = ['image', 'font', 'stylesheet'].includes(request.resourceType());
      const ownRead = own && ['GET', 'HEAD'].includes(request.method()) && (
        (CHECKOUT_PATHS.has(url.pathname) && request.resourceType() === 'document')
        || (/^\/(?:checkout-public|assets)\//.test(url.pathname) && ['script', 'stylesheet', 'image', 'font'].includes(request.resourceType()))
      );
      if (tracking(url) || (own ? !ownRead && !priceQuery : !['GET', 'HEAD'].includes(request.method()) || !media)) {
        blocked.add(`${request.method()} ${url.hostname}${url.pathname}`);
        return route.abort();
      }
      if (priceQuery) priceQueries.add(url.pathname);
      return route.continue();
    });
    const page = await context.newPage();
    page.on('pageerror', (error) => errors.push({ message: error.message, theme: Boolean(error.stack && error.stack.includes('cowboy-appmax.js')) }));
    page.on('response', (response) => {
      const url = new URL(response.url());
      if (url.origin === ORIGIN && THEME_PATHS.has(url.pathname)) themeResponses.push({ path: url.pathname, status: response.status() });
    });
    await page.goto(APPMAX_PUBLIC_CHECKOUT_URLS[quantity], { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.locator('#installments option').last().waitFor({ state: 'attached' });
    await page.waitForTimeout(1500);
    await waitForActivePane(page);
    const before = await snapshot(page);
    const baselinePaymentOpacity = await paymentPresentation(page);
    assert.equal(before.installments[0], EXPECTED[quantity].first);
    assert.equal(before.installments.at(-1), EXPECTED[quantity].last);
    assert.ok(before.freight.some((text) => text.includes(EXPECTED[quantity].freight)));
    assert.equal(before.populatedCustomerFields, 0);

    if (!LIVE) await page.addScriptTag({ url: JS });
    await page.waitForFunction(() => document.body.classList.contains('cowboy-appmax'));
    await page.evaluate(async () => {
      await document.fonts.load('500 16px "Cowboy Checkout Manrope"');
      await document.fonts.load('500 16px "Cowboy Checkout Oswald"');
      await document.fonts.ready;
    });
    await page.waitForFunction(() => {
      const image = document.querySelector('body > .container-fluid > .card.mt-4.mb-4 img');
      return image && image.complete && image.naturalWidth > 0;
    }, undefined, { timeout: 15000 });
    const after = await snapshot(page);
    assert.deepEqual(after, before, 'Theme must preserve real prices, form action, controls and visible errors');
    const layout = await page.evaluate(() => ({
      viewport: innerWidth, width: document.documentElement.scrollWidth,
      bodyBackgroundColor: getComputedStyle(document.body).backgroundColor,
      inputFont: parseFloat(getComputedStyle(document.querySelector('#firstname')).fontSize),
      fonts: [...document.fonts].filter((font) => font.family.includes('Cowboy Checkout')).map((font) => ({ family: font.family, status: font.status })),
      image: (() => { const image = document.querySelector('body > .container-fluid > .card.mt-4.mb-4 img'); return { src: image.src, alt: image.alt, loaded: image.complete && image.naturalWidth > 0 }; })(),
    }));
    assert.ok(layout.width <= layout.viewport + 1, 'No horizontal overflow');
    assert.equal(layout.bodyBackgroundColor, 'rgb(10, 10, 10)', 'Theme background overrides native bg-light');
    assert.ok(layout.inputFont >= 16, 'Readable mobile input font');
    assert.equal(layout.fonts.length, 2);
    assert.ok(layout.fonts.every((font) => font.status === 'loaded'), 'Both public fonts load cross-origin');
    assert.ok(layout.image.loaded, 'Real kit image loads');
    assert.ok(layout.image.alt.includes(String(quantity)), 'Kit image identifies its bottle count');
    const publicKitImage = /\/imagens\/v5\/kit-(\d)\.webp$/.exec(new URL(layout.image.src).pathname);
    if (publicKitImage) assert.equal(Number(publicKitImage[1]), quantity, 'Public fallback must show the selected kit');
    assert.equal(await page.locator('#cowboy-appmax-header').count(), 1, 'One theme header');
    const installed = await page.evaluate(() => ({
      styles: [...document.querySelectorAll('link[rel=stylesheet][href]')].filter((element) => new URL(element.href).pathname === '/assets/css/cowboy-appmax.css').length,
      scripts: [...document.querySelectorAll('script[src]')].filter((element) => new URL(element.src).pathname === '/assets/js/cowboy-appmax.js').length,
    }));
    assert.equal(installed.styles, 1, 'One theme stylesheet');
    assert.equal(installed.scripts, 1, 'One theme script');
    for (const assetPath of THEME_PATHS.keys()) assert.ok(themeResponses.some((response) => response.path === assetPath && response.status === 200), `${assetPath}: HTTP 200`);
    const keyboard = await verifyTabs(page);
    await page.locator('#home-tab-creditcard').focus();
    await page.keyboard.press('Enter');
    await waitForActivePane(page);
    assert.deepEqual(await snapshot(page), before, 'Switching native tabs must preserve the commercial snapshot');
    const focusedTab = await page.locator('#home-tab-creditcard').evaluate((element) => ({ html: element.outerHTML, color: getComputedStyle(element).color, backgroundColor: getComputedStyle(element).backgroundColor, outlineStyle: getComputedStyle(element).outlineStyle }));
    assert.equal(focusedTab.color, 'rgb(75, 54, 16)', 'Focused active tab remains readable');
    const paymentOpacity = await paymentPresentation(page);
    assert.deepEqual(paymentOpacity, baselinePaymentOpacity, 'Native opacity and pointer-events remain unchanged after the fade');
    await page.locator('#cowboy-appmax-header').scrollIntoViewIfNeeded();
    const prefix = path.join(OUT, `kit-${quantity}-${viewport.name}`);
    await page.screenshot({ path: `${prefix}-full.png`, fullPage: true });
    await page.locator('body > .container-fluid > .card.mt-4.mb-4').screenshot({ path: `${prefix}-summary.png` });
    await page.locator('#form-container > .row > .col-md-6 > .card').last().screenshot({ path: `${prefix}-payment.png` });

    // A DOM-only validation fixture checks visibility; no field is filled or submitted.
    await page.evaluate(() => {
      const input = document.querySelector('#firstname');
      input.classList.add('is-invalid');
      const error = document.createElement('div');
      error.id = 'com036-qa-error'; error.className = 'invalid-feedback'; error.textContent = 'Verificação visual de mensagem de erro';
      input.after(error);
    });
    assert.ok(await page.locator('#com036-qa-error').isVisible(), 'Validation feedback stays visible');
    const themeErrors = errors.filter((error) => error.theme);
    assert.equal(themeErrors.length, 0, 'No JavaScript errors from the theme');
    return { quantity, viewport: viewport.name, passed: true, commercial: after, layout, keyboard, focusedTab, baselinePaymentOpacity, paymentOpacity, installed, themeResponses, visibleErrorFixture: true, errors, blocked: [...blocked], priceQueries: [...priceQueries] };
  } finally {
    await context.close();
  }
}

async function run() {
  assert.ok(process.argv.slice(2).every((argument) => argument === '--live'), 'Only --live is supported; default uses local theme assets');
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const quantity of [1, 2, 3]) for (const viewport of [{ name: 'mobile', width: 375 }, { name: 'desktop', width: 1440 }]) {
      try {
        results.push(await scenario(browser, quantity, viewport));
        console.log(`PASS kit ${quantity} ${viewport.name}`);
      } catch (error) {
        results.push({ quantity, viewport: viewport.name, passed: false, error: error.message });
        console.error(`FAIL kit ${quantity} ${viewport.name}: ${error.message}`);
      }
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(path.join(OUT, 'preview-results.json'), JSON.stringify({ mode: LIVE ? 'live-native-installation' : 'local-theme-preview', checkedAt: new Date().toISOString(), results }, null, 2) + '\n');
  if (results.some((result) => !result.passed)) process.exitCode = 1;
}

if (require.main === module) run().catch((error) => { console.error(error.message); process.exitCode = 1; });
