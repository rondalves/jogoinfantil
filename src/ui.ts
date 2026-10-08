import Phaser from 'phaser';
import { AUDIOS } from './assets';
import { CONFIG } from './config';
import { estrelasTotais } from './economia';
import { narrador } from './narrador';
import type { Perfil } from './storage';
import { TEMA } from './theme';

export type Fig = Phaser.GameObjects.Image | Phaser.GameObjects.Text;

const W = CONFIG.LARGURA;

/** Imagem de /assets/img se existir; senao o emoji placeholder, no mesmo tamanho. */
export function figura(
  cena: Phaser.Scene,
  x: number,
  y: number,
  img: string | undefined,
  icone: string,
  tam = 128,
): Fig {
  if (img && cena.textures.exists(img)) {
    const s = cena.add.image(x, y, img).setOrigin(0.5);
    s.setScale(tam / Math.max(s.width, s.height)); // mantem a proporcao da arte
    return s;
  }
  return cena.add.text(x, y, icone, { fontSize: `${tam}px` }).setOrigin(0.5);
}

/** Toque com area minima garantida (dedo de crianca). */
export function toque(o: Fig, fn: (p: Phaser.Input.Pointer) => void) {
  const b = o.getBounds();
  const l = Math.max(b.width, CONFIG.MIN_TOQUE);
  const a = Math.max(b.height, CONFIG.MIN_TOQUE);
  const hit = new Phaser.Geom.Rectangle(
    b.width / 2 - l / 2,
    b.height / 2 - a / 2,
    l,
    a,
  );
  o.setInteractive(hit, Phaser.Geom.Rectangle.Contains);
  o.on('pointerdown', fn);
  return o;
}

export function tremer(cena: Phaser.Scene, o: Phaser.GameObjects.Components.Transform) {
  const alvo = o as unknown as { x: number };
  const x = alvo.x;
  cena.tweens.add({
    targets: o,
    x: x - 14,
    duration: 60,
    yoyo: true,
    repeat: 3,
    onComplete: () => {
      alvo.x = x;
    },
  });
}

/** Troca de tela com escurecida suave, sem corte seco. */
export function irPara(cena: Phaser.Scene, destino: string, dados?: object) {
  narrador.parar();
  const camera = cena.cameras.main;
  camera.fadeOut(TEMA.transicao, 0, 0, 0);
  camera.once('camerafadeoutcomplete', () => cena.scene.start(destino, dados));
}

/** Chuva de papeis coloridos: fim de missao e de mundo. */
export function confete(cena: Phaser.Scene, quantidade = 40) {
  for (let i = 0; i < quantidade; i++) {
    const papel = cena.add
      .rectangle(
        Phaser.Math.Between(40, W - 40),
        Phaser.Math.Between(-300, -20),
        Phaser.Math.Between(14, 26),
        Phaser.Math.Between(20, 34),
        Phaser.Utils.Array.GetRandom(TEMA.confete),
      )
      .setDepth(60)
      .setAngle(Phaser.Math.Between(0, 360));
    cena.tweens.add({
      targets: papel,
      y: CONFIG.ALTURA + 60,
      angle: papel.angle + Phaser.Math.Between(180, 540),
      x: papel.x + Phaser.Math.Between(-80, 80),
      duration: Phaser.Math.Between(1800, 3200),
      delay: Phaser.Math.Between(0, 700),
      ease: 'Sine.easeIn',
      onComplete: () => papel.destroy(),
    });
  }
}

/** Cor chapada ou, se a imagem existir em /assets/img, o cenario cobrindo a tela. */
export function fundo(cena: Phaser.Scene, fundoCor: number, imagem?: string) {
  cena.cameras.main.fadeIn(TEMA.transicao, 0, 0, 0);
  cena.add.rectangle(W / 2, CONFIG.ALTURA / 2, W, CONFIG.ALTURA, fundoCor).setDepth(-10);
  if (!imagem || !cena.textures.exists(imagem)) return;
  const im = cena.add.image(W / 2, CONFIG.ALTURA / 2, imagem).setDepth(-9);
  im.setScale(Math.max(W / im.width, CONFIG.ALTURA / im.height));
}

export function titulo(cena: Phaser.Scene, texto: string, y = 180) {
  return cena.add
    .text(W / 2, y, texto, {
      fontSize: `${TEMA.titulo}px`,
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: W - 110 },
    })
    .setStroke('#ffffff', 10)
    .setOrigin(0.5);
}

export interface OpcoesBotao {
  icone?: string;
  largura?: number;
  cor?: number;
  tamanhoTexto?: number;
}

export function botao(
  cena: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
  op: OpcoesBotao = {},
): Phaser.GameObjects.Container {
  const l = op.largura ?? Math.min(W - 60, 240 + label.length * 24);
  const a = 128;
  const c = cena.add.container(x, y);
  const g = cena.add.graphics();
  const corBotao = op.cor ?? TEMA.acao;
  g.fillStyle(0x000000, 0.12);
  g.fillRoundedRect(-l / 2, -a / 2 + 10, l, a, 32);
  g.fillStyle(corBotao, 1);
  g.fillRoundedRect(-l / 2, -a / 2, l, a, 32);
  g.lineStyle(6, 0xffffff, 0.85);
  g.strokeRoundedRect(-l / 2, -a / 2, l, a, 32);
  c.add(g);
  if (op.icone) {
    c.add(cena.add.text(-l / 2 + 60, 0, op.icone, { fontSize: '60px' }).setOrigin(0.5));
  }
  c.add(
    cena.add
      .text(op.icone ? 30 : 0, 0, label, {
        fontSize: `${op.tamanhoTexto ?? TEMA.botao}px`,
        color: '#3a2a10',
        fontStyle: 'bold',
      })
      .setOrigin(0.5),
  );
  c.setSize(l, a).setInteractive({ useHandCursor: true });
  c.on('pointerdown', () => {
    nota(740);
    cena.tweens.add({ targets: c, scale: 0.92, duration: 80, yoyo: true, ease: 'Quad.easeOut' });
    onClick();
  });
  return c;
}

/** Botao de ouvir de novo, sempre visivel. */
export function botaoOuvir(cena: Phaser.Scene, x = W - 86, y = 96) {
  const b = figura(cena, x, y, 'botao_som', '\u{1F50A}', 96).setDepth(50);
  return toque(b, () => narrador.repetir());
}

export function botaoVoltar(cena: Phaser.Scene, destino: string, dados?: object) {
  const b = figura(cena, 86, 96, 'botao_voltar', '\u{2B05}\u{FE0F}', 96).setDepth(50);
  return toque(b, () => irPara(cena, destino, dados));
}

/** Saldo de moedas, fichas e estrelas, com os icones da arte. */
export function hud(cena: Phaser.Scene, p: Perfil, y = 96, x = 24, origemX = 0) {
  const itens: [string, string, number][] = [
    ['moeda', '\u{1FA99}', p.moedas],
    ['ficha', '\u{1F39F}\u{FE0F}', p.fichas],
    ['estrela', '\u{2B50}', estrelasTotais(p)],
  ];
  const passo = 160;
  const c = cena.add.container(x - origemX * (itens.length * passo - 50), y).setDepth(50);
  const fundoBarra = cena.add.graphics();
  fundoBarra.fillStyle(0xffffff, 0.75);
  fundoBarra.fillRoundedRect(-14, -40, itens.length * passo - 24, 80, 24);
  c.add(fundoBarra);
  itens.forEach(([chave, emoji, valor], i) => {
    c.add(figura(cena, i * passo + 22, 0, chave, emoji, 60));
    c.add(
      cena.add
        .text(i * passo + 60, 0, String(valor), { fontSize: '40px', color: '#2b3a4a', fontStyle: 'bold' })
        .setOrigin(0, 0.5),
    );
  });
  return c;
}

/** Texto sobre uma faixa clara: legivel mesmo em cima do cenario. */
export function textoEmPainel(
  cena: Phaser.Scene,
  x: number,
  y: number,
  conteudo: string,
  tamanho = 38,
  larguraMax = W - 120,
): Phaser.GameObjects.Container {
  const c = cena.add.container(0, 0);
  const t = cena.add
    .text(x, y, conteudo, { fontSize: `${tamanho}px`, align: 'center', wordWrap: { width: larguraMax - 48 } })
    .setOrigin(0.5);
  const g = cena.add.graphics();
  g.fillStyle(0xffffff, 0.88);
  g.fillRoundedRect(x - t.width / 2 - 24, y - t.height / 2 - 14, t.width + 48, t.height + 28, 22);
  c.add([g, t]);
  return c;
}

/** Balao da raposinha com a frase narrada. */
export function balao(cena: Phaser.Scene, texto: string, y = 340, mascote = true) {
  const c = cena.add.container(0, 0);
  const g = cena.add.graphics();
  g.fillStyle(0xffffff, 0.95);
  g.fillRoundedRect(60, y - 110, W - 120, 220, 36);
  c.add(g);
  if (mascote) c.add(figura(cena, 140, y + 150, 'mascote_raposinha', '\u{1F98A}', 150));
  c.add(
    cena.add
      .text(W / 2, y, texto, {
        fontSize: '42px',
        color: '#2b3a4a',
        align: 'center',
        wordWrap: { width: W - 200 },
      })
      .setOrigin(0.5),
  );
  return c;
}

export function estrelasNaTela(cena: Phaser.Scene, qtd: number, max: number, y: number) {
  const c = cena.add.container(0, 0);
  for (let i = 0; i < max; i++) {
    const x = W / 2 + (i - (max - 1) / 2) * 140;
    const e = i < qtd
      ? figura(cena, x, y, 'estrela', '\u{2B50}', 130)
      : figura(cena, x, y, 'estrela_vazia', '\u{2606}', 130);
    if (i < qtd) {
      const cheia = e.scale;
      e.setScale(0);
      cena.tweens.add({ targets: e, scale: cheia, duration: 420, delay: 250 * i, ease: 'Back.out' });
    }
    c.add(e);
  }
  return c;
}

let ctxAudio: AudioContext | null = null;

/** Notinha curta sem precisar de arquivo de audio. */
export function nota(freq: number) {
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    ctxAudio = ctxAudio ?? new Ctor();
    const o = ctxAudio.createOscillator();
    const g = ctxAudio.createGain();
    o.type = 'triangle';
    o.frequency.value = freq;
    g.gain.value = 0.06;
    o.connect(g);
    g.connect(ctxAudio.destination);
    o.start();
    o.stop(ctxAudio.currentTime + 0.12);
  } catch {
    // sem audio: o jogo segue em silencio
  }
}

const ESCALA = [523, 587, 659, 698, 784, 880, 988];

/**
 * Timer musical: arco de progresso + notinha a cada 5 s.
 * Toca /assets/audio/musica_timer.mp3 em loop quando o arquivo existir.
 */
export class TimerMusical {
  private g: Phaser.GameObjects.Graphics;
  private rotulo: Phaser.GameObjects.Text;
  private evento: Phaser.Time.TimerEvent;
  private musica?: HTMLAudioElement;
  private passados = 0;
  private pausado = false;
  private ultimaNota = -1;

  constructor(
    cena: Phaser.Scene,
    private x: number,
    private y: number,
    private segundos: number,
    private onFim: () => void,
    private raio = 92,
  ) {
    this.g = cena.add.graphics();
    this.rotulo = cena.add
      .text(x, y, '', { fontSize: '44px', color: '#ffffff', fontStyle: 'bold' })
      .setOrigin(0.5)
      .setStroke('#12263a', 8);
    const url = AUDIOS['musica_timer'];
    if (url) {
      this.musica = new Audio(url);
      this.musica.loop = true;
      this.musica.volume = 0.4;
      this.musica.play().catch(() => undefined);
    }
    this.evento = cena.time.addEvent({ delay: 100, loop: true, callback: () => this.tique() });
    this.desenhar();
  }

  get progresso() {
    return Math.min(1, this.passados / this.segundos);
  }

  pausar() {
    this.pausado = true;
    this.musica?.pause();
  }

  retomar() {
    this.pausado = false;
    this.musica?.play().catch(() => undefined);
  }

  private tique() {
    if (this.pausado) return;
    this.passados += 0.1;
    const s = Math.floor(this.passados);
    if (s % 5 === 0 && s !== this.ultimaNota) {
      this.ultimaNota = s;
      nota(ESCALA[(s / 5) % ESCALA.length]);
    }
    this.desenhar();
    if (this.passados >= this.segundos) {
      nota(1047);
      this.destruir();
      this.onFim();
    }
  }

  private desenhar() {
    const falta = Math.max(0, Math.ceil(this.segundos - this.passados));
    this.rotulo.setText(`${Math.floor(falta / 60)}:${String(falta % 60).padStart(2, '0')}`);
    this.g.clear();
    this.g.fillStyle(0x12263a, 0.42); // disco escuro: o anel some em cenario claro
    this.g.fillCircle(this.x, this.y, this.raio + 12);
    this.g.lineStyle(18, 0xffffff, 0.95);
    this.g.strokeCircle(this.x, this.y, this.raio);
    this.g.lineStyle(18, 0x51cf66, 1);
    this.g.beginPath();
    this.g.arc(
      this.x,
      this.y,
      this.raio,
      Phaser.Math.DegToRad(-90),
      Phaser.Math.DegToRad(-90 + 360 * this.progresso),
    );
    this.g.strokePath();
  }

  destruir() {
    this.evento.remove();
    this.g.destroy();
    this.rotulo.destroy();
    this.musica?.pause();
    this.musica = undefined;
  }
}
