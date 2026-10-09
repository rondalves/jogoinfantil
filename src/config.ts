/**
 * Celular comprido, celular curto e tablet tem proporcoes bem diferentes.
 * O jogo desenha sempre numa caixa de 720x1280 e estica a altura do canvas
 * ate a proporcao do aparelho, para a tela encher sem tarja preta. A caixa
 * fica centrada na vertical; o cenario e os veus cobrem tudo.
 */
function alturaDaTela() {
  const w = typeof window === 'undefined' ? 0 : window.innerWidth;
  const h = typeof window === 'undefined' ? 0 : window.innerHeight;
  if (w <= 0 || h <= 0) return 1280;
  // nunca menor que a caixa de desenho, nem tao comprida que o dedo nao alcance
  return Math.round(Math.min(1920, Math.max(1280, (720 * h) / w)));
}

export const CONFIG = {
  FICHAS_POR_PARTIDA: 1,
  FICHAS_POR_MOEDA: 3,
  MOEDAS_POR_MISSAO: 1,
  MOEDAS_BONUS_MUNDO: 5,
  PARTIDAS_POR_DIA: 5,

  /** pagina publica da politica de privacidade (docs/privacidade.html no GitHub Pages) */
  URL_PRIVACIDADE: 'https://rondalves.github.io/jogoinfantil/privacidade.html',

  LARGURA: 720,
  /** caixa de desenho: toda posicao fixa do jogo foi pensada nesta altura */
  DESENHO: 1280,
  /** altura real da tela do aparelho, em unidades do jogo */
  ALTURA: alturaDaTela(),
  /** sobra acima e abaixo da caixa de desenho num celular comprido */
  MARGEM: (alturaDaTela() - 1280) / 2,
  MIN_TOQUE: 96,
};

export interface Mundo {
  id: number;
  nome: string;
  icone: string;
  cor: number;
}

export const MUNDOS: Mundo[] = [
  { id: 1, nome: 'Manhã em Casa', icone: '🌅', cor: 0xf0e4d4 },
  { id: 2, nome: 'Escola', icone: '🎒', cor: 0xdfe6ec },
  { id: 3, nome: 'Volta para Casa', icone: '🚗', cor: 0xdfe8df },
  { id: 4, nome: 'Tarde', icone: '🧸', cor: 0xefe2de },
  { id: 5, nome: 'Noite', icone: '🌙', cor: 0xe2e0ea },
];
