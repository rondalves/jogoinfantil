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
export const VERSAO = 3;

/**
 * O perfil guarda o penteado pela posicao na lista do criador, e a lista so
 * mostra penteado com arte. Com o personagem desenhado por codigo entraram
 * "tranca_unica", "menino_degrade" e sete cortes de menino: a posicao antiga
 * apontaria para outro penteado. Fotos das duas listas, na ordem do criador.
 */
const CABELOS_ANTES = [
  'cacheado', 'crespo', 'ondulado', 'enrolado', 'liso_longo', 'liso_curto', 'trancas', 'coque',
  'maria_chiquinha', 'box_braids', 'dreads', 'menino_curto', 'menino_cacheado', 'menino_crespo',
  'menino_black_power', 'menino_espetado', 'menino_tigelinha', 'menino_raspado', 'menino_risco',
  'menino_moicano', 'careca',
];
const CABELOS_AGORA = [
  'cacheado', 'crespo', 'ondulado', 'enrolado', 'liso_longo', 'liso_curto', 'trancas', 'tranca_unica',
  'coque', 'maria_chiquinha', 'box_braids', 'dreads', 'menino_curto', 'menino_cacheado', 'menino_crespo',
  'menino_black_power', 'menino_espetado', 'menino_tigelinha', 'menino_raspado', 'menino_degrade',
  'menino_risco', 'menino_moicano', 'menino_social', 'menino_topete', 'menino_militar', 'menino_franjinha',
  'menino_para_tras', 'menino_ondulado', 'menino_nago', 'careca',
];

/** Puro, para o teste: posicao na lista antiga -> posicao do mesmo penteado na nova. */
export function remapearCabelo(i: number): number {
  const id = CABELOS_ANTES[((i % CABELOS_ANTES.length) + CABELOS_ANTES.length) % CABELOS_ANTES.length];
  return Math.max(0, CABELOS_AGORA.indexOf(id));
}

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

function versaoSalva() {
  try {
    return Number(localStorage.getItem(MARCA) ?? 0);
  } catch {
    return VERSAO; // sem localStorage nao ha progresso antigo para consertar
  }
}

/** Chamada uma vez na abertura do jogo. */
export function migrar() {
  const feita = versaoSalva();
  if (feita >= VERSAO) return;
  for (const p of listar()) {
    if (feita < 2) p.missoes = remapear(p.missoes ?? {});
    // o remapeamento do cabelo nao pode rodar duas vezes: so quem veio de antes
    if (feita < 3 && p.personagem) p.personagem.cabelo = remapearCabelo(p.personagem.cabelo ?? 0);
    salvar(p);
  }
  try {
    localStorage.setItem(MARCA, String(VERSAO));
  } catch {
    /* sem onde marcar: na proxima abertura roda de novo, e e idempotente */
  }
}
