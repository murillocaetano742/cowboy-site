'use strict';

const { DISPLAY_VARIANT_QUANTITIES, FREE_SHIPPING_FROM_QUANTITY, OFFER, checkoutUrlFor, missingShippingConfiguration } = require('#commerce');

function respond(response, statusCode, payload) {
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  return response.status(statusCode).json(payload);
}

module.exports = (request, response) => {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return respond(response, 405, { error: 'method_not_allowed' });
  }

  const variants = DISPLAY_VARIANT_QUANTITIES.map((quantity) => OFFER.variants[quantity]).map((variant) => ({
    quantity: variant.quantity,
    unitPriceCents: variant.unitPriceCents,
    totalPriceCents: variant.totalPriceCents,
    freeShipping: Boolean(variant.freeShipping),
    checkoutAvailable: Boolean(checkoutUrlFor(variant.quantity)),
  }));

  return respond(response, 200, {
    currency: OFFER.currency,
    variants,
    freeShippingFromQuantity: FREE_SHIPPING_FROM_QUANTITY,
    shippingAvailable: missingShippingConfiguration().length === 0,
  });
};
