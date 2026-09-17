'use strict';

// QA da página nova (conversão, mobile primeiro): ordem dos blocos, compra só no fim, acessibilidade, fluxo de kit.
// Requer servidor local: PORT=4180 npm run dev (ou E2E_BASE).
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const path = require('node:path');

const BASE = process.env.E2E_BASE || 'http://127.0.0.1:4180';
const URL = `${BASE}/cowboy-nova`;
const ROOT_URL = `${BASE}/`;
const ACTIVITY_NOW = new Date('2026-09-17T15:00:00Z');
const OUT = process.env.E2E_OUT || path.resolve('docs/qa/nova');
fs.mkdirSync(OUT, { recursive: true });

async function isolateTracking(context) {
  // Registre os mocks por último: as rotas Playwright usam a ordem inversa de registro.
  await context.route(/^https:\/\//, (route) => route.abort());
  const empty = (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
  await context.route('**/assets/js/cowboy-pixel.js', empty);
  await context.route('**/assets/js/cowboy-google.js', empty);
  await context.route('https://cdn.utmify.com.br/scripts/utms/latest.js', empty);
}

async function openWithActivity(page, data) {
  // Dados exclusivamente de teste, interceptados em localhost; nada é publicado no feed.
  await page.clock.install({ time: new Date(ACTIVITY_NOW.getTime() - 60000) });
  await page.clock.pauseAt(ACTIVITY_NOW);
  await page.route('**/assets/data/atividade.json', (route) => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify(data),
  }));
  await page.goto(ROOT_URL, { waitUntil: 'networkidle' });
}

async function expectAtTop(page) {
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(1);
}

test.describe('COWBOY Energia — página nova', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  test.beforeEach(async ({ context }) => {
    // Rastreadores (Pixel/UTMify/GA4) não fazem parte do QA da página e, em localhost, o SDK da UTMify tenta
    // um endpoint de desenvolvimento inexistente. Servimos os loaders vazios e bloqueamos chamadas externas.
    await isolateTracking(context);
  });

  test('mobile: ordem de conversão, compra só no fim, sem claims proibidos, sem rolagem horizontal', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(String(error)));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await expect(page).toHaveTitle(/COWBOY Energia/);
    const html = await page.content();
    const at = (id) => html.indexOf(`id="${id}"`);
    expect(at('prova')).toBeGreaterThan(at('topo'));
    expect(at('prova')).toBeLessThan(at('kit'));
    expect(at('kit')).toBeLessThan(at('garantia'));
    expect(html).not.toMatch(/class="menu"|data-pill|class="announce"/);
    const before = html.slice(0, at('kit'));
    expect(before).not.toMatch(/api\/checkout|data-checkout-button/i);
    expect(html.match(/data-checkout-button/g)).toHaveLength(1);
    const claims = html.replace(/n[aã]o promete(?:mos)? cura/gi, '');
    expect(claims).not.toMatch(/\bcura\b|curar|resolve de uma vez|resultado garantido|22\.000|★|avaliações|estoque baixo|24 gotas|aprovado pela anvisa/i);
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width).toBeLessThanOrEqual(390);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('mobile: vídeos na prova social com controles, sem autoplay; fotos na garantia', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'networkidle' });
    const videos = page.locator('#prova video');
    await expect(videos).toHaveCount(2);
    for (const video of await videos.all()) {
      await expect(video).toHaveAttribute('controls', '');
      await expect(video).not.toHaveAttribute('autoplay', /.*/);
    }
    await expect(page.locator('#prova .badge-video')).toContainText(/segundo frasco/i);
    await expect(page.locator('#prova .photo-card')).toHaveCount(6);
    await expect(page.locator('[data-vsl]')).toBeVisible();
    // VSL real: a oferta fica travada até o vídeo chegar em data-reveal-at (ou terminar); o fim do vídeo destrava.
    const vslVideo = page.locator('video[data-vsl-video]');
    await expect(vslVideo).toHaveCount(1);
    await expect(vslVideo).not.toHaveAttribute('autoplay', /.*/);
    // Trava desligada (data-vsl-gate="off"): kits e botões sempre visíveis, mesmo sem dar play.
    await expect(page.locator('[data-reveal][data-locked]')).toHaveCount(0);
    await expect(page.locator('#kit')).toBeVisible();
    await expect(page.locator('.kit')).toHaveCount(3);
    await page.locator('#prova').scrollIntoViewIfNeeded();
    await page.locator('[data-gallery-next]').click();
    await page.waitForTimeout(700);
    await expect(page.locator('[data-gallery-dots] button').nth(1)).toHaveAttribute('aria-current', 'true');
  });

  test('mobile: kit selecionado atualiza painel e recapitulação aparece', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.locator('video[data-vsl-video]').evaluate((v) => v.dispatchEvent(new Event('ended')));
    await page.locator('#kit').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(page.locator('.kit')).toHaveCount(3);
    await page.getByLabel(/3 frascos/).check();
    await expect(page.locator('[data-selected-kit]')).toHaveText('3 frascos selecionados');
    await expect(page.locator('[data-recap]')).toBeVisible();
    const form = page.locator('[data-checkout-form]');
    await expect(form).toHaveAttribute('action', /\/api\/checkout/); // a UTMify pode acrescentar parâmetros ao action
    await expect(form).toHaveAttribute('method', /get/i);
  });

  test('entrada: raiz e link externo #kit começam no topo e preservam atribuição', async ({ page }) => {
    const query = '?utm_source=qa-local&utm_campaign=entrada&cid=fixture-034';
    for (const entry of [ROOT_URL, `${ROOT_URL}${query}#kit`, `${URL}${query}#kit`]) {
      await page.goto(entry, { waitUntil: 'networkidle' });
      await expectAtTop(page);
      const address = new global.URL(page.url());
      expect(address.hash).toBe('');
      expect(address.search).toBe(new global.URL(entry).search);
      expect(address.pathname).toBe(new global.URL(entry).pathname);
    }
  });

  test('entrada: CTA interno alcança os kits; recarregar volta ao topo sem perder UTM', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const query = '?utm_source=qa-local&utm_content=reload';
    await page.goto(`${ROOT_URL}${query}`, { waitUntil: 'networkidle' });
    await expectAtTop(page);
    await page.getByRole('link', { name: 'Ver os kits e o preço', exact: false }).click();
    await expect(page).toHaveURL(new RegExp('#kit$'));
    await expect(page.locator('#kit')).toBeInViewport();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
    await page.reload({ waitUntil: 'networkidle' });
    await expectAtTop(page);
    expect(new global.URL(page.url()).hash).toBe('');
    expect(new global.URL(page.url()).search).toBe(query);
    // Rolagem manual também não deve ser restaurada pelo navegador após reload.
    await page.locator('#kit').scrollIntoViewIfNeeded();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
    expect(new global.URL(page.url()).hash).toBe('');
    await page.reload({ waitUntil: 'networkidle' });
    await expectAtTop(page);
    expect(new global.URL(page.url()).search).toBe(query);
  });

  test('atividade: relatos sem pedidos não exibem aviso de compra', async ({ page }) => {
    await openWithActivity(page, {
      pedidos: [],
      relatos: [{ nome: 'Relato fixture', texto: 'Relato de teste que não é uma compra', kit: 2 }],
    });
    const toast = page.locator('[data-toast]');
    await page.clock.runFor(9050);
    await expect(toast).toBeHidden();
    await page.clock.runFor(96000);
    await expect(toast).toBeHidden();
    await expect(toast).not.toHaveAttribute('data-show', '');
  });

  test('atividade: pedido do feed aparece uma vez, sem foto e sem reciclar relato', async ({ page }) => {
    await openWithActivity(page, {
      pedidos: [{ nome: 'Comprador fixture', cidade: 'Cidade teste/UF', kit: 2, quando: '2026-09-17T14:55:00Z', foto: '/foto-nao-publicar.jpg' }],
      relatos: [{ nome: 'Relato fixture', texto: 'Não entra na fila de compras', kit: 1 }],
    });
    const toast = page.locator('[data-toast]');
    await expect(toast).toBeHidden();
    await page.clock.runFor(9050);
    await expect(toast).toBeVisible();
    await expect(toast.locator('[data-toast-title]')).toHaveText('Comprador fixture, de Cidade teste/UF');
    await expect(toast.locator('[data-toast-text]')).toContainText('garantiu o kit de 2 frascos');
    await expect(toast.locator('[data-toast-meta]')).toContainText('Pedido real');
    await expect(toast.locator('img, picture, video')).toHaveCount(0);
    await page.clock.runFor(16000);
    await expect(toast).toBeHidden();
    await expect(toast).not.toHaveAttribute('data-show', '');
    await page.clock.runFor(96000);
    await expect(toast).toBeHidden();
    await expect(toast.locator('[data-toast-title]')).toHaveText('Comprador fixture, de Cidade teste/UF');
  });

  test('atividade: exibe só os 12 pedidos válidos mais recentes, em ordem e sem repetir', async ({ page }) => {
    const pedidos = Array.from({ length: 14 }, (_, index) => ({
      nome: `Fixture ${index + 1}`, kit: index % 3 + 1,
      quando: new Date(ACTIVITY_NOW.getTime() - (14 - index) * 60000).toISOString(),
    }));
    pedidos.push(
      { nome: 'Kit inválido', kit: 4, quando: '2026-09-17T14:59:59Z' },
      { nome: 'Pedido futuro', kit: 1, quando: '2026-09-18T15:00:00Z' },
      { nome: 'Data inválida', kit: 1, quando: 'sem-data' },
      { nome: '', kit: 1, quando: '2026-09-17T14:59:58Z' },
    );
    await openWithActivity(page, { pedidos, relatos: [] });
    const toast = page.locator('[data-toast]');
    await page.clock.runFor(9050);
    for (let index = 0; index < 12; index += 1) {
      if (index > 0) await page.clock.runFor(16000);
      await expect(toast).toBeVisible();
      await expect(toast.locator('[data-toast-title]')).toHaveText(`Fixture ${14 - index}`);
    }
    await page.clock.runFor(16000);
    await expect(toast).toBeHidden();
    await page.clock.runFor(96000);
    await expect(toast).toBeHidden();
    await expect(toast.locator('[data-toast-title]')).toHaveText('Fixture 3');
  });

  test('atividade: vídeo e aba oculta pausam a fila; horário atualiza e fechar encerra os avisos', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openWithActivity(page, { pedidos: [
      { nome: 'Primeiro fixture', kit: 1, quando: '2026-09-17T14:59:00Z' },
      { nome: 'Segundo fixture', kit: 2, quando: '2026-09-17T14:58:00Z' },
    ], relatos: [] });
    const toast = page.locator('[data-toast]');
    const video = page.locator('video[data-vsl-video]');
    // Estados de navegador simulados localmente, sem reproduzir mídia ou emitir eventos externos.
    await video.evaluate((element) => Object.defineProperty(element, 'paused', { configurable: true, value: false }));
    await page.clock.runFor(65000);
    await expect(toast).toBeHidden();
    await video.evaluate((element) => { delete element.paused; });
    await page.evaluate(() => Object.defineProperty(document, 'hidden', { configurable: true, value: true }));
    await page.clock.runFor(16000);
    await expect(toast).toBeHidden();
    await page.evaluate(() => { delete document.hidden; });
    await page.clock.runFor(8050);
    await expect(toast).toBeVisible();
    await expect(toast.locator('[data-toast-title]')).toHaveText('Primeiro fixture');
    await expect(toast.locator('[data-toast-text]')).toContainText('há 2 min');
    await toast.getByRole('button', { name: 'Fechar aviso', exact: true }).click();
    await page.clock.runFor(16000);
    await expect(toast).toBeHidden();
    await expect(toast.locator('[data-toast-title]')).toHaveText('Primeiro fixture');
  });

  test('mobile: acessibilidade (axe-core, WCAG 2.1 AA)', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'networkidle' });
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    fs.writeFileSync(path.join(OUT, 'axe-nova.json'), JSON.stringify(results.violations, null, 2));
    const serious = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
    expect(serious.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`), JSON.stringify(serious, null, 2)).toEqual([]);
  });

  test('captura mobile', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(OUT, 'pagina-mobile.png'), fullPage: true });
  });

  test('captura desktop', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await isolateTracking(context);
    const page = await context.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(OUT, 'pagina-desktop.png'), fullPage: true });
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width).toBeLessThanOrEqual(1440);
    await context.close();
  });
});
