import Phaser from 'phaser';
import { CONFIG } from '../config';
import { Esfrega } from '../etapasLogica';
import { narrador } from '../narrador';
import type { Etapa, Regiao } from '../types';
import { figura, nota, textoEmPainel, TimerMusical } from '../ui';
import type { Ctx } from './etapas';

const W = CONFIG.LARGURA;
const CENTRO_X = W / 2;
const CENTRO_Y = 790;

/** Os cinco lugares que o dentista manda escovar, na ordem. */
const PADRAO: Regiao[] = [
  { texto: 'Em cima, deste lado' },
  { texto: 'Em cima, do outro lado' },
  { texto: 'Embaixo, deste lado' },
  { texto: 'Embaixo, do outro lado' },
  { texto: 'A linguinha' },
];

/** Onde cada regiao fica dentro da boca desenhada. */
const LUGARES = [
  { x: CENTRO_X - 120, y: CENTRO_Y - 120, r: 118 },
  { x: CENTRO_X + 120, y: CENTRO_Y - 120, r: 118 },
  { x: CENTRO_X - 120, y: CENTRO_Y + 110, r: 118 },
  { x: CENTRO_X + 120, y: CENTRO_Y + 110, r: 118 },
  { x: CENTRO_X, y: CENTRO_Y + 160, r: 110 },
];

const PASSOS_POR_REGIAO = 4;

/** Usa a arte da boca quando existe; senao desenha uma. */
function desenharBoca(cena: Phaser.Scene): Phaser.GameObjects.GameObject[] {
  if (cena.textures.exists('m01_boca_suja')) {
    const suja = cena.add.image(CENTRO_X, CENTRO_Y, 'm01_boca_suja');
    suja.setScale(560 / suja.width);
    const pecas: Phaser.GameObjects.GameObject[] = [suja];
    if (cena.textures.exists('m01_boca_limpa')) {
      const limpa = cena.add.image(CENTRO_X, CENTRO_Y, 'm01_boca_limpa').setAlpha(0);
      limpa.setScale(560 / limpa.width);
      limpa.setData('limpa', true);
      pecas.push(limpa);
    }
    return pecas;
  }
  const g = cena.add.graphics();
  // labios
  g.fillStyle(0xe0607a, 1);
  g.fillEllipse(CENTRO_X, CENTRO_Y, 540, 460);
  // dentro da boca
  g.fillStyle(0x7a1f30, 1);
  g.fillEllipse(CENTRO_X, CENTRO_Y + 10, 450, 370);
  // lingua
  g.fillStyle(0xe2616f, 1);
  g.fillEllipse(CENTRO_X, CENTRO_Y + 150, 260, 130);
  // dentes de cima e de baixo
  g.fillStyle(0xfffdf7, 1);
  for (let i = 0; i < 7; i++) {
    const x = CENTRO_X - 192 + i * 64;
    g.fillRoundedRect(x - 28, CENTRO_Y - 176, 56, 86, 14);
    g.fillRoundedRect(x - 28, CENTRO_Y + 66, 56, 80, 14);
  }
  return [g];
}

/**
 * Escovacao guiada: a boca aparece grande e a raposinha leva a crianca por
 * cada pedaco, do jeito que o dentista ensina. O timer musical acompanha, mas
 * quem manda e a escovacao: limpou tudo, acabou.
 */
export function escovar(c: Ctx, e: Etapa) {
  const regioes = e.regioes?.length ? e.regioes : PADRAO;
  const total = Math.min(regioes.length, LUGARES.length);
  const boca = desenharBoca(c.cena);
  c.camada.add(boca);
  const bocaLimpa = boca.find((o) => o.getData?.('limpa')) as Phaser.GameObjects.Image | undefined;

  // placas de sujeira de cada regiao
  const sujeira: Phaser.GameObjects.Graphics[] = [];
  for (let i = 0; i < total; i++) {
    const l = LUGARES[i];
    const g = c.cena.add.graphics();
    g.fillStyle(0xe8c95a, 0.9);
    for (let n = 0; n < 5; n++) {
      const a = (n / 5) * Math.PI * 2;
      g.fillCircle(l.x + Math.cos(a) * l.r * 0.45, l.y + Math.sin(a) * l.r * 0.45, 22);
    }
    sujeira.push(g);
    c.camada.add(g);
  }

  const foco = c.cena.add.graphics();
  c.camada.add(foco);

  const escova = figura(c.cena, CENTRO_X, CENTRO_Y + 320, e.alvo?.img, e.alvo?.icone ?? '\u{1FAA5}', 190);
  escova.setDepth(5);
  c.camada.add(escova);

  const painel = textoEmPainel(c.cena, W / 2, 470, regioes[0].texto, 38, W - 140);
  c.camada.add(painel);
  const rotulo = painel.list[1] as Phaser.GameObjects.Text;

  let atual = 0;
  let esfrega = new Esfrega(PASSOS_POR_REGIAO, 120);
  let acabou = false;

  const pintarFoco = () => {
    foco.clear();
    if (atual >= total) return;
    const l = LUGARES[atual];
    foco.lineStyle(10, 0x7ddc8a, 0.95);
    foco.strokeCircle(l.x, l.y, l.r);
  };
  pintarFoco();
  c.cena.tweens.add({ targets: foco, alpha: { from: 0.4, to: 1 }, duration: 600, yoyo: true, repeat: -1 });

  const terminar = () => {
    if (acabou) return;
    acabou = true;
    timer.destruir();
    nota(1047);
    c.cena.time.delayedCall(700, c.fim);
  };

  const timer = new TimerMusical(c.cena, W / 2, 300, e.segundos ?? 60, terminar, 72);
  c.camada.once(Phaser.GameObjects.Events.DESTROY, () => timer.destruir());

  const proxima = () => {
    atual += 1;
    if (atual >= total) {
      rotulo.setText('Tudo limpinho!');
      // o sorriso limpo aparece por cima da boca suja
      if (bocaLimpa) c.cena.tweens.add({ targets: bocaLimpa, alpha: 1, duration: 500 });
      terminar();
      return;
    }
    esfrega = new Esfrega(PASSOS_POR_REGIAO, 120);
    rotulo.setText(regioes[atual].texto);
    narrador.falar(regioes[atual].texto, regioes[atual].audio);
    pintarFoco();
  };

  c.cena.input.on('pointermove', (p: Phaser.Input.Pointer) => {
    if (acabou || !p.isDown || atual >= total) return;
    escova.setPosition(p.x, p.y);
    const l = LUGARES[atual];
    // so conta o que a crianca esfrega dentro do pedaco que esta marcado
    if (Phaser.Math.Distance.Between(p.x, p.y, l.x, l.y) > l.r + 40) return;
    if (!esfrega.mover(p.x - p.prevPosition.x, p.y - p.prevPosition.y)) return;
    nota(700 + esfrega.limpos * 40);
    sujeira[atual].setAlpha(1 - esfrega.limpos / PASSOS_POR_REGIAO);
    if (esfrega.completo) {
      sujeira[atual].destroy();
      proxima();
    }
  });

  c.cena.input.on('pointerup', () => {
    if (!acabou) escova.setPosition(CENTRO_X, CENTRO_Y + 320);
  });

  narrador.falar(regioes[0].texto, regioes[0].audio);
}
