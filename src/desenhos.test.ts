import { describe, expect, it } from 'vitest';
import { DESENHOS, dentro, elipse, parteTocada } from './desenhos';

describe('desenhos de colorir', () => {
  it('acha a parte de cima quando duas se sobrepoem', () => {
    const raposa = DESENHOS.find((d) => d.id === 'raposinha')!;
    // a barriga fica por cima do corpo: o toque no meio pinta a barriga
    expect(raposa.partes[parteTocada(raposa, 0, 160)].nome).toBe('barriga');
    expect(raposa.partes[parteTocada(raposa, 110, 120)].nome).toBe('corpo');
    expect(parteTocada(raposa, -290, 290)).toBe(-1);
  });

  it('sabe se o ponto esta dentro de uma elipse girada', () => {
    const e = elipse(0, 0, 100, 20, 90);
    expect(dentro(e, 0, 80)).toBe(true);
    expect(dentro(e, 80, 0)).toBe(false);
  });

  it('todo desenho cabe na caixa de 600x600', () => {
    for (const d of DESENHOS) {
      for (const p of d.partes) {
        for (const [x, y] of p.pontos) {
          expect(Math.abs(x)).toBeLessThanOrEqual(300);
          expect(Math.abs(y)).toBeLessThanOrEqual(300);
        }
      }
    }
  });
});
