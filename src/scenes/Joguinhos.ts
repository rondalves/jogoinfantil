import Phaser from 'phaser';
import { abas, seloNovo, TOPO_ABAS } from '../abas';
import { CONFIG } from '../config';
import { joguinhoAberto, porQueFechado } from '../desbloqueio';
import { JOGUINHOS, type Joguinho } from '../joguinhos';
import { narrador } from '../narrador';
import { ativo, type Perfil, salvar } from '../storage';
import { TEMA } from '../theme';
import { area, botaoOuvir, fundo, irPara, nota, titulo } from '../ui';

const W = CONFIG.LARGURA;

/** Que cena abre cada tipo de joguinho. Tipo fora daqui aparece "em breve". */
const ABRIR: Record<string, [string, object?]> = {
  colorir: ['Colorir'],
  memoria: ['JogoMemoria'],
  corrida: ['MiniGame', { id: 'corrida' }],
  encaixe: ['Encaixe'],
  moto: ['MotoMontanha'],
  bolhas: ['Bolhas'],
};

/**
 * A prateleira de joguinhos.
 *
 * Premio de mundo fechado, nao moeda: nao gasta ficha, nao tem derrota, nao
 * tem erro que pune e nao da estrela. Jogar de novo e de graca, sempre. O que
 * ainda nao abriu fica como silhueta com cadeado, para a crianca ver que tem
 * mais coisa vindo.
 */
export class Joguinhos extends Phaser.Scene {
  private p!: Perfil;

  constructor() {
    super('Joguinhos');
  }

  create() {
    this.p = ativo()!;
    narrador.setNome(this.p.nome);
    narrador.setVoz(this.p.voz ?? 'f');
    fundo(this, TEMA.creme, 'bg_mapa_mundos', true);
    botaoOuvir(this);
    titulo(this, 'Joguinhos', 170);
    narrador.falar('Escolha um joguinho. Aqui é só brincar!', 'biblioteca_jogos');

    const larg = 300;
    const alt = 200;
    JOGUINHOS.forEach((j, i) => {
      const x = W / 2 + (i % 2 === 0 ? -1 : 1) * (larg / 2 + 12);
      const y = 334 + Math.floor(i / 2) * (alt + 20);
      if (y + alt / 2 > TOPO_ABAS) return;
      this.cartao(j, x, y, larg, alt);
    });
    abas(this, 'Joguinhos');
  }

  private cartao(j: Joguinho, x: number, y: number, larg: number, alt: number) {
    const aberto = joguinhoAberto(this.p, j);
    const pronto = j.tipo in ABRIR;
    const novo = aberto && !(this.p.joguinhosVistos ?? []).includes(j.id);

    const g = this.add.graphics();
    g.fillStyle(0xffffff, aberto ? 0.97 : 0.6);
    g.fillRoundedRect(x - larg / 2, y - alt / 2, larg, alt, 26);

    this.add
      .text(x, y - 30, aberto ? j.icone : '\u{1F512}', { fontSize: '76px' })
      .setOrigin(0.5)
      .setAlpha(aberto ? 1 : 0.45);
    this.add
      .text(x, y + alt / 2 - 44, j.titulo, {
        fontSize: '24px',
        color: aberto ? '#3a3f45' : '#8a8f96',
        align: 'center',
        wordWrap: { width: larg - 28 },
      })
      .setOrigin(0.5);
    if (aberto && !pronto) {
      // fita no alto do cartao: embaixo bateria no titulo
      this.add
        .text(x, y - alt / 2 + 22, 'em breve', { fontSize: '20px', color: '#8a8f96' })
        .setOrigin(0.5);
    }

    if (novo) seloNovo(this, x + larg / 2 - 34, y - alt / 2 + 30);

    const fala = aberto
      ? pronto
        ? j.titulo
        : `${j.titulo}. Esse joguinho ainda está sendo feito.`
      : porQueFechado(this.p, j.mundo);

    area(this, x, y, larg, alt, () => {
      if (!aberto || !pronto) {
        narrador.falar(fala);
        return;
      }
      nota(740);
      if (novo) {
        this.p.joguinhosVistos = [...(this.p.joguinhosVistos ?? []), j.id];
        salvar(this.p);
      }
      const [cena, dados] = ABRIR[j.tipo];
      irPara(this, cena, dados);
    }, fala);
  }
}
