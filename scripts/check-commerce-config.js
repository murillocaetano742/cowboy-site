'use strict';

const { checkoutUrlFor, missingShippingConfiguration } = require('#commerce');

const report = {
  checkout: [1, 2, 4].map((quantity) => ({ quantity, configured: Boolean(checkoutUrlFor(quantity)) })),
  shipping: { configured: missingShippingConfiguration().length === 0, missing: missingShippingConfiguration() },
};

console.log(JSON.stringify(report, null, 2));
process.exitCode = report.checkout.some((entry) => !entry.configured) || !report.shipping.configured ? 1 : 0;
