import Phaser from 'phaser';
import { AUDIOS_HISTORIA } from '../assets';
import { CONFIG } from '../config';
import { musica, musicaDoMundo } from '../musica';
import { narrador } from '../narrador';
import { HISTORIAS, type Historia as Hist, type Pagina } from '../stories';
import { TEMA } from '../theme';
import { botaoVoltar, carregarCapas, cobrirTela, figura, TELA, titulo } from '../ui';

const W = CONFIG.LARGURA;
const VIRADA = 900; // ms do esmaecer entre paginas: devagar, para nao acordar ninguem
const ARTE = /^[a-z0-9_]+$/; // peca com nome de arquivo; o resto e emoji

/** Cor e forca do veu por clima: a noite escurece o cenario, a manha so aquece. */
const VEUS: Record<string, [number, number]> = {
  noite: [0x0d1430, 0.38],
  sono: [0x0d1430, 0.5],
  estrelas: [0x0d1430, 0.42],
  respira: [0x0d1430, 0.5],
  crepusculo: [0x5a2d60, 0.22],
  aurora: [0xffb07a, 0.14],
  tarde: [0xffd9a0, 0.1],
};
const NOTURNO = new Set(['noite', 'sono', 'estrelas', 'respira']);

/** Onde vao as pecas, conforme o lugar da raposinha: [x, y, tamanho]. */
const VAGAS: Record<string, [number, number, number][]> = {
  nao: [[360, 560, 260], [190, 600, 200], [530, 600, 200]],
  centro: [[140, 430, 150], [580, 430, 150], [360, 250, 130]],
  esq: [[520, 520, 170], [570, 330, 140], [410, 300, 120]],
  dir: [[200, 520, 170], [150, 330, 140], [310, 300, 120]],
  sono: [[150, 330, 130], [570, 330, 130], [360, 250, 110]],
};

/**
 * Ouvindo uma historinha: um livro animado.
 *
 * Cada pagina e um cenario do jogo com a raposinha, umas pecas e o texto do
 * trecho, e vira sozinha quando o audio chega nela (tempos em
 * src/stories/*.json, gerados por tools/livro.py). Tudo se mexe devagar: o
 * cenario aproxima, as pecas boiam, as estrelas piscam. Nao tem estrela, nao
 * tem acerto nem erro, e sair no meio nao perde nada.
 */
export class Historia extends Phaser.Scene {
  private som?: HTMLAudioElement;
  private tocando = false;
  private h!: Hist;
  private paginas: Pagina[] = [];
  private atual = -1;
  private pagina?: Phaser.GameObjects.Container;
  private pronto = false;

  constructor() {
    super('Historia');
  }

  create(dados: { id?: string }) {
    this.h = HISTORIAS.find((x) => x.id === dados?.id) ?? HISTORIAS[0];
    this.paginas = this.h.paginas?.length ? this.h.paginas : [{ t: 0, capa: true }];
    this.atual = -1;
    this.pagina = undefined;
    this.pronto = false;
    narrador.parar();
    // o mp3 da historinha ja traz a cancao de ninar; chave sem arquivo = silencio
    musica('silencio');
    this.cameras.main.fadeIn(TEMA.transicao, 0, 0, 0);
    cobrirTela(this, TEMA.escuro).setDepth(-10);
    botaoVoltar(this, 'Historinhas');

    const chaves = new Set<string>([this.h.capa, 'bg_quarto_noite', 'm19_cama']);
    for (const p of this.paginas) {
      for (const k of [p.fundo, p.arte, ...(p.pecas ?? [])]) if (k && ARTE.test(k)) chaves.add(k);
    }
    carregarCapas(this, [...chaves], () => {
      this.pronto = true;
      this.mostrar(this.indice());
    });

    const url = AUDIOS_HISTORIA[this.h.audio];
    if (!url) {
      narrador.falar('Essa historinha ainda está sendo gravada. Volte em breve!');
      return;
    }
    this.som = new Audio(url);
    this.som.addEventListener('ended', () => this.pintar(false));
    this.controles();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.som?.pause();
      this.som = undefined;
      musicaDoMundo();
    });
    // comeca tocando: a crianca tocou no cartao para ouvir, nao para olhar
    this.time.delayedCall(400, () => this.alternar());
  }

  /** Pagina do momento do audio: a ultima cujo tempo ja passou. */
  private indice() {
    const t = this.som?.currentTime ?? 0;
    let i = 0;
    while (i + 1 < this.paginas.length && this.paginas[i + 1].t <= t) i++;
    return i;
  }

  private mostrar(i: number) {
    if (i === this.atual) return;
    this.atual = i;
    const velha = this.pagina;
    const nova = this.montar(this.paginas[i], i);
    nova.setAlpha(0);
    this.pagina = nova;
    this.tweens.add({ targets: nova, alpha: 1, duration: VIRADA, ease: 'Sine.easeInOut' });
    if (velha) {
      this.tweens.add({
        targets: velha,
        alpha: 0,
        duration: VIRADA,
        ease: 'Sine.easeInOut',
        onComplete: () => this.descartar(velha),
      });
    }
  }

  /** Some com a pagina e com tudo que se mexia nela. */
  private descartar(c: Phaser.GameObjects.Container) {
    (c.getData('timers') as Phaser.Time.TimerEvent[] | undefined)?.forEach((t) => t.remove());
    c.each((o: Phaser.GameObjects.GameObject) => this.tweens.killTweensOf(o));
    this.tweens.killTweensOf(c);
    c.destroy();
  }

  private montar(p: Pagina, i: number): Phaser.GameObjects.Container {
    const c = this.add.container(0, 0).setDepth(0);
    c.setData('timers', []);
    const proxima = this.paginas[i + 1]?.t ?? p.t + 12;
    const duracao = Math.max(6000, (proxima - p.t) * 1000 + VIRADA);
    const clima = p.capa || p.fim ? 'noite' : p.clima ?? 'calmo';

    // cenario: a ilustracao propria, se existir; senao o cenario do jogo
    const arte = p.arte && this.textures.exists(p.arte) ? p.arte : undefined;
    const chaveFundo = arte ?? (p.fundo && this.textures.exists(p.fundo) ? p.fundo : 'bg_quarto_noite');
    if (this.textures.exists(chaveFundo)) {
      const bg = this.add.image(W / 2, TELA.meio, chaveFundo);
      const s = Math.max(W / bg.width, TELA.altura / bg.height) * 1.04;
      bg.setScale(s);
      c.add(bg);
      // aproxima devagar a pagina inteira, um lado ou outro
      this.tweens.add({ targets: bg, scale: s * 1.08, x: W / 2 + (i % 2 ? 14 : -14), duration: duracao, ease: 'Sine.easeInOut' });
    }
    const [cor, forca] = VEUS[clima] ?? [0, 0];
    if (forca) c.add(this.add.rectangle(W / 2, TELA.meio, W, TELA.altura, cor, forca));

    this.clima(c, clima);

    if (p.capa) {
      const capa = figura(this, W / 2, 520, this.h.capa, this.h.icone, 440);
      c.add(capa);
      this.tweens.add({ targets: capa, scale: capa.scale * 1.03, duration: 4000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      c.add(titulo(this, this.h.titulo, 860));
      return c;
    }

    const raposa = p.fim ? 'sono' : p.raposa ?? 'centro';
    if (!arte) {
      if (raposa === 'sono') this.dormindo(c);
      else if (raposa !== 'nao') this.raposinha(c, raposa);
      this.pecas(c, p.pecas ?? [], raposa);
    }

    this.cartao(c, p.fim ? 'Boa noite.' : p.texto ?? '', !!p.fim);
    return c;
  }

  private raposinha(c: Phaser.GameObjects.Container, lado: string) {
    const x = lado === 'esq' ? 200 : lado === 'dir' ? 520 : W / 2;
    const r = this.add.image(x, 830, 'mascote_raposinha').setOrigin(0.5, 1);
    const s = 380 / r.height;
    r.setScale(s);
    if (lado === 'dir') r.setFlipX(true); // olha para o meio da cena
    c.add(r);
    // respira: estica um tiquinho para cima e volta
    this.tweens.add({ targets: r, scaleY: s * 1.025, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  /** Raposinha deitada: cama do jogo e a cabeca de olhos fechados no travesseiro. */
  private dormindo(c: Phaser.GameObjects.Container) {
    const cama = figura(this, W / 2, 700, 'm19_cama', '\u{1F6CF}\u{FE0F}', 520);
    c.add(cama);
    const cabeca = this.add.image(W / 2 + 110, 610, 'mascote_dormindo').setCrop(55, 15, 290, 222);
    const s = 210 / 290;
    cabeca.setScale(s).setAngle(-12);
    c.add(cabeca);
    this.tweens.add({ targets: cabeca, y: 616, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    const timer = this.time.addEvent({
      delay: 1700,
      loop: true,
      callback: () => {
        const z = this.add.text(W / 2 + 180, 520, 'z', { fontSize: '40px', color: '#ffffff' }).setOrigin(0.5).setAlpha(0);
        c.add(z);
        this.tweens.add({
          targets: z,
          x: z.x + 60,
          y: z.y - 160,
          alpha: { from: 0.9, to: 0 },
          scale: { from: 0.6, to: 1.4 },
          duration: 3200,
          ease: 'Sine.easeOut',
          onComplete: () => z.destroy(),
        });
      },
    });
    (c.getData('timers') as Phaser.Time.TimerEvent[]).push(timer);
  }

  private pecas(c: Phaser.GameObjects.Container, pecas: string[], raposa: string) {
    const vagas = VAGAS[raposa] ?? VAGAS.centro;
    pecas.slice(0, 3).forEach((k, n) => {
      if (ARTE.test(k) && !this.textures.exists(k)) return; // arte que nao veio: melhor nada que o nome escrito
      const [x, y, tam] = vagas[n];
      const f = figura(this, x, y, k, k, tam);
      c.add(f);
      // boia: cada peca no seu ritmo, para nao parecerem presas umas nas outras
      this.tweens.add({ targets: f, y: y - 12, angle: n % 2 ? 3 : -3, duration: 2200 + n * 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    });
  }

  /** Estrelas piscando a noite, poeirinha de luz de dia, e uma bola que respira. */
  private clima(c: Phaser.GameObjects.Container, clima: string) {
    if (clima === 'respira') {
      const bola = this.add.circle(W / 2, 560, 200, 0x9cbfa6, 0.18);
      c.add(bola);
      // 4 s enche, 4 s esvazia: o ritmo de "enche... e solta" do roteiro
      this.tweens.add({ targets: bola, scale: 1.35, duration: 4000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
    const noite = NOTURNO.has(clima);
    const quantas = clima === 'estrelas' ? 40 : noite ? 22 : 12;
    for (let n = 0; n < quantas; n++) {
      const x = Phaser.Math.Between(20, W - 20);
      if (noite) {
        const y = Phaser.Math.Between(TELA.topo + 40, 560);
        const cor = clima === 'estrelas' && n % 2 ? 0xffe9a0 : 0xffffff;
        const e = this.add.circle(x, y, Phaser.Math.FloatBetween(1.5, 4), cor, 0.9);
        c.add(e);
        this.tweens.add({ targets: e, alpha: 0.15, duration: Phaser.Math.Between(1200, 3200), yoyo: true, repeat: -1, delay: Phaser.Math.Between(0, 2000) });
      } else {
        const y = Phaser.Math.Between(200, 1000);
        const p = this.add.circle(x, y, Phaser.Math.FloatBetween(3, 7), 0xfff6dc, 0.55);
        c.add(p);
        this.tweens.add({ targets: p, y: y - 220, alpha: 0, duration: Phaser.Math.Between(6000, 10000), repeat: -1, delay: Phaser.Math.Between(0, 5000) });
      }
    }
  }

  /** Texto do trecho num cartao claro, embaixo, acima dos botoes. */
  private cartao(c: Phaser.GameObjects.Container, texto: string, grande: boolean) {
    if (!texto) return;
    const t = this.add
      .text(W / 2, 0, texto.replace(/\n/g, ' '), {
        fontSize: grande ? '48px' : '27px',
        color: '#3a3f45',
        align: 'center',
        lineSpacing: 6,
        wordWrap: { width: W - 120 },
      })
      .setOrigin(0.5, 1);
    const base = 1070;
    t.setY(base - 22);
    const alt = t.height + 44;
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 0.9);
    g.fillRoundedRect(40, base - alt, W - 80, alt, 28);
    c.add([g, t]);
  }

  private controles() {
    const barra = this.add.graphics().setDepth(5);
    const [x0, y0, larg] = [90, 1225, W - 180];
    const pintarBarra = () => {
      const s = this.som;
      barra.clear();
      barra.fillStyle(0xffffff, 0.75);
      barra.fillRoundedRect(x0, y0, larg, 16, 8);
      if (!s || !s.duration) return;
      barra.fillStyle(TEMA.sim, 1);
      barra.fillRoundedRect(x0, y0, larg * (s.currentTime / s.duration), 16, 8);
    };
    this.time.addEvent({ delay: 250, loop: true, callback: pintarBarra });
    pintarBarra();
    // adulto pode pular para um trecho tocando na barra; a area e mais alta que a barra para o dedo achar
    const zona = this.add.zone(x0 + larg / 2, y0 + 8, larg, 70).setDepth(6).setInteractive({ useHandCursor: true });
    zona.on('pointerdown', (p: Phaser.Input.Pointer) => {
      const s = this.som;
      if (!s || !s.duration) return;
      s.currentTime = Phaser.Math.Clamp((p.worldX - x0) / larg, 0, 1) * s.duration;
      pintarBarra();
    });

    const botao = this.add.container(W / 2, 1145).setDepth(6);
    const disco = this.add.graphics();
    const rotulo = this.add.text(0, 0, '\u{25B6}\u{FE0F}', { fontSize: '56px' }).setOrigin(0.5);
    botao.add([disco, rotulo]);
    this.pintarBotao = (ligado: boolean) => {
      disco.clear();
      disco.fillStyle(0xffffff, 0.96);
      disco.fillCircle(0, 0, 58);
      disco.lineStyle(10, ligado ? TEMA.sim : 0xe2e6ea, 1);
      disco.strokeCircle(0, 0, 58);
      rotulo.setText(ligado ? '\u{23F8}\u{FE0F}' : '\u{25B6}\u{FE0F}');
    };
    this.pintarBotao(false);
    botao.setSize(130, 130).setInteractive({ useHandCursor: true });
    botao.on('pointerdown', () => this.alternar());
  }

  private pintarBotao: (ligado: boolean) => void = () => undefined;

  private pintar(ligado: boolean) {
    this.tocando = ligado;
    this.pintarBotao(ligado);
  }

  private alternar() {
    if (!this.som) return;
    if (this.tocando) {
      this.som.pause();
      this.pintar(false);
      return;
    }
    this.som.play().catch(() => undefined);
    this.pintar(true);
  }

  update() {
    if (this.som && this.tocando && this.som.paused) this.pintar(false);
    if (this.pronto) this.mostrar(this.indice());
  }
}
