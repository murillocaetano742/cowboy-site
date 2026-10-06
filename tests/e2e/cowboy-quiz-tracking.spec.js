'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('node:fs');

const BASE = process.env.E2E_BASE || 'http://127.0.0.1:4397';
const ORIGIN = 'https://cowboyenergiamasculina.com.br';
const PARAMS = '?utm_source=validation&utm_medium=qa&utm_campaign=QUIZ_037&cid=quiz_fixture&gbraid=braid_fixture&email=excluded%40example.test&answers=private_fixture&severity=private_fixture#private_fixture';
const GOOGLE_FIXTURE = process.env.GOOGLE_TAG_FIXTURE;
const UTM_FIXTURE = process.env.UTM_TAG_FIXTURE;
const META_FIXTURE = process.env.META_TAG_FIXTURE;
const META_CONFIG_FIXTURE = process.env.META_CONFIG_FIXTURE;
const MEASUREMENT = 'G-VYR2542XCN';
const PIXEL = '1006075098894986';

test.describe.configure({ mode: 'parallel' });
test.use({ channel: process.env.E2E_CHANNEL || undefined, viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });

async function isolate(page, { google = false, meta = false } = {}) {
  const evidence = { errors: [], requests: [], hits: [], metaHits: [], firstHop: null, destination: null };
  if (google) {
    // Page routing can miss keepalive requests during cross-origin unload.
    // Capture the real SDK transport call synchronously; never send its payload.
    page.on('console', message => {
      const prefix = '__quiz_transport__';
      if (message.text().startsWith(prefix)) evidence.hits.push(JSON.parse(message.text().slice(prefix.length)));
    });
    await page.addInitScript(() => {
      const isCollection = input => {
        try { const url = new URL(String(input), location.href); return url.pathname.includes('/collect') && /(?:google-analytics\.com|analytics\.google\.com|doubleclick\.net)$/.test(url.hostname); }
        catch { return false; }
      };
      const capture = (url, body, transport) => {
        const report = text => { console.debug('__quiz_transport__' + JSON.stringify({ url: String(url), body: text || '', transport, bodyType: Object.prototype.toString.call(body) })); return Promise.resolve(); };
        if (body instanceof Blob) return body.text().then(report);
        if (body instanceof URLSearchParams) return report(body.toString());
        if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) return report(new TextDecoder().decode(body));
        return report(typeof body === 'string' ? body : '');
      };
      const nativeFetch = window.fetch.bind(window);
      window.fetch = (input, init) => {
        const url = typeof input === 'string' || input instanceof URL ? input : input.url;
        if (isCollection(url)) {
          if (input instanceof Request && !init?.body) return input.clone().text().then(body => capture(url, body, 'fetch')).then(() => new Response(null, { status: 204 }));
          return capture(url, init?.body, 'fetch').then(() => new Response(null, { status: 204 }));
        }
        return nativeFetch(input, init);
      };
      const nativeBeacon = navigator.sendBeacon.bind(navigator);
      navigator.sendBeacon = (url, body) => {
        if (isCollection(url)) { capture(url, body, 'sendBeacon'); return true; }
        return nativeBeacon(url, body);
      };
    });
  }
  page.on('console', message => { if (message.type() === 'warning') evidence.warning = message.text(); });
  page.on('pageerror', error => evidence.errors.push(error.message));
  // Every request is routed. Third-party collection is always fulfilled locally.
  // Only our local static/API server receives traffic; no real checkout opens.
  await page.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    evidence.requests.push(url.toString());
    if (url.pathname.includes('/collect')) evidence.hits.push({ url: url.toString(), body: request.postData() || '' });
    if (url.hostname.endsWith('facebook.com') && url.pathname.startsWith('/tr')) evidence.metaHits.push({ url: url.toString(), body: request.postData() || '' });
    if (google && url.hostname === 'www.googletagmanager.com' && url.pathname === '/gtag/js') {
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(GOOGLE_FIXTURE, 'utf8') });
    }
    if (google && UTM_FIXTURE && url.hostname === 'cdn.utmify.com.br' && url.pathname === '/scripts/utms/latest.js') {
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(UTM_FIXTURE, 'utf8') });
    }
    if (meta && META_FIXTURE && url.hostname === 'connect.facebook.net' && url.pathname === '/en_US/fbevents.js') {
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(META_FIXTURE, 'utf8') });
    }
    if (meta && META_CONFIG_FIXTURE && url.hostname === 'connect.facebook.net' && url.pathname === '/signals/config/' + PIXEL) {
      if (process.env.META_REFRESH_CONFIG === '1') {
        // Read-only public SDK configuration, using its exact version/module query.
        // This is never an event-collection endpoint and carries no quiz answers.
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error(`Meta public SDK config: ${response.status}`);
        fs.writeFileSync(META_CONFIG_FIXTURE, await response.text());
      }
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(META_CONFIG_FIXTURE, 'utf8') });
    }
    if ([new URL(BASE).hostname, 'cowboyenergiamasculina.com.br', 'www.cowboyenergiamasculina.com.br'].includes(url.hostname)) {
      if (url.pathname === '/api/checkout') {
        if (!google) return route.fulfill({ status: 204 });
        evidence.firstHop = url;
        const response = await route.fetch({ url: BASE + url.pathname + url.search, maxRedirects: 0 });
        expect(response.status()).toBe(302);
        evidence.destination = new URL(response.headers().location);
        return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: '<p>Checkout verificado sem navegação externa</p>' });
      }
      if (url.origin === new URL(BASE).origin) return route.continue();
      return route.fulfill({ response: await route.fetch({ url: BASE + url.pathname + url.search }) });
    }
    return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
  });
  return evidence;
}

async function advance(page) {
  const main = page.locator('main[data-stage]');
  const stage = await main.getAttribute('data-stage');
  if (stage === 'precheckout') return false;
  if (stage === 'testimonials' || stage === 'analyzing') {
    await expect(main).not.toHaveAttribute('data-stage', stage, { timeout: 10000 });
  } else if (stage === 'explanation') {
    await main.locator('button.cb-btn').click();
    await expect(main).toHaveAttribute('data-stage', 'quiz');
  } else {
    const before = await main.locator('h2').textContent();
    if (stage === 'weight_kg') await main.locator('button.cb-btn').click();
    else await main.locator('button.cb-option, button.cb-option-selected').first().click();
    await expect.poll(() => main.evaluate(element => element.querySelector('h2')?.textContent || '')).not.toBe(before);
  }
  return true;
}

async function finishQuiz(page) {
  for (let transition = 0; transition < 20; transition += 1) if (!await advance(page)) break;
  await expect(page.locator('main[data-stage]')).toHaveAttribute('data-stage', 'precheckout');
}

async function queues(page) {
  return page.evaluate(() => ({
    google: (window.dataLayer || []).filter(entry => typeof entry.length === 'number').map(entry => Array.from(entry)),
    meta: window.fbq?.queue || [],
    storage: Object.fromEntries(Object.keys(sessionStorage).map(key => [key, sessionStorage.getItem(key)])),
  }));
}

async function clickWithoutLeaving(page) {
  const outgoing = page.waitForRequest(request => new URL(request.url()).pathname === '/api/checkout');
  await page.locator('a.bluue-finish-button').click();
  await outgoing;
}

test('tracking neutro, deduplicação ao voltar e valores dos três kits com SDK bloqueado', async ({ page }) => {
  const evidence = await isolate(page);
  await page.goto(BASE + '/quiz/v1-direto/' + PARAMS);
  await expect.poll(async () => (await queues(page)).google.filter(command => command[0] === 'event').length).toBe(2);
  expect(page.url()).not.toMatch(/email|answers|severity|private_fixture|#/);
  await advance(page);
  await page.getByRole('button', { name: 'Voltar', exact: true }).click();
  await expect(page.locator('.cb-step-active')).toHaveText('1');
  await finishQuiz(page);
  for (const quantity of [1, 2, 3]) {
    await page.getByRole('group', { name: 'Kits disponíveis' }).locator('button').filter({ hasText: new RegExp(`${quantity} frascos?`) }).click();
    const href = new URL(await page.locator('a.bluue-finish-button').getAttribute('href'), BASE);
    expect(href.pathname).toBe('/api/checkout');
    expect(href.searchParams.get('quantity')).toBe(String(quantity));
    expect(href.searchParams.get('gbraid')).toBe('braid_fixture');
    await clickWithoutLeaving(page);
    await clickWithoutLeaving(page);
  }
  const result = await queues(page);
  const events = result.google.filter(command => command[0] === 'event');
  const named = name => events.filter(command => command[1] === name).map(command => command[2]);
  expect(named('page_view')).toHaveLength(1);
  expect(named('quiz_start')).toHaveLength(1);
  expect(named('quiz_complete')).toHaveLength(1);
  expect(named('quiz_step_view').map(params => params.step_index)).toEqual(Array.from({ length: 17 }, (_, index) => index + 1));
  expect(named('view_item')).toHaveLength(1);
  expect(named('view_item')[0].value).toBe(199.9);
  for (const name of ['select_item', 'begin_checkout']) {
    expect(named(name).map(params => params.value)).toEqual([79.9, 154.8, 199.9]);
    for (const params of named(name)) {
      expect(params.currency).toBe('BRL');
      expect(params.items).toHaveLength(1);
      expect(params.items[0].quantity).toBe(1);
      expect(params.items[0].price).toBe(params.value);
    }
  }
  const allowed = new Set(['send_to', 'quiz_id', 'step_index', 'page_location', 'page_referrer', 'page_title', 'currency', 'value', 'items', 'item_list_id', 'event_callback', 'event_timeout']);
  for (const command of events) {
    expect(command[2].quiz_id).toBe('cowboy_v1_direto');
    for (const key of Object.keys(command[2])) expect(allowed.has(key), key).toBe(true);
  }
  expect(JSON.stringify(result)).not.toMatch(/private_fixture|excluded|severity|weight|question_id|answers|diabetes|infarto|gravidade|ereções|sexo/i);
  expect(result.meta[0]).toEqual(['set', 'autoConfig', false, PIXEL]);
  expect(result.meta[1]).toEqual(['init', PIXEL]);
  expect(result.meta.filter(command => command[0] === 'trackSingle').map(command => command[2])).toEqual(['PageView', 'ViewContent', 'InitiateCheckout', 'InitiateCheckout', 'InitiateCheckout']);
  const config = result.google.find(command => command[0] === 'config');
  expect(config[1]).toBe(MEASUREMENT);
  expect(config[2].send_page_view).toBe(false);
  expect(config[2].allow_google_signals).toBe(false);
  expect(config[2].allow_ad_personalization_signals).toBe(false);
  expect(evidence.requests.some(url => url.includes('/scripts/pixel/'))).toBe(false);
  expect(evidence.errors).toEqual([]);
  expect(evidence.firstHop).toBeNull();
});

for (const preference of ['GPC', 'GA opt-out']) {
  test(`${preference}: nenhum script externo nem evento, checkout continua funcional`, async ({ page }) => {
    const evidence = await isolate(page);
    await page.addInitScript(preference => {
      if (preference === 'GPC') Object.defineProperty(navigator, 'globalPrivacyControl', { get: () => true });
      else window['ga-disable-G-VYR2542XCN'] = true;
    }, preference);
    await page.goto(BASE + '/quiz/v1-direto/' + PARAMS);
    await finishQuiz(page);
    await clickWithoutLeaving(page);
    const result = await queues(page);
    expect(result.google).toEqual([]);
    expect(result.meta).toEqual([]);
    expect(result.storage.cowboy_attribution).toBeUndefined();
    expect(evidence.requests.filter(url => new URL(url).pathname !== '/api/checkout').every(url => new URL(url).origin === new URL(BASE).origin)).toBe(true);
    expect(evidence.errors).toEqual([]);
    expect(await page.locator('a.bluue-finish-button').getAttribute('href')).toContain('quantity=3');
  });
}

test('SDK Google real gera linker na saída e API conserva _gl e atribuição até Appmax', async ({ page }, testInfo) => {
  test.skip(!GOOGLE_FIXTURE, 'Use GOOGLE_TAG_FIXTURE: cópia local do SDK público, sem eventos externos.');
  const evidence = await isolate(page, { google: true });
  await page.goto(ORIGIN + '/quiz/v1-direto/' + PARAMS);
  await expect.poll(() => evidence.hits.length, { timeout: 15000 }).toBeGreaterThan(0);
  await finishQuiz(page);
  const trackingState = await page.evaluate(() => ({
    cookies: document.cookie,
    metaQueue: window.fbq?.queue,
    metaCallMethod: typeof window.fbq?.callMethod,
  }));
  await page.locator('a.bluue-finish-button').click();
  await expect(page.getByText('Checkout verificado sem navegação externa')).toBeVisible();
  const evidencePath = testInfo.outputPath('isolated-sdk-evidence.json');
  fs.writeFileSync(evidencePath, JSON.stringify({ ...evidence, firstHop: evidence.firstHop?.toString(), destination: evidence.destination?.toString(), trackingState }, null, 2));
  await testInfo.attach('isolated-sdk-evidence', { path: evidencePath, contentType: 'application/json' });
  const checkoutTransportObserved = evidence.hits.some(hit => new URL(hit.url).searchParams.get('en') === 'begin_checkout' || new URLSearchParams(hit.body).get('en') === 'begin_checkout' || /(?:^|\r?\n)en=begin_checkout(?:&|$)/.test(hit.body));
  if (!checkoutTransportObserved) testInfo.annotations.push({ type: 'unconfirmed', description: 'GA begin_checkout: fila e callback/fallback testados separadamente; flush do último batch durante unload não comprovado por este interceptador. Ver documentação QUIZ-037; este teste comprova linker/atribuição, não recebimento GA.' });
  expect(evidence.firstHop.hostname).toBe('www.cowboyenergiamasculina.com.br');
  const linker = evidence.firstHop.searchParams.get('_gl');
  expect(linker).toMatch(/^1\*[^*]+\*/);
  const parts = linker.split('*');
  const clientId = Buffer.from(parts[parts.indexOf('_ga') + 1], 'base64').toString('utf8');
  const cookieClientId = /(?:^|; )_ga=GA\d\.\d\.([^;]+)/.exec(trackingState.cookies)?.[1];
  expect(clientId).toBe(cookieClientId);
  expect(evidence.hits.some(hit => new URL(hit.url).searchParams.get('cid') === clientId)).toBe(true);
  const sessionCookie = /(?:^|; )_ga_VYR2542XCN=GS\d\.\d\.([^;]+)/.exec(trackingState.cookies)?.[1];
  const sessionLinker = Buffer.from(parts[parts.indexOf('_ga_VYR2542XCN') + 1], 'base64').toString('utf8');
  expect(sessionLinker.match(/^s\d+/)?.[0]).toBe(sessionCookie?.match(/^s\d+/)?.[0]);
  expect(evidence.destination.searchParams.get('_gl')).toBe(linker);
  expect(evidence.destination.hostname).toBe('cowboyenergia.carrinho.app');
  expect(evidence.destination.pathname).toBe('/one-checkout/ocmdf/38251519');
  expect(evidence.destination.searchParams.get('utm_source')).toBe('validation');
  expect(evidence.destination.searchParams.get('utm_campaign')).toBe('QUIZ_037');
  expect(evidence.destination.searchParams.get('cid')).toBe('quiz_fixture');
  expect(evidence.destination.searchParams.get('gbraid')).toBe('braid_fixture');
  expect(evidence.destination.toString()).not.toMatch(/private_fixture|excluded|answers|severity/);
  expect(JSON.stringify(evidence.hits)).not.toMatch(/private_fixture|excluded|severity|weight|question_id|answers|diabetes|infarto|gravidade/i);
  expect(evidence.requests.some(url => url.includes('/scripts/pixel/'))).toBe(false);
  expect(evidence.errors).toEqual([]);
});

test('SDK Meta: diagnóstico explícito de restrição externa ou eventos neutros', async ({ page }, testInfo) => {
  test.skip(!META_FIXTURE || !META_CONFIG_FIXTURE, 'Requer fixtures públicas compatíveis do SDK e configuração Meta.');
  const evidence = await isolate(page, { meta: true });
  await page.goto(ORIGIN + '/quiz/v1-direto/' + PARAMS);
  await expect.poll(() => evidence.warning || evidence.metaHits.length, { timeout: 10000 }).toBeTruthy();
  const blocked = /"prohibitedPixels",\s*\{[^}]*"lockWebpage":true[^}]*"blockReason":"source_category"/.test(fs.readFileSync(META_CONFIG_FIXTURE, 'utf8'));
  if (blocked) {
    expect(evidence.warning).toContain('is unavailable');
    expect(evidence.metaHits).toEqual([]);
    await testInfo.attach('meta-source-category-block', { body: JSON.stringify({ warning: evidence.warning, reason: 'source_category', lockWebpage: true, collectedRequests: 0 }), contentType: 'application/json' });
    test.skip(true, 'META BLOQUEADO EXTERNAMENTE: prohibitedPixels.lockWebpage=true / source_category. Não comprova envio Meta; ver docs/integracoes/quiz-037-meta-block.md.');
  }
  await finishQuiz(page);
  await page.locator('a.bluue-finish-button').click();
  await expect.poll(() => evidence.metaHits.some(hit => new URL(hit.url).searchParams.get('ev') === 'InitiateCheckout'), { timeout: 3000 }).toBe(true);
  expect(JSON.stringify(evidence.metaHits)).not.toMatch(/SubscribedButtonClick|Microdata|private_fixture|excluded|severity|weight|question_id|answers|diabetes|infarto|gravidade/i);
  const names = evidence.metaHits.map(hit => new URL(hit.url).searchParams.get('ev') || new URLSearchParams(hit.body).get('ev'));
  expect(names.filter(name => name === 'PageView')).toHaveLength(1);
  expect(names).toContain('ViewContent');
  expect(names).not.toContain('Purchase');
  expect(evidence.errors).toEqual([]);
});
