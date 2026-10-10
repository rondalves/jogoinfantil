import Phaser from 'phaser';
import { IMAGENS_BASE } from '../assets';
import { CONFIG } from '../config';
import { ativo, listar } from '../storage';
import { TEMA } from '../theme';
import { montarOpcoes } from '../personagem';
import { cobrirTela, figura, irPara } from '../ui';
import { musicaDoMundo, setMusicaLigada } from '../musica';

const W = CONFIG.LARGURA;
const H = CONFIG.DESENHO;
const MINIMO = 1600;

/** Tela de abertura: logotipo, a raposinha e a barra de carregamento. */
export class Boot extends Phaser.Scene {
  private comecou = 0;

  constructor() {
    super('Boot');
  }

  preload() {
    this.comecou = Date.now();
    cobrirTela(this, TEMA.ceu);
    this.add.rectangle(W / 2, H, W * 1.6, 520, 0x8ccf6f).setOrigin(0.5, 0.5).setAngle(0);

    this.add
      .text(W / 2, 330, 'Missões\ndo Dia', {
        fontSize: '104px',
        fontStyle: 'bold',
        align: 'center',
        color: TEMA.texto,
      })
      .setOrigin(0.5)
      .setStroke(TEMA.contorno, 16)
      .setShadow(0, 10, 'rgba(0,0,0,0.18)', 12);

    const raposa = this.add.text(W / 2, 760, '\u{1F98A}', { fontSize: '200px' }).setOrigin(0.5);
    this.tweens.add({ targets: raposa, y: 720, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const trilho = this.add.graphics();
    trilho.fillStyle(0xffffff, 0.8);
    trilho.fillRoundedRect(W / 2 - 220, 1030, 440, 36, 18);
    const barra = this.add.graphics();
    this.load.on('progress', (v: number) => {
      barra.clear();
      barra.fillStyle(TEMA.sim, 1);
      barra.fillRoundedRect(W / 2 - 214, 1036, Math.max(24, 428 * v), 24, 12);
    });

    // so o essencial: missao e mini game carregam a arte deles na hora
    for (const [chave, url] of Object.entries(IMAGENS_BASE)) this.load.image(chave, url);
    this.load.on('loaderror', (f: Phaser.Loader.File) => console.warn('imagem nao carregou:', f.key));
  }

  create() {
    // monta as listas de cabelo, olhos e roupa a partir do que tem arte. Aqui,
    // nao so no criador: sem isso o personagem sai sem rosto nas outras telas.
    montarOpcoes(this);
    setMusicaLigada(ativo()?.musica !== false);
    musicaDoMundo();
    // a raposinha de verdade entra assim que a arte termina de carregar
    figura(this, W / 2, 760, 'mascote_raposinha', '\u{1F98A}', 300);
    const espera = Math.max(0, MINIMO - (Date.now() - this.comecou));
    this.time.delayedCall(espera, () => irPara(this, listar().length > 0 ? 'Perfis' : 'Criador'));
  }
}
