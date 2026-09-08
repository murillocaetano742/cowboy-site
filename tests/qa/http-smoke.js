'use strict';

// Requer servidor de revisão local já iniciado; não chama provedores externos.
const assert = require('node:assert/strict');
const base = process.argv[2] || 'http://127.0.0.1:4173';
const expectUnconfigured = process.argv.includes('--expect-unconfigured');
assert.equal(new URL(base).hostname, '127.0.0.1', 'Somente servidor local autorizado');

async function check(route, expectedStatus, { method = 'GET', accept = 'application/json', body, checkBody, contentType } = {}) {
  const response = await fetch(base + route, {
    method, redirect: 'manual', headers: { Accept: accept, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  assert.equal(response.status, expectedStatus, `${method} ${route}`);
  if (contentType) assert.match(response.headers.get('content-type') || '', contentType);
  if (expectedStatus === 302) assert.equal(new URL(response.headers.get('location')).protocol, 'https:');
  const text = await response.text();
  if (checkBody) checkBody(text);
  return { method, route, status: response.status };
}

async function run() {
  const results = [];
  let publicConfig;
  for (const route of ['/', '/loja', '/privacidade', '/termos']) results.push(await check(route, 200, { accept: 'text/html', contentType: /text\/html/, checkBody: text => assert.match(text, /COWBOY/) }));
  for (const route of ['/assets/css/cowboy.css', '/assets/js/cowboy-store.js', '/imagens/v2/cowboy-hero.webp', '/imagens/v2/cowboy-packshot.webp', '/imagens/v2/cowboy-kit-2.webp', '/robots.txt', '/sitemap.xml']) results.push(await check(route, 200));
  for (const route of ['/docs/qa/relatorio-v2.md', '/config/commerce.js', '/.env', '/.env.local', '/package.json', '/api/checkout.js', '/..%2Fconfig%2Fcommerce.js', '/..%5Cconfig%5Ccommerce.js']) results.push(await check(route, 404));
  results.push(await check('/api/config', 200, { checkBody: text => {
    publicConfig = JSON.parse(text);
    if (expectUnconfigured) {
      assert.equal(publicConfig.shippingAvailable, false, 'Snapshot solicitado sem fornecedor configurado');
      assert.ok(publicConfig.variants.every(variant => !variant.checkoutAvailable));
    }
    assert.deepEqual(publicConfig.variants.map(variant => variant.totalPriceCents), [5476, 8476, 16952]);
  } }));
  results.push(await check('/api/frete', 400, { method: 'POST', body: { postalCode: 'texto01001000', quantity: 2 }, checkBody: text => assert.equal(JSON.parse(text).error, 'invalid_postal_code') }));
  if (!publicConfig.shippingAvailable) results.push(await check('/api/frete', 503, { method: 'POST', body: { postalCode: '01001-000', quantity: 2 }, checkBody: text => assert.equal(JSON.parse(text).error, 'shipping_unavailable') }));
  const checkoutAvailable = publicConfig.variants.find(variant => variant.quantity === 2)?.checkoutAvailable;
  results.push(await check('/api/checkout?quantity=2', checkoutAvailable ? 302 : 503, checkoutAvailable ? { accept: 'text/html' } : { accept: 'text/html', contentType: /text\/html/, checkBody: text => { assert.match(text, /Voltar aos kits/); assert.match(text, /mailto:contato@cowboyenergiamasculina.com.br/); } }));
  results.push(await check('/api/checkout?quantity=9', 400, { accept: 'text/html', contentType: /text\/html/, checkBody: text => assert.match(text, /Escolha um kit/) }));
  results.push(await check('/api/checkout?quantity=2', checkoutAvailable ? 302 : 503, checkoutAvailable ? {} : { contentType: /application\/json/, checkBody: text => assert.equal(JSON.parse(text).error, 'checkout_unavailable') }));
  console.log(JSON.stringify({ base, checksPassed: results.length, providerQuoteSkipped: Boolean(publicConfig.shippingAvailable), checkoutRedirectFollowed: false, results }, null, 2));
}

run().catch(error => { console.error(error.message); process.exitCode = 1; });
