'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.resolve(__dirname, '../../assets/js/cowboy-pixel.js'), 'utf8');
function harness({ existingPixel = false, privacyControl = false } = {}) {
  const calls = [];
  const scripts = [];
  const window = { navigator: { globalPrivacyControl: privacyControl } };
  if (existingPixel) window.fbq = (...args) => calls.push(args);
  const context = vm.createContext({ window, atob, document: { createElement: () => ({}), head: { appendChild: script => scripts.push(script) } } });
  return { window, calls, scripts, run: () => vm.runInContext(source, context) };
}

test('Pixel carrega o código UTMify fornecido uma vez, com o identificador correto', () => {
  const page = harness();
  page.run();
  page.run();
  assert.equal(page.scripts.length, 1);
  assert.equal(page.scripts[0].src, 'https://cdn.utmify.com.br/scripts/pixel/pixel.js');
  assert.equal(page.scripts[0].async, true);
  assert.equal(page.scripts[0].defer, true);
  assert.equal(page.window.pixelId, '6aa16d0bee215350c09b5b31');
  // The vendor SDK owns events. This loader must not send another Meta event.
  assert.equal(page.window.fbq, undefined);
});

test('Pixel preserva o SDK Meta existente sem disparos diretos e respeita Global Privacy Control', () => {
  const existing = harness({ existingPixel: true });
  const originalFbq = existing.window.fbq;
  existing.run();
  assert.equal(existing.scripts.length, 1);
  assert.equal(existing.window.fbq, originalFbq);
  assert.equal(existing.calls.length, 0);
  const privatePage = harness({ privacyControl: true });
  privatePage.run();
  assert.equal(privatePage.scripts.length, 0);
  assert.equal(privatePage.window.fbq, undefined);
  assert.equal(privatePage.window.pixelId, undefined);
});
