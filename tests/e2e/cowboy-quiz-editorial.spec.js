'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('node:fs');

const BASE = process.env.E2E_BASE || 'http://127.0.0.1:4410';
const PUBLIC = 'https://cowboyenergiamasculina.com.br';
const VIDEO = '/videos/vsl/vsl-dr-durval-720.mp4';
const POSTER = '/imagens/v5/vsl-poster-frame.webp';
const PARAMS = '?utm_source=validation&utm_medium=qa&utm_campaign=QUIZ_040&cid=vsl_fixture&gbraid=braid_fixture&email=excluded%40example.test&answers=private_fixture&severity=private_fixture#private_fixture';
const GOOGLE_FIXTURE = process.env.GOOGLE_TAG_FIXTURE;
const UTM_FIXTURE = process.env.UTM_TAG_FIXTURE;
const COVER = '/quiz/v3-editorial/';
const FLOW = '/quiz/v3-editorial/quiz/';
const QUIZ_ID = 'cowboy_v3_editorial';
const RESEARCH_URL = 'https://www.nature.com/articles/s41467-025-66723-7';
const MEDICINE_ALERT_URL = 'https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2025/anvisa-emite-alerta-sobre-uso-indiscriminado-de-medicamentos-para-disfuncao-eretil/';
const MEDICINE_LEAFLET_URL = 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bcd8f8ab-81a2-4891-83db-24a0b0e25895';

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

async function checkSource(page, source, url, { open = false } = {}) {
  await expect(source).toHaveAttribute('href', url);
  await expect(source).toHaveAttribute('target', '_blank');
  await expect(source).toHaveAttribute('rel', /noopener/);
  await expect(source).toHaveAttribute('rel', /noreferrer/);
  if (!open) return;
  const matchSource = target => target.href === url;
  const offlineSource = route => route.fulfill({ status: 200, contentType: 'text/html', body: '<p>Official source isolated by QA.</p>' });
  await page.context().route(matchSource, offlineSource);
  await source.focus();
  await expect(source).toBeFocused();
  const opened = page.waitForEvent('popup');
  await page.keyboard.press('Enter');
  const popup = await opened;
  await expect(popup).toHaveURL(url);
  await popup.close();
  await page.context().unroute(matchSource, offlineSource);
}

async function finishQuiz(page, { restoreWeight = false, inspectResearch = false } = {}) {
  const main = page.locator('main[data-stage]');
  const progress = page.locator('main[data-step-index]');
  const questions = {
    1: 'O que você quer melhorar na sua vida sexual?',
    2: 'Como está sua performance hoje?',
    3: 'Quando você quer começar a sentir a diferença?',
    5: 'Qual a sua faixa etária?',
    6: 'Qual é o seu peso atual?',
    7: 'Qual a sua principal preocupação?',
    8: 'Com que frequência isso acontece?',
    9: 'Há quanto tempo você percebe essa dificuldade?',
    11: 'Você está acima do peso (obeso/sobrepeso)?',
    12: 'Você faz uso de algum medicamento atualmente?',
    13: 'Já passou por alguma cirurgia?',
    14: 'Você já teve alguma dessas condições?',
    15: 'Ela já percebeu?',
    16: 'Do que você tem mais medo?',
  };
  const trace = [];
  for (let step = 1; step <= 18; step += 1) {
    await expect(progress).toHaveAttribute('data-step-index', String(step));
    await expect(page.locator('[data-quiz-progress]')).toHaveCount(1);
    await expect(page.getByRole('progressbar')).toHaveCount(1);
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '18');
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(step));
    const stage = await main.getAttribute('data-stage');
    trace.push({ step, stage });
    if (step < 18) {
      const images = await main.locator('img').evaluateAll(elements => elements.map(element => element.getAttribute('src') || ''));
      expect(images.join(' ')).not.toMatch(/\/(?:kit-\d|cliente-\d|sem-receita|caixa-discreta|depoimento)[^/]*\./i);
    }
    if (step === 4) {
      const introduction = page.locator('[data-quiz-introduction][data-quiz-medicine]');
      await expect(introduction).toBeVisible();
      await expect(introduction.locator('img')).toHaveCount(2);
      expect(await introduction.locator('img').evaluateAll(images => images.map(image => image.getAttribute('src').split('/').at(-1)).sort())).toEqual(['cialis-reference.webp', 'tadalafila-ems-reference.webp']);
      for (const image of await introduction.locator('img').all()) {
        await expect(image).toHaveAttribute('alt', /\S+/);
        await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
      }
      await expect(introduction).not.toContainText('92%');
      await expect(introduction.locator('h2').first()).toHaveText('Tadala não é brincadeira.');
      await expect(introduction).toContainText('Esses medicamentos podem tratar a disfunção erétil quando indicados.');
      await expect(introduction).toContainText('Não suspenda nem troque seu tratamento por conta própria.');
      await expect(introduction.locator('time')).toHaveAttribute('datetime', '2025-09-05');
      if (inspectResearch) {
        await page.waitForTimeout(6500);
        await expect(progress).toHaveAttribute('data-step-index', '4');
      }
      await checkSource(page, introduction.locator('[data-medicine-alert]'), MEDICINE_ALERT_URL, { open: inspectResearch });
      await checkSource(page, introduction.locator('[data-medicine-leaflet]'), MEDICINE_LEAFLET_URL, { open: inspectResearch });
      await expect(progress).toHaveAttribute('data-step-index', '4');
    }
    if (step === 10) {
      const research = page.locator('[data-quiz-research]');
      await expect(research).toBeVisible();
      await expect(research.locator('img')).toHaveCount(0);
      await expect(research.getByRole('article')).toHaveAttribute('aria-labelledby', 'quiz-research-title');
      await expect(research).toContainText('Conteúdo publicitário');
      await expect(research).toContainText('Divulgação científica');
      await expect(research).toContainText('1.038.509 participantes');
      await expect(research.locator('time')).toHaveAttribute('datetime', '2025-11-24');
      await expect(research).toContainText('não testou suplementos nem comprovou tratamento, cura ou duração da relação');
      const source = research.locator('[data-research-source]');
      if (inspectResearch) {
        // The previous product screen advanced after six seconds; reading must not.
        await page.waitForTimeout(6500);
        await expect(progress).toHaveAttribute('data-step-index', '10');
      }
      await checkSource(page, source, RESEARCH_URL, { open: inspectResearch });
      if (inspectResearch) {
        await expect(progress).toHaveAttribute('data-step-index', '10');
        expect((await events(page)).google.filter(([event]) => event === 'quiz_content_link').map(([, params]) => [params.link_id, params.link_location])).toEqual([['medicine_alert', 'quiz'], ['medicine_leaflet', 'quiz'], ['research_paper', 'quiz']]);
      }
    }
    if (questions[step]) await expect(main.locator('h2').first()).toHaveText(questions[step]);
    if (restoreWeight && step === 6) {
      for (let increment = 0; increment < 5; increment += 1) await page.getByRole('slider').press('ArrowRight');
      await expect(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '75');
    }
    if (restoreWeight && step === 7) {
      await page.getByRole('button', { name: 'Voltar', exact: true }).click();
      await expect(progress).toHaveAttribute('data-step-index', '6');
      await expect(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '75');
      await main.locator('button.cb-btn').click();
      await expect(progress).toHaveAttribute('data-step-index', '7');
    }
    if (step === 18) break;
    if (step === 17) {
      await expect(progress).toHaveAttribute('data-step-index', '18', { timeout: 10000 });
    } else if ([4, 6, 10].includes(step)) {
      await main.locator('button.cb-btn').click();
    } else {
      await main.locator('button.cb-option, button.cb-option-selected').first().click();
    }
  }
  await expect(main).toHaveAttribute('data-stage', 'precheckout');
  const social = page.locator('[data-quiz-social-proof]');
  await expect(social).toHaveCount(1);
  await expect(social.locator('video')).toHaveCount(2);
  await expect(social.locator('img')).toHaveCount(6);
  await expect(social).not.toContainText('92%');
  expect(await page.evaluate(() => {
    const video = document.querySelector('[data-quiz-vsl]');
    const proof = document.querySelector('[data-quiz-social-proof]');
    const kits = document.querySelector('#quiz-kits');
    return Boolean((video.compareDocumentPosition(proof) & Node.DOCUMENT_POSITION_FOLLOWING) && (proof.compareDocumentPosition(kits) & Node.DOCUMENT_POSITION_FOLLOWING));
  })).toBe(true);
  await expect(main.locator('video[aria-label^="Vídeo de depoimento"]')).toHaveCount(2);
  await expect(main.locator('img[src*="/cliente-"]')).toHaveCount(6);
  expect(Object.keys(questions)).toHaveLength(14);
  return trace;
}

async function events(page) {
  return page.evaluate(() => ({
    google: (window.dataLayer || []).filter(entry => entry[0] === 'event').map(entry => [entry[1], entry[2]]),
    meta: window.fbq?.queue || [],
    storage: Object.fromEntries(Object.keys(sessionStorage).map(key => [key, sessionStorage.getItem(key)])),
  }));
}

async function observePlayAttempts(page, { rejectFirst = false } = {}) {
  await page.addInitScript(({ rejectFirst }) => {
    const nativePlay = HTMLMediaElement.prototype.play;
    window.__vslPlayAttempts = [];
    HTMLMediaElement.prototype.play = function () {
      if (!this.closest('[data-quiz-vsl]')) return nativePlay.call(this);
      const bounds = this.getBoundingClientRect();
      const visibleHeight = Math.max(0, Math.min(innerHeight, bounds.bottom) - Math.max(0, bounds.top));
      window.__vslPlayAttempts.push({ muted: this.muted, visibility: visibleHeight / bounds.height });
      if (rejectFirst && window.__vslPlayAttempts.length === 1) {
        return Promise.reject(new DOMException('Autoplay intentionally blocked by QA', 'NotAllowedError'));
      }
      return nativePlay.call(this);
    };
  }, { rejectFirst });
}

async function setVideoVisibility(video, ratio) {
  await video.evaluate((element, ratio) => {
    const bounds = element.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + bounds.top + bounds.height * ratio - innerHeight);
  }, ratio);
  // Wait for real layout and IntersectionObserver delivery, without replacing it.
  await video.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function playAttempts(page) {
  return page.evaluate(() => window.__vslPlayAttempts);
}

async function checkScreen(page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  for (const image of await page.locator('main img:visible:not([loading="lazy"])').all()) {
    await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
  }
}

function checkPrivacy(result, quizId) {
  const allowed = new Set(['send_to', 'quiz_id', 'step_index', 'page_location', 'page_referrer', 'page_title', 'currency', 'value', 'items', 'item_list_id', 'event_callback', 'event_timeout', 'video_id', 'percent', 'page_kind', 'cta_location', 'section_id', 'link_id', 'link_location', 'from_step_index', 'to_step_index', 'back_count', 'visit_count', 'interaction_count']);
  for (const [, params] of result.google) {
    expect(params.quiz_id).toBe(quizId);
    for (const key of Object.keys(params)) expect(allowed.has(key), key).toBe(true);
  }
  expect(JSON.stringify(result)).not.toMatch(/private_fixture|excluded|severity|weight|question_id|problem_duration|answers|diabetes|infarto|gravidade|ereções|sexo|tadala|cialis|nitrato/i);
  expect(result.meta.filter(command => command[0] === 'trackSingle').map(command => command[2])).not.toContain('Purchase');
}

async function clickCheckout(page, evidence) {
  const count = evidence.checkouts.length;
  await page.locator('a.bluue-finish-button').click();
  await expect.poll(() => evidence.checkouts.length, { timeout: 3000 }).toBe(count + 1);
}

test('capa editorial mobile 375: autoria publicitária, CTAs reais e atribuição sem dados sensíveis', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const evidence = await isolate(page);
  await page.goto(BASE + COVER + PARAMS);
  const cover = page.locator('[data-quiz-editorial]');
  await expect(cover).toBeVisible();
  await expect(cover).toContainText('COWBOY');
  expect(await page.getByText(/conteúdo publicitário/i).count()).toBeGreaterThanOrEqual(2);
  expect(page.url()).not.toMatch(/email|answers|severity|private_fixture|#/);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  expect(evidence.requests.some(url => new URL(url).pathname === VIDEO)).toBe(false);
  for (const placement of ['hero', 'footer']) {
    const cta = page.locator(`[data-editorial-cta="${placement}"]`);
    await expect(cta).toHaveText(/Quero desbloquear meu resultado/i);
    await expect(cta).toHaveAttribute('href', /utm_campaign=QUIZ_040/);
    const target = new URL(await cta.getAttribute('href'), BASE);
    expect(target.pathname).toBe(FLOW);
    expect(target.searchParams.get('utm_source')).toBe('validation');
    expect(target.searchParams.get('utm_campaign')).toBe('QUIZ_040');
    expect(target.searchParams.get('cid')).toBe('vsl_fixture');
    expect(target.searchParams.get('gbraid')).toBe('braid_fixture');
    expect(target.toString()).not.toMatch(/private_fixture|excluded|answers|severity|#/);
  }
  await page.screenshot({ path: testInfo.outputPath('editorial-cover-375.png'), fullPage: true });
  const landing = await events(page);
  checkPrivacy(landing, QUIZ_ID);
  expect(landing.google.filter(([name]) => name === 'page_view')).toHaveLength(1);
  expect(landing.google.filter(([name]) => name === 'landing_view').map(([, params]) => params.page_kind)).toEqual(['cover']);
  expect(landing.google.some(([name]) => name === 'quiz_start' || name === 'quiz_step_view' || name === 'view_item')).toBe(false);
  const clicks = [];
  page.on('console', message => {
    if (message.text().startsWith('__editorial_click__')) clicks.push(JSON.parse(message.text().slice('__editorial_click__'.length)));
  });
  await page.evaluate(() => {
    const original = window.gtag;
    window.gtag = (...args) => { console.debug('__editorial_click__' + JSON.stringify(args)); return original?.(...args); };
  });
  await page.locator('[data-editorial-cta="hero"]').click();
  await expect(page).toHaveURL(new RegExp('/quiz/v3-editorial/quiz/'));
  await expect(page.locator('main[data-stage]')).toHaveAttribute('data-stage', 'intro');
  const target = new URL(page.url());
  expect(target.searchParams.get('utm_campaign')).toBe('QUIZ_040');
  expect(target.searchParams.get('gbraid')).toBe('braid_fixture');
  expect(target.toString()).not.toMatch(/private_fixture|excluded|answers|severity|#/);
  await page.getByRole('button', { name: 'uso das suas respostas', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('não são salvas');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const initial = await events(page);
  checkPrivacy(initial, QUIZ_ID);
  expect(initial.google.filter(([name]) => name === 'page_view')).toHaveLength(1);
  expect(initial.google.filter(([name]) => name === 'landing_view').map(([, params]) => params.page_kind)).toEqual(['quiz']);
  expect(initial.google.filter(([name]) => name === 'quiz_step_view').map(([, params]) => params.step_index)).toEqual([1]);
  expect(initial.google.some(([name]) => name === 'quiz_start')).toBe(false);
  expect(clicks.filter(command => command[1] === 'quiz_cover_cta').map(command => command[2].cta_location)).toEqual(['hero']);
  expect(evidence.errors).toEqual([]);
});

test('v3 mobile 375: 14 respostas, 18 etapas, voltar, VSL real e oferta visível com três kits', async ({ page }, testInfo) => {
  test.setTimeout(45000);
  await page.setViewportSize({ width: 375, height: 812 });
  const evidence = await isolate(page);
  await observePlayAttempts(page);
  await page.goto(BASE + FLOW + PARAMS);
  const progress = page.locator('main[data-step-index]');
  await expect(progress).toHaveAttribute('data-step-index', '1');
  await page.locator('main button.cb-option').first().click();
  await expect(progress).toHaveAttribute('data-step-index', '2');
  await page.getByRole('button', { name: 'Voltar', exact: true }).click();
  await expect(progress).toHaveAttribute('data-step-index', '1');
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
  const trace = await finishQuiz(page, { restoreWeight: true, inspectResearch: true });
  await checkScreen(page);
  await expect.poll(async () => (await events(page)).google.filter(([name]) => name === 'quiz_result_view').length).toBe(1);
  const resultBeforeScroll = await events(page);
  const named = (result, name) => result.google.filter(([event]) => event === name).map(([, params]) => params);
  expect(named(resultBeforeScroll, 'quiz_start')).toHaveLength(1);
  expect(named(resultBeforeScroll, 'quiz_step_view').map(params => params.step_index)).toEqual(Array.from({ length: 18 }, (_, i) => i + 1));
  expect(named(resultBeforeScroll, 'quiz_answer').map(params => params.step_index)).toEqual([1, 2, 3, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16]);
  expect(named(resultBeforeScroll, 'quiz_back')).toHaveLength(2);
  expect(named(resultBeforeScroll, 'quiz_back')[0]).toMatchObject({ from_step_index: 2, to_step_index: 1, back_count: 1 });
  expect(named(resultBeforeScroll, 'quiz_back')[1]).toMatchObject({ from_step_index: 7, to_step_index: 6, back_count: 2 });
  expect(named(resultBeforeScroll, 'quiz_step_revisit')).toContainEqual(expect.objectContaining({ step_index: 1, visit_count: 2 }));
  expect(named(resultBeforeScroll, 'quiz_complete')).toHaveLength(1);
  expect(named(resultBeforeScroll, 'quiz_result_view')).toHaveLength(1);
  expect(named(resultBeforeScroll, 'view_item')).toHaveLength(0);
  expect(resultBeforeScroll.meta.filter(command => command[2] === 'ViewContent')).toHaveLength(0);
  expect(evidence.requests.some(url => new URL(url).pathname === VIDEO)).toBe(false);
  const section = page.locator('[data-quiz-vsl]');
  const video = section.locator('video');
  await setVideoVisibility(video, 0.49);
  await page.waitForTimeout(200);
  expect(await playAttempts(page)).toHaveLength(0);
  expect(evidence.requests.some(url => new URL(url).pathname === VIDEO)).toBe(false);
  await setVideoVisibility(video, 0.51);
  await expect.poll(() => video.evaluate(element => element.currentTime), { timeout: 15000 }).toBeGreaterThan(0.25);
  expect(await video.evaluate(element => element.muted)).toBe(true);
  await video.scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath('editorial-vsl-muted-375.png') });
  await section.getByRole('button', { name: 'Ativar som', exact: true }).click();
  await expect.poll(() => video.evaluate(element => element.muted)).toBe(false);
  const playback = await video.evaluate(element => ({ duration: element.duration, width: element.videoWidth, height: element.videoHeight, currentTime: element.currentTime, readyState: element.readyState, muted: element.muted, audioDecodedBytes: element.webkitAudioDecodedByteCount, videoDecodedBytes: element.webkitVideoDecodedByteCount }));
  expect(playback.duration).toBeCloseTo(276.341, 1);
  expect(playback.width).toBe(720);
  expect(playback.height).toBe(1280);
  expect(playback.audioDecodedBytes).toBeGreaterThan(0);
  expect(playback.videoDecodedBytes).toBeGreaterThan(0);
  await video.evaluate(element => element.pause());
  await video.evaluate(element => { element.muted = true; });
  await expect(section.getByRole('button', { name: 'Ativar som', exact: true })).toBeVisible();
  const afterPlay = await events(page);
  expect(named(afterPlay, 'vsl_visible')).toHaveLength(1);
  expect(named(afterPlay, 'vsl_start')).toHaveLength(1);
  expect(named(afterPlay, 'vsl_unmute')).toHaveLength(1);
  expect(named(afterPlay, 'vsl_mute')).toHaveLength(1);
  expect(named(afterPlay, 'vsl_pause')).toHaveLength(1);
  // Deterministic coverage test is separate from the real decoder checks above.
  await video.evaluate(element => {
    Object.defineProperty(element, 'played', { configurable: true, get: () => ({ length: 1, start: () => 0, end: () => element.duration * 0.05 }) });
    Object.defineProperty(element, 'ended', { configurable: true, get: () => true });
    element.dispatchEvent(new Event('ended'));
  });
  expect(named(await events(page), 'vsl_complete')).toHaveLength(0);
  for (const percent of [25, 25, 50, 75, 99.5]) {
    await video.evaluate((element, percent) => {
      Object.defineProperty(element, 'played', { configurable: true, get: () => ({ length: 1, start: () => 0, end: () => element.duration * percent / 100 }) });
      element.dispatchEvent(new Event('timeupdate'));
      if (percent > 99) element.dispatchEvent(new Event('ended'));
    }, percent);
  }
  // Seeing testimonials alone must not count as seeing the purchasable kits.
  await page.locator('[data-quiz-social-proof]').evaluate(element => {
    const proofTop = element.getBoundingClientRect().top + scrollY;
    const kitsTop = document.querySelector('#quiz-kits').getBoundingClientRect().top + scrollY;
    scrollTo(0, Math.min(proofTop - 64, kitsTop - innerHeight - 10));
  });
  await expect.poll(() => page.locator('[data-quiz-social-proof]').evaluate(element => Math.max(0, Math.min(innerHeight, element.getBoundingClientRect().bottom) - Math.max(0, element.getBoundingClientRect().top)))).toBeGreaterThan(0);
  expect(await page.locator('#quiz-kits').evaluate(element => element.getBoundingClientRect().top >= innerHeight)).toBe(true);
  await page.waitForTimeout(150);
  expect(named(await events(page), 'view_item')).toHaveLength(0);
  await page.screenshot({ path: testInfo.outputPath('editorial-social-proof-375.png') });
  await page.locator('[data-view-kits]').click();
  await expect(page.locator('#quiz-kits')).toBeFocused();
  await expect.poll(async () => named(await events(page), 'view_item').length).toBe(1);
  await page.screenshot({ path: testInfo.outputPath('editorial-kits-375.png') });
  for (const quantity of [1, 2, 3]) {
    const kit = page.getByRole('group', { name: 'Kits disponíveis' }).locator('button').filter({ hasText: new RegExp(`${quantity} frascos?`) });
    await kit.click();
    await expect(kit).toHaveAttribute('aria-pressed', 'true');
    await clickCheckout(page, evidence);
    const target = new URL(evidence.checkouts.at(-1));
    expect(target.searchParams.get('quantity')).toBe(String(quantity));
    expect(target.searchParams.get('utm_campaign')).toBe('QUIZ_040');
    expect(target.searchParams.get('gbraid')).toBe('braid_fixture');
  }
  const result = await events(page);
  expect(named(result, 'quiz_view_kits')).toHaveLength(1);
  expect(named(result, 'quiz_content_link').map(({ link_id, link_location }) => [link_id, link_location])).toEqual([['medicine_alert', 'quiz'], ['medicine_leaflet', 'quiz'], ['research_paper', 'quiz']]);
  expect(named(result, 'view_item')).toHaveLength(1);
  expect(named(result, 'vsl_progress').map(params => params.percent)).toEqual([25, 50, 75]);
  expect(named(result, 'vsl_complete')).toHaveLength(1);
  for (const event of ['select_item', 'begin_checkout']) expect(named(result, event).map(params => params.value)).toEqual([79.9, 154.8, 199.9]);
  expect(result.meta.filter(command => command[0] === 'trackSingle').map(command => command[2])).toEqual(['PageView', 'ViewContent', 'InitiateCheckout', 'InitiateCheckout', 'InitiateCheckout']);
  checkPrivacy(result, QUIZ_ID);
  expect(evidence.errors).toEqual([]);
  expect(evidence.requests.some(url => url.includes('/scripts/pixel/'))).toBe(false);
  const evidencePath = testInfo.outputPath('editorial-flow-playback.json');
  fs.writeFileSync(evidencePath, JSON.stringify({ trace, playback, events: result }, null, 2));
  await testInfo.attach('editorial-flow-playback', { path: evidencePath, contentType: 'application/json' });
});


test('v3 mobile 390: erro de vídeo não impede kits, SDK Google conserva linker e GPC suprime scripts', async ({ page, context }, testInfo) => {
  test.setTimeout(45000);
  test.skip(!GOOGLE_FIXTURE, 'Requer GOOGLE_TAG_FIXTURE local para conferir o linker real sem coleta externa.');
  await page.setViewportSize({ width: 390, height: 844 });
  const evidence = await isolate(page, { google: true, failVideo: true });
  await page.goto(PUBLIC + FLOW + PARAMS);
  await expect.poll(() => evidence.hits.length, { timeout: 15000 }).toBeGreaterThan(0);
  await finishQuiz(page, { inspectResearch: true });
  await checkScreen(page);
  const video = page.locator('[data-quiz-vsl] video');
  await video.scrollIntoViewIfNeeded();
  await expect(page.locator('[data-quiz-vsl] [role="status"]')).toContainText('Não foi possível carregar o vídeo');
  expect(evidence.requests.some(url => new URL(url).pathname === VIDEO)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('editorial-media-error-390.png'), fullPage: true });
  await expect(page.getByRole('group', { name: 'Kits disponíveis' })).toBeVisible();
  const cookies = await page.evaluate(() => document.cookie);
  const result = await events(page);
  checkPrivacy(result, 'cowboy_v3_editorial');
  expect(result.google.filter(([name]) => name === 'vsl_error')).toHaveLength(1);
  expect(result.google.some(([name]) => ['vsl_start', 'vsl_progress', 'vsl_complete'].includes(name))).toBe(false);
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
  expect(destination.searchParams.get('utm_campaign')).toBe('QUIZ_040');
  expect(destination.searchParams.get('cid')).toBe('vsl_fixture');
  expect(destination.searchParams.get('gbraid')).toBe('braid_fixture');
  expect(destination.toString()).not.toMatch(/private_fixture|excluded|answers|severity/);
  expect(JSON.stringify(evidence.hits)).not.toMatch(/private_fixture|excluded|severity|weight|question_id|answers|diabetes|infarto|gravidade/i);
  expect(evidence.errors).toEqual([]);
  testInfo.annotations.push({ type: 'scope', description: 'Linker/cookies e redirecionamento comprovados localmente. Não comprova processamento GA/Meta ou Purchase; limite de captura no unload documentado na QUIZ-037.' });
  const linkerPath = testInfo.outputPath('editorial-linker-isolated.json');
  fs.writeFileSync(linkerPath, JSON.stringify(evidence, null, 2));
  await testInfo.attach('editorial-linker-isolated', { path: linkerPath, contentType: 'application/json' });
  const privatePage = await context.newPage();
  const privateEvidence = await isolate(privatePage);
  await privatePage.addInitScript(() => Object.defineProperty(navigator, 'globalPrivacyControl', { get: () => true }));
  await privatePage.goto(BASE + FLOW + PARAMS);
  await expect(privatePage.locator('main[data-stage]')).toHaveAttribute('data-stage', 'intro');
  expect(await events(privatePage)).toEqual({ google: [], meta: [], storage: {} });
  expect(privateEvidence.requests.every(url => new URL(url).origin === new URL(BASE).origin)).toBe(true);
  await privatePage.close();
});

test('v3 mobile 390: autoplay bloqueado oferece reprodução por gesto sem inventar eventos', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const evidence = await isolate(page);
  await observePlayAttempts(page, { rejectFirst: true });
  await page.goto(BASE + FLOW + PARAMS);
  await finishQuiz(page);
  const section = page.locator('[data-quiz-vsl]');
  const video = section.locator('video');
  expect(evidence.requests.some(url => new URL(url).pathname === VIDEO)).toBe(false);
  await video.scrollIntoViewIfNeeded();
  await expect(section.getByRole('status')).toContainText('Toque no botão para iniciar o vídeo.');
  await expect(section.getByRole('button', { name: 'Reproduzir vídeo com som', exact: true })).toBeVisible();
  expect(await video.evaluate(element => element.paused)).toBe(true);
  expect((await playAttempts(page)).length).toBe(1);
  expect((await events(page)).google.filter(([name]) => name === 'vsl_autoplay_blocked')).toHaveLength(1);
  expect((await events(page)).google.some(([name]) => ['vsl_start', 'vsl_progress', 'vsl_complete'].includes(name))).toBe(false);
  expect(evidence.requests.some(url => new URL(url).pathname === VIDEO)).toBe(false);
  await page.screenshot({ path: testInfo.outputPath('editorial-autoplay-blocked-390.png') });
  await page.evaluate(() => window.scrollTo(0, 0));
  await video.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  expect((await playAttempts(page)).length).toBe(1);
  // The failed player must not trap purchase navigation; 204 keeps this test local.
  await clickCheckout(page, evidence);
  expect(new URL(evidence.checkouts[0]).searchParams.get('quantity')).toBe('3');
  await section.getByRole('button', { name: 'Reproduzir vídeo com som', exact: true }).click();
  await expect.poll(() => video.evaluate(element => element.currentTime), { timeout: 15000 }).toBeGreaterThan(0.25);
  expect(await video.evaluate(element => ({ paused: element.paused, muted: element.muted }))).toEqual({ paused: false, muted: false });
  await expect(section.getByRole('status')).toHaveCount(0);
  expect((await playAttempts(page)).length).toBe(2);
  const result = await events(page);
  expect(result.google.filter(([name]) => name === 'vsl_start')).toHaveLength(1);
  expect(result.google.some(([name]) => name === 'vsl_progress' || name === 'vsl_complete')).toBe(false);
  checkPrivacy(result, 'cowboy_v3_editorial');
  expect(evidence.errors).toEqual([]);
  await video.evaluate(element => element.pause());
});

for (const preference of ['GPC', 'GA opt-out']) {
  test(`v3 ${preference}: capa e entrada do quiz sem scripts externos ou eventos`, async ({ page }) => {
    const evidence = await isolate(page);
    await page.addInitScript(preference => {
      if (preference === 'GPC') Object.defineProperty(navigator, 'globalPrivacyControl', { get: () => true });
      else window['ga-disable-G-VYR2542XCN'] = true;
    }, preference);
    await page.goto(BASE + COVER + PARAMS);
    await expect(page.locator('[data-quiz-editorial]')).toBeVisible();
    expect(await events(page)).toEqual({ google: [], meta: [], storage: {} });
    await page.locator('[data-editorial-cta="hero"]').click();
    await expect(page.locator('main[data-stage]')).toHaveAttribute('data-stage', 'intro');
    await page.locator('main button.cb-option').first().click();
    await expect(page.locator('main[data-step-index]')).toHaveAttribute('data-step-index', '2');
    for (const step of [3, 4]) {
      await page.locator('main button.cb-option').first().click();
      await expect(page.locator('main[data-step-index]')).toHaveAttribute('data-step-index', String(step));
    }
    await checkSource(page, page.locator('[data-medicine-alert]'), MEDICINE_ALERT_URL, { open: true });
    await checkSource(page, page.locator('[data-medicine-leaflet]'), MEDICINE_LEAFLET_URL, { open: true });
    expect(await events(page)).toEqual({ google: [], meta: [], storage: {} });
    expect(evidence.requests.every(url => new URL(url).origin === new URL(BASE).origin)).toBe(true);
    expect(evidence.errors).toEqual([]);
    expect(page.url()).not.toMatch(/private_fixture|excluded|answers|severity|#/);
  });
}
