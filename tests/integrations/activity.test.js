'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { configuration, fetchOrders, kitForItems, normalizeTimestamp, publicOrder, selectActivity, syncActivity, writeActivity } = require('#activity');

const NOW = Date.parse('2026-09-16T20:00:00Z');
const ENV = Object.freeze({ CARTPANDA_API_TOKEN: 'private-unit-test-token', CARTPANDA_SHOP_SLUG: 'cowboy-energia', CARTPANDA_ACTIVITY_APPROVED_ORDER_IDS: Array.from({ length: 15 }, (_, index) => index + 1).join(',') });

function order(overrides = {}) {
  return {
    id: 1, shop: { slug: 'cowboy-energia' }, test: 0, is_cartx_test: 0,
    status_id: 'New', payment_status: 3, cancelled_at: null,
    chargeback_received: 0, refunds: [], created_at: '2026-09-16T10:20:00-03:00',
    customer: { first_name: 'Maria Clara', last_name: 'Exemplo', email: 'private@example.test', cpf: 'private-document' },
    address: { city: 'Goiânia', province_code: 'GO', address1: 'private-address', zip: 'private-postal-code' },
    line_items: [{ variant_id: 211742746, quantity: 1 }],
    ...overrides,
  };
}

function page(data, current = 1, last = 1, total = data.length) {
  return { ok: true, status: 200, json: async () => ({ orders: { current_page: current, last_page: last, total, data, next_page_url: 'https://untrusted.example.test/steal' } }) };
}

test('atividade publica somente primeiro nome, cidade/UF, quantidade e data com fuso', () => {
  const result = publicOrder(order(), { approvedIds: configuration(ENV).approvedIds, now: NOW });
  assert.deepEqual(result.value, { nome: 'Maria', cidade: 'Goiânia/GO', kit: 2, quando: '2026-09-16T13:20:00.000Z' });
  assert.doesNotMatch(JSON.stringify(result.value), /private|Clara|Exemplo/);
  assert.equal(publicOrder(order({ customer: { first_name: '<script>' } }), { approvedIds: configuration(ENV).approvedIds, now: NOW }).reason, 'invalid_public_fields');
  assert.equal(publicOrder(order({ address: { city: 'Goiânia', province_code: 'XX' } }), { approvedIds: configuration(ENV).approvedIds, now: NOW }).reason, 'invalid_public_fields');
});

test('pedido pago só é público com autorização privada e testes continuam proibidos', () => {
  assert.equal(publicOrder(order(), { now: NOW }).reason, 'publication_not_authorized');
  const approved = configuration({ ...ENV, CARTPANDA_ACTIVITY_APPROVED_ORDER_IDS: '1,51915653' });
  assert.ok(publicOrder(order(), { ...approved, now: NOW }).value);
  assert.equal(publicOrder(order({ id: 51915653 }), { ...approved, now: NOW }).reason, 'known_test');
  assert.equal(selectActivity([order()], { ...configuration({ ...ENV, CARTPANDA_ACTIVITY_APPROVED_ORDER_IDS: '' }), now: NOW }).pedidos.length, 0);
  assert.throws(() => configuration({ ...ENV, CARTPANDA_ACTIVITY_APPROVED_ORDER_IDS: 'not-an-id' }), /numeric IDs/);
});

test('atividade exclui testes pagos de produção e todos os estados não elegíveis', () => {
  for (const id of [51915653, 51921061]) assert.equal(publicOrder(order({ id }), { approvedIds: configuration(ENV).approvedIds, now: NOW }).reason, 'known_test');
  for (const overrides of [
    { test: 1 }, { is_cartx_test: '1' }, { tags: 'teste' }, { order_comment: 'compra de teste' },
    { test: undefined }, { payment_status: 1 }, { payment_status: 4 },
    { cancelled_at: '2026-09-16 13:00:00' }, { status_id: 'Cancelled' }, { status_id: 'Refund' },
    { status_id: 5 }, { status_id: 6 }, { status_id: 'Partially Refunded' }, { status_id: 'unknown' },
    { refunds: [{ amount: 1 }] }, { refunded_at: '2026-09-16 13:00:00' }, { chargeback_received: 1 },
    { chargeback_at: '2026-09-16 13:00:00' }, { total_refunded: 1 },
  ]) assert.ok(publicOrder(order(overrides), { approvedIds: configuration(ENV).approvedIds, now: NOW }).reason, JSON.stringify(overrides));
  const config = configuration({ ...ENV, CARTPANDA_ACTIVITY_EXCLUDE_ORDER_IDS: '42, 43' });
  assert.equal(publicOrder(order({ id: 42 }), { ...config, now: NOW }).reason, 'known_test');
  assert.equal(publicOrder(order({ id: 51921061 }), { ...config, now: NOW }).reason, 'known_test');
});

test('mapeia variantes exatas e rejeita kit 4, quantidades excessivas e produtos estranhos', () => {
  for (const [id, expected] of [[211742450, 1], [211742746, 2], [212751381, 3]]) assert.equal(kitForItems([{ variant_id: id, quantity: 1 }]), expected);
  assert.equal(kitForItems([{ variant_id: 211742450, quantity: 2 }]), 2);
  assert.equal(kitForItems([{ variant_id: 211742450, quantity: 1 }, { variant_id: 211742746, quantity: 1 }]), 3);
  for (const items of [[], [{ variant_id: 211742749, quantity: 1 }], [{ variant_id: 211742746, quantity: 2 }], [{ variant_id: 211742450, quantity: 1.5 }], [{ variant_id: 211742450, quantity: 0 }], [{ variant_id: 211742450, quantity: 1 }, { variant_id: 999, quantity: 1 }]]) assert.equal(kitForItems(items), null);
});

test('valor de reembolso aceita zero decimal e rejeita valor não zero ou malformado', () => {
  const options = { approvedIds: configuration(ENV).approvedIds, now: NOW };
  for (const total_refunded of [undefined, null, '', 0, '0', '0.0', '0.00', '0.000']) {
    assert.ok(publicOrder(order({ total_refunded }), options).value, `zero válido: ${String(total_refunded)}`);
  }
  for (const total_refunded of [1, 0.01, -1, -0.01, '0.01', '1.00', '-0.00', '-1.00', 'invalid', '0abc', '0,00', '0x0', '0e0', ' ', false, [], {}, NaN, Infinity]) {
    assert.equal(publicOrder(order({ total_refunded }), options).reason, 'refunded_or_chargeback', `valor rejeitado: ${String(total_refunded)}`);
  }
});

test('timestamp não usa fuso da máquina nem aceita data impossível, futura ou ambígua', () => {
  assert.equal(normalizeTimestamp('2026-09-16 10:20:00', '', NOW), null);
  assert.equal(normalizeTimestamp('2026-09-16 10:20:00', 'America/Sao_Paulo', NOW), '2026-09-16T13:20:00.000Z');
  assert.equal(normalizeTimestamp('2026-09-16T10:20:00.125+03:00', '', NOW), '2026-09-16T07:20:00.125Z');
  for (const value of ['2026-02-30T10:20:00Z', '2026-09-17T10:20:00Z', '2026-09-16T24:20:00Z', '2026-09-16T10:20:00+14:30', '2026-09-16', 'not-a-date']) assert.equal(normalizeTimestamp(value, '', NOW), null);
  assert.equal(normalizeTimestamp('2025-11-02 01:30:00', 'America/New_York', NOW), null);
  assert.equal(normalizeTimestamp('2026-03-08 02:30:00', 'America/New_York', NOW), null);
  assert.throws(() => configuration({ ...ENV, CARTPANDA_ORDER_TIMEZONE: 'invented-timezone' }), /IANA/);
});

test('seleciona os 12 mais recentes sem republicar IDs privados nem duplicados', () => {
  const orders = Array.from({ length: 15 }, (_, index) => order({ id: index + 1, created_at: `2026-09-${String(index + 1).padStart(2, '0')}T10:00:00Z` }));
  const result = selectActivity(orders, { approvedIds: configuration(ENV).approvedIds, now: NOW });
  assert.equal(result.summary.eligible, 15);
  assert.equal(result.pedidos.length, 12);
  assert.equal(result.pedidos[0].quando, '2026-09-15T10:00:00.000Z');
  assert.equal(result.pedidos[11].quando, '2026-09-04T10:00:00.000Z');
  assert.ok(result.pedidos.every((item) => !('id' in item)));
  assert.throws(() => selectActivity([order(), order()], { approvedIds: configuration(ENV).approvedIds, now: NOW }), /Repeated order ID/);
});

test('consulta todas as páginas na origem fixa e não segue URL nem redirect da API', async () => {
  const requests = [];
  const orders = await fetchOrders({ token: ENV.CARTPANDA_API_TOKEN, fetchImpl: async (url, options) => {
    requests.push({ url, options });
    const index = requests.length;
    return page([order({ id: index })], index, 2, 2);
  } });
  assert.equal(orders.length, 2);
  assert.deepEqual(requests.map((request) => request.url), ['https://accounts.cartpanda.com/api/cowboy-energia/orders?page=1', 'https://accounts.cartpanda.com/api/cowboy-energia/orders?page=2']);
  assert.ok(requests.every(({ options }) => options.redirect === 'manual' && options.headers.Authorization === `Bearer ${ENV.CARTPANDA_API_TOKEN}`));
  await assert.rejects(fetchOrders({ token: ENV.CARTPANDA_API_TOKEN, fetchImpl: async () => ({ ok: false, status: 302 }) }), /HTTP 302/);
});

test('rejeita exportação parcial, conta errada e erros sem vazar respostas ou credencial', async () => {
  await assert.rejects(fetchOrders({ token: ENV.CARTPANDA_API_TOKEN, fetchImpl: async () => page([order()], 1, 1, 2) }), /Incomplete/);
  await assert.rejects(fetchOrders({ token: ENV.CARTPANDA_API_TOKEN, fetchImpl: async () => page([order({ shop: { slug: 'other-shop' } })]) }), /shop identity/);
  await assert.rejects(fetchOrders({ token: ENV.CARTPANDA_API_TOKEN, fetchImpl: async () => { throw new Error(ENV.CARTPANDA_API_TOKEN); } }), (error) => !error.message.includes(ENV.CARTPANDA_API_TOKEN));
  await assert.rejects(fetchOrders({ token: ENV.CARTPANDA_API_TOKEN, fetchImpl: async () => ({ ok: false, status: 401, json: async () => ({ message: 'private buyer' }) }) }), (error) => !error.message.includes('private buyer'));
  let calls = 0;
  await assert.rejects(fetchOrders({ token: ENV.CARTPANDA_API_TOKEN, fetchImpl: async () => { calls += 1; return page([order({ id: calls })], calls, 2, calls === 1 ? 2 : 3); } }), /changed during pagination/);
});

test('dry-run não escreve; sync substitui pedidos, preserva relatos e remove pedido reembolsado', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'cowboy-activity-'));
  const filename = path.join(directory, 'atividade.json');
  const original = { _como_preencher: 'preservar', pedidos: [{ nome: 'Anterior', cidade: 'Goiânia/GO', kit: 1, quando: '2026-09-15T10:00:00Z' }], relatos: [{ nome: 'Relato existente', texto: 'preservar' }] };
  try {
    await fs.writeFile(filename, JSON.stringify(original));
    const input = { env: ENV, filename, now: NOW, fetchImpl: async () => page([order()]) };
    const preview = await syncActivity(input);
    assert.equal(preview.mode, 'dry-run');
    assert.equal(preview.selected, 1);
    assert.doesNotMatch(JSON.stringify(preview), /Maria|private@example/);
    assert.deepEqual(JSON.parse(await fs.readFile(filename, 'utf8')), original);
    assert.equal((await syncActivity({ ...input, write: true })).changed, true);
    let written = JSON.parse(await fs.readFile(filename, 'utf8'));
    assert.deepEqual(written.relatos, original.relatos);
    assert.equal(written._como_preencher, original._como_preencher);
    assert.equal(written.pedidos[0].nome, 'Maria');
    assert.equal(await writeActivity(written.pedidos, filename), false);
    assert.equal((await syncActivity({ ...input, write: true, fetchImpl: async () => page([order({ refunds: [{ amount: 1 }] })]) })).changed, true);
    written = JSON.parse(await fs.readFile(filename, 'utf8'));
    assert.deepEqual(written.pedidos, []);
    assert.deepEqual(written.relatos, original.relatos);
    assert.deepEqual(await fs.readdir(directory), ['atividade.json']);
  } finally { await fs.unlink(filename); await fs.rmdir(directory); }
});

test('sync preserva arquivo existente se API falha ou data de candidato não tem fuso verificado', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'cowboy-activity-failure-'));
  const filename = path.join(directory, 'atividade.json');
  const original = '{"pedidos":[],"relatos":[]}\n';
  try {
    await fs.writeFile(filename, original);
    const input = { env: ENV, filename, now: NOW, write: true };
    await assert.rejects(syncActivity({ ...input, fetchImpl: async () => ({ ok: false, status: 500 }) }), /HTTP 500/);
    await assert.rejects(syncActivity({ ...input, fetchImpl: async () => page([order({ created_at: '2026-09-16 10:20:00' })]) }), /timestamps are unverified/);
    assert.equal(await fs.readFile(filename, 'utf8'), original);
  } finally { await fs.unlink(filename); await fs.rmdir(directory); }
});
