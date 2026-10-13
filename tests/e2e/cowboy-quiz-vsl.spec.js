'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('node:fs');

const BASE = process.env.E2E_BASE || 'http://127.0.0.1:4398';
const PUBLIC = 'https://cowboyenergiamasculina.com.br';
const VIDEO = '/videos/vsl/vsl-dr-durval-720.mp4';
const POSTER = '/imagens/v5/vsl-poster-frame.webp';
const PARAMS = '?utm_source=validation&utm_medium=qa&utm_campaign=QUIZ_038&cid=vsl_fixture&gbraid=braid_fixture&email=excluded%40example.test&answers=private_fixture&severity=private_fixture#private_fixture';
const GOOGLE_FIXTURE = process.env.GOOGLE_TAG_FIXTURE;
const UTM_FIXTURE = process.env.UTM_TAG_FIXTURE;

test.describe.configure({ mode: 'parallel' });
test.use({ channel: process.env.E2E_CHANNEL || undefined, reducedMotion: 'reduce' });

async function isolate(page, { google = false, failVideo = false } = {}) {
  const evidence = { requests: [], errors: [], hits: [], checkouts: [], destination: null };
  page.on('pageerror', error => evidence.errors.push(error.message));
  // Fail closed: every external script, event endpoint and checkout is answered
  // locally. SDK fixtures are offline copies, not permission to collect events.
  await page.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    evidence.requests.push(url.toString());
    if (url.pathname.includes('/collect')) evidence.hits.push({ url: url.toString(), body: request.postData() || '' });
    if (google && url.hostname === 'www.googletagmanager.com' && url.pathname === '/gtag/js') {
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(GOOGLE_FIXTURE, 'utf8') });
    }
    if (google && UTM_FIXTURE && url.hostname === 'cdn.utmify.com.br' && url.pathname === '/scripts/utms/latest.js') {
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(UTM_FIXTURE, 'utf8') });
    }
    if ([new URL(BASE).hostname, 'cowboyenergiamasculina.com.br', 'www.cowboyenergiamasculina.com.br'].includes(url.hostname)) {
      if (url.pathname === '/api/checkout') {
        evidence.checkouts.push(url.toString());
        if (!google) return route.fulfill({ status: 204 });
        const response = await route.fetch({ url: BASE + url.pathname + url.search, maxRedirects: 0 });
        expect(response.status()).toBe(302);
        evidence.destination = response.headers().location;
        return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: '<p>Saída conferida localmente</p>' });
      }
      if (failVideo && url.pathname === VIDEO) return route.fulfill({ status: 404, body: 'Intentional media failure' });
      if (url.origin === new URL(BASE).origin) return route.continue();
      return route.fulfill({ response: await route.fetch({ url: BASE + url.pathname + url.search }) });
    }
    return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
  });
  return evidence;
}

async function finishQuiz(page) {
  const main = page.locator('main[data-stage]');
  const trace = [];
  for (let transition = 0; transition < 20; transition += 1) {
    const stage = await main.getAttribute('data-stage');
    trace.push(stage);
    if (stage === 'precheckout') break;
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
  }
  await expect(main).toHaveAttribute('data-stage', 'precheckout');
  expect(trace).toEqual(['intro', 'intro', 'intro', 'explanation', 'quiz', 'weight_kg', 'quiz', 'quiz', 'testimonials', 'weight', 'quiz', 'quiz', 'quiz', 'quiz', 'quiz', 'analyzing', 'precheckout']);
  return trace;
}

async function events(page) {
  return page.evaluate(() => ({
    google: (window.dataLayer || []).filter(entry => entry[0] === 'event').map(entry => [entry[1], entry[2]]),
    meta: window.fbq?.queue || [],
    storage: Object.fromEntries(Object.keys(sessionStorage).map(key => [key, sessionStorage.getItem(key)])),
  }));
}

async function checkScreen(page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  for (const image of await page.locator('main img:visible:not([loading="lazy"])').all()) {
    await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
  }
}

function checkPrivacy(result, quizId) {
  const allowed = new Set(['send_to', 'quiz_id', 'step_index', 'page_location', 'page_referrer', 'page_title', 'currency', 'value', 'items', 'item_list_id', 'event_callback', 'event_timeout', 'video_id', 'percent']);
  for (const [, params] of result.google) {
    expect(params.quiz_id).toBe(quizId);
    for (const key of Object.keys(params)) expect(allowed.has(key), key).toBe(true);
  }
  expect(JSON.stringify(result)).not.toMatch(/private_fixture|excluded|severity|weight|question_id|answers|diabetes|infarto|gravidade|ereções|sexo/i);
  expect(result.meta.filter(command => command[0] === 'trackSingle').map(command => command[2])).not.toContain('Purchase');
}

async function clickCheckout(page, evidence) {
  const count = evidence.checkouts.length;
  await page.locator('a.bluue-finish-button').click();
  await expect.poll(() => evidence.checkouts.length, { timeout: 3000 }).toBe(count + 1);
}

test('v1 mobile 375 e atalho preservados: mesmo fluxo, IDs, kits e nenhum download de VSL', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const evidence = await isolate(page);
  await page.goto(BASE + '/quiz' + PARAMS);
  await expect(page).toHaveURL(/\/quiz\/v1-direto\//);
  await checkScreen(page);
  await page.screenshot({ path: testInfo.outputPath('v1-intro-375.png'), fullPage: true });
  const trace = await finishQuiz(page);
  await checkScreen(page);
  await expect(page.locator('[data-quiz-vsl]')).toHaveCount(0);
  await expect(page.locator(`main video source[src="${VIDEO}"]`)).toHaveCount(0);
  expect(evidence.requests.some(url => new URL(url).pathname === VIDEO)).toBe(false);
  await page.screenshot({ path: testInfo.outputPath('v1-oferta-375.png'), fullPage: true });
  await clickCheckout(page, evidence);
  const outgoing = new URL(evidence.checkouts[0]);
  expect(outgoing.searchParams.get('quantity')).toBe('3');
  expect(outgoing.searchParams.get('utm_campaign')).toBe('QUIZ_038');
  const result = await events(page);
  expect(result.google.filter(([name]) => name === 'page_view')).toHaveLength(1);
  expect(result.google.filter(([name]) => name === 'quiz_complete')).toHaveLength(1);
  expect(result.google.filter(([name]) => name === 'quiz_step_view').map(([, params]) => params.step_index)).toEqual(Array.from({ length: 17 }, (_, index) => index + 1));
  expect(result.google.some(([name]) => name.startsWith('vsl_'))).toBe(false);
  checkPrivacy(result, 'cowboy_v1_direto');
  expect(evidence.errors).toEqual([]);
  const flowPath = testInfo.outputPath('v1-flow.json');
  fs.writeFileSync(flowPath, JSON.stringify({ trace, events: result.google }, null, 2));
  await testInfo.attach('v1-flow', { path: flowPath, contentType: 'application/json' });
});

test('v2 mobile 375: reprodução MP4 real, posição, quartis neutros e checkout com SDK bloqueado', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const evidence = await isolate(page);
  await page.goto(BASE + '/quiz/v2-vsl/' + PARAMS);
  await finishQuiz(page);
  await checkScreen(page);
  const section = page.locator('[data-quiz-vsl]');
  const video = section.locator('video');
  await expect(section).toBeVisible();
  expect(evidence.requests.some(url => new URL(url).pathname === VIDEO)).toBe(false);
  expect(await video.evaluate(element => ({ preload: element.preload, controls: element.controls, inline: element.playsInline, autoplay: element.autoplay, paused: element.paused, src: new URL(element.querySelector('source')?.src || element.src).pathname, poster: new URL(element.poster).pathname }))).toEqual({ preload: 'none', controls: true, inline: true, autoplay: false, paused: true, src: VIDEO, poster: POSTER });
  expect(await section.evaluate(element => {
    const result = document.querySelector('.cb-result');
    const kits = document.querySelector('[role="group"]');
    return Boolean(result.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING) && Boolean(element.compareDocumentPosition(kits) & Node.DOCUMENT_POSITION_FOLLOWING);
  })).toBe(true);
  await video.scrollIntoViewIfNeeded();
  const box = await video.boundingBox();
  await page.screenshot({ path: testInfo.outputPath('v2-player-375.png') });
  expect(box.width).toBeLessThanOrEqual(375);
  expect(box.height).toBeLessThanOrEqual(812 * 0.7 + 1);
  // Activate the native control. The following assertions use actual decoder,
  // audio and played ranges, not simulated media events.
  await video.click({ position: { x: 28, y: box.height - 28 } });
  await expect.poll(() => video.evaluate(element => element.currentTime), { timeout: 15000 }).toBeGreaterThan(0.25);
  const playback = await video.evaluate(element => ({ duration: element.duration, width: element.videoWidth, height: element.videoHeight, readyState: element.readyState, currentTime: element.currentTime, paused: element.paused, muted: element.muted, volume: element.volume, playedRanges: element.played.length, audioDecodedBytes: element.webkitAudioDecodedByteCount, videoDecodedBytes: element.webkitVideoDecodedByteCount }));
  expect(playback.duration).toBeCloseTo(276.341, 1);
  expect(playback.width).toBe(720);
  expect(playback.height).toBe(1280);
  expect(playback.readyState).toBeGreaterThanOrEqual(2);
  expect(playback.paused).toBe(false);
  expect(playback.muted).toBe(false);
  expect(playback.volume).toBeGreaterThan(0);
  expect(playback.playedRanges).toBeGreaterThan(0);
  expect(playback.audioDecodedBytes).toBeGreaterThan(0);
  expect(playback.videoDecodedBytes).toBeGreaterThan(0);
  await video.evaluate(element => element.pause());
  const playbackPath = testInfo.outputPath('real-playback.json');
  fs.writeFileSync(playbackPath, JSON.stringify(playback, null, 2));
  await testInfo.attach('real-playback', { path: playbackPath, contentType: 'application/json' });
  // Isolated deterministic quartile checks; explicitly distinct from playback.
  await video.evaluate(element => {
    Object.defineProperty(element, 'played', { configurable: true, get: () => ({ length: 1, start: () => 0, end: () => element.duration * 0.05 }) });
    Object.defineProperty(element, 'currentTime', { configurable: true, get: () => element.duration * 0.95 });
    Object.defineProperty(element, 'ended', { configurable: true, get: () => true });
    element.dispatchEvent(new Event('timeupdate'));
    element.dispatchEvent(new Event('ended'));
  });
  expect((await events(page)).google.filter(([name]) => name === 'vsl_progress' || name === 'vsl_complete')).toHaveLength(0);
  for (const percent of [25, 25, 50, 75, 99.5]) {
    await video.evaluate((element, percent) => {
      Object.defineProperty(element, 'played', { configurable: true, get: () => ({ length: 1, start: () => 0, end: () => element.duration * percent / 100 }) });
      element.dispatchEvent(new Event('timeupdate'));
      if (percent > 99) { element.dispatchEvent(new Event('ended')); element.dispatchEvent(new Event('ended')); }
    }, percent);
  }
  for (const quantity of [1, 2, 3]) {
    await page.getByRole('group', { name: 'Kits disponíveis' }).locator('button').filter({ hasText: new RegExp(`${quantity} frascos?`) }).click();
    await clickCheckout(page, evidence);
    const outgoing = new URL(evidence.checkouts.at(-1));
    expect(outgoing.searchParams.get('quantity')).toBe(String(quantity));
    expect(outgoing.searchParams.get('utm_campaign')).toBe('QUIZ_038');
    expect(outgoing.searchParams.get('gbraid')).toBe('braid_fixture');
  }
  const result = await events(page);
  expect(result.google.filter(([name]) => name === 'vsl_start')).toHaveLength(1);
  expect(result.google.filter(([name]) => name === 'vsl_progress').map(([, params]) => params.percent)).toEqual([25, 50, 75]);
  expect(result.google.filter(([name]) => name === 'vsl_complete')).toHaveLength(1);
  expect(result.google.filter(([name]) => name.startsWith('vsl_')).every(([, params]) => params.video_id === 'cowboy_vsl')).toBe(true);
  expect(result.google.filter(([name]) => name === 'begin_checkout').map(([, params]) => params.value)).toEqual([79.9, 154.8, 199.9]);
  expect(result.meta.filter(command => command[0] === 'trackSingle').map(command => command[2])).toEqual(['PageView', 'ViewContent', 'InitiateCheckout', 'InitiateCheckout', 'InitiateCheckout']);
  checkPrivacy(result, 'cowboy_v2_vsl');
  expect(evidence.errors).toEqual([]);
  expect(evidence.requests.some(url => url.includes('/scripts/pixel/'))).toBe(false);
});

test('v2 mobile 390: erro de vídeo não impede kits, SDK Google conserva linker e GPC suprime scripts', async ({ page, context }, testInfo) => {
  test.skip(!GOOGLE_FIXTURE, 'Requer GOOGLE_TAG_FIXTURE local para conferir o linker real sem coleta externa.');
  await page.setViewportSize({ width: 390, height: 844 });
  const evidence = await isolate(page, { google: true, failVideo: true });
  await page.goto(PUBLIC + '/quiz/v2-vsl/' + PARAMS);
  await expect.poll(() => evidence.hits.length, { timeout: 15000 }).toBeGreaterThan(0);
  await finishQuiz(page);
  await checkScreen(page);
  const video = page.locator('[data-quiz-vsl] video');
  await video.evaluate(element => element.load());
  await expect(page.locator('[data-quiz-vsl] [role="status"]')).toContainText('Não foi possível carregar o vídeo');
  expect(evidence.requests.some(url => new URL(url).pathname === VIDEO)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('v2-media-error-390.png'), fullPage: true });
  await expect(page.getByRole('group', { name: 'Kits disponíveis' })).toBeVisible();
  const cookies = await page.evaluate(() => document.cookie);
  const result = await events(page);
  checkPrivacy(result, 'cowboy_v2_vsl');
  expect(result.google.some(([name]) => name.startsWith('vsl_'))).toBe(false);
  await clickCheckout(page, evidence);
  await expect(page.getByText('Saída conferida localmente')).toBeVisible();
  const firstHop = new URL(evidence.checkouts[0]);
  const destination = new URL(evidence.destination);
  expect(firstHop.hostname).toBe('www.cowboyenergiamasculina.com.br');
  const linker = firstHop.searchParams.get('_gl');
  expect(linker).toMatch(/^1\*[^*]+\*/);
  const parts = linker.split('*');
  const clientId = Buffer.from(parts[parts.indexOf('_ga') + 1], 'base64').toString('utf8');
  expect(clientId).toBe(/(?:^|; )_ga=GA\d\.\d\.([^;]+)/.exec(cookies)?.[1]);
  const sessionLinker = Buffer.from(parts[parts.indexOf('_ga_VYR2542XCN') + 1], 'base64').toString('utf8');
  expect(sessionLinker.match(/^s\d+/)?.[0]).toBe(/(?:^|; )_ga_VYR2542XCN=GS\d\.\d\.([^;]+)/.exec(cookies)?.[1]?.match(/^s\d+/)?.[0]);
  expect(destination.searchParams.get('_gl')).toBe(linker);
  expect(destination.hostname).toBe('cowboyenergia.carrinho.app');
  expect(destination.pathname).toBe('/one-checkout/ocmdf/38251519');
  expect(destination.searchParams.get('utm_campaign')).toBe('QUIZ_038');
  expect(destination.searchParams.get('cid')).toBe('vsl_fixture');
  expect(destination.searchParams.get('gbraid')).toBe('braid_fixture');
  expect(destination.toString()).not.toMatch(/private_fixture|excluded|answers|severity/);
  expect(JSON.stringify(evidence.hits)).not.toMatch(/private_fixture|excluded|severity|weight|question_id|answers|diabetes|infarto|gravidade/i);
  expect(evidence.errors).toEqual([]);
  testInfo.annotations.push({ type: 'scope', description: 'Linker/cookies e redirecionamento comprovados localmente. Não comprova processamento GA/Meta ou Purchase; limite de captura no unload documentado na QUIZ-037.' });
  const linkerPath = testInfo.outputPath('v2-linker-isolated.json');
  fs.writeFileSync(linkerPath, JSON.stringify(evidence, null, 2));
  await testInfo.attach('v2-linker-isolated', { path: linkerPath, contentType: 'application/json' });
  const privatePage = await context.newPage();
  const privateEvidence = await isolate(privatePage);
  await privatePage.addInitScript(() => Object.defineProperty(navigator, 'globalPrivacyControl', { get: () => true }));
  await privatePage.goto(BASE + '/quiz/v2-vsl/' + PARAMS);
  await expect(privatePage.locator('main[data-stage]')).toHaveAttribute('data-stage', 'intro');
  expect(await events(privatePage)).toEqual({ google: [], meta: [], storage: {} });
  expect(privateEvidence.requests.every(url => new URL(url).origin === new URL(BASE).origin)).toBe(true);
  await privatePage.close();
});
