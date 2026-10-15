import { LIMITES_MIN, limiteDoPerfil } from '../tempoDeJogo';
import { JOGUINHOS } from '../joguinhos';
import { joguinhosLiberados } from '../desbloqueio';
import Phaser from 'phaser';
import { comprar, lojaDisponivel, PRECO, restaurar, temTudo } from '../compras';
import { CONFIG, MUNDOS } from '../config';
import { estrelasTotais } from '../economia';
import { MISSOES } from '../missions';
import { narrador, temGravacoes } from '../narrador';
import { TEMA } from '../theme';
import { ativo, remover, salvar, zerarProgresso, type Perfil } from '../storage';
import { botao, botaoVoltar, cobrirTela, fundo, irPara, titulo, toque } from '../ui';
import { musicaDoMundo } from '../musica';
import { criarSenha, portaoAdulto } from '../portaoAdulto';
import { setMusicaLigada } from '../musica';

const W = CONFIG.LARGURA;

/** Painel dos pais, protegido pela senha que o adulto cria (portaoAdulto.ts). */
export class Pais extends Phaser.Scene {
  private p!: Perfil;

  constructor() {
    super('Pais');
  }

  create(dados?: { aberto?: boolean }) {
    musicaDoMundo();
    this.p = ativo()!;
    fundo(this, TEMA.nuvem);
    botaoVoltar(this, 'Mapa');
    narrador.parar();
    // depois da compra a tela recarrega ja aberta: o adulto acabou de passar pela senha
    if (dados?.aberto) this.painel();
    else portaoAdulto(this, () => this.painel(), () => irPara(this, 'Mapa'));
  }

  private painel() {
    titulo(this, `Progresso de ${this.p.nome}`, 180);
    this.mundosCompletos();

    const feitas = Object.keys(this.p.missoes).length;
    const linhas = [
      `Missões concluídas: ${feitas} de ${MISSOES.length}`,
      `Estrelas: ${estrelasTotais(this.p)}`,
      `Moedas ganhas: ${this.p.moedas}`,
      `Broches de mundo: ${this.p.broches.length} de ${MUNDOS.length}`,
      `Joguinhos liberados: ${joguinhosLiberados(this.p).length} de ${JOGUINHOS.length}`,
    ];
    // a compra fica entre o titulo e este bloco: por isso ele comeca em 404
    this.add
      .text(60, 404, linhas.join('\n'), { fontSize: '28px', color: '#2b3a4a', lineSpacing: 8 })
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

    // a troca de voz so aparece quando houver fala gravada: sem ela nao ha o que trocar
    let y = 680;
    if (temGravacoes) {
      ajuste(
        y,
        () => `Voz: ${this.p.voz === 'm' ? 'masculina' : 'feminina'}`,
        (r) => {
          this.p.voz = this.p.voz === 'm' ? 'f' : 'm';
          salvar(this.p);
          narrador.setVoz(this.p.voz);
          r.setText(`Voz: ${this.p.voz === 'm' ? 'masculina' : 'feminina'}`);
          narrador.falar('Pronto! Esta é a voz que vai explicar as missões.');
        },
      );
      y += 95;
    }
    ajuste(
      y,
      () => `Música: ${this.p.musica === false ? 'desligada' : 'ligada'}`,
      (r) => {
        this.p.musica = this.p.musica === false;
        salvar(this.p);
        setMusicaLigada(this.p.musica);
        r.setText(`Música: ${this.p.musica === false ? 'desligada' : 'ligada'}`);
      },
    );

    // joguinho nao acaba sozinho: passou deste tempo no dia, aparece o aviso
    // "ja fez as suas tarefas?" e so um adulto libera mais
    ajuste(
      y + 95,
      () => `Joguinhos: ${limiteDoPerfil()} min/dia`,
      (r) => {
        const i = LIMITES_MIN.indexOf(limiteDoPerfil());
        this.p.limiteJogoMin = LIMITES_MIN[(i + 1) % LIMITES_MIN.length];
        salvar(this.p);
        r.setText(`Joguinhos: ${limiteDoPerfil()} min/dia`);
      },
    );

    ajuste(
      y + 190,
      () => 'Senha do adulto',
      () => criarSenha(this, () => undefined, () => undefined),
    );

    botao(this, W / 2, 1060, 'Zerar progresso', () => this.confirmar('zerar'), {
      largura: 520,
      cor: 0xffb0a0,
      altura: 96,
    });
    botao(this, W / 2 - 170, 1165, 'Apagar perfil', () => this.confirmar('apagar'), {
      largura: 300,
      cor: 0xff8f7a,
      altura: 96,
    });
    const link = this.add
      .text(W / 2 + 180, 1165, 'Privacidade', { fontSize: '30px', color: '#1f6fb2', fontStyle: 'bold' })
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
      .text(W / 2, 380, '', { fontSize: '24px', color: '#b5564a', align: 'center', wordWrap: { width: W - 120 } })
      .setOrigin(0.5);
    const tentar = async (fn: () => Promise<boolean>, falhou: string) => {
      if (!lojaDisponivel()) {
        recado.setText('A compra abre no aplicativo instalado pela Play Store.');
        return;
      }
      recado.setText('Abrindo a Play Store...');
      recado.setText((await fn()) ? '' : falhou);
      if (temTudo()) irPara(this, 'Pais', { aberto: true });
    };
    const pagos = MUNDOS.filter((m) => m.id > CONFIG.MUNDOS_LIVRES).map((m) => m.id);
    botao(
      this,
      W / 2,
      268,
      `Abrir os mundos ${pagos.join(' e ')} — ${PRECO}`,
      () => void tentar(comprar, 'Não deu para concluir a compra.'),
      { largura: 600, cor: TEMA.sim, tamanhoTexto: 30, altura: 86 },
    );
    // quem ja pagou e trocou de celular: a Play reconhece pela conta que esta
    // na loja do aparelho, nao tem e-mail para digitar
    botao(
      this,
      W / 2,
      338,
      'Já comprei: restaurar pela conta da Play Store',
      () => void tentar(restaurar, 'Não achei uma compra na conta da Play Store deste celular.'),
      { largura: 600, cor: 0xbfd4e8, tamanhoTexto: 24, altura: 56 },
    );
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
