import { describe, expect, it } from 'vitest';
import { Volante } from './volante';

describe('volante da corrida', () => {
  it('celular seguro torto desde o comeco nao puxa para lado nenhum', () => {
    const v = new Volante();
    const lidas = [25, 26, 24, 25, 27, 25, 26].map((g) => v.ler(g));
    expect(lidas.every((x) => x === 0)).toBe(true);
  });

  it('cada inclinada anda uma faixa so; para andar de novo, volta ao meio', () => {
    const v = new Volante();
    v.ler(0);
    expect(v.ler(20)).toBe(1);
    expect(v.ler(24)).toBe(0);
    expect(v.ler(22)).toBe(0);
    expect(v.ler(2)).toBe(0);
    expect(v.ler(-20)).toBe(-1);
  });
});
