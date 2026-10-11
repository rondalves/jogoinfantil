import Phaser from 'phaser';
import { carregar } from '../assets';
import { CONFIG } from '../config';
import { fale } from '../narracoes';
import { narrador } from '../narrador';
import { ativo } from '../storage';
import { vigiarTempo } from '../tempoDeJogo';
import { TEMA } from '../theme';
import { LARG, pousar } from '../torre';
import { botaoOuvir, botaoVoltar, brilhinho, confete, fundo, nota, textoEmPainel } from '../ui';

const W = CONFIG.LARGURA;
const ALT = 36;
/** altura do prato na tela; a torre sobe a partir dele */
const Y_PRATO = 1120;
/** onde a camada de cima fica na tela quando a torre ja esta alta */
const Y_TOPO_TELA = 760;

type Sabor = { nome: string; desenhar: (g: Phaser.GameObjects.Graphics) => void };

const TRACO = 0x7a4a2a;

/** Camadas da torre, desenhadas com o (0,0) no centro da camada. */
const SABORES: Sabor[] = [
  {
    nome: 'panqueca',
    desenhar: (g) => {
      g.fillStyle(0xe2a85c, 1).fillRoundedRect(-LARG / 2, -ALT / 2, LARG, ALT, 18);
      g.fillStyle(0xf3c98a, 1).fillRoundedRect(-LARG / 2 + 10, -ALT / 2 + 4, LARG - 20, 12, 6);
      g.lineStyle(3, TRACO, 1).strokeRoundedRect(-LARG / 2, -ALT / 2, LARG, ALT, 18);
    },
  },
  {
    nome: 'morango',
    desenhar: (g) => {
      g.fillStyle(0xe85d6a, 1).fillRoundedRect(-LARG / 2 + 8, -ALT / 2, LARG - 16, ALT, 16);
      g.fillStyle(0xfff3b0, 1);
      for (let x = -LARG / 2 + 30; x < LARG / 2 - 20; x += 26) g.fillEllipse(x, (x % 3) - 2, 4, 6);
      g.lineStyle(3, 0xa8323e, 1).strokeRoundedRect(-LARG / 2 + 8, -ALT / 2, LARG - 16, ALT, 16);
    },
  },
  {
    nome: 'banana',
    desenhar: (g) => {
      g.fillStyle(0xfbe7a1, 1).fillRoundedRect(-LARG / 2 + 6, -ALT / 2, LARG - 12, ALT, 16);
      g.lineStyle(3, 0xc9a43c, 1).strokeRoundedRect(-LARG / 2 + 6, -ALT / 2, LARG - 12, ALT, 16);
      for (let x = -LARG / 2 + 34; x < LARG / 2 - 20; x += 46) {
        g.fillStyle(0xfff6d1, 1).fillCircle(x, 0, 13);
        g.lineStyle(2, 0xc9a43c, 1).strokeCircle(x, 0, 13);
        g.fillStyle(0xc9a43c, 1).fillCircle(x, 0, 3);
      }
    },
  },
  {
    nome: 'chantilly',
    desenhar: (g) => {
      g.fillStyle(0xffffff, 1);
      for (let x = -LARG / 2 + 22; x <= LARG / 2 - 22; x += 30) g.fillCircle(x, 2, 20);
      g.lineStyle(3, 0xc8ccd1, 1);
      for (let x = -LARG / 2 + 22; x <= LARG / 2 - 22; x += 30) g.strokeCircle(x, 2, 20);
      g.fillStyle(0xffffff, 1).fillRect(-LARG / 2 + 22, -6, LARG - 44, 26);
    },
  },
];

/**
 * Torre de panquecas, no estilo Stack: a camada balanca la em cima e a
 * crianca toca para soltar. Caiu bem em cima, fica; caiu muito de lado,
 * escorrega da torre e vem outra -- sem castigo e sem fim. Bem no meio vale
 * estrela. A cada 10 camadas, festa.
 */
export class TorrePanquecas extends Phaser.Scene {
  private torre!: Phaser.GameObjects.Container;
  private camadas: { x: number; obj: Phaser.GameObjects.Graphics }[] = [];
  private balanco?: Phaser.GameObjects.Graphics;
  private caindo = false;
  private sentido = 1;
  private velocidade = 240;
  private total = 0;
  private estrelas = 0;
  private placar!: Phaser.GameObjects.Text;

  constructor() {
    super('TorrePanquecas');
  }

  create() {
    const p = ativo();
    if (p) {
      narrador.setNome(p.nome);
      narrador.setVoz(p.voz ?? 'f');
    }
    this.camadas = [];
    this.caindo = false;
    this.velocidade = 240;
    this.total = 0;
    this.estrelas = 0;
    carregar(this, ['bg_cozinha_cafe'], () => this.montar());
  }

  private montar() {
    fundo(this, TEMA.creme, 'bg_cozinha_cafe', true);
    botaoVoltar(this, 'Joguinhos');
    botaoOuvir(this);
    this.placar = this.add
      .text(W / 2, 96, '', { fontSize: '40px', color: '#2b3a4a', fontStyle: 'bold' })
      .setOrigin(0.5)
      .setStroke('#ffffff', 10)
      .setDepth(40);
    textoEmPainel(this, W / 2, 200, 'Toque para soltar!', 36, W - 240).setDepth(40);

    this.torre = this.add.container(0, 0);
    // o prato
    const prato = this.add.graphics();
    prato.fillStyle(0xffffff, 1).fillEllipse(W / 2, Y_PRATO + 30, 380, 60);
    prato.lineStyle(4, 0xc8ccd1, 1).strokeEllipse(W / 2, Y_PRATO + 30, 380, 60);
    prato.fillStyle(0xeef1f4, 1).fillEllipse(W / 2, Y_PRATO + 26, 280, 34);
    this.torre.add(prato);
    // a primeira panqueca ja vem no prato
    this.empilhar(W / 2);

    this.input.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      // os botoes de voltar e de ouvir ficam no alto: toque la nao solta
      if (ptr.worldY < 160) return;
      this.soltar();
    });
    vigiarTempo(this);
    this.atualizarPlacar();
    this.novaCamada();
    fale('jogo_torre');
  }

  private yDaCamada(i: number) {
    return Y_PRATO - ALT / 2 - i * (ALT - 4);
  }

  private desenharCamada(i: number) {
    const g = this.add.graphics();
    // panqueca, recheio, panqueca, recheio... com o recheio variando
    SABORES[i % 2 === 0 ? 0 : 1 + (((i - 1) / 2) % (SABORES.length - 1))].desenhar(g);
    return g;
  }

  private empilhar(x: number) {
    const i = this.camadas.length;
    const g = this.desenharCamada(i).setPosition(x, this.yDaCamada(i));
    this.torre.add(g);
    this.camadas.push({ x, obj: g });
    // camada que sumiu la embaixo nao precisa mais existir
    if (this.camadas.length > 40) this.camadas[this.camadas.length - 41].obj.destroy();
  }

  /** A torre desce para a camada de cima ficar sempre a mesma altura na tela. */
  private ajustarAltura() {
    const topo = this.yDaCamada(this.camadas.length - 1);
    const alvo = Math.max(0, Y_TOPO_TELA - topo);
    this.tweens.add({ targets: this.torre, y: alvo, duration: 380, ease: 'Sine.easeOut' });
  }

  private novaCamada() {
    const i = this.camadas.length;
    const g = this.desenharCamada(i);
    g.setPosition(W / 2 - 200, this.yDaCamada(i) - 230);
    this.torre.add(g);
    this.balanco = g;
    this.sentido = 1;
    this.caindo = false;
  }

  update(_t: number, dms: number) {
    const g = this.balanco;
    if (!g || this.caindo) return;
    const dt = Math.min(dms, 50) / 1000;
    // balanca em volta do topo da torre, sem sair da tela
    const topo = this.camadas[this.camadas.length - 1].x;
    const centro = Phaser.Math.Clamp(topo, W / 2 - 120, W / 2 + 120);
    g.x += this.sentido * this.velocidade * dt;
    if (g.x > centro + 200) this.sentido = -1;
    if (g.x < centro - 200) this.sentido = 1;
  }

  private soltar() {
    const g = this.balanco;
    if (!g || this.caindo) return;
    this.caindo = true;
    nota(620);
    const i = this.camadas.length;
    const topo = this.camadas[i - 1].x;
    const lugar = pousar(g.x, topo);
    const yFinal = this.yDaCamada(i);
    this.tweens.add({
      targets: g,
      y: yFinal,
      duration: 260,
      ease: 'Quad.easeIn',
      onComplete: () => (lugar ? this.ficou(g, lugar.x, lugar.perfeita) : this.escorregou(g, topo)),
    });
  }

  private ficou(g: Phaser.GameObjects.Graphics, x: number, perfeita: boolean) {
    g.destroy();
    this.empilhar(x);
    const nova = this.camadas[this.camadas.length - 1].obj;
    this.tweens.add({ targets: nova, scaleY: 0.82, scaleX: 1.06, duration: 80, yoyo: true });
    this.total += 1;
    if (perfeita) {
      this.estrelas += 1;
      nota(1047);
      const b = brilhinho(this, x, nova.y - 30, 30).setScale(0);
      this.torre.add(b);
      this.tweens.add({ targets: b, scale: 1.2, alpha: 0, duration: 600, onComplete: () => b.destroy() });
    } else {
      nota(784);
    }
    this.velocidade = Math.min(480, 240 + this.total * 8);
    this.atualizarPlacar();
    if (this.total % 10 === 0) {
      confete(this, 50);
      [0, 160, 320].forEach((t, k) => this.time.delayedCall(t, () => nota(880 + k * 220)));
      narrador.falar(`Uau! ${this.total} panquecas!`);
    }
    this.ajustarAltura();
    this.time.delayedCall(320, () => this.novaCamada());
  }

  /** Caiu de lado: escorrega para fora girando e vem outra. Sem castigo. */
  private escorregou(g: Phaser.GameObjects.Graphics, topo: number) {
    const lado = g.x > topo ? 1 : -1;
    nota(260);
    this.tweens.add({
      targets: g,
      x: g.x + lado * 260,
      y: g.y + 420,
      angle: lado * 120,
      alpha: 0,
      duration: 700,
      ease: 'Quad.easeIn',
      onComplete: () => g.destroy(),
    });
    this.time.delayedCall(450, () => this.novaCamada());
  }

  private atualizarPlacar() {
    this.placar.setText(`\u{1F95E} ${this.total}    \u{2B50} ${this.estrelas}`);
  }
}

