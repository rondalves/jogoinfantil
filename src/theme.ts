import Phaser from 'phaser';

/**
 * Paleta e tipografia unicas do jogo. Toda tela puxa daqui: para mudar a cara
 * do jogo inteiro basta mexer neste arquivo.
 *
 * Tons neutros e quentes de proposito: a arte das missoes ja e colorida, e a
 * interface precisa sair da frente dela.
 */
export const TEMA = {
  /** Lexend: desenhada para quem esta aprendendo a ler. */
  fonte: '"Lexend", "Segoe UI", system-ui, sans-serif',

  // texto
  texto: '#3a3f45',
  textoSuave: '#8a9099',
  textoClaro: '#ffffff',
  contorno: '#ffffff',

  // fundos
  ceu: 0xf3f1ec,
  creme: 0xf7f5f1,
  rosa: 0xf4f1ee,
  nuvem: 0xf7f5f1,
  escuro: 0x2e3338,
  painel: 0xffffff,

  // botoes
  acao: 0xe6b887,
  sim: 0x9cbfa6,
  nao: 0xd9a3a0,
  neutro: 0xd9d4cc,

  // premios
  moeda: 0xe3b23c,
  estrela: 0xe3b23c,
  confete: [0xe6b887, 0x9cbfa6, 0xd9a3a0, 0xe3b23c, 0xb9c6d4, 0xc9bcd4],

  // tamanhos de fonte (px)
  titulo: 54,
  texto_: 42,
  botao: 42,
  pequeno: 32,

  /** duracao padrao das transicoes entre telas */
  transicao: 220,

  /** quanto o cenario some atras dos cartoes e do texto */
  veu: 0.55,
};

export const cor = (n: number) => `#${n.toString(16).padStart(6, '0')}`;

/**
 * Faz todo `cena.add.text` nascer com a fonte e a cor do tema, sem precisar
 * repetir o estilo em cada tela. Estilo passado na chamada continua ganhando.
 */
export function aplicarTema() {
  const fabrica = Phaser.GameObjects.GameObjectFactory.prototype as unknown as {
    text: (x: number, y: number, t: string | string[], e?: object) => Phaser.GameObjects.Text;
  };
  const original = fabrica.text;
  fabrica.text = function (x, y, t, estilo) {
    return original.call(this, x, y, t, { fontFamily: TEMA.fonte, color: TEMA.texto, ...estilo });
  };
}

/** Espera a fonte carregar para o texto nao nascer com a fonte do sistema. */
export async function carregarFonte() {
  try {
    await Promise.race([
      Promise.all([document.fonts.load('500 40px Lexend'), document.fonts.load('700 54px Lexend')]),
      new Promise((ok) => setTimeout(ok, 2500)),
    ]);
  } catch {
    // sem a fonte o jogo roda com a do sistema
  }
}
