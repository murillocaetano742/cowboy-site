'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const source = fs.readFileSync(path.join(root, 'assets/js/cowboy-google.js'), 'utf8');
function harness({ privacyControl = false, disabled = false, existingTag = false } = {}) {
  const scripts = [];
  const window = { navigator: { globalPrivacyControl: privacyControl }, dataLayer: [{ event: 'existing-event' }], 'ga-disable-G-VYR2542XCN': disabled };
  const context = vm.createContext({ window, document: { querySelector: () => existingTag ? {} : null, createElement: () => ({}), head: { appendChild: script => scripts.push(script) } } });
  return { window, scripts, run: () => vm.runInContext(source, context) };
}

test('GA4 mantém a fila, configura a propriedade uma vez e não simula page_view ou compra', () => {
  const page = harness();
  page.run();
  page.run();
  assert.equal(page.scripts.length, 1);
  assert.equal(page.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-VYR2542XCN');
  assert.equal(page.window.dataLayer.length, 3);
  assert.equal(page.window.dataLayer[0].event, 'existing-event');
  assert.deepEqual(Array.from(page.window.dataLayer[2]), ['config', 'G-VYR2542XCN']);
  assert.ok(page.window.dataLayer.every(entry => entry[0] !== 'event'));
});

test('GA4 respeita opt-out e não duplica o SDK existente', () => {
  for (const options of [{ privacyControl: true }, { disabled: true }]) {
    const page = harness(options);
    page.run();
    assert.equal(page.scripts.length, 0);
    assert.equal(page.window.dataLayer.length, 1);
  }
  const existing = harness({ existingTag: true });
  existing.run();
  assert.equal(existing.scripts.length, 0);
  assert.equal(existing.window.dataLayer.length, 3);
});

test('todas as páginas publicadas carregam a tag uma vez no head', () => {
  for (const filename of ['cowboy-nova.html', 'privacidade.html', 'termos.html']) {
    const html = fs.readFileSync(path.join(root, filename), 'utf8');
    assert.equal((html.match(/src="\/assets\/js\/cowboy-google\.js"/g) || []).length, 1, filename);
    assert.ok(html.indexOf('cowboy-google.js') < html.indexOf('</head>'), filename);
  }
});
