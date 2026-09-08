'use strict';

// Configuração mínima: testes E2E contra o servidor local já iniciado (não sobe servidor sozinho).
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests/e2e',
  timeout: 60000,
  retries: 0,
  reporter: [['list']],
  use: { headless: true, viewport: { width: 1280, height: 800 }, locale: 'pt-BR' },
});
