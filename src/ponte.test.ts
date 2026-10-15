import { describe, expect, it } from 'vitest';
import { confirmarReal, contarHoje, marcarPendente } from './ponte';
import { novoPerfil } from './storage';

const perfil = () => novoPerfil('Teste', { pele: 0, olhos: 0, cabelo: 0, corCabelo: 0, roupa: 0, acessorios: [] });

describe('ponte com a vida real', () => {
  it('marca pendente uma vez so e a confirmacao tira da lista', () => {
    const p = perfil();
    marcarPendente(p, '23');
    marcarPendente(p, '23');
    expect(p.pendentes).toEqual(['23']);
    expect(confirmarReal(p, '23', '2026-10-15')).toBe(1);
    expect(p.pendentes).toEqual([]);
  });
  it('paga uma moeda por missao por dia, e de novo no dia seguinte', () => {
    const p = perfil();
    const antes = p.moedas;
    expect(confirmarReal(p, '23', '2026-10-15')).toBe(1);
    expect(confirmarReal(p, '23', '2026-10-15')).toBe(0);
    expect(confirmarReal(p, '23', '2026-10-16')).toBe(1);
    expect(p.moedas).toBe(antes + 2);
  });
  it('conta as missoes do dia e zera no dia seguinte', () => {
    const p = perfil();
    expect(contarHoje(p, '2026-10-15')).toBe(1);
    expect(contarHoje(p, '2026-10-15')).toBe(2);
    expect(contarHoje(p, '2026-10-16')).toBe(1);
  });
});
