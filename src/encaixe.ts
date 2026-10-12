/**
 * Regras do joguinho de encaixar (estilo Tetris), sem desenho: o tabuleiro,
 * as pecas, girar, encaixar e apagar linha cheia. A cena e scenes/Encaixe.ts.
 */

export const COLUNAS = 8;
export const LINHAS = 14;

/** Cada peca e uma lista de celulas [coluna, linha] na posicao inicial. */
export const PECAS: [number, number][][] = [
  [[0, 1], [1, 1], [2, 1], [3, 1]], // I
  [[0, 0], [1, 0], [0, 1], [1, 1]], // O
  [[1, 0], [0, 1], [1, 1], [2, 1]], // T
  [[1, 0], [2, 0], [0, 1], [1, 1]], // S
  [[0, 0], [1, 0], [1, 1], [2, 1]], // Z
  [[0, 0], [0, 1], [1, 1], [2, 1]], // J
  [[2, 0], [0, 1], [1, 1], [2, 1]], // L
];

/** null = vazio; numero = cor da peca que ficou ali */
export type Tabuleiro = (number | null)[][];

export interface Peca {
  tipo: number;
  celulas: [number, number][];
  /** onde a peca esta: soma com cada celula */
  col: number;
  lin: number;
}

export const tabuleiroVazio = (): Tabuleiro => Array.from({ length: LINHAS }, () => Array(COLUNAS).fill(null));

export function novaPeca(tipo: number): Peca {
  return { tipo, celulas: PECAS[tipo].map(([c, l]) => [c, l]), col: Math.floor(COLUNAS / 2) - 2, lin: 0 };
}

/** Celulas da peca ja no tabuleiro. */
export const ocupadas = (p: Peca) => p.celulas.map(([c, l]) => [c + p.col, l + p.lin] as [number, number]);

export function cabe(t: Tabuleiro, p: Peca): boolean {
  return ocupadas(p).every(([c, l]) => c >= 0 && c < COLUNAS && l < LINHAS && (l < 0 || t[l][c] === null));
}

export function mover(t: Tabuleiro, p: Peca, dc: number, dl: number): Peca | null {
  const q = { ...p, col: p.col + dc, lin: p.lin + dl };
  return cabe(t, q) ? q : null;
}

/**
 * Gira 90 graus no sentido do relogio. Encostada na parede, tenta empurrar
 * um pouco para o lado: a crianca toca para girar e a peca gira, sem erro.
 */
export function girar(t: Tabuleiro, p: Peca): Peca | null {
  if (p.tipo === 1) return p; // o quadrado nao muda girando
  const tam = p.tipo === 0 ? 4 : 3;
  const celulas = p.celulas.map(([c, l]) => [tam - 1 - l, c] as [number, number]);
  for (const empurra of [0, -1, 1, -2, 2]) {
    const q = { ...p, celulas, col: p.col + empurra };
    if (cabe(t, q)) return q;
  }
  return null;
}

/** Onde a peca para se cair direto (a sombra que mostra o encaixe). */
export function queda(t: Tabuleiro, p: Peca): Peca {
  let q = p;
  for (let n = mover(t, q, 0, 1); n; n = mover(t, q, 0, 1)) q = n;
  return q;
}

/** Fixa a peca e apaga as linhas cheias. Devolve o tabuleiro novo e quais linhas sumiram. */
export function encaixar(t: Tabuleiro, p: Peca): { tabuleiro: Tabuleiro; apagadas: number[] } {
  const novo = t.map((linha) => [...linha]);
  for (const [c, l] of ocupadas(p)) if (l >= 0) novo[l][c] = p.tipo;
  const apagadas = novo.flatMap((linha, i) => (linha.every((x) => x !== null) ? [i] : []));
  const fica = novo.filter((_, i) => !apagadas.includes(i));
  const vazias = Array.from({ length: apagadas.length }, () => Array(COLUNAS).fill(null));
  return { tabuleiro: [...vazias, ...fica], apagadas };
}
