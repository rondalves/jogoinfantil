import Phaser from 'phaser';
import { abas, TOPO_ABAS } from '../abas';
import { AUDIOS_HISTORIA } from '../assets';
import { CONFIG } from '../config';
import { historiaAberta, porQueFechado } from '../desbloqueio';
import { narrador } from '../narrador';
import { ativo, type Perfil } from '../storage';
import { HISTORIAS, type Historia } from '../stories';
import { TEMA } from '../theme';
import { area, botaoOuvir, carregarCapas, figura, fundo, irPara, nota, titulo } from '../ui';

const W = CONFIG.LARGURA;

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

  constructor() {
    super('Historinhas');
  }

  create() {
    this.p = ativo()!;
    narrador.setNome(this.p.nome);
    narrador.setVoz(this.p.voz ?? 'f');
    fundo(this, TEMA.creme, 'bg_mapa_mundos');
    botaoOuvir(this);
    titulo(this, 'Historinhas', 170);
    narrador.falar('Escolha uma historinha para ouvir.', 'biblioteca_historias');

    carregarCapas(this, HISTORIAS.map((h) => h.capa), () => this.cartoes());
    abas(this, 'Historinhas');
  }

  private cartoes() {
    const larg = 300;
    const alt = 238;
    HISTORIAS.forEach((h, i) => {
      const x = W / 2 + (i % 2 === 0 ? -1 : 1) * (larg / 2 + 12);
      const y = 334 + Math.floor(i / 2) * (alt + 20);
      if (y + alt / 2 > TOPO_ABAS) return;
      this.cartao(h, x, y, larg, alt);
    });
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

    const rotulo = aberta ? h.titulo : '\u{1F512}';
    this.add
      .text(x, y + alt / 2 - 42, rotulo, {
        fontSize: aberta ? '24px' : '40px',
        color: '#3a3f45',
        align: 'center',
        wordWrap: { width: larg - 28 },
      })
      .setOrigin(0.5);

    if (aberta && !temAudio) {
      // fita no alto do cartao: embaixo bateria no titulo
      this.add
        .text(x, y - alt / 2 + 22, 'em breve', { fontSize: '20px', color: '#8a8f96' })
        .setOrigin(0.5);
    }

    const fala = aberta
      ? temAudio
        ? h.titulo
        : `${h.titulo}. Essa ainda está sendo gravada.`
      : porQueFechado(this.p, h.mundo);

    area(this, x, y, larg, alt, () => {
      if (!aberta || !temAudio) {
        narrador.falar(fala);
        return;
      }
      nota(740);
      irPara(this, 'Historia', { id: h.id });
    }, fala);
  }
}
