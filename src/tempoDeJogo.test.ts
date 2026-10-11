import { describe, expect, it } from 'vitest';
import { EXTRA_MIN, estourou, liberarMais, somar } from './tempoDeJogo';

const MIN = 60_000;

describe('tempo de joguinho', () => {
  it('soma no mesmo dia e zera quando o dia muda', () => {
    const a = somar(undefined, '2026-10-11', 5 * MIN);
    expect(somar(a, '2026-10-11', MIN).ms).toBe(6 * MIN);
    expect(somar(a, '2026-10-12', MIN)).toEqual({ dia: '2026-10-12', ms: MIN, extra: 0 });
  });

  it('avisa so depois do limite, e o dia seguinte comeca livre', () => {
    const t = { dia: '2026-10-11', ms: 15 * MIN, extra: 0 };
    expect(estourou(t, '2026-10-11', 20)).toBe(false);
    expect(estourou(t, '2026-10-11', 15)).toBe(true);
    expect(estourou(t, '2026-10-12', 15)).toBe(false);
  });

  it('o adulto libera mais um pouco, contado a partir de agora', () => {
    const t = { dia: '2026-10-11', ms: 15 * MIN, extra: 0 };
    const liberado = liberarMais(t, '2026-10-11', 15);
    expect(estourou(liberado, '2026-10-11', 15)).toBe(false);
    expect(estourou(somar(liberado, '2026-10-11', EXTRA_MIN * MIN), '2026-10-11', 15)).toBe(true);
  });
});
