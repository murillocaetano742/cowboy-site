'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const QUIZ_ROOT = path.join(ROOT, 'packages', 'cowboy-quiz');
const QUIZ_OUTPUT = path.join(QUIZ_ROOT, 'out');
const PUBLIC_DIRECTORIES = Object.freeze(['quiz/v1-direto', '_next/static', 'sites']);
const PUBLIC_EXTENSIONS = new Set(['.html', '.txt', '.js', '.css', '.json', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.woff', '.woff2', '.mp4', '.vtt', '.ico']);

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
  function visit(relative) {
    const absolute = path.join(output, relative);
    const entry = fs.lstatSync(absolute);
    if (entry.isSymbolicLink()) throw new Error(`Quiz public files cannot be symbolic links: ${relative}`);
    if (entry.isDirectory()) {
      return fs.readdirSync(absolute).flatMap((name) => {
        if (name.startsWith('.')) throw new Error(`Unexpected hidden quiz asset: ${relative}/${name}`);
        return visit(`${relative}/${name}`);
      });
    }
    if (!entry.isFile() || !PUBLIC_EXTENSIONS.has(path.extname(relative))) {
      throw new Error(`Unexpected quiz public file: ${relative}`);
    }
    return [relative];
  }
  const files = PUBLIC_DIRECTORIES.flatMap(visit);
  if (!files.includes('quiz/v1-direto/index.html')) throw new Error('Quiz entrypoint missing.');
  return files.sort();
}

if (require.main === module) buildQuiz();
module.exports = { buildQuiz, quizPublicFiles, QUIZ_ROOT, QUIZ_OUTPUT };
