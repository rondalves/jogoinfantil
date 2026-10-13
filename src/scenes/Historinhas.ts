import Phaser from 'phaser';
import { abas, TOPO_ABAS } from '../abas';
import { AUDIOS_HISTORIA } from '../assets';
import { CONFIG } from '../config';
import { historiaAberta, porQueFechado } from '../desbloqueio';
import { narrador } from '../narrador';
import { ativo, type Perfil } from '../storage';
import { HISTORIAS, type Historia } from '../stories';
import { TEMA } from '../theme';
import { area, botaoOuvir, carregarCapas, figura, fundo, irPara, nota, rolagem, TELA, titulo } from '../ui';

const W = CONFIG.LARGURA;
/** onde a lista comeca, logo abaixo do titulo */
const TOPO = 250;

/**
 * A estante de historinhas.
 *
 * So ouvir: nao tem estrela, nao tem erro e nao gasta ficha. Cada mundo
 * fechado abre uma, e ela fica aberta para sempre. O que ainda nao abriu
 * aparece como silhueta com cadeado em vez de sumir: a crianca ve que tem
 * mais coisa vindo.
 */
export class Historinhas extends Phaser.Scene {
  private p!: Perfil;
  private titulo!: Phaser.GameObjects.Text;
  private arrastou = () => false;

  constructor() {
    super('Historinhas');
  }

  create() {
    this.p = ativo()!;
    narrador.setNome(this.p.nome);
    narrador.setVoz(this.p.voz ?? 'f');
    fundo(this, TEMA.creme, 'bg_mapa_mundos', true);
    botaoOuvir(this);
    this.titulo = titulo(this, 'Historinhas', 170);
    narrador.falar('Escolha uma historinha para ouvir.', 'biblioteca_historias');

    carregarCapas(this, HISTORIAS.map((h) => h.capa), () => {
      this.cartoes();
      // fundo do player ja fica pronto aqui: la, fundo() so desenha a imagem se a textura existir.
      // Depois dos cartoes, para eles nao esperarem uma imagem que esta tela nem mostra.
      carregarCapas(this, ['bg_quarto_noite'], () => undefined);
    });
    abas(this, 'Historinhas');
  }

  private cartoes() {
    const larg = 300;
    const alt = 238;
    // a lista rola por baixo do cabecalho e some atras das abas
    this.add.rectangle(W / 2, (TELA.topo + TOPO) / 2, W, TOPO - TELA.topo, 0xffffff, 0.95).setDepth(45);
    this.titulo.setDepth(46);
    const lista = this.add.container(0, TOPO).setName('rola');
    const total = Math.max(HISTORIAS.length, CONFIG.HISTORIAS_PREVISTAS);
    for (let i = 0; i < total; i++) {
      const x = W / 2 + (i % 2 === 0 ? -1 : 1) * (larg / 2 + 12);
      const y = 20 + alt / 2 + Math.floor(i / 2) * (alt + 20);
      const h = HISTORIAS[i];
      lista.add(h ? this.cartao(h, x, y, larg, alt) : this.porVir(i + 1, x, y, larg, alt));
    }
    const altura = Math.ceil(total / 2) * (alt + 20) + 20;
    this.arrastou = rolagem(this, lista, TOPO, TOPO_ABAS - 10, altura);
  }

  /** Historinha que ainda vai ser gravada: so o numero, com "em breve" em cima. */
  private porVir(n: number, x: number, y: number, larg: number, alt: number) {
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 0.6);
    g.fillRoundedRect(x - larg / 2, y - alt / 2, larg, alt, 26);
    return [
      g,
      this.add.text(x, y - alt / 2 + 30, 'em breve', { fontSize: '24px', color: '#8a8f96' }).setOrigin(0.5),
      this.add
        .text(x, y + 14, String(n), { fontSize: '96px', color: '#b9bec4', fontStyle: 'bold' })
        .setOrigin(0.5),
    ];
  }

  private cartao(h: Historia, x: number, y: number, larg: number, alt: number) {
    const aberta = historiaAberta(this.p, h);
    const temAudio = !!AUDIOS_HISTORIA[h.audio];

    const g = this.add.graphics();
    g.fillStyle(0xffffff, aberta ? 0.97 : 0.6);
    g.fillRoundedRect(x - larg / 2, y - alt / 2, larg, alt, 26);
    const capa = figura(this, x, y - 28, h.capa, h.icone, 150);
    // silhueta clara, nao mancha preta: a capa fica adivinhavel, nao escondida
    if (!aberta) capa.setTint(0xb9bec4).setAlpha(0.45);

    const rotulo = this.add
      .text(x, y + alt / 2 - 42, aberta ? h.titulo : '\u{1F512}', {
        fontSize: aberta ? '24px' : '40px',
        color: '#3a3f45',
        align: 'center',
        wordWrap: { width: larg - 28 },
      })
      .setOrigin(0.5);
    const partes: Phaser.GameObjects.GameObject[] = [g, capa, rotulo];

    if (aberta && !temAudio) {
      // fita no alto do cartao: embaixo bateria no titulo
      partes.push(
        this.add.text(x, y - alt / 2 + 22, 'em breve', { fontSize: '20px', color: '#8a8f96' }).setOrigin(0.5),
      );
    }

    const fala = aberta
      ? temAudio
        ? h.titulo
        : `${h.titulo}. Essa ainda está sendo gravada.`
      : porQueFechado(this.p, h.mundo);

    // ao soltar, nao ao encostar: encostar para arrastar a lista nao pode abrir a historinha
    const z = area(this, x, y, larg, alt, undefined, fala).on('pointerup', () => {
      if (this.arrastou()) return;
      if (!aberta || !temAudio) {
        narrador.falar(fala);
        return;
      }
      nota(740);
      irPara(this, 'Historia', { id: h.id });
    });
    partes.push(z);
    return partes;
  }
}
