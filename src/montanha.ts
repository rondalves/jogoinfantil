/**
 * O relevo do joguinho da moto: altura do chao em cada x (y cresce para
 * baixo, como na tela). Comeca plano, vai ondulando cada vez mais e sobe aos
 * poucos -- e uma montanha. A rampa nunca passa de INCLINACAO_MAX, entao a
 * moto sempre consegue subir acelerando.
 */

/** y do chao no inicio. */
export const CHAO = 900;
/** tamanho do trecho plano da largada */
const PLANO = 520;
/** quanto a montanha sobe por pixel andado (alem das ondas) */
const SUBIDA = 0.06;
/** onda mais alta, ja la na frente */
const ONDA_MAX = 78;

/** Rampa mais inclinada que o relevo consegue ter (dy/dx). */
export const INCLINACAO_MAX = ONDA_MAX * (0.6 / 310 + 0.3 / 137 + 0.25 / 71) + SUBIDA;

/** De 0 a 1: as ondas crescem devagar depois da largada. */
function forca(x: number) {
  return Math.min(1, Math.max(0, (x - PLANO) / 2400));
}

export function chao(x: number): number {
  if (x <= PLANO) return CHAO;
  const d = x - PLANO;
  const a = 18 + (ONDA_MAX - 18) * forca(x);
  // a rampa de entrada suaviza o comeco das ondas e da subida
  const entrada = Math.min(1, d / 400);
  const ondas = 0.6 * Math.sin(d / 310) + 0.3 * Math.sin(d / 137 + 1.3) + 0.25 * Math.sin(d / 71 + 0.4);
  return CHAO - entrada * (a * ondas + SUBIDA * d);
}

/** Inclinacao do chao (dy/dx) em x. */
export function inclinacao(x: number, h = 2): number {
  return (chao(x + h) - chao(x - h)) / (2 * h);
}
