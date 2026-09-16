'use strict';

// VSL-030. Dry-run by default. Does not alter copy, media or shipping profiles.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { OFFER, CARTPANDA_PUBLIC_CHECKOUT_URLS } = require('#commerce');
const { LOGISTICS } = require('#logistics');

const KITS = Object.freeze([
  { quantity: 1, productId: 29750488, variantId: 211742450 },
  { quantity: 2, productId: 29750542, variantId: 211742746 },
  { quantity: 3, productId: 29892228, variantId: 212751381 },
]);
const PRODUCT_FIELDS = ['id', 'title', 'description', 'handle', 'seo_title', 'seo_description', 'sku', 'barcode', 'active', 'is_available_checkout', 'minimum_quantity', 'minimum_quantity_count', 'max_quantity', 'max_quantity_count', 'inventory_policy', 'quantity', 'compare_at_price', 'checkout_links'];
const VARIANT_FIELDS = ['id', 'product_id', 'title', 'sku', 'barcode', 'quantity', 'inventory_policy', 'compare_at_price', 'taxable'];
const PHYSICAL = Object.freeze({ weight: LOGISTICS.parcel.weightKg, weight_unit: 'kg', length: LOGISTICS.parcel.lengthCm, width: LOGISTICS.parcel.widthCm, height: LOGISTICS.parcel.heightCm, dimension_unit: 'cm', requires_shipping: 1 });

function select(object, fields) {
  return Object.fromEntries(fields.filter(key => object[key] !== undefined).map(key => [key, object[key]]));
}
function snapshot(product) {
  return {
    product: select(product, [...PRODUCT_FIELDS, 'price', ...Object.keys(PHYSICAL)]),
    variant: select(product.product_default_variant, [...VARIANT_FIELDS, 'price', ...Object.keys(PHYSICAL)]),
    images: (product.images || []).map(image => ({ id: image.id, src: image.src, position: image.position, alt: image.alt })),
  };
}
function protectedState(state) {
  return { product: select(state.product, PRODUCT_FIELDS), variant: select(state.variant, VARIANT_FIELDS), images: state.images };
}
function summary(kit, product) {
  return { quantity: kit.quantity, productId: product.id, variantId: product.product_default_variant.id, priceCents: Math.round(Number(product.product_default_variant.price) * 100), physical: select(product.product_default_variant, Object.keys(PHYSICAL)) };
}
async function main() {
  const token = process.env.CARTPANDA_API_TOKEN;
  if (!token) throw new Error('CARTPANDA_API_TOKEN ausente');
  if (process.env.CARTPANDA_SHOP_SLUG && process.env.CARTPANDA_SHOP_SLUG !== 'cowboy-energia') throw new Error('Loja diferente da autorizada');
  if (process.argv.slice(2).some(arg => arg !== '--apply')) throw new Error('Use apenas --apply ou nenhum argumento para revisar');
  const apply = process.argv.includes('--apply');
  const directory = path.resolve(__dirname, '..', '.local', 'vsl-030', `offer-${new Date().toISOString().replace(/[:.]/g, '-')}`);
  fs.mkdirSync(directory, { recursive: true });

  async function request(productId, method = 'GET', payload) {
    const response = await fetch(`https://accounts.cartpanda.com/api/cowboy-energia/products/${productId}`, {
      method, redirect: 'manual', signal: AbortSignal.timeout(20000),
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: payload ? JSON.stringify(payload) : undefined,
    });
    if (!response.ok) throw new Error(`Cartpanda ${method} produto ${productId}: HTTP ${response.status}`);
    const data = await response.json();
    return data.product || data.products;
  }

  // Read and validate every target before the first write.
  const plan = [];
  for (const kit of KITS) {
    assert.equal(new URL(CARTPANDA_PUBLIC_CHECKOUT_URLS[kit.quantity]).pathname, `/checkout/${kit.variantId}:1`);
    const product = await request(kit.productId);
    assert.equal(product?.id, kit.productId, 'Produto inesperado');
    assert.equal(product?.product_default_variant?.id, kit.variantId, 'Variante inesperada');
    const payload = { id: kit.productId, price: OFFER.variants[kit.quantity].totalPriceCents / 100, ...PHYSICAL };
    const before = snapshot(product);
    plan.push({ kit, payload, before });
    console.log(JSON.stringify({ mode: apply ? 'apply' : 'review', before: summary(kit, product), payload }));
  }
  fs.writeFileSync(path.join(directory, 'before.json'), JSON.stringify({ capturedAt: new Date().toISOString(), plan }, null, 2), { flag: 'wx' });
  if (!apply) return;

  for (const { kit, payload, before } of plan) {
    const current = await request(kit.productId);
    assert.deepEqual(snapshot(current), before, 'Produto mudou após revisão; interrompido antes de gravar');
    await request(kit.productId, 'PUT', payload);
    const after = await request(kit.productId);
    const state = snapshot(after);
    fs.writeFileSync(path.join(directory, `after-${kit.productId}.json`), JSON.stringify({ checkedAt: new Date().toISOString(), state }, null, 2), { flag: 'wx' });
    assert.deepEqual(protectedState(state), protectedState(before), 'Campo não autorizado mudou; interromper e conferir snapshot');
    assert.equal(Math.round(Number(state.variant.price) * 100), OFFER.variants[kit.quantity].totalPriceCents);
    assert.equal(Number(state.product.price), OFFER.variants[kit.quantity].totalPriceCents);
    for (const [key, expected] of Object.entries(PHYSICAL)) {
      assert.equal(typeof expected === 'number' ? Number(state.variant[key]) : state.variant[key], expected, `Dado físico não conciliado: ${key}`);
    }
    console.log(JSON.stringify({ result: 'verified', ...summary(kit, after) }));
  }
  console.log('Preços e medidas relidos. Frete e parcelamento exigem verificação separada no checkout.');
}

main().catch(error => { console.error(String(error.message).replaceAll(process.env.CARTPANDA_API_TOKEN || 'NO_TOKEN', '[redacted]')); process.exitCode = 1; });
