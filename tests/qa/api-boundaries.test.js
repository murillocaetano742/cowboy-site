'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const freight = require('#api/frete');
const commerce = require('#commerce');

test('QA: rejeita corpo maior que o contrato mesmo sem Content-Length', () => {
  const request = { headers: {}, body: { postalCode: 'x'.repeat(5000) + '01001000', quantity: 2 } };
  assert.equal(freight.requestBodyIsAcceptable(request), false);
});

test('QA: CEP com texto arbitrário não se transforma em destino válido', () => {
  assert.equal(commerce.parseBrazilianPostalCode('texto01001000'), null);
  assert.equal(commerce.parseBrazilianPostalCode('01001-000'), '01001000');
});

test('QA: pacote e preço de três frascos também cumprem a regra de 2+', () => {
  const payload = freight.buildPayload('01001000', 3);
  assert.equal(payload.products.length, 1);
  const parcel = payload.products[0];
  assert.equal(parcel.quantity, 1);
  assert.equal(parcel.weight, 0.5);
  assert.deepEqual([parcel.width, parcel.height, parcel.length].sort((a, b) => a - b), [8, 8, 23]);
  assert.equal(Number(parcel.insurance_value), 127.14);
});
