'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const { buildSite, OUTPUT, PAGES, ASSETS } = require(path.join(ROOT, 'scripts', 'build-site.js'));

buildSite();
function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    assert.ok(!entry.isSymbolicLink(), 'Public output must not contain symbolic links');
    return entry.isDirectory() ? listFiles(absolute) : [path.relative(OUTPUT, absolute).replaceAll(path.sep, '/')];
  });
}
const expected = [...PAGES, ...ASSETS].sort();
const actual = listFiles(OUTPUT).sort();
assert.deepEqual(actual, expected, 'Public output must match the explicit allowlist');
assert.ok(actual.every((name) => !/^(?:docs|api|config|tests|scripts|node_modules|\.)\//.test(name)));
const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
assert.equal(vercel.outputDirectory, 'dist');
assert.equal(vercel.buildCommand, 'node scripts/build-site.js');
for (const page of PAGES.filter((name) => name.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(OUTPUT, page), 'utf8');
  for (const match of html.matchAll(/(?:src|href|srcset)=["']([^"']+)["']/g)) {
    const target = match[1].split(/[?#]/)[0];
    if (!target || /^(?:https?:|mailto:|tel:|data:|\/api\/)/.test(target)) continue;
    const normalized = target.replace(/^\//, '') || 'index.html';
    assert.ok(fs.existsSync(path.join(OUTPUT, normalized)) || fs.existsSync(path.join(OUTPUT, `${normalized}.html`)), `${page}: missing ${target}`);
  }
}
console.log('Public build checks passed: exact allowlist, local references, Vercel output isolation.');

