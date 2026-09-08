'use strict';

const { OFFER, getShippingBaseUrl, missingShippingConfiguration, parseBrazilianPostalCode, parseQuantity } = require('#commerce');
const { LOGISTICS } = require('#logistics');

const UPSTREAM_TIMEOUT_MS = 6500;
const MAX_REQUEST_BODY_BYTES = 1024;

function json(response, statusCode, payload) {
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  return response.status(statusCode).json(payload);
}

function buildPayload(destinationPostalCode, quantity) {
  const variant = OFFER.variants[quantity];
  return {
    from: { postal_code: LOGISTICS.originPostalCode },
    to: { postal_code: destinationPostalCode },
    products: [{
      // O kit é um único produto expedido já embalado, independentemente da
      // quantidade de frascos. Não multiplicar peso/dimensões por quantity.
      id: `cowboy-energia-kit-${quantity}`,
      width: LOGISTICS.parcel.widthCm,
      height: LOGISTICS.parcel.heightCm,
      length: LOGISTICS.parcel.lengthCm,
      weight: LOGISTICS.parcel.weightKg,
      insurance_value: (variant.totalPriceCents / 100).toFixed(2),
      quantity: 1,
    }],
    options: { receipt: false, own_hand: false, collect: false },
  };
}

function normalizeQuotes(payload) {
  if (!Array.isArray(payload)) return [];
  return payload
    .filter((item) => {
      const price = item && (item.custom_price ?? item.price);
      return item && !item.error && isValidShippingPrice(price);
    })
    .map((item) => {
      const price = item.custom_price ?? item.price;
      const deliveryTime = item.custom_delivery_time ?? item.delivery_time;
      return {
        id: item.id,
        company: item.company && item.company.name ? item.company.name : null,
        service: item.name || null,
        price: Number(price),
        deliveryDays: isValidDeliveryTime(deliveryTime) ? Number(deliveryTime) : null,
      };
    })
    .sort((a, b) => a.price - b.price);
}

function isValidShippingPrice(value) {
  if ((typeof value !== 'string' && typeof value !== 'number') || String(value).trim() === '') return false;
  const price = Number(value);
  return Number.isFinite(price) && price >= 0;
}

function isValidDeliveryTime(value) {
  if ((typeof value !== 'string' && typeof value !== 'number') || String(value).trim() === '') return false;
  const days = Number(value);
  return Number.isFinite(days) && days >= 0;
}

function requestBodyIsAcceptable(request) {
  const contentLength = request.headers && request.headers['content-length'];
  if (contentLength !== undefined) {
    if (!/^\d+$/.test(String(contentLength)) || Number(contentLength) > MAX_REQUEST_BODY_BYTES) return false;
  }
  const body = request.body;
  if (!body || typeof body !== 'object' || Array.isArray(body) || Object.getPrototypeOf(body) !== Object.prototype) return false;
  const keys = Object.keys(body);
  if (keys.length > 4 || !keys.every((key) => ['postalCode', 'cep', 'quantity'].includes(key))) return false;
  try {
    return Buffer.byteLength(JSON.stringify(body), 'utf8') <= MAX_REQUEST_BODY_BYTES;
  } catch {
    return false;
  }
}

async function quoteShipping({ postalCode, quantity, env = process.env, fetchImpl = fetch }) {
  const missing = missingShippingConfiguration(env);
  if (missing.length) return { status: 503, body: { error: 'shipping_unavailable', missing } };
  const payload = buildPayload(postalCode, quantity);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const upstream = await fetchImpl(`${getShippingBaseUrl(env)}/api/v2/me/shipment/calculate`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.MELHOR_ENVIO_TOKEN}`,
        'User-Agent': env.MELHOR_ENVIO_USER_AGENT,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const raw = await upstream.json().catch(() => null);
    if (!upstream.ok) return { status: 502, body: { error: 'shipping_provider_error', status: upstream.status } };

    const quotes = normalizeQuotes(raw);
    return {
      status: 200,
      body: {
        postalCode,
        quantity,
        currency: 'BRL',
        quotes,
        available: quotes.length > 0,
      },
    };
  } catch (error) {
    return {
      status: 502,
      body: { error: error && error.name === 'AbortError' ? 'shipping_provider_timeout' : 'shipping_provider_unreachable' },
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return json(response, 405, { error: 'method_not_allowed' });
  }
  if (!requestBodyIsAcceptable(request)) return json(response, 413, { error: 'request_too_large_or_invalid' });
  const postalCode = parseBrazilianPostalCode(request.body && (request.body.postalCode || request.body.cep));
  const quantity = parseQuantity(request.body && request.body.quantity);
  if (!postalCode) return json(response, 400, { error: 'invalid_postal_code' });
  if (!quantity) return json(response, 400, { error: 'invalid_quantity' });

  const result = await quoteShipping({ postalCode, quantity });
  return json(response, result.status, result.body);
}

module.exports = handler;
module.exports.buildPayload = buildPayload;
module.exports.normalizeQuotes = normalizeQuotes;
module.exports.quoteShipping = quoteShipping;
module.exports.requestBodyIsAcceptable = requestBodyIsAcceptable;
module.exports.config = {
  api: {
    bodyParser: { sizeLimit: '1kb' },
  },
};
