import type { KitQuantity } from "./data";

/**
 * The sales site's redirect endpoint. It picks the Appmax checkout link for the
 * kit and forwards the allowed tracking parameters. Override at build time with
 * NEXT_PUBLIC_CHECKOUT_URL (for example "/api/checkout" when the quiz is served
 * from the same domain as the site).
 */
export const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_URL ??
  "https://cowboyenergiamasculina.com.br/api/checkout";

// Same allowlist as config/commerce.js (UTM_ALLOWLIST) on the site.
const FORWARDED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "src",
  "sck",
  "cid",
  "gclid",
  "fbclid",
  "keyword",
  "device",
  "network",
] as const;

const MAX_VALUE_LENGTH = 256;

export function checkoutHref(quantity: KitQuantity, search = ""): string {
  const current = new URLSearchParams(search);
  const params = new URLSearchParams({ quantity: String(quantity) });
  for (const name of FORWARDED_PARAMS) {
    const value = current.get(name);
    if (value && value.length <= MAX_VALUE_LENGTH) params.set(name, value);
  }
  return `${CHECKOUT_URL}?${params.toString()}`;
}
