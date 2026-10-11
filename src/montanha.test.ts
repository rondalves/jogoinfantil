import { describe, expect, it } from 'vitest';
import { CHAO, chao, INCLINACAO_MAX, inclinacao } from './montanha';

describe('relevo da montanha', () => {
  it('comeca plano', () => {
    expect(chao(0)).toBe(CHAO);
    expect(chao(500)).toBe(CHAO);
  });

  it('a rampa nunca passa do que a moto consegue subir', () => {
    // a moto acelera a 900 px/s2 e a gravidade e 1100: sobe ate ~55 graus
    expect(Math.atan(INCLINACAO_MAX)).toBeLessThan((50 * Math.PI) / 180);
    for (let x = 0; x < 60000; x += 7) expect(Math.abs(inclinacao(x))).toBeLessThanOrEqual(INCLINACAO_MAX + 0.05);
  });

  it('e uma montanha: la na frente o chao esta bem mais alto', () => {
    expect(chao(20000)).toBeLessThan(CHAO - 600);
  });
});
