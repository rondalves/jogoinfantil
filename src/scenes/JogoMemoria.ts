import Phaser from 'phaser';
import { carregar } from '../assets';
import { CONFIG } from '../config';
import { fale } from '../narracoes';
import { narrador } from '../narrador';
import { ativo } from '../storage';
import { vigiarTempo } from '../tempoDeJogo';
import { TEMA } from '../theme';
import { botaoOuvir, botaoVoltar, confete, figura, fundo, nota, textoEmPainel } from '../ui';

const W = CONFIG.LARGURA;

/** Figuras do proprio jogo: a crianca reconhece o que ja viu nas missoes. */
const FIGURAS: [string, string][] = [
  ['mascote_raposinha', '\u{1F98A}'],
  ['m06_faixa', '\u{1F6B8}'],
  ['m06_sinal_verde', '\u{1F6A6}'],
  ['m06_carro', '\u{1F697}'],
  ['m06_bola', '\u{26BD}'],
  ['m01_escova', '\u{1FAA5}'],
  ['m05_mochila', '\u{1F392}'],
  ['m01_maca', '\u{1F34E}'],
  ['m24_chuveiro', '\u{1F6BF}'],
  ['m24_sabonete', '\u{1F9FC}'],
  ['m19_lua', '\u{1F319}'],
  ['m19_livro', '\u{1F4D6}'],
  ['m15_urso', '\u{1F9F8}'],
  ['m15_trem', '\u{1F682}'],
  ['mg1_kart', '\u{1F3CE}\u{FE0F}'],
  ['m10_coracao', '\u{2764}\u{FE0F}'],
  ['estrela', '\u{2B50}'],
  ['m19_pijama', '\u{1F455}'],
];

/** As figuras da rodada, em pares, ja embaralhadas. */
function baralho(pares: number) {
  const escolhidas = Phaser.Utils.Array.Shuffle([...FIGURAS.keys()]).slice(0, pares);
  return Phaser.Utils.Array.Shuffle([...escolhidas, ...escolhidas]);
}

interface Carta {
  figura: number;
  frente: Phaser.GameObjects.Image | Phaser.GameObjects.Text;
  aberta: boolean;
  achada: boolean;
  mostrar: (sim: boolean) => void;
}

/**
 * Joguinho da memoria, sem fim: acabou uma rodada, vem outra com figuras
 * novas. A primeira rodada tem 4 pares; as seguintes, 6. Errar so vira as
 * cartas de volta. Quem para e a crianca (ou o aviso de tempo).
 */
export class JogoMemoria extends Phaser.Scene {
  private rodada = 0;
  private achados = 0;
  private placar!: Phaser.GameObjects.Text;
  private mesa!: Phaser.GameObjects.Container;

  constructor() {
    super('JogoMemoria');
  }

  create() {
    const p = ativo();
    if (p) {
      narrador.setNome(p.nome);
      narrador.setVoz(p.voz ?? 'f');
    }
    this.rodada = 0;
    this.achados = 0;
    // a tela so se monta depois das figuras: montar antes e trocar o fundo
    // depois fazia a tela piscar duas vezes
    carregar(this, FIGURAS.map(([k]) => k).concat('bg_quarto_brincar'), () => {
      fundo(this, TEMA.creme, 'bg_quarto_brincar', true);
      botaoVoltar(this, 'Joguinhos');
      botaoOuvir(this);
      this.placar = this.add
        .text(W / 2, 96, '', { fontSize: '44px', color: '#2b3a4a', fontStyle: 'bold' })
        .setOrigin(0.5)
        .setStroke('#ffffff', 10);
      this.mesa = this.add.container(0, 0);
      vigiarTempo(this);
      fale('jogo_memoria');
      this.novaRodada();
    });
  }

  private novaRodada() {
    this.mesa.removeAll(true);
    this.rodada += 1;
    const pares = this.rodada === 1 ? 4 : 6;
    const cartas = baralho(pares);
    // quatro por fileira: em pe, com duas colunas, a mesa subia ate o titulo
    const cols = 4;
    const lado = pares === 4 ? 160 : 150;
    const passo = lado + 18;
    const linhas = Math.ceil(cartas.length / cols);
    const y0 = 660 - ((linhas - 1) * passo) / 2;
    this.mesa.add(textoEmPainel(this, W / 2, 230, 'Ache os pares!', 40, W - 220));
    this.atualizarPlacar();

    let abertas: Carta[] = [];
    let travado = false;
    let achadasNaRodada = 0;

    cartas.forEach((fig, n) => {
      const x = W / 2 + ((n % cols) - (cols - 1) / 2) * passo;
      const y = y0 + Math.floor(n / cols) * passo;
      const verso = this.add.graphics();
      verso.fillStyle(TEMA.acao, 1);
      verso.fillRoundedRect(x - lado / 2, y - lado / 2, lado, lado, 28);
      verso.lineStyle(6, 0xffffff, 0.85);
      verso.strokeRoundedRect(x - lado / 2 + 10, y - lado / 2 + 10, lado - 20, lado - 20, 22);
      verso.fillStyle(0xffffff, 0.55);
      verso.fillCircle(x, y, lado * 0.18);
      const fundoCarta = this.add.graphics();
      fundoCarta.fillStyle(0xffffff, 1);
      fundoCarta.fillRoundedRect(x - lado / 2, y - lado / 2, lado, lado, 28);
      fundoCarta.setVisible(false);
      const [arte, emoji] = FIGURAS[fig];
      const frente = figura(this, x, y, arte, emoji, lado * 0.72).setVisible(false);
      const carta: Carta = {
        figura: fig,
        frente,
        aberta: false,
        achada: false,
        mostrar: (sim) => {
          carta.aberta = sim;
          verso.setVisible(!sim);
          fundoCarta.setVisible(sim);
          frente.setVisible(sim);
        },
      };
      const zona = this.add.zone(x, y, lado, lado).setInteractive({ useHandCursor: true });
      this.mesa.add([verso, fundoCarta, frente, zona]);

      zona.on('pointerdown', () => {
        if (travado || carta.aberta || carta.achada) return;
        carta.mostrar(true);
        nota(700);
        abertas.push(carta);
        if (abertas.length < 2) return;
        const [a, b] = abertas;
        abertas = [];
        if (a.figura === b.figura) {
          a.achada = b.achada = true;
          achadasNaRodada += 1;
          this.achados += 1;
          this.atualizarPlacar();
          nota(1047);
          this.tweens.add({ targets: [a.frente, b.frente], scale: a.frente.scale * 1.15, duration: 200, yoyo: true });
          if (achadasNaRodada === pares) this.fimDaRodada();
          return;
        }
        // errou: as duas viram de volta, sem castigo
        travado = true;
        this.time.delayedCall(850, () => {
          a.mostrar(false);
          b.mostrar(false);
          travado = false;
        });
      });
    });
  }

  private atualizarPlacar() {
    this.placar.setText(`\u{2B50} ${this.achados}`);
  }

  private fimDaRodada() {
    confete(this, 50);
    [0, 160, 320].forEach((t, i) => this.time.delayedCall(t, () => nota(880 + i * 220)));
    this.time.delayedCall(900, () => fale('jogo_memoria_rodada'));
    this.time.delayedCall(2600, () => this.novaRodada());
  }
}
