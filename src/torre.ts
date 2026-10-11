/** Regra de pouso da Torre de panquecas (scenes/TorrePanquecas.ts). */

/** largura de uma camada */
export const LARG = 250;
/** deslocamento que ainda fica na torre (fracao da largura) */
const TOLERANCIA = 0.45;
/** tao no meio que conta como perfeita, em px */
const PERFEITA = 14;

/** Onde a camada solta para, ou null se ela escorrega da torre. */
export function pousar(xSolta: number, xTopo: number): { x: number; perfeita: boolean } | null {
  const d = Math.abs(xSolta - xTopo);
  if (d <= PERFEITA) return { x: xTopo, perfeita: true };
  if (d <= LARG * TOLERANCIA) return { x: xSolta, perfeita: false };
  return null;
}
