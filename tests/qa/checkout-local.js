'use strict';

// Verifica somente o servidor local; nunca segue o redirect para o provedor.
// Execute com o mesmo ambiente do servidor, inclusive overrides de checkout.
const assert = require('node:assert/strict');
const { checkoutProvider, checkoutUrlFor, DISPLAY_VARIANT_QUANTITIES } = require('#commerce');

async function run() {
  const base = new URL(process.argv[2] || process.env.BASE_URL || `http://127.0.0.1:${process.env.PORT || 4173}`);
  assert.ok(['http:', 'https:'].includes(base.protocol) && ['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname) && !base.username && !base.password, 'QA deve usar um servidor local');
  const provider = checkoutProvider();
  assert.ok(provider, 'CHECKOUT_PROVIDER inválido');
  const expected = DISPLAY_VARIANT_QUANTITIES.map((quantity) => {
    const url = checkoutUrlFor(quantity);
    assert.ok(url, `Kit ${quantity}: checkout ${provider} não configurado`);
    return { quantity, url };
  });
  const results = [];
  for (const { quantity, url } of expected) {
    const endpoint = new URL(`/api/checkout?quantity=${quantity}&utm_source=qa-local&utm_content=C10&email=discard`, base);
    const response = await fetch(endpoint, { redirect: 'manual', headers: { Accept: 'text/html' }, signal: AbortSignal.timeout(10000) });
    assert.equal(response.status, 302, `Kit ${quantity}: servidor não redirecionou`);
    assert.ok(response.headers.get('location'), `Kit ${quantity}: redirect sem destino`);
    const destination = new URL(response.headers.get('location'));
    assert.equal(destination.protocol, 'https:');
    url.searchParams.set('utm_source', 'qa-local');
    url.searchParams.set('utm_content', 'C10');
    assert.equal(destination.toString(), url.toString(), `Kit ${quantity}: destino difere da configuração`);
    assert.equal(destination.searchParams.get('utm_source'), 'qa-local');
    assert.equal(destination.searchParams.get('utm_content'), 'C10');
    assert.equal(destination.searchParams.get('email'), null);
    assert.match(response.headers.get('cache-control'), /no-store/);
    results.push({ quantity, status: response.status, host: destination.hostname, attributionPreserved: true, redirectFollowed: false });
  }
  console.log(JSON.stringify({ provider, checksPassed: results.length, results }, null, 2));
}

run().catch(error => { console.error(error.message); process.exitCode = 1; });
