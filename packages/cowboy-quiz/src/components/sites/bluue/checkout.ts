import type { KitQuantity } from "@/components/sites/bluue/data";

/**
 * The sales site's redirect endpoint. It picks the Appmax checkout link for the
 * kit and forwards the allowed tracking parameters. Override at build time with
 * NEXT_PUBLIC_CHECKOUT_URL (for example "/api/checkout" when the quiz is served
 * from the same domain as the site).
 */
export const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_URL ??
  "https://www.cowboyenergiamasculina.com.br/api/checkout";

// Same allowlist as config/commerce.js (UTM_ALLOWLIST) on the site.
export const ATTRIBUTION_STORAGE_KEY = "cowboy_attribution";
export const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "src",
  "sck",
  "cid",
  "gclid",
  "gbraid",
  "wbraid",
  "dclid",
  "fbclid",
  "keyword",
  "device",
  "network",
] as const;

export type Attribution = Partial<Record<(typeof ATTRIBUTION_PARAMS)[number], string>>;

export function safeAttribution(search: string, stored: unknown = {}): Attribution {
  const current = new URLSearchParams(search);
  const previous = stored && typeof stored === "object" && !Array.isArray(stored)
    ? stored as Record<string, unknown>
    : {};
  const accepted: Attribution = {};
  for (const name of ATTRIBUTION_PARAMS) {
    const value = current.has(name) ? current.get(name) : previous[name];
    if (typeof value === "string" && value.length > 0 && value.length <= 256
      && !/[\u0000-\u001f\u007f]/.test(value)) accepted[name] = value;
  }
  return accepted;
}

/** Strip arbitrary query/hash content before loading external analytics. */
export function sanitizedPageUrl(href: string): string {
  const url = new URL(href);
  const linker = url.searchParams.get("_gl");
  url.search = new URLSearchParams(safeAttribution(url.search)).toString();
  // Only the current inbound linker can be read by Google. Never persist it.
  if (linker && linker.length <= 2048 && !/[\u0000-\u0020\u007f]/.test(linker)) {
    url.searchParams.set("_gl", linker);
  }
  url.hash = "";
  return url.toString();
}

export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  let stored: unknown = {};
  try { stored = JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) ?? "{}"); }
  catch { /* Restricted storage never blocks checkout. */ }
  return safeAttribution(window.location.search, stored);
}

export function checkoutHref(quantity: KitQuantity, search = "", stored: unknown = {}): string {
  const params = new URLSearchParams({ quantity: String(quantity), ...safeAttribution(search, stored) });
  let target = CHECKOUT_URL;
  if (typeof window !== "undefined") {
    const hosts = ["cowboyenergiamasculina.com.br", "www.cowboyenergiamasculina.com.br"] as const;
    const index = hosts.indexOf(window.location.hostname as (typeof hosts)[number]);
    if (index !== -1) {
      const endpoint = new URL(target, window.location.href);
      if (endpoint.hostname === window.location.hostname && endpoint.pathname === "/api/checkout") {
        endpoint.protocol = "https:";
        endpoint.hostname = hosts[1 - index];
        target = endpoint.origin + endpoint.pathname;
      }
    }
  }
  // Google decorates the native anchor at click time; never cache/reuse _gl here.
  return `${target}?${params.toString()}`;
}
