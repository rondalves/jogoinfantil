/**
 * Quem joga junto: a mamae ou o papai. Escolhido na primeira vez que o jogo
 * abre (cena QuemJoga) e trocado no painel dos pais. Muda o rosto do adulto
 * nas cenas (a travessia, "chamar um adulto") e o jeito de chamar nos textos:
 * "chame um adulto" vira "chame a mamae". Fica no aparelho, fora dos perfis.
 */
export type QuemJoga = 'mae' | 'pai';

const CHAVE = 'missoes-do-dia:adulto';

export function quemJoga(): QuemJoga | null {
  try {
    const q = localStorage.getItem(CHAVE);
    return q === 'mae' || q === 'pai' ? q : null;
  } catch {
    return null;
  }
}

export function definirQuemJoga(q: QuemJoga) {
  try {
    localStorage.setItem(CHAVE, q);
  } catch {
    /* sem armazenamento: vale so ate fechar */
  }
}

/** Nome para a tela: "Mamãe" ou "Papai". */
export const nomeAdulto = (q: QuemJoga) => (q === 'mae' ? 'Mamãe' : 'Papai');

/**
 * Puro: troca "um adulto", "o adulto", "do adulto" pela mamae ou pelo papai.
 * Frase de regra geral sem artigo ("so adulto pode mexer") fica como esta.
 */
export function comAdulto(texto: string, q: QuemJoga | null): string {
  if (!q) return texto;
  const mae = q === 'mae';
  return texto
    .replace(/\bum adulto\b/g, mae ? 'a mamãe' : 'o papai')
    .replace(/\bdo adulto\b/g, mae ? 'da mamãe' : 'do papai')
    .replace(/\bO adulto\b/g, mae ? 'A mamãe' : 'O papai')
    .replace(/\bo adulto\b/g, mae ? 'a mamãe' : 'o papai');
}
