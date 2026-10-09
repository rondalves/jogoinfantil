import Phaser from 'phaser';
import { CONFIG } from '../config';
import { narrador } from '../narrador';
import { TEMA } from '../theme';
import { botaoVoltar, fundo, nota, TELA } from '../ui';

const W = CONFIG.LARGURA;

/** Cores de bolha de sabao, no tom calmo do resto do jogo. */
const CORES = [0xbcd9e8, 0xd7c7e4, 0xe8d4c0, 0xc8e0cc, 0xe6c9cf];

/**
 * Estoura-bolhas.
 *
 * O joguinho mais simples que existe de proposito: bolhas sobem, o dedo
 * encosta, elas estouram. Nao tem placar, nao tem relogio, nao tem fim e nao
 * tem como errar. E para a crianca descansar, nao para competir.
 */
export class Bolhas extends Phaser.Scene {
  constructor() {
    super('Bolhas');
  }

  create() {
    // ceu liso de proposito: a tela e para descansar o olho
    fundo(this, TEMA.ceu);
    botaoVoltar(this, 'Joguinhos');
    narrador.falar('Encoste o dedinho nas bolhas para estourar!', 'jogo_bolhas');

    this.time.addEvent({ delay: 520, loop: true, callback: () => this.soltar() });
    for (let i = 0; i < 5; i++) this.time.delayedCall(i * 180, () => this.soltar());
  }

  private soltar() {
    const r = Phaser.Math.Between(46, 92);
    const x = Phaser.Math.Between(r + 20, W - r - 20);
    const cor = Phaser.Utils.Array.GetRandom(CORES);

    const bolha = this.add.container(x, TELA.baixo + r);
    const g = this.add.graphics();
    g.fillStyle(cor, 0.55);
    g.fillCircle(0, 0, r);
    g.lineStyle(4, 0xffffff, 0.9);
    g.strokeCircle(0, 0, r);
    g.fillStyle(0xffffff, 0.75);
    g.fillCircle(-r * 0.32, -r * 0.34, r * 0.17);
    bolha.add(g);

    const subir = this.tweens.add({
      targets: bolha,
      y: TELA.topo - r,
      duration: Phaser.Math.Between(7000, 11000),
      onComplete: () => bolha.destroy(),
    });
    // bamboleio: bolha de sabao nunca sobe reta
    this.tweens.add({
      targets: bolha,
      x: x + Phaser.Math.Between(-60, 60),
      duration: Phaser.Math.Between(1600, 2600),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    bolha.setSize(r * 2, r * 2).setInteractive({ useHandCursor: true });
    const estourar = () => {
      subir.remove();
      nota(Phaser.Math.Between(700, 1200));
      this.tweens.add({
        targets: bolha,
        scale: 1.45,
        alpha: 0,
        duration: 200,
        onComplete: () => bolha.destroy(),
      });
    };
    // basta passar o dedo: mirar o toque ainda e dificil nessa idade
    bolha.on('pointerdown', estourar);
    bolha.on('pointerover', (p: Phaser.Input.Pointer) => {
      if (p.isDown) estourar();
    });
  }
}
