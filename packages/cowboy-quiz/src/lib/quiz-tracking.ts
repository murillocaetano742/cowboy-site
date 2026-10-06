import {
  ATTRIBUTION_STORAGE_KEY,
  readAttribution,
  sanitizedPageUrl,
} from "@/components/sites/bluue/checkout";
import type { KitQuantity } from "@/components/sites/bluue/data";

export const MEASUREMENT_ID = "G-VYR2542XCN";
export const META_PIXEL_ID = "1006075098894986";
export const QUIZ_ID = "cowboy_v1_direto";
export const CHECKOUT_EVENT_TIMEOUT_MS = 700;
export const CHECKOUT_FALLBACK_MS = 800;

type TrackingCommand = (...args: unknown[]) => void;
interface MetaCommand extends TrackingCommand {
  callMethod?: TrackingCommand;
  queue?: unknown[][];
  push?: MetaCommand;
  loaded?: boolean;
  version?: string;
}
interface TrackingState {
  initialized: boolean;
  seen: Set<string>;
}
interface TrackingWindow extends Window {
  dataLayer?: unknown[];
  gtag?: TrackingCommand;
  fbq?: MetaCommand;
  _fbq?: MetaCommand;
  __cowboyQuizTracking?: TrackingState;
  "ga-disable-G-VYR2542XCN"?: boolean;
}

function currentWindow(): TrackingWindow | undefined {
  return typeof window === "undefined" ? undefined : window as TrackingWindow;
}

export function trackingAllowed(): boolean {
  const browser = currentWindow();
  if (!browser) return false;
  const navigator = browser.navigator as Navigator & { globalPrivacyControl?: boolean };
  return navigator.globalPrivacyControl !== true && browser["ga-disable-G-VYR2542XCN"] !== true;
}

function loadScript(id: string, src: string, attributes: Record<string, string> = {}) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  script.referrerPolicy = "origin";
  for (const [name, value] of Object.entries(attributes)) script.setAttribute(name, value);
  document.head.appendChild(script);
}

function sendGoogle(event: string, params: Record<string, unknown>) {
  if (!trackingAllowed()) return;
  try { currentWindow()?.gtag?.("event", event, { send_to: MEASUREMENT_ID, quiz_id: QUIZ_ID, ...params }); }
  catch { /* Analytics failure must never interrupt the quiz or purchase link. */ }
}

function sendMeta(event: string, params: Record<string, unknown> = {}) {
  if (!trackingAllowed()) return;
  try { currentWindow()?.fbq?.("trackSingle", META_PIXEL_ID, event, params); }
  catch { /* A blocked provider is optional. */ }
}

function once(key: string, emit: () => void) {
  if (!trackingAllowed()) return false;
  const state = currentWindow()?.__cowboyQuizTracking;
  if (!state?.initialized || state.seen.has(key)) return false;
  state.seen.add(key);
  emit();
  return true;
}

/** Synchronous before hydration. No answers or quiz-result objects enter this module. */
export function initializeQuizTracking() {
  const browser = currentWindow();
  if (!browser || browser.__cowboyQuizTracking?.initialized) return;

  const cleanUrl = sanitizedPageUrl(browser.location.href);
  if (cleanUrl !== browser.location.href) browser.history.replaceState(browser.history.state, "", cleanUrl);

  if (!trackingAllowed()) {
    try { browser.sessionStorage.removeItem(ATTRIBUTION_STORAGE_KEY); } catch { /* optional storage */ }
    return;
  }
  try { browser.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(readAttribution())); }
  catch { /* Attribution still works from the current URL without storage. */ }

  browser.__cowboyQuizTracking = { initialized: true, seen: new Set() };
  browser.dataLayer ??= [];
  browser.gtag ??= function () {
    // eslint-disable-next-line prefer-rest-params -- Keep Google's documented command queue shape.
    browser.dataLayer?.push(arguments);
  };
  let referrer = "";
  try { referrer = document.referrer ? new URL(document.referrer).origin : ""; } catch { /* no referrer */ }
  const page = {
    page_location: cleanUrl,
    page_referrer: referrer,
    page_title: "COWBOY Energia | Quiz",
  };
  browser.gtag("set", "linker", {
    domains: ["cowboyenergiamasculina.com.br", "www.cowboyenergiamasculina.com.br", "cowboyenergia.carrinho.app"],
    decorate_forms: true,
    accept_incoming: true,
  });
  browser.gtag("js", new Date());
  browser.gtag("config", MEASUREMENT_ID, {
    ...page,
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  if (!browser.fbq) {
    const fbq: MetaCommand = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue?.push(args);
    };
    fbq.queue = [];
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    browser.fbq = fbq;
    browser._fbq ??= fbq;
  }
  // Disable automatic button/form inspection BEFORE initializing the pixel.
  browser.fbq("set", "autoConfig", false, META_PIXEL_ID);
  browser.fbq("init", META_PIXEL_ID);
  once("page", () => { sendGoogle("page_view", page); sendMeta("PageView"); });

  loadScript("cowboy-quiz-ga4", `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`);
  loadScript("cowboy-quiz-meta", "https://connect.facebook.net/en_US/fbevents.js");
  // Attribution-only SDK. UTMify's pixel/form-reader SDK is intentionally absent.
  loadScript("cowboy-quiz-utms", "https://cdn.utmify.com.br/scripts/utms/latest.js", {
    "data-utmify-prevent-xcod-sck": "",
    "data-utmify-prevent-subids": "",
  });
}

export function trackQuizStart() {
  once("start", () => sendGoogle("quiz_start", {}));
}

export function trackQuizStep(stepIndex: number) {
  if (!Number.isInteger(stepIndex) || stepIndex < 1 || stepIndex > 17) return;
  once(`step:${stepIndex}`, () => sendGoogle("quiz_step_view", { step_index: stepIndex }));
}

export function trackQuizComplete() {
  once("complete", () => sendGoogle("quiz_complete", {}));
}

const KIT_PRICES = { 1: 79.9, 2: 154.8, 3: 199.9 } as const;

function commerce(quantity: KitQuantity) {
  const value = KIT_PRICES[quantity];
  return {
    currency: "BRL",
    value,
    items: [{ item_name: "COWBOY Energia", item_variant: `${quantity} frascos`, price: value, quantity: 1 }],
  };
}

export function trackOfferView(quantity: KitQuantity) {
  if (![1, 2, 3].includes(quantity)) return;
  once("offer", () => {
    sendGoogle("view_item", commerce(quantity));
    sendMeta("ViewContent", { content_name: "COWBOY Energia", content_type: "product", currency: "BRL", value: KIT_PRICES[quantity] });
  });
}

export function trackKitSelection(quantity: KitQuantity) {
  if (![1, 2, 3].includes(quantity)) return;
  once(`select:${quantity}`, () => sendGoogle("select_item", { item_list_id: "cowboy_kits", ...commerce(quantity) }));
}

export function trackBeginCheckout(quantity: KitQuantity, onReady?: () => void) {
  if (![1, 2, 3].includes(quantity)) { onReady?.(); return; }
  const browser = currentWindow();
  let finished = false;
  let fallback: number | undefined;
  const finish = () => {
    if (finished) return;
    finished = true;
    if (fallback !== undefined) browser?.clearTimeout(fallback);
    onReady?.();
  };
  // This timer is independent of gtag: blockers/errors must not trap the visitor.
  if (onReady && browser) fallback = browser.setTimeout(finish, CHECKOUT_FALLBACK_MS);
  const emitted = once(`checkout:${quantity}`, () => {
    sendGoogle("begin_checkout", {
      ...commerce(quantity),
      ...(onReady ? { event_callback: finish, event_timeout: CHECKOUT_EVENT_TIMEOUT_MS } : {}),
    });
    sendMeta("InitiateCheckout", { content_name: "COWBOY Energia", currency: "BRL", value: KIT_PRICES[quantity], num_items: 1 });
  });
  if (!emitted) finish();
}
