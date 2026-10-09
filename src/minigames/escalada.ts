import Phaser from 'phaser';
import { CONFIG } from '../config';
import { fale } from '../narracoes';
import { desenharPersonagem } from '../personagem';
import type { PersonagemCfg } from '../storage';
import { TEMA } from '../theme';
import { cobrirTela, figura, nota } from '../ui';
import type { MiniGame, ResultadoMiniGame } from './index';

const W = CONFIG.LARGURA;
const H = CONFIG.DESENHO;
const DEGRAUS = 14;
const ALTURA_DEGRAU = 190;
const Y_BASE = H - 320;

type Tipo = 'normal' | 'pedra' | 'estrela';

interface Degrau {
  x: number;
  tipo: Tipo;
}

/**
 * Escalada de plataformas: a crianca toca no proximo degrau para subir.
 * Sem reflexo e sem queda: pedra so pede um toque a mais para pular.
 */
function montar(
  cena: Phaser.Scene,
  personagem: PersonagemCfg,
  pronto: (r: ResultadoMiniGame) => void,
) {
  const degraus: Degrau[] = [{ x: W / 2, tipo: 'normal' }];
  for (let i = 1; i < DEGRAUS; i++) {
    const sorte = Math.random();
    degraus.push({
      x: Phaser.Math.Between(170, W - 170),
      tipo: i === DEGRAUS - 1 ? 'normal' : sorte < 0.25 ? 'pedra' : sorte < 0.6 ? 'estrela' : 'normal',
    });
  }

  const mundo = cena.add.container(0, 0);
  const yDe = (i: number) => Y_BASE - i * ALTURA_DEGRAU;

  const tabuas: Phaser.GameObjects.Graphics[] = [];
  const enfeites: (Phaser.GameObjects.GameObject | undefined)[] = [];
  degraus.forEach((d, i) => {
    const g = cena.add.graphics();
    g.fillStyle(0x8b5a2b, 1);
    g.fillRoundedRect(d.x - 110, yDe(i) - 18, 220, 36, 16);
    g.fillStyle(0xc98a4b, 1);
    g.fillRoundedRect(d.x - 104, yDe(i) - 14, 208, 20, 10);
    mundo.add(g);
    tabuas.push(g);
    if (d.tipo === 'estrela') {
      const e = figura(cena, d.x, yDe(i) - 86, 'estrela', '\u{2B50}', 90);
      cena.tweens.add({ targets: e, y: yDe(i) - 104, duration: 700, yoyo: true, repeat: -1 });
      mundo.add(e);
      enfeites[i] = e;
    } else if (d.tipo === 'pedra') {
      const p = figura(cena, d.x, yDe(i) - 78, 'mg2_pedra', '\u{1FAA8}', 100);
      mundo.add(p);
      enfeites[i] = p;
    }
  });

  const topo = figura(cena, degraus[DEGRAUS - 1].x, yDe(DEGRAUS - 1) - 110, 'mg1_chegada', '\u{1F3C1}', 220);
  mundo.add(topo);

  const crianca = desenharPersonagem(cena, personagem, 0.42);
  crianca.setPosition(degraus[0].x, yDe(0) - 118);
  mundo.add(crianca);

  let atual = 0;
  let pontos = 0;
  let pulando = false;

  const placar = cena.add.container(24, 190).setDepth(40);
  const fundoPlacar = cena.add.graphics();
  fundoPlacar.fillStyle(0xffffff, 0.8);
  fundoPlacar.fillRoundedRect(-12, -40, 230, 80, 22);
  placar.add(fundoPlacar);
  placar.add(figura(cena, 30, 0, 'estrela', '\u{2B50}', 62));
  const texto = cena.add.text(72, 0, '0', { fontSize: '44px', fontStyle: 'bold' }).setOrigin(0, 0.5);
  placar.add(texto);

  const dica = cena.add
    .text(W / 2, H - 120, 'Toque no próximo degrau!', { fontSize: '40px' })
    .setOrigin(0.5)
    .setDepth(40);
  const fundoDica = cena.add.graphics().setDepth(39);
  const pintarDica = () => {
    fundoDica.clear();
    fundoDica.fillStyle(0xffffff, 0.88);
    fundoDica.fillRoundedRect(W / 2 - dica.width / 2 - 22, dica.y - dica.height / 2 - 12, dica.width + 44, dica.height + 24, 20);
  };
  pintarDica();

  const terminar = () => {
    cena.input.off('pointerdown');
    nota(1047);
    cena.tweens.add({ targets: crianca, y: crianca.y - 40, duration: 500, yoyo: true, repeat: 1 });
    cena.time.delayedCall(900, () => pronto({ pontos, concluido: true }));
  };

  const subir = () => {
    const destino = atual + 1;
    const d = degraus[destino];
    if (d.tipo === 'pedra' && !pulando) {
      pulando = true;
      dica.setText('Tem uma pedra! Toque de novo para pular.');
      pintarDica();
      nota(300);
      fale('mg2_pedra');
      return;
    }
    pulando = false;
    atual = destino;
    nota(620 + atual * 20);
    cena.tweens.add({
      targets: crianca,
      x: d.x,
      y: yDe(atual) - 118,
      duration: 260,
      ease: 'Back.out',
    });
    cena.tweens.add({ targets: mundo, y: atual * ALTURA_DEGRAU, duration: 300, ease: 'Sine.easeOut' });
    if (d.tipo === 'estrela') {
      pontos += 1;
      texto.setText(String(pontos));
      nota(1047);
      const e = enfeites[atual];
      if (e) cena.tweens.add({ targets: e, alpha: 0, scale: 0.2, duration: 300 });
    }
    dica.setText(atual >= DEGRAUS - 1 ? 'Chegou no topo!' : 'Toque no próximo degrau!');
    pintarDica();
    if (atual >= DEGRAUS - 1) terminar();
  };

  cena.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
    if (atual >= DEGRAUS - 1) return;
    // qualquer toque na metade de cima da tela sobe: dedo de crianca nao mira
    if (p.y < H - 220) subir();
  });

  fale('mg2_como_jogar');
}

export const escalada: MiniGame = {
  id: 'escalada',
  mundo: 2,
  nome: 'Escalada',
  tituloFim: 'Chegou no topo!',
  fraseFim: 'mg2_fim',
  iconePonto: 'estrela',
  arte: ['bg_escalada', 'mg1_chegada'],
  icone: '\u{1F9D7}',
  iniciar(cena, personagem) {
    cobrirTela(cena, TEMA.ceu).setDepth(-10);
    const fundoArte = cena.textures.exists('bg_escalada') ? cena.add.image(W / 2, H / 2, 'bg_escalada') : null;
    if (fundoArte) {
      fundoArte.setScale(Math.max(W / fundoArte.width, H / fundoArte.height)).setDepth(-9).setAlpha(0.75);
    }
    return new Promise<ResultadoMiniGame>((resolve) => montar(cena, personagem, resolve));
  },
};
