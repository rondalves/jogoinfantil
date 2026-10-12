import Phaser from 'phaser';
import {
  cabe,
  COLUNAS,
  encaixar,
  girar,
  LINHAS,
  mover,
  novaPeca,
  ocupadas,
  queda,
  tabuleiroVazio,
  type Peca,
  type Tabuleiro,
} from '../encaixe';
import { fale } from '../narracoes';
import { narrador } from '../narrador';
import { ativo } from '../storage';
import { vigiarTempo } from '../tempoDeJogo';
import { TEMA } from '../theme';
import { botaoOuvir, botaoVoltar, confete, fundo, nota, TELA } from '../ui';

const CEL = 60;
const X0 = 40;
const Y0 = 210;
const CORES = [0x7cc3ef, 0xf7d14c, 0xb996d9, 0x8fd16e, 0xe85d6a, 0x4a7fd9, 0xf39c4a];

/**
 * Joguinho de encaixar, no estilo Tetris. Tocar no tabuleiro gira a peca;
 * arrastar para o lado (ou os botoes) move; segurar a seta de baixo desce
 * rapido. Linha cheia some com festa. A cada 5 linhas sobe de nivel e a peca
 * cai mais rapido. Encheu ate em cima? Limpa o tabuleiro e segue -- sem
 * "fim de jogo". As regras ficam em src/encaixe.ts.
 */
export class Encaixe extends Phaser.Scene {
  private tab: Tabuleiro = tabuleiroVazio();
  private peca!: Peca;
  private proxima = 0;
  private linhas = 0;
  private acumulado = 0;
  private descendo = false;
  private pausado = false;
  private g!: Phaser.GameObjects.Graphics;
  private gProxima!: Phaser.GameObjects.Graphics;
  private placar!: Phaser.GameObjects.Text;
  private nivelTxt!: Phaser.GameObjects.Text;
  private sacola: number[] = [];

  constructor() {
    super('Encaixe');
  }

  create() {
    const p = ativo();
    if (p) {
      narrador.setNome(p.nome);
      narrador.setVoz(p.voz ?? 'f');
    }
    this.tab = tabuleiroVazio();
    this.linhas = 0;
    this.acumulado = 0;
    this.descendo = false;
    this.pausado = false;
    this.sacola = [];
    fundo(this, TEMA.creme, 'bg_criador_personagem', true);
    botaoVoltar(this, 'Joguinhos');
    botaoOuvir(this);

    // painel da direita: proxima peca, linhas e nivel
    const px = X0 + COLUNAS * CEL + 100;
    const painel = this.add.graphics();
    painel.fillStyle(0xffffff, 0.92).fillRoundedRect(px - 82, Y0, 164, 470, 26);
    this.add.text(px, Y0 + 34, 'Próxima', { fontSize: '26px', color: '#2b3a4a', fontStyle: 'bold' }).setOrigin(0.5);
    this.gProxima = this.add.graphics();
    this.add.text(px, Y0 + 230, 'Linhas', { fontSize: '26px', color: '#2b3a4a' }).setOrigin(0.5);
    this.placar = this.add.text(px, Y0 + 280, '0', { fontSize: '56px', color: '#2b3a4a', fontStyle: 'bold' }).setOrigin(0.5);
    this.nivelTxt = this.add.text(px, Y0 + 380, 'Nível 1', { fontSize: '30px', color: '#2b3a4a', fontStyle: 'bold' }).setOrigin(0.5);

    this.g = this.add.graphics();
    this.controles();
    this.proxima = this.sortear();
    this.entrar();
    vigiarTempo(this);
    fale('jogo_encaixe');
  }

  /** Sorteio em sacola: as 7 pecas saem embaralhadas antes de repetir. */
  private sortear() {
    if (this.sacola.length === 0) this.sacola = Phaser.Utils.Array.Shuffle([0, 1, 2, 3, 4, 5, 6]);
    return this.sacola.pop()!;
  }

  private entrar() {
    this.peca = novaPeca(this.proxima);
    this.proxima = this.sortear();
    if (!cabe(this.tab, this.peca)) {
      this.encheu();
      return;
    }
    this.desenhar();
  }

  /** Encheu ate em cima: festa pelo que fez e tabuleiro limpo para seguir. */
  private encheu() {
    this.pausado = true;
    fale('jogo_encaixe_encheu');
    confete(this, 40);
    this.tweens.add({
      targets: this.g,
      alpha: 0,
      duration: 500,
      yoyo: true,
      onYoyo: () => {
        this.tab = tabuleiroVazio();
        this.peca = novaPeca(this.proxima);
        this.proxima = this.sortear();
        this.desenhar();
      },
      onComplete: () => (this.pausado = false),
    });
  }

  private get intervalo() {
    return Math.max(220, 850 - Math.floor(this.linhas / 5) * 90);
  }

  update(_t: number, dms: number) {
    if (this.pausado) return;
    this.acumulado += dms;
    if (this.acumulado < (this.descendo ? 45 : this.intervalo)) return;
    this.acumulado = 0;
    const abaixo = mover(this.tab, this.peca, 0, 1);
    if (abaixo) {
      this.peca = abaixo;
      this.desenhar();
    } else {
      this.fixar();
    }
  }

  private fixar() {
    const { tabuleiro, apagadas } = encaixar(this.tab, this.peca);
    nota(392);
    if (apagadas.length === 0) {
      this.tab = tabuleiro;
      this.entrar();
      return;
    }
    // pisca as linhas cheias antes de sumirem
    this.pausado = true;
    const brilho = this.add.graphics();
    for (const l of apagadas) brilho.fillStyle(0xffffff, 0.9).fillRoundedRect(X0, Y0 + l * CEL, COLUNAS * CEL, CEL, 10);
    // mostra a peca ja no lugar, com as linhas ainda cheias, enquanto piscam
    const cheio = this.tab.map((linha) => [...linha]);
    for (const [c, l] of ocupadas(this.peca)) if (l >= 0) cheio[l][c] = this.peca.tipo;
    this.tab = cheio;
    this.desenhar(false);
    apagadas.forEach((_, i) => this.time.delayedCall(i * 110, () => nota(784 + i * 196)));
    this.tweens.add({
      targets: brilho,
      alpha: 0,
      duration: 380,
      onComplete: () => {
        brilho.destroy();
        const antes = Math.floor(this.linhas / 5);
        this.linhas += apagadas.length;
        this.tab = tabuleiro;
        this.placar.setText(String(this.linhas));
        if (Math.floor(this.linhas / 5) > antes) this.subirNivel();
        this.pausado = false;
        this.entrar();
      },
    });
  }

  private subirNivel() {
    const n = Math.floor(this.linhas / 5) + 1;
    this.nivelTxt.setText(`Nível ${n}`);
    confete(this, 50);
    narrador.falar(`Nível ${n}!`);
  }

  /** Tocar no tabuleiro gira; arrastar para o lado move; botoes embaixo tambem. */
  private controles() {
    const zona = this.add.zone(X0 + (COLUNAS * CEL) / 2, Y0 + (LINHAS * CEL) / 2, COLUNAS * CEL + 40, LINHAS * CEL).setInteractive();
    let inicioX = 0;
    let andou = 0;
    let arrastou = false;
    zona.on('pointerdown', (p: Phaser.Input.Pointer) => {
      inicioX = p.worldX;
      andou = 0;
      arrastou = false;
    });
    zona.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (!p.isDown || this.pausado) return;
      const colunas = Math.trunc((p.worldX - inicioX) / CEL) - andou;
      if (colunas === 0) return;
      arrastou = true;
      for (let i = 0; i < Math.abs(colunas); i++) this.andar(Math.sign(colunas));
      andou += colunas;
    });
    zona.on('pointerup', () => {
      if (!arrastou) this.girar();
    });

    const y = Math.min(TELA.baixo - 110, Y0 + LINHAS * CEL + 120);
    const redondo = (x: number, icone: string, cor: number, aperta: () => void, solta?: () => void) => {
      const g = this.add.graphics();
      g.fillStyle(0x000000, 0.12).fillCircle(x, y + 6, 72);
      g.fillStyle(cor, 1).fillCircle(x, y, 70);
      g.lineStyle(5, 0xffffff, 0.9).strokeCircle(x, y, 70);
      this.add.text(x, y, icone, { fontSize: '60px', color: '#2b3a4a', fontStyle: 'bold' }).setOrigin(0.5);
      const z = this.add.zone(x, y, 160, 160).setInteractive();
      let repetir: Phaser.Time.TimerEvent | undefined;
      z.on('pointerdown', () => {
        aperta();
        if (!solta) repetir = this.time.addEvent({ delay: 140, startAt: -120, loop: true, callback: aperta });
      });
      const parar = () => {
        repetir?.remove();
        repetir = undefined;
        solta?.();
      };
      z.on('pointerup', parar);
      z.on('pointerout', parar);
    };
    redondo(100, '◀', 0xbfd4e8, () => this.andar(-1));
    redondo(273, '⟳', 0x8fd16e, () => this.girar(), () => undefined);
    redondo(446, '▼', 0xf7d14c, () => (this.descendo = true), () => (this.descendo = false));
    redondo(620, '▶', 0xbfd4e8, () => this.andar(1));

    const t = this.input.keyboard;
    t?.on('keydown-LEFT', () => this.andar(-1));
    t?.on('keydown-RIGHT', () => this.andar(1));
    t?.on('keydown-UP', () => this.girar());
    t?.on('keydown-DOWN', () => (this.descendo = true));
    t?.on('keyup-DOWN', () => (this.descendo = false));
  }

  private andar(lado: number) {
    if (this.pausado) return;
    const q = mover(this.tab, this.peca, lado, 0);
    if (!q) return;
    this.peca = q;
    nota(523);
    this.desenhar();
  }

  private girar() {
    if (this.pausado) return;
    const q = girar(this.tab, this.peca);
    if (!q) return;
    this.peca = q;
    nota(659);
    this.desenhar();
  }

  private celula(g: Phaser.GameObjects.Graphics, x: number, y: number, tam: number, cor: number, alpha = 1) {
    g.fillStyle(cor, alpha).fillRoundedRect(x + 2, y + 2, tam - 4, tam - 4, tam * 0.22);
    if (alpha < 1) return;
    g.fillStyle(0xffffff, 0.45).fillRoundedRect(x + 8, y + 7, tam - 22, tam * 0.2, 5);
    g.lineStyle(3, 0x2b3a4a, 0.35).strokeRoundedRect(x + 2, y + 2, tam - 4, tam - 4, tam * 0.22);
  }

  private desenhar(comPeca = true) {
    const g = this.g;
    g.clear();
    g.fillStyle(0xffffff, 0.9).fillRoundedRect(X0 - 10, Y0 - 10, COLUNAS * CEL + 20, LINHAS * CEL + 20, 24);
    g.lineStyle(2, 0xdfe5ea, 1);
    for (let c = 1; c < COLUNAS; c++) g.lineBetween(X0 + c * CEL, Y0, X0 + c * CEL, Y0 + LINHAS * CEL);
    for (let l = 1; l < LINHAS; l++) g.lineBetween(X0, Y0 + l * CEL, X0 + COLUNAS * CEL, Y0 + l * CEL);
    this.tab.forEach((linha, l) =>
      linha.forEach((v, c) => {
        if (v !== null) this.celula(g, X0 + c * CEL, Y0 + l * CEL, CEL, CORES[v]);
      }),
    );
    if (comPeca) {
      // a sombra mostra onde a peca vai encaixar
      for (const [c, l] of ocupadas(queda(this.tab, this.peca))) {
        if (l >= 0) this.celula(g, X0 + c * CEL, Y0 + l * CEL, CEL, CORES[this.peca.tipo], 0.28);
      }
      for (const [c, l] of ocupadas(this.peca)) {
        if (l >= 0) this.celula(g, X0 + c * CEL, Y0 + l * CEL, CEL, CORES[this.peca.tipo]);
      }
    }
    // proxima peca, pequena
    const gp = this.gProxima;
    gp.clear();
    const px = X0 + COLUNAS * CEL + 100;
    const pequena = novaPeca(this.proxima).celulas;
    const larg = Math.max(...pequena.map(([c]) => c)) + 1;
    const alt = Math.max(...pequena.map(([, l]) => l)) + 1;
    const t = 34;
    for (const [c, l] of pequena) {
      this.celula(gp, px - (larg * t) / 2 + c * t, Y0 + 120 - (alt * t) / 2 + l * t, t, CORES[this.proxima]);
    }
  }
}
