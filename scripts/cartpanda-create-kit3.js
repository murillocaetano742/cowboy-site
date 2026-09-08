'use strict';

// Cria o produto "kit 3 frascos" no Cartpanda espelhando o kit de 2 (preço R$ 127,14, mesma embalagem).
// Uso: node --env-file=.env.local scripts/cartpanda-create-kit3.js
// Idempotente: se já existir um produto com "3 frascos" no título, apenas imprime o link de checkout.
// Depois, copie o page_link para CARTPANDA_CHECKOUT_3_URL (Vercel e .env.local) ou para
// CARTPANDA_PUBLIC_CHECKOUT_URLS[3] em config/commerce.js.

const fs = require('node:fs');
const path = require('node:path');

const TOKEN = process.env.CARTPANDA_API_TOKEN;
if (!TOKEN) throw new Error('CARTPANDA_API_TOKEN ausente');
const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://accounts.cartpanda.com/api/cowboy-energia/products';
const HEADERS = { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json', 'Content-Type': 'application/json' };
const redact = (value) => String(value).replaceAll(TOKEN, '[redacted]');

async function request(method, suffix, body) {
  const response = await fetch(BASE + suffix, {
    method, headers: HEADERS, body: body ? JSON.stringify(body) : undefined, redirect: 'manual', signal: AbortSignal.timeout(30000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Cartpanda ${response.status}: ${redact(JSON.stringify(data).slice(0, 400))}`);
  return data;
}

async function main() {
  const list = await request('GET', '');
  const items = list?.products?.data || list?.products || list?.data || [];
  const existing = items.find((product) => /3 frascos/i.test(product.title || '') || /3-frascos/.test(product.handle || ''));
  if (existing) {
    console.log(JSON.stringify({ status: 'already_exists', id: existing.id, title: existing.title, checkout_links: existing.checkout_links }, null, 2));
    return;
  }
  const title = 'COWBOY Energia — kit 3 frascos de 30 mL';
  const description = '<p>3 frascos de COWBOY Energia, suplemento alimentar em gotas. Cada frasco contém 30 mL.</p><p>Com feno-grego, taurina, arginina, vitamina B6, zinco e boro. Não contém glúten. Contém corante artificial.</p><p>Indicado no rótulo para pessoas a partir de 19 anos. Este produto não é um medicamento. Siga as orientações do rótulo e não exceda a recomendação diária indicada na embalagem. Se recebeu orientação individual diferente, confirme o uso com o profissional que acompanha você.</p><p>Não deve ser consumido por gestantes, lactantes e crianças. Mantenha fora do alcance de crianças.</p><p>Frete calculado antes do pagamento.</p>';
  const payload = {
    title, description, seo_title: title,
    seo_description: '3 frascos de 30 mL. Confira composição, preço e entrega do suplemento alimentar COWBOY Energia.',
    price: 127.14, compare_at_price: 0,
    weight: 0.5, weight_unit: 'kg', length: 23, width: 8, height: 8, dimension_unit: 'cm',
    requires_shipping: 1, active: 1, inventory_policy: 0,
  };
  const imagePath = path.join(ROOT, 'imagens', 'kit-3-frascos.jpg');
  if (fs.existsSync(imagePath)) payload.images = [{ attachment: fs.readFileSync(imagePath).toString('base64') }];

  let created;
  try {
    created = await request('POST', '', payload);
  } catch (error) {
    if (!payload.images) throw error;
    console.log('Criação com imagem rejeitada, tentando sem imagem:', redact(error.message));
    delete payload.images;
    created = await request('POST', '', payload);
  }
  const product = created.product || created.products || created;
  if (!product?.id) throw new Error(`Resposta sem id: ${redact(JSON.stringify(created).slice(0, 300))}`);

  const latest = await request('GET', `/${product.id}`);
  const full = latest.product || latest.products;
  const variant = full?.product_default_variant || {};
  if (Math.round(Number(variant.price) * 100) !== 12714) {
    throw new Error(`Preço do kit 3 não confere (${variant.price}); revise no painel antes de usar o link`);
  }
  const receipt = {
    createdAt: new Date().toISOString(),
    id: full.id, title: full.title, handle: full.handle, active: full.active, is_available_checkout: full.is_available_checkout,
    variantId: variant.id, priceCents: Math.round(Number(variant.price) * 100), weightKg: variant.weight, requiresShipping: variant.requires_shipping,
    checkout_links: full.checkout_links, images: (full.images || []).length,
  };
  fs.mkdirSync(path.join(ROOT, '.local'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, '.local', 'cartpanda-kit3-receipt.json'), JSON.stringify(receipt, null, 2));
  console.log(JSON.stringify(receipt, null, 2));
  console.log('\nPróximo passo: colocar o page_link acima em CARTPANDA_CHECKOUT_3_URL (Vercel e .env.local).');
}

main().catch((error) => { console.error('ERRO:', redact(error.message)); process.exitCode = 1; });
