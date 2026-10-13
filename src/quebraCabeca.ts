/**
 * Quebra-cabeca: dez niveis, de 2 pecas a 25. As figuras sao as ilustracoes
 * do proprio jogo (raposinha, capas das historinhas, cenas das missoes), todas
 * quadradas; as duas da raposinha saem de tools/quebra_cabeca.py.
 */
export interface Nivel {
  imagem: string;
  colunas: number;
  linhas: number;
}

export const NIVEIS: Nivel[] = [
  { imagem: 'quebra_raposinha', colunas: 2, linhas: 1 },
  { imagem: 'capa_historia1', colunas: 3, linhas: 1 },
  { imagem: 'capa_historia3', colunas: 2, linhas: 2 },
  { imagem: 'm01_pnp_certa', colunas: 3, linhas: 2 },
  { imagem: 'capa_historia2', colunas: 4, linhas: 2 },
  { imagem: 'capa_historia4', colunas: 3, linhas: 3 },
  { imagem: 'm06_pnp_certa', colunas: 4, linhas: 3 },
  { imagem: 'capa_historia5', colunas: 4, linhas: 4 },
  { imagem: 'quebra_raposinha_brincar', colunas: 5, linhas: 4 },
  { imagem: 'capa_historia6', colunas: 5, linhas: 5 },
];

export const pecas = (n: Nivel) => n.colunas * n.linhas;

/** Soltou perto o bastante do lugar certo: um terco da peca, folga de dedo de crianca. */
export const encaixou = (dx: number, dy: number, largura: number, altura: number) =>
  Math.abs(dx) < largura / 3 && Math.abs(dy) < altura / 3;

/** Nivel para abrir: o primeiro ainda nao montado; montou todos, recomeca do 1. */
export const nivelParaAbrir = (montados = 0) => (montados >= NIVEIS.length ? 1 : montados + 1);
