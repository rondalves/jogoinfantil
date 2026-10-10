import Phaser from 'phaser';
import { CONFIG } from './config';
import { desenharPersonagem } from './personagem';
import type { PersonagemCfg } from './storage';
import { cobrirTela, figura, nota, TELA } from './ui';

const W = CONFIG.LARGURA;

/**
 * Cenas curtas que a crianca ganha de premio por acertar.
 *
 * Nao e enfeite: a resposta certa vira uma coisa que ela ve acontecer. Ela
 * respondeu "de mao dada na faixa" e agora assiste o carro parar e os dois
 * atravessarem. Cada animacao e escrita a mao, usa a arte que ja existe e
 * devolve quanto tempo dura, para o motor saber quando seguir.
 */
export type Animacao = (
  cena: Phaser.Scene,
  camada: Phaser.GameObjects.Container,
  personagem: PersonagemCfg,
) => number;

/**
 * As pecas do personagem, achadas de fora pelo nome da textura.
 *
 * desenharPersonagem monta corpo + olhos + cabelo + acessorios num container.
 * Em vez de mudar aquele arquivo para devolver referencias, a gente olha os
 * filhos e reconhece cada um pela textura. E so leitura: quem monta continua
 * sendo dono do desenho.
 *
 * Com corpo, olhos e cabelo na mao da para fazer o essencial de um esqueleto
 * de tres ossos -- o corpo que anda, o cabelo que chega atrasado e o rosto que
 * pisca e muda de humor. E o que tira o jeito de adesivo colado na tela.
 */
export interface Pecas {
  corpo?: Phaser.GameObjects.Image;
  olhos?: Phaser.GameObjects.Image;
  cabelo?: Phaser.GameObjects.Image;
}

export function pecas(alvo: Phaser.GameObjects.Container): Pecas {
  const fora: Pecas = {};
  for (const o of alvo.list) {
    const im = o as Phaser.GameObjects.Image;
    const chave = typeof im.texture?.key === 'string' ? im.texture.key : '';
    if (chave.startsWith('corpo')) fora.corpo ??= im;
    else if (chave.startsWith('olhos_')) fora.olhos ??= im;
    else if (chave.startsWith('cabelo_')) fora.cabelo ??= im;
  }
  return fora;
}

/** Rosto que o jogo sabe fazer. Cada um e uma arte de olhos+boca ja pronta. */
const ROSTOS: Record<string, string> = {
  normal: 'olhos_redondos',
  feliz: 'olhos_alegres',
  surpreso: 'olhos_grandes',
  contente: 'olhos_sorriso',
};

/**
 * Troca a cara do personagem. A peca traz olhos e boca juntos, entao e so
 * trocar a textura -- e preciso recalcular a escala porque cada arte tem uma
 * largura diferente e o rosto nao pode mudar de tamanho junto com o humor.
 */
export function expressao(alvo: Phaser.GameObjects.Container, humor: keyof typeof ROSTOS | string) {
  const { olhos } = pecas(alvo);
  const chave = ROSTOS[humor] ?? humor;
  if (!olhos || !olhos.scene.textures.exists(chave) || olhos.texture.key === chave) return;
  const larguraAntes = olhos.displayWidth;
  olhos.setTexture(chave);
  olhos.setScale(larguraAntes / olhos.width);
}

/**
 * Pisca de vez em quando, no ritmo de quem esta acordado e calmo.
 *
 * Fecha so a altura da peca do rosto: dois quadros de nada, mas e o sinal que
 * o olho humano usa para decidir se tem alguem ali.
 */
export function piscar(cena: Phaser.Scene, alvo: Phaser.GameObjects.Container) {
  const { olhos } = pecas(alvo);
  if (!olhos) return alvo;
  const aberto = olhos.scaleY;
  const agendar = () =>
    cena.time.delayedCall(Phaser.Math.Between(2200, 6000), () => {
      if (!olhos.active) return;
      cena.tweens.add({
        targets: olhos,
        scaleY: aberto * 0.08,
        duration: 70,
        yoyo: true,
        onComplete: agendar,
      });
    });
  agendar();
  return alvo;
}

/**
 * Passo: o corpo sobe e desce, inclina de leve e o cabelo chega atrasado.
 *
 * Sem perna separada na arte nao da para animar a perna. Mas o que o olho le
 * como "andando" e o balanco vertical no ritmo certo mais o atraso do cabelo,
 * nao a perna em si. Devolve os tweens para quem chamou poder parar.
 */
export function andar(cena: Phaser.Scene, alvo: Phaser.GameObjects.Container, passoMs = 300) {
  const { cabelo } = pecas(alvo);
  const base = alvo.y;
  const tweens = [
    cena.tweens.add({
      targets: alvo,
      y: base - 9,
      duration: passoMs,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    }),
    cena.tweens.add({
      targets: alvo,
      angle: { from: -2.2, to: 2.2 },
      duration: passoMs * 2,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    }),
  ];
  if (cabelo) {
    // o cabelo sai meio passo atrasado: e isso que tira o jeito de bloco so
    tweens.push(
      cena.tweens.add({
        targets: cabelo,
        y: cabelo.y + 7,
        angle: { from: -3, to: 3 },
        duration: passoMs,
        delay: passoMs / 2,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      }),
    );
  }
  return () => {
    for (const t of tweens) t.remove();
    alvo.setAngle(0);
    alvo.y = base;
    cabelo?.setAngle(0);
  };
}

/**
 * Respiracao: o personagem parado nunca fica totalmente parado.
 *
 * E o truque mais barato que existe para a crianca sentir que tem alguem ali
 * em vez de um adesivo colado na tela. Mexe so no container, entao serve para
 * qualquer personagem ja montado.
 */
export function darVida(cena: Phaser.Scene, alvo: Phaser.GameObjects.Container) {
  // quem respira tambem pisca: as duas coisas andam juntas em todo personagem
  piscar(cena, alvo);
  const base = alvo.scaleY;
  cena.tweens.add({
    targets: alvo,
    scaleY: base * 1.018,
    y: alvo.y - 4,
    duration: 1500,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  });
  return alvo;
}

/**
 * Pulinho de quem acertou, com antecipacao e aterrissagem.
 *
 * O pulo so parece vivo com as tres partes: agacha antes (antecipacao), sobe
 * rapido e desce devagar, e amassa ao tocar o chao (squash). Sem isso o boneco
 * sobe e desce como elevador. O cabelo chega atrasado e o rosto fica feliz.
 */
export function comemorar(cena: Phaser.Scene, alvo: Phaser.GameObjects.Container) {
  const { cabelo } = pecas(alvo);
  const y = alvo.y;
  const ex = alvo.scaleX;
  const ey = alvo.scaleY;
  expressao(alvo, 'feliz');

  cena.tweens.chain({
    targets: alvo,
    tweens: [
      // agacha: o olho precisa ver a forca sendo juntada
      { scaleY: ey * 0.88, scaleX: ex * 1.07, y: y + 10, duration: 130, ease: 'Quad.easeOut' },
      { scaleY: ey * 1.06, scaleX: ex * 0.95, y: y - 70, duration: 190, ease: 'Quad.easeOut' },
      { y: y - 62, duration: 90, ease: 'Sine.easeInOut' },
      { y, scaleY: ey, scaleX: ex, duration: 170, ease: 'Quad.easeIn' },
      // amassa na aterrissagem e volta
      { scaleY: ey * 0.86, scaleX: ex * 1.1, duration: 80, ease: 'Quad.easeOut' },
      { scaleY: ey, scaleX: ex, duration: 220, ease: 'Back.out' },
    ],
  });
  if (cabelo) {
    const cy = cabelo.y;
    cena.tweens.chain({
      targets: cabelo,
      tweens: [
        { y: cy + 10, duration: 180, delay: 90, ease: 'Quad.easeOut' },
        { y: cy - 6, duration: 200, ease: 'Sine.easeInOut' },
        { y: cy, duration: 260, ease: 'Back.out' },
      ],
    });
  }
  return alvo;
}

/**
 * Desanimou: ombro cai, cabeca pende e o balanco fica lento.
 *
 * Nunca e castigo -- serve para a crianca ler no personagem o que a frase diz,
 * e volta sozinho ao normal depois de um tempinho.
 */
export function entristecer(cena: Phaser.Scene, alvo: Phaser.GameObjects.Container, ms = 1600) {
  const { cabelo } = pecas(alvo);
  const y = alvo.y;
  const ey = alvo.scaleY;
  cena.tweens.add({ targets: alvo, scaleY: ey * 0.95, y: y + 12, duration: 420, ease: 'Quad.easeOut' });
  if (cabelo) {
    const cy = cabelo.y;
    cena.tweens.add({ targets: cabelo, y: cy + 9, duration: 480, ease: 'Quad.easeOut' });
    cena.time.delayedCall(ms, () => cena.tweens.add({ targets: cabelo, y: cy, duration: 400 }));
  }
  cena.time.delayedCall(ms, () => {
    cena.tweens.add({ targets: alvo, scaleY: ey, y, duration: 400, ease: 'Sine.easeInOut' });
    expressao(alvo, 'normal');
  });
  return alvo;
}

/** Palco limpo: a cena de premio toma a tela inteira, sem os cartoes atras. */
function palco(cena: Phaser.Scene, camada: Phaser.GameObjects.Container, cor: number) {
  const fundo = cobrirTela(cena, cor).setDepth(60).setAlpha(0);
  camada.add(fundo);
  cena.tweens.add({ targets: fundo, alpha: 1, duration: 260 });
  return fundo;
}

/** O carro freia antes da faixa e os dois atravessam de mao dada. */
const atravessar: Animacao = (cena, camada, personagem) => {
  const chao = 720;
  const meiaRua = 250;
  const beiraBaixo = chao + meiaRua;
  const beiraCima = chao - meiaRua;

  palco(cena, camada, 0xcfdbe2);

  const rua = cena.add.graphics().setDepth(61);
  // calcada de cima e de baixo, com o meio-fio mais escuro: sem essas duas
  // faixas o asfalto vira um retangulo cinza solto no meio da tela
  rua.fillStyle(0xdedacd, 1);
  rua.fillRect(0, TELA.topo, W, beiraCima - TELA.topo);
  rua.fillRect(0, beiraBaixo, W, TELA.baixo - beiraBaixo);
  rua.fillStyle(0x8d949b, 1);
  rua.fillRect(0, beiraCima, W, meiaRua * 2);
  rua.fillStyle(0xb9b3a4, 1);
  rua.fillRect(0, beiraCima - 14, W, 14);
  rua.fillRect(0, beiraBaixo, W, 14);
  camada.add(rua);

  // faixa: barras largas atravessando a rua inteira, no sentido de quem anda
  const meiaFaixa = 170;
  const faixa = cena.add.graphics().setDepth(62);
  faixa.fillStyle(0xf6f4f0, 0.97);
  for (let i = -2; i <= 2; i++) {
    faixa.fillRoundedRect(W / 2 + i * 68 - 26, beiraCima + 16, 52, meiaRua * 2 - 32, 10);
  }
  // tracejado do meio da rua para nos dois lados da faixa, que e o que faz
  // a faixa parecer faixa e nao um desenho qualquer no chao
  faixa.fillStyle(0xe8e3d6, 0.9);
  for (let x = -40; x > -W; x -= 120) faixa.fillRect(W / 2 + x - 70, chao - 6, 70, 12);
  for (let x = 40; x < W; x += 120) faixa.fillRect(W / 2 + x + meiaFaixa, chao - 6, 70, 12);
  camada.add(faixa);

  const sinal = figura(cena, W - 92, beiraCima - 96, 'm06_sinal_verde', '\u{1F6A6}', 180).setDepth(63);
  camada.add(sinal);
  cena.tweens.add({ targets: sinal, alpha: 0.65, duration: 500, yoyo: true, repeat: -1 });

  const carro = figura(cena, -240, chao - 46, 'm06_carro', '\u{1F697}', 260).setDepth(63);
  camada.add(carro);
  cena.tweens.add({
    targets: carro,
    x: W / 2 - meiaFaixa - 150,
    duration: 1150,
    ease: 'Quad.easeOut',
    onComplete: () => {
      nota(300);
      // mergulho do capo: o carro freou mesmo
      cena.tweens.add({ targets: carro, angle: { from: 0, to: -5 }, duration: 170, yoyo: true });
    },
  });

  // cada um vai dentro de um carrinho: o carrinho viaja e o corpo balanca
  // dentro dele. Senao o passo e a travessia disputam o mesmo y.
  const carrinho = (dentro: Phaser.GameObjects.Container, x: number, y: number) => {
    dentro.setPosition(0, 0);
    return cena.add.container(x, y, [dentro]).setDepth(64);
  };
  const adulto = cena.add.container(0, 0, [figura(cena, 0, 0, 'adulto', '\u{1F9D1}', 330)]);
  const crianca = desenharPersonagem(cena, personagem, 0.42);
  piscar(cena, crianca);
  expressao(crianca, 'contente');
  const carrinhos = [
    carrinho(adulto, W / 2 + 74, beiraBaixo + 120),
    carrinho(crianca, W / 2 - 78, beiraBaixo + 150),
  ];
  camada.add(carrinhos);

  const distancia = beiraBaixo - beiraCima + 300;
  for (const c of carrinhos) {
    cena.tweens.add({
      targets: c,
      y: c.y - distancia,
      // encolhe um tiquinho ao se afastar: da profundidade sem perspectiva
      scale: 0.88,
      duration: 1900,
      delay: 1450,
      ease: 'Sine.easeInOut',
    });
  }
  // o passo comeca ao sair da calcada e para ao chegar do outro lado
  cena.time.delayedCall(1450, () => {
    const parar = [adulto, crianca].map((quem, i) => andar(cena, quem, 300 + i * 24));
    cena.time.delayedCall(1900, () => parar.forEach((p) => p()));
  });

  cena.time.delayedCall(1450, () => nota(660));
  cena.time.delayedCall(2300, () => nota(784));
  cena.time.delayedCall(3100, () => nota(880));

  return 3600;
};

export const ANIMACOES: Record<string, Animacao> = {
  atravessar,
};

/** Arte que a animacao usa e que pode nao estar no JSON da missao. */
export const ARTE_ANIMACAO: Record<string, string[]> = {
  atravessar: ['m06_carro', 'adulto', 'm06_sinal_verde'],
};
