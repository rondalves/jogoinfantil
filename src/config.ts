export const CONFIG = {
  FICHAS_POR_PARTIDA: 1,
  FICHAS_POR_MOEDA: 3,
  MOEDAS_POR_MISSAO: 1,
  MOEDAS_BONUS_MUNDO: 5,
  PARTIDAS_POR_DIA: 5,

  /** pagina publica da politica de privacidade (docs/privacidade.html no GitHub Pages) */
  URL_PRIVACIDADE: 'https://rondalves.github.io/jogoinfantil/privacidade.html',

  LARGURA: 720,
  ALTURA: 1280,
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
