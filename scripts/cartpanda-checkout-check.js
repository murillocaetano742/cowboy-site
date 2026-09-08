'use strict';

const fs = require('node:fs');
const path = require('node:path');
const KITS = [
  { quantity: 1, variant: 211742450, price: 54.76 },
  { quantity: 2, variant: 211742746, price: 84.76 },
  { quantity: 4, variant: 211742749, price: 169.52 },
];
async function main() {
  const results = [];
  for (const kit of KITS) {
    const url = `https://cowboy-energia.mycartpanda.com/checkout/${kit.variant}:1`;
    const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
    const html = await response.text();
    const visible = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    const result = {
      quantity: kit.quantity, url, status: response.status, finalUrl: response.url,
      expectedProductPrice: kit.price,
      title: /<title[^>]*>(.*?)<\/title>/is.exec(html)?.[1],
      text: visible.slice(0, 18000),
      providerMentions: [...new Set((html.match(/.{0,80}(?:utmify|melhor.?envio|shipping_rate|shippingRate|total_price|priceFormatted|test_mode).{0,180}/gi) || []))].slice(0, 30),
    };
    results.push(result);
    console.log(JSON.stringify(result, null, 2));
  }
  fs.writeFileSync(path.resolve(__dirname, '..', '.local', 'cartpanda-checkout-public.json'), JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
