'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const commerce = require('#commerce');
const checkoutHandler = require('#api/checkout');
const configHandler = require('#api/config');
const freightHandler = require('#api/frete');
const { normalizeQuotes, quoteShipping } = freightHandler;

const configuredEnvironment = Object.freeze({
  MELHOR_ENVIO_ENV: 'sandbox',
  MELHOR_ENVIO_TOKEN: 'server-only-token',
  MELHOR_ENVIO_USER_AGENT: 'Cowboy Energia (suporte@example.com)',
});

// Synthetic routing fixture only; these URLs are never fetched.
const appmaxEnvironment = Object.freeze({
  CHECKOUT_PROVIDER: 'appmax',
  APPMAX_CHECKOUT_ALLOWED_HOSTS: 'checkout.example.test',
  APPMAX_CHECKOUT_1_URL: 'https://checkout.example.test/kit-1',
  APPMAX_CHECKOUT_2_URL: 'https://checkout.example.test/kit-2?existing=value',
  APPMAX_CHECKOUT_3_URL: 'https://checkout.example.test/kit-3',
});

function withCheckoutEnvironment(overrides, run) {
  const keys = ['CHECKOUT_PROVIDER', 'APPMAX_CHECKOUT_ALLOWED_HOSTS', 'CARTPANDA_CHECKOUT_ALLOWED_HOSTS'];
  for (const quantity of [1, 2, 3]) keys.push(`APPMAX_CHECKOUT_${quantity}_URL`, `CARTPANDA_CHECKOUT_${quantity}_URL`);
  const retained = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  try {
    for (const key of keys) delete process.env[key];
    Object.assign(process.env, overrides);
    return run();
  } finally {
    for (const [key, value] of Object.entries(retained)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

function mockResponse() {
  const result = { headers: {}, statusCode: null, body: null, redirectUrl: null };
  return {
    result,
    setHeader(name, value) { result.headers[name] = value; },
    status(statusCode) { result.statusCode = statusCode; return this; },
    json(body) { result.body = body; return this; },
    send(body) { result.body = body; return this; },
    redirect(statusCode, url) { result.statusCode = statusCode; result.redirectUrl = url; return this; },
  };
}

test('normaliza CEP e aceita somente kits comercialmente configurados', () => {
  assert.equal(commerce.parseBrazilianPostalCode('01001-000'), '01001000');
  assert.equal(commerce.parseBrazilianPostalCode('0100100'), null);
  assert.equal(commerce.parseQuantity('1'), 1);
  assert.equal(commerce.parseQuantity(2), 2);
  assert.equal(commerce.parseQuantity(3), 3);
  assert.equal(commerce.parseQuantity(4), null);
  assert.equal(commerce.parseQuantity(5), null);
});

test('cotação não chama fornecedor quando faltam configurações obrigatórias', async () => {
  let called = false;
  const result = await quoteShipping({
    postalCode: '01001000',
    quantity: 2,
    env: {},
    fetchImpl: async () => { called = true; },
  });
  assert.equal(called, false);
  assert.equal(result.status, 503);
  assert.equal(result.body.error, 'shipping_unavailable');
  assert.ok(result.body.missing.includes('MELHOR_ENVIO_TOKEN'));
});

test('cotação envia dados reais do kit e prefere preço/prazo customizados', async () => {
  let request;
  const result = await quoteShipping({
    postalCode: '22290040',
    quantity: 2,
    env: configuredEnvironment,
    fetchImpl: async (url, options) => {
      request = { url, options };
      return {
        ok: true,
        json: async () => [
          { id: 1, name: 'PAC', company: { name: 'Correios' }, price: '28.90', custom_price: '21.44', delivery_time: 7, custom_delivery_time: 5 },
          { id: 2, name: 'Indisponível', error: 'Sem cobertura' },
          { id: 3, name: 'SEDEX', company: { name: 'Correios' }, price: '35.00', delivery_time: 3 },
        ],
      };
    },
  });

  assert.match(request.url, /sandbox\.melhorenvio\.com\.br\/api\/v2\/me\/shipment\/calculate$/);
  assert.equal(request.options.headers.Authorization, 'Bearer server-only-token');
  assert.equal(request.options.headers['User-Agent'], configuredEnvironment.MELHOR_ENVIO_USER_AGENT);
  const body = JSON.parse(request.options.body);
  assert.equal(body.from.postal_code, '74475239');
  assert.equal(body.products[0].quantity, 1);
  assert.equal(body.products[0].weight, 0.5);
  assert.deepEqual([body.products[0].length, body.products[0].width, body.products[0].height], [23, 8, 8]);
  assert.equal(body.products[0].insurance_value, '154.80');
  assert.equal(result.status, 200);
  assert.deepEqual(result.body.quotes, [
    { id: 1, company: 'Correios', service: 'PAC', price: 21.44, deliveryDays: 5 },
    { id: 3, company: 'Correios', service: 'SEDEX', price: 35, deliveryDays: 3 },
  ]);
});

test('falha e timeout do fornecedor não geram valor de frete inventado', async () => {
  const failure = await quoteShipping({
    postalCode: '22290040',
    quantity: 1,
    env: configuredEnvironment,
    fetchImpl: async () => ({ ok: false, status: 401, json: async () => ({ message: 'Unauthenticated' }) }),
  });
  assert.deepEqual(failure, { status: 502, body: { error: 'shipping_provider_error', status: 401 } });

  const timeout = await quoteShipping({
    postalCode: '22290040',
    quantity: 1,
    env: configuredEnvironment,
    fetchImpl: async () => { const error = new Error('aborted'); error.name = 'AbortError'; throw error; },
  });
  assert.deepEqual(timeout, { status: 502, body: { error: 'shipping_provider_timeout' } });
});

test('checkout preserva somente atribuição permitida e não tem URL inventada', () => {
  withCheckoutEnvironment(appmaxEnvironment, () => {
    const response = mockResponse();
    checkoutHandler({ method: 'GET', query: { quantity: '2' }, url: '/api/checkout?quantity=2&utm_source=meta&utm_content=C02&email=nao-permitido&diagnostico=nao' }, response);
    const redirect = new URL(response.result.redirectUrl);
    assert.equal(response.result.statusCode, 302);
    assert.equal(redirect.origin, 'https://checkout.example.test');
    assert.equal(redirect.searchParams.get('existing'), 'value');
    assert.equal(redirect.searchParams.get('utm_source'), 'meta');
    assert.equal(redirect.searchParams.get('utm_content'), 'C02');
    assert.equal(redirect.searchParams.get('email'), null);
    assert.equal(redirect.searchParams.get('diagnostico'), null);
  });

  withCheckoutEnvironment({ ...appmaxEnvironment, APPMAX_CHECKOUT_3_URL: 'http://checkout.example.test/kit-3' }, () => {
    const unavailable = mockResponse();
    checkoutHandler({ method: 'GET', query: { quantity: '3' }, url: '/api/checkout?quantity=3' }, unavailable);
    assert.equal(unavailable.result.statusCode, 503);
    assert.equal(unavailable.result.body.error, 'checkout_unavailable');
  });
});

test('Appmax exige HTTPS sem credenciais e hostname permitido por igualdade exata', () => {
  for (const quantity of [1, 2, 3]) {
    assert.equal(commerce.checkoutUrlFor(quantity, appmaxEnvironment).toString(), appmaxEnvironment[`APPMAX_CHECKOUT_${quantity}_URL`]);
  }
  for (const candidate of [
    'http://checkout.example.test/kit-1',
    'https://checkout.example.test.evil.test/kit-1',
    'https://other.checkout.example.test/kit-1',
    'https://checkout.example.test@evil.test/kit-1',
    'https://user:password@checkout.example.test/kit-1',
    'https://user@checkout.example.test/kit-1',
    'https://cowboyenergia.carrinho.app.evil.test/kit-1',
    'https://another.carrinho.app/kit-1',
    'javascript:alert(1)',
    'not-a-url',
  ]) assert.equal(commerce.checkoutUrlFor(1, { ...appmaxEnvironment, APPMAX_CHECKOUT_1_URL: candidate }), null, candidate);
  assert.equal(commerce.checkoutUrlFor(1, { APPMAX_CHECKOUT_1_URL: appmaxEnvironment.APPMAX_CHECKOUT_1_URL }), null);
  assert.equal(commerce.checkoutUrlFor(1, { ...appmaxEnvironment, APPMAX_CHECKOUT_ALLOWED_HOSTS: '*.example.test' }), null);
  assert.equal(commerce.checkoutUrlFor(1, { ...appmaxEnvironment, APPMAX_CHECKOUT_ALLOWED_HOSTS: 'https://checkout.example.test' }), null);
  assert.ok(commerce.checkoutUrlFor(1, { ...appmaxEnvironment, APPMAX_CHECKOUT_ALLOWED_HOSTS: 'another.example.test, CHECKOUT.EXAMPLE.TEST ' }));
  assert.equal(commerce.checkoutUrlFor(4, appmaxEnvironment), null);
});

test('Appmax é padrão e usa os três links confirmados sem fallback aos links legados Cartpanda', () => {
  assert.equal(commerce.DEFAULT_CHECKOUT_PROVIDER, 'appmax');
  assert.equal(commerce.checkoutProvider({}), 'appmax');
  const expected = {
    1: 'https://cowboyenergia.carrinho.app/one-checkout/ocmdf/38251476',
    2: 'https://cowboyenergia.carrinho.app/one-checkout/ocmdf/38251410',
    3: 'https://cowboyenergia.carrinho.app/one-checkout/ocmdf/38251519',
  };
  assert.deepEqual(commerce.APPMAX_PUBLIC_CHECKOUT_URLS, expected);
  for (const quantity of [1, 2, 3]) {
    assert.equal(commerce.checkoutUrlFor(quantity, {}).toString(), expected[quantity]);
    assert.equal(commerce.checkoutUrlFor(quantity, { CHECKOUT_PROVIDER: 'appmax', [`CARTPANDA_CHECKOUT_${quantity}_URL`]: commerce.CARTPANDA_PUBLIC_CHECKOUT_URLS[quantity] }).toString(), expected[quantity]);
    assert.equal(commerce.checkoutUrlFor(quantity, { [`APPMAX_CHECKOUT_${quantity}_URL`]: 'https://unlisted.example.test/unavailable' }), null);
  }
  for (const provider of ['', 'invalid', 'APPMAX', 'cartpanda ']) {
    assert.equal(commerce.checkoutProvider({ CHECKOUT_PROVIDER: provider }), null);
    assert.equal(commerce.checkoutUrlFor(1, { ...appmaxEnvironment, CHECKOUT_PROVIDER: provider }), null);
  }
  withCheckoutEnvironment(Object.fromEntries([1, 2, 3].map((quantity) => [`APPMAX_CHECKOUT_${quantity}_URL`, 'https://unlisted.example.test/unavailable'])), () => {
    const response = mockResponse();
    checkoutHandler({ method: 'GET', query: { quantity: '1' }, url: '/api/checkout?quantity=1' }, response);
    assert.equal(response.result.statusCode, 503);
    assert.deepEqual(response.result.body, { error: 'checkout_unavailable' });
    const config = mockResponse();
    configHandler({ method: 'GET' }, config);
    assert.ok(config.result.body.variants.every((variant) => variant.checkoutAvailable === false));
  });
});

test('Cartpanda só usa os links históricos se o provedor for explicitamente selecionado', () => {
  const legacy = { CHECKOUT_PROVIDER: 'cartpanda' };
  assert.deepEqual(Object.keys(commerce.CARTPANDA_PUBLIC_CHECKOUT_URLS), ['1', '2', '3']);
  for (const quantity of [1, 2, 3]) assert.equal(commerce.checkoutUrlFor(quantity, legacy).toString(), commerce.CARTPANDA_PUBLIC_CHECKOUT_URLS[quantity]);
  assert.equal(commerce.checkoutUrlFor(4, legacy), null);
  for (const candidate of ['http://loja.mycartpanda.com/checkout/1', 'https://falsa-mycartpanda.com/checkout/1', 'https://user:password@loja.mycartpanda.com/checkout/1', 'https://checkout.example.test/1']) {
    assert.equal(commerce.checkoutUrlFor(1, { ...legacy, CARTPANDA_CHECKOUT_1_URL: candidate }), null);
  }
  assert.ok(commerce.checkoutUrlFor(1, { ...legacy, CARTPANDA_CHECKOUT_1_URL: 'https://checkout.example.test/1', CARTPANDA_CHECKOUT_ALLOWED_HOSTS: 'checkout.example.test' }));
  assert.equal(commerce.checkoutUrlFor(1, { ...legacy, APPMAX_CHECKOUT_1_URL: appmaxEnvironment.APPMAX_CHECKOUT_1_URL }).toString(), commerce.CARTPANDA_PUBLIC_CHECKOUT_URLS[1]);
});

test('check commerce aceita frete fixo Appmax sem Melhor Envio e mantém legado e provedor inválido fechados', () => {
  const environment = { ...process.env, ...appmaxEnvironment, MELHOR_ENVIO_ENV: '', MELHOR_ENVIO_TOKEN: '', MELHOR_ENVIO_USER_AGENT: '' };
  const execute = (overrides = {}) => {
    const result = spawnSync(process.execPath, ['scripts/check-commerce-config.js'], { env: { ...environment, ...overrides }, encoding: 'utf8' });
    assert.ifError(result.error);
    return { status: result.status, report: JSON.parse(result.stdout) };
  };
  const appmax = execute();
  assert.equal(appmax.status, 0);
  assert.equal(appmax.report.provider, 'appmax');
  assert.ok(appmax.report.checkout.every((kit) => kit.configured));
  assert.deepEqual(appmax.report.shipping, { mode: 'checkout_fixed', configured: true, missing: [], currency: 'BRL', pricesCents: { 1: 2675, 2: 0, 3: 0 } });
  const legacy = execute({ CHECKOUT_PROVIDER: 'cartpanda' });
  assert.equal(legacy.status, 1);
  assert.equal(legacy.report.shipping.mode, 'melhor_envio_quote');
  assert.ok(legacy.report.shipping.missing.includes('MELHOR_ENVIO_TOKEN'));
  const invalid = execute({ CHECKOUT_PROVIDER: 'invalid' });
  assert.equal(invalid.status, 1);
  assert.equal(invalid.report.provider, null);
  assert.equal(invalid.report.shipping.configured, false);
  assert.ok(invalid.report.checkout.every((kit) => kit.configured === false));
});

test('pagina aprovada carrega o encaminhamento UTMify sem segredo embutido', () => {
  const html = fs.readFileSync('cowboy-nova.html', 'utf8');
  assert.match(html, /src="https:\/\/cdn\.utmify\.com\.br\/scripts\/utms\/latest\.js"/);
  for (const attribute of [
    'data-utmify-prevent-xcod-sck',
    'data-utmify-prevent-subids',
    'async',
    'defer',
  ]) assert.match(html, new RegExp(`\\b${attribute}\\b`));
  assert.doesNotMatch(html, /cartpanda|data-utmify-ignore-iframe/i);
  assert.doesNotMatch(html, /APPMAX_CLIENT_SECRET|APPMAX_API_TOKEN|CARTPANDA_API_TOKEN|MELHOR_ENVIO_TOKEN/);
});

test('configuração pública expõe oferta inicial e disponibilidade sem segredos', () => {
  const retained = {};
  for (const [key, value] of Object.entries(configuredEnvironment)) {
    retained[key] = process.env[key];
    process.env[key] = value;
  }
  withCheckoutEnvironment(appmaxEnvironment, () => {
    const response = mockResponse();
    configHandler({ method: 'GET' }, response);
    assert.equal(response.result.statusCode, 200);
    assert.deepEqual(response.result.body.variants.map((variant) => variant.quantity), [1, 2, 3]);
    assert.equal(response.result.body.freeShippingFromQuantity, 2);
    assert.equal(response.result.body.variants.find((variant) => variant.quantity === 1).freeShipping, false);
    assert.equal(response.result.body.variants.find((variant) => variant.quantity === 3).freeShipping, true);
    assert.equal(response.result.body.variants.find((variant) => variant.quantity === 2).checkoutAvailable, true);
    assert.equal(response.result.body.variants.find((variant) => variant.quantity === 3).checkoutAvailable, true);
    assert.equal(response.result.body.shippingAvailable, true);
    assert.equal(JSON.stringify(response.result.body).includes('server-only-token'), false);
  });
  for (const [key, previous] of Object.entries(retained)) {
    if (previous === undefined) delete process.env[key];
    else process.env[key] = previous;
  }
});

test('pacote de 1 a 3 frascos mantém peso e dimensões totais e muda apenas seguro', () => {
  for (const [quantity, insuredValue] of [[1, '79.90'], [2, '154.80'], [3, '199.90']]) {
    const payload = freightHandler.buildPayload('01001000', quantity);
    assert.deepEqual(payload.products[0], {
      id: `cowboy-energia-kit-${quantity}`,
      length: 23,
      width: 8,
      height: 8,
      weight: 0.5,
      insurance_value: insuredValue,
      quantity: 1,
    });
  }
});

test('respostas inválidas do fornecedor não viram frete ou prazo zero', () => {
  assert.deepEqual(normalizeQuotes([
    { id: 1, price: null, delivery_time: null },
    { id: 2, price: '', delivery_time: '' },
    { id: 3, price: '-1', delivery_time: 3 },
    { id: 4, price: '10.50', delivery_time: '' },
    { id: 5, price: 0, delivery_time: 0 },
  ]), [
    { id: 5, company: null, service: null, price: 0, deliveryDays: 0 },
    { id: 4, company: null, service: null, price: 10.5, deliveryDays: null },
  ]);
});

test('ambiente Melhor Envio inválido falha fechado e não chama produção', async () => {
  let called = false;
  const result = await quoteShipping({
    postalCode: '01001000',
    quantity: 1,
    env: { ...configuredEnvironment, MELHOR_ENVIO_ENV: 'prod' },
    fetchImpl: async () => { called = true; },
  });
  assert.equal(called, false);
  assert.equal(result.status, 503);
  assert.ok(result.body.missing.includes('MELHOR_ENVIO_ENV(valid:sandbox|production)'));
  assert.equal(commerce.getShippingBaseUrl({ MELHOR_ENVIO_ENV: 'prod' }), null);
});

test('endpoint de frete rejeita corpo excedente ou fora do contrato antes de cotar', async () => {
  const excess = mockResponse();
  await freightHandler({
    method: 'POST',
    headers: { 'content-length': '1025' },
    body: { postalCode: '01001000', quantity: 1 },
  }, excess);
  assert.equal(excess.result.statusCode, 413);
  assert.equal(excess.result.body.error, 'request_too_large_or_invalid');

  const arbitrary = mockResponse();
  await freightHandler({
    method: 'POST',
    headers: { 'content-length': '40' },
    body: { postalCode: '01001000', quantity: 1, weight: 0.001 },
  }, arbitrary);
  assert.equal(arbitrary.result.statusCode, 413);

  const wrongMethod = mockResponse();
  await freightHandler({ method: 'GET', headers: {} }, wrongMethod);
  assert.equal(wrongMethod.result.statusCode, 405);
  assert.equal(wrongMethod.result.headers['Cache-Control'], 'no-store, max-age=0');
});

test('checkout apresenta erro amigável em navegação HTML e mantém JSON para API', () => {
  const invalidHtml = mockResponse();
  checkoutHandler({
    method: 'GET',
    headers: { accept: 'text/html,application/xhtml+xml' },
    query: { quantity: '<script>alert(1)</script>' },
    url: '/api/checkout?quantity=%3Cscript%3Ealert(1)%3C/script%3E',
  }, invalidHtml);
  assert.equal(invalidHtml.result.statusCode, 400);
  assert.equal(invalidHtml.result.headers['Content-Type'], 'text/html; charset=utf-8');
  assert.match(invalidHtml.result.body, /Voltar aos kits/);
  assert.match(invalidHtml.result.body, /contato@cowboyenergiamasculina\.com\.br/);
  assert.doesNotMatch(invalidHtml.result.body, /alert\(1\)/);

  withCheckoutEnvironment({ ...appmaxEnvironment, APPMAX_CHECKOUT_3_URL: 'http://checkout.example.test/kit-3' }, () => {
    const unavailableHtml = mockResponse();
    checkoutHandler({ method: 'GET', headers: { accept: 'text/html' }, query: { quantity: '3' }, url: '/api/checkout?quantity=3' }, unavailableHtml);
    assert.equal(unavailableHtml.result.statusCode, 503);
    assert.match(unavailableHtml.result.body, /Pagamento indisponível agora/);
    assert.doesNotMatch(unavailableHtml.result.body, /configurado/);

    const apiError = mockResponse();
    checkoutHandler({ method: 'GET', headers: { accept: 'application/json' }, query: { quantity: '3' }, url: '/api/checkout?quantity=3' }, apiError);
    assert.equal(apiError.result.statusCode, 503);
    assert.deepEqual(apiError.result.body, { error: 'checkout_unavailable' });
  });
});
