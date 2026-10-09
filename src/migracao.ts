import { listar, salvar } from './storage';

/**
 * Conserta o progresso de quem jogou antes da reorganizacao em seis mundos.
 *
 * A renumeracao mudou o significado de alguns ids: o 13 era "Almocar" e hoje e
 * "Chegar em casa". Sem isso, quem ja jogou veria missoes marcadas como feitas
 * que nunca fez, e perderia as que fez de verdade.
 *
 * Nao tira nada de ninguem: broche e bonus ja ganhos ficam como estao. O unico
 * efeito e a estrela ir para a missao certa.
 */

/** id antigo -> id novo. Quem nao esta aqui nao mudou de numero. */
const RENUMERADAS: Record<string, string> = {
  '13': '28', // Almocar virou bonus de fim de semana
  '14': '15', // Licao de casa
  '20': '27', // Dia do doutor e do dentista
};

const MARCA = 'missoes-do-dia:migracao';
export const VERSAO = 2;

/** Puro, para o teste: aplica a renumeracao num mapa de estrelas. */
export function remapear(missoes: Record<string, number>): Record<string, number> {
  const saida: Record<string, number> = {};
  for (const [id, estrelas] of Object.entries(missoes)) {
    // nada e apagado: id que nao existe mais fica inerte, e id que colide
    // (o 14 virando 15) fica com a melhor estrela. Assim rodar duas vezes
    // da o mesmo resultado e ninguem perde progresso.
    const novo = RENUMERADAS[id] ?? id;
    saida[novo] = Math.max(saida[novo] ?? 0, estrelas);
  }
  return saida;
}

function jaFoi() {
  try {
    return Number(localStorage.getItem(MARCA) ?? 0) >= VERSAO;
  } catch {
    return true; // sem localStorage nao ha progresso antigo para consertar
  }
}

/** Chamada uma vez na abertura do jogo. */
export function migrar() {
  if (jaFoi()) return;
  for (const p of listar()) {
    p.missoes = remapear(p.missoes ?? {});
    salvar(p);
  }
  try {
    localStorage.setItem(MARCA, String(VERSAO));
  } catch {
    /* sem onde marcar: na proxima abertura roda de novo, e e idempotente */
  }
}
