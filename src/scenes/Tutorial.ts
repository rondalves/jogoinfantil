import Phaser from 'phaser';
import { CONFIG } from '../config';
import { narrador } from '../narrador';
import { fale, type Chave } from '../narracoes';
import { ativo, salvar, type Perfil } from '../storage';
import { TEMA } from '../theme';
import { balao, botao, botaoOuvir, cobrirTela, figura, fundo, irPara, titulo } from '../ui';

const W = CONFIG.LARGURA;

interface Passo {
  chave: Chave;
  icone: string;
  arte: string;
}

/** Quatro passos de cinco segundos: vinte segundos no total, tudo narrado. */
const PASSOS: Passo[] = [
  { chave: 'tut_1', icone: '\u{1F5FA}\u{FE0F}', arte: 'mundo1' },
  { chave: 'tut_2', icone: '\u{1F449}', arte: 'botao_play' },
  { chave: 'tut_3', icone: '\u{2B50}', arte: 'estrela' },
  { chave: 'tut_4', icone: '\u{1F39F}\u{FE0F}', arte: 'ficha' },
];

export class Tutorial extends Phaser.Scene {
  private perfil!: Perfil;
  private passo = 0;
  private camada!: Phaser.GameObjects.Container;
  private agendado?: Phaser.Time.TimerEvent;

  constructor() {
    super('Tutorial');
  }

  create() {
    this.perfil = ativo()!;
    narrador.setNome(this.perfil.nome);
    fundo(this, TEMA.ceu, 'bg_mapa_mundos');
    cobrirTela(this, TEMA.escuro, 0.55).setDepth(-8);
    botaoOuvir(this);
    titulo(this, 'Como se joga', 180);
    botao(this, W / 2, 1180, 'Pular', () => this.terminar(), { icone: '\u{23ED}\u{FE0F}', largura: 320 });
    this.camada = this.add.container(0, 0);
    this.mostrar();
  }

  private mostrar() {
    this.camada.destroy();
    this.camada = this.add.container(0, 0);
    const p = PASSOS[this.passo];
    const frase = fale(p.chave);

    const alvo = figura(this, W / 2, 640, p.arte, p.icone, 220);
    this.camada.add(alvo);
    this.tweens.add({ targets: alvo, scale: alvo.scale * 1.12, duration: 700, yoyo: true, repeat: -1 });

    // seta animada apontando para o que a frase esta falando
    const seta = this.add.text(W / 2, 460, '\u{1F447}', { fontSize: '110px' }).setOrigin(0.5);
    this.camada.add(seta);
    this.tweens.add({ targets: seta, y: 500, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.camada.add(balao(this, frase, 880));

    const pontos = PASSOS.map((_, i) => (i === this.passo ? '\u{25CF}' : '\u{25CB}')).join(' ');
    this.camada.add(this.add.text(W / 2, 1050, pontos, { fontSize: '40px' }).setOrigin(0.5));

    this.agendado = this.time.delayedCall(5000, () => {
      this.passo += 1;
      if (this.passo >= PASSOS.length) this.terminar();
      else this.mostrar();
    });
  }

  private terminar() {
    this.agendado?.remove();
    this.perfil.viuTutorial = true;
    salvar(this.perfil);
    irPara(this, 'Mapa');
  }
}
