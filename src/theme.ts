import Phaser from 'phaser';

/**
 * Paleta e tipografia unicas do jogo. Toda tela puxa daqui: para mudar a cara
 * do jogo inteiro basta mexer neste arquivo.
 */
export const TEMA = {
  /** Fredoka: arredondada e legivel para quem ainda esta aprendendo a ler. */
  fonte: '"Fredoka", "Trebuchet MS", "Segoe UI", sans-serif',

  // texto
  texto: '#2b3a4a',
  textoSuave: '#6b7a8a',
  textoClaro: '#ffffff',
  contorno: '#ffffff',

  // fundos
  ceu: 0xbde8ff,
  creme: 0xfff2e0,
  rosa: 0xffe9f2,
  nuvem: 0xeef2f7,
  escuro: 0x12263a,
  painel: 0xffffff,

  // botoes
  acao: 0xffb43d,
  sim: 0x7ddc8a,
  nao: 0xff9a8b,
  neutro: 0xbfd4e8,

  // premios
  moeda: 0xffd43b,
  estrela: 0xffc93c,
  confete: [0xff6b6b, 0x4dabf7, 0x51cf66, 0xffd43b, 0xf783ac, 0x845ef7],

  // tamanhos de fonte (px)
  titulo: 54,
  texto_: 42,
  botao: 42,
  pequeno: 32,

  /** duracao padrao das transicoes entre telas */
  transicao: 220,
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
      Promise.all([document.fonts.load('600 40px Fredoka'), document.fonts.load('600 60px Fredoka')]),
      new Promise((ok) => setTimeout(ok, 2500)),
    ]);
  } catch {
    // sem a fonte o jogo roda com a do sistema
  }
}
