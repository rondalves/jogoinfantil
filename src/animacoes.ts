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
 * Respiracao: o personagem parado nunca fica totalmente parado.
 *
 * E o truque mais barato que existe para a crianca sentir que tem alguem ali
 * em vez de um adesivo colado na tela. Mexe so no container, entao serve para
 * qualquer personagem ja montado.
 */
export function darVida(cena: Phaser.Scene, alvo: Phaser.GameObjects.Container) {
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

/** Pulinho de quem acertou. */
export function comemorar(cena: Phaser.Scene, alvo: Phaser.GameObjects.Container) {
  cena.tweens.add({
    targets: alvo,
    y: alvo.y - 46,
    duration: 260,
    yoyo: true,
    repeat: 1,
    ease: 'Quad.easeOut',
  });
  cena.tweens.add({ targets: alvo, angle: { from: -5, to: 5 }, duration: 160, yoyo: true, repeat: 3 });
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

  const adulto = figura(cena, W / 2 + 74, beiraBaixo + 120, 'adulto', '\u{1F9D1}', 330).setDepth(64);
  const crianca = desenharPersonagem(cena, personagem, 0.42).setDepth(64);
  crianca.setPosition(W / 2 - 78, beiraBaixo + 150);
  camada.add([adulto, crianca]);

  const andar = beiraBaixo - beiraCima + 300;
  for (const [i, quem] of [adulto, crianca].entries()) {
    cena.tweens.add({
      targets: quem,
      y: quem.y - andar,
      // encolhe um tiquinho ao se afastar: da profundidade sem perspectiva
      scale: quem.scale * 0.88,
      duration: 1900,
      delay: 1450,
      ease: 'Sine.easeInOut',
    });
    cena.tweens.add({
      targets: quem,
      angle: { from: -2.5, to: 2.5 },
      duration: 300,
      delay: 1450 + i * 150,
      yoyo: true,
      repeat: 5,
    });
  }
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
