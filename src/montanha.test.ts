import { describe, expect, it } from 'vitest';
import { CHAO, FASE, GRAVIDADE, inclinacaoMaxima, Montanha, VEL_MAX } from './montanha';

const graus = (r: number) => (Math.atan(Math.abs(r)) * 180) / Math.PI;

describe('relevo da montanha', () => {
  it('a mesma semente da a mesma montanha', () => {
    expect(new Montanha(7).chao(3333)).toBe(new Montanha(7).chao(3333));
  });

  it('comeca plano, com a bandeira da largada', () => {
    const m = new Montanha(1);
    expect(m.chao(0)).toBe(CHAO);
    expect(m.chao(400)).toBe(CHAO);
    expect(m.faseEm(200)).toBe(1);
  });

  it('cada fase e mais ingreme que a anterior, ate o limite', () => {
    for (const semente of [1, 2, 3]) {
      const m = new Montanha(semente);
      for (let fase = 1; fase <= 6; fase++) {
        const ini = m.bandeiras[fase - 1];
        m.chao(ini + 3000);
        const fim = m.bandeiras[fase];
        let max = 0;
        for (let x = ini; x < fim; x += 3) {
          if (m.buracos.some((b) => x > b.x0 - 6 && x < b.x1 + 6)) continue;
          max = Math.max(max, graus(m.inclinacao(x)));
        }
        expect(max).toBeLessThanOrEqual(inclinacaoMaxima(fase) + 1);
      }
    }
  });

  it('buraco so a partir da fase 2, e sempre da para pular acelerando', () => {
    const m = new Montanha(5);
    m.chao(30000);
    expect(m.buracos.length).toBeGreaterThan(0);
    for (const b of m.buracos) {
      expect(m.faseEm(b.x0)).toBeGreaterThanOrEqual(2);
      // a rampa antes do buraco joga a moto para cima; com 85% da
      // velocidade maxima o salto passa do buraco
      const lip = Math.atan(-m.inclinacao(b.x0 - 20));
      const v = VEL_MAX * 0.85;
      const vx = v * Math.cos(lip);
      const vy = v * Math.sin(lip);
      const desce = m.chao(b.x1 + 1) - m.chao(b.x0 - 1);
      const t = (vy + Math.sqrt(vy * vy + 2 * GRAVIDADE * desce)) / GRAVIDADE;
      expect(vx * t).toBeGreaterThan(b.x1 - b.x0);
    }
  });

  it('tronco fica no plano, longe dos buracos', () => {
    const m = new Montanha(7);
    m.chao(FASE * 5);
    expect(m.troncos.length).toBeGreaterThan(0);
    for (const t of m.troncos) {
      expect(Math.abs(m.inclinacao(t))).toBeLessThan(0.01);
      expect(m.buracos.some((b) => t > b.x0 - 100 && t < b.x1 + 100)).toBe(false);
    }
  });

  it('dentro do buraco nao tem chao', () => {
    const m = new Montanha(5);
    m.chao(30000);
    const b = m.buracos[0];
    expect(m.chao((b.x0 + b.x1) / 2)).toBe(Infinity);
  });
});
