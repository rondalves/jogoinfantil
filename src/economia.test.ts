import { describe, expect, it } from 'vitest';
import { CONFIG } from './config';
import { novoPerfil, personagemPadrao } from './storage';
import {
  bonusMundo,
  concluirMissao,
  estrelas,
  gastarFicha,
  hojeISO,
  podeJogar,
} from './economia';

const perfil = () => novoPerfil('Teste', personagemPadrao());

describe('estrelas', () => {
  it('erro nunca zera a missão', () => {
    expect(estrelas(0)).toBe(3);
    expect(estrelas(1)).toBe(2);
    expect(estrelas(2)).toBe(1);
    expect(estrelas(9)).toBe(1);
  });
});

describe('moedas e fichas', () => {
  it('missão dá 1 moeda = 3 fichas', () => {
    const p = perfil();
    expect(concluirMissao(p, '01', 0, 3)).toBe(3);
    expect(p.moedas).toBe(CONFIG.MOEDAS_POR_MISSAO);
    expect(p.fichas).toBe(CONFIG.FICHAS_POR_MOEDA);
  });

  it('refazer a missão guarda a melhor nota e não duplica estrelas', () => {
    const p = perfil();
    concluirMissao(p, '01', 0, 3);
    concluirMissao(p, '01', 5, 3);
    expect(p.missoes['01']).toBe(3);
  });

  it('bônus de mundo paga uma única vez e exige o mundo todo', () => {
    const p = perfil();
    expect(bonusMundo(p, 1, [])).toBe(0);
    expect(bonusMundo(p, 1, ['01', '02'])).toBe(0);
    concluirMissao(p, '01', 0, 3);
    concluirMissao(p, '02', 0, 3);
    expect(bonusMundo(p, 1, ['01', '02'])).toBe(CONFIG.MOEDAS_BONUS_MUNDO);
    expect(bonusMundo(p, 1, ['01', '02'])).toBe(0);
    expect(p.broches).toEqual([1]);
  });
});

describe('limite diário', () => {
  it('sem fichas não joga, mas nada quebra', () => {
    const p = perfil();
    expect(podeJogar(p)).toBe('sem_fichas');
    expect(gastarFicha(p)).toBe(false);
  });

  it('para no limite do painel dos pais mesmo com fichas sobrando', () => {
    const p = perfil();
    p.fichas = 50;
    p.limiteDiario = 2;
    expect(gastarFicha(p)).toBe(true);
    expect(gastarFicha(p)).toBe(true);
    expect(podeJogar(p)).toBe('limite');
    expect(gastarFicha(p)).toBe(false);
    expect(p.fichas).toBe(48);
  });

  it('vira o dia e libera de novo', () => {
    const p = perfil();
    p.fichas = 5;
    p.limiteDiario = 1;
    gastarFicha(p);
    p.partidas = { dia: '2000-01-01', n: 99 };
    expect(podeJogar(p)).toBe('ok');
    gastarFicha(p);
    expect(p.partidas).toEqual({ dia: hojeISO(), n: 1 });
  });
});
