import Phaser from 'phaser';
import { portaoAdulto } from '../portaoAdulto';
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

  /** A mesma senha da area dos adultos: so quem a tem libera mais joguinho. */
  private conta() {
    fale('tempo_adulto');
    portaoAdulto(
      this,
      () => {
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
      () => undefined,
    );
  }
}
