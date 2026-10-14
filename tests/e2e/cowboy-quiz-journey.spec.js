'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('node:fs');

const BASE = process.env.E2E_BASE || 'http://127.0.0.1:4416';
const PUBLIC = 'https://cowboyenergiamasculina.com.br';
const COVER = '/quiz/v4-jornada/';
const FLOW = '/quiz/v4-jornada/quiz/';
const QUIZ_ID = 'cowboy_v4_jornada';
const VIDEO = '/videos/vsl/vsl-dr-durval-720.mp4';
const PARAMS = '?utm_source=validation&utm_medium=qa&utm_campaign=QUIZ_046&cid=journey_fixture&gbraid=braid_fixture&email=excluded%40example.test&answers=private_fixture&severity=private_fixture#private_fixture';
const GOOGLE_FIXTURE = process.env.GOOGLE_TAG_FIXTURE;
const UTM_FIXTURE = process.env.UTM_TAG_FIXTURE;
const SOURCES = [
  ['[data-medicine-alert]', 'https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2025/anvisa-emite-alerta-sobre-uso-indiscriminado-de-medicamentos-para-disfuncao-eretil/', 'medicine_alert'],
  ['[data-medicine-leaflet]', 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bcd8f8ab-81a2-4891-83db-24a0b0e25895', 'medicine_leaflet'],
  ['[data-research-source]', 'https://www.nature.com/articles/s41467-025-66723-7', 'research_paper'],
];

test.describe.configure({ mode: 'parallel' });
test.use({ channel: process.env.E2E_CHANNEL || undefined, reducedMotion: 'reduce' });

async function isolate(page, { google = false, failVideo = false, rejectAutoplay = false, preference } = {}) {
  const evidence = { requests: [], hits: [], checkouts: [], destination: null, errors: [] };
  page.on('pageerror', error => evidence.errors.push(error.message));
  await page.addInitScript(({ rejectAutoplay, preference }) => {
    if (preference === 'GPC') Object.defineProperty(navigator, 'globalPrivacyControl', { get: () => true });
    if (preference === 'GA opt-out') window['ga-disable-G-VYR2542XCN'] = true;
    const nativePlay = HTMLMediaElement.prototype.play;
    window.__journeyPlayAttempts = [];
    HTMLMediaElement.prototype.play = function () {
      if (!this.closest('[data-quiz-vsl]')) return nativePlay.call(this);
      const box = this.getBoundingClientRect();
      const visible = Math.max(0, Math.min(innerHeight, box.bottom) - Math.max(0, box.top));
      window.__journeyPlayAttempts.push({ muted: this.muted, visibility: box.height ? visible / box.height : 0 });
      if (rejectAutoplay && window.__journeyPlayAttempts.length === 1) return Promise.reject(new DOMException('QA autoplay block', 'NotAllowedError'));
      return nativePlay.call(this);
    };
  }, { rejectAutoplay, preference });
  // All analytics, reference pages and checkout destinations are answered locally.
  await page.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    evidence.requests.push(url.toString());
    if (url.pathname.includes('/collect')) evidence.hits.push({ url: url.toString(), body: request.postData() || '' });
    if (google && url.hostname === 'www.googletagmanager.com' && url.pathname === '/gtag/js') return route.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(GOOGLE_FIXTURE, 'utf8') });
    if (google && UTM_FIXTURE && url.hostname === 'cdn.utmify.com.br' && url.pathname === '/scripts/utms/latest.js') return route.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(UTM_FIXTURE, 'utf8') });
    if ([new URL(BASE).hostname, 'cowboyenergiamasculina.com.br', 'www.cowboyenergiamasculina.com.br'].includes(url.hostname)) {
      if (url.pathname === '/api/checkout') {
        evidence.checkouts.push(url.toString());
        if (!google) return route.fulfill({ status: 204 });
        const response = await route.fetch({ url: BASE + url.pathname + url.search, maxRedirects: 0 });
        expect(response.status()).toBe(302);
        evidence.destination = response.headers().location;
        return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: '<p>Checkout isolado pela QA</p>' });
      }
      if (failVideo && url.pathname === VIDEO) return route.fulfill({ status: 404, body: 'Intentional media failure' });
      if (url.origin === new URL(BASE).origin) return route.continue();
      return route.fulfill({ response: await route.fetch({ url: BASE + url.pathname + url.search }) });
    }
    return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
  });
  return evidence;
}

async function events(page) {
  return page.evaluate(() => ({
    google: (window.dataLayer || []).filter(entry => entry[0] === 'event').map(entry => [entry[1], entry[2]]),
    meta: window.fbq?.queue || [],
    storage: { session: Object.fromEntries(Object.keys(sessionStorage).map(key => [key, sessionStorage.getItem(key)])), local: Object.fromEntries(Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])) },
    history: history.state,
  }));
}

const named = (snapshot, event) => snapshot.google.filter(([name]) => name === event).map(([, params]) => params);

function privacy(snapshot) {
  const allowed = new Set(['send_to', 'quiz_id', 'step_index', 'page_location', 'page_referrer', 'page_title', 'currency', 'value', 'items', 'item_list_id', 'event_callback', 'event_timeout', 'video_id', 'percent', 'page_kind', 'cta_location', 'section_id', 'link_id', 'link_location', 'from_step_index', 'to_step_index', 'back_count', 'visit_count', 'interaction_count']);
  for (const [, params] of snapshot.google) {
    expect(params.quiz_id).toBe(QUIZ_ID);
    for (const key of Object.keys(params)) expect(allowed.has(key), key).toBe(true);
  }
  expect(JSON.stringify(snapshot)).not.toMatch(/private_fixture|excluded|severity|weight_kg|question_id|confidence_impact|intro_performance|answers|diabetes|infarto|gravidade|tadala|cialis|nitrato|Bastante|Muito|Um pouco|Nada/);
  // Existing UTMify attribution may persist campaign identifiers; never answers.
  expect(snapshot.meta.filter(command => command[0] === 'trackSingle').map(command => command[2])).not.toContain('Purchase');
}

async function checkSource(page, [selector, url], open) {
  const source = page.locator(selector);
  await expect(source).toHaveAttribute('href', url);
  await expect(source).toHaveAttribute('target', '_blank');
  await expect(source).toHaveAttribute('rel', /noopener/);
  await expect(source).toHaveAttribute('rel', /noreferrer/);
  if (!open) return;
  const match = target => target.href === url;
  const offline = route => route.fulfill({ status: 200, contentType: 'text/html', body: '<p>Source isolated by QA.</p>' });
  await page.context().route(match, offline);
  await source.focus();
  const pending = page.waitForEvent('popup');
  await page.keyboard.press('Enter');
  const popup = await pending;
  await expect(popup).toHaveURL(url);
  await popup.close();
  await page.context().unroute(match, offline);
}

async function finishQuiz(page, impact = 'Nada', { inspectSources = false, resultViewport } = {}) {
  const main = page.locator('main[data-step-index]');
  for (let step = 1; step <= 18; step += 1) {
    await expect(main).toHaveAttribute('data-step-index', String(step));
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(step));
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '18');
    if (step < 18) expect((await main.locator('img').evaluateAll(images => images.map(image => image.getAttribute('src')))).join(' ')).not.toMatch(/\/(?:kit-\d|cliente-\d|sem-receita|caixa-discreta|depoimento)[^/]*\./i);
    if (step === 18) break;
    if (step === 3) {
      await expect(main.locator('h2')).toHaveText('Quanto isso afeta sua confiança hoje?');
      await main.getByRole('button', { name: impact, exact: true }).click();
    } else if (step === 4 || step === 10) {
      if (inspectSources) {
        await page.waitForTimeout(6500);
        await expect(main).toHaveAttribute('data-step-index', String(step));
      }
      for (const source of step === 4 ? SOURCES.slice(0, 2) : SOURCES.slice(2)) await checkSource(page, source, inspectSources);
      await main.locator('button.cb-btn').click();
    } else if (step === 6) await main.locator('button.cb-btn').click();
    else if (step === 17) {
      if (resultViewport) await page.setViewportSize(resultViewport);
      await expect(main).toHaveAttribute('data-step-index', '18', { timeout: 10000 });
    }
    else {
      const options = main.locator('button.cb-option, button.cb-option-selected');
      // Health/age answers must never inflate the visitor's declared impact.
      await ([5, 12, 14].includes(step) ? options.last() : options.first()).click();
    }
  }
  await expect(page.locator('[data-journey-screen="result"]')).toBeVisible();
  await expect(page.locator('[data-journey-impact]')).toContainText(impact);
}

async function openPresentation(page) {
  await page.locator('[data-journey-next="result"]').click();
  await expect(page.locator('[data-journey-screen="presentation"]')).toBeVisible();
  await expect(page.locator('[data-journey-screen="result"]')).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => document.activeElement?.closest('[data-journey-screen]')?.getAttribute('data-journey-screen'))).toBe('presentation');
}

async function openOffer(page) {
  await page.locator('[data-journey-next="presentation"]').click();
  await expect(page.locator('[data-journey-screen="offer"]')).toBeVisible();
  await expect(page.locator('[data-journey-screen="presentation"]')).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => document.activeElement?.closest('[data-journey-screen]')?.getAttribute('data-journey-screen'))).toBe('offer');
}

async function noOverflow(page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
}

async function clickCheckout(page, evidence) {
  const before = evidence.checkouts.length;
  await page.locator('[data-journey-checkout]').click();
  await expect.poll(() => evidence.checkouts.length, { timeout: 3000 }).toBe(before + 1);
}

for (const impact of ['Nada', 'Um pouco', 'Bastante', 'Muito']) {
  test(`v4 resultado respeita autorrelato ${impact} sem produto ou gravidade inferida`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: impact === 'Nada' ? 375 : 390, height: 844 });
    const evidence = await isolate(page);
    await page.goto(BASE + COVER + PARAMS);
    await expect(page.locator('[data-editorial-cta="hero"]')).toHaveAttribute('href', /\/quiz\/v4-jornada\/quiz\//);
    await page.locator('[data-editorial-cta="hero"]').click();
    await expect(page).toHaveURL(new RegExp(FLOW));
    expect(page.url()).toContain('utm_campaign=QUIZ_046');
    if (impact === 'Nada') {
      const consent = page.getByRole('button', { name: 'uso das suas respostas', exact: true });
      await consent.click();
      await expect(page.getByRole('dialog')).toContainText('O impacto na confiança é aquele que você declarou.');
      await expect(page.getByRole('dialog')).toContainText('As perguntas não calculam diagnóstico, gravidade clínica ou recomendação individual de kit.');
      await expect(page.getByRole('dialog')).not.toContainText('servem para medir a gravidade do seu caso');
      await page.keyboard.press('Escape');
      await expect(consent).toBeFocused();
    }
    await finishQuiz(page, impact, { resultViewport: impact === 'Nada' ? { width: 375, height: 300 } : undefined });
    const result = page.locator('[data-journey-screen="result"]');
    await expect(result).toContainText('Seu resultado está pronto.');
    await expect(result).toContainText('Este resumo reflete suas respostas e não é um diagnóstico médico.');
    await expect(result).not.toContainText(/Gravidade|MODERADA|MUITO ALTA|R\$|Protocolo|Indicado para/);
    await expect(result.locator('img[src*="kit-"], img[src*="cliente-"]')).toHaveCount(0);
    await expect(page.locator('[data-journey-screen="presentation"]:visible, [data-journey-screen="offer"]:visible')).toHaveCount(0);
    expect(evidence.requests.some(url => new URL(url).pathname === VIDEO)).toBe(false);
    if (impact === 'Nada') {
      const report = page.locator('[data-journey-report]');
      expect(await report.evaluate(element => element.getBoundingClientRect().top >= innerHeight)).toBe(true);
      expect(named(await events(page), 'quiz_result_view')).toHaveLength(0);
      await page.setViewportSize({ width: 375, height: 812 });
      await report.scrollIntoViewIfNeeded();
      await expect.poll(async () => named(await events(page), 'quiz_result_view').length).toBe(1);
    }
    expect((await page.evaluate(() => history.state)).cowboyJourney).toBe('result');
    await noOverflow(page);
    const snapshot = await events(page);
    privacy(snapshot);
    expect(named(snapshot, 'quiz_complete')).toHaveLength(1);
    expect(named(snapshot, 'quiz_step_view').map(event => event.step_index)).toEqual(Array.from({ length: 18 }, (_, index) => index + 1));
    expect(named(snapshot, 'quiz_answer')).toHaveLength(14);
    expect(named(snapshot, 'view_item')).toHaveLength(0);
    expect(evidence.errors).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath('resultado.png'), fullPage: true });
  });
}

test('v4 mobile: três telas, vídeo real, voltar preserva pausa e contexto, kits só quando visíveis', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.addInitScript(() => {
    // A fast scroll can hide the heading before an IO delivery. Page transitions
    // must still count; only actual report/kit impressions depend on visibility.
    const NativeObserver = window.IntersectionObserver;
    window.IntersectionObserver = class extends NativeObserver {
      constructor(callback, options) {
        super((entries, observer) => callback(entries.filter(entry => !entry.target.hasAttribute('data-journey-title')), observer), options);
      }
    };
  });
  const evidence = await isolate(page);
  await page.goto(BASE + FLOW + PARAMS);
  await finishQuiz(page, 'Bastante');
  await openPresentation(page);
  const video = page.locator('[data-quiz-vsl] video');
  await expect(page.locator('[data-journey-next="presentation"]')).toBeEnabled();
  await video.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate(element => element.currentTime), { timeout: 15000 }).toBeGreaterThan(0.25);
  expect(await video.evaluate(element => element.muted)).toBe(true);
  expect(await page.evaluate(() => window.__journeyPlayAttempts[0].visibility)).toBeGreaterThanOrEqual(0.5);
  await page.screenshot({ path: testInfo.outputPath('apresentacao-muted-375.png') });
  await page.getByRole('button', { name: 'Ativar som', exact: true }).click();
  await expect.poll(() => video.evaluate(element => element.muted)).toBe(false);
  const playback = await video.evaluate(element => ({ duration: element.duration, width: element.videoWidth, height: element.videoHeight, currentTime: element.currentTime, audioDecodedBytes: element.webkitAudioDecodedByteCount, videoDecodedBytes: element.webkitVideoDecodedByteCount }));
  expect(playback.duration).toBeCloseTo(276.341, 1);
  expect(playback.width).toBe(720);
  expect(playback.height).toBe(1280);
  expect(playback.audioDecodedBytes).toBeGreaterThan(0);
  expect(playback.videoDecodedBytes).toBeGreaterThan(0);
  await video.evaluate(element => element.pause());
  const pausedAt = await video.evaluate(element => element.currentTime);
  const attempts = await page.evaluate(() => window.__journeyPlayAttempts.length);
  await openOffer(page);
  const offer = page.locator('[data-journey-screen="offer"]');
  await expect(offer).toContainText('Teste o COWBOY por 30 dias. Decida pela sua experiência.');
  await expect(offer).not.toContainText(/Gravidade|Indicado para o seu caso|Protocolo completo/);
  await expect(page.locator('[data-journey-impact]')).toContainText('Bastante');
  await expect(video).not.toBeVisible();
  expect(await video.evaluate(element => element.paused)).toBe(true);
  await noOverflow(page);
  await page.screenshot({ path: testInfo.outputPath('oferta-topo-375.png') });
  await page.waitForTimeout(150);
  expect(named(await events(page), 'view_item')).toHaveLength(0);

  await page.goBack();
  await expect(page.locator('[data-journey-screen="presentation"]')).toBeVisible();
  await video.scrollIntoViewIfNeeded();
  await expect.poll(async () => named(await events(page), 'page_view').filter(params => params.page_kind === 'presentation').length).toBe(2);
  await page.waitForTimeout(250);
  expect(await video.evaluate(element => element.paused)).toBe(true);
  expect(await video.evaluate(element => element.currentTime)).toBeCloseTo(pausedAt, 1);
  expect(await page.evaluate(() => window.__journeyPlayAttempts.length)).toBe(attempts);
  await page.goBack();
  await expect(page.locator('[data-journey-screen="result"]')).toBeVisible();
  await page.locator('[data-journey-next="result"]').scrollIntoViewIfNeeded();
  await expect.poll(async () => named(await events(page), 'page_view').filter(params => params.page_kind === 'result').length).toBe(2);
  await expect(page.locator('[data-journey-impact]')).toContainText('Bastante');
  await page.goForward();
  await expect(page.locator('[data-journey-screen="presentation"]')).toBeVisible();
  await video.scrollIntoViewIfNeeded();
  await expect.poll(async () => named(await events(page), 'page_view').filter(params => params.page_kind === 'presentation').length).toBe(3);
  expect(await video.evaluate(element => element.paused)).toBe(true);
  await openOffer(page);
  const kits = page.locator('[data-journey-kits]');
  await page.locator('[data-offer-view-kits]').click();
  await expect(kits).toBeFocused();
  await expect.poll(async () => named(await events(page), 'view_item').length).toBe(1);
  await page.screenshot({ path: testInfo.outputPath('kits-375.png') });
  for (const quantity of [1, 2, 3]) {
    const kit = page.getByRole('group', { name: 'Kits disponíveis' }).locator('button').filter({ hasText: new RegExp(`${quantity} frascos?`) });
    await kit.click();
    await expect(kit).toHaveAttribute('aria-pressed', 'true');
    await clickCheckout(page, evidence);
    const target = new URL(evidence.checkouts.at(-1));
    expect(target.searchParams.get('quantity')).toBe(String(quantity));
    expect(target.searchParams.get('utm_campaign')).toBe('QUIZ_046');
    expect(target.searchParams.get('gbraid')).toBe('braid_fixture');
  }
  const snapshot = await events(page);
  privacy(snapshot);
  expect(named(snapshot, 'quiz_complete')).toHaveLength(1);
  expect(named(snapshot, 'quiz_result_view')).toHaveLength(1);
  expect(named(snapshot, 'view_item')).toHaveLength(1);
  expect(named(snapshot, 'vsl_start')).toHaveLength(1);
  for (const event of ['select_item', 'begin_checkout']) expect(named(snapshot, event).map(params => params.value)).toEqual([79.9, 154.8, 199.9]);
  expect(named(snapshot, 'quiz_journey_view').map(params => params.page_kind)).toEqual(['result', 'presentation', 'offer']);
  expect(named(snapshot, 'page_view').filter(params => ['result', 'presentation', 'offer'].includes(params.page_kind)).map(params => params.page_kind)).toEqual(['result', 'presentation', 'offer', 'presentation', 'result', 'presentation', 'offer']);
  expect(named(snapshot, 'quiz_journey_action').map(params => params.cta_location)).toEqual(expect.arrayContaining(['result_continue', 'presentation_continue', 'offer_view_kits']));
  expect(snapshot.history.cowboyJourney).toBe('offer');
  expect(evidence.errors).toEqual([]);
  const file = testInfo.outputPath('jornada-playback-e-eventos.json');
  fs.writeFileSync(file, JSON.stringify({ playback, snapshot }, null, 2));
  await testInfo.attach('jornada-playback-e-eventos', { path: file, contentType: 'application/json' });

  await page.reload();
  await expect(page.locator('main[data-step-index]')).toHaveAttribute('data-step-index', '1');
  await expect(page.getByText('Esta sessão foi reiniciada. Responda novamente para ver seu resumo.', { exact: true })).toBeVisible();
  await expect(page.locator('[data-journey-impact]')).toHaveCount(0);
  await expect(page.locator('[data-journey-screen="offer"]:visible')).toHaveCount(0);
  privacy(await events(page));
});

test('v4 SDK real: fontes sem atribuição, erro de vídeo permite oferta, linker e cookies chegam ao checkout isolado', async ({ page }, testInfo) => {
  test.skip(!GOOGLE_FIXTURE || !UTM_FIXTURE, 'Requer fixtures locais dos SDKs Google e UTMify; nunca coleta externa.');
  await page.setViewportSize({ width: 390, height: 844 });
  const evidence = await isolate(page, { google: true, failVideo: true });
  await page.goto(PUBLIC + FLOW + PARAMS);
  await expect.poll(() => evidence.hits.length, { timeout: 15000 }).toBeGreaterThan(0);
  await finishQuiz(page, 'Nada', { inspectSources: true });
  expect(named(await events(page), 'quiz_content_link').map(({ link_id, link_location }) => [link_id, link_location])).toEqual(SOURCES.map(([, , id]) => [id, 'quiz']));
  await openPresentation(page);
  await page.locator('[data-quiz-vsl] video').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-quiz-vsl] [role="status"]')).toContainText('Não foi possível carregar o vídeo');
  expect(named(await events(page), 'vsl_error')).toHaveLength(1);
  expect(named(await events(page), 'vsl_start')).toHaveLength(0);
  await openOffer(page);
  const cookies = await page.evaluate(() => document.cookie);
  privacy(await events(page));
  await clickCheckout(page, evidence);
  await expect(page.getByText('Checkout isolado pela QA')).toBeVisible();
  const firstHop = new URL(evidence.checkouts[0]);
  const destination = new URL(evidence.destination);
  const linker = firstHop.searchParams.get('_gl');
  expect(linker).toMatch(/^1\*[^*]+\*/);
  const parts = linker.split('*');
  expect(Buffer.from(parts[parts.indexOf('_ga') + 1], 'base64').toString('utf8')).toBe(/(?:^|; )_ga=GA\d\.\d\.([^;]+)/.exec(cookies)?.[1]);
  const session = Buffer.from(parts[parts.indexOf('_ga_VYR2542XCN') + 1], 'base64').toString('utf8');
  expect(session.match(/^s\d+/)?.[0]).toBe(/(?:^|; )_ga_VYR2542XCN=GS\d\.\d\.([^;]+)/.exec(cookies)?.[1]?.match(/^s\d+/)?.[0]);
  expect(destination.searchParams.get('_gl')).toBe(linker);
  expect(destination.hostname).toBe('cowboyenergia.carrinho.app');
  expect(destination.searchParams.get('utm_campaign')).toBe('QUIZ_046');
  expect(destination.searchParams.get('cid')).toBe('journey_fixture');
  expect(destination.searchParams.get('gbraid')).toBe('braid_fixture');
  expect(destination.toString()).not.toMatch(/private_fixture|excluded|answers|severity|confidence_impact/);
  expect(JSON.stringify(evidence.hits)).not.toMatch(/private_fixture|excluded|severity|weight_kg|question_id|confidence_impact|answers/);
  expect(evidence.errors).toEqual([]);
  fs.writeFileSync(testInfo.outputPath('jornada-linker-isolado.json'), JSON.stringify(evidence, null, 2));
  testInfo.annotations.push({ type: 'scope', description: 'SDKs reais com coleta interceptada; não comprova processamento GA/Meta ou compra aprovada.' });
});

test('v4 autoplay bloqueado: oferta imediata e retorno pausado sem reprodução ou conclusão inventada', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const evidence = await isolate(page, { rejectAutoplay: true });
  await page.goto(BASE + FLOW + PARAMS);
  await finishQuiz(page, 'Um pouco');
  await openPresentation(page);
  const video = page.locator('[data-quiz-vsl] video');
  await video.scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Reproduzir vídeo com som', exact: true })).toBeVisible();
  expect(named(await events(page), 'vsl_autoplay_blocked')).toHaveLength(1);
  for (const event of ['vsl_start', 'vsl_progress', 'vsl_complete']) expect(named(await events(page), event)).toHaveLength(0);
  expect(evidence.requests.some(url => new URL(url).pathname === VIDEO)).toBe(false);
  await openOffer(page);
  await clickCheckout(page, evidence);
  await page.locator('[data-journey-back]').click();
  await expect(page.locator('[data-journey-screen="presentation"]')).toBeVisible();
  expect(await video.evaluate(element => element.paused)).toBe(true);
  expect(await page.evaluate(() => window.__journeyPlayAttempts.length)).toBe(1);
  await page.getByRole('button', { name: 'Reproduzir vídeo com som', exact: true }).click();
  await expect.poll(() => video.evaluate(element => element.currentTime), { timeout: 15000 }).toBeGreaterThan(0.25);
  expect(await video.evaluate(element => element.muted)).toBe(false);
  await video.evaluate(element => element.pause());
  privacy(await events(page));
  expect(evidence.errors).toEqual([]);
});

for (const preference of ['GPC', 'GA opt-out']) {
  test(`v4 ${preference}: três telas e checkout funcionam sem scripts externos, eventos ou resumo persistido`, async ({ page }) => {
    const evidence = await isolate(page, { preference });
    await page.goto(BASE + COVER + PARAMS);
    await page.locator('[data-editorial-cta="hero"]').click();
    await finishQuiz(page, 'Muito');
    await openPresentation(page);
    await openOffer(page);
    await clickCheckout(page, evidence);
    const snapshot = await events(page);
    expect(snapshot.google).toEqual([]);
    expect(snapshot.meta).toEqual([]);
    expect(snapshot.storage).toEqual({ session: {}, local: {} });
    privacy(snapshot);
    expect(evidence.requests.every(url => new URL(url).origin === new URL(BASE).origin)).toBe(true);
    expect(new URL(evidence.checkouts[0]).searchParams.get('utm_campaign')).toBe('QUIZ_046');
    expect(evidence.errors).toEqual([]);
  });
}
