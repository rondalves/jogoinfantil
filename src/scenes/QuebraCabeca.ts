import Phaser from 'phaser';
import { carregar } from '../assets';
import { CONFIG } from '../config';
import { fale } from '../narracoes';
import { narrador } from '../narrador';
import { encaixou, NIVEIS, nivelParaAbrir, pecas } from '../quebraCabeca';
import { ativo, salvar, type Perfil } from '../storage';
import { vigiarTempo } from '../tempoDeJogo';
import { TEMA } from '../theme';
import { botao, botaoOuvir, botaoVoltar, confete, fundo, nota, textoEmPainel, toque } from '../ui';

const W = CONFIG.LARGURA;
/** tabuleiro quadrado no alto; a bandeja das pecas soltas embaixo dele */
const TAB = 560;
const TAB_X = (W - TAB) / 2;
const TAB_Y = 200;
const BANDEJA = { x: 30, y: 800, largura: W - 60, altura: 410 };
/** notas de uma escala alegre, uma por peca encaixada */
const ESCALA = [523, 587, 659, 698, 784, 880, 988, 1047];

/**
 * Quebra-cabeca de dez niveis com as ilustracoes do jogo.
 *
 * O tabuleiro mostra a figura bem clarinha, como guia; a crianca arrasta cada
 * peca da bandeja para o lugar. Perto do lugar certo ela gruda sozinha; longe,
 * volta para a bandeja. Nao tem relogio nem erro: so a figura se montando.
 */
export class QuebraCabeca extends Phaser.Scene {
  private p!: Perfil;
  private nivel = 1;
  private feitas = 0;

  constructor() {
    super('QuebraCabeca');
  }

  create(dados?: { nivel?: number }) {
    this.p = ativo()!;
    this.nivel = dados?.nivel ?? nivelParaAbrir(this.p.quebraCabeca);
    this.feitas = 0;
    narrador.setNome(this.p.nome);
    fundo(this, TEMA.creme);
    botaoVoltar(this, 'Joguinhos');
    botaoOuvir(this);
    vigiarTempo(this);
    this.cabecalho();
    const n = NIVEIS[this.nivel - 1];
    carregar(this, [n.imagem], () => this.montar());
    fale('jogo_quebra');
  }

  /** "Nivel N" com setas: volta a qualquer um ja montado, avanca so ate o proximo. */
  private cabecalho() {
    this.add
      .text(W / 2, 96, `Nível ${this.nivel}`, { fontSize: '44px', color: '#2b3a4a', fontStyle: 'bold' })
      .setOrigin(0.5);
    const seta = (x: number, icone: string, destino: number) => {
      const s = this.add.text(x, 96, icone, { fontSize: '56px', color: '#2b3a4a' }).setOrigin(0.5);
      toque(s, () => this.scene.restart({ nivel: destino }));
    };
    if (this.nivel > 1) seta(W / 2 - 170, '\u{25C0}', this.nivel - 1);
    if (this.nivel <= (this.p.quebraCabeca ?? 0) && this.nivel < NIVEIS.length) {
      seta(W / 2 + 170, '\u{25B6}', this.nivel + 1);
    }
    this.add
      .text(W / 2, 162, 'Arraste as pecinhas para o lugar certo!', { fontSize: '28px', color: '#5a6672' })
      .setOrigin(0.5);
  }

  private montar() {
    const n = NIVEIS[this.nivel - 1];
    const fonte = this.textures.get(n.imagem);
    const { width: lw, height: lh } = fonte.getSourceImage() as HTMLImageElement;
    const pw = TAB / n.colunas;
    const ph = TAB / n.linhas;

    // tabuleiro: moldura, a figura clarinha de guia e as linhas das casas
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 1).fillRoundedRect(TAB_X - 14, TAB_Y - 14, TAB + 28, TAB + 28, 22);
    this.add.image(TAB_X, TAB_Y, n.imagem).setOrigin(0).setDisplaySize(TAB, TAB).setAlpha(0.28);
    g.lineStyle(2, 0xc9d2da, 1);
    for (let c = 1; c < n.colunas; c++) g.lineBetween(TAB_X + c * pw, TAB_Y, TAB_X + c * pw, TAB_Y + TAB);
    for (let l = 1; l < n.linhas; l++) g.lineBetween(TAB_X, TAB_Y + l * ph, TAB_X + TAB, TAB_Y + l * ph);
    const b = this.add.graphics();
    b.fillStyle(0xffffff, 0.6).fillRoundedRect(BANDEJA.x, BANDEJA.y, BANDEJA.largura, BANDEJA.altura, 26);

    // na bandeja as pecas encolhem para caber todas lado a lado, sem uma cobrir a
    // outra; na mao voltam ao tamanho do tabuleiro. Testa cada numero de colunas
    // e fica com o que deixa as pecas maiores.
    const total = pecas(n);
    let cols = 1;
    let naBandeja = 0;
    for (let c = 1; c <= total; c++) {
      const r = Math.ceil(total / c);
      const e = Math.min(1, (BANDEJA.largura / c - 14) / pw, (BANDEJA.altura / r - 14) / ph);
      if (e > naBandeja) [cols, naBandeja] = [c, e];
    }
    const rows = Math.ceil(total / cols);
    const vagas = Phaser.Utils.Array.Shuffle([...Array(total).keys()]);

    let topo = 10;
    for (let i = 0; i < total; i++) {
      const col = i % n.colunas;
      const lin = Math.floor(i / n.colunas);
      const nome = `${n.colunas}x${n.linhas}_${i}`;
      if (!fonte.has(nome)) fonte.add(nome, 0, (col * lw) / n.colunas, (lin * lh) / n.linhas, lw / n.colunas, lh / n.linhas);
      const alvoX = TAB_X + (col + 0.5) * pw;
      const alvoY = TAB_Y + (lin + 0.5) * ph;

      const vaga = vagas[i];
      const casaX = BANDEJA.x + ((vaga % cols) + 0.5) * (BANDEJA.largura / cols) + Phaser.Math.Between(-5, 5);
      const casaY = BANDEJA.y + (Math.floor(vaga / cols) + 0.5) * (BANDEJA.altura / rows) + Phaser.Math.Between(-5, 5);

      const imagem = this.add.image(0, 0, n.imagem, nome).setDisplaySize(pw, ph);
      const borda = this.add.graphics();
      borda.lineStyle(4, 0xffffff, 1).strokeRect(-pw / 2, -ph / 2, pw, ph);
      const peca = this.add.container(casaX, casaY, [imagem, borda]).setScale(naBandeja).setDepth(topo);
      peca.setSize(pw, ph).setInteractive({ draggable: true, useHandCursor: true });

      peca.on('dragstart', () => {
        topo += 1;
        peca.setDepth(topo);
        this.tweens.add({ targets: peca, scale: 1, duration: 120 });
      });
      peca.on('drag', (_p: Phaser.Input.Pointer, x: number, y: number) => peca.setPosition(x, y));
      peca.on('dragend', () => {
        if (encaixou(peca.x - alvoX, peca.y - alvoY, pw, ph)) {
          peca.disableInteractive().setDepth(5);
          borda.destroy();
          this.tweens.add({ targets: peca, x: alvoX, y: alvoY, scale: 1, duration: 120 });
          nota(ESCALA[this.feitas % ESCALA.length]);
          this.feitas += 1;
          if (this.feitas === total) this.time.delayedCall(250, () => this.pronto());
        } else {
          this.tweens.add({ targets: peca, x: casaX, y: casaY, scale: naBandeja, duration: 260, ease: 'Back.out' });
        }
      });
    }
  }

  private pronto() {
    this.p = ativo() ?? this.p;
    this.p.quebraCabeca = Math.max(this.p.quebraCabeca ?? 0, this.nivel);
    salvar(this.p);
    confete(this);
    fale('jogo_quebra_pronto');
    const ultimo = this.nivel === NIVEIS.length;
    textoEmPainel(this, W / 2, 900, ultimo ? 'Você montou todos os quebra-cabeças!' : 'Muito bem! Montou!', 44).setDepth(90);
    botao(
      this,
      W / 2,
      1080,
      ultimo ? 'Começar de novo' : 'Próximo',
      () => this.scene.restart({ nivel: ultimo ? 1 : this.nivel + 1 }),
      { icone: '\u{1F9E9}', cor: TEMA.sim, largura: 420 },
    ).setDepth(90);
  }
}
