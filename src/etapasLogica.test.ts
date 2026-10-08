import { describe, expect, it } from 'vitest';
import { Cronometro, Esfrega } from './etapasLogica';

describe('segurar_com_timer', () => {
  it('nao anda enquanto a crianca nao segura', () => {
    const c = new Cronometro(10);
    c.avancar(5);
    expect(c.progresso).toBe(0);
    expect(c.faltam).toBe(10);
  });

  it('soma o tempo em varios toques, sem perder o que ja fez', () => {
    const c = new Cronometro(10);
    c.retomar();
    c.avancar(4);
    c.pausar();
    c.avancar(100); // soltou o dedo: esses 100 segundos nao contam
    expect(c.progresso).toBeCloseTo(0.4);
    c.retomar();
    c.avancar(6);
    expect(c.terminou).toBe(true);
    expect(c.faltam).toBe(0);
  });

  it('o relogio arredonda para cima e nunca passa de 100 por cento', () => {
    const c = new Cronometro(120);
    c.retomar();
    c.avancar(0.3);
    expect(c.faltam).toBe(120);
    c.avancar(200);
    expect(c.progresso).toBe(1);
  });

  it('timer de zero segundo ja nasce fechado, sem divisao por zero', () => {
    const c = new Cronometro(0);
    expect(c.progresso).toBe(1);
    expect(c.terminou).toBe(true);
  });
});

describe('esfregar', () => {
  it('precisa de caminho suficiente para limpar um pedaco', () => {
    const e = new Esfrega(3, 140);
    expect(e.mover(50, 0)).toBe(false);
    expect(e.mover(50, 0)).toBe(false);
    expect(e.mover(50, 0)).toBe(true);
    expect(e.limpos).toBe(1);
    expect(e.faltam).toBe(2);
  });

  it('conta na diagonal e guarda a sobra para o proximo pedaco', () => {
    const e = new Esfrega(2, 100);
    expect(e.mover(60, 80)).toBe(true); // 100 exatos
    expect(e.mover(99, 0)).toBe(false);
    expect(e.mover(2, 0)).toBe(true); // 1 de sobra + 99 + 2
    expect(e.completo).toBe(true);
  });

  it('para de contar depois de limpar tudo', () => {
    const e = new Esfrega(1, 10);
    expect(e.mover(20, 0)).toBe(true);
    expect(e.mover(500, 500)).toBe(false);
    expect(e.limpos).toBe(1);
    expect(e.faltam).toBe(0);
  });
});
