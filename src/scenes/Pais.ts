import Phaser from 'phaser';
import { comprar, lojaDisponivel, PRECO, restaurar, temTudo } from '../compras';
import { CONFIG, MUNDOS } from '../config';
import { estrelasTotais, partidasHoje } from '../economia';
import { MISSOES } from '../missions';
import { narrador } from '../narrador';
import { TEMA } from '../theme';
import { ativo, remover, salvar, zerarProgresso, type Perfil } from '../storage';
import { botao, botaoVoltar, cobrirTela, fundo, irPara, titulo, toque } from '../ui';
import { musicaDoMundo } from '../musica';
import { setMusicaLigada } from '../musica';

const W = CONFIG.LARGURA;

/** Painel dos pais, protegido por uma conta de matematica simples. */
export class Pais extends Phaser.Scene {
  private p!: Perfil;

  constructor() {
    super('Pais');
  }

  create() {
    musicaDoMundo();
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
    titulo(this, `Progresso de ${this.p.nome}`, 180);
    this.mundosCompletos();

    const feitas = Object.keys(this.p.missoes).length;
    const linhas = [
      `Missões concluídas: ${feitas} de ${MISSOES.length}`,
      `Estrelas: ${estrelasTotais(this.p)}`,
      `Moedas ganhas: ${this.p.moedas}`,
      `Fichas gastas: ${this.p.fichasGastas}`,
      `Fichas no saldo: ${this.p.fichas}`,
      `Broches de mundo: ${this.p.broches.length} de ${MUNDOS.length}`,
      `Partidas hoje: ${partidasHoje(this.p)} de ${this.p.limiteDiario}`,
    ];
    this.add
      .text(60, 372, linhas.join('\n'), { fontSize: '28px', color: '#2b3a4a', lineSpacing: 8 })
      .setOrigin(0, 0);

    // cada ajuste e uma linha so: rotulo a esquerda, botao a direita. Antes
    // era rotulo em cima e botao embaixo, e nao cabia na tela.
    const ajuste = (y: number, texto: () => string, acao: (r: Phaser.GameObjects.Text) => void) => {
      const r = this.add.text(56, y, texto(), { fontSize: '30px', color: '#2b3a4a' }).setOrigin(0, 0.5);
      botao(this, W - 164, y, 'Trocar', () => acao(r), {
        largura: 264,
        cor: 0xbfd4e8,
        altura: 86,
        tamanhoTexto: 30,
      });
      return r;
    };

    ajuste(
      690,
      () => `Voz: ${this.p.voz === 'm' ? 'masculina' : 'feminina'}`,
      (r) => {
        this.p.voz = this.p.voz === 'm' ? 'f' : 'm';
        salvar(this.p);
        narrador.setVoz(this.p.voz);
        r.setText(`Voz: ${this.p.voz === 'm' ? 'masculina' : 'feminina'}`);
        narrador.falar('Pronto! Esta é a voz que vai explicar as missões.');
      },
    );
    ajuste(
      790,
      () => `Música: ${this.p.musica === false ? 'desligada' : 'ligada'}`,
      (r) => {
        this.p.musica = this.p.musica === false;
        salvar(this.p);
        setMusicaLigada(this.p.musica);
        r.setText(`Música: ${this.p.musica === false ? 'desligada' : 'ligada'}`);
      },
    );

    const limite = this.add
      .text(56, 890, `Limite: ${this.p.limiteDiario} partidas por dia`, { fontSize: '30px', color: '#2b3a4a' })
      .setOrigin(0, 0.5);
    const muda = (d: number) => {
      this.p.limiteDiario = Phaser.Math.Clamp(this.p.limiteDiario + d, 0, 20);
      salvar(this.p);
      limite.setText(`Limite: ${this.p.limiteDiario} partidas por dia`);
    };
    botao(this, W - 230, 890, '-1', () => muda(-1), { largura: 120, cor: 0xbfd4e8, altura: 86 });
    botao(this, W - 96, 890, '+1', () => muda(1), { largura: 120, cor: 0xbfd4e8, altura: 86 });
    this.add
      .text(56, 950, `Padrão: ${CONFIG.PARTIDAS_POR_DIA} por dia. 0 desliga os mini games.`, {
        fontSize: '24px',
        color: '#6b7a8a',
      })
      .setOrigin(0, 0.5);

    botao(this, W / 2, 1036, 'Zerar progresso', () => this.confirmar('zerar'), {
      largura: 520,
      cor: 0xffb0a0,
      altura: 96,
    });
    botao(this, W / 2 - 170, 1146, 'Apagar perfil', () => this.confirmar('apagar'), {
      largura: 300,
      cor: 0xff8f7a,
      altura: 96,
    });
    const link = this.add
      .text(W / 2 + 180, 1146, 'Privacidade', { fontSize: '30px', color: '#1f6fb2', fontStyle: 'bold' })
      .setOrigin(0.5);
    toque(link, () => window.open(CONFIG.URL_PRIVACIDADE, '_blank', 'noopener'));
  }

  /**
   * A compra unica que abre os mundos de cima. Fica aqui dentro de proposito:
   * preco e botao de comprar nao aparecem para a crianca em lugar nenhum.
   */
  private mundosCompletos() {
    // com tudo livre (o teste na Play), nao existe o que comprar
    if (CONFIG.MUNDOS_LIVRES >= MUNDOS.length) return;
    if (temTudo()) {
      this.add
        .text(W / 2, 265, '\u{2705} Mundos completos liberados', {
          fontSize: '34px',
          color: '#3f7a52',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
      return;
    }
    const recado = this.add
      .text(W / 2, 344, '', { fontSize: '26px', color: '#b5564a', align: 'center' })
      .setOrigin(0.5);
    const tentar = async (fn: () => Promise<boolean>, falhou: string) => {
      if (!lojaDisponivel()) {
        recado.setText('A compra abre no aplicativo instalado pela Play Store.');
        return;
      }
      recado.setText('Abrindo a loja...');
      recado.setText((await fn()) ? '' : falhou);
      if (temTudo()) irPara(this, 'Pais');
    };
    botao(
      this,
      W / 2,
      248,
      `Abrir todos os mundos — ${PRECO}`,
      () => void tentar(comprar, 'Não deu para concluir a compra.'),
      { largura: 600, cor: TEMA.sim, tamanhoTexto: 32 },
    );
    const link = this.add
      .text(W / 2, 318, 'Já comprei, restaurar', { fontSize: '26px', color: '#1f6fb2' })
      .setOrigin(0.5);
    toque(link, () => void tentar(restaurar, 'Não achei uma compra nesta conta.'));
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
