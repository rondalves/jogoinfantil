import Phaser from 'phaser';
import { IMAGENS } from '../assets';
import { CONFIG } from '../config';
import { listar } from '../storage';

export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    const raposa = this.add
      .text(CONFIG.LARGURA / 2, CONFIG.ALTURA / 2, '\u{1F98A}', { fontSize: '170px' })
      .setOrigin(0.5);
    this.tweens.add({ targets: raposa, angle: { from: -8, to: 8 }, duration: 600, yoyo: true, repeat: -1 });

    // Carrega apenas o que existe de verdade em /assets/img (ver ASSETS.md).
    for (const [chave, url] of Object.entries(IMAGENS)) this.load.image(chave, url);
    this.load.on('loaderror', (f: Phaser.Loader.File) => console.warn('imagem nao carregou:', f.key));
  }

  create() {
    this.scene.start(listar().length > 0 ? 'Perfis' : 'Criador');
  }
}
