import {
  ATTRIBUTION_STORAGE_KEY,
  readAttribution,
  sanitizedPageUrl,
} from "@/components/sites/bluue/checkout";
import type { KitQuantity } from "@/components/sites/bluue/data";
import { QUIZ_IDS, quizIdForVariant, quizVariantForPath, type QuizVariant } from "@/lib/quiz-variant";
import { startStepEngagement, type EngagementReason, type StepEngagement } from "@/lib/quiz-engagement";

export const MEASUREMENT_ID = "G-VYR2542XCN";
export const META_PIXEL_ID = "1006075098894986";
export const QUIZ_ID = QUIZ_IDS["v1-direto"];
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
  visits: Map<number, number>;
  lastStep?: number;
  counts: Map<string, number>;
  journeyScreen?: JourneyScreen;
  engagement?: StepEngagement;
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

function currentVariant(): QuizVariant {
  return quizVariantForPath(currentWindow()?.location.pathname ?? "");
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

function sendGoogle(event: string, params: Record<string, unknown>, variant = currentVariant()) {
  if (!trackingAllowed()) return;
  try { currentWindow()?.gtag?.("event", event, { send_to: MEASUREMENT_ID, quiz_id: quizIdForVariant(variant), ...params }); }
  catch { /* Analytics failure must never interrupt the quiz or purchase link. */ }
}

function sendMeta(event: string, params: Record<string, unknown> = {}) {
  if (!trackingAllowed()) return;
  try { currentWindow()?.fbq?.("trackSingle", META_PIXEL_ID, event, params); }
  catch { /* A blocked provider is optional. */ }
}

function once(key: string, emit: () => void, variant = currentVariant()) {
  if (!trackingAllowed()) return false;
  const state = currentWindow()?.__cowboyQuizTracking;
  const namespacedKey = `${quizIdForVariant(variant)}:${key}`;
  if (!state?.initialized || state.seen.has(namespacedKey)) return false;
  state.seen.add(namespacedKey);
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

  browser.__cowboyQuizTracking = { initialized: true, seen: new Set(), visits: new Map(), counts: new Map() };
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
  const editorial = ["v3-editorial", "v4-jornada", "v5-etapas"].includes(currentVariant());
  const pageKind = /^\/quiz\/(?:v3-editorial|v4-jornada|v5-etapas)\/?$/.test(browser.location.pathname) ? "cover" : "quiz";
  once("page", () => {
    sendGoogle("page_view", { ...page, ...(editorial ? { page_kind: pageKind } : {}) });
    if (editorial) sendGoogle("landing_view", { page_kind: pageKind });
    sendMeta("PageView");
  });

  if (currentVariant() === "v5-etapas") {
    browser.__cowboyQuizTracking.engagement = startStepEngagement(trackingAllowed, trackStepEngagement);
    if (pageKind === "cover") browser.__cowboyQuizTracking.engagement.setStep(0);
  }

  loadScript("cowboy-quiz-ga4", `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`);
  loadScript("cowboy-quiz-meta", "https://connect.facebook.net/en_US/fbevents.js");
  // Attribution-only SDK. UTMify's pixel/form-reader SDK is intentionally absent.
  loadScript("cowboy-quiz-utms", "https://cdn.utmify.com.br/scripts/utms/latest.js", {
    "data-utmify-prevent-xcod-sck": "",
    "data-utmify-prevent-subids": "",
    // The independent scientific source must not receive campaign identifiers.
    "data-utmify-ignore-classes": "quiz-research-source",
  });
}

export function trackQuizStart(variant = currentVariant()) {
  once("start", () => sendGoogle("quiz_start", {}, variant), variant);
}

export function trackQuizStep(stepIndex: number, variant = currentVariant()) {
  const maxStep = variant === "v5-etapas" ? 21 : ["v3-editorial", "v4-jornada"].includes(variant) ? 18 : 17;
  if (!Number.isInteger(stepIndex) || stepIndex < 1 || stepIndex > maxStep) return;
  if (variant === "v5-etapas") currentWindow()?.__cowboyQuizTracking?.engagement?.setStep(stepIndex);
  if (["v3-editorial", "v4-jornada", "v5-etapas"].includes(variant)) {
    const state = editorialState(variant);
    if (!state || state.lastStep === stepIndex) return;
    state.lastStep = stepIndex;
    const visits = (state.visits.get(stepIndex) ?? 0) + 1;
    state.visits.set(stepIndex, visits);
    if (visits > 1) sendGoogle("quiz_step_revisit", { step_index: stepIndex, visit_count: visits }, variant);
  }
  once(`step:${stepIndex}`, () => sendGoogle("quiz_step_view", { step_index: stepIndex }, variant), variant);
}

export function trackQuizComplete(variant = currentVariant()) {
  once("complete", () => sendGoogle("quiz_complete", {}, variant), variant);
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

export function trackOfferView(quantity: KitQuantity, variant = currentVariant()) {
  if (![1, 2, 3].includes(quantity)) return;
  once("offer", () => {
    sendGoogle("view_item", commerce(quantity), variant);
    sendMeta("ViewContent", { content_name: "COWBOY Energia", content_type: "product", currency: "BRL", value: KIT_PRICES[quantity] });
  }, variant);
}

export function trackKitSelection(quantity: KitQuantity, variant = currentVariant()) {
  if (![1, 2, 3].includes(quantity)) return;
  once(`select:${quantity}`, () => sendGoogle("select_item", { item_list_id: "cowboy_kits", ...commerce(quantity) }, variant), variant);
}

export function trackBeginCheckout(quantity: KitQuantity, onReady?: () => void, variant = currentVariant()) {
  if (![1, 2, 3].includes(quantity)) { onReady?.(); return; }
  const browser = currentWindow();
  if (variant === "v5-etapas") browser?.__cowboyQuizTracking?.engagement?.flush("transition");
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
    }, variant);
    sendMeta("InitiateCheckout", { content_name: "COWBOY Energia", currency: "BRL", value: KIT_PRICES[quantity], num_items: 1 });
  }, variant);
  if (!emitted) finish();
}

/** Fixed numeric milestones only: no media title, question text or answers. */
export function trackVslMilestone(percent: 0 | 25 | 50 | 75 | 100, variant = currentVariant()) {
  if (!["v2-vsl", "v3-editorial", "v4-jornada", "v5-etapas"].includes(variant) || ![0, 25, 50, 75, 100].includes(percent)) return;
  const event = percent === 0 ? "vsl_start" : percent === 100 ? "vsl_complete" : "vsl_progress";
  once(`vsl:${percent}`, () => sendGoogle(event, {
    video_id: "cowboy_vsl",
    ...(percent === 0 ? {} : { percent }),
  }, variant), variant);
}

function editorialState(variant: QuizVariant) {
  if (!["v3-editorial", "v4-jornada", "v5-etapas"].includes(variant) || !trackingAllowed()) return undefined;
  const state = currentWindow()?.__cowboyQuizTracking;
  return state?.initialized ? state : undefined;
}

function increment(state: TrackingState, key: string) {
  const count = (state.counts.get(key) ?? 0) + 1;
  state.counts.set(key, count);
  return count;
}

const ANSWER_STEPS = [1, 2, 3, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16] as const;
export function trackQuizAnswer(stepIndex: number, variant = currentVariant()) {
  if (!editorialState(variant) || !(ANSWER_STEPS as readonly number[]).includes(stepIndex)) return;
  once(`answer:${stepIndex}`, () => sendGoogle("quiz_answer", { step_index: stepIndex }, variant), variant);
}

export function trackQuizBack(from: number, to: number, variant = currentVariant()) {
  const state = editorialState(variant);
  if (!state || !Number.isInteger(from) || !Number.isInteger(to) || from > 18 || to < 1 || to >= from) return;
  sendGoogle("quiz_back", { from_step_index: from, to_step_index: to, back_count: increment(state, "back") }, variant);
}

export function trackResultView(variant = currentVariant()) {
  if (editorialState(variant)) once("result", () => sendGoogle("quiz_result_view", {}, variant), variant);
}

export function trackViewKits(variant = currentVariant()) {
  if (editorialState(variant)) once("view-kits", () => sendGoogle("quiz_view_kits", {}, variant), variant);
}

export type CoverCtaLocation = "hero" | "footer";
export type CoverSection = "intro" | "how_it_works" | "footer";
export type ContentLink = "privacy" | "terms" | "research_paper" | "medicine_alert" | "medicine_leaflet";
export type ContentLinkLocation = "cover" | "offer" | "quiz";

/** Native cover links receive the same bounded delivery opportunity as checkout. */
export function trackCoverCta(location: CoverCtaLocation, onReady?: () => void) {
  const variant = currentVariant();
  const browser = currentWindow();
  if (!editorialState(variant) || !["hero", "footer"].includes(location)) { onReady?.(); return; }
  if (variant === "v5-etapas") browser?.__cowboyQuizTracking?.engagement?.flush("transition");
  let finished = false;
  let fallback: number | undefined;
  const finish = () => {
    if (finished) return;
    finished = true;
    if (fallback !== undefined) browser?.clearTimeout(fallback);
    onReady?.();
  };
  if (onReady && browser) fallback = browser.setTimeout(finish, CHECKOUT_FALLBACK_MS);
  const emitted = once(`cover-cta:${location}`, () => sendGoogle("quiz_cover_cta", {
    cta_location: location,
    ...(onReady ? { event_callback: finish, event_timeout: CHECKOUT_EVENT_TIMEOUT_MS } : {}),
  }, variant), variant);
  if (!emitted) finish();
}

export function trackCoverSection(section: CoverSection) {
  if (!editorialState(currentVariant()) || !["intro", "how_it_works", "footer"].includes(section)) return;
  once(`cover-section:${section}`, () => sendGoogle("quiz_cover_section_view", { section_id: section }));
}

export function trackContentLink(link: ContentLink, location: ContentLinkLocation) {
  if (!editorialState(currentVariant())) return;
  const allowed = ["research_paper", "medicine_alert", "medicine_leaflet"].includes(link) ? location === "quiz"
    : ["privacy", "terms"].includes(link) && ["cover", "offer"].includes(location);
  if (!allowed) return;
  once(`content-link:${location}:${link}`, () => sendGoogle("quiz_content_link", { link_id: link, link_location: location }));
}

export type VslInteraction = "visible" | "unmute" | "mute" | "pause" | "error" | "autoplay_blocked";
export function trackVslInteraction(action: VslInteraction, variant = currentVariant()) {
  const state = editorialState(variant);
  if (!state || !["visible", "unmute", "mute", "pause", "error", "autoplay_blocked"].includes(action)) return;
  const emit = () => sendGoogle(`vsl_${action}`, {
    video_id: "cowboy_vsl",
    ...(["unmute", "mute", "pause"].includes(action) ? { interaction_count: increment(state, `vsl:${action}`) } : {}),
  }, variant);
  if (["visible", "error", "autoplay_blocked"].includes(action)) once(`vsl:${action}`, emit, variant);
  else emit();
}

export type JourneyScreen = "result" | "presentation" | "testimonials" | "offer";
export type JourneyAction = "result_continue" | "presentation_continue" | "testimonials_continue" | "offer_view_kits" | "back";
const JOURNEY_SCREENS = ["result", "presentation", "testimonials", "offer"] as const;

/** These are virtual screens, not URLs or medical result categories. */
export function trackJourneyView(screen: JourneyScreen) {
  const variant = currentVariant();
  if (!["v4-jornada", "v5-etapas"].includes(variant) || !(JOURNEY_SCREENS as readonly string[]).includes(screen) || (screen === "testimonials" && variant !== "v5-etapas")) return;
  const state = editorialState(variant);
  const browser = currentWindow();
  if (!state || !browser || state.journeyScreen === screen) return;
  state.journeyScreen = screen;
  sendGoogle("page_view", {
    page_kind: screen,
    page_location: sanitizedPageUrl(browser.location.href),
    page_title: "COWBOY Energia | Jornada",
    page_referrer: browser.location.origin,
  }, variant);
  once(`journey:${screen}`, () => sendGoogle("quiz_journey_view", { page_kind: screen }, variant), variant);
}

export function trackJourneyAction(action: JourneyAction, screen: JourneyScreen) {
  const variant = currentVariant();
  if (!["v4-jornada", "v5-etapas"].includes(variant) || !editorialState(variant)) return;
  const allowed = action === "result_continue" && screen === "result"
    || action === "presentation_continue" && screen === "presentation"
    || action === "offer_view_kits" && screen === "offer"
    || action === "testimonials_continue" && screen === "testimonials" && variant === "v5-etapas"
    || action === "back" && (screen === "presentation" || screen === "offer" || screen === "testimonials" && variant === "v5-etapas");
  if (!allowed) return;
  once(`journey-action:${action}:${screen}`, () => sendGoogle("quiz_journey_action", { cta_location: action, page_kind: screen }, variant), variant);
}

export function trackTestimonialsView() {
  if (currentVariant() !== "v5-etapas") return;
  once("testimonials-view", () => sendGoogle("quiz_testimonials_view", {}));
}

const ENGAGEMENT_REASONS = ["heartbeat", "transition", "hidden", "blur", "pagehide"] as const;
const CHECKPOINT_REASONS = ["heartbeat", "pause", "hidden", "blur", "pagehide", "transition", "completed", "error", "retry", "recovered"] as const;
const PAUSE_REASONS = ["manual", "viewport", "lifecycle", "completed", "unknown"] as const;
export type VslCheckpointReason = typeof CHECKPOINT_REASONS[number];
export type VslPauseReason = typeof PAUSE_REASONS[number];
export interface VslCheckpoint {
  position_bucket: number;
  video_percent: number;
  watched_time_ms: number;
  buffer_time_ms: number;
}

function v5MetricsAllowed() {
  return currentVariant() === "v5-etapas" && !!editorialState("v5-etapas");
}

export function trackStepEngagement(stepIndex: number, milliseconds: number, reason: EngagementReason) {
  if (!v5MetricsAllowed() || !Number.isInteger(stepIndex) || stepIndex < 0 || stepIndex > 21
    || !Number.isFinite(milliseconds) || milliseconds <= 0 || milliseconds > 60_000
    || !(ENGAGEMENT_REASONS as readonly string[]).includes(reason)) return;
  const pageKind = stepIndex === 0 ? "cover" : stepIndex === 18 ? "result" : stepIndex === 19 ? "presentation" : stepIndex === 20 ? "testimonials" : stepIndex === 21 ? "offer" : "quiz";
  sendGoogle("quiz_step_engagement", { step_index: stepIndex, page_kind: pageKind, active_time_ms: Math.floor(milliseconds), flush_reason: reason });
}

export function trackVslRetention(percent: number) {
  if (!v5MetricsAllowed() || !Number.isInteger(percent) || percent < 10 || percent > 90 || percent % 10 !== 0) return;
  once(`vsl-retention:${percent}`, () => sendGoogle("vsl_retention", { video_id: "cowboy_vsl", video_percent: percent }));
}

/** Copy only allowlisted primitive fields; never forward arbitrary media/answer objects. */
export function trackVslCheckpoint(snapshot: VslCheckpoint, reason: VslCheckpointReason, pauseReason?: VslPauseReason) {
  if (!v5MetricsAllowed() || !(CHECKPOINT_REASONS as readonly string[]).includes(reason)
    || pauseReason !== undefined && !(PAUSE_REASONS as readonly string[]).includes(pauseReason)) return;
  const { position_bucket, video_percent, watched_time_ms, buffer_time_ms } = snapshot;
  if (!Number.isInteger(position_bucket) || position_bucket < 0 || position_bucket > 3_600 || position_bucket % 10 !== 0
    || !Number.isInteger(video_percent) || video_percent < 0 || video_percent > 100 || video_percent % 10 !== 0
    || !Number.isInteger(watched_time_ms) || watched_time_ms < 0 || watched_time_ms > 60_000
    || !Number.isInteger(buffer_time_ms) || buffer_time_ms < 0 || buffer_time_ms > 60_000) return;
  sendGoogle("vsl_watch_checkpoint", { video_id: "cowboy_vsl", position_bucket, video_percent, watched_time_ms, buffer_time_ms, checkpoint_reason: reason, ...(pauseReason ? { pause_reason: pauseReason } : {}) });
}
