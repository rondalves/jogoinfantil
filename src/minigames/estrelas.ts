import Phaser from 'phaser';
import { CONFIG } from '../config';
import { fale } from '../narracoes';
import { desenharPersonagem } from '../personagem';
import { cobrirTela, figura, nota, textoEmPainel } from '../ui';
import type { MiniGame, ResultadoMiniGame } from './index';

const W = CONFIG.LARGURA;
const H = CONFIG.DESENHO;
const DURACAO = 70;

/**
 * Ceu das estrelas (mundo 5): estrelas caem devagar e a crianca toca para
 * pegar. Nada corre, nada pisca forte: e o jogo de antes de dormir.
 */
export const estrelas: MiniGame = {
  id: 'estrelas',
  mundo: 5,
  nome: 'Céu das estrelas',
  icone: '\u{2B50}',
  tituloFim: 'Que céu bonito!',
  fraseFim: 'mg5_fim',
  iconePonto: 'estrela',
  arte: ['m19_lua', 'm19_estrelas', 'bg_quarto_noite'],
  iniciar(cena, personagem) {
    return new Promise<ResultadoMiniGame>((resolve) => {
      cobrirTela(cena, 0x2e3340).setDepth(-10);
      if (cena.textures.exists('bg_quarto_noite')) {
        const bg = cena.add.image(W / 2, H / 2, 'bg_quarto_noite').setDepth(-9);
        bg.setScale(Math.max(W / bg.width, H / bg.height)).setAlpha(0.35);
      }
      // estrelinhas paradas ao fundo, so para o ceu nao ficar vazio
      for (let i = 0; i < 40; i++) {
        const e = cena.add.circle(
          Phaser.Math.Between(20, W - 20),
          Phaser.Math.Between(40, H - 300),
          Phaser.Math.Between(2, 5),
          0xffffff,
          Phaser.Math.FloatBetween(0.3, 0.9),
        );
        cena.tweens.add({
          targets: e,
          alpha: 0.15,
          duration: Phaser.Math.Between(1200, 2600),
          yoyo: true,
          repeat: -1,
        });
      }
      figura(cena, W - 140, 250, 'm19_lua', '\u{1F319}', 180).setDepth(-8);
      desenharPersonagem(cena, personagem, 0.5).setPosition(W / 2, H - 150);

      let pontos = 0;
      const placar = textoEmPainel(cena, 150, 190, '0 estrelas', 36, 300).setDepth(40);
      const rotulo = placar.list[1] as Phaser.GameObjects.Text;
      const barra = cena.add.graphics().setDepth(40);

      let passado = 0;
      let acabou = false;

      const cair = () => {
        if (acabou) return;
        const x = Phaser.Math.Between(120, W - 120);
        const e = figura(cena, x, -60, 'm19_estrelas', '\u{2B50}', Phaser.Math.Between(90, 130));
        e.setInteractive({ useHandCursor: true });
        e.on('pointerdown', () => {
          pontos += 1;
          rotulo.setText(`${pontos} ${pontos === 1 ? 'estrela' : 'estrelas'}`);
          nota(880 + pontos * 12);
          cena.tweens.killTweensOf(e);
          cena.tweens.add({
            targets: e,
            y: 190,
            x: 150,
            scale: 0.2,
            alpha: 0.2,
            duration: 500,
            onComplete: () => e.destroy(),
          });
        });
        cena.tweens.add({
          targets: e,
          y: H + 80,
          x: x + Phaser.Math.Between(-60, 60),
          angle: Phaser.Math.Between(-90, 90),
          duration: Phaser.Math.Between(5200, 7200),
          onComplete: () => e.destroy(),
        });
        cena.time.delayedCall(Phaser.Math.Between(700, 1200), cair);
      };
      cair();

      const relogio = cena.time.addEvent({
        delay: 100,
        loop: true,
        callback: () => {
          passado += 0.1;
          barra.clear();
          barra.fillStyle(0xffffff, 0.35);
          barra.fillRoundedRect(W - 250, 176, 220, 28, 14);
          barra.fillStyle(0xe3b23c, 1);
          barra.fillRoundedRect(W - 250, 176, 220 * Math.min(1, passado / DURACAO), 28, 14);
          if (passado < DURACAO) return;
          acabou = true;
          relogio.remove();
          nota(1047);
          cena.time.delayedCall(700, () => resolve({ pontos, concluido: true }));
        },
      });

      fale('mg5_como_jogar');
    });
  },
};
