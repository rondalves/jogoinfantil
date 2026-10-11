import Phaser from 'phaser';
import { CONFIG } from '../config';
import { hojeISO } from '../economia';
import { fale } from '../narracoes';
import { ativo, salvar } from '../storage';
import { liberarMais, limiteDoPerfil } from '../tempoDeJogo';
import { TEMA } from '../theme';
import { balao, botao, cobrirTela, irPara, nota } from '../ui';

const W = CONFIG.LARGURA;

/**
 * "Ja fez as suas tarefas?" -- aparece por cima do joguinho quando passa do
 * tempo do dia (tempoDeJogo.ts). O joguinho fica pausado por baixo.
 *
 * A crianca so tem uma saida: ir para as missoes. Mais tempo de joguinho, so
 * com um adulto, pela mesma conta de matematica da area dos adultos.
 */
export class AvisoTempo extends Phaser.Scene {
  private volta = '';

  constructor() {
    super('AvisoTempo');
  }

  init(dados: { volta?: string }) {
    this.volta = dados?.volta ?? '';
  }

  create() {
    cobrirTela(this, 0x2b3a4a, 0.78);
    // um cartao so com o aviso e as duas saidas: o joguinho pausado aparecia
    // entre os botoes e confundia
    const g = this.add.graphics();
    g.fillStyle(0xf7f5f1, 1);
    g.fillRoundedRect(40, 250, W - 80, 820, 44);
    const frase = fale('tempo_aviso');
    balao(this, frase, 420);

    botao(
      this,
      W / 2,
      800,
      'Fazer as missões',
      () => {
        if (this.volta) this.scene.stop(this.volta);
        irPara(this, 'Mapa');
      },
      { icone: '\u{1F5FA}\u{FE0F}', cor: TEMA.sim, largura: 520 },
    );
    botao(this, W / 2, 950, 'Sou um adulto', () => this.conta(), {
      icone: '\u{1F512}',
      cor: 0xbfd4e8,
      largura: 420,
      altura: 90,
      tamanhoTexto: 32,
    });
  }

  /** A mesma conta da area dos adultos: crianca de 4 a 7 anos nao resolve. */
  private conta() {
    fale('tempo_adulto');
    const a = Phaser.Math.Between(3, 9);
    const b = Phaser.Math.Between(4, 9);
    const certo = a * b;
    const capa = this.add.container(0, 0).setDepth(10);
    capa.add(cobrirTela(this, 0xf7f5f1, 0.98));
    capa.add(
      this.add.text(W / 2, 360, `Quanto é ${a} x ${b}?`, { fontSize: '54px', color: '#2b3a4a' }).setOrigin(0.5),
    );
    const recado = this.add.text(W / 2, 1060, '', { fontSize: '40px', color: '#b5564a' }).setOrigin(0.5);
    capa.add(recado);
    const erradas = new Set<number>();
    while (erradas.size < 2) {
      const n = certo + Phaser.Math.Between(-12, 12);
      if (n !== certo && n > 0) erradas.add(n);
    }
    for (const [i, n] of Phaser.Utils.Array.Shuffle([certo, ...erradas]).entries()) {
      capa.add(
        botao(
          this,
          W / 2,
          540 + i * 160,
          String(n),
          () => {
            if (n !== certo) {
              recado.setText('Tente de novo');
              return;
            }
            const p = ativo();
            if (p) {
              p.tempoJogo = liberarMais(p.tempoJogo, hojeISO(), limiteDoPerfil());
              salvar(p);
            }
            nota(1047);
            fale('tempo_liberado');
            if (this.volta) this.scene.resume(this.volta);
            this.scene.stop();
          },
          { largura: 260 },
        ),
      );
    }
  }
}
