'use strict';

const fs = require('node:fs');
const path = require('node:path');
const TOKEN = process.env.CARTPANDA_API_TOKEN;
const ROOT = path.resolve(__dirname, '..');
const BEFORE = path.join(ROOT, '.local', 'cartpanda-products-before.json');
const KITS = [
  { id: 29750488, quantity: 1, price: 54.76, variantId: 211742450 },
  { id: 29750542, quantity: 2, price: 84.76, variantId: 211742746 },
  { id: 29750543, quantity: 4, price: 169.52, variantId: 211742749 },
];
if (!TOKEN || !fs.existsSync(BEFORE)) throw new Error('Private token and rollback snapshot are required');

function payloadFor(kit) {
  const title = `COWBOY Energia — ${kit.quantity === 1 ? '1 frasco' : `kit ${kit.quantity} frascos`} de 30 mL`;
  return {
    id: kit.id, title,
    description: `<p>${kit.quantity === 1 ? '1 frasco' : `${kit.quantity} frascos`} de COWBOY Energia, suplemento alimentar em gotas. Cada frasco contém 30 mL.</p><p>Com feno-grego, taurina, arginina, vitamina B6, zinco e boro. Não contém glúten. Contém corante artificial.</p><p>Indicado no rótulo para pessoas a partir de 19 anos. Este produto não é um medicamento. Siga as orientações do rótulo e não exceda a recomendação diária indicada na embalagem. Se recebeu orientação individual diferente, confirme o uso com o profissional que acompanha você.</p><p>Não deve ser consumido por gestantes, lactantes e crianças. Mantenha fora do alcance de crianças.</p><p>Frete calculado antes do pagamento.</p>`,
    seo_title: title,
    seo_description: `${kit.quantity === 1 ? '1 frasco' : `${kit.quantity} frascos`} de 30 mL. Confira composição, preço e entrega do suplemento alimentar COWBOY Energia.`,
    price: kit.price, compare_at_price: 0,
    weight: 0.5, weight_unit: 'kg', length: 23, width: 8, height: 8, dimension_unit: 'cm', requires_shipping: 1,
  };
}

async function request(method, suffix, body) {
  const response = await fetch(`https://accounts.cartpanda.com/api/cowboy-energia/products${suffix}`, {
    method, headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json', 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined, redirect: 'manual', signal: AbortSignal.timeout(20000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Cartpanda ${response.status}: ${String(data.message || 'request rejected').replaceAll(TOKEN, '[redacted]')}`);
  return data;
}

async function main() {
  if (!process.argv.includes('--apply')) {
    console.log(JSON.stringify({ mode: 'review', changes: KITS.map(payloadFor) }, null, 2));
    return;
  }
  const receipt = [];
  for (const kit of KITS) {
    const beforeResult = await request('GET', `/${kit.id}`);
    const beforeProduct = beforeResult.product || beforeResult.products;
    if (!beforeProduct || beforeProduct.id !== kit.id) throw new Error('Unexpected product before update');
    const beforeFields = Object.fromEntries(Object.keys(payloadFor(kit)).map((key) => [key, beforeProduct[key] ?? beforeProduct.product_default_variant?.[key] ?? null]));
    const beforePath = path.join(ROOT, '.local', `cartpanda-before-fields-${kit.id}.json`);
    if (!fs.existsSync(beforePath)) fs.writeFileSync(beforePath, JSON.stringify({ capturedAt: new Date().toISOString(), product: beforeFields, variant: beforeProduct.product_default_variant }, null, 2));
    await request('PUT', `/${kit.id}`, payloadFor(kit));
    const latest = await request('GET', `/${kit.id}`);
    const product = latest.product || latest.products;
    const variant = product?.product_default_variant;
    if (!product || variant?.id !== kit.variantId || Math.round(Number(variant.price) * 100) !== Math.round(kit.price * 100)) {
      throw new Error(`Price reconciliation failed for product ${kit.id}; stop and inspect before proceeding`);
    }
    const result = { id: product.id, variantId: variant.id, title: product.title, priceCents: Math.round(Number(variant.price) * 100), weightKg: variant.weight, widthCm: variant.width, heightCm: variant.height, lengthCm: variant.length, requiresShipping: variant.requires_shipping, checkoutLinks: product.checkout_links };
    receipt.push(result);
    fs.writeFileSync(path.join(ROOT, '.local', 'cartpanda-offer-receipt.json'), JSON.stringify({ updatedAt: new Date().toISOString(), products: receipt }, null, 2));
    console.log(JSON.stringify(result));
  }
}
main().catch((error) => { console.error(String(error.message).replaceAll(TOKEN, '[redacted]')); process.exitCode = 1; });
