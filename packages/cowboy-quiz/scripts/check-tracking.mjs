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
function fixture({ search = "", stored = "{}", gpc = false, disabled = false, storageBlocked = false, checkoutUrl, hostname = "cowboyenergiamasculina.com.br" } = {}) {
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
    location: location(`https://${hostname}/quiz/v1-direto/${search}`),
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
  const commands = () => (window.dataLayer ?? []).map((command) => Array.from(command));
  const events = () => commands().filter(([command]) => command === "event");
  return { tracking, checkout, navigation, window, scripts, storage, commands, events, advanceTimers, navigations };
}

const plain = (value) => JSON.parse(JSON.stringify(value));

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
