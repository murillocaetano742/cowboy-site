'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { safeAttribution, CARTPANDA_PUBLIC_CHECKOUT_URLS } = require('#commerce');
const checkoutHandler = require('#api/checkout');

// Synthetic routing fixture only; never sent to an analytics endpoint.
const LINKER = '1*validation*_ga*' + 'A'.repeat(300) + '*_ga_VYR2542XCN*fixture';

test('redirecionamento dos quatro kits preserva linker longo e UTMs sem liberar campos arbitrários', () => {
  for (const quantity of [1, 2, 3, 4]) {
    const params = new URLSearchParams({ quantity: String(quantity), _gl: LINKER, utm_source: 'organic', cid: 'validation', email: 'excluded@example.com', redirect: 'https://example.com' });
    const result = {};
    const response = {
      setHeader(name, value) { result[name] = value; },
      redirect(status, url) { result.status = status; result.url = new URL(url); }
    };
    checkoutHandler({ method: 'GET', query: { quantity: String(quantity) }, url: '/api/checkout?' + params }, response);
    assert.equal(result.status, 302);
    assert.equal(result.url.origin + result.url.pathname, CARTPANDA_PUBLIC_CHECKOUT_URLS[quantity]);
    assert.equal(result.url.searchParams.get('_gl'), LINKER);
    assert.equal(result.url.searchParams.get('utm_source'), 'organic');
    assert.equal(result.url.searchParams.get('cid'), 'validation');
    assert.equal(result.url.searchParams.has('email'), false);
    assert.equal(result.url.searchParams.has('redirect'), false);
    assert.equal(result['Cache-Control'], 'no-store, max-age=0');
  }
});

test('linker não amplia limites dos demais parâmetros e rejeita excesso e controles', () => {
  const accepted = safeAttribution(new URLSearchParams({ _gl: LINKER, utm_campaign: 'A'.repeat(257), gclid: 'click-id' }));
  assert.equal(accepted.get('_gl'), LINKER);
  assert.equal(accepted.has('utm_campaign'), false);
  assert.equal(accepted.get('gclid'), 'click-id');
  for (const value of ['', 'A'.repeat(2049), '1*invalid\r\nheader', '1*invalid value']) {
    assert.equal(safeAttribution(new URLSearchParams({ _gl: value })).has('_gl'), false);
  }
});
