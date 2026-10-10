import { mundoPago } from './compras';
import { MUNDOS } from './config';
import { mundoCompleto } from './missions';
import type { Perfil } from './storage';
import { HISTORIAS, type Historia } from './stories';
import { JOGUINHOS, type Joguinho } from './joguinhos';

/**
 * O que a crianca ja abriu.
 *
 * Nao guarda estado novo: fechar um mundo ja fica registrado nas missoes do
 * perfil, e historinha e joguinho saem dai. Assim nao ha o que migrar, nao ha
 * como desencontrar e quem ja jogou nao perde nada.
 *
 * Uma vez aberto, fica aberto para sempre: ouvir de novo ou jogar de novo nao
 * gasta ficha, nao da estrela e nao pede para refazer missao.
 */

/** Em desenvolvimento tudo abre: da para testar sem fechar o jogo inteiro. */
const TESTE = import.meta.env.DEV;

export function mundosConcluidos(p: Perfil): number[] {
  return MUNDOS.filter((m) => mundoCompleto(m.id, p.missoes)).map((m) => m.id);
}

/** Mundo fechado pela crianca e que ela tem direito de ver (livre ou comprado). */
function abertos(p: Perfil): number[] {
  if (TESTE) return MUNDOS.map((m) => m.id);
  return mundosConcluidos(p).filter((id) => !mundoPago(id));
}

export const historiasLiberadas = (p: Perfil): Historia[] => {
  const tem = abertos(p);
  return HISTORIAS.filter((h) => tem.includes(h.mundo));
};

/**
 * Mundo em que a crianca ja pode entrar: o anterior fechado e a compra feita.
 * E a mesma regra do mapa. O joguinho do mundo abre junto com o mundo, nao so
 * no fim dele -- quem chegou ali tem direito de jogar quando quiser.
 */
function disponiveis(p: Perfil): number[] {
  if (TESTE) return MUNDOS.map((m) => m.id);
  const concluidos = mundosConcluidos(p);
  return MUNDOS.filter((m) => (m.id === 1 || concluidos.includes(m.id - 1)) && !mundoPago(m.id)).map(
    (m) => m.id,
  );
}

export const joguinhosLiberados = (p: Perfil): Joguinho[] => {
  const tem = disponiveis(p);
  return JOGUINHOS.filter((j) => tem.includes(j.mundo));
};

/** Vale para o cartao na biblioteca: mostra colorido ou silhueta com cadeado. */
export const historiaAberta = (p: Perfil, h: Historia) => abertos(p).includes(h.mundo);
export const joguinhoAberto = (p: Perfil, j: Joguinho) => disponiveis(p).includes(j.mundo);

/** Texto do cadeado: ou falta fechar o mundo, ou falta a compra. */
export function porQueFechado(p: Perfil, mundo: number) {
  if (mundoPago(mundo)) return 'Peça para um adulto abrir';
  const anterior = MUNDOS.find((x) => x.id === mundo - 1);
  return anterior ? `Termine o mundo ${anterior.id} - ${anterior.nome}` : 'Ainda não abriu';
}
