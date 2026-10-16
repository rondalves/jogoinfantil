import { describe, expect, it } from 'vitest';
import { comAdulto } from './adulto';

describe('quem joga junto', () => {
  it('chama a mamae ou o papai no lugar do adulto', () => {
    expect(comAdulto('Perigo? Chame um adulto!', 'mae')).toBe('Perigo? Chame a mamãe!');
    expect(comAdulto('Perigo? Chame um adulto!', 'pai')).toBe('Perigo? Chame o papai!');
    expect(comAdulto('Longe dos olhos do adulto, fica perigoso.', 'mae')).toBe('Longe dos olhos da mamãe, fica perigoso.');
    expect(comAdulto('Esperar o adulto abrir', 'pai')).toBe('Esperar o papai abrir');
    expect(comAdulto('O adulto pega a bola.', 'mae')).toBe('A mamãe pega a bola.');
  });

  it('regra geral e sem escolha ficam como estao', () => {
    expect(comAdulto('Porta só adulto abre.', 'mae')).toBe('Porta só adulto abre.');
    expect(comAdulto('Chame um adulto!', null)).toBe('Chame um adulto!');
  });
});
