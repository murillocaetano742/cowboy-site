'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
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
  assert.equal(body.products[0].insurance_value, '84.76');
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
  const previous = process.env.CARTPANDA_CHECKOUT_2_URL;
  const previousHosts = process.env.CARTPANDA_CHECKOUT_ALLOWED_HOSTS;
  process.env.CARTPANDA_CHECKOUT_2_URL = 'https://checkout.exemplo.test/kit-2?existing=value';
  process.env.CARTPANDA_CHECKOUT_ALLOWED_HOSTS = 'checkout.exemplo.test';
  const response = mockResponse();
  checkoutHandler({ method: 'GET', query: { quantity: '2' }, url: '/api/checkout?quantity=2&utm_source=meta&utm_content=C02&email=nao-permitido&diagnostico=nao' }, response);
  const redirect = new URL(response.result.redirectUrl);
  assert.equal(response.result.statusCode, 302);
  assert.equal(redirect.searchParams.get('utm_source'), 'meta');
  assert.equal(redirect.searchParams.get('utm_content'), 'C02');
  assert.equal(redirect.searchParams.get('email'), null);
  assert.equal(redirect.searchParams.get('diagnostico'), null);
  if (previous === undefined) delete process.env.CARTPANDA_CHECKOUT_2_URL;
  else process.env.CARTPANDA_CHECKOUT_2_URL = previous;
  if (previousHosts === undefined) delete process.env.CARTPANDA_CHECKOUT_ALLOWED_HOSTS;
  else process.env.CARTPANDA_CHECKOUT_ALLOWED_HOSTS = previousHosts;

  const unavailable = mockResponse();
  checkoutHandler({ method: 'GET', query: { quantity: '3' }, url: '/api/checkout?quantity=3' }, unavailable);
  assert.equal(unavailable.result.statusCode, 503);
  assert.equal(unavailable.result.body.error, 'checkout_unavailable');
});

test('checkout exige HTTPS e host Cartpanda ou domínio customizado explicitamente permitido', () => {
  assert.equal(commerce.checkoutUrlFor(1, { CARTPANDA_CHECKOUT_1_URL: 'http://loja.mycartpanda.com/checkout/1' }), null);
  assert.equal(commerce.checkoutUrlFor(1, { CARTPANDA_CHECKOUT_1_URL: 'https://falsa-mycartpanda.com/checkout/1' }), null);
  assert.ok(commerce.checkoutUrlFor(1, { CARTPANDA_CHECKOUT_1_URL: 'https://loja.mycartpanda.com/checkout/1' }));
  assert.equal(commerce.checkoutUrlFor(1, { CARTPANDA_CHECKOUT_1_URL: 'https://checkout.sualoja.com/1' }), null);
  assert.ok(commerce.checkoutUrlFor(1, {
    CARTPANDA_CHECKOUT_1_URL: 'https://checkout.sualoja.com/1',
    CARTPANDA_CHECKOUT_ALLOWED_HOSTS: 'checkout.sualoja.com',
  }));
});

test('checkout usa somente os links públicos Cartpanda confirmados quando não há override', () => {
  assert.deepEqual(Object.keys(commerce.CARTPANDA_PUBLIC_CHECKOUT_URLS), ['1', '2', '4']);
  assert.equal(commerce.checkoutUrlFor(1, {}).toString(), 'https://cowboy-energia.mycartpanda.com/checkout/211742450:1');
  assert.equal(commerce.checkoutUrlFor(2, {}).toString(), 'https://cowboy-energia.mycartpanda.com/checkout/211742746:1');
  assert.equal(commerce.checkoutUrlFor(4, {}).toString(), 'https://cowboy-energia.mycartpanda.com/checkout/211742749:1');
  assert.equal(commerce.checkoutUrlFor(3, {}), null);
  assert.equal(commerce.checkoutUrlFor(1, { CARTPANDA_CHECKOUT_1_URL: 'https://example.com/checkout/1' }), null);
});

test('pagina aprovada carrega o encaminhamento UTMify para Cartpanda sem segredo embutido', () => {
  const html = fs.readFileSync('cowboy-nova.html', 'utf8');
  assert.match(html, /src="https:\/\/cdn\.utmify\.com\.br\/scripts\/utms\/latest\.js"/);
  for (const attribute of [
    'data-utmify-prevent-xcod-sck',
    'data-utmify-prevent-subids',
    'data-utmify-ignore-iframe',
    'data-utmify-is-cartpanda',
    'async',
    'defer',
  ]) assert.match(html, new RegExp(`\\b${attribute}\\b`));
  assert.doesNotMatch(html, /CARTPANDA_API_TOKEN|MELHOR_ENVIO_TOKEN/);
});

test('configuração pública expõe oferta inicial e disponibilidade sem segredos', () => {
  const retained = {};
  for (const [key, value] of Object.entries(configuredEnvironment)) {
    retained[key] = process.env[key];
    process.env[key] = value;
  }
  const checkoutRetained = process.env.CARTPANDA_CHECKOUT_2_URL;
  process.env.CARTPANDA_CHECKOUT_2_URL = 'https://loja.mycartpanda.com/checkout/kit-2';
  const response = mockResponse();
  configHandler({ method: 'GET' }, response);
  assert.equal(response.result.statusCode, 200);
  assert.deepEqual(response.result.body.variants.map((variant) => variant.quantity), [1, 2, 4]);
  assert.equal(response.result.body.variants.find((variant) => variant.quantity === 2).checkoutAvailable, true);
  assert.equal(response.result.body.shippingAvailable, true);
  assert.equal(JSON.stringify(response.result.body).includes('server-only-token'), false);
  for (const [key, previous] of Object.entries(retained)) {
    if (previous === undefined) delete process.env[key];
    else process.env[key] = previous;
  }
  if (checkoutRetained === undefined) delete process.env.CARTPANDA_CHECKOUT_2_URL;
  else process.env.CARTPANDA_CHECKOUT_2_URL = checkoutRetained;
});

test('pacote de 1 a 4 frascos mantém peso e dimensões totais e muda apenas seguro', () => {
  for (const [quantity, insuredValue] of [[1, '54.76'], [2, '84.76'], [4, '169.52']]) {
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
