import { describe, expect, it } from 'vitest';
import { remapear } from './migracao';

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
