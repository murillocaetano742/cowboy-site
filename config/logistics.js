'use strict';

/**
 * Dados físicos confirmados pela operação em 07/09/2026.
 * Cada pedido de 1 a 4 frascos usa uma única embalagem pronta de 23×8×8 cm e
 * 0,5 kg totais. O peso unitário de 0,06 kg é registrado para inventário; não
 * é multiplicado na cotação porque a API recebe o pacote já montado.
 */
const LOGISTICS = Object.freeze({
  originPostalCode: '74475239',
  parcel: Object.freeze({
    weightKg: 0.5,
    lengthCm: 23,
    widthCm: 8,
    heightCm: 8,
  }),
  product: Object.freeze({
    unitWeightKg: 0.06,
  }),
});

module.exports = { LOGISTICS };
