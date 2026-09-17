'use strict';

const { LOGISTICS } = require('#logistics');

/**
 * Commercial facts deliberately kept separate from page copy. Values are in
 * centavos so that price calculations never depend on floating point values.
 * Confirmed checkout links are public routing data. Provider credentials
 * remain server-side and are never needed to redirect a customer.
 */
const OFFER = Object.freeze({
  currency: 'BRL',
  variants: Object.freeze({
    // Oferta de 14/09/2026 (decisão do proprietário): 1 frasco R$ 79,90 com frete por conta do cliente;
    // 2 frascos R$ 154,80 e 3 frascos R$ 199,90 com frete grátis. Kit de 4 descontinuado.
    1: Object.freeze({ quantity: 1, unitPriceCents: 7990, totalPriceCents: 7990, freeShipping: false, checkoutEnv: 'CARTPANDA_CHECKOUT_1_URL' }),
    2: Object.freeze({ quantity: 2, unitPriceCents: 7740, totalPriceCents: 15480, freeShipping: true, checkoutEnv: 'CARTPANDA_CHECKOUT_2_URL' }),
    3: Object.freeze({ quantity: 3, unitPriceCents: 6663, totalPriceCents: 19990, freeShipping: true, checkoutEnv: 'CARTPANDA_CHECKOUT_3_URL' }),
  }),
});

const DISPLAY_VARIANT_QUANTITIES = Object.freeze([1, 2, 3]);
const FREE_SHIPPING_FROM_QUANTITY = 2;
const DEFAULT_CHECKOUT_PROVIDER = 'appmax';
// Fixed delivery prices authorized by the owner for the AppCheckout migration.
const APPMAX_FIXED_SHIPPING_CENTS = Object.freeze({ 1: 2675, 2: 0, 3: 0 });

// Public AppCheckout links verified in the merchant's account on 17/09/2026.
const APPMAX_PUBLIC_CHECKOUT_URLS = Object.freeze({
  1: 'https://cowboyenergia.carrinho.app/one-checkout/ocmdf/38251476',
  2: 'https://cowboyenergia.carrinho.app/one-checkout/ocmdf/38251410',
  3: 'https://cowboyenergia.carrinho.app/one-checkout/ocmdf/38251519',
});

const CARTPANDA_PUBLIC_CHECKOUT_URLS = Object.freeze({
  1: 'https://cowboy-energia.mycartpanda.com/checkout/211742450:1',
  2: 'https://cowboy-energia.mycartpanda.com/checkout/211742746:1',
  3: 'https://cowboy-energia.mycartpanda.com/checkout/212751381:1',
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
  'keyword',
  'device',
  'network',
]);

const MAX_QUERY_VALUE_LENGTH = 256;
const MAX_LINKER_VALUE_LENGTH = 2048;
const MAX_CART_QUANTITY = 3;

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
  const provider = checkoutProvider(env);
  if (!provider) return null;
  const envName = provider === 'appmax' ? `APPMAX_CHECKOUT_${quantity}_URL` : variant.checkoutEnv;
  const defaults = provider === 'appmax' ? APPMAX_PUBLIC_CHECKOUT_URLS : CARTPANDA_PUBLIC_CHECKOUT_URLS;
  const configuredCandidate = String(env[envName] || '').trim();
  const candidate = configuredCandidate || defaults[quantity];
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    const allowed = provider === 'appmax'
      ? isAllowedAppmaxHost(url.hostname, env)
      : isAllowedCartpandaHost(url.hostname, env);
    return allowed ? url : null;
  } catch {
    return null;
  }
}

function checkoutProvider(env = process.env) {
  const provider = env.CHECKOUT_PROVIDER === undefined ? DEFAULT_CHECKOUT_PROVIDER : env.CHECKOUT_PROVIDER;
  return provider === 'appmax' || provider === 'cartpanda' ? provider : null;
}

function isAllowedAppmaxHost(hostname, env = process.env) {
  const normalizedHost = String(hostname || '').toLowerCase();
  const allowedHosts = String(env.APPMAX_CHECKOUT_ALLOWED_HOSTS || '')
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
  // Trust only exact hosts from explicitly configured or verified public URLs.
  // Never infer trust from an Appmax-looking suffix or an environment URL.
  const confirmedHost = Object.values(APPMAX_PUBLIC_CHECKOUT_URLS).some((candidate) => {
    const url = new URL(candidate);
    return url.protocol === 'https:' && !url.username && !url.password && url.hostname === normalizedHost;
  });
  return confirmedHost || allowedHosts.includes(normalizedHost);
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
  // Forward Google's opaque, short-lived cross-domain linker unchanged. It
  // contains multiple encoded identifiers and can exceed a normal UTM value.
  const linker = searchParams.get('_gl');
  if (linker && linker.length <= MAX_LINKER_VALUE_LENGTH && !/[\u0000-\u0020\u007f]/.test(linker)) {
    attribution.set('_gl', linker);
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
  DEFAULT_CHECKOUT_PROVIDER,
  APPMAX_FIXED_SHIPPING_CENTS,
  APPMAX_PUBLIC_CHECKOUT_URLS,
  CARTPANDA_PUBLIC_CHECKOUT_URLS,
  DISPLAY_VARIANT_QUANTITIES,
  FREE_SHIPPING_FROM_QUANTITY,
  UTM_ALLOWLIST,
  checkoutProvider,
  checkoutUrlFor,
  getShippingBaseUrl,
  isAllowedCartpandaHost,
  isAllowedAppmaxHost,
  isPositiveNumber,
  missingShippingConfiguration,
  parseBrazilianPostalCode,
  parseQuantity,
  safeAttribution,
};
