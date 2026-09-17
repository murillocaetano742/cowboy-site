'use strict';

const { APPMAX_FIXED_SHIPPING_CENTS, DISPLAY_VARIANT_QUANTITIES, checkoutProvider, checkoutUrlFor, missingShippingConfiguration } = require('#commerce');

const provider = checkoutProvider();
const missingShipping = provider === 'appmax' ? [] : provider === 'cartpanda' ? missingShippingConfiguration() : ['CHECKOUT_PROVIDER(valid:appmax|cartpanda)'];

const report = {
  provider,
  checkout: DISPLAY_VARIANT_QUANTITIES.map((quantity) => ({ quantity, configured: Boolean(checkoutUrlFor(quantity)) })),
  shipping: {
    mode: provider === 'appmax' ? 'checkout_fixed' : provider === 'cartpanda' ? 'melhor_envio_quote' : null,
    configured: missingShipping.length === 0,
    missing: missingShipping,
    ...(provider === 'appmax' ? { currency: 'BRL', pricesCents: APPMAX_FIXED_SHIPPING_CENTS } : {}),
  },
};

console.log(JSON.stringify(report, null, 2));
process.exitCode = report.checkout.some((entry) => !entry.configured) || !report.shipping.configured ? 1 : 0;
