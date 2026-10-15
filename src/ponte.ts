import { CONFIG } from './config';
import type { Perfil } from './storage';

/** Depois do jogo vem a vida real: a missao fica pendente ate a crianca dizer que fez. */
export function marcarPendente(p: Perfil, id: string) {
  p.pendentes ??= [];
  if (!p.pendentes.includes(id)) p.pendentes.push(id);
}

/** Tira a missao da lista de pendentes. Devolve a moeda: so a primeira confirmacao do dia paga. */
export function confirmarReal(p: Perfil, id: string, dia: string): number {
  p.pendentes = (p.pendentes ?? []).filter((x) => x !== id);
  if (p.real?.[id] === dia) return 0;
  (p.real ??= {})[id] = dia;
  p.moedas += CONFIG.MOEDAS_FIZ;
  return CONFIG.MOEDAS_FIZ;
}

/** Conta mais uma missao jogada hoje (volta a 1 no dia seguinte) e devolve o total do dia. */
export function contarHoje(p: Perfil, dia: string): number {
  p.hoje = p.hoje?.dia === dia ? { dia, n: p.hoje.n + 1 } : { dia, n: 1 };
  return p.hoje.n;
}
