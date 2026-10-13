import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { encaixou, NIVEIS, nivelParaAbrir, pecas } from './quebraCabeca';

describe('quebra-cabeca', () => {
  it('sao dez niveis, de 2 a 25 pecas, sempre crescendo', () => {
    expect(NIVEIS).toHaveLength(10);
    expect(pecas(NIVEIS[0])).toBe(2);
    expect(pecas(NIVEIS[9])).toBe(25);
    NIVEIS.slice(1).forEach((n, i) => expect(pecas(n)).toBeGreaterThan(pecas(NIVEIS[i])));
  });

  it('cada nivel tem figura propria e ela existe', () => {
    expect(new Set(NIVEIS.map((n) => n.imagem)).size).toBe(NIVEIS.length);
    for (const n of NIVEIS) {
      expect(['jpg', 'png'].some((e) => existsSync(`assets/img/${n.imagem}.${e}`)), n.imagem).toBe(true);
    }
  });

  it('encaixa perto do lugar e nao longe dele', () => {
    expect(encaixou(20, -15, 100, 100)).toBe(true);
    expect(encaixou(40, 0, 100, 100)).toBe(false);
  });

  it('abre o proximo nivel e recomeca depois do ultimo', () => {
    expect(nivelParaAbrir()).toBe(1);
    expect(nivelParaAbrir(3)).toBe(4);
    expect(nivelParaAbrir(10)).toBe(1);
  });
});
