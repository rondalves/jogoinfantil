import { describe, expect, it } from 'vitest';
import { remapear, remapearCabelo } from './migracao';

describe('migracao dos ids antigos', () => {
  it('leva a estrela para o numero novo da missao', () => {
    expect(remapear({ '13': 3, '14': 2, '20': 1 })).toEqual({ '28': 3, '15': 2, '27': 1 });
  });

  it('nao mexe em quem nao mudou de numero', () => {
    expect(remapear({ '01': 3, '12': 2 })).toEqual({ '01': 3, '12': 2 });
  });

  it('deixa inerte o id de missao que saiu do jogo', () => {
    expect(remapear({ '01': 3, '19': 2 })).toEqual({ '01': 3, '19': 2 });
  });

  it('rodar duas vezes da o mesmo resultado', () => {
    const uma = remapear({ '13': 3, '14': 2, '01': 1 });
    expect(remapear(uma)).toEqual(uma);
  });

  it('quando dois ids caem no mesmo, fica a melhor estrela', () => {
    // o 14 virou 15 e ja havia um 15: fica a melhor das duas
    expect(remapear({ '14': 2, '15': 3 })).toEqual({ '15': 3 });
  });
});

describe('remapearCabelo', () => {
  it('mantem o mesmo penteado depois que a lista cresceu', () => {
    expect(remapearCabelo(0)).toBe(0); // cacheado
    expect(remapearCabelo(7)).toBe(8); // coque: entrou a tranca unica antes dele
    expect(remapearCabelo(18)).toBe(20); // menino_risco: entraram tranca unica e degrade
    expect(remapearCabelo(20)).toBe(29); // careca continua no fim
  });
});
