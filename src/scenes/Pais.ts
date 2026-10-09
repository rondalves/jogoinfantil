import Phaser from 'phaser';
import { CONFIG } from '../config';
import { estrelasTotais, partidasHoje } from '../economia';
import { MISSOES } from '../missions';
import { narrador } from '../narrador';
import { TEMA } from '../theme';
import { ativo, remover, salvar, zerarProgresso, type Perfil } from '../storage';
import { botao, botaoVoltar, cobrirTela, fundo, irPara, titulo, toque } from '../ui';

const W = CONFIG.LARGURA;

/** Painel dos pais, protegido por uma conta de matematica simples. */
export class Pais extends Phaser.Scene {
  private p!: Perfil;

  constructor() {
    super('Pais');
  }

  create() {
    this.p = ativo()!;
    fundo(this, TEMA.nuvem);
    botaoVoltar(this, 'Mapa');
    narrador.parar();
    this.portao();
  }

  private portao() {
    const a = Phaser.Math.Between(3, 9);
    const b = Phaser.Math.Between(4, 9);
    const certo = a * b;
    const capa = this.add.container(0, 0);
    capa.add(titulo(this, 'Área dos adultos', 220));
    capa.add(
      this.add.text(W / 2, 360, `Quanto é ${a} x ${b}?`, { fontSize: '54px', color: '#2b3a4a' }).setOrigin(0.5),
    );
    const recado = this.add.text(W / 2, 1080, '', { fontSize: '40px', color: '#b5564a' }).setOrigin(0.5);
    capa.add(recado);

    const erradas = new Set<number>();
    while (erradas.size < 2) {
      const n = certo + Phaser.Math.Between(-12, 12);
      if (n !== certo && n > 0) erradas.add(n);
    }
    for (const [i, n] of Phaser.Utils.Array.Shuffle([certo, ...erradas]).entries()) {
      capa.add(
        botao(
          this,
          W / 2,
          540 + i * 160,
          String(n),
          () => {
            if (n !== certo) {
              recado.setText('Tente de novo');
              return;
            }
            capa.destroy();
            this.painel();
          },
          { largura: 260 },
        ),
      );
    }
  }

  private painel() {
    titulo(this, `Progresso de ${this.p.nome}`, 190);
    const feitas = Object.keys(this.p.missoes).length;
    const linhas = [
      `Missões concluídas: ${feitas} de ${MISSOES.length}`,
      `Estrelas: ${estrelasTotais(this.p)}`,
      `Moedas ganhas: ${this.p.moedas}`,
      `Fichas gastas: ${this.p.fichasGastas}`,
      `Fichas no saldo: ${this.p.fichas}`,
      `Broches de mundo: ${this.p.broches.length} de 5`,
      `Partidas hoje: ${partidasHoje(this.p)} de ${this.p.limiteDiario}`,
    ];
    this.add
      .text(60, 290, linhas.join('\n'), { fontSize: '34px', color: '#2b3a4a', lineSpacing: 12 })
      .setOrigin(0, 0);

    const nomeVoz = () => (this.p.voz === 'm' ? 'masculina' : 'feminina');
    const vozRotulo = this.add
      .text(W / 2, 680, `Voz do narrador: ${nomeVoz()}`, { fontSize: '36px', color: '#2b3a4a' })
      .setOrigin(0.5);
    botao(
      this,
      W / 2,
      770,
      'Trocar a voz',
      () => {
        this.p.voz = this.p.voz === 'm' ? 'f' : 'm';
        salvar(this.p);
        narrador.setVoz(this.p.voz);
        vozRotulo.setText(`Voz do narrador: ${nomeVoz()}`);
        narrador.falar('Pronto! Esta é a voz que vai explicar as missões.');
      },
      { largura: 380, cor: 0xbfd4e8 },
    );

    const rotulo = this.add
      .text(W / 2, 870, `Limite diário: ${this.p.limiteDiario} partidas`, { fontSize: '36px', color: '#2b3a4a' })
      .setOrigin(0.5);
    const muda = (d: number) => {
      this.p.limiteDiario = Phaser.Math.Clamp(this.p.limiteDiario + d, 0, 20);
      salvar(this.p);
      rotulo.setText(`Limite diário: ${this.p.limiteDiario} partidas`);
    };
    botao(this, W / 2 - 150, 965, '-1', () => muda(-1), { largura: 200, cor: 0xbfd4e8 });
    botao(this, W / 2 + 150, 965, '+1', () => muda(1), { largura: 200, cor: 0xbfd4e8 });
    this.add
      .text(W / 2, 1040, `Padrão: ${CONFIG.PARTIDAS_POR_DIA} por dia. 0 desliga os mini games.`, {
        fontSize: '28px',
        color: '#6b7a8a',
      })
      .setOrigin(0.5);

    botao(this, W / 2, 1120, 'Zerar progresso', () => this.confirmar('zerar'), { largura: 520, cor: 0xffb0a0 });
    botao(this, W / 2 - 185, 1228, 'Apagar perfil', () => this.confirmar('apagar'), { largura: 330, cor: 0xff8f7a });

    const link = this.add
      .text(W / 2 + 185, 1228, 'Privacidade', {
        fontSize: '30px',
        color: '#1f6fb2',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    toque(link, () => window.open(CONFIG.URL_PRIVACIDADE, '_blank', 'noopener'));
  }

  private confirmar(acao: 'zerar' | 'apagar') {
    const capa = this.add.container(0, 0).setDepth(100);
    capa.add(cobrirTela(this, 0x12263a, 0.9));
    capa.add(
      this.add
        .text(
          W / 2,
          460,
          acao === 'zerar'
            ? `Apagar todo o progresso de ${this.p.nome}?\nO personagem continua.`
            : `Apagar o perfil de ${this.p.nome}?\nIsso remove tudo.`,
          { fontSize: '42px', color: '#ffffff', align: 'center', wordWrap: { width: W - 120 } },
        )
        .setOrigin(0.5),
    );
    capa.add(
      botao(this, W / 2, 700, 'Sim, apagar', () => {
        if (acao === 'zerar') zerarProgresso(this.p.id);
        else remover(this.p.id);
        irPara(this, acao === 'zerar' ? 'Mapa' : 'Boot');
      }, { largura: 460, cor: 0xff8f7a }),
    );
    capa.add(botao(this, W / 2, 860, 'Cancelar', () => capa.destroy(), { largura: 460, cor: 0x7ddc8a }));
  }
}
