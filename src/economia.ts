import { CONFIG } from './config';
import type { Perfil } from './storage';

export const hojeISO = () => new Date().toISOString().slice(0, 10);

/** 0 erros = 3 estrelas, 1 erro = 2, 2+ = 1. Concluir nunca dá zero. */
export function estrelas(erros: number, max = 3): number {
  return Math.max(1, max - erros);
}

export function concluirMissao(p: Perfil, id: string, erros: number, max: number): number {
  const ganhas = estrelas(erros, max);
  p.missoes[id] = Math.max(p.missoes[id] ?? 0, ganhas);
  p.moedas += CONFIG.MOEDAS_POR_MISSAO;
  p.fichas += CONFIG.MOEDAS_POR_MISSAO * CONFIG.FICHAS_POR_MOEDA;
  return ganhas;
}

/** Paga o bônus do mundo uma única vez, quando todas as missões dele estão feitas. */
export function bonusMundo(p: Perfil, mundo: number, idsDoMundo: string[]): number {
  if (idsDoMundo.length === 0) return 0;
  if (p.bonusMundo.includes(mundo)) return 0;
  if (!idsDoMundo.every((id) => p.missoes[id])) return 0;
  p.bonusMundo.push(mundo);
  if (!p.broches.includes(mundo)) p.broches.push(mundo);
  p.moedas += CONFIG.MOEDAS_BONUS_MUNDO;
  p.fichas += CONFIG.MOEDAS_BONUS_MUNDO * CONFIG.FICHAS_POR_MOEDA;
  return CONFIG.MOEDAS_BONUS_MUNDO;
}

export type MotivoJogo = 'ok' | 'sem_fichas' | 'limite';

export function podeJogar(p: Perfil): MotivoJogo {
  if (p.partidas.dia === hojeISO() && p.partidas.n >= p.limiteDiario) return 'limite';
  return p.fichas >= CONFIG.FICHAS_POR_PARTIDA ? 'ok' : 'sem_fichas';
}

export function gastarFicha(p: Perfil): boolean {
  if (podeJogar(p) !== 'ok') return false;
  if (p.partidas.dia !== hojeISO()) p.partidas = { dia: hojeISO(), n: 0 };
  p.partidas.n += 1;
  p.fichas -= CONFIG.FICHAS_POR_PARTIDA;
  p.fichasGastas += CONFIG.FICHAS_POR_PARTIDA;
  return true;
}

export function partidasHoje(p: Perfil): number {
  return p.partidas.dia === hojeISO() ? p.partidas.n : 0;
}

export function estrelasTotais(p: Perfil): number {
  return Object.values(p.missoes).reduce((a, b) => a + b, 0);
}
