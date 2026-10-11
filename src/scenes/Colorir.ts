import Phaser from 'phaser';
import { CONFIG } from '../config';
import { DESENHOS, parteTocada, type Desenho } from '../desenhos';
import { fale } from '../narracoes';
import { narrador } from '../narrador';
import { ativo } from '../storage';
import { vigiarTempo } from '../tempoDeJogo';
import { TEMA } from '../theme';
import { area, botaoOuvir, botaoVoltar, confete, fundo, nota } from '../ui';

const W = CONFIG.LARGURA;
const TRACO = 0x4a3428;
const BRANCO = 0xffffff;
/** O ultimo e a borracha: pinta de branco de novo. */
const PALETA = [
  0xe85d5d, 0xf39c4a, 0xf7d14c, 0x8fd16e, 0x4caf6e, 0x7cc3ef, 0x4a7fd9,
  0x9b6fd1, 0xf28dbb, 0x9a6a4a, 0xc8ccd1, 0x4a4a52, 0xfbe3c8, BRANCO,
];
const CENTRO = { x: W / 2, y: 548 };
const ESCALA = 0.88;

/**
 * Joguinho de colorir: escolhe a cor e toca na parte do desenho. Seis
 * bichinhos feitos de formas (src/desenhos.ts), com o mesmo traco do
 * personagem. Nao tem certo nem errado; pintou tudo, ganha confete.
 */
export class Colorir extends Phaser.Scene {
  private atual = 0;
  private cor = PALETA[0];
  /** cor de cada parte, por desenho: trocar de desenho e voltar nao apaga */
  private cores = new Map<string, number[]>();
  private festejados = new Set<string>();
  private desenho?: Phaser.GameObjects.Container;
  private paleta?: Phaser.GameObjects.Container;
  private nome!: Phaser.GameObjects.Text;

  constructor() {
    super('Colorir');
  }

  create() {
    const p = ativo();
    if (p) {
      narrador.setNome(p.nome);
      narrador.setVoz(p.voz ?? 'f');
    }
    fundo(this, TEMA.creme, 'bg_criador_personagem', true);
    botaoVoltar(this, 'Joguinhos');
    botaoOuvir(this);
    vigiarTempo(this);

    // a folha: o desenho fica num papel branco, como num caderno
    const folha = this.add.graphics();
    folha.fillStyle(0xffffff, 0.97);
    folha.fillRoundedRect(CENTRO.x - 300, CENTRO.y - 300, 600, 600, 36);

    this.nome = this.add
      .text(W / 2, 900, '', { fontSize: '36px', color: '#2b3a4a', fontStyle: 'bold' })
      .setOrigin(0.5);
    const seta = (x: number, txt: string, passo: number) =>
      this.add
        .text(x, 900, txt, { fontSize: '60px', color: '#2b3a4a' })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.atual = (this.atual + passo + DESENHOS.length) % DESENHOS.length;
          nota(660);
          this.desenhar();
        });
    seta(W / 2 - 250, '◀', -1);
    seta(W / 2 + 250, '▶', 1);

    // toque na folha: descobre a parte e pinta
    this.add
      .zone(CENTRO.x, CENTRO.y, 600, 600)
      .setInteractive()
      .on('pointerdown', (ptr: Phaser.Input.Pointer) => this.tocar(ptr.worldX, ptr.worldY));

    this.desenharPaleta();
    this.desenhar();
    fale('jogo_colorir');
  }

  private desenhoAtual(): Desenho {
    return DESENHOS[this.atual];
  }

  private coresDe(d: Desenho) {
    let c = this.cores.get(d.id);
    if (!c) {
      c = d.partes.map(() => BRANCO);
      this.cores.set(d.id, c);
    }
    return c;
  }

  private desenhar() {
    this.desenho?.destroy();
    const d = this.desenhoAtual();
    const cores = this.coresDe(d);
    const c = this.add.container(CENTRO.x, CENTRO.y).setScale(ESCALA);
    d.partes.forEach((parte, i) => {
      const g = this.add.graphics();
      this.pintar(g, parte.pontos, cores[i]);
      c.add(g);
    });
    const det = this.add.graphics();
    for (const x of d.detalhes) {
      if (x.tipo === 'olho') {
        det.fillStyle(0x2a1c17, 1).fillCircle(x.x, x.y, x.r);
        det.fillStyle(0xffffff, 1).fillCircle(x.x - x.r * 0.3, x.y - x.r * 0.35, x.r * 0.32);
      } else if (x.tipo === 'ponto') {
        det.fillStyle(x.cor, 1).fillCircle(x.x, x.y, x.r);
      } else {
        det.lineStyle(x.largura ?? 5, TRACO, 1);
        det.strokePoints(x.pontos.map(([px, py]) => ({ x: px, y: py })), false);
      }
    }
    c.add(det);
    this.desenho = c;
    this.nome.setText(`${d.nome}  ${this.atual + 1}/${DESENHOS.length}`);
    narrador.nomear(d.nome);
  }

  private pintar(g: Phaser.GameObjects.Graphics, pontos: [number, number][], cor: number) {
    const pts = pontos.map(([x, y]) => ({ x, y }));
    g.clear();
    g.fillStyle(cor, 1);
    g.fillPoints(pts, true);
    g.lineStyle(6, TRACO, 1);
    g.strokePoints(pts, true, true);
  }

  private tocar(mx: number, my: number) {
    const d = this.desenhoAtual();
    const i = parteTocada(d, (mx - CENTRO.x) / ESCALA, (my - CENTRO.y) / ESCALA);
    if (i < 0 || !this.desenho) return;
    const cores = this.coresDe(d);
    cores[i] = this.cor;
    this.pintar(this.desenho.getAt(i) as Phaser.GameObjects.Graphics, d.partes[i].pontos, this.cor);
    nota(this.cor === BRANCO ? 440 : 600 + (i % 6) * 70);
    if (!this.festejados.has(d.id) && cores.every((c) => c !== BRANCO)) {
      this.festejados.add(d.id);
      confete(this, 60);
      [0, 160, 320].forEach((t, k) => this.time.delayedCall(t, () => nota(880 + k * 220)));
      this.time.delayedCall(500, () => fale('jogo_colorir_pronto'));
    }
  }

  private desenharPaleta() {
    this.paleta?.destroy();
    const c = this.add.container(0, 0);
    const porLinha = 7;
    PALETA.forEach((cor, i) => {
      const x = W / 2 + ((i % porLinha) - (porLinha - 1) / 2) * 92;
      const y = 1010 + Math.floor(i / porLinha) * 100;
      const sel = cor === this.cor;
      const g = this.add.graphics();
      if (sel) g.fillStyle(0x2b3a4a, 1).fillCircle(x, y, 46);
      g.fillStyle(cor, 1).fillCircle(x, y, sel ? 39 : 36);
      g.lineStyle(4, cor === BRANCO ? 0xc8ccd1 : 0xffffff, 1).strokeCircle(x, y, sel ? 39 : 36);
      c.add(g);
      if (cor === BRANCO) c.add(this.add.text(x, y, '\u{1F9FD}', { fontSize: '36px' }).setOrigin(0.5));
      c.add(
        area(this, x, y, 88, 88, () => {
          this.cor = cor;
          nota(cor === BRANCO ? 440 : 760);
          this.desenharPaleta();
        }, cor === BRANCO ? 'Borracha' : undefined),
      );
    });
    this.paleta = c;
  }
}
