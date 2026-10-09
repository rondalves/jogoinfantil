import Phaser from 'phaser';
import { abas } from '../abas';
import { darVida } from '../animacoes';
import { CONFIG, MUNDOS } from '../config';
import { historiasLiberadas, joguinhosLiberados, mundosConcluidos } from '../desbloqueio';
import { estrelasTotais } from '../economia';
import { MISSOES } from '../missions';
import { narrador } from '../narrador';
import { desenharPersonagem } from '../personagem';
import { ativo, type Perfil } from '../storage';
import { TEMA } from '../theme';
import { area, botaoOuvir, figura, fundo, titulo } from '../ui';

const W = CONFIG.LARGURA;

/**
 * Meu cantinho: o que a crianca ja juntou.
 *
 * Nao e painel de progresso de adulto — e a vitrine dela. Numero grande,
 * desenho grande, e o personagem no meio. Nada aqui e botao de fazer alguma
 * coisa: e so para olhar e ter orgulho.
 */
export class Cantinho extends Phaser.Scene {
  private p!: Perfil;

  constructor() {
    super('Cantinho');
  }

  create() {
    this.p = ativo()!;
    narrador.setNome(this.p.nome);
    narrador.setVoz(this.p.voz ?? 'f');
    fundo(this, TEMA.creme, 'bg_criador_personagem');
    botaoOuvir(this);
    titulo(this, `O cantinho de ${this.p.nome}`, 170);

    const boneco = desenharPersonagem(this, this.p.personagem, 0.6);
    boneco.setPosition(W / 2, 400);
    darVida(this, boneco);

    const feitas = Object.keys(this.p.missoes).length;
    const linhas: [string, string, number | string][] = [
      ['estrela', '\u{2B50}', estrelasTotais(this.p)],
      ['moeda', '\u{1FA99}', this.p.moedas],
      ['ficha', '\u{1F39F}\u{FE0F}', this.p.fichas],
    ];
    linhas.forEach(([arte, emoji, valor], i) => {
      const x = W / 2 + (i - 1) * 210;
      const g = this.add.graphics();
      g.fillStyle(0xffffff, 0.96);
      g.fillRoundedRect(x - 95, 700, 190, 170, 26);
      figura(this, x, 755, arte, emoji, 70);
      this.add
        .text(x, 830, String(valor), { fontSize: '46px', color: '#3a3f45', fontStyle: 'bold' })
        .setOrigin(0.5);
    });
    const nomes = ['estrelas', 'moedas', 'fichas'];
    linhas.forEach((l, i) =>
      area(this, W / 2 + (i - 1) * 210, 785, 190, 170, undefined, `${l[2]} ${nomes[i]}`),
    );

    const concluidos = mundosConcluidos(this.p);
    const resumo = [
      `${feitas} de ${MISSOES.length} missões feitas`,
      `${concluidos.length} de ${MUNDOS.length} mundos fechados`,
      `${historiasLiberadas(this.p).length} historinhas e ${joguinhosLiberados(this.p).length} joguinhos abertos`,
    ].join('\n');
    const painel = this.add.graphics();
    painel.fillStyle(0xffffff, 0.96);
    painel.fillRoundedRect(60, 905, W - 120, 180, 26);
    const t = this.add
      .text(W / 2, 995, resumo, {
        fontSize: '30px',
        color: '#3a3f45',
        align: 'center',
        lineSpacing: 12,
      })
      .setOrigin(0.5);
    area(this, W / 2, 995, W - 120, 180, undefined, t.text.replace(/\n/g, '. '));

    this.broches();
    abas(this, 'Cantinho');
  }

  /** Os broches dos mundos fechados, lado a lado. */
  private broches() {
    MUNDOS.forEach((m, i) => {
      const x = W / 2 + (i - (MUNDOS.length - 1) / 2) * 110;
      const tem = this.p.broches.includes(m.id);
      const b = figura(this, x, 616, tem ? `broche${m.id}` : 'mundo_bloqueado', m.icone, 86);
      if (!tem) b.setAlpha(0.3);
      area(this, x, 616, 100, 100, undefined, tem ? `Broche do mundo ${m.id}` : `Mundo ${m.id} ainda fechado`);
    });
  }
}
