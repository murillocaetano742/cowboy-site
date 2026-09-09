'use strict';

// Simulação comportamental restrita; não substitui navegador, layout ou provedor real.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const checkoutHandler = require('#api/checkout');

class Element {
  constructor() { this.listeners = {}; this.dataset = {}; this.children = []; this.textContent = ''; this.disabled = false; this.value = ''; }
  addEventListener(type, listener) { this.listeners[type] = listener; }
  appendChild(child) { this.children.push(child); }
  setAttribute(name, value) { this[name] = value; }
  set innerHTML(value) { if (value === '') this.children = []; }
  focus() { this.focused = true; }
  fire(type) { const event = { prevented: false, preventDefault() { this.prevented = true; } }; this.listeners[type]?.(event); return event; }
}

function fixture({ search = '', storageData = {}, config = { shippingAvailable: true, variants: [1, 2, 4].map(quantity => ({ quantity, checkoutAvailable: true })) } } = {}) {
  const elements = Object.fromEntries(['shipping-form', 'shipping-status', 'shipping-results', 'checkout-form', 'checkout-button', 'checkout-status', 'support-link', 'selected-kit'].map(key => [key, new Element()]));
  const postalCode = new Element(); postalCode.value = '01001-000';
  const shippingButton = new Element();
  elements['shipping-form'].querySelector = selector => selector === 'button' ? shippingButton : postalCode;
  const offers = [1, 2, 4].map(quantity => { const element = new Element(); element.value = String(quantity); element.checked = quantity === 2; return element; });
  const pending = [];
  const context = {
    document: {
      querySelector: selector => selector === '[name="quantity"]:checked' ? offers.find(offer => offer.checked) : elements[selector.slice(6, -1)] || null,
      querySelectorAll: () => offers,
      createElement: () => new Element(),
    },
    window: {
      location: { search },
      sessionStorage: {
        getItem: key => Object.hasOwn(storageData, key) ? storageData[key] : null,
        setItem: (key, value) => { storageData[key] = String(value); },
      },
    }, URLSearchParams, AbortController,
    fetch: (url, options) => url === '/api/config' ? Promise.resolve({ ok: true, json: async () => config }) : new Promise((resolve, reject) => pending.push({ url, options, resolve, reject })),
  };
  vm.runInNewContext(fs.readFileSync(path.resolve('assets/js/cowboy-store.js'), 'utf8'), context);
  return {
    elements, postalCode, shippingButton, pending,
    select(quantity) { offers.forEach(offer => { offer.checked = Number(offer.value) === quantity; }); offers.find(offer => offer.checked).fire('change'); },
    submit() { return elements['shipping-form'].fire('submit'); },
  };
}

const settle = async () => { await new Promise(resolve => setImmediate(resolve)); await new Promise(resolve => setImmediate(resolve)); };
const quote = (pending, price = 10) => pending.resolve({ ok: true, json: async () => ({ available: true, quotes: [{ company: 'Transportadora de teste', service: 'Serviço de teste', price, deliveryDays: 3 }] }) });

test('QA: atribuição do anúncio chega ao formulário sem parâmetros arbitrários', async () => {
  const f = fixture({ search: '?utm_source=meta&utm_content=C03&email=private&diagnostico=private&fbclid=click' });
  await settle();
  const fields = Object.fromEntries(f.elements['checkout-form'].children.map(child => [child.name, child.value]));
  assert.deepEqual(fields, { utm_source: 'meta', utm_content: 'C03', fbclid: 'click' });
});

test('QA: atribuição permitida sobrevive à navegação interna na mesma sessão', async () => {
  const storageData = {};
  fixture({ search: '?utm_source=meta&utm_content=C03&email=private', storageData });
  await settle();
  const returned = fixture({ storageData });
  await settle();
  const fields = Object.fromEntries(returned.elements['checkout-form'].children.map(child => [child.name, child.value]));
  assert.deepEqual(fields, { utm_source: 'meta', utm_content: 'C03' });
});

test('QA: modelo Google chega do formulário à Cartpanda após navegação interna', async () => {
  const expected = {
    utm_source: 'google', utm_campaign: 'teste_campaign', utm_medium: 'teste_group',
    utm_content: 'teste_ad', utm_term: 'teste_placement::palavra com espaço',
    keyword: 'palavra com espaço', device: 'm', network: 'g', cid: '74579222594',
  };
  const storageData = {};
  fixture({ search: '?' + new URLSearchParams({ ...expected, email: 'private', diagnostico: 'private' }), storageData });
  await settle();
  const returned = fixture({ storageData });
  await settle();
  const formFields = Object.fromEntries(returned.elements['checkout-form'].children.map(child => [child.name, child.value]));
  assert.deepEqual(formFields, expected);

  // Exercise the actual redirect handler, including its separate allowlist.
  const response = { setHeader() {}, redirect(status, url) { this.status = status; this.url = url; } };
  checkoutHandler({
    method: 'GET', query: { quantity: '2' },
    url: '/api/checkout?' + new URLSearchParams({ quantity: '2', ...formFields, email: 'private' }),
  }, response);
  assert.equal(response.status, 302);
  const destination = new URL(response.url);
  assert.equal(destination.hostname, 'cowboy-energia.mycartpanda.com');
  assert.deepEqual(Object.fromEntries(destination.searchParams), expected);
});

test('QA: armazenamento inválido não quebra compra nem injeta atribuição arbitrária', async () => {
  for (const serialized of ['null', '{"utm_source":{"private":true}}', '{"utm_campaign":"' + 'x'.repeat(257) + '"}']) {
    const f = fixture({ storageData: { cowboy_attribution: serialized } });
    await settle();
    assert.deepEqual(f.elements['checkout-form'].children, []);
    assert.equal(f.elements['checkout-button'].disabled, false);
  }
});

test('QA: indisponibilidade conserva mensagem, impede submit e oferece SAC', async () => {
  const f = fixture({ config: { shippingAvailable: false, variants: [1, 2, 4].map(quantity => ({ quantity, checkoutAvailable: false })) } });
  await settle();
  f.select(4);
  assert.equal(f.shippingButton.disabled, true);
  assert.match(f.elements['shipping-status'].textContent, /indisponível/);
  assert.equal(f.elements['checkout-button'].disabled, true);
  assert.equal(f.elements['checkout-form'].fire('submit').prevented, true);
  assert.equal(f.elements['support-link'].hidden, false);
});

test('QA: resposta atrasada do kit anterior não aparece no kit atual', async () => {
  const f = fixture(); await settle(); f.submit();
  const old = f.pending[0];
  f.select(4); f.submit();
  assert.equal(old.options.signal.aborted, true);
  quote(old, 1); await settle();
  assert.equal(f.elements['shipping-results'].children.length, 0);
  assert.equal(f.shippingButton.disabled, true);
  quote(f.pending[1], 10); await settle();
  assert.match(f.elements['shipping-results'].children[0].textContent, /179,52/);
  assert.equal(f.shippingButton.disabled, false);
});

test('QA: mudança de CEP invalida cotação anterior e permite recuperação após erro', async () => {
  const f = fixture(); await settle(); f.submit();
  quote(f.pending[0], 10); await settle();
  assert.match(f.elements['shipping-results'].children[0].textContent, /94,76/);
  f.postalCode.value = '22290-040'; f.postalCode.fire('input');
  assert.equal(f.elements['shipping-results'].children.length, 0);
  f.submit(); f.pending[1].reject(new Error('provider')); await settle();
  assert.equal(f.shippingButton.disabled, false);
  assert.equal(f.elements['shipping-status'].dataset.state, 'error');
  f.submit(); quote(f.pending[2], 20); await settle();
  assert.match(f.elements['shipping-results'].children[0].textContent, /104,76/);
});

test('QA: HTML oferece compra GET com todos os kits sem depender do script', () => {
  const html = fs.readFileSync(path.resolve('index.html'), 'utf8');
  const checkout = html.match(/<form\b[^>]*data-checkout-form[^>]*>[\s\S]*?<\/form>/i)?.[0];
  assert.ok(checkout, 'Formulário de compra presente');
  assert.match(checkout, /method="get"/i);
  assert.match(checkout, /action="\/api\/checkout"/);
  for (const quantity of [1, 2, 4]) assert.match(checkout, new RegExp('name="quantity" value="' + quantity + '"'));
  assert.match(checkout, /type="submit"/);
});

test('QA: entrada /loja encaminha atribuição e exclui campos não permitidos', () => {
  const html = fs.readFileSync(path.resolve('loja.html'), 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  let destination;
  const fallback = {};
  vm.runInNewContext(script, {
    URLSearchParams,
    location: { search: '?utm_source=meta&utm_content=C10&email=private', replace: value => { destination = value; } },
    document: { getElementById: () => fallback },
  });
  assert.equal(destination, '/?utm_source=meta&utm_content=C10#ofertas');
  assert.equal(fallback.href, destination);
});

test('QA: relatos de clientes usam derivados locais com controle explícito e sem autoplay', () => {
  const html = fs.readFileSync(path.resolve('index.html'), 'utf8');
  const section = html.match(/<section\b[^>]*class="testimonials"[\s\S]*?<\/section>/i)?.[0];
  assert.ok(section, 'Seção de relatos presente');
  assert.match(section, /id="depoimentos"/);
  assert.match(section, /Relatos de clientes/);
  assert.match(section, /experiência é individual/i);
  assert.doesNotMatch(section, /\bautoplay\b/i);
  assert.doesNotMatch(section, /22\.000|anvisa|★★★★★|resultado[s]? reais/i);
  for (const number of [1, 2]) {
    assert.match(section, new RegExp(`<video[^>]*controls[^>]*playsinline[^>]*preload="none"[^>]*poster="videos/clientes/depoimento-${number}\\.jpg"`, 'i'));
    assert.match(section, new RegExp(`<source src="videos/clientes/depoimento-${number}\\.mp4" type="video/mp4">`, 'i'));
    assert.match(section, new RegExp(`<track kind="subtitles" srclang="pt-BR" label="Português \\(legendas automáticas\\)" src="videos/clientes/depoimento-${number}\\.vtt">`, 'i'));
  }
});
