import Phaser from 'phaser';
import { definirQuemJoga, nomeAdulto, type QuemJoga as Quem } from '../adulto';
import { aplicarAdulto, arteDe, desenharAdultoDe } from '../aplicarAdulto';
import { carregar } from '../assets';
import { CONFIG } from '../config';
import { TEMA } from '../theme';
import { area, fundo, irPara, nota, titulo } from '../ui';

const W = CONFIG.LARGURA;

/**
 * Primeira vez que o jogo abre: quem configura diz se a crianca joga com a
 * mamae ou com o papai. Dai em diante o adulto das cenas tem esse rosto e os
 * textos chamam "a mamae" ou "o papai". Da para trocar no painel dos pais.
 */
export class QuemJoga extends Phaser.Scene {
  private depois = 'Perfis';

  constructor() {
    super('QuemJoga');
  }

  init(dados?: { depois?: string }) {
    this.depois = dados?.depois ?? 'Perfis';
  }

  create() {
    fundo(this, TEMA.ceu, 'bg_menu_inicial');
    titulo(this, 'Vai jogar com quem?', 200);
    this.add
      .text(W / 2, 300, 'Com a mamãe ou com o papai? Dá para trocar depois, no painel dos pais.', {
        fontSize: '30px',
        color: '#2b3a4a',
        align: 'center',
        wordWrap: { width: W - 140 },
      })
      .setOrigin(0.5);
    const artes = (['mae', 'pai'] as Quem[]).map((q) => arteDe(q));
    carregar(this, artes, () => {
      this.cartao('mae', W / 2 - 170);
      this.cartao('pai', W / 2 + 170);
    });
  }

  private cartao(q: Quem, x: number) {
    const y = 700;
    const g = this.add.graphics();
    g.fillStyle(0x7a5a3a, 0.12).fillRoundedRect(x - 145 + 3, y - 230 + 8, 290, 460, 42);
    g.fillStyle(0xffffff, 0.97).fillRoundedRect(x - 145, y - 230, 290, 460, 42);
    const f = desenharAdultoDe(this, q, 320).setPosition(x, y - 36);
    this.tweens.add({ targets: f, y: f.y - 8, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.add
      .text(x, y + 170, nomeAdulto(q), { fontSize: '46px', color: '#2b3a4a', fontStyle: 'bold' })
      .setOrigin(0.5);
    area(this, x, y, 290, 460, () => {
      nota(880);
      definirQuemJoga(q);
      aplicarAdulto();
      irPara(this, this.depois);
    });
  }
}
