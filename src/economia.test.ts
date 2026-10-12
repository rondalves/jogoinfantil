import { describe, expect, it } from 'vitest';
import { CONFIG } from './config';
import { novoPerfil, personagemPadrao } from './storage';
import {
  bonusMundo,
  concluirMissao,
  estrelas,
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

describe('moedas e estrelas', () => {
  it('missão dá 1 moeda', () => {
    const p = perfil();
    expect(concluirMissao(p, '01', 0, 3)).toBe(3);
    expect(p.moedas).toBe(CONFIG.MOEDAS_POR_MISSAO);
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
