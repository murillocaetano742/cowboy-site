'use strict';

// Verifica somente o redirecionamento do servidor local. Não acessa Cartpanda.
const assert = require('node:assert/strict');
const expected = [[1, '211742450'], [2, '211742746'], [4, '211742749']];

async function run() {
  const results = [];
  for (const [quantity, variant] of expected) {
    const response = await fetch(`http://127.0.0.1:4173/api/checkout?quantity=${quantity}&utm_source=qa-local&utm_content=C10&email=discard`, { redirect: 'manual', headers: { Accept: 'text/html' } });
    assert.equal(response.status, 302);
    const destination = new URL(response.headers.get('location'));
    assert.equal(destination.protocol, 'https:');
    assert.equal(destination.hostname, 'cowboy-energia.mycartpanda.com');
    assert.ok(destination.pathname.includes(variant), `Kit ${quantity}: variante incorreta`);
    assert.equal(destination.searchParams.get('utm_source'), 'qa-local');
    assert.equal(destination.searchParams.get('utm_content'), 'C10');
    assert.equal(destination.searchParams.get('email'), null);
    assert.match(response.headers.get('cache-control'), /no-store/);
    results.push({ quantity, status: response.status, host: destination.hostname, variant, attributionPreserved: true, redirectFollowed: false });
  }
  console.log(JSON.stringify({ checksPassed: results.length, results }, null, 2));
}

run().catch(error => { console.error(error.message); process.exitCode = 1; });
