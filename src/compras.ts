import { CONFIG } from './config';

/**
 * Compra unica que abre os mundos de cima.
 *
 * O jogo continua sem anuncio, sem assinatura e sem moeda comprada: e uma
 * compra so, feita pelo adulto dentro da area protegida pela conta de
 * matematica. A crianca nunca ve preco nem botao de comprar.
 *
 * O recibo fica no aparelho, fora do perfil: quem pagou pagou pela familia
 * inteira, nao por um personagem.
 */

const CHAVE = 'missoes-do-dia:compra';

/** Produto cadastrado no Play Console (compra unica, nao consumivel). */
export const PRODUTO = 'rotininha.mundos.completos';

export const PRECO = 'R$ 1,99';

/** Ponte opcional com a loja; so existe no aparelho, nunca no navegador. */
interface Loja {
  comprar(produto: string): Promise<boolean>;
  restaurar(produto: string): Promise<boolean>;
}

function loja(): Loja | undefined {
  return (globalThis as unknown as { RotininhaLoja?: Loja }).RotininhaLoja;
}

export const lojaDisponivel = () => loja() !== undefined;

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
  return mundo > CONFIG.MUNDOS_LIVRES && !temTudo();
}

/** Abre a compra na loja. Devolve false quando nao deu (ou foi cancelada). */
export async function comprar(): Promise<boolean> {
  const l = loja();
  if (!l) return false;
  const ok = await l.comprar(PRODUTO).catch(() => false);
  if (ok) guardar();
  return ok;
}

/** Quem ja pagou e trocou de aparelho recupera por aqui. */
export async function restaurar(): Promise<boolean> {
  const l = loja();
  if (!l) return false;
  const ok = await l.restaurar(PRODUTO).catch(() => false);
  if (ok) guardar();
  return ok;
}
