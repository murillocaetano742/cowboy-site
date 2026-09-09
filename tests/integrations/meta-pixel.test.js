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
  const context = vm.createContext({ window, document: { createElement: () => ({}), head: { appendChild: script => scripts.push(script) } } });
  return { window, calls, scripts, run: () => vm.runInContext(source, context) };
}

test('Pixel preserva eventos de navegação sem criar compra e não duplica em carregamento repetido', () => {
  const page = harness();
  page.run();
  page.run();
  assert.equal(page.scripts.length, 1);
  assert.equal(page.scripts[0].src, 'https://connect.facebook.net/en_US/fbevents.js');
  const queued = Array.from(page.window.fbq.queue, args => Array.from(args));
  assert.equal(queued.length, 3);
  assert.equal(queued[0][0], 'init');
  assert.equal(queued[0][1], '1006075098894986');
  assert.deepEqual(queued.slice(1).map(args => args[2]), ['PageView', 'ViewContent']);
  assert.ok(queued.slice(1).every(args => args[0] === 'trackSingle' && args[1] === '1006075098894986'));
});

test('Pixel reutiliza o SDK existente e respeita Global Privacy Control', () => {
  const existing = harness({ existingPixel: true });
  existing.run();
  assert.equal(existing.scripts.length, 0);
  assert.equal(existing.calls.length, 3);
  const privatePage = harness({ privacyControl: true });
  privatePage.run();
  assert.equal(privatePage.scripts.length, 0);
  assert.equal(privatePage.window.fbq, undefined);
});
