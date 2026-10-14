'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { quizPublicFiles } = require(path.resolve(__dirname, '../../scripts/build-quiz.js'));

function fixture(t) {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'cowboy-quiz-build-'));
  t.after(() => {
    assert.equal(path.dirname(output), os.tmpdir());
    assert.ok(path.basename(output).startsWith('cowboy-quiz-build-'));
    fs.rmSync(output, { recursive: true, force: true });
  });
  for (const relative of ['quiz/v1-direto/index.html', 'quiz/v2-vsl/index.html', 'quiz/v3-editorial/index.html', 'quiz/v3-editorial/quiz/index.html', 'quiz/v3-editorial/quiz/index.txt', 'quiz/v3-editorial/__next._tree.txt', 'quiz/v3-editorial/__next.quiz/v3-editorial/__PAGE__.txt', 'quiz/v4-jornada/index.html', 'quiz/v4-jornada/quiz/index.html', 'quiz/v4-jornada/quiz/index.txt', 'quiz/v4-jornada/__next._tree.txt', '_next/static/chunks/app.js', 'sites/cowboy/video.mp4', 'index.html', '404.html', '.env', 'docs/private.txt', 'quiz/private/debug.html', 'quiz/v1-direto/private/index.html', 'quiz/v3-editorial/private/index.html', 'quiz/v3-editorial/quiz/private/index.html', 'quiz/v4-jornada/private/index.html', 'quiz/v4-jornada/quiz/private/index.html']) {
    const target = path.join(output, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, 'fixture');
  }
  return output;
}

test('quiz export publishes six approved entrypoints and metadata once; nested unapproved routes stay excluded', (t) => {
  assert.deepEqual(quizPublicFiles(fixture(t)), ['_next/static/chunks/app.js', 'quiz/v1-direto/index.html', 'quiz/v2-vsl/index.html', 'quiz/v3-editorial/__next._tree.txt', 'quiz/v3-editorial/__next.quiz/v3-editorial/__PAGE__.txt', 'quiz/v3-editorial/index.html', 'quiz/v3-editorial/quiz/index.html', 'quiz/v3-editorial/quiz/index.txt', 'quiz/v4-jornada/__next._tree.txt', 'quiz/v4-jornada/index.html', 'quiz/v4-jornada/quiz/index.html', 'quiz/v4-jornada/quiz/index.txt', 'sites/cowboy/video.mp4']);
});

test('quiz export rejects hidden files and unapproved source extensions inside public roots', (t) => {
  const output = fixture(t);
  const hidden = path.join(output, 'sites', '.env');
  fs.writeFileSync(hidden, 'fixture');
  assert.throws(() => quizPublicFiles(output), /hidden quiz asset/);
  fs.unlinkSync(hidden);
  fs.writeFileSync(path.join(output, 'sites', 'source.ts'), 'fixture');
  assert.throws(() => quizPublicFiles(output), /Unexpected quiz public file/);
});

test('quiz cannot be published without the canonical HTML entrypoint', (t) => {
  const output = fixture(t);
  fs.unlinkSync(path.join(output, 'quiz/v1-direto/index.html'));
  assert.throws(() => quizPublicFiles(output), /entrypoint missing/);
});

test('quiz cannot publish a partial release without the independent VSL version', (t) => {
  const output = fixture(t);
  fs.unlinkSync(path.join(output, 'quiz/v2-vsl/index.html'));
  assert.throws(() => quizPublicFiles(output), /entrypoint missing: quiz\/v2-vsl/);
});

test('quiz cannot publish the editorial release without either cover or questionnaire entrypoint', (t) => {
  const output = fixture(t);
  const cover = path.join(output, 'quiz/v3-editorial/index.html');
  fs.unlinkSync(cover);
  assert.throws(() => quizPublicFiles(output), /entrypoint missing: quiz\/v3-editorial$/);
  fs.writeFileSync(cover, 'fixture');
  fs.unlinkSync(path.join(output, 'quiz/v3-editorial/quiz/index.html'));
  assert.throws(() => quizPublicFiles(output), /entrypoint missing: quiz\/v3-editorial\/quiz$/);
});

test('Next prefetch metadata cannot publish an extra HTML page under an approved route', (t) => {
  const output = fixture(t);
  fs.writeFileSync(path.join(output, 'quiz/v3-editorial/__next.quiz/extra.html'), 'fixture');
  assert.throws(() => quizPublicFiles(output), /Unexpected quiz public file/);
});

test('quiz cannot publish the parallel journey without either cover or questionnaire entrypoint', (t) => {
  const output = fixture(t);
  const cover = path.join(output, 'quiz/v4-jornada/index.html');
  fs.unlinkSync(cover);
  assert.throws(() => quizPublicFiles(output), /entrypoint missing: quiz\/v4-jornada$/);
  fs.writeFileSync(cover, 'fixture');
  fs.unlinkSync(path.join(output, 'quiz/v4-jornada/quiz/index.html'));
  assert.throws(() => quizPublicFiles(output), /entrypoint missing: quiz\/v4-jornada\/quiz$/);
});
