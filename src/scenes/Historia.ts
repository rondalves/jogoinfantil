import Phaser from 'phaser';
import { AUDIOS_HISTORIA } from '../assets';
import { CONFIG } from '../config';
import { narrador } from '../narrador';
import { HISTORIAS } from '../stories';
import { TEMA } from '../theme';
import { botaoVoltar, carregarCapas, figura, fundo, irPara, nota, TELA, titulo } from '../ui';

const W = CONFIG.LARGURA;

/**
 * Ouvindo uma historinha.
 *
 * Tela calma de proposito: capa grande respirando devagar, um botao so, e
 * mais nada em que tocar. Nao tem estrela, nao tem acerto nem erro, e sair no
 * meio nao perde nada. A crianca pode so deitar e escutar.
 */
export class Historia extends Phaser.Scene {
  private som?: HTMLAudioElement;
  private tocando = false;

  constructor() {
    super('Historia');
  }

  create(dados: { id?: string }) {
    const h = HISTORIAS.find((x) => x.id === dados?.id) ?? HISTORIAS[0];
    narrador.parar();
    fundo(this, TEMA.escuro, 'bg_quarto_noite');
    botaoVoltar(this, 'Historinhas');
    titulo(this, h.titulo, 190);

    carregarCapas(this, [h.capa], () => {
      const capa = figura(this, W / 2, 620, h.capa, h.icone, 460);
      // respiro lento: da vida sem puxar a atencao de volta para a tela
      this.tweens.add({
        targets: capa,
        scale: capa.scale * 1.03,
        duration: 4000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    const url = AUDIOS_HISTORIA[h.audio];
    if (!url) {
      this.add
        .text(W / 2, 980, 'Essa historinha ainda\nestá sendo gravada.', {
          fontSize: '36px',
          color: '#3a3f45',
          align: 'center',
        })
        .setOrigin(0.5);
      narrador.falar('Essa historinha ainda está sendo gravada. Volte em breve!');
      return;
    }

    this.som = new Audio(url);
    this.som.addEventListener('ended', () => this.pintar(false));

    const barra = this.add.graphics().setDepth(5);
    const pintarBarra = () => {
      const s = this.som;
      barra.clear();
      barra.fillStyle(0xffffff, 0.75);
      barra.fillRoundedRect(90, 1060, W - 180, 20, 10);
      if (!s || !s.duration) return;
      barra.fillStyle(TEMA.sim, 1);
      barra.fillRoundedRect(90, 1060, (W - 180) * (s.currentTime / s.duration), 20, 10);
    };
    this.time.addEvent({ delay: 250, loop: true, callback: pintarBarra });
    pintarBarra();

    const botao = this.add.container(W / 2, 950).setDepth(6);
    const disco = this.add.graphics();
    const rotulo = this.add.text(0, 0, '\u{25B6}\u{FE0F}', { fontSize: '86px' }).setOrigin(0.5);
    botao.add([disco, rotulo]);
    this.pintarBotao = (ligado: boolean) => {
      disco.clear();
      disco.fillStyle(0xffffff, 0.96);
      disco.fillCircle(0, 0, 92);
      disco.lineStyle(14, ligado ? TEMA.sim : 0xe2e6ea, 1);
      disco.strokeCircle(0, 0, 92);
      rotulo.setText(ligado ? '\u{23F8}\u{FE0F}' : '\u{25B6}\u{FE0F}');
    };
    this.pintarBotao(false);
    botao.setSize(200, 200).setInteractive({ useHandCursor: true });
    botao.on('pointerdown', () => this.alternar());

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.som?.pause();
      this.som = undefined;
    });

    // comeca tocando: a crianca tocou no cartao para ouvir, nao para olhar
    this.time.delayedCall(400, () => this.alternar());
    void irPara;
    void nota;
  }

  private pintarBotao: (ligado: boolean) => void = () => undefined;

  private pintar(ligado: boolean) {
    this.tocando = ligado;
    this.pintarBotao(ligado);
  }

  private alternar() {
    if (!this.som) return;
    if (this.tocando) {
      this.som.pause();
      this.pintar(false);
      return;
    }
    this.som.play().catch(() => undefined);
    this.pintar(true);
  }

  update() {
    if (this.som && this.tocando && this.som.paused) this.pintar(false);
    void TELA;
  }
}
