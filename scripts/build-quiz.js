'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const QUIZ_ROOT = path.join(ROOT, 'packages', 'cowboy-quiz');
const QUIZ_OUTPUT = path.join(QUIZ_ROOT, 'out');
const PUBLIC_QUIZ_ROUTES = Object.freeze([
  'quiz/v1-direto',
  'quiz/v2-vsl',
  'quiz/v3-editorial',
  'quiz/v3-editorial/quiz',
  'quiz/v4-jornada',
  'quiz/v4-jornada/quiz',
]);
const PUBLIC_DIRECTORIES = Object.freeze(['_next/static', 'sites']);
const PUBLIC_EXTENSIONS = new Set(['.html', '.txt', '.js', '.css', '.json', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.woff', '.woff2', '.mp4', '.vtt', '.ico']);
const NEXT_METADATA_EXTENSIONS = new Set(['.txt']);

function buildQuiz() {
  const nextCli = path.join(QUIZ_ROOT, 'node_modules', 'next', 'dist', 'bin', 'next');
  if (!fs.existsSync(nextCli)) throw new Error('Install quiz dependencies with npm --prefix packages/cowboy-quiz ci before building.');
  const result = spawnSync(process.execPath, [nextCli, 'build'], {
    cwd: QUIZ_ROOT,
    stdio: 'inherit',
    env: { ...process.env, NEXT_PUBLIC_CHECKOUT_URL: '/api/checkout', NEXT_TELEMETRY_DISABLED: '1' },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Quiz build failed (${result.status}).`);
}

function quizPublicFiles(output = QUIZ_OUTPUT) {
  function visit(relative, extensions = PUBLIC_EXTENSIONS) {
    const absolute = path.join(output, relative);
    const entry = fs.lstatSync(absolute);
    if (entry.isSymbolicLink()) throw new Error(`Quiz public files cannot be symbolic links: ${relative}`);
    if (entry.isDirectory()) {
      return fs.readdirSync(absolute).flatMap((name) => {
        if (name.startsWith('.')) throw new Error(`Unexpected hidden quiz asset: ${relative}/${name}`);
        return visit(`${relative}/${name}`, extensions);
      });
    }
    if (!entry.isFile() || !extensions.has(path.extname(relative))) {
      throw new Error(`Unexpected quiz public file: ${relative}`);
    }
    return [relative];
  }
  const routeFiles = PUBLIC_QUIZ_ROUTES.flatMap((route) => {
    const directory = path.join(output, route);
    const entry = fs.lstatSync(directory);
    if (entry.isSymbolicLink() || !entry.isDirectory()) throw new Error(`Invalid quiz route directory: ${route}`);
    // Each route owns its entrypoint and Next prefetch metadata, never arbitrary child routes.
    return fs.readdirSync(directory).flatMap((name) => {
      if (name.startsWith('.')) throw new Error(`Unexpected hidden quiz asset: ${route}/${name}`);
      if (name === 'index.html' || name === 'index.txt') return visit(`${route}/${name}`);
      if (name.startsWith('__next.')) return visit(`${route}/${name}`, NEXT_METADATA_EXTENSIONS);
      return [];
    });
  });
  const files = [...routeFiles, ...PUBLIC_DIRECTORIES.flatMap((relative) => visit(relative))];
  for (const route of PUBLIC_QUIZ_ROUTES) {
    if (!files.includes(`${route}/index.html`)) throw new Error(`Quiz entrypoint missing: ${route}`);
  }
  return files.sort();
}

if (require.main === module) buildQuiz();
module.exports = { buildQuiz, quizPublicFiles, QUIZ_ROOT, QUIZ_OUTPUT, PUBLIC_QUIZ_ROUTES };
