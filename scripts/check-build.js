'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const { buildSite, OUTPUT, PAGES, ASSETS, OUTPUT_ALIASES } = require(path.join(ROOT, 'scripts', 'build-site.js'));
const { quizPublicFiles, PUBLIC_QUIZ_ROUTES } = require(path.join(ROOT, 'scripts', 'build-quiz.js'));

buildSite();
function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    assert.ok(!entry.isSymbolicLink(), 'Public output must not contain symbolic links');
    return entry.isDirectory() ? listFiles(absolute) : [path.relative(OUTPUT, absolute).replaceAll(path.sep, '/')];
  });
}
const expected = [...PAGES, ...ASSETS, ...OUTPUT_ALIASES.map(({ destination }) => destination), ...quizPublicFiles()].sort();
const actual = listFiles(OUTPUT).sort();
assert.deepEqual(actual, expected, 'Public output must match the explicit allowlist');
assert.deepEqual(actual.filter((name) => name.startsWith('quiz/') && name.endsWith('.html')), PUBLIC_QUIZ_ROUTES.map((route) => `${route}/index.html`).sort(), 'Only the four approved quiz entrypoints may be public');
assert.ok(actual.every((name) => !/^(?:docs|api|config|tests|scripts|node_modules|\.)\//.test(name)));
const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
assert.equal(vercel.outputDirectory, 'dist');
assert.equal(vercel.buildCommand, 'node scripts/build-site.js');
assert.equal(fs.readFileSync(path.join(OUTPUT, 'index.html'), 'utf8'), fs.readFileSync(path.join(ROOT, 'cowboy-nova.html'), 'utf8'), 'Quiz must not replace the VSL homepage');
assert.deepEqual(vercel.redirects.find(({ source }) => source === '/quiz'), { source: '/quiz', destination: '/quiz/v1-direto/', permanent: false }, 'The existing quiz shortcut must remain on v1');
for (const route of PUBLIC_QUIZ_ROUTES) {
  const quizHtml = fs.readFileSync(path.join(OUTPUT, route, 'index.html'), 'utf8');
  for (const match of quizHtml.matchAll(/(?:src|href)=["'](\/(?:_next|sites|imagens|videos|quiz)\/[^"'?#]+)[^"']*["']/g)) {
    const target = path.join(OUTPUT, match[1]);
    assert.ok(fs.existsSync(target), `${route}: missing public asset ${match[1]}`);
    if (fs.statSync(target).isDirectory()) assert.ok(fs.existsSync(path.join(target, 'index.html')), `${route}: missing route entrypoint ${match[1]}`);
  }
}
const vslAsset = 'videos/vsl/vsl-dr-durval-720.mp4';
assert.ok(ASSETS.includes(vslAsset), 'The existing VSL must be included in the public allowlist');
assert.ok(fs.readFileSync(path.join(OUTPUT, vslAsset)).equals(fs.readFileSync(path.join(ROOT, vslAsset))), 'The published VSL must match the existing source video');
for (const page of PAGES.filter((name) => name.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(OUTPUT, page), 'utf8');
  for (const match of html.matchAll(/(src|href|srcset|imagesrcset)=["']([^"']+)["']/g)) {
    if (/^data:/.test(match[2])) continue;
    // srcset/imagesrcset carry comma-separated candidates with width descriptors ("a.webp 720w, b.webp 1122w").
    const candidates = /srcset$/.test(match[1]) ? match[2].split(',') : [match[2]];
    for (const candidate of candidates) {
      const target = candidate.trim().split(/\s+/)[0].split(/[?#]/)[0];
      if (!target || /^(?:https?:|mailto:|tel:|data:|\/api\/)/.test(target)) continue;
      const normalized = target.replace(/^\//, '') || 'index.html';
      assert.ok(fs.existsSync(path.join(OUTPUT, normalized)) || fs.existsSync(path.join(OUTPUT, `${normalized}.html`)), `${page}: missing ${target}`);
    }
  }
}
console.log('Public build checks passed: exact allowlist, local references, Vercel output isolation.');

