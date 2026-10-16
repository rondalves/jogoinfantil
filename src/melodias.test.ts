import { describe, expect, it } from 'vitest';
import { CANCAO_DE_NINAR, GYMNOPEDIE, notas } from './melodias';

const soma = (ns: { tempos: number }[]) => ns.reduce((a, n) => a + n.tempos, 0);

describe('melodias', () => {
  it('le nome, oitava e duracao', () => {
    const [la, fa, si] = notas('A4 F#5-3 Bb3-.5');
    expect(la).toEqual({ freq: 440, tempos: 1 });
    expect(fa.freq).toBeCloseTo(739.99, 1);
    expect(fa.tempos).toBe(3);
    expect(si.freq).toBeCloseTo(233.08, 1);
    expect(si.tempos).toBe(0.5);
    expect(() => notas('H4')).toThrow();
  });

  it('gymnopedie: compassos 5 a 39 inteiros (35 x 3/4, menos as duas pausas de entrada)', () => {
    expect(soma(GYMNOPEDIE.flat())).toBe(35 * 3 - 2);
  });

  it('cancao de ninar: 16 compassos de 3/4 contando a anacruse', () => {
    expect(soma(CANCAO_DE_NINAR)).toBe(16 * 3);
  });
});
