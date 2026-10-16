import { Capacitor, registerPlugin } from '@capacitor/core';
import { CONFIG } from './config';

/**
 * Compra unica que abre os mundos de cima.
 *
 * O jogo continua sem anuncio, sem assinatura e sem moeda comprada: e uma
 * compra so, feita pelo adulto dentro da area protegida pela conta de
 * matematica. A crianca nunca ve preco nem botao de comprar.
 *
 * O recibo fica no aparelho, fora do perfil: quem pagou pagou pela familia
 * inteira, nao por um personagem. Quem trocou de celular recupera pela conta
 * da Play Store ("restaurar").
 */

const CHAVE = 'missoes-do-dia:compra';

/** Produto cadastrado no Play Console (compra unica, nao consumivel). */
export const PRODUTO = 'rotinafeliz.mundos.completos';

export const PRECO = 'R$ 4,99';

/** A loja de verdade: LojaPlugin.java, so no app instalado pela Play. */
interface Loja {
  comprar(opcoes: { produto: string }): Promise<{ ok: boolean }>;
  restaurar(opcoes: { produto: string }): Promise<{ ok: boolean }>;
}
const Loja = registerPlugin<Loja>('Loja');

export const lojaDisponivel = () => Capacitor.isPluginAvailable('Loja');

export function temTudo() {
  try {
    return localStorage.getItem(CHAVE) === 'ok';
  } catch {
    return false;
  }
}

function guardar() {
  try {
    localStorage.setItem(CHAVE, 'ok');
  } catch {
    // sem localStorage o jogo segue; so nao lembra da compra
  }
}

/** Mundo livre, ou mundo de cima com a compra feita. */
export function mundoPago(mundo: number) {
  return !CONFIG.BETA_TUDO_ABERTO && mundo > CONFIG.MUNDOS_LIVRES && !temTudo();
}

async function naLoja(acao: 'comprar' | 'restaurar'): Promise<boolean> {
  if (!lojaDisponivel()) return false;
  const { ok } = await Loja[acao]({ produto: PRODUTO }).catch(() => ({ ok: false }));
  if (ok) guardar();
  return ok;
}

/** Abre a compra na loja. Devolve false quando nao deu (ou foi cancelada). */
export const comprar = () => naLoja('comprar');

/** Quem ja pagou e trocou de aparelho recupera pela conta da Play Store. */
export const restaurar = () => naLoja('restaurar');
