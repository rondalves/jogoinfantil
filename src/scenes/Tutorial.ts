import Phaser from 'phaser';
import { darVida } from '../animacoes';
import { CONFIG } from '../config';
import { narrador } from '../narrador';
import { fale, type Chave } from '../narracoes';
import { desenharPersonagem } from '../personagem';
import { ativo, salvar, type Perfil } from '../storage';
import { TEMA } from '../theme';
import { balao, botao, botaoOuvir, carregarCapas, cobrirTela, figura, fundo, irPara } from '../ui';

const W = CONFIG.LARGURA;

interface Passo {
  chave: Chave;
  /** figurinhas embaixo do balao: [arte, emoji de reserva]; vazio = o personagem da crianca */
  figuras: [string, string][];
}

/**
 * A raposinha conta a ideia do jogo: aqui se aprendem as tarefas do dia, e
 * cada mundo cumprido abre um joguinho e uma historinha. Passa no toque, nao
 * no relogio: sem voz gravada, quem le e o adulto, no ritmo dele.
 */
const PASSOS: Passo[] = [
  { chave: 'tut_1', figuras: [] },
  { chave: 'tut_2', figuras: [['m01_escova', '\u{1FAA5}'], ['m02_cama_arrumada', '\u{1F6CF}\u{FE0F}'], ['', '\u{1F6C1}']] },
  { chave: 'tut_3', figuras: [['mundo1', '\u{1F5FA}\u{FE0F}'], ['estrela', '\u{2B50}']] },
  { chave: 'tut_4', figuras: [['', '\u{2705}'], ['', '\u{27A1}\u{FE0F}'], ['', '\u{1F3AE}']] },
  { chave: 'tut_5', figuras: [['', '\u{1F3AE}'], ['capa_historia1', '\u{1F4D6}']] },
];

export class Tutorial extends Phaser.Scene {
  private perfil!: Perfil;
  private passo = 0;
  private camada!: Phaser.GameObjects.Container;

  constructor() {
    super('Tutorial');
  }

  create() {
    this.perfil = ativo()!;
    this.passo = 0;
    narrador.setNome(this.perfil.nome);
    fundo(this, TEMA.ceu, 'bg_mapa_mundos');
    cobrirTela(this, TEMA.escuro, 0.45).setDepth(-8);
    botaoOuvir(this);

    // a raposinha fica no alto o tempo todo: e ela quem esta falando
    const raposa = figura(this, W / 2, 300, 'mascote_raposinha', '\u{1F98A}', 300);
    this.tweens.add({ targets: raposa, y: 285, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.camada = this.add.container(0, 0);
    const artes = PASSOS.flatMap((p) => p.figuras.map(([k]) => k)).filter(Boolean);
    carregarCapas(this, artes, () => this.mostrar());
  }

  private mostrar() {
    this.camada.destroy();
    this.camada = this.add.container(0, 0);
    const p = PASSOS[this.passo];
    const frase = fale(p.chave);

    // ponta do balao apontando para a raposinha
    const ponta = this.add.graphics();
    ponta.fillStyle(0xffffff, 0.95);
    ponta.fillTriangle(W / 2 - 34, 492, W / 2 + 34, 492, W / 2, 448);
    this.camada.add([ponta, balao(this, frase, 600, false)]);

    if (p.figuras.length === 0) {
      const eu = desenharPersonagem(this, this.perfil.personagem, 0.5).setPosition(W / 2, 900);
      darVida(this, eu);
      this.camada.add(eu);
    }
    p.figuras.forEach(([arte, emoji], i) => {
      const x = W / 2 + (i - (p.figuras.length - 1) / 2) * 210;
      const f = figura(this, x, 900, arte, emoji, 170);
      this.tweens.add({ targets: f, scale: f.scale * 1.08, duration: 700, yoyo: true, repeat: -1, delay: i * 200 });
      this.camada.add(f);
    });

    const pontos = PASSOS.map((_, i) => (i === this.passo ? '\u{25CF}' : '\u{25CB}')).join(' ');
    this.camada.add(this.add.text(W / 2, 1060, pontos, { fontSize: '40px', color: '#ffffff' }).setOrigin(0.5));

    const ultimo = this.passo === PASSOS.length - 1;
    if (!ultimo) {
      this.camada.add(botao(this, 170, 1170, 'Pular', () => this.terminar(), { largura: 240, cor: 0xbfd4e8 }));
    }
    this.camada.add(
      botao(
        this,
        ultimo ? W / 2 : W - 230,
        1170,
        ultimo ? 'Vamos começar!' : 'Próximo',
        () => {
          if (ultimo) return this.terminar();
          this.passo += 1;
          this.mostrar();
        },
        { icone: ultimo ? '\u{1F680}' : '\u{25B6}\u{FE0F}', cor: TEMA.sim, largura: ultimo ? 460 : 340 },
      ),
    );
  }

  private terminar() {
    this.perfil.viuApresentacao = true;
    salvar(this.perfil);
    irPara(this, 'Mapa');
  }
}
