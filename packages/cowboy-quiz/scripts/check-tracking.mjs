import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));

// Exercise the real TypeScript modules with isolated browser/storage fixtures.
// No vendor scripts or conversion requests are executed by these tests.
function fixture({ search = "", stored = "{}", gpc = false, disabled = false, storageBlocked = false, checkoutUrl, hostname = "cowboyenergiamasculina.com.br", pathname = "/quiz/v1-direto/" } = {}) {
  const storage = new Map([["cowboy_attribution", stored]]);
  const scripts = [];
  const navigations = [];
  const timers = new Map();
  let nextTimer = 0;
  let clock = 0;
  const location = (href) => Object.assign(new URL(href), { assign: (url) => navigations.push(url) });
  function advanceTimers(milliseconds) {
    const end = clock + milliseconds;
    for (let iterations = 0; iterations < 100; iterations++) {
      const next = [...timers].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      timers.delete(next[0]);
      clock = next[1].at;
      next[1].callback();
    }
    clock = end;
  }
  const document = {
    referrer: "https://example.com/private?email=PRIVATE&answer=SENSITIVE",
    getElementById: (id) => scripts.find((script) => script.id === id),
    createElement: () => ({ attributes: {}, setAttribute(name, value) { this.attributes[name] = value; } }),
    head: { appendChild(script) { scripts.push({ ...script, pageAtLoad: window.location.href }); } },
  };
  const window = {
    navigator: { globalPrivacyControl: gpc },
    "ga-disable-G-VYR2542XCN": disabled,
    location: location(`https://${hostname}${pathname}${search}`),
    setTimeout(callback, delay = 0) { const id = ++nextTimer; timers.set(id, { at: clock + delay, callback }); return id; },
    clearTimeout(id) { timers.delete(id); },
    sessionStorage: {
      getItem(key) { if (storageBlocked) throw new Error("storage blocked"); return storage.get(key); },
      setItem(key, value) { if (storageBlocked) throw new Error("storage blocked"); storage.set(key, value); },
      removeItem(key) { if (storageBlocked) throw new Error("storage blocked"); storage.delete(key); },
    },
    history: { state: null, replaceState(_state, _title, url) { window.location = location(url); } },
  };
  const context = vm.createContext({ window, document, URL, URLSearchParams, process: { env: { NEXT_PUBLIC_CHECKOUT_URL: checkoutUrl } } });
  const modules = new Map();
  function load(filename) {
    const path = resolve(root, filename);
    if (modules.has(path)) return modules.get(path).exports;
    const loadedModule = { exports: {} };
    modules.set(path, loadedModule);
    const compiled = ts.transpileModule(readFileSync(path, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    const execute = vm.runInContext(`(function(require, module, exports) { ${compiled}\n })`, context);
    execute((specifier) => {
      assert.ok(specifier.startsWith("@/"), `Unexpected runtime dependency: ${specifier}`);
      return load(`src/${specifier.slice(2)}.ts`);
    }, loadedModule, loadedModule.exports);
    return loadedModule.exports;
  }
  const tracking = load("src/lib/quiz-tracking.ts");
  const checkout = load("src/components/sites/bluue/checkout.ts");
  const navigation = load("src/lib/checkout-navigation.ts");
  const variants = load("src/lib/quiz-variant.ts");
  const vsl = load("src/lib/vsl-playback.ts");
  const commands = () => (window.dataLayer ?? []).map((command) => Array.from(command));
  const events = () => commands().filter(([command]) => command === "event");
  return { tracking, checkout, navigation, variants, vsl, window, scripts, storage, commands, events, advanceTimers, navigations };
}

const plain = (value) => JSON.parse(JSON.stringify(value));

test("v4 screens emit neutral GA views with legitimate revisits, unique milestones and fixed actions", () => {
  const page = fixture({ pathname: "/quiz/v4-jornada/quiz/", search: "?utm_source=validation&confidence_impact=PRIVATE#PRIVATE" });
  page.tracking.initializeQuizTracking();
  assert.equal(page.variants.quizVariantForPath("/quiz/v4-jornada/"), "v4-jornada");
  assert.equal(page.variants.quizVariantForPath("/quiz/v4-jornada/quiz/"), "v4-jornada");
  assert.equal(page.variants.quizVariantForPath("/quiz/v4-jornada/PRIVATE/"), "v1-direto");
  for (let step = 1; step <= 18; step++) { page.tracking.trackQuizStep(step); page.tracking.trackQuizAnswer(step); }
  page.tracking.trackQuizComplete();
  page.tracking.trackQuizComplete();
  for (const screen of ["result", "result", "presentation", "offer", "presentation", "result"]) page.tracking.trackJourneyView(screen);
  for (const [action, screen] of [["result_continue", "result"], ["presentation_continue", "presentation"], ["back", "offer"], ["offer_view_kits", "offer"]]) {
    page.tracking.trackJourneyAction(action, screen);
    page.tracking.trackJourneyAction(action, screen);
  }
  const journey = page.events().filter(([, name]) => name === "quiz_journey_view");
  assert.deepEqual(plain(journey.map(([, , params]) => params.page_kind)), ["result", "presentation", "offer"]);
  const pv = page.events().filter(([, name]) => name === "page_view");
  assert.deepEqual(plain(pv.map(([, , params]) => params.page_kind)), ["quiz", "result", "presentation", "offer", "presentation", "result"]);
  assert.equal(page.events().filter(([, name]) => name === "quiz_journey_action").length, 4);
  assert.equal(page.events().filter(([, name]) => name === "quiz_answer").length, 14);
  assert.equal(page.events().filter(([, name]) => name === "quiz_step_view").length, 18);
  assert.equal(page.events().filter(([, name]) => name === "quiz_complete").length, 1);
  assert.equal(page.events().filter(([, name]) => name === "view_item").length, 0);
  assert.ok(page.events().every(([, , params]) => params.quiz_id === "cowboy_v4_jornada"));
  assert.ok(!JSON.stringify(page.commands()).includes("PRIVATE"));
  const meta = plain(page.window.fbq.queue);
  assert.equal(meta.filter(command => command[0] === "trackSingle").length, 1, "Virtual phases add no Meta events");
  const count = page.events().length;
  for (const screen of ["PRIVATE", "none", "little", "considerable", "much"]) page.tracking.trackJourneyView(screen);
  page.tracking.trackJourneyAction("PRIVATE", "result");
  page.tracking.trackJourneyAction("result_continue", "offer");
  page.tracking.trackJourneyAction("offer_view_kits", "result");
  page.tracking.trackQuizStep(19);
  assert.equal(page.events().length, count);
});

test("v4 phases respect privacy, reject use on legacy routes and preserve playback coverage", () => {
  for (const settings of [
    { gpc: true, pathname: "/quiz/v4-jornada/quiz/" },
    { disabled: true, pathname: "/quiz/v4-jornada/quiz/" },
    { pathname: "/quiz/v1-direto/" }, { pathname: "/quiz/v2-vsl/" }, { pathname: "/quiz/v3-editorial/quiz/" },
  ]) {
    const page = fixture(settings);
    page.tracking.initializeQuizTracking();
    const before = page.events().length;
    page.tracking.trackJourneyView("result");
    page.tracking.trackJourneyAction("result_continue", "result");
    assert.equal(page.events().length, before);
    if (settings.gpc || settings.disabled) assert.equal(page.scripts.length, 0);
  }
  const page = fixture({ pathname: "/quiz/v4-jornada/quiz/" });
  page.tracking.initializeQuizTracking();
  page.vsl.recordVslPlayback("playing", { duration: 100, played: { length: 0 }, ended: false }, "v4-jornada");
  page.vsl.recordVslPlayback("timeupdate", { duration: 100, currentTime: 99, played: { length: 0 }, ended: false }, "v4-jornada");
  assert.equal(page.events().filter(([, name]) => name === "vsl_start").length, 1);
  assert.equal(page.events().filter(([, name]) => name === "vsl_progress").length, 0);
  page.vsl.recordVslPlayback("timeupdate", { duration: 100, played: { length: 1, start: () => 0, end: () => 50 }, ended: false }, "v4-jornada");
  assert.deepEqual(plain(page.events().filter(([, name]) => name === "vsl_progress").map(([, , params]) => params.percent)), [25, 50]);
  page.window["ga-disable-G-VYR2542XCN"] = true;
  const before = page.events().length;
  page.tracking.trackJourneyView("offer");
  page.tracking.trackJourneyAction("presentation_continue", "presentation");
  assert.equal(page.events().length, before);
});

test("boot is idempotent, suppresses automatic PageView and disables Meta inspection before init", () => {
  const page = fixture();
  page.tracking.initializeQuizTracking();
  page.tracking.initializeQuizTracking();
  assert.equal(page.scripts.length, 3);
  assert.equal(page.events().filter(([, name]) => name === "page_view").length, 1);
  const config = page.commands().find(([command]) => command === "config");
  assert.equal(config[1], "G-VYR2542XCN");
  assert.equal(config[2].send_page_view, false);
  assert.equal(config[2].allow_google_signals, false);
  assert.deepEqual(plain(page.window.fbq.queue.slice(0, 2)), [
    ["set", "autoConfig", false, "1006075098894986"],
    ["init", "1006075098894986"],
  ]);
  assert.equal(page.window.fbq.queue.filter((command) => command[2] === "PageView").length, 1);
  assert.ok(page.scripts.every((script) => script.referrerPolicy === "origin"));
  assert.ok(page.scripts.some((script) => script.src === "https://cdn.utmify.com.br/scripts/utms/latest.js"));
  assert.ok(page.scripts.every((script) => !script.src.includes("/scripts/pixel/")));
});

test("query and fragment are scrubbed BEFORE any vendor loads; only attribution is persisted", () => {
  const page = fixture({
    search: "?utm_source=meta&utm_id=123&gbraid=braid&wbraid=web&dclid=display&answer=SENSITIVE&email=PRIVATE&_gl=fresh.123#SENSITIVE",
    stored: JSON.stringify({ utm_campaign: "campaign", weight: "SENSITIVE", _gl: "stale" }),
  });
  page.tracking.initializeQuizTracking();
  for (const script of page.scripts) {
    assert.doesNotMatch(script.pageAtLoad, /SENSITIVE|PRIVATE|answer|email|#/);
  }
  assert.equal(page.window.location.searchParams.get("_gl"), "fresh.123");
  const saved = JSON.parse(page.storage.get("cowboy_attribution"));
  assert.deepEqual(saved, { utm_source: "meta", utm_campaign: "campaign", utm_id: "123", gbraid: "braid", wbraid: "web", dclid: "display" });
  const [, , params] = page.events()[0];
  assert.equal(params.page_referrer, "https://example.com");
  assert.equal(params.page_title, "COWBOY Energia | Quiz");
  assert.doesNotMatch(JSON.stringify(page.commands()), /SENSITIVE|PRIVATE/);
});

test("GPC and GA disable suppress all SDKs/events/storage, without breaking native checkout", () => {
  for (const options of [{ gpc: true }, { disabled: true }, { gpc: true, storageBlocked: true }]) {
    const page = fixture({ ...options, search: "?utm_source=campaign&answer=SENSITIVE" });
    assert.doesNotThrow(() => page.tracking.initializeQuizTracking());
    page.tracking.trackQuizStart();
    page.tracking.trackQuizStep(1);
    page.tracking.trackBeginCheckout(3);
    assert.equal(page.scripts.length, 0);
    assert.equal(page.events().length, 0);
    if (!options.storageBlocked) assert.equal(page.storage.has("cowboy_attribution"), false);
    const href = new URL(page.checkout.checkoutHref(3, page.window.location.search));
    assert.equal(href.searchParams.get("quantity"), "3");
    assert.equal(href.searchParams.get("utm_source"), "campaign");
    assert.equal(href.searchParams.has("answer"), false);
  }
});

test("StrictMode, backtracking and rapid repeated checkout never duplicate milestone events", () => {
  const page = fixture();
  const track = page.tracking;
  track.initializeQuizTracking();
  for (let round = 0; round < 2; round++) {
    track.trackQuizStart();
    for (let step = 1; step <= 17; step++) track.trackQuizStep(step);
    track.trackQuizComplete();
    track.trackOfferView(3);
    track.trackKitSelection(2);
    track.trackBeginCheckout(2);
  }
  const count = (name) => page.events().filter(([, event]) => event === name).length;
  assert.equal(count("quiz_step_view"), 17);
  for (const name of ["quiz_start", "quiz_complete", "view_item", "select_item", "begin_checkout"]) assert.equal(count(name), 1, name);
  assert.equal(page.window.fbq.queue.filter((command) => command[2] === "InitiateCheckout").length, 1);
  assert.equal(page.window.fbq.queue.filter((command) => command[2] === "ViewContent").length, 1);
  for (const [, , params] of page.events().filter(([, name]) => name === "quiz_step_view")) {
    assert.deepEqual(Object.keys(params).sort(), ["quiz_id", "send_to", "step_index"]);
    assert.equal(typeof params.step_index, "number");
  }
  assert.doesNotMatch(JSON.stringify([page.commands(), page.window.fbq.queue, [...page.storage]]), /answers|severity|weight|"age"|health|question|Lead|Purchase/);
});

test("ecommerce uses one complete kit at its exact price, never rounded unit price times bottles", () => {
  const page = fixture();
  page.tracking.initializeQuizTracking();
  for (const quantity of [1, 2, 3]) page.tracking.trackBeginCheckout(quantity);
  const expected = [79.9, 154.8, 199.9];
  page.events().filter(([, name]) => name === "begin_checkout").forEach(([, , params], index) => {
    assert.equal(params.currency, "BRL");
    assert.equal(params.value, expected[index]);
    assert.equal(params.items[0].price * params.items[0].quantity, expected[index]);
    assert.equal(params.items[0].item_name, "COWBOY Energia");
    assert.equal(params.items[0].item_variant, `${index + 1} frascos`);
    assert.equal(params.items[0].item_id, undefined, "No unverified product SKU");
  });
});

test("invalid ordinals and quantities cannot turn into event text or arbitrary payloads", () => {
  const page = fixture();
  page.tracking.initializeQuizTracking();
  for (const value of [0, 18, -1, 2.5, NaN, "SENSITIVE", { answer: "SENSITIVE" }]) page.tracking.trackQuizStep(value);
  for (const value of [0, 4, "SENSITIVE", { answer: "SENSITIVE" }]) {
    page.tracking.trackOfferView(value);
    page.tracking.trackKitSelection(value);
    page.tracking.trackBeginCheckout(value);
  }
  assert.deepEqual(plain(page.events().map(([, event]) => event)), ["page_view"]);
});

test("attribution validates restored data and never reuses an inbound or stored linker", () => {
  const { checkout } = fixture();
  for (const stored of [null, [], "invalid", { utm_source: 3, email: "SENSITIVE" }]) {
    assert.deepEqual(plain(checkout.safeAttribution("", stored)), {});
  }
  assert.deepEqual(plain(checkout.safeAttribution(`?utm_source=&utm_campaign=${"x".repeat(257)}&src=%0Abad`, { utm_source: "old", utm_medium: "cpc" })), { utm_medium: "cpc" });
  const href = new URL(checkout.checkoutHref(3, "?_gl=inbound&utm_source=current", { _gl: "stale", utm_campaign: "retained", answer: "SENSITIVE" }));
  assert.equal(href.hostname, "www.cowboyenergiamasculina.com.br");
  assert.equal(href.searchParams.get("utm_source"), "current");
  assert.equal(href.searchParams.get("utm_campaign"), "retained");
  assert.equal(href.searchParams.has("_gl"), false);
  assert.equal(href.searchParams.has("answer"), false);
});

test("restricted storage and failing tracking providers cannot interrupt checkout", () => {
  const page = fixture({ storageBlocked: true, search: "?utm_source=direct" });
  assert.doesNotThrow(() => page.tracking.initializeQuizTracking());
  assert.equal(page.checkout.readAttribution().utm_source, "direct");
  page.window.gtag = () => { throw new Error("blocked"); };
  page.window.fbq = () => { throw new Error("blocked"); };
  assert.doesNotThrow(() => page.tracking.trackBeginCheckout(1));
  const url = new URL(page.checkout.checkoutHref(1, "", page.checkout.readAttribution()));
  assert.equal(url.searchParams.get("quantity"), "1");
  assert.equal(url.searchParams.get("utm_source"), "direct");
});

test("production always uses the alternate hostname even when the build supplies a relative checkout", () => {
  for (const hostname of ["cowboyenergiamasculina.com.br", "www.cowboyenergiamasculina.com.br"]) {
    const page = fixture({ hostname, checkoutUrl: "/api/checkout" });
    const target = new URL(page.checkout.checkoutHref(3));
    assert.notEqual(target.hostname, hostname);
    assert.equal(target.pathname, "/api/checkout");
  }
  const local = fixture({ hostname: "localhost", checkoutUrl: "/api/checkout" });
  assert.equal(local.checkout.checkoutHref(2), "/api/checkout?quantity=2");
});

test("a privacy signal raised after initialization suppresses subsequent manual events", () => {
  const page = fixture();
  page.tracking.initializeQuizTracking();
  page.window.navigator.globalPrivacyControl = true;
  page.tracking.trackQuizStart();
  page.tracking.trackBeginCheckout(3);
  assert.equal(page.events().length, 1);
});

function checkoutClick(overrides = {}, anchor) {
  return {
    defaultPrevented: false, button: 0, ctrlKey: false, metaKey: false, shiftKey: false, altKey: false,
    currentTarget: anchor ?? { href: "https://www.cowboyenergiamasculina.com.br/api/checkout?quantity=3&utm_source=test", target: "", hasAttribute: () => false },
    preventDefault() { this.defaultPrevented = true; },
    ...overrides,
  };
}

test("checkout waits for GA callback and captures the decorated click destination before later kit changes", () => {
  const page = fixture();
  page.tracking.initializeQuizTracking();
  const event = checkoutClick();
  page.navigation.handleCheckoutClick(event, 3);
  assert.equal(event.defaultPrevented, true);
  const command = page.events().find(([, name]) => name === "begin_checkout");
  assert.equal(command[2].event_timeout, 700);
  assert.equal(typeof command[2].event_callback, "function");
  assert.equal(page.navigations.length, 0);
  // Simulated vendor decoration occurs later in the same click dispatch.
  event.currentTarget.href += "&_gl=vendor-decoration";
  const expected = event.currentTarget.href;
  page.advanceTimers(0);
  event.currentTarget.href = "https://www.cowboyenergiamasculina.com.br/api/checkout?quantity=1";
  command[2].event_callback();
  command[2].event_callback();
  page.advanceTimers(800);
  assert.deepEqual(page.navigations, [expected]);
  assert.equal(command[2].items[0].item_variant, "3 frascos");
});

test("even a synchronous analytics callback waits until click listeners can decorate the anchor", () => {
  const page = fixture();
  page.tracking.initializeQuizTracking();
  page.window.gtag = (_command, name, params) => { if (name === "begin_checkout") params.event_callback(); };
  const event = checkoutClick();
  page.navigation.handleCheckoutClick(event, 3);
  assert.equal(page.navigations.length, 0);
  event.currentTarget.href += "&_gl=vendor-late";
  page.advanceTimers(0);
  assert.deepEqual(page.navigations, [event.currentTarget.href]);
  page.advanceTimers(800);
  assert.equal(page.navigations.length, 1);
});

test("blocked SDKs cannot trap checkout: independent fallback navigates once at 800ms", () => {
  const page = fixture();
  page.tracking.initializeQuizTracking();
  page.window.gtag = () => { throw new Error("blocked"); };
  page.window.fbq = () => { throw new Error("blocked"); };
  const event = checkoutClick();
  assert.doesNotThrow(() => page.navigation.handleCheckoutClick(event, 3));
  page.advanceTimers(799);
  assert.equal(page.navigations.length, 0);
  page.advanceTimers(1);
  assert.deepEqual(page.navigations, [event.currentTarget.href]);
});

test("rapid duplicate clicks neither skip the wait nor cause duplicate events/navigation", () => {
  const page = fixture();
  page.tracking.initializeQuizTracking();
  const first = checkoutClick();
  const second = checkoutClick({}, first.currentTarget);
  page.navigation.handleCheckoutClick(first, 3);
  page.navigation.handleCheckoutClick(second, 3);
  page.advanceTimers(799);
  assert.equal(page.navigations.length, 0);
  page.advanceTimers(1);
  assert.equal(second.defaultPrevented, true);
  assert.equal(page.navigations.length, 1);
  assert.equal(page.events().filter(([, name]) => name === "begin_checkout").length, 1);
  // A retry after the original navigation (e.g. HTTP 204) stays functional.
  page.navigation.handleCheckoutClick(checkoutClick({}, first.currentTarget), 3);
  page.advanceTimers(0);
  assert.equal(page.navigations.length, 2);
});

test("privacy opt-out navigates after click propagation without waiting for a missing SDK", () => {
  const page = fixture({ gpc: true });
  page.tracking.initializeQuizTracking();
  const event = checkoutClick();
  page.navigation.handleCheckoutClick(event, 3);
  assert.equal(page.navigations.length, 0);
  page.advanceTimers(0);
  assert.deepEqual(page.navigations, [event.currentTarget.href]);
  assert.equal(page.events().length, 0);
});

test("modified clicks, other targets and downloads retain native navigation", () => {
  for (const override of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { target: "_blank" }, { download: true }]) {
    const page = fixture();
    page.tracking.initializeQuizTracking();
    const event = checkoutClick(override);
    if (override.target) event.currentTarget.target = override.target;
    if (override.download) event.currentTarget.hasAttribute = (name) => name === "download";
    page.navigation.handleCheckoutClick(event, 3);
    page.advanceTimers(800);
    assert.equal(event.defaultPrevented, false, JSON.stringify(override));
    assert.equal(page.navigations.length, 0);
    const params = page.events().find(([, name]) => name === "begin_checkout")[2];
    assert.equal(params.event_callback, undefined);
  }
});

test("the canonical route identifies every event before hydration, preserving v1's ID", () => {
  for (const [pathname, id] of [["/quiz/v1-direto/", "cowboy_v1_direto"], ["/quiz/v2-vsl/", "cowboy_v2_vsl"]]) {
    const page = fixture({ pathname });
    page.tracking.initializeQuizTracking();
    page.tracking.trackQuizStart();
    page.tracking.trackQuizStep(1);
    page.tracking.trackQuizComplete();
    page.tracking.trackOfferView(3);
    page.tracking.trackKitSelection(2);
    page.tracking.trackBeginCheckout(2);
    assert.equal(page.events().length, 7);
    assert.ok(page.events().every(([, , params]) => params.quiz_id === id));
    assert.equal(page.events()[0][1], "page_view");
  }
  const { variants } = fixture();
  assert.equal(variants.quizVariantForPath("/quiz/v2-vsl"), "v2-vsl");
  for (const path of ["/", "/quiz/v1-direto/", "/quiz/v2-vsl/private", "/quiz/?variant=v2-vsl", "/quiz/SENSITIVE/"]) {
    assert.equal(variants.quizVariantForPath(path), "v1-direto");
  }
});

test("deduplication is isolated per quiz variant while repeated events stay deduplicated", () => {
  const page = fixture();
  page.tracking.initializeQuizTracking();
  for (let repeat = 0; repeat < 2; repeat++) {
    for (const variant of ["v1-direto", "v2-vsl"]) {
      page.tracking.trackQuizStart(variant);
      page.tracking.trackQuizStep(1, variant);
      page.tracking.trackBeginCheckout(3, undefined, variant);
    }
  }
  for (const name of ["quiz_start", "quiz_step_view", "begin_checkout"]) {
    const ids = page.events().filter(([, event]) => event === name).map(([, , params]) => params.quiz_id);
    assert.deepEqual(plain(ids), ["cowboy_v1_direto", "cowboy_v2_vsl"]);
  }
});

function mediaPlayback(ranges = [], duration = 100, ended = false) {
  return {
    duration, ended,
    played: { length: ranges.length, start: (index) => ranges[index][0], end: (index) => ranges[index][1] },
    // Deliberately present but never read or transmitted by the implementation.
    title: "SENSITIVE", answers: { age: "PRIVATE" }, currentTime: 99,
  };
}

test("editorial cover and questionnaire share an ID but have separate neutral landing types", () => {
  for (const [pathname, kind] of [["/quiz/v3-editorial/", "cover"], ["/quiz/v3-editorial/quiz/", "quiz"]]) {
    const page = fixture({ pathname, search: "?utm_source=campaign&answer=SENSITIVE" });
    page.tracking.initializeQuizTracking();
    page.tracking.initializeQuizTracking();
    assert.deepEqual(plain(page.events().map(([, name]) => name)), ["page_view", "landing_view"]);
    assert.ok(page.events().every(([, , params]) => params.quiz_id === "cowboy_v3_editorial" && params.page_kind === kind));
    assert.doesNotMatch(JSON.stringify(page.commands()), /SENSITIVE|answer/);
  }
  const page = fixture();
  for (const path of ["/quiz/v3-editorial/other", "/quiz/v3-editorial/quiz/private", "/quiz/?variant=v3-editorial"]) {
    assert.equal(page.variants.quizVariantForPath(path), "v1-direto");
  }
});

test("editorial uniquely counts 18 steps and 14 answers while separating back/revisit actions", () => {
  const page = fixture({ pathname: "/quiz/v3-editorial/quiz/" });
  const track = page.tracking;
  track.initializeQuizTracking();
  for (const step of [1, 1, 2, 2]) track.trackQuizStep(step);
  track.trackQuizBack(2, 1);
  track.trackQuizStep(1);
  track.trackQuizStep(1);
  for (let step = 1; step <= 18; step++) {
    track.trackQuizStep(step);
    track.trackQuizAnswer(step);
    track.trackQuizAnswer(step);
  }
  const matching = (name) => page.events().filter(([, event]) => event === name);
  assert.equal(matching("quiz_step_view").length, 18);
  assert.equal(matching("quiz_answer").length, 14);
  assert.deepEqual(plain(matching("quiz_step_revisit").map(([, , params]) => [params.step_index, params.visit_count])), [[1, 2], [2, 2]]);
  const back = matching("quiz_back")[0][2];
  assert.deepEqual([back.from_step_index, back.to_step_index, back.back_count], [2, 1, 1]);
  track.trackResultView(); track.trackResultView();
  track.trackViewKits(); track.trackViewKits();
  assert.equal(matching("quiz_result_view").length, 1);
  assert.equal(matching("quiz_view_kits").length, 1);
  assert.equal(matching("view_item").length, 0, "Reaching result never implicitly declares the kits visible");
});

test("editorial enums reject arbitrary payloads and add no Meta conversions", () => {
  const page = fixture({ pathname: "/quiz/v3-editorial/" });
  const track = page.tracking;
  track.initializeQuizTracking();
  const baseline = page.window.fbq.queue.length;
  for (let round = 0; round < 2; round++) {
    for (const section of ["intro", "how_it_works", "footer"]) track.trackCoverSection(section);
    for (const link of ["privacy", "terms"]) track.trackContentLink(link, "cover");
    for (const action of ["visible", "unmute", "mute", "pause", "error", "autoplay_blocked"]) track.trackVslInteraction(action);
  }
  const before = page.events().length;
  for (const invalid of ["SENSITIVE", { answer: "PRIVATE" }, 19, -1, NaN]) {
    track.trackCoverSection(invalid); track.trackCoverCta(invalid);
    track.trackContentLink(invalid, "offer"); track.trackContentLink("privacy", invalid);
    track.trackVslInteraction(invalid); track.trackQuizStep(invalid); track.trackQuizAnswer(invalid);
    track.trackQuizBack(invalid, 1); track.trackQuizBack(2, invalid);
  }
  assert.equal(page.events().length, before);
  assert.equal(page.window.fbq.queue.length, baseline);
  for (const action of ["visible", "error", "autoplay_blocked"]) assert.equal(page.events().filter(([, name]) => name === `vsl_${action}`).length, 1);
  assert.deepEqual(plain(page.events().filter(([, name]) => name === "vsl_pause").map(([, , params]) => params.interaction_count)), [1, 2]);
  assert.doesNotMatch(JSON.stringify(page.commands()), /SENSITIVE|PRIVATE|answers|weight|severity|duration/);
});

test("editorial cover CTA uses one bounded callback and works when the provider throws", () => {
  for (const blocked of [false, true]) {
    const page = fixture({ pathname: "/quiz/v3-editorial/" });
    page.tracking.initializeQuizTracking();
    if (blocked) page.window.gtag = () => { throw new Error("blocked"); };
    let ready = 0;
    page.tracking.trackCoverCta("hero", () => ready++);
    assert.equal(ready, 0);
    if (!blocked) {
      const params = page.events().find(([, name]) => name === "quiz_cover_cta")[2];
      assert.equal(params.event_timeout, 700);
      assert.equal(params.cta_location, "hero");
      params.event_callback(); params.event_callback();
    } else {
      page.advanceTimers(799); assert.equal(ready, 0);
    }
    page.advanceTimers(800);
    assert.equal(ready, 1);
    page.tracking.trackCoverCta("hero", () => ready++);
    assert.equal(ready, 2, "Dedup does not trap a retry");
  }
});

test("research source tracking contains only fixed neutral IDs and is deduplicated", () => {
  const page = fixture({ pathname: "/quiz/v3-editorial/quiz/" });
  page.tracking.initializeQuizTracking();
  const utms = page.scripts.find((script) => script.id === "cowboy-quiz-utms");
  assert.equal(utms.attributes["data-utmify-ignore-classes"], "quiz-research-source", "UTM SDK receives the exclusion before the delayed article link is mounted");
  const metaBefore = page.window.fbq.queue.length;
  page.tracking.trackContentLink("research_paper", "quiz");
  page.tracking.trackContentLink("research_paper", "quiz");
  const events = page.events().filter(([, name]) => name === "quiz_content_link");
  assert.equal(events.length, 1);
  assert.deepEqual(plain(events[0][2]), {
    send_to: "G-VYR2542XCN", quiz_id: "cowboy_v3_editorial", link_id: "research_paper", link_location: "quiz",
  });
  for (const [link, location] of [["research_paper", "cover"], ["research_paper", "offer"], ["privacy", "quiz"], ["SENSITIVE", "quiz"], ["https://www.nature.com/articles/s41467-025-66723-7", "quiz"], ["research_paper", { answer: "PRIVATE" }]]) {
    page.tracking.trackContentLink(link, location);
  }
  assert.equal(page.events().filter(([, name]) => name === "quiz_content_link").length, 1);
  assert.equal(page.window.fbq.queue.length, metaBefore, "Scientific source clicks do not create Meta events");
  assert.doesNotMatch(JSON.stringify(page.commands()), /SENSITIVE|PRIVATE|nature\.com|66723|participants|genetic|erection|answer/);
});

test("research source respects both privacy gates, older variants and opt-out raised after boot", () => {
  for (const options of [{ pathname: "/quiz/v1-direto/" }, { pathname: "/quiz/v2-vsl/" }, { pathname: "/quiz/v3-editorial/quiz/", gpc: true }, { pathname: "/quiz/v3-editorial/quiz/", disabled: true }]) {
    const page = fixture(options);
    page.tracking.initializeQuizTracking();
    for (const id of ["research_paper", "medicine_alert", "medicine_leaflet"]) page.tracking.trackContentLink(id, "quiz");
    assert.equal(page.events().filter(([, name]) => name === "quiz_content_link").length, 0);
  }
  const page = fixture({ pathname: "/quiz/v3-editorial/quiz/" });
  page.tracking.initializeQuizTracking();
  page.window.navigator.globalPrivacyControl = true;
  for (const id of ["research_paper", "medicine_alert", "medicine_leaflet"]) page.tracking.trackContentLink(id, "quiz");
  assert.equal(page.events().filter(([, name]) => name === "quiz_content_link").length, 0);
});

test("medicine references emit neutral fixed IDs only, once each and only in the quiz location", () => {
  const page = fixture({ pathname: "/quiz/v3-editorial/quiz/" });
  page.tracking.initializeQuizTracking();
  const metaBefore = page.window.fbq.queue.length;
  for (const id of ["medicine_alert", "medicine_leaflet"]) {
    page.tracking.trackContentLink(id, "cover");
    page.tracking.trackContentLink(id, "offer");
    for (let repeat = 0; repeat < 2; repeat++) page.tracking.trackContentLink(id, "quiz");
  }
  const events = page.events().filter(([, name]) => name === "quiz_content_link");
  assert.deepEqual(plain(events.map(([, , params]) => params)), ["medicine_alert", "medicine_leaflet"].map(link_id => ({
    send_to: "G-VYR2542XCN", quiz_id: "cowboy_v3_editorial", link_id, link_location: "quiz",
  })));
  for (const invalid of ["tadalafila", "Cialis", "gov.br/anvisa", "nitratos", { answer: "PRIVATE" }]) page.tracking.trackContentLink(invalid, "quiz");
  assert.equal(page.events().filter(([, name]) => name === "quiz_content_link").length, 2);
  assert.equal(page.window.fbq.queue.length, metaBefore);
  assert.doesNotMatch(JSON.stringify(page.commands()), /tadalafila|Cialis|gov\.br|dailymed|nitratos|PRIVATE|answer|dose|pressure/i);
});

test("new editorial APIs never leak into older variants or bypass privacy gates", () => {
  for (const options of [{ pathname: "/quiz/v1-direto/" }, { pathname: "/quiz/v2-vsl/" }, { pathname: "/quiz/v3-editorial/quiz/", gpc: true }, { pathname: "/quiz/v3-editorial/quiz/", disabled: true }]) {
    const page = fixture(options);
    const track = page.tracking;
    track.initializeQuizTracking();
    const before = page.events().length;
    let ready = false;
    track.trackCoverCta("footer", () => { ready = true; });
    track.trackCoverSection("intro"); track.trackContentLink("terms", "offer");
    track.trackQuizAnswer(1); track.trackQuizBack(2, 1);
    track.trackResultView(); track.trackViewKits();
    track.trackVslInteraction("unmute");
    assert.equal(page.events().length, before);
    assert.equal(ready, true);
    if (options.gpc || options.disabled) assert.equal(page.scripts.length, 0);
  }
});

test("editorial video coverage and checkout retain seek protection, attribution and bounded navigation", () => {
  const page = fixture({ pathname: "/quiz/v3-editorial/quiz/", search: "?utm_source=campaign&gbraid=click" });
  page.tracking.initializeQuizTracking();
  page.vsl.recordVslPlayback("playing", mediaPlayback(), "v3-editorial");
  page.vsl.recordVslPlayback("ended", mediaPlayback([[99, 100]], 100, true), "v3-editorial");
  assert.equal(page.events().filter(([, name]) => name === "vsl_complete").length, 0);
  page.vsl.recordVslPlayback("ended", mediaPlayback([[0, 100]], 100, true), "v3-editorial");
  assert.equal(page.events().filter(([, name]) => name === "vsl_complete").length, 1);
  const event = checkoutClick();
  event.currentTarget.href = page.checkout.checkoutHref(3, "", page.checkout.readAttribution());
  page.navigation.handleCheckoutClick(event, 3, "v3-editorial");
  event.currentTarget.href += "&_gl=fresh-vendor";
  page.advanceTimers(800);
  const destination = new URL(page.navigations[0]);
  assert.equal(destination.searchParams.get("_gl"), "fresh-vendor");
  assert.equal(destination.searchParams.get("utm_source"), "campaign");
  assert.equal(destination.searchParams.get("gbraid"), "click");
  assert.equal(page.events().find(([, name]) => name === "begin_checkout")[2].quiz_id, "cowboy_v3_editorial");
});

test("native playback milestones use watched coverage, deduplicate replay and emit only neutral GA fields", () => {
  const page = fixture({ pathname: "/quiz/v2-vsl/" });
  page.tracking.initializeQuizTracking();
  const metaBefore = page.window.fbq.queue.length;
  page.vsl.recordVslPlayback("playing", mediaPlayback(), "v2-vsl");
  page.vsl.recordVslPlayback("playing", mediaPlayback(), "v2-vsl");
  for (const ranges of [[[0, 24]], [[0, 25]], [[0, 25]], [[0, 25], [50, 75]], [[0, 75]]]) {
    page.vsl.recordVslPlayback("timeupdate", mediaPlayback(ranges), "v2-vsl");
  }
  for (let repeat = 0; repeat < 2; repeat++) page.vsl.recordVslPlayback("ended", mediaPlayback([[0, 100]], 100, true), "v2-vsl");
  const events = page.events().filter(([, name]) => name.startsWith("vsl_"));
  assert.deepEqual(plain(events.map(([, name, params]) => [name, params.percent ?? 0])), [
    ["vsl_start", 0], ["vsl_progress", 25], ["vsl_progress", 50], ["vsl_progress", 75], ["vsl_complete", 100],
  ]);
  for (const [, name, params] of events) {
    assert.equal(params.quiz_id, "cowboy_v2_vsl");
    assert.equal(params.video_id, "cowboy_vsl");
    assert.deepEqual(Object.keys(params).sort(), (name === "vsl_start"
      ? ["quiz_id", "send_to", "video_id"] : ["percent", "quiz_id", "send_to", "video_id"]));
  }
  assert.doesNotMatch(JSON.stringify(events), /SENSITIVE|PRIVATE|answers|title|currentTime|duration/);
  assert.equal(page.window.fbq.queue.length, metaBefore, "VSL does not add Meta events");
});

test("seeking to the ending cannot invent progress or completion", () => {
  const page = fixture({ pathname: "/quiz/v2-vsl/" });
  page.tracking.initializeQuizTracking();
  page.vsl.recordVslPlayback("playing", mediaPlayback(), "v2-vsl");
  page.vsl.recordVslPlayback("timeupdate", mediaPlayback([], 100), "v2-vsl");
  page.vsl.recordVslPlayback("timeupdate", mediaPlayback([[99, 100]], 100), "v2-vsl");
  page.vsl.recordVslPlayback("ended", mediaPlayback([[99, 100]], 100, true), "v2-vsl");
  assert.deepEqual(plain(page.events().filter(([, name]) => name.startsWith("vsl_")).map(([, name]) => name)), ["vsl_start"]);
  assert.equal(page.vsl.playedSeconds(mediaPlayback([[0, 25], [50, 75]])), 50);
});

test("completion requires ended and near-total coverage; invalid metadata/ranges are ignored", () => {
  const page = fixture({ pathname: "/quiz/v2-vsl/" });
  page.tracking.initializeQuizTracking();
  for (const duration of [0, NaN, Infinity, -1]) {
    page.vsl.recordVslPlayback("ended", mediaPlayback([[0, 100]], duration, true), "v2-vsl");
  }
  const broken = mediaPlayback([[0, 100]], 100, true);
  broken.played.start = () => { throw new Error("range unavailable"); };
  assert.doesNotThrow(() => page.vsl.recordVslPlayback("timeupdate", broken, "v2-vsl"));
  assert.equal(page.events().length, 1);
  page.vsl.recordVslPlayback("ended", mediaPlayback([[0, 98.9]], 100, true), "v2-vsl");
  page.vsl.recordVslPlayback("ended", mediaPlayback([[0, 99]], 100, false), "v2-vsl");
  assert.equal(page.events().filter(([, name]) => name === "vsl_complete").length, 0);
  page.vsl.recordVslPlayback("ended", mediaPlayback([[0, 99]], 100, true), "v2-vsl");
  assert.equal(page.events().filter(([, name]) => name === "vsl_complete").length, 1);
});

test("video telemetry cannot emit in v1, through privacy opt-out, or with arbitrary milestones", () => {
  for (const options of [{ pathname: "/quiz/v1-direto/" }, { pathname: "/quiz/v2-vsl/", gpc: true }, { pathname: "/quiz/v2-vsl/", disabled: true }]) {
    const page = fixture(options);
    page.tracking.initializeQuizTracking();
    const variant = page.variants.quizVariantForPath(options.pathname);
    page.vsl.recordVslPlayback("playing", mediaPlayback(), variant);
    page.vsl.recordVslPlayback("ended", mediaPlayback([[0, 100]], 100, true), variant);
    assert.equal(page.events().filter(([, name]) => name.startsWith("vsl_")).length, 0);
  }
  const page = fixture({ pathname: "/quiz/v2-vsl/" });
  page.tracking.initializeQuizTracking();
  for (const value of ["PRIVATE", 12, 99, -1, NaN, { answers: "SENSITIVE" }]) page.tracking.trackVslMilestone(value);
  page.window.navigator.globalPrivacyControl = true;
  page.vsl.recordVslPlayback("ended", mediaPlayback([[0, 100]], 100, true), "v2-vsl");
  assert.equal(page.events().length, 1);
});

test("v2 checkout preserves the existing callback deadline and decorated destination", () => {
  const page = fixture({ pathname: "/quiz/v2-vsl/" });
  page.tracking.initializeQuizTracking();
  const event = checkoutClick();
  page.navigation.handleCheckoutClick(event, 3, "v2-vsl");
  event.currentTarget.href += "&_gl=vendor-decoration";
  const params = page.events().find(([, name]) => name === "begin_checkout")[2];
  assert.equal(params.quiz_id, "cowboy_v2_vsl");
  assert.equal(params.event_timeout, 700);
  page.advanceTimers(799);
  assert.equal(page.navigations.length, 0);
  page.advanceTimers(1);
  assert.deepEqual(page.navigations, [event.currentTarget.href]);
});
