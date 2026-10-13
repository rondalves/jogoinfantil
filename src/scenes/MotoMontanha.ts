import Phaser from 'phaser';
import { carregar } from '../assets';
import { CONFIG } from '../config';
import { GRAVIDADE, Montanha, VEL_MAX } from '../montanha';
import { fale } from '../narracoes';
import { narrador } from '../narrador';
import { desenharPersonagem } from '../personagem';
import { ativo } from '../storage';
import { vigiarTempo } from '../tempoDeJogo';
import { TEMA } from '../theme';
import { botao, botaoOuvir, botaoVoltar, cobrirTela, irPara, nota, TELA } from '../ui';

const W = CONFIG.LARGURA;

// fisica em px e segundos
const ACELERA = 900;
const FREIO = 1300;
const RE_MAX = 240;
const ATRITO = 0.3;
/** no ar: acelerar levanta a frente, frear abaixa (como no Hill Climb) */
const GIRO_CONTROLE = 5.5;
/** pousar com a moto mais torta que isso em relacao ao chao (~50 graus): capotou */
const CAPOTA = 0.87;
/** metade da distancia entre as rodas */
const EIXO = 52;
const RODA = 26;
const VIDAS = 3;
/** onde a moto fica na tela, em x */
const X_TELA = 230;
/** zoom do mundo: moto e montanha maiores para a crianca ver bem */
const ZOOM = 1.2;
/** a fisica roda em passos menores que o quadro: pouso e parede sem atravessar */
const PASSOS = 4;

/** Notas da melodia que as notinhas tocam ao serem pegas (pentatonica). */
const MELODIA = [523, 587, 659, 784, 880, 1047, 880, 784, 659, 587];
const CORES_NOTA = [0xe85d8a, 0x4a90d9, 0xf39c4a, 0x8a5cd1, 0x2fae7a];

/** Notinha musical desenhada: cabeca, haste e bandeirinha. */
function notaMusical(cena: Phaser.Scene, x: number, y: number, cor: number) {
  const g = cena.add.graphics({ x, y });
  g.fillStyle(cor, 1);
  g.fillEllipse(-8, 12, 26, 19);
  g.fillRect(2, -24, 6, 36);
  g.fillTriangle(8, -24, 8, -8, 24, -12);
  g.lineStyle(3, 0xffffff, 0.9).strokeEllipse(-8, 12, 26, 19);
  g.fillStyle(0xffffff, 0.7).fillCircle(-13, 8, 4);
  return g;
}

/**
 * Moto na montanha, no estilo Hill Climb.
 *
 * Verde acelera, vermelho freia. Subida ingreme pede embalo; descida rapida
 * demais joga a moto para o alto, e no ar acelerar levanta a frente e frear
 * abaixa. Pousar torto capota; cair num buraco tambem perde vida. Sao 3 vidas:
 * perdeu uma, volta na bandeira da fase. A cada fase a montanha fica mais
 * ingreme e, da fase 2 em diante, aparecem buracos com rampa (montanha.ts).
 */
export class MotoMontanha extends Phaser.Scene {
  private montanha!: Montanha;
  private mundo!: Phaser.GameObjects.Container;
  private terreno!: Phaser.GameObjects.Graphics;
  private morros!: Phaser.GameObjects.Graphics;
  private moto!: Phaser.GameObjects.Container;
  private rodas: Phaser.GameObjects.Graphics[] = [];
  private notas: { x: number; y: number; fig: Phaser.GameObjects.Graphics }[] = [];
  private semeadoAte = 600;
  private placar!: Phaser.GameObjects.Text;
  private faseTxt!: Phaser.GameObjects.Text;
  private coracoes: Phaser.GameObjects.Text[] = [];
  private pegas = 0;
  private vidas = VIDAS;
  private fase = 1;
  private melodia = 0;

  // estado da moto
  private x = 0;
  private y = 0;
  private u = 0;
  private vx = 0;
  private vy = 0;
  private omega = 0;
  private noAr = false;
  private angulo = 0;
  private parado = false;
  private camY = 0;
  private gas = false;
  private freio = false;

  constructor() {
    super('MotoMontanha');
  }

  create() {
    const p = ativo();
    if (p) {
      narrador.setNome(p.nome);
      narrador.setVoz(p.voz ?? 'f');
    }
    this.montanha = new Montanha(Math.floor(Math.random() * 1e9));
    this.notas = [];
    this.rodas = [];
    this.coracoes = [];
    Object.assign(this, { semeadoAte: 600, pegas: 0, vidas: VIDAS, fase: 1, melodia: 0, gas: false, freio: false });

    // paisagem pintada ao fundo e morros ao longe, que andam mais devagar que o chao
    cobrirTela(this, 0xcfe6f2).setDepth(-20);
    this.morros = this.add.graphics().setDepth(-18);
    carregar(this, ['bg_montanha'], () => {
      const im = this.add.image(W / 2, TELA.meio, 'bg_montanha').setDepth(-19);
      im.setScale(Math.max(W / im.width, TELA.altura / im.height));
    });

    this.mundo = this.add.container(0, 0).setScale(ZOOM);
    this.terreno = this.add.graphics();
    this.mundo.add(this.terreno);
    this.moto = this.montarMoto();
    this.mundo.add(this.moto);
    this.recomecar(this.montanha.bandeiras[0]);

    // placar: notas, fase e vidas
    const fundoPlacar = this.add.graphics().setDepth(40);
    fundoPlacar.fillStyle(0xffffff, 0.85);
    fundoPlacar.fillRoundedRect(W / 2 - 200, 60, 400, 76, 24);
    notaMusical(this, W / 2 - 160, 98, CORES_NOTA[0]).setDepth(41);
    this.placar = this.add
      .text(W / 2 - 130, 98, '0', { fontSize: '40px', color: '#2b3a4a', fontStyle: 'bold' })
      .setOrigin(0, 0.5)
      .setDepth(41);
    this.faseTxt = this.add
      .text(W / 2 + 180, 98, 'Fase 1', { fontSize: '34px', color: '#2b3a4a', fontStyle: 'bold' })
      .setOrigin(1, 0.5)
      .setDepth(41);
    for (let i = 0; i < VIDAS; i++) {
      this.coracoes.push(
        this.add.text(W / 2 + (i - 1) * 58, 172, '\u{2764}\u{FE0F}', { fontSize: '44px' }).setOrigin(0.5).setDepth(41),
      );
    }

    botaoVoltar(this, 'Joguinhos');
    botaoOuvir(this);
    this.controles();
    vigiarTempo(this);
    fale('jogo_moto');
  }

  /** Moto vista de lado, com a crianca sentada; o (0,0) e o chao entre as rodas. */
  private montarMoto() {
    const m = this.add.container(0, 0);
    const TRACO = 0x4a3428;
    const roda = (x: number) => {
      const g = this.add.graphics({ x, y: -RODA });
      g.fillStyle(0x3c4148, 1).fillCircle(0, 0, RODA);
      g.fillStyle(0xdfe5ea, 1).fillCircle(0, 0, RODA * 0.55);
      g.lineStyle(3, 0x8a96a3, 1);
      for (let i = 0; i < 3; i++) {
        const a = (i * Math.PI) / 3;
        g.lineBetween(-Math.cos(a) * RODA * 0.5, -Math.sin(a) * RODA * 0.5, Math.cos(a) * RODA * 0.5, Math.sin(a) * RODA * 0.5);
      }
      g.lineStyle(3, TRACO, 1).strokeCircle(0, 0, RODA);
      this.rodas.push(g);
      return g;
    };
    const tras = roda(-EIXO);
    // a crianca: so o tronco aparece, a carenagem tapa as pernas
    const cfg = ativo()?.personagem;
    const crianca = cfg ? desenharPersonagem(this, cfg, 0.3).setPosition(-4, -102) : null;
    const corpo = this.add.graphics();
    corpo.lineStyle(9, 0x8a96a3, 1).lineBetween(EIXO, -RODA, 30, -96);
    corpo.fillStyle(0xe85d5d, 1);
    corpo.lineStyle(3, TRACO, 1);
    const carenagem = [
      { x: -58, y: -62 }, { x: -44, y: -92 }, { x: 18, y: -92 }, { x: 40, y: -74 },
      { x: 44, y: -40 }, { x: 22, y: -26 }, { x: -30, y: -26 }, { x: -60, y: -40 },
    ];
    corpo.fillPoints(carenagem, true).strokePoints(carenagem, true, true);
    corpo.fillStyle(0xffffff, 0.35).fillRoundedRect(-36, -84, 46, 10, 5);
    corpo.fillStyle(0x4a4a52, 1).fillRoundedRect(-50, -100, 54, 12, 6);
    corpo.fillStyle(0xfff3b0, 1).fillCircle(44, -84, 9);
    corpo.lineStyle(3, TRACO, 1).strokeCircle(44, -84, 9);
    corpo.lineStyle(7, 0x4a4a52, 1).lineBetween(30, -96, 20, -116);
    const frente = roda(EIXO);
    const partes: Phaser.GameObjects.GameObject[] = [tras];
    if (crianca) partes.push(crianca);
    partes.push(corpo, frente);
    m.add(partes);
    return m;
  }

  /** Dois botoes grandes: freio a esquerda, acelerar a direita. Da para segurar os dois. */
  private controles() {
    this.input.addPointer(2);
    const y = TELA.baixo - 150;
    const botaoPedal = (x: number, cor: number, icone: string, liga: (sim: boolean) => void) => {
      const g = this.add.graphics().setDepth(40);
      const pintar = (apertado: boolean) => {
        g.clear();
        g.fillStyle(0x000000, 0.12).fillCircle(x, y + 8, 96);
        g.fillStyle(cor, apertado ? 1 : 0.92).fillCircle(x, y + (apertado ? 6 : 0), 92);
        g.lineStyle(6, 0xffffff, 0.9).strokeCircle(x, y + (apertado ? 6 : 0), 92);
      };
      pintar(false);
      this.add.text(x, y, icone, { fontSize: '76px' }).setOrigin(0.5).setDepth(41);
      const z = this.add.zone(x, y, 220, 220).setInteractive().setDepth(42);
      const ligar = (sim: boolean) => {
        liga(sim);
        pintar(sim);
      };
      z.on('pointerdown', () => ligar(true));
      z.on('pointerup', () => ligar(false));
      z.on('pointerout', () => ligar(false));
    };
    botaoPedal(150, 0xf28d8d, '\u{1F6D1}', (s) => (this.freio = s));
    botaoPedal(W - 150, 0x7ddc8a, '\u{1F680}', (s) => (this.gas = s));
    const teclado = this.input.keyboard;
    teclado?.on('keydown-RIGHT', () => (this.gas = true));
    teclado?.on('keyup-RIGHT', () => (this.gas = false));
    teclado?.on('keydown-LEFT', () => (this.freio = true));
    teclado?.on('keyup-LEFT', () => (this.freio = false));
  }

  /** Volta para a bandeira, parado e reto. */
  private recomecar(x: number) {
    // o tombo anima this.y: se ainda estiver rodando, nao pode escrever por cima
    this.tweens.killTweensOf(this);
    this.x = x;
    this.y = this.montanha.chao(x);
    Object.assign(this, { u: 0, vx: 0, vy: 0, omega: 0, noAr: false, angulo: 0, parado: false });
    this.camY = this.y;
    this.moto.setAlpha(1).setScale(1).setRotation(0);
  }

  update(_t: number, dms: number) {
    const dt = Math.min(dms, 50) / 1000;
    if (!this.parado) {
      for (let i = 0; i < PASSOS && !this.parado; i++) {
        if (this.noAr) this.voar(dt / PASSOS);
        else this.rodar(dt / PASSOS);
      }
      for (const r of this.rodas) r.rotation += (this.u * dt) / RODA;
      this.conferirFase();
    }
    this.moverCamera(dt);
    this.desenharTerreno();
    this.semear();
    this.pegarNotas();
  }

  /** No chao: a moto anda ao longo da rampa. */
  private rodar(dt: number) {
    const m = this.montanha;
    const a = Math.atan(m.inclinacao(this.x));
    let acel = GRAVIDADE * Math.sin(a) - ATRITO * this.u;
    if (this.gas) acel += ACELERA;
    if (this.freio) acel -= this.u > 20 ? FREIO : ACELERA * 0.5;
    this.u = Phaser.Math.Clamp(this.u + acel * dt, -RE_MAX, VEL_MAX);
    this.vx = this.u * Math.cos(a);
    this.vy = this.u * Math.sin(a);
    const nx = this.x + this.vx * dt;
    const solo = m.chao(nx);
    // saiu do chao: acabou a terra (buraco) ou o chao cai mais rapido que um tombo
    const queda = this.y + this.vy * dt + 0.5 * GRAVIDADE * dt * dt;
    if (!Number.isFinite(solo) || (solo > queda + 2 && this.u > 150)) {
      this.noAr = true;
      // saindo da rampa do buraco, sai reta; saindo de uma crista, sai girando
      // um pouco no ritmo em que o chao girava debaixo dela
      const adiante = Math.atan(m.inclinacao(this.x + this.vx * 0.05));
      this.omega = Number.isFinite(solo) ? Phaser.Math.Clamp((0.6 * (adiante - a)) / 0.05, -2, 2) : 0;
      this.x = nx;
      this.y = queda;
      return;
    }
    this.x = nx;
    this.y = solo;
    // o angulo vem das duas rodas: segue o chao sem a roda afundar na crista
    const tras = m.chao(this.x - EIXO);
    const frente = m.chao(this.x + EIXO);
    if (Number.isFinite(tras) && Number.isFinite(frente)) {
      const alvo = Math.atan2(frente - tras, 2 * EIXO);
      this.angulo = Phaser.Math.Angle.RotateTo(this.angulo, alvo, 8 * dt);
    }
  }

  /** No ar: cai, gira, e o jogador corrige o giro com os botoes. */
  private voar(dt: number) {
    const m = this.montanha;
    this.vy += GRAVIDADE * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.gas) this.omega -= GIRO_CONTROLE * dt;
    if (this.freio) this.omega += GIRO_CONTROLE * dt;
    this.omega *= 1 - 0.5 * dt;
    this.angulo += this.omega * dt;
    const solo = m.chao(this.x);
    if (!Number.isFinite(solo)) {
      // dentro do buraco: caiu la no fundo
      const buraco = m.buracos.find((b) => this.x >= b.x0 && this.x < b.x1);
      const borda = buraco ? m.chao(buraco.x0 - 1) : this.y;
      if (this.y > borda + 380) this.perderVida('buraco');
      return;
    }
    if (this.y < solo) return;
    // bateu de lado na parede do buraco (veio de baixo do chao)
    if (this.y - solo > 30) {
      this.perderVida('buraco');
      return;
    }
    const a = Math.atan(m.inclinacao(this.x));
    if (Math.abs(Phaser.Math.Angle.Wrap(this.angulo - a)) > CAPOTA) {
      this.perderVida('capotou');
      return;
    }
    // pousou: a velocidade vira velocidade ao longo da rampa
    this.u = Phaser.Math.Clamp(this.vx * Math.cos(a) + this.vy * Math.sin(a), -RE_MAX, VEL_MAX);
    this.y = solo;
    this.noAr = false;
    this.omega = 0;
    if (this.vy > 420) {
      nota(330);
      this.tweens.add({ targets: this.moto, scaleY: 0.9, duration: 90, yoyo: true });
    }
  }

  private perderVida(motivo: 'capotou' | 'buraco') {
    this.parado = true;
    this.vidas -= 1;
    const c = this.coracoes[this.vidas];
    if (c) this.tweens.add({ targets: c, alpha: 0.25, scale: 0.7, duration: 260 });
    nota(196);
    this.time.delayedCall(180, () => nota(147));
    // a moto pula, rola e some, e volta na bandeira da fase. Sobe um pouco
    // antes de girar: girando no lugar ela afundava no chao
    this.tweens.add({ targets: this, y: this.y - 70, duration: 700, ease: 'Quad.easeOut' });
    this.tweens.add({
      targets: this.moto,
      angle: this.moto.angle + (motivo === 'capotou' ? 200 : 40),
      alpha: 0.2,
      duration: 700,
    });
    if (this.vidas <= 0) {
      this.time.delayedCall(900, () => this.fim());
      return;
    }
    fale(motivo === 'capotou' ? 'jogo_moto_capotou' : 'jogo_moto_buraco');
    this.time.delayedCall(1400, () => this.recomecar(this.montanha.bandeiras[this.fase - 1] + 60));
  }

  private conferirFase() {
    const f = this.montanha.faseEm(this.x);
    if (f <= this.fase) return;
    this.fase = f;
    this.faseTxt.setText(`Fase ${f}`);
    [0, 140, 280, 420].forEach((t, i) => this.time.delayedCall(t, () => nota(659 + i * 131)));
    narrador.falar(`Fase ${f}!`);
    const aviso = this.add
      .text(W / 2, 420, `Fase ${f}!`, { fontSize: '96px', color: '#2b3a4a', fontStyle: 'bold' })
      .setOrigin(0.5)
      .setStroke('#ffffff', 16)
      .setDepth(45)
      .setScale(0);
    this.tweens.add({ targets: aviso, scale: 1, duration: 400, ease: 'Back.out', yoyo: true, hold: 900, onComplete: () => aviso.destroy() });
  }

  /** Acabaram as vidas: placar do passeio, sem castigo, e joga de novo. */
  private fim() {
    fale('jogo_moto_fim');
    const capa = this.add.container(0, 0).setDepth(80);
    capa.add(cobrirTela(this, 0x2b3a4a, 0.6));
    const g = this.add.graphics();
    g.fillStyle(0xf7f5f1, 1).fillRoundedRect(60, 300, W - 120, 700, 44);
    capa.add(g);
    capa.add(
      this.add.text(W / 2, 400, 'Que passeio!', { fontSize: '64px', color: '#2b3a4a', fontStyle: 'bold' }).setOrigin(0.5),
    );
    capa.add(notaMusical(this, W / 2 - 90, 540, CORES_NOTA[0]).setScale(1.8));
    capa.add(
      this.add.text(W / 2 - 40, 540, `${this.pegas}`, { fontSize: '72px', color: '#2b3a4a', fontStyle: 'bold' }).setOrigin(0, 0.5),
    );
    capa.add(
      this.add.text(W / 2, 650, `Você chegou na fase ${this.fase}`, { fontSize: '40px', color: '#2b3a4a' }).setOrigin(0.5),
    );
    capa.add(
      botao(this, W / 2, 790, 'Jogar de novo', () => this.scene.restart(), { icone: '\u{1F3AE}', cor: TEMA.sim, largura: 460 }),
    );
    capa.add(botao(this, W / 2, 920, 'Voltar', () => irPara(this, 'Joguinhos'), { icone: '\u{1F3E0}', largura: 460 }));
  }

  private moverCamera(dt: number) {
    if (!this.parado) this.camY = Phaser.Math.Linear(this.camY, this.y, Math.min(1, 4 * dt));
    this.mundo.x = X_TELA - this.x * ZOOM;
    this.mundo.y = TELA.topo + TELA.altura * 0.56 - this.camY * ZOOM;
    this.moto.setPosition(this.x, this.y);
    if (!this.parado) this.moto.setRotation(this.angulo);
  }

  private desenharTerreno() {
    const m = this.montanha;
    // pedaco do mundo que aparece na tela, ja descontado o zoom
    const x0 = this.x - X_TELA / ZOOM - 40;
    const x1 = x0 + W / ZOOM + 80;
    const baixo = (TELA.baixo - this.mundo.y) / ZOOM + 40;
    const g = this.terreno;
    g.clear();
    // o chao em pedacos: cada buraco interrompe o desenho
    const pedacos: { x: number; y: number }[][] = [];
    let atual: { x: number; y: number }[] = [];
    for (let x = x0; x <= x1; x += 10) {
      const y = m.chao(x);
      if (Number.isFinite(y)) atual.push({ x, y });
      else if (atual.length) {
        pedacos.push(atual);
        atual = [];
      }
    }
    if (atual.length) pedacos.push(atual);
    for (const pts of pedacos) {
      const a = pts[0].x;
      const b = pts[pts.length - 1].x;
      g.fillStyle(0xc8a27a, 1);
      g.fillPoints([...pts, { x: b, y: baixo }, { x: a, y: baixo }], true);
      g.lineStyle(60, 0xb58d66, 1).strokePoints(pts.map((p) => ({ x: p.x, y: p.y + 40 })), false);
      g.lineStyle(22, 0x8fd16e, 1).strokePoints(pts.map((p) => ({ x: p.x, y: p.y + 6 })), false);
      g.lineStyle(4, 0x5f9e4a, 1).strokePoints(pts.map((p) => ({ x: p.x, y: p.y - 4 })), false);
    }
    // bandeira no comeco de cada fase: e ali que a moto volta
    for (const [i, bx] of m.bandeiras.entries()) {
      if (bx < x0 - 100 || bx > x1 + 100) continue;
      const by = m.chao(bx);
      g.lineStyle(6, 0x6b4a32, 1).lineBetween(bx, by, bx, by - 150);
      g.fillStyle(i % 2 ? 0x4a90d9 : 0xe85d5d, 1).fillTriangle(bx, by - 150, bx, by - 104, bx + 60, by - 127);
    }

    // morros ao longe: andam a um quarto da velocidade
    const mo = this.morros;
    mo.clear();
    mo.fillStyle(0xbfe0c4, 1);
    const base = TELA.topo + TELA.altura * 0.6;
    const off = this.x * 0.25;
    const morros: { x: number; y: number }[] = [];
    for (let x = -20; x <= W + 20; x += 20) {
      morros.push({ x, y: base - 90 - 60 * Math.sin((x + off) / 160) - 40 * Math.sin((x + off) / 67 + 1) });
    }
    mo.fillPoints([...morros, { x: W + 20, y: TELA.baixo }, { x: -20, y: TELA.baixo }], true);
  }

  /** Notinhas em fileiras sobre os morros e em arco por cima dos buracos. */
  private semear() {
    const m = this.montanha;
    const ate = this.x + W / ZOOM + 200;
    while (this.semeadoAte < ate) {
      const x0 = this.semeadoAte;
      const buraco = m.buracos.find((b) => b.x0 >= x0 && b.x0 < x0 + 500);
      if (buraco) {
        // arco por cima do buraco: premio para quem pula
        const meio = (buraco.x0 + buraco.x1) / 2;
        const base = m.chao(buraco.x0 - 1);
        for (let i = -2; i <= 2; i++) this.porNota(meio + i * 45, base - 130 + Math.abs(i) * 26);
        this.semeadoAte = buraco.x1 + 300;
        continue;
      }
      const n = Phaser.Math.Between(3, 5);
      for (let i = 0; i < n; i++) {
        const x = x0 + i * 44;
        const y = m.chao(x);
        if (Number.isFinite(y)) this.porNota(x, y - 70);
      }
      this.semeadoAte = x0 + Phaser.Math.Between(340, 560);
    }
  }

  private porNota(x: number, y: number) {
    const fig = notaMusical(this, x, y, CORES_NOTA[this.notas.length % CORES_NOTA.length]);
    // depois do terreno e antes da moto: a moto passa por cima
    this.mundo.addAt(fig, 1);
    this.tweens.add({ targets: fig, y: y - 8, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.notas.push({ x, y, fig });
  }

  private pegarNotas() {
    for (let i = this.notas.length - 1; i >= 0; i--) {
      const c = this.notas[i];
      const longe = c.x < this.x - W;
      const perto = !this.parado && Math.abs(c.x - this.x) < 56 && Math.abs(c.y - (this.y - 60)) < 80;
      if (!perto && !longe) continue;
      if (perto) {
        this.pegas += 1;
        this.placar.setText(String(this.pegas));
        // cada notinha toca a proxima nota da melodia
        nota(MELODIA[this.melodia % MELODIA.length]);
        this.melodia += 1;
        const fig = c.fig;
        this.tweens.killTweensOf(fig);
        this.tweens.add({ targets: fig, y: fig.y - 60, alpha: 0, scale: 1.5, duration: 300, onComplete: () => fig.destroy() });
      } else {
        c.fig.destroy();
      }
      this.notas.splice(i, 1);
    }
  }
}
