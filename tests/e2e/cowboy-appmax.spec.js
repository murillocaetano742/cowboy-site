'use strict';

// An in-memory AppCheckout fixture. Every browser request is fulfilled locally
// or aborted; no customer, checkout submission or tracking endpoint is contacted.
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');
const SCRIPT = fs.readFileSync(path.join(ROOT, 'assets/js/cowboy-appmax.js'), 'utf8');
const STYLE = fs.readFileSync(path.join(ROOT, 'assets/css/cowboy-appmax.css'), 'utf8');
const HOST = 'https://cowboyenergia.carrinho.app';
const PUBLIC = 'https://cowboyenergiamasculina.com.br';
const KITS = { 38251476: 1, 38251410: 2, 38251519: 3 };

function fixture({ image = 'https://dhl6xem5lrcqr.cloudfront.net/', early = false } = {}) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <style>*{box-sizing:border-box}.bg-light{background-color:#f8f9fa!important}.container-fluid{margin:auto}.row{display:flex;flex-wrap:wrap}.col-12{width:100%}.card-body{padding:20px}.form-control{display:block;width:100%}.form-group{margin-bottom:16px}.nav{display:flex;list-style:none;padding:0}.nav-link{display:block}.nav-link.active{color:#009dff!important}.tab-pane{display:none}.tab-pane.active{display:block}.d-none{display:none!important}.text-black-50{color:#777}.footer{padding:16px}img{max-width:100%}</style>
    ${early ? `<script>${SCRIPT}</script>` : ''}</head><body class="bg-light" style="background-color:#f8f9fa">
    <div class="container-fluid"><div class="card mt-4 mb-4"><div class="card-header"><h4>COWBOY Energia — kit de teste local</h4></div><div class="card-body"><div class="row"><div class="col-12 col-md-4"><img class="img-fluid d-block mx-auto" src="${image}" alt=""></div><div class="col-12 col-md-8"><p>Kit com frascos de 30 ml.</p><p class="mb-0"><strong>Parcele em até <span class="no-wrap">12x R$ 16,75</span></strong></p><p>Produto R$ 154,80. Frete grátis.</p></div></div></div></div></div>
    <div id="form-container" class="container-fluid"><div class="row mb-4"><div class="col-12"><div id="native-hidden" class="d-none">Aviso nativo oculto</div></div>
      <div class="col-12 col-md-6"><div class="card"><div class="card-header text-center"><h4>Dados para entrega</h4></div><div class="card-body"><form id="form-customer" action="/native/customer" method="post"><div class="form-group"><label for="fixture-name">Nome</label><input id="fixture-name" name="name" class="form-control" value="Teste local"></div><div class="form-group"><label for="fixture-zip">CEP</label><input id="fixture-zip" name="zip" class="form-control" value="00000-000" readonly></div><input name="native-token" type="hidden" value="fixture-only"><input name="native-disabled" disabled value="Preservado"></form><div id="native-error" role="alert">Confira os dados antes de continuar.</div></div></div></div>
      <div class="col-12 col-md-6"><div class="card"><div class="card-header text-center"><h4>Pagamento</h4></div><div class="card-body"><ul id="payment-tabs" class="nav nav-tabs"><li class="nav-item"><a href="#creditcard" class="nav-link active">Cartão</a></li><li class="nav-item"><a href="#pix" class="nav-link">Pix</a></li><li class="nav-item"><a href="#boleto" class="nav-link">Boleto</a></li></ul><div id="payment-contents" class="tab-content"><div id="creditcard" class="tab-pane fade show active"><form id="form-creditcard" action="/native/card" method="post"><label for="fixture-installments">Parcelas</label><select id="fixture-installments" class="form-control" name="installments"><option value="1">À vista</option><option value="12" selected>12x R$ 16,75</option></select><input type="submit" class="submit-button btn btn-success" value="Finalizar compra"></form></div><div id="pix" class="tab-pane fade"><form id="form-pix" action="/native/pix" method="post"><button type="submit" id="getQrCode">Gerar Pix</button></form></div><div id="boleto" class="tab-pane fade"><form id="form-billet" action="/native/billet" method="post"><input type="submit" class="submit-button btn btn-success" value="Gerar boleto" disabled></form></div></div></div><div class="card-footer bg-transparent"><span id="native-security">Segurança do processador preservada</span></div></div><h6 class="text-black-50"><small>Taxa nativa preservada.</small></h6></div>
    </div></div><div class="container-fluid"><div class="footer row no-gutters"><p id="native-processor">Pagamento processado pela Appmax</p></div></div>
    <script>window.fixtureSubmits=0;window.fixtureHandler=function(e){e.preventDefault();window.fixtureSubmits++};document.querySelectorAll('form').forEach(f=>f.onsubmit=window.fixtureHandler);document.querySelectorAll('#payment-tabs a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelectorAll('#payment-tabs a,.tab-pane').forEach(n=>n.classList.remove('active'));a.classList.add('active');document.querySelector(a.getAttribute('href')).classList.add('active')}));window.fixtureTrackingCalls=0;window.fbq=window.gtag=function(){window.fixtureTrackingCalls++};</script>
  </body></html>`;
}

async function openFixture(page, url, options = {}) {
  const requests = [];
  await page.route('**/*', async (route) => {
    const request = route.request();
    requests.push(request.url());
    if (request.isNavigationRequest() && request.method() === 'GET') return route.fulfill({ contentType: 'text/html', body: fixture(options) });
    if (request.url().startsWith(`${PUBLIC}/assets/css/cowboy-appmax.css?`)) return route.fulfill({ contentType: 'text/css', body: STYLE });
    const asset = new URL(request.url());
    if (asset.origin === PUBLIC && /^\/assets\/fonts\/(manrope|oswald)-latin-wght-normal\.woff2$/.test(asset.pathname)) {
      return route.fulfill({ contentType: 'font/woff2', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(ROOT, asset.pathname.slice(1))) });
    }
    if (asset.origin === PUBLIC && /^\/imagens\/v5\/kit-[123]\.webp$/.test(asset.pathname)) {
      return route.fulfill({ contentType: 'image/webp', body: fs.readFileSync(path.join(ROOT, asset.pathname.slice(1))) });
    }
    return route.abort();
  });
  await page.goto(url);
  return requests;
}

test('tema Appmax fica restrito ao protocolo, host e três links aprovados', async ({ page }) => {
  for (const url of [
    `https://cowboyenergia.carrinho.app.evil.test/one-checkout/ocmdf/38251476`,
    `http://cowboyenergia.carrinho.app/one-checkout/ocmdf/38251476`,
    `${HOST}/one-checkout/ocmdf/99999999`,
    `${HOST}/one-checkout/ocmdf/38251476/thankyou`,
  ]) {
    await openFixture(page, url);
    await page.addScriptTag({ content: SCRIPT });
    await expect(page.locator('body')).not.toHaveClass(/cowboy-appmax/);
    await expect(page.locator('#cowboy-appmax-header, #cowboy-appmax-support, #cowboy-appmax-styles')).toHaveCount(0);
    await page.unroute('**/*');
  }
});

test('tema e imagens são idempotentes e preservam campos, valores, validação e handlers nativos', async ({ page }) => {
  for (const [id, quantity] of Object.entries(KITS)) {
    await openFixture(page, `${HOST}/one-checkout/ocmdf/${id}?utm_source=fixture-local`);
    const before = await page.locator('form').evaluateAll(forms => forms.map(form => form.outerHTML));
    await page.addScriptTag({ content: SCRIPT });
    await page.addScriptTag({ content: SCRIPT });
    await expect(page.locator('#cowboy-appmax-header')).toHaveCount(1);
    await expect(page.locator('#cowboy-appmax-support')).toHaveCount(1);
    await expect(page.locator('#cowboy-appmax-styles')).toHaveCount(1);
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(10, 10, 10)');
    await expect(page.locator('.card.mt-4.mb-4 .no-wrap')).toHaveCSS('white-space', 'nowrap');
    await page.locator('#payment-tabs .nav-link.active').focus();
    await expect(page.locator('#payment-tabs .nav-link.active')).toHaveCSS('color', 'rgb(75, 54, 16)');
    const image = page.locator('body > .container-fluid > .card img');
    await expect(image).toHaveAttribute('src', `${PUBLIC}/imagens/v5/kit-${quantity}.webp`);
    await expect(image).toHaveAttribute('alt', `COWBOY Energia — ${quantity} ${quantity === 1 ? 'frasco' : 'frascos'}`);
    expect(await page.locator('form').evaluateAll(forms => forms.map(form => form.outerHTML))).toEqual(before);
    expect(await page.locator('form').evaluateAll(forms => forms.every(form => form.onsubmit === window.fixtureHandler))).toBe(true);
    await expect(page.locator('#native-error, #native-security, #native-processor')).toHaveCount(3);
    await expect(page.locator('#native-error')).toBeVisible();
    await expect(page.locator('#native-hidden')).toBeHidden();
    await expect(page.locator('#form-billet input')).toBeDisabled();
    await page.locator('#payment-tabs a[href="#pix"]').click();
    await expect(page.locator('#form-pix')).toBeVisible();
    await page.locator('#getQrCode').click();
    expect(await page.evaluate(() => window.fixtureSubmits)).toBe(1);
    expect(await page.evaluate(() => window.fixtureTrackingCalls)).toBe(0);
    await expect(page.locator('#cowboy-appmax-support a')).toHaveAttribute('href', 'https://wa.me/5511970842160');
    await page.unroute('**/*');
  }
});

test('imagem nativa válida é preservada; vazio recebe o kit após DOMContentLoaded', async ({ page }) => {
  const nativeImage = 'https://dhl6xem5lrcqr.cloudfront.net/merchant/real-product.webp';
  await openFixture(page, `${HOST}/one-checkout/ocmdf/38251410`, { image: nativeImage, early: true });
  await expect(page.locator('body')).toHaveClass(/cowboy-appmax/);
  await expect(page.locator('body > .container-fluid > .card img')).toHaveAttribute('src', nativeImage);
  await page.unroute('**/*');
  await openFixture(page, `${HOST}/one-checkout/ocmdf/38251519`, { image: '', early: true });
  await expect(page.locator('body > .container-fluid > .card img')).toHaveAttribute('src', `${PUBLIC}/imagens/v5/kit-3.webp`);
});
