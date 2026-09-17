'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { CARTPANDA_PUBLIC_CHECKOUT_URLS } = require('#commerce');

const ROOT = path.resolve(__dirname, '..');
const ACTIVITY_FILE = path.join(ROOT, 'assets', 'data', 'atividade.json');
const API_ORIGIN = 'https://accounts.cartpanda.com';
const SHOP_SLUG = 'cowboy-energia';
const MAX_PAGES = 100;
const MAX_PUBLIC_ORDERS = 12;
// Production payments made for operational tests, despite test=0 in Cartpanda.
// Evidence: docs/integracoes/prontidao-campanhas-2026-09-10.md and
// docs/stories/VSL-034-entrada-atividade.md.
const KNOWN_TEST_ORDER_IDS = Object.freeze(['51915653', '51921061', '51980506']);
const BRAZIL_STATES = new Set('AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' '));
const ALLOWED_ORDER_STATUSES = new Set(['1', '2', '3', '7', 'new', 'open', 'fulfilled', 'bankpaid']);
const FALSE_FLAGS = new Set([0, '0', false]);
const VARIANT_KITS = new Map(Object.entries(CARTPANDA_PUBLIC_CHECKOUT_URLS).map(([kit, url]) => {
  const match = new URL(url).pathname.match(/^\/checkout\/(\d+):1$/);
  if (!match) throw new Error('Public checkout variant contract changed');
  return [match[1], Number(kit)];
}));

function flagIsSet(value) {
  return value !== undefined && value !== null && value !== '' && !FALSE_FLAGS.has(value);
}

function hasRefundedAmount(value) {
  if (value === undefined || value === null || value === '') return false;
  if (typeof value === 'number') return value !== 0;
  // Accept only an explicit decimal zero. Nonzero, negative and malformed
  // monetary values all keep the order out of the public feed.
  return typeof value !== 'string' || !/^0(?:\.0+)?$/.test(value.trim());
}

function configuration(env = process.env) {
  const token = String(env.CARTPANDA_API_TOKEN || '').trim();
  if (!token) throw new Error('CARTPANDA_API_TOKEN is required');
  if (env.CARTPANDA_SHOP_SLUG !== SHOP_SLUG) throw new Error('CARTPANDA_SHOP_SLUG must identify cowboy-energia');
  const excludedIds = String(env.CARTPANDA_ACTIVITY_EXCLUDE_ORDER_IDS || '').split(',').map((id) => id.trim()).filter(Boolean);
  if (excludedIds.some((id) => !/^\d+$/.test(id))) throw new Error('CARTPANDA_ACTIVITY_EXCLUDE_ORDER_IDS must contain numeric IDs');
  const approvedIds = String(env.CARTPANDA_ACTIVITY_APPROVED_ORDER_IDS || '').split(',').map((id) => id.trim()).filter(Boolean);
  if (approvedIds.some((id) => !/^\d+$/.test(id))) throw new Error('CARTPANDA_ACTIVITY_APPROVED_ORDER_IDS must contain numeric IDs');
  const timezone = String(env.CARTPANDA_ORDER_TIMEZONE || '').trim();
  if (timezone) {
    try { new Intl.DateTimeFormat('en-GB', { timeZone: timezone }).format(); }
    catch { throw new Error('CARTPANDA_ORDER_TIMEZONE must be a confirmed IANA timezone'); }
  }
  return { token, timezone, approvedIds: new Set(approvedIds), excludedIds: new Set([...KNOWN_TEST_ORDER_IDS, ...excludedIds]) };
}

function utcFromParts(parts) {
  const date = new Date(0);
  date.setUTCFullYear(parts[0], parts[1] - 1, parts[2]);
  date.setUTCHours(parts[3], parts[4], parts[5], 0);
  return date.getTime();
}

function validParts(parts) {
  const date = new Date(utcFromParts(parts));
  return parts[0] >= 2000 && parts[0] <= 9999 && [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()].every((value, index) => value === parts[index]);
}

function normalizeTimestamp(value, timezone, now = Date.now()) {
  if (typeof value !== 'string') return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})?$/);
  if (!match) return null;
  const parts = match.slice(1, 7).map(Number);
  if (!validParts(parts)) return null;
  const milliseconds = Number((match[7] || '').padEnd(3, '0'));
  const wallTime = utcFromParts(parts);
  let instant;
  if (match[8]) {
    const zone = match[8];
    const hours = zone === 'Z' ? 0 : Number(zone.slice(1, 3));
    const minutes = zone === 'Z' ? 0 : Number(zone.slice(4, 6));
    if (hours > 14 || minutes > 59 || (hours === 14 && minutes !== 0)) return null;
    instant = wallTime - (zone.startsWith('-') ? -1 : 1) * (hours * 60 + minutes) * 60000 + milliseconds;
  } else {
    if (!timezone) return null;
    const formatter = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
    const localParts = (time) => {
      const fields = Object.fromEntries(formatter.formatToParts(time).map(({ type, value: field }) => [type, field]));
      return ['year', 'month', 'day', 'hour', 'minute', 'second'].map((key) => Number(fields[key]));
    };
    // Consider both sides of a DST transition; ambiguous/nonexistent hours fail closed.
    const offsets = new Set([-86400000, 0, 86400000].map((delta) => utcFromParts(localParts(wallTime + delta)) - (wallTime + delta)));
    const candidates = [...offsets].map((offset) => wallTime - offset).filter((time) => localParts(time).every((part, index) => part === parts[index]));
    if (candidates.length !== 1) return null;
    instant = candidates[0] + milliseconds;
  }
  return Number.isFinite(instant) && instant <= now ? new Date(instant).toISOString() : null;
}

function kitForItems(items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  let kit = 0;
  for (const item of items) {
    const size = VARIANT_KITS.get(String(item.variant_id));
    const quantity = typeof item.quantity === 'number' || typeof item.quantity === 'string' ? Number(item.quantity) : NaN;
    if (!size || !Number.isInteger(quantity) || quantity < 1 || quantity > 3) return null;
    kit += size * quantity;
  }
  return kit >= 1 && kit <= 3 ? kit : null;
}

function testMarker(order) {
  const tags = [order.tags, order.order_tags, order.note, order.order_comment];
  const marker = tags.map((value) => typeof value === 'string' ? value : JSON.stringify(value || '')).join(' ');
  return /\b(?:teste|test|sandbox|homologa(?:cao|ção))\b/i.test(marker);
}

function publicOrder(order, { excludedIds = new Set(KNOWN_TEST_ORDER_IDS), approvedIds = new Set(), timezone = '', now = Date.now() } = {}) {
  const reject = (reason) => ({ reason });
  if (!order || !/^\d+$/.test(String(order.id))) return reject('invalid_order');
  if (excludedIds.has(String(order.id))) return reject('known_test');
  if (flagIsSet(order.test) || flagIsSet(order.is_cartx_test) || flagIsSet(order.is_test) || testMarker(order)) return reject('test');
  // Both provider test flags must be present and explicitly false.
  if (!FALSE_FLAGS.has(order.test) || !FALSE_FLAGS.has(order.is_cartx_test)) return reject('unverified_test_flags');
  const status = String(order.status_id ?? '').toLowerCase().replace(/[\s_-]/g, '');
  if (order.cancelled_at || order.canceled_at || !ALLOWED_ORDER_STATUSES.has(status)) return reject('cancelled_or_unverified_status');
  if (Number(order.payment_status) !== 3) return reject('unpaid');
  if (flagIsSet(order.chargeback_received) || order.chargeback_at || order.refunded_at || (order.refunds && (!Array.isArray(order.refunds) || order.refunds.length > 0)) || hasRefundedAmount(order.total_refunded)) return reject('refunded_or_chargeback');
  const kit = kitForItems(order.line_items);
  if (!kit) return reject('unsupported_kit');
  // The existing page promises a name authorized by the customer. Payment alone
  // is not evidence of that authorization; keep its order IDs in private config.
  if (!approvedIds.has(String(order.id))) return reject('publication_not_authorized');
  const nome = typeof order.customer?.first_name === 'string' ? order.customer.first_name.trim().split(/\s+/)[0] : '';
  const city = typeof order.address?.city === 'string' ? order.address.city.trim().replace(/\s+/g, ' ') : '';
  const state = String(order.address?.province_code || '').toUpperCase();
  if (!/^[\p{L}\p{M}][\p{L}\p{M}'’-]{0,39}$/u.test(nome) || /^(?:teste?|sandbox|demo)$/i.test(nome) || !/^[\p{L}\p{M} .’'-]{2,80}$/u.test(city) || !BRAZIL_STATES.has(state)) return reject('invalid_public_fields');
  // API's created_at is the order creation time, never invented payment time.
  const quando = normalizeTimestamp(order.created_at, timezone, now);
  if (!quando) return reject('unverified_timestamp');
  return { value: { nome, cidade: `${city}/${state}`, kit, quando } };
}

function selectActivity(orders, options = {}) {
  const accepted = [];
  const skipped = {};
  const ids = new Set();
  for (const order of orders) {
    if (ids.has(String(order?.id))) throw new Error('Repeated order ID across API pages; retry a complete export');
    ids.add(String(order?.id));
    const result = publicOrder(order, options);
    if (result.reason) skipped[result.reason] = (skipped[result.reason] || 0) + 1;
    else accepted.push({ id: Number(order.id), ...result.value });
  }
  accepted.sort((first, second) => Date.parse(second.quando) - Date.parse(first.quando) || second.id - first.id);
  return {
    pedidos: accepted.slice(0, MAX_PUBLIC_ORDERS).map(({ id: _id, ...publicFields }) => publicFields),
    summary: { fetched: orders.length, eligible: accepted.length, selected: Math.min(accepted.length, MAX_PUBLIC_ORDERS), skipped },
  };
}

async function fetchOrders({ token, fetchImpl = fetch }) {
  const orders = [];
  let expectedLastPage;
  let expectedTotal;
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    // Build pagination locally. Never follow API-provided links or redirects with the token.
    const url = new URL(`/api/${SHOP_SLUG}/orders`, API_ORIGIN);
    url.searchParams.set('page', String(page));
    let response;
    try {
      response = await fetchImpl(url.href, { method: 'GET', headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, redirect: 'manual', signal: AbortSignal.timeout(20000) });
    } catch { throw new Error('Cartpanda orders request failed; no activity file written'); }
    if (!response.ok) throw new Error(`Cartpanda orders returned HTTP ${Number(response.status)}; no activity file written`);
    let data;
    try { data = await response.json(); }
    catch { throw new Error('Cartpanda orders response is not JSON'); }
    const result = data?.orders;
    if (!result || !Array.isArray(result.data) || result.current_page !== page || !Number.isInteger(result.last_page) || result.last_page < page || result.last_page > MAX_PAGES || !Number.isInteger(result.total) || result.total < 0) throw new Error('Unexpected or oversized Cartpanda pagination; no activity file written');
    if (page === 1) { expectedLastPage = result.last_page; expectedTotal = result.total; }
    if (result.last_page !== expectedLastPage || result.total !== expectedTotal) throw new Error('Orders changed during pagination; retry a complete export');
    if (result.data.some((order) => order.shop?.slug !== SHOP_SLUG)) throw new Error('Order shop identity does not match cowboy-energia');
    orders.push(...result.data);
    if (page === result.last_page) {
      if (orders.length !== expectedTotal) throw new Error('Incomplete Cartpanda order export; no activity file written');
      return orders;
    }
  }
  throw new Error('Cartpanda order export exceeded page limit');
}

async function writeActivity(pedidos, filename = ACTIVITY_FILE) {
  const existing = await fs.readFile(filename, 'utf8');
  const feed = JSON.parse(existing);
  if (!feed || !Array.isArray(feed.pedidos) || !Array.isArray(feed.relatos)) throw new Error('Unexpected activity feed structure');
  if (JSON.stringify(feed.pedidos) === JSON.stringify(pedidos)) return false;
  const temporary = path.join(path.dirname(filename), `.atividade-${randomUUID()}.tmp`);
  try {
    await fs.writeFile(temporary, `${JSON.stringify({ ...feed, pedidos }, null, 2)}\n`, { flag: 'wx' });
    await fs.rename(temporary, filename);
  } finally { await fs.rm(temporary, { force: true }); }
  return true;
}

async function syncActivity({ env = process.env, fetchImpl = fetch, write = false, filename = ACTIVITY_FILE, now = Date.now() } = {}) {
  const config = configuration(env);
  const orders = await fetchOrders({ token: config.token, fetchImpl });
  const { pedidos, summary } = selectActivity(orders, { ...config, now });
  if (write && summary.skipped.unverified_timestamp) throw new Error('Order timestamps are unverified; confirm CARTPANDA_ORDER_TIMEZONE before writing');
  const changed = write ? await writeActivity(pedidos, filename) : false;
  return { mode: write ? 'write' : 'dry-run', ...summary, timezoneConfigured: Boolean(config.timezone), changed, deploymentRequired: changed };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some((argument) => !['--write', '--dry-run'].includes(argument)) || (args.includes('--write') && args.includes('--dry-run'))) throw new Error('Usage: cartpanda-sync-activity.js [--dry-run | --write]');
  console.log(JSON.stringify(await syncActivity({ write: args.includes('--write') }), null, 2));
}

if (require.main === module) main().catch((error) => {
  // Never log provider responses, raw orders, request headers or stack traces.
  const message = String(error.message).replaceAll(process.env.CARTPANDA_API_TOKEN || '\0', '[redacted]');
  console.error(message);
  process.exitCode = 1;
});

module.exports = { configuration, fetchOrders, kitForItems, normalizeTimestamp, publicOrder, selectActivity, syncActivity, writeActivity };
