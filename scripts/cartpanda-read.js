'use strict';

// Read-only operational probe. Bearer authentication and this origin are
// documented at dev.cartpanda.com. No redirects may receive the credential.
const TOKEN = process.env.CARTPANDA_API_TOKEN;
const ORIGIN = 'https://accounts.cartpanda.com';
const SHOP = 'cowboy-energia';
if (!TOKEN) throw new Error('CARTPANDA_API_TOKEN is missing');

async function main() {
  const pathname = `/api/${SHOP}/products`;
  const response = await fetch(`${ORIGIN}${pathname}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json' },
    redirect: 'manual',
    signal: AbortSignal.timeout(20000),
  });
  const contentType = response.headers.get('content-type') || '';
  const body = await response.text();
  let data;
  try { data = JSON.parse(body); } catch { data = null; }
  const source = data?.products?.data || data?.products || data?.data || [];
  const firstShop = Array.isArray(source) ? source.find((product) => product.shop)?.shop : null;
  const shopIdentity = firstShop ? {
    name: firstShop.name,
    slug: firstShop.slug,
    website: firstShop.website,
    domain: firstShop.domain,
    country: firstShop.country,
    countryCode: firstShop.country_code,
    legalIdentityFieldsPresent: Object.keys(firstShop).filter((key) => /^(?:cnpj|legal_name|business_name|tax_id|address|address1|address2|postal_code|zip_code)$/i.test(key)),
    checkoutMinimumQuantity: firstShop.min_cart_quantity,
    defaultShippingCreated: firstShop.default_shipping_created,
  } : null;
  const products = Array.isArray(source) ? source.map((product) => ({
    id: product.id, title: product.title || product.name, handle: product.handle,
    price: product.price, compare_at_price: product.compare_at_price, description: product.description,
    weight: product.weight, weight_unit: product.weight_unit, checkout_links: product.checkout_links, active: product.active, is_available_checkout: product.is_available_checkout,
    product_default_variant: product.product_default_variant, product_variants: product.product_variants, product_all_variants: product.product_all_variants,
    shopFields: product.shop && Object.keys(product.shop),
    quantityRules: { minimum: product.minimum_quantity, maximum: product.max_quantity, minimumCount: product.minimum_quantity_count, maximumCount: product.max_quantity_count },
    variants: Array.isArray(product.variants) ? product.variants.map((variant) => ({ id: variant.id, title: variant.title, price: variant.price, sku: variant.sku, weight: variant.weight, weight_unit: variant.weight_unit })) : [],
  })) : [];
  if (response.ok && products.length) {
    const fs = require('node:fs');
    const path = require('node:path');
    const snapshotDirectory = path.resolve(__dirname, '..', '.local');
    fs.mkdirSync(snapshotDirectory, { recursive: true });
    const filename = path.join(snapshotDirectory, 'cartpanda-products-before.json');
    if (!fs.existsSync(filename)) fs.writeFileSync(filename, JSON.stringify({ capturedAt: new Date().toISOString(), products }, null, 2));
    fs.writeFileSync(path.join(snapshotDirectory, 'cartpanda-store-readiness.json'), JSON.stringify({ capturedAt: new Date().toISOString(), source: `${ORIGIN}${pathname}`, status: response.status, shopIdentity, products: products.map((product) => ({ id: product.id, title: product.title, priceCents: product.price, checkoutLinks: product.checkout_links, quantityRules: product.quantityRules })) }, null, 2));
  }
  const message = typeof data?.message === 'string' ? data.message.replaceAll(TOKEN, '[redacted]') : null;
  console.log(JSON.stringify({ origin: ORIGIN, pathname, status: response.status, contentType, message, dataKeys: data && typeof data === 'object' ? Object.keys(data) : [], shopIdentity, products: products.map((product) => ({ id: product.id, title: product.title, priceCents: product.price, quantityRules: product.quantityRules, variantId: product.product_default_variant?.id, variantPrice: product.product_default_variant?.price, requiresShipping: product.product_default_variant?.requires_shipping })) }, null, 2));
}
main().catch((error) => { console.error(String(error.message).replaceAll(TOKEN, '[redacted]')); process.exitCode = 1; });
