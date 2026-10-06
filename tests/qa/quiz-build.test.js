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
  for (const relative of ['quiz/v1-direto/index.html', '_next/static/chunks/app.js', 'sites/cowboy/video.mp4', 'index.html', '404.html', '.env', 'docs/private.txt']) {
    const target = path.join(output, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, 'fixture');
  }
  return output;
}

test('quiz export copies only its route and public runtime; root and private artifacts stay excluded', (t) => {
  assert.deepEqual(quizPublicFiles(fixture(t)), ['_next/static/chunks/app.js', 'quiz/v1-direto/index.html', 'sites/cowboy/video.mp4']);
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
