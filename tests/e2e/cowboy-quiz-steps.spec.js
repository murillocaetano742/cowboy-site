'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('node:fs');

const BASE = process.env.E2E_BASE || 'http://127.0.0.1:4418';
const PUBLIC = 'https://cowboyenergiamasculina.com.br';
const COVER = '/quiz/v5-etapas/';
const FLOW = '/quiz/v5-etapas/quiz/';
const QUIZ_ID = 'cowboy_v5_etapas';
const VIDEO = '/videos/vsl/vsl-dr-durval-720.mp4';
const PARAMS = '?utm_source=validation&utm_medium=qa&utm_campaign=QUIZ_048&cid=journey_fixture&gbraid=braid_fixture&email=excluded%40example.test&answers=private_fixture&severity=private_fixture&symptom_intensity=very_high&score=999#private_fixture';
const INTENSITIES = [
  { answer:'Não percebo dificuldade hoje', label:'Nenhuma', gauge:6 },
  { answer:'Leve', label:'Leve', gauge:26 },
  { answer:'Moderada', label:'Moderada', gauge:48 },
  { answer:'Alta', label:'Alta', gauge:70 },
  { answer:'Muito alta', label:'Muito alta', gauge:94 },
];
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
      if (url.pathname === VIDEO && new URL(BASE).hostname === '127.0.0.1') {
        // The lightweight local server has no Range support. Serve the actual
        // built MP4 with production-equivalent byte ranges for native seeking.
        const media = fs.readFileSync(`dist${VIDEO}`);
        const range = /^bytes=(\d+)-(\d*)$/.exec(request.headers().range || '');
        const start = range ? Number(range[1]) : 0;
        const end = range?.[2] ? Math.min(Number(range[2]), media.length - 1) : media.length - 1;
        return route.fulfill({ status: range ? 206 : 200, contentType: 'video/mp4',
          headers: { 'accept-ranges': 'bytes', 'content-length': String(end - start + 1), ...(range ? { 'content-range': `bytes ${start}-${end}/${media.length}` } : {}) },
          body: media.subarray(start, end + 1) });
      }
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
  expect(JSON.stringify(snapshot)).not.toMatch(/private_fixture|excluded|severity|weight_kg|question_id|confidence_impact|symptom_intensity|very_high|moderate|intro_performance|answers|diabetes|infarto|gravidade|tadala|cialis|nitrato|Bastante|Muito|Um pouco|Nada|Nenhuma|Leve|Moderada|Alta/);
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

async function finishQuiz(page, intensity = INTENSITIES[0], { inspectSources = false, resultViewport, floating = false } = {}) {
  const main = page.locator('main[data-step-index]');
  for (let step = 1; step <= 18; step += 1) {
    await expect(main).toHaveAttribute('data-step-index', String(step));
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(step));
    await expect(page.getByRole('progressbar')).toHaveCount(1);
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '21');
    if (step < 18) expect((await main.locator('img').evaluateAll(images => images.map(image => image.getAttribute('src')))).join(' ')).not.toMatch(/\/(?:kit-\d|cliente-\d|sem-receita|caixa-discreta|depoimento)[^/]*\./i);
    if (step === 18) break;
    if (step === 3) {
      await expect(main.locator('h2')).toHaveText('Como você avalia a intensidade dessa dificuldade hoje?');
      await main.getByRole('button', { name: intensity.answer, exact: true }).click();
    } else if (step === 4 || step === 10) {
      if (step === 4 && floating) await checkFloating(page);
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
      // Health/age answers must never inflate the visitor's declared intensity.
      await ([5, 12, 14].includes(step) ? options.last() : options.first()).click();
    }
  }
  await expect(page.locator('[data-journey-screen="result"]')).toBeVisible();
  await expect(page.locator('[data-journey-intensity]')).toHaveText(new RegExp(`^${intensity.label}$`,'i'));
}

async function openPresentation(page) {
  await page.locator('[data-journey-next="result"]').click();
  await expect(page.locator('[data-journey-screen="presentation"]')).toBeVisible();
  await expect(page.locator('[data-journey-screen="result"]')).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => document.activeElement?.closest('[data-journey-screen]')?.getAttribute('data-journey-screen'))).toBe('presentation');
  await checkStep(page, 19);
}

async function openTestimonials(page) {
  await expect(page.locator('[data-journey-next="presentation"]')).toHaveText('Escolher meu kit');
  await expect(page.locator('[data-journey-next="presentation"]')).toBeEnabled();
  await page.locator('[data-journey-next="presentation"]').click();
  await expect(page.locator('[data-journey-screen="testimonials"]')).toBeVisible();
  await expect(page.locator('[data-journey-screen="presentation"]')).not.toBeVisible();
  await expect(page.locator('[data-journey-screen="offer"]')).not.toBeVisible();
  await expect(page.locator('[data-journey-screen="testimonials"] [data-journey-title]')).toBeFocused();
  await checkStep(page, 20);
}

async function finishPresentation(page) {
  const video=page.locator('[data-quiz-vsl] video');
  await expect.poll(()=>video.evaluate(element=>Number.isFinite(element.duration)&&element.duration>0),{timeout:15000}).toBe(true);
  await video.evaluate(async element=>{element.currentTime=element.duration-2;await element.play();});
  await expect.poll(()=>video.evaluate(element=>element.ended),{timeout:5000}).toBe(true);
  await expect(page.locator('[data-journey-next="presentation"]')).toBeEnabled();
  // Reaching ended by seeking may unlock the UI, but is not watched completion.
  expect(named(await events(page),'vsl_complete')).toHaveLength(0);
}

async function assertEntryPlayback(page) {
  const video=page.locator('[data-quiz-vsl] video');
  await expect.poll(()=>video.evaluate(element=>element.currentTime),{timeout:15000}).toBeGreaterThan(.25);
  expect(await page.evaluate(()=>scrollY)).toBe(0);
  expect(await video.evaluate(element=>element.muted&&element.playsInline)).toBe(true);
  expect(await page.evaluate(()=>window.__journeyPlayAttempts[0].visibility)).toBeGreaterThanOrEqual(.5);
  const box=await video.boundingBox();
  const dockTop=await page.locator('[data-journey-dock]').evaluate(element=>element.getBoundingClientRect().top);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y+box.height).toBeLessThanOrEqual(dockTop+1);
  await expect(page.locator('[data-journey-next="presentation"]')).toHaveCount(0);
  await noOverflow(page);
}

async function openOffer(page) {
  if (await page.locator('[data-journey-screen="presentation"]').isVisible()) await openTestimonials(page);
  await expect(page.locator('[data-journey-next="testimonials"]')).toHaveText('Escolher meu kit');
  await page.locator('[data-journey-next="testimonials"]').click();
  await expect(page.locator('[data-journey-screen="offer"]')).toBeVisible();
  await expect(page.locator('[data-journey-screen="presentation"]')).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => document.activeElement?.closest('[data-journey-screen]')?.getAttribute('data-journey-screen'))).toBe('offer');
  await checkStep(page, 21);
  await expect(page.locator('[data-quiz-social-proof]:visible')).toHaveCount(0);
}

async function checkStep(page, step) {
  await expect(page.locator('main[data-step-index]')).toHaveAttribute('data-step-index', String(step));
  await expect(page.getByRole('progressbar')).toHaveCount(1);
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(step));
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '21');
  const ids=await page.locator('[data-journey] [id]').evaluateAll(elements=>elements.map(element=>element.id));
  expect(ids.filter((id,index)=>ids.indexOf(id)!==index)).toEqual([]);
}

async function checkFloating(page) {
  const button = page.locator('[data-floating-continue]');
  await expect(button).toHaveCount(1);
  await expect(page.locator('[data-quiz-medicine]').getByRole('button', {name:'CONTINUAR',exact:true})).toHaveCount(1);
  const original = page.viewportSize();
  for (const size of [{width:375,height:667},{width:390,height:844},{width:1440,height:900},{width:1280,height:900}]) {
    await page.setViewportSize(size);
    await page.evaluate(zoom => { document.documentElement.style.zoom = zoom; scrollTo(0, 0); }, size.width===1280 ? '2' : '1');
    await button.focus();
    await expect(button).toBeFocused();
    await page.evaluate(()=>scrollTo(0,0));
    const geometry=await button.evaluate(element=>{
      const box=element.getBoundingClientRect();
      return {top:box.top,bottom:box.bottom,height:box.height,width:box.width,viewport:innerHeight,hit:element.contains(document.elementFromPoint(box.x+box.width/2,box.y+box.height/2)),position:getComputedStyle(element.closest('[data-floating-continue]')).position};
    });
    expect(geometry.top).toBeGreaterThanOrEqual(0);
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewport);
    expect(geometry.height).toBeGreaterThanOrEqual(44);
    expect(geometry.hit).toBe(true);
    const lastNote=page.locator('[data-quiz-medicine] p').last();
    await lastNote.scrollIntoViewIfNeeded();
    await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
    const bottom=await lastNote.evaluate(element=>element.getBoundingClientRect().bottom);
    const buttonTop=await button.evaluate(element=>element.getBoundingClientRect().top);
    expect(bottom).toBeLessThanOrEqual(buttonTop);
    await noOverflow(page);
  }
  await page.evaluate(()=>{document.documentElement.style.zoom='1';});
  await page.setViewportSize(original);
}

async function checkDock(page, lastContent) {
  const dock=page.locator('[data-journey-dock]');
  await expect(dock).toHaveCount(1);
  const action=dock.locator('button,a');
  await expect(action).toHaveCount(1);
  const original=page.viewportSize();
  for(const size of [{width:375,height:667},{width:390,height:844},{width:1440,height:900},{width:1280,height:900}]) {
    await page.setViewportSize(size);
    await page.evaluate(async zoom=>{
      document.documentElement.style.zoom=zoom;
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      scrollTo(0,0);
    },size.width===1280?'2':'1');
    const box=await action.boundingBox();
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y+box.height).toBeLessThanOrEqual(size.height);
    expect(box.height).toBeGreaterThanOrEqual(44);
    if(await action.isEnabled()) {
      await action.focus();
      await expect(action).toBeFocused();
    }
    if(lastContent) {
      await lastContent.scrollIntoViewIfNeeded();
      await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
      const bottom=await lastContent.evaluate(element=>element.getBoundingClientRect().bottom);
      expect(bottom).toBeLessThanOrEqual(await dock.evaluate(element=>element.getBoundingClientRect().top));
    }
    await noOverflow(page);
  }
  await page.evaluate(()=>{document.documentElement.style.zoom='1';});
  await page.setViewportSize(original);
}

async function noOverflow(page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
}

async function clickCheckout(page, evidence) {
  const before = evidence.checkouts.length;
  await page.locator('[data-journey-checkout]').click();
  await expect.poll(() => evidence.checkouts.length, { timeout: 3000 }).toBe(before + 1);
}

for (const intensity of INTENSITIES) {
  test(`v5 resultado respeita intensidade ${intensity.label} com imagem e gauge, sem produto ou gravidade inferida`, async ({ page }, testInfo) => {
    const lowest=intensity.gauge===6;
    await page.setViewportSize({ width: lowest ? 375 : 390, height: 844 });
    const evidence = await isolate(page);
    await page.goto(BASE + COVER + PARAMS);
    await expect(page.locator('[data-editorial-cta="hero"]')).toHaveAttribute('href', /\/quiz\/v5-etapas\/quiz\//);
    await page.locator('[data-editorial-cta="hero"]').click();
    await expect(page).toHaveURL(new RegExp(FLOW));
    expect(page.url()).toContain('utm_campaign=QUIZ_048');
    if (lowest) {
      const consent = page.getByRole('button', { name: 'uso das suas respostas', exact: true });
      await consent.click();
      await expect(page.getByRole('dialog')).toContainText('A intensidade da dificuldade é aquela que você declarou, não uma classificação médica.');
      await expect(page.getByRole('dialog')).toContainText('As perguntas não calculam diagnóstico, gravidade clínica ou recomendação individual de kit.');
      await expect(page.getByRole('dialog')).not.toContainText('servem para medir a gravidade do seu caso');
      await page.keyboard.press('Escape');
      await expect(consent).toBeFocused();
    }
    await finishQuiz(page, intensity, { resultViewport: lowest ? { width: 375, height: 300 } : undefined, floating:lowest });
    const result = page.locator('[data-journey-screen="result"]');
    await expect(result).toContainText('Intensidade que você relatou');
    await expect(result).toContainText('É a sua percepção, não um diagnóstico médico.');
    await expect(result).not.toContainText(/Gravidade do seu caso|R\$|Protocolo|Indicado para|Pesa no seu caso|Seu maior medo/);
    const illustration=result.locator('img[src="/sites/cowboy/gravidade.webp"]');
    await expect(illustration).toHaveCount(1);
    await expect.poll(()=>illustration.evaluate(element=>element.complete&&element.naturalWidth>0)).toBe(true);
    expect(await result.locator('.cb-gauge-marker').evaluate(element=>element.style.left)).toBe(`${intensity.gauge}%`);
    const points=await result.locator('.cb-result-points li').allTextContents();
    expect(points.length).toBeGreaterThan(0);
    expect(points.every(text=>text.startsWith('Você informou '))).toBe(true);
    await expect(result.locator('img[src*="kit-"], img[src*="cliente-"]')).toHaveCount(0);
    await expect(page.locator('[data-journey-screen="presentation"]:visible, [data-journey-screen="offer"]:visible')).toHaveCount(0);
    expect(evidence.requests.some(url => new URL(url).pathname === VIDEO)).toBe(false);
    if (lowest) {
      const report = page.locator('[data-journey-report]');
      expect(await report.evaluate(element => element.getBoundingClientRect().top >= innerHeight)).toBe(true);
      expect(named(await events(page), 'quiz_result_view')).toHaveLength(0);
      await page.setViewportSize({ width: 375, height: 812 });
      await report.scrollIntoViewIfNeeded();
      await expect.poll(async () => named(await events(page), 'quiz_result_view').length).toBe(1);
      await checkDock(page,result.locator('p').last());
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

test('v5 mobile: quatro telas, vídeos reais pausam fora da etapa, histórico e kits preservam contexto', async ({ page }, testInfo) => {
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
  await finishQuiz(page, INTENSITIES[4]);
  await page.locator('[data-journey-report]').scrollIntoViewIfNeeded();
  await expect.poll(async()=>named(await events(page),'quiz_result_view').length).toBe(1);
  await openPresentation(page);
  const video = page.locator('[data-quiz-vsl] video');
  await assertEntryPlayback(page);
  await page.screenshot({ path: testInfo.outputPath('apresentacao-muted-375.png') });
  await page.getByRole('button', { name: 'Ativar som', exact: true }).click();
  await expect.poll(() => video.evaluate(element => element.muted)).toBe(false);
  const playback = await video.evaluate(element => ({ duration: element.duration, width: element.videoWidth, height: element.videoHeight, currentTime: element.currentTime, audioDecodedBytes: element.webkitAudioDecodedByteCount, videoDecodedBytes: element.webkitVideoDecodedByteCount }));
  expect(playback.duration).toBeCloseTo(276.341, 1);
  expect(playback.width).toBe(720);
  expect(playback.height).toBe(1280);
  expect(playback.audioDecodedBytes).toBeGreaterThan(0);
  expect(playback.videoDecodedBytes).toBeGreaterThan(0);
  await finishPresentation(page);
  await checkDock(page,page.locator('#quiz-vsl-caption'));
  await page.setViewportSize({width:375,height:300});
  await openTestimonials(page);
  await expect.poll(()=>video.evaluate(element=>element.paused)).toBe(true);
  const pausedAt = await video.evaluate(element => element.currentTime);
  const attempts = await page.evaluate(() => window.__journeyPlayAttempts.length);
  expect(named(await events(page), 'quiz_testimonials_view')).toHaveLength(0);
  expect(named(await events(page), 'view_item')).toHaveLength(0);
  await page.setViewportSize({width:375,height:812});
  const proof = page.locator('[data-journey-screen="testimonials"] [data-quiz-social-proof]');
  await expect(proof.locator('video')).toHaveCount(2);
  await expect(proof.locator('img')).toHaveCount(6);
  await expect(proof).toContainText('Tem duas semanas que eu tô tomando. Tô top demais agora.');
  await expect(proof).toContainText('Segundo frasco já que eu estou indo.');
  await expect(proof).not.toContainText(/1\.836|38 mil|4,8|92%/);
  await expect(page.locator('[data-journey-kits]:visible')).toHaveCount(0);
  await proof.locator('video').first().scrollIntoViewIfNeeded();
  await expect.poll(async()=>named(await events(page), 'quiz_testimonials_view').length).toBe(1);
  await proof.locator('video').evaluateAll(videos=>{
    window.__proofReferences=videos;
    return Promise.all(videos.map(video=>{video.muted=true;return video.play();}));
  });
  await expect.poll(()=>proof.locator('video').evaluateAll(videos=>videos.every(video=>video.currentTime>.25)),{timeout:15000}).toBe(true);
  const proofTimes=await proof.locator('video').evaluateAll(videos=>videos.map(video=>video.currentTime));
  await page.screenshot({path:testInfo.outputPath('depoimentos-375.png'),fullPage:true});
  await checkDock(page,proof.locator('figcaption').last());
  await openOffer(page);
  await expect.poll(()=>page.evaluate(()=>window.__proofReferences.every(video=>video.paused))).toBe(true);
  const offer = page.locator('[data-journey-screen="offer"]');
  await expect(offer).toContainText('Teste o COWBOY por 30 dias. Decida pela sua experiência.');
  await expect(offer).not.toContainText(/Gravidade|Indicado para o seu caso|Protocolo completo/);
  await expect(page.locator('[data-journey-intensity]')).toHaveText(/Muito alta/i);
  await expect(video).not.toBeVisible();
  expect(await video.evaluate(element => element.paused)).toBe(true);
  await expect(page.locator('[data-journey-checkout]')).toHaveCount(1);
  await expect(page.locator('[data-journey-dock] [data-journey-checkout]')).toHaveCount(1);
  await noOverflow(page);
  await page.screenshot({ path: testInfo.outputPath('oferta-topo-375.png') });
  await page.waitForTimeout(150);
  expect(named(await events(page), 'view_item')).toHaveLength(0);

  await page.goBack();
  await expect(page.locator('[data-journey-screen="testimonials"]')).toBeVisible();
  await checkStep(page,20);
  expect(await page.evaluate(()=>window.__proofReferences.every(video=>video.paused))).toBe(true);
  await page.goBack();
  await expect(page.locator('[data-journey-screen="presentation"]')).toBeVisible();
  await checkStep(page,19);
  await video.scrollIntoViewIfNeeded();
  await expect.poll(async () => named(await events(page), 'page_view').filter(params => params.page_kind === 'presentation').length).toBe(2);
  await page.waitForTimeout(250);
  expect(await video.evaluate(element => element.paused)).toBe(true);
  expect(await video.evaluate(element => element.currentTime)).toBeCloseTo(pausedAt, 1);
  expect(await page.evaluate(() => window.__journeyPlayAttempts.length)).toBe(attempts);
  await expect(page.locator('[data-journey-next="presentation"]')).toBeEnabled();
  await page.goBack();
  await expect(page.locator('[data-journey-screen="result"]')).toBeVisible();
  await checkStep(page,18);
  await page.locator('[data-journey-next="result"]').scrollIntoViewIfNeeded();
  await expect.poll(async () => named(await events(page), 'page_view').filter(params => params.page_kind === 'result').length).toBe(2);
  await expect(page.locator('[data-journey-intensity]')).toHaveText(/Muito alta/i);
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
  await checkDock(page,offer.locator('footer p').last());
  await page.locator('[data-offer-view-kits]').click();
  await page.screenshot({ path: testInfo.outputPath('kits-375.png') });
  const two = page.getByRole('group',{name:'Kits disponíveis'}).locator('button').filter({hasText:'2 frascos'});
  await two.click();
  await page.goBack();
  await expect(page.locator('[data-journey-screen="testimonials"]')).toBeVisible();
  expect(await page.evaluate(()=>window.__proofReferences.every(video=>video.paused))).toBe(true);
  await page.goForward();
  await expect(page.locator('[data-journey-screen="offer"]')).toBeVisible();
  await expect(two).toHaveAttribute('aria-pressed','true');
  for (const quantity of [1, 2, 3]) {
    const kit = page.getByRole('group', { name: 'Kits disponíveis' }).locator('button').filter({ hasText: new RegExp(`${quantity} frascos?`) });
    await kit.click();
    await expect(kit).toHaveAttribute('aria-pressed', 'true');
    await clickCheckout(page, evidence);
    const target = new URL(evidence.checkouts.at(-1));
    expect(target.searchParams.get('quantity')).toBe(String(quantity));
    expect(target.searchParams.get('utm_campaign')).toBe('QUIZ_048');
    expect(target.searchParams.get('gbraid')).toBe('braid_fixture');
  }
  const snapshot = await events(page);
  privacy(snapshot);
  expect(named(snapshot, 'quiz_complete')).toHaveLength(1);
  expect(named(snapshot, 'quiz_result_view')).toHaveLength(1);
  expect(named(snapshot, 'view_item')).toHaveLength(1);
  expect(named(snapshot, 'vsl_start')).toHaveLength(1);
  expect(named(snapshot, 'vsl_complete')).toHaveLength(0);
  expect(named(snapshot, 'begin_checkout').map(params => params.value)).toEqual([79.9,154.8,199.9]);
  expect([...new Set(named(snapshot,'select_item').map(params=>params.value))].sort((a,b)=>a-b)).toEqual([79.9,154.8,199.9]);
  expect(named(snapshot,'quiz_answer')).toHaveLength(14);
  expect(named(snapshot,'quiz_step_view').map(params=>params.step_index)).toEqual(Array.from({length:21},(_,index)=>index+1));
  expect(named(snapshot,'quiz_testimonials_view')).toHaveLength(1);
  expect(named(snapshot, 'quiz_journey_view').map(params => params.page_kind)).toEqual(['result', 'presentation', 'testimonials','offer']);
  expect(named(snapshot, 'page_view').filter(params => ['result', 'presentation', 'testimonials','offer'].includes(params.page_kind)).map(params => params.page_kind)).toEqual(['result', 'presentation','testimonials', 'offer','testimonials', 'presentation', 'result', 'presentation','testimonials', 'offer','testimonials','offer']);
  expect(named(snapshot, 'quiz_journey_action').map(params => params.cta_location)).toEqual(expect.arrayContaining(['result_continue', 'presentation_continue','testimonials_continue', 'offer_view_kits']));
  expect(snapshot.history.cowboyJourney).toBe('offer');
  expect(evidence.errors).toEqual([]);
  const file = testInfo.outputPath('jornada-playback-e-eventos.json');
  fs.writeFileSync(file, JSON.stringify({ playback, proofTimes, snapshot }, null, 2));
  await testInfo.attach('jornada-playback-e-eventos', { path: file, contentType: 'application/json' });

  await page.reload();
  await expect(page.locator('main[data-step-index]')).toHaveAttribute('data-step-index', '1');
  await expect(page.getByText('Esta sessão foi reiniciada. Responda novamente para ver seu resumo.', { exact: true })).toBeVisible();
  await expect(page.locator('[data-journey-intensity]')).toHaveCount(0);
  await expect(page.locator('[data-journey-screen="offer"]:visible')).toHaveCount(0);
  privacy(await events(page));
});

test('v5 SDK real: fontes sem atribuição, erro de vídeo permite oferta, linker e cookies chegam ao checkout isolado', async ({ page }, testInfo) => {
  test.skip(!GOOGLE_FIXTURE || !UTM_FIXTURE, 'Requer fixtures locais dos SDKs Google e UTMify; nunca coleta externa.');
  await page.setViewportSize({ width: 390, height: 844 });
  const evidence = await isolate(page, { google: true, failVideo: true });
  await page.goto(PUBLIC + FLOW + PARAMS);
  await expect.poll(() => evidence.hits.length, { timeout: 15000 }).toBeGreaterThan(0);
  await finishQuiz(page, INTENSITIES[0], { inspectSources: true });
  expect(named(await events(page), 'quiz_content_link').map(({ link_id, link_location }) => [link_id, link_location])).toEqual(SOURCES.map(([, , id]) => [id, 'quiz']));
  await openPresentation(page);
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
  expect(destination.searchParams.get('utm_campaign')).toBe('QUIZ_048');
  expect(destination.searchParams.get('cid')).toBe('journey_fixture');
  expect(destination.searchParams.get('gbraid')).toBe('braid_fixture');
  expect(destination.toString()).not.toMatch(/private_fixture|excluded|answers|severity|confidence_impact|symptom_intensity|very_high|score/);
  expect(JSON.stringify(evidence.hits)).not.toMatch(/private_fixture|excluded|severity|weight_kg|question_id|confidence_impact|symptom_intensity|very_high|answers/);
  expect(evidence.errors).toEqual([]);
  fs.writeFileSync(testInfo.outputPath('jornada-linker-isolado.json'), JSON.stringify(evidence, null, 2));
  testInfo.annotations.push({ type: 'scope', description: 'SDKs reais com coleta interceptada; não comprova processamento GA/Meta ou compra aprovada.' });
});

test('v5 autoplay bloqueado: alternativa explícita segue sem vídeo e retorno pausado permite reprodução manual', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const evidence = await isolate(page, { rejectAutoplay: true });
  await page.goto(BASE + FLOW + PARAMS);
  await finishQuiz(page, INTENSITIES[1]);
  await openPresentation(page);
  const video = page.locator('[data-quiz-vsl] video');
  await expect(page.getByRole('button', { name: 'Reproduzir vídeo com som', exact: true })).toBeVisible();
  await expect(page.locator('[data-journey-next="presentation"]')).toHaveCount(0);
  expect(named(await events(page), 'vsl_autoplay_blocked')).toHaveLength(1);
  for (const event of ['vsl_start', 'vsl_progress', 'vsl_complete']) expect(named(await events(page), event)).toHaveLength(0);
  expect(evidence.requests.some(url => new URL(url).pathname === VIDEO)).toBe(false);
  await page.locator('[data-vsl-continue-fallback]').click();
  await expect(page.locator('[data-journey-screen="testimonials"]')).toBeVisible();
  await openOffer(page);
  await clickCheckout(page, evidence);
  await page.locator('[data-journey-back]').click();
  await expect(page.locator('[data-journey-screen="testimonials"]')).toBeVisible();
  await page.locator('[data-journey-back]').click();
  await expect(page.locator('[data-journey-screen="presentation"]')).toBeVisible();
  expect(await video.evaluate(element => element.paused)).toBe(true);
  expect(await page.evaluate(() => window.__journeyPlayAttempts.length)).toBe(1);
  await expect(page.locator('[data-journey-next="presentation"]')).toBeEnabled();
  await page.getByRole('button', { name: 'Reproduzir vídeo com som', exact: true }).click();
  await expect.poll(() => video.evaluate(element => element.currentTime), { timeout: 15000 }).toBeGreaterThan(0.25);
  expect(await video.evaluate(element => element.muted)).toBe(false);
  await video.evaluate(element => element.pause());
  privacy(await events(page));
  expect(evidence.errors).toEqual([]);
});

for (const preference of ['GPC', 'GA opt-out']) {
  test(`v5 ${preference}: quatro telas e checkout funcionam sem scripts externos, eventos ou resumo persistido`, async ({ page }) => {
    const evidence = await isolate(page, { preference });
    await page.goto(BASE + COVER + PARAMS);
    await page.locator('[data-editorial-cta="hero"]').click();
    await finishQuiz(page, INTENSITIES[4]);
    await openPresentation(page);
    await finishPresentation(page);
    await openOffer(page);
    await clickCheckout(page, evidence);
    const snapshot = await events(page);
    expect(snapshot.google).toEqual([]);
    expect(snapshot.meta).toEqual([]);
    expect(snapshot.storage).toEqual({ session: {}, local: {} });
    privacy(snapshot);
    expect(evidence.requests.every(url => new URL(url).origin === new URL(BASE).origin)).toBe(true);
    expect(new URL(evidence.checkouts[0]).searchParams.get('utm_campaign')).toBe('QUIZ_048');
    expect(evidence.errors).toEqual([]);
  });
}

for(const size of [{width:375,height:667},{width:390,height:844}]) {
  test(`v5 VSL inicia sem rolagem em${size.width}x${size.height}, CTA aparece após ended sem inventar conclusão`,async({page},testInfo)=>{
    await page.setViewportSize(size);
    const evidence=await isolate(page);
    await page.goto(BASE+FLOW+PARAMS);
    await finishQuiz(page,INTENSITIES[2]);
    await openPresentation(page);
    await assertEntryPlayback(page);
    const video=page.locator('[data-quiz-vsl] video');
    await page.screenshot({path:testInfo.outputPath('vsl-entrada-sem-scroll.png')});
    await video.evaluate(element=>element.pause());
    const pausedAt=await video.evaluate(element=>element.currentTime);
    await page.evaluate(()=>{scrollTo(0,document.documentElement.scrollHeight);scrollTo(0,0);});
    await page.waitForTimeout(300);
    expect(await video.evaluate(element=>element.paused)).toBe(true);
    expect(await video.evaluate(element=>element.currentTime)).toBeCloseTo(pausedAt,1);
    await expect(page.locator('[data-journey-next="presentation"]')).toHaveCount(0);
    await finishPresentation(page);
    await expect.poll(async()=>{
      const videoBottom=await video.evaluate(element=>element.getBoundingClientRect().bottom);
      const dockTop=await page.locator('[data-journey-dock]').evaluate(element=>element.getBoundingClientRect().top);
      return videoBottom-dockTop;
    }).toBeLessThanOrEqual(1);
    await page.screenshot({path:testInfo.outputPath('vsl-cta-liberado.png')});
    await openTestimonials(page);
    await page.locator('[data-journey-back]').click();
    await expect(page.locator('[data-journey-next="presentation"]')).toBeEnabled();
    expect(await video.evaluate(element=>element.paused)).toBe(true);
    expect(named(await events(page),'vsl_complete')).toHaveLength(0);
    privacy(await events(page));
    expect(evidence.errors).toEqual([]);
  });
}

test('v5 MP4 sem suporte libera continuidade com aviso, sem reprodução ou conclusão fictícia',async({page})=>{
  await page.setViewportSize({width:375,height:667});
  const evidence=await isolate(page);
  await page.addInitScript(()=>{
    const native=HTMLMediaElement.prototype.canPlayType;
    HTMLMediaElement.prototype.canPlayType=function(type){return type==='video/mp4'?'':native.call(this,type);};
  });
  await page.goto(BASE+FLOW+PARAMS);
  await finishQuiz(page,INTENSITIES[1]);
  await openPresentation(page);
  await expect(page.locator('[data-quiz-vsl] [role="status"]')).toContainText('Não foi possível carregar o vídeo');
  await expect(page.locator('[data-journey-next="presentation"]')).toBeEnabled();
  expect(evidence.requests.some(url=>new URL(url).pathname===VIDEO)).toBe(false);
  for(const event of ['vsl_start','vsl_progress','vsl_complete']) expect(named(await events(page),event)).toHaveLength(0);
  await openOffer(page);
  await clickCheckout(page,evidence);
  privacy(await events(page));
  expect(evidence.errors).toEqual([]);
});

test('v4 etapa 4: Continuar único flutua sem encobrir nota, aceita teclado e mantém progresso legado', async ({page},testInfo)=>{
  const evidence=await isolate(page);
  await page.setViewportSize({width:375,height:667});
  await page.goto(BASE+'/quiz/v4-jornada/quiz/'+PARAMS);
  const main=page.locator('main[data-step-index]');
  for(const step of [1,2,3]) {
    await expect(main).toHaveAttribute('data-step-index',String(step));
    await main.locator('button.cb-option,button.cb-option-selected').first().click();
  }
  await expect(main).toHaveAttribute('data-step-index','4');
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuemax','18');
  await checkFloating(page);
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:testInfo.outputPath('etapa4-floating-375.png')});
  await page.locator('[data-floating-continue]').focus();
  await page.keyboard.press('Enter');
  await expect(main).toHaveAttribute('data-step-index','5');
  await expect(page.locator('[data-floating-continue]')).toHaveCount(0);
  expect(evidence.errors).toEqual([]);
});
