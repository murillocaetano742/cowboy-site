'use strict';

const { LOGISTICS } = require('#logistics');

/**
 * Commercial facts deliberately kept separate from page copy. Values are in
 * centavos so that price calculations never depend on floating point values.
 * Confirmed Cartpanda checkout links are public routing data. Environment
 * variables may override them without exposing the Cartpanda API token.
 */
const OFFER = Object.freeze({
  currency: 'BRL',
  variants: Object.freeze({
    1: Object.freeze({ quantity: 1, unitPriceCents: 5476, totalPriceCents: 5476, checkoutEnv: 'CARTPANDA_CHECKOUT_1_URL' }),
    2: Object.freeze({ quantity: 2, unitPriceCents: 4238, totalPriceCents: 8476, checkoutEnv: 'CARTPANDA_CHECKOUT_2_URL' }),
    3: Object.freeze({ quantity: 3, unitPriceCents: 4238, totalPriceCents: 12714, checkoutEnv: 'CARTPANDA_CHECKOUT_3_URL' }),
    4: Object.freeze({ quantity: 4, unitPriceCents: 4238, totalPriceCents: 16952, checkoutEnv: 'CARTPANDA_CHECKOUT_4_URL' }),
  }),
});

// Keep the initial page focused while allowing the rule “2+ at R$42,38 each”
// to be honored if a future Cartpanda kit for 3 is explicitly configured.
const DISPLAY_VARIANT_QUANTITIES = Object.freeze([1, 2, 4]);

const CARTPANDA_PUBLIC_CHECKOUT_URLS = Object.freeze({
  1: 'https://cowboy-energia.mycartpanda.com/checkout/211742450:1',
  2: 'https://cowboy-energia.mycartpanda.com/checkout/211742746:1',
  4: 'https://cowboy-energia.mycartpanda.com/checkout/211742749:1',
});

const UTM_ALLOWLIST = Object.freeze([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'src',
  'sck',
  'cid',
  'gclid',
  'fbclid',
]);

const MAX_QUERY_VALUE_LENGTH = 256;
const MAX_CART_QUANTITY = 4;

function parseBrazilianPostalCode(value) {
  if (typeof value !== 'string') return null;
  if (/^\d{8}$/.test(value)) return value;
  if (/^\d{5}-\d{3}$/.test(value)) return value.replace('-', '');
  return null;
}

function parseQuantity(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const quantity = Number(value);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_CART_QUANTITY) return null;
  return OFFER.variants[quantity] ? quantity : null;
}

function isPositiveNumber(value) {
  if ((typeof value !== 'string' && typeof value !== 'number') || String(value).trim() === '') return false;
  const number = Number(value);
  return Number.isFinite(number) && number > 0;
}

function checkoutUrlFor(quantity, env = process.env) {
  const variant = OFFER.variants[quantity];
  if (!variant) return null;
  const configuredCandidate = String(env[variant.checkoutEnv] || '').trim();
  const candidate = configuredCandidate || CARTPANDA_PUBLIC_CHECKOUT_URLS[quantity];
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    return url.protocol === 'https:' && isAllowedCartpandaHost(url.hostname, env) ? url : null;
  } catch {
    return null;
  }
}

function isAllowedCartpandaHost(hostname, env = process.env) {
  const normalizedHost = String(hostname || '').toLowerCase();
  // Cartpanda's standard checkout addresses end exactly in .mycartpanda.com.
  if (normalizedHost.endsWith('.mycartpanda.com')) return true;
  // A custom checkout domain needs an explicit exact hostname allowlist.
  const customHosts = String(env.CARTPANDA_CHECKOUT_ALLOWED_HOSTS || '')
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
  return customHosts.includes(normalizedHost);
}

function safeAttribution(searchParams) {
  const attribution = new URLSearchParams();
  for (const name of UTM_ALLOWLIST) {
    const value = searchParams.get(name);
    if (value && value.length <= MAX_QUERY_VALUE_LENGTH) attribution.set(name, value);
  }
  return attribution;
}

function missingShippingConfiguration(env = process.env) {
  const missing = ['MELHOR_ENVIO_TOKEN', 'MELHOR_ENVIO_USER_AGENT']
    .filter((name) => !String(env[name] || '').trim());
  if (!['sandbox', 'production'].includes(env.MELHOR_ENVIO_ENV)) {
    missing.push('MELHOR_ENVIO_ENV(valid:sandbox|production)');
  }
  if (!parseBrazilianPostalCode(LOGISTICS.originPostalCode)) missing.push('LOGISTICS.originPostalCode(valid_cep)');
  if (!isPositiveNumber(LOGISTICS.parcel.weightKg)) missing.push('LOGISTICS.parcel.weightKg(valid)');
  if (!isPositiveNumber(LOGISTICS.parcel.widthCm)) missing.push('LOGISTICS.parcel.widthCm(valid)');
  if (!isPositiveNumber(LOGISTICS.parcel.heightCm)) missing.push('LOGISTICS.parcel.heightCm(valid)');
  if (!isPositiveNumber(LOGISTICS.parcel.lengthCm)) missing.push('LOGISTICS.parcel.lengthCm(valid)');
  if (!isPositiveNumber(LOGISTICS.product.unitWeightKg)) missing.push('LOGISTICS.product.unitWeightKg(valid)');
  return missing;
}

function getShippingBaseUrl(env = process.env) {
  if (env.MELHOR_ENVIO_ENV === 'sandbox') return 'https://sandbox.melhorenvio.com.br';
  if (env.MELHOR_ENVIO_ENV === 'production') return 'https://www.melhorenvio.com.br';
  return null;
}

module.exports = {
  OFFER,
  CARTPANDA_PUBLIC_CHECKOUT_URLS,
  DISPLAY_VARIANT_QUANTITIES,
  UTM_ALLOWLIST,
  checkoutUrlFor,
  getShippingBaseUrl,
  isAllowedCartpandaHost,
  isPositiveNumber,
  missingShippingConfiguration,
  parseBrazilianPostalCode,
  parseQuantity,
  safeAttribution,
};
