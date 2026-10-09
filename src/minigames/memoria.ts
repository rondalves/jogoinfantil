import Phaser from 'phaser';
import { CONFIG } from '../config';
import { fale } from '../narracoes';
import { TEMA } from '../theme';
import { figura, nota, textoEmPainel } from '../ui';
import type { MiniGame, ResultadoMiniGame } from './index';

const W = CONFIG.LARGURA;
const H = CONFIG.DESENHO;

const CARTAS = ['m15_bola', 'm15_urso', 'm15_trem', 'm15_boneca', 'm15_blocos', 'm15_tambor'];
const EMOJIS = ['\u{26BD}', '\u{1F9F8}', '\u{1F682}', '\u{1FA86}', '\u{1F9E9}', '\u{1FA98}'];

interface Carta {
  i: number;
  frente: Phaser.GameObjects.Image | Phaser.GameObjects.Text;
  verso: Phaser.GameObjects.Graphics;
  zona: Phaser.GameObjects.Zone;
  virada: boolean;
  achada: boolean;
}

/** Quebra-cabeca: primeiro a memoria, depois as bolhas. Nunca se perde. */
function memoriaRodada(cena: Phaser.Scene, aoFim: (pontos: number) => void) {
  const baralho = [...CARTAS.keys(), ...CARTAS.keys()];
  Phaser.Utils.Array.Shuffle(baralho);
  const cartas: Carta[] = [];
  let abertas: Carta[] = [];
  let achadas = 0;
  let pontos = 0;
  let travado = false;

  const painel = textoEmPainel(cena, W / 2, 330, 'Ache os pares!', 40, W - 160);

  baralho.forEach((idx, n) => {
    const x = W / 2 + ((n % 3) - 1) * 200;
    const y = 540 + Math.floor(n / 3) * 200;
    const verso = cena.add.graphics();
    verso.fillStyle(TEMA.acao, 1);
    verso.fillRoundedRect(x - 88, y - 88, 176, 176, 26);
    verso.fillStyle(0xffffff, 0.5);
    verso.fillCircle(x, y, 42);
    const frente = figura(cena, x, y, CARTAS[idx], EMOJIS[idx], 140).setVisible(false);
    const zona = cena.add.zone(x, y, 176, 176).setInteractive({ useHandCursor: true });
    const carta: Carta = { i: idx, frente, verso, zona, virada: false, achada: false };
    cartas.push(carta);

    zona.on('pointerdown', () => {
      if (travado || carta.virada || carta.achada) return;
      carta.virada = true;
      carta.verso.setVisible(false);
      carta.frente.setVisible(true);
      nota(700);
      abertas.push(carta);
      if (abertas.length < 2) return;

      const [a, b] = abertas;
      if (a.i === b.i) {
        a.achada = b.achada = true;
        achadas += 1;
        pontos += 1;
        nota(1047);
        cena.tweens.add({ targets: [a.frente, b.frente], scale: a.frente.scale * 1.15, duration: 200, yoyo: true });
        abertas = [];
        if (achadas === CARTAS.length) {
          painel.destroy();
          cena.time.delayedCall(600, () => aoFim(pontos));
        }
        return;
      }
      travado = true;
      cena.time.delayedCall(800, () => {
        for (const c of abertas) {
          c.virada = false;
          c.verso.setVisible(true);
          c.frente.setVisible(false);
        }
        abertas = [];
        travado = false;
      });
    });
  });
}

function bolhasRodada(cena: Phaser.Scene, jaTem: number, aoFim: (pontos: number) => void) {
  let pontos = jaTem;
  let restam = 12;
  const painel = textoEmPainel(cena, W / 2, 330, 'Agora estoure as bolhas!', 40, W - 160);
  fale('mg4_bolhas');

  const soltar = () => {
    if (restam <= 0) return;
    restam -= 1;
    const x = Phaser.Math.Between(140, W - 140);
    const bolha = cena.add.circle(x, H + 80, Phaser.Math.Between(60, 90), 0xbfd4e8, 0.75);
    bolha.setStrokeStyle(6, 0xffffff, 0.9);
    bolha.setInteractive({ useHandCursor: true });
    bolha.on('pointerdown', () => {
      pontos += 1;
      nota(900 + Phaser.Math.Between(0, 200));
      cena.tweens.add({
        targets: bolha,
        scale: 1.6,
        alpha: 0,
        duration: 220,
        onComplete: () => bolha.destroy(),
      });
    });
    cena.tweens.add({
      targets: bolha,
      y: -120,
      x: x + Phaser.Math.Between(-60, 60),
      duration: Phaser.Math.Between(4000, 6500),
      onComplete: () => bolha.destroy(),
    });
    if (restam > 0) cena.time.delayedCall(700, soltar);
    else cena.time.delayedCall(5000, () => {
      painel.destroy();
      aoFim(pontos);
    });
  };
  soltar();
}

export const memoria: MiniGame = {
  id: 'memoria',
  mundo: 4,
  nome: 'Memória e bolhas',
  icone: '\u{1F9E9}',
  tituloFim: 'Que memória boa!',
  fraseFim: 'mg4_fim',
  iconePonto: 'estrela',
  arte: CARTAS,
  iniciar(cena) {
    return new Promise<ResultadoMiniGame>((resolve) => {
      fale('mg4_como_jogar');
      memoriaRodada(cena, (pontos) =>
        bolhasRodada(cena, pontos, (total) => resolve({ pontos: total, concluido: true })),
      );
    });
  },
};
