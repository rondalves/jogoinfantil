import { describe, expect, it } from 'vitest';
import { cabe, COLUNAS, encaixar, girar, LINHAS, mover, novaPeca, ocupadas, queda, tabuleiroVazio } from './encaixe';

describe('joguinho de encaixar', () => {
  it('a peca cai ate o fundo e nao atravessa o chao', () => {
    const t = tabuleiroVazio();
    const p = queda(t, novaPeca(1));
    expect(Math.max(...ocupadas(p).map(([, l]) => l))).toBe(LINHAS - 1);
    expect(mover(t, p, 0, 1)).toBeNull();
  });

  it('nao sai pelas paredes', () => {
    const t = tabuleiroVazio();
    let p = novaPeca(0);
    for (let i = 0; i < 10; i++) p = mover(t, p, -1, 0) ?? p;
    expect(Math.min(...ocupadas(p).map(([c]) => c))).toBe(0);
  });

  it('girar encostado na parede empurra a peca para dentro', () => {
    const t = tabuleiroVazio();
    let p = novaPeca(0);
    p = girar(t, p)!;
    for (let i = 0; i < 10; i++) p = mover(t, p, 1, 0) ?? p;
    const g = girar(t, p);
    expect(g).not.toBeNull();
    expect(cabe(t, g!)).toBe(true);
  });

  it('linha cheia some e o resto desce', () => {
    const t = tabuleiroVazio();
    // fundo cheio menos as duas ultimas colunas; um quadrado fecha a linha
    for (let c = 0; c < COLUNAS - 2; c++) t[LINHAS - 1][c] = 3;
    t[LINHAS - 2][0] = 5;
    const p = queda(t, { ...novaPeca(1), col: COLUNAS - 2 });
    const { tabuleiro, apagadas } = encaixar(t, p);
    expect(apagadas).toEqual([LINHAS - 1]);
    expect(tabuleiro[LINHAS - 1][0]).toBe(5);
    expect(tabuleiro[LINHAS - 1][COLUNAS - 1]).toBe(1);
    expect(tabuleiro.length).toBe(LINHAS);
  });
});
