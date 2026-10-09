import Phaser from 'phaser';
import { CONFIG } from './config';
import { narrador } from './narrador';
import { irPara, nota, TELA } from './ui';

const W = CONFIG.LARGURA;

/**
 * A barra de quatro abas que fica no pe de toda tela principal.
 *
 * Nao e menu de adulto: sao quatro desenhos grandes, sempre nos mesmos quatro
 * lugares. A crianca decora a posicao antes de saber ler o rotulo, por isso a
 * ordem nunca muda e a aba onde ela esta fica acesa.
 */
export interface Aba {
  cena: string;
  icone: string;
  rotulo: string;
}

export const ABAS: Aba[] = [
  { cena: 'Mapa', icone: '\u{1F5FA}\u{FE0F}', rotulo: 'Jornada' },
  { cena: 'Historinhas', icone: '\u{1F4D6}', rotulo: 'Historinhas' },
  { cena: 'Joguinhos', icone: '\u{1F3AE}', rotulo: 'Joguinhos' },
  { cena: 'Cantinho', icone: '\u{2B50}', rotulo: 'Meu cantinho' },
];

export const ALTURA_ABAS = 150;
/** Onde o conteudo de cada tela precisa parar para nao sumir atras da barra. */
export const TOPO_ABAS = TELA.baixo - ALTURA_ABAS;

export function abas(cena: Phaser.Scene, ativa: string) {
  const c = cena.add.container(0, 0).setDepth(80);
  const fundo = cena.add.graphics();
  fundo.fillStyle(0xffffff, 0.97);
  fundo.fillRect(0, TOPO_ABAS, W, TELA.baixo - TOPO_ABAS);
  fundo.fillStyle(0xe2e6ea, 1);
  fundo.fillRect(0, TOPO_ABAS, W, 3);
  c.add(fundo);

  const passo = W / ABAS.length;
  ABAS.forEach((aba, i) => {
    const x = passo * (i + 0.5);
    const aqui = aba.cena === ativa;
    const meio = TOPO_ABAS + 60;

    if (aqui) {
      const marca = cena.add.graphics();
      marca.fillStyle(0xe6b887, 0.35);
      marca.fillRoundedRect(x - passo / 2 + 10, TOPO_ABAS + 10, passo - 20, ALTURA_ABAS - 24, 22);
      c.add(marca);
    }
    c.add(
      cena.add
        .text(x, meio, aba.icone, { fontSize: '56px' })
        .setOrigin(0.5)
        .setAlpha(aqui ? 1 : 0.55),
    );
    c.add(
      cena.add
        .text(x, meio + 52, aba.rotulo, {
          fontSize: '22px',
          color: aqui ? '#3a3f45' : '#7b858f',
          fontStyle: aqui ? 'bold' : 'normal',
          align: 'center',
          wordWrap: { width: passo - 16 },
        })
        .setOrigin(0.5),
    );

    const z = cena.add
      .zone(x, TOPO_ABAS + ALTURA_ABAS / 2, passo, ALTURA_ABAS)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => narrador.nomear(aba.rotulo))
      .on('pointerdown', () => {
        if (aqui) return;
        nota(740);
        irPara(cena, aba.cena);
      });
    c.add(z);
  });
  return c;
}
