// Encoding only: preserve image contents and dimensions; retain PNG masters.
const sharp = require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const fs = require('node:fs');

(async () => {
  for (const name of ['cowboy-packshot', 'cowboy-hero', 'cowboy-kit-2']) {
    const output = `imagens/v2/${name}.webp`;
    await sharp(`imagens/v2/${name}.png`).webp({ quality: 88, effort: 6 }).toFile(output);
    const metadata = await sharp(output).metadata();
    console.log(JSON.stringify({ path: output, width: metadata.width, height: metadata.height, bytes: fs.statSync(output).size }));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
