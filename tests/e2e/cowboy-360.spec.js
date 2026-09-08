'use strict';

// QA da página 360: renderização real, acessibilidade automatizada (axe-core), fluxo de kit e modelo 3D.
// Requer servidor local: PORT=4180 npm run dev (ou o valor de E2E_BASE).
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const path = require('node:path');

const BASE = process.env.E2E_BASE || 'http://127.0.0.1:4180';
const OUT = process.env.E2E_OUT || path.resolve('docs/qa/360');
fs.mkdirSync(OUT, { recursive: true });

test.describe('COWBOY Energia — página 360', () => {
  test('sem erros de console, sem botão de compra antes do último capítulo', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(String(error)));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(`${BASE}/cowboy-360`, { waitUntil: 'networkidle' });
    await expect(page).toHaveTitle(/COWBOY Energia/);
    const html = await page.content();
    const kitIndex = html.indexOf('id="kit"');
    const before = html.slice(0, kitIndex);
    expect(before).not.toMatch(/api\/checkout|Continuar para o pagamento/i);
    expect(html.match(/data-checkout-button/g)).toHaveLength(1);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('modelo 3D carrega e responde aos controles', async ({ page }) => {
    await page.goto(`${BASE}/cowboy-360`, { waitUntil: 'networkidle' });
    await page.locator('#frasco').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-model]')).toHaveAttribute('data-ready', 'true', { timeout: 20000 });
    await expect(page.locator('[data-model-status]')).toContainText(/pronto/i);
    await page.getByRole('button', { name: /Girar à direita/ }).click();
    await page.waitForTimeout(600);
    await page.locator('[data-model]').screenshot({ path: path.join(OUT, 'modelo-3d.png') });
  });

  test('kit selecionado atualiza o painel e a recapitulação aparece', async ({ page }) => {
    await page.goto(`${BASE}/cowboy-360`, { waitUntil: 'networkidle' });
    await page.locator('#kit').scrollIntoViewIfNeeded();
    await page.getByLabel(/4 frascos/).check();
    await expect(page.locator('[data-selected-kit]')).toHaveText('4 frascos selecionados');
    await expect(page.locator('[data-recap]')).toBeVisible();
    const form = page.locator('[data-checkout-form]');
    await expect(form).toHaveAttribute('action', '/api/checkout');
    await expect(form).toHaveAttribute('method', /get/i);
  });

  test('acessibilidade (axe-core, WCAG 2.1 AA)', async ({ page }) => {
    await page.goto(`${BASE}/cowboy-360`, { waitUntil: 'networkidle' });
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    fs.writeFileSync(path.join(OUT, 'axe-360.json'), JSON.stringify(results.violations, null, 2));
    const serious = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
    expect(serious.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`), JSON.stringify(serious, null, 2)).toEqual([]);
  });

  for (const [name, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    test(`captura ${name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE}/cowboy-360`, { waitUntil: 'networkidle' });
      await page.locator('#frasco').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(OUT, `pagina-${name}.png`), fullPage: true });
      const width = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(width, 'sem rolagem horizontal').toBeLessThanOrEqual(viewport.width);
    });
  }
});
