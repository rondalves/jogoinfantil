import Phaser from 'phaser';
import { CONFIG } from '../config';
import { chao, inclinacao } from '../montanha';
import { fale } from '../narracoes';
import { narrador } from '../narrador';
import { desenharPersonagem } from '../personagem';
import { ativo } from '../storage';
import { vigiarTempo } from '../tempoDeJogo';
import { botaoOuvir, botaoVoltar, cobrirTela, figura, nota, TELA } from '../ui';

const W = CONFIG.LARGURA;

// fisica em px e segundos
const GRAVIDADE = 1100;
const ACELERA = 900;
const FREIO = 1300;
const VEL_MAX = 620;
const RE_MAX = 220;
const ATRITO = 0.35;
/** metade da distancia entre as rodas */
const EIXO = 52;
const RODA = 26;
/** onde a moto fica na tela, em x */
const X_TELA = 230;
/** zoom do mundo: moto e montanha maiores para a crianca ver bem */
const ZOOM = 1.3;

/**
 * Moto na montanha, no estilo Hill Climb: segura o verde para acelerar e
 * sobe a montanha pegando moedas. Feito para crianca de 4 a 7 anos: a moto
 * nunca capota (no ar ela se endireita sozinha), nao tem combustivel e nao
 * tem fim. O chao vem de src/montanha.ts.
 */
export class MotoMontanha extends Phaser.Scene {
  private mundo!: Phaser.GameObjects.Container;
  private terreno!: Phaser.GameObjects.Graphics;
  private morros!: Phaser.GameObjects.Graphics;
  private moto!: Phaser.GameObjects.Container;
  private rodas: Phaser.GameObjects.Graphics[] = [];
  private moedas: { x: number; y: number; fig: Phaser.GameObjects.Image | Phaser.GameObjects.Text; pontos: number }[] = [];
  private proximaMoeda = 700;
  private placar!: Phaser.GameObjects.Text;
  private distancia!: Phaser.GameObjects.Text;
  private pontos = 0;

  // estado da moto
  private x = 140;
  private y = chao(140);
  private u = 0;
  private vx = 0;
  private vy = 0;
  private noAr = false;
  private angulo = 0;
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
    Object.assign(this, { x: 140, u: 0, vx: 0, vy: 0, noAr: false, angulo: 0, pontos: 0, proximaMoeda: 700 });
    this.y = chao(this.x);
    this.moedas = [];
    this.rodas = [];

    // ceu em degrade e morros ao longe, que andam mais devagar que o chao
    cobrirTela(this, 0xcfe6f2).setDepth(-20);
    const ceu = this.add.graphics().setDepth(-19);
    ceu.fillGradientStyle(0x9fd0ee, 0x9fd0ee, 0xf7efe0, 0xf7efe0, 1);
    ceu.fillRect(0, TELA.topo, W, TELA.altura * 0.7);
    this.add.circle(W - 150, TELA.topo + 230, 60, 0xfff3b0).setDepth(-19);
    this.morros = this.add.graphics().setDepth(-18);

    this.mundo = this.add.container(0, 0).setScale(ZOOM);
    this.terreno = this.add.graphics();
    this.mundo.add(this.terreno);
    this.moto = this.montarMoto();
    this.mundo.add(this.moto);
    this.camY = this.y;

    // placar: moedas e metros
    const fundoPlacar = this.add.graphics().setDepth(40);
    fundoPlacar.fillStyle(0xffffff, 0.85);
    fundoPlacar.fillRoundedRect(W / 2 - 200, 60, 400, 76, 24);
    figura(this, W / 2 - 160, 98, 'moeda', '\u{1FA99}', 54).setDepth(41);
    this.placar = this.add.text(W / 2 - 122, 98, '0', { fontSize: '40px', color: '#2b3a4a', fontStyle: 'bold' }).setOrigin(0, 0.5).setDepth(41);
    this.distancia = this.add.text(W / 2 + 170, 98, '0 m', { fontSize: '36px', color: '#2b3a4a' }).setOrigin(1, 0.5).setDepth(41);

    botaoVoltar(this, 'Joguinhos');
    botaoOuvir(this);
    this.controles();
    vigiarTempo(this);
    fale('jogo_moto');
  }

  /** Moto vista de lado, com a crianca sentada; o (0,0) e o chao entre as rodas. */
  private montarMoto() {
    const m = this.add.container(this.x, this.y);
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
    // braco do guidao, do farol ate a roda da frente
    corpo.lineStyle(9, 0x8a96a3, 1).lineBetween(EIXO, -RODA, 30, -96);
    // carenagem: do banco ate perto do chao, cobre as pernas da crianca
    corpo.fillStyle(0xe85d5d, 1);
    corpo.lineStyle(3, TRACO, 1);
    const carenagem = [
      { x: -58, y: -62 }, { x: -44, y: -92 }, { x: 18, y: -92 }, { x: 40, y: -74 },
      { x: 44, y: -40 }, { x: 22, y: -26 }, { x: -30, y: -26 }, { x: -60, y: -40 },
    ];
    corpo.fillPoints(carenagem, true).strokePoints(carenagem, true, true);
    corpo.fillStyle(0xffffff, 0.35).fillRoundedRect(-36, -84, 46, 10, 5);
    // banco e farol
    corpo.fillStyle(0x4a4a52, 1).fillRoundedRect(-50, -100, 54, 12, 6);
    corpo.fillStyle(0xfff3b0, 1).fillCircle(44, -84, 9);
    corpo.lineStyle(3, TRACO, 1).strokeCircle(44, -84, 9);
    // guidao
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

  update(_t: number, dms: number) {
    const dt = Math.min(dms, 50) / 1000;
    if (this.noAr) this.voar(dt);
    else this.rodar(dt);

    this.moverCamera(dt);
    this.desenharTerreno();
    this.semearMoedas();
    this.pegarMoedas();
    for (const r of this.rodas) r.rotation += (this.u * dt) / RODA;
    this.distancia.setText(`${Math.max(0, Math.round((this.x - 140) / 40))} m`);
  }

  /** No chao: a moto anda ao longo da rampa. */
  private rodar(dt: number) {
    const a = Math.atan(inclinacao(this.x));
    let acel = GRAVIDADE * Math.sin(a) - ATRITO * this.u;
    if (this.gas) acel += ACELERA;
    if (this.freio) acel -= this.u > 20 ? FREIO : ACELERA * 0.5;
    this.u = Phaser.Math.Clamp(this.u + acel * dt, -RE_MAX, VEL_MAX);
    this.vx = this.u * Math.cos(a);
    this.vy = this.u * Math.sin(a);
    const nx = this.x + this.vx * dt;
    // se o chao cai mais rapido que um tombo, a moto sai voando
    const queda = this.y + this.vy * dt + 0.5 * GRAVIDADE * dt * dt;
    if (chao(nx) > queda + 3 && this.u > 260) {
      this.noAr = true;
      this.x = nx;
      this.y = queda;
      return;
    }
    this.x = Math.max(60, nx);
    this.y = chao(this.x);
    // o angulo vem das duas rodas: segue o chao sem a roda afundar na crista
    const alvo = Math.atan2(chao(this.x + EIXO) - chao(this.x - EIXO), 2 * EIXO);
    this.angulo = Phaser.Math.Angle.RotateTo(this.angulo, alvo, 6 * dt);
  }

  /** No ar: cai como uma bola e se endireita sozinha antes de pousar. */
  private voar(dt: number) {
    this.vy += GRAVIDADE * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    const alvo = Math.atan(inclinacao(this.x + this.vx * 0.15));
    this.angulo = Phaser.Math.Angle.RotateTo(this.angulo, alvo, 2.5 * dt);
    const solo = chao(this.x);
    if (this.y < solo) return;
    // pousou: a velocidade vira velocidade ao longo da rampa
    const a = Math.atan(inclinacao(this.x));
    this.u = Phaser.Math.Clamp(this.vx * Math.cos(a) + this.vy * Math.sin(a), -RE_MAX, VEL_MAX);
    this.y = solo;
    this.noAr = false;
    if (this.vy > 380) {
      nota(330);
      this.tweens.add({ targets: this.moto, scaleY: 0.9, duration: 90, yoyo: true });
    }
  }

  private moverCamera(dt: number) {
    this.camY = Phaser.Math.Linear(this.camY, this.y, Math.min(1, 4 * dt));
    this.mundo.x = X_TELA - this.x * ZOOM;
    this.mundo.y = TELA.topo + TELA.altura * 0.58 - this.camY * ZOOM;
    this.moto.setPosition(this.x, this.y).setRotation(this.angulo);
  }

  private desenharTerreno() {
    // pedaco do mundo que aparece na tela, ja descontado o zoom
    const x0 = this.x - X_TELA / ZOOM - 40;
    const x1 = x0 + W / ZOOM + 80;
    const baixo = (TELA.baixo - this.mundo.y) / ZOOM + 40;
    const pts: { x: number; y: number }[] = [];
    for (let x = x0; x <= x1; x += 12) pts.push({ x, y: chao(x) });
    const g = this.terreno;
    g.clear();
    g.fillStyle(0xc8a27a, 1);
    g.fillPoints([...pts, { x: x1, y: baixo }, { x: x0, y: baixo }], true);
    // faixa mais escura de terra e a grama por cima
    g.lineStyle(60, 0xb58d66, 1).strokePoints(pts.map((p) => ({ x: p.x, y: p.y + 40 })), false);
    g.lineStyle(22, 0x8fd16e, 1).strokePoints(pts.map((p) => ({ x: p.x, y: p.y + 6 })), false);
    g.lineStyle(4, 0x5f9e4a, 1).strokePoints(pts.map((p) => ({ x: p.x, y: p.y - 4 })), false);

    // morros ao longe: andam a um terco da velocidade
    const m = this.morros;
    m.clear();
    m.fillStyle(0xbfe0c4, 1);
    const base = TELA.topo + TELA.altura * 0.62;
    const off = this.x * 0.3;
    const morros: { x: number; y: number }[] = [];
    for (let x = -20; x <= W + 20; x += 20) {
      morros.push({ x, y: base - 90 - 60 * Math.sin((x + off) / 160) - 40 * Math.sin((x + off) / 67 + 1) });
    }
    m.fillPoints([...morros, { x: W + 20, y: TELA.baixo }, { x: -20, y: TELA.baixo }], true);
  }

  /** Moedas em fileirinhas sobre o chao, e uma estrela de vez em quando. */
  private semearMoedas() {
    while (this.proximaMoeda < this.x + W / ZOOM) {
      const estrela = Math.random() < 0.18;
      const n = estrela ? 1 : Phaser.Math.Between(3, 5);
      for (let i = 0; i < n; i++) {
        const x = this.proximaMoeda + i * 46;
        const y = chao(x) - 64;
        const fig = estrela ? figura(this, x, y, 'estrela', '\u{2B50}', 62) : figura(this, x, y, 'moeda', '\u{1FA99}', 46);
        this.mundo.add(fig);
        this.moedas.push({ x, y, fig, pontos: estrela ? 5 : 1 });
      }
      this.proximaMoeda += Phaser.Math.Between(320, 560);
    }
  }

  private pegarMoedas() {
    for (let i = this.moedas.length - 1; i >= 0; i--) {
      const c = this.moedas[i];
      const longe = c.x < this.x - W;
      const perto = Math.abs(c.x - this.x) < 52 && Math.abs(c.y - (this.y - 60)) < 70;
      if (!perto && !longe) continue;
      if (perto) {
        this.pontos += c.pontos;
        this.placar.setText(String(this.pontos));
        nota(c.pontos > 1 ? 1047 : 880);
        const fig = c.fig;
        this.tweens.add({ targets: fig, y: fig.y - 50, alpha: 0, duration: 260, onComplete: () => fig.destroy() });
      } else {
        c.fig.destroy();
      }
      this.moedas.splice(i, 1);
    }
  }
}
