'use strict';

// QA da página nova (conversão, mobile primeiro): ordem dos blocos, compra só no fim, acessibilidade, fluxo de kit.
// Requer servidor local: PORT=4180 npm run dev (ou E2E_BASE).
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const path = require('node:path');

const BASE = process.env.E2E_BASE || 'http://127.0.0.1:4180';
const URL = `${BASE}/cowboy-nova`;
const OUT = process.env.E2E_OUT || path.resolve('docs/qa/nova');
fs.mkdirSync(OUT, { recursive: true });

test.describe('COWBOY Energia — página nova', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });

  test('mobile: ordem de conversão, compra só no fim, sem claims proibidos, sem rolagem horizontal', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(String(error)));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await expect(page).toHaveTitle(/COWBOY Energia/);
    const html = await page.content();
    const at = (id) => html.indexOf(`id="${id}"`);
    expect(at('relatos')).toBeGreaterThan(at('topo'));
    expect(at('relatos')).toBeLessThan(at('reconhece'));
    expect(at('garantia')).toBeLessThan(at('kit'));
    const before = html.slice(0, at('kit'));
    expect(before).not.toMatch(/api\/checkout|data-checkout-button/i);
    expect(html.match(/data-checkout-button/g)).toHaveLength(1);
    const claims = html.replace(/n[aã]o promete(?:mos)? cura/gi, '');
    expect(claims).not.toMatch(/\bcura\b|curar|resolve de uma vez|resultado garantido|22\.000|★|avaliações|estoque baixo|24 gotas|aprovado pela anvisa/i);
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width).toBeLessThanOrEqual(390);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('mobile: vídeos no topo com controles, sem autoplay', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'networkidle' });
    const videos = page.locator('#relatos video');
    await expect(videos).toHaveCount(2);
    for (const video of await videos.all()) {
      await expect(video).toHaveAttribute('controls', '');
      await expect(video).not.toHaveAttribute('autoplay', /.*/);
    }
    await expect(page.locator('#relatos .badge-video')).toContainText(/segundo frasco/i);
  });

  test('mobile: kit selecionado atualiza painel, recapitulação aparece, pill abre e fecha', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.locator('#kit').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.getByLabel(/4 frascos/).check();
    await expect(page.locator('[data-selected-kit]')).toHaveText('4 frascos selecionados');
    await expect(page.locator('[data-recap]')).toBeVisible();
    await expect(page.locator('[data-pill]')).toBeVisible();
    await page.locator('[data-pill-open]').click();
    await expect(page.locator('[data-sheet]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-sheet]')).toBeHidden();
    const form = page.locator('[data-checkout-form]');
    await expect(form).toHaveAttribute('action', '/api/checkout');
    await expect(form).toHaveAttribute('method', /get/i);
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
    const page = await context.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(OUT, 'pagina-desktop.png'), fullPage: true });
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width).toBeLessThanOrEqual(1440);
    await context.close();
  });
});
