'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const directories = ['api', 'config', 'scripts', 'assets/js', 'tests'];
function files(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? files(filename) : entry.name.endsWith('.js') ? [filename] : [];
  });
}
const targets = directories.flatMap((directory) => files(path.join(ROOT, directory)));
for (const filename of targets) {
  const result = spawnSync(process.execPath, ['--check', filename], { encoding: 'utf8' });
  if (result.status !== 0) { console.error(result.stderr || result.error?.message); process.exit(1); }
}
console.log(`JavaScript syntax checked: ${targets.length} files. This gate does not perform TypeScript or ESLint analysis.`);

