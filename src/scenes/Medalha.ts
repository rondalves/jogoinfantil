import Phaser from 'phaser';
import { darVida } from '../animacoes';
import { CONFIG, MUNDOS } from '../config';
import { estrelasTotais } from '../economia';
import { MISSOES } from '../missions';
import { narrador } from '../narrador';
import { desenharPersonagem } from '../personagem';
import { ativo, type Perfil } from '../storage';
import { TEMA } from '../theme';
import { botao, botaoOuvir, confete, figura, fundo, irPara, textoEmPainel, titulo } from '../ui';
import { musicaDoMundo } from '../musica';

const W = CONFIG.LARGURA;

/** Fim do jogo: a medalha de Super Ajudante do Dia, com o resumo de tudo. */
export class Medalha extends Phaser.Scene {
  private p!: Perfil;

  constructor() {
    super('Medalha');
  }

  create() {
    musicaDoMundo();
    this.p = ativo()!;
    narrador.setNome(this.p.nome);
    narrador.setVoz(this.p.voz ?? 'f');
    fundo(this, TEMA.creme, 'bg_mapa_mundos');
    botaoOuvir(this);
    titulo(this, 'Super Ajudante\ndo Dia', 250);

    const medalha = figura(this, W / 2, 600, 'medalha_final', '\u{1F3C5}', 420);
    const tamanho = medalha.scale;
    medalha.setScale(0);
    this.tweens.add({ targets: medalha, scale: tamanho, duration: 900, ease: 'Back.out' });
    this.tweens.add({
      targets: medalha,
      angle: { from: -4, to: 4 },
      duration: 1800,
      yoyo: true,
      repeat: -1,
      delay: 900,
    });
    confete(this, 120);

    darVida(this, desenharPersonagem(this, this.p.personagem, 0.32).setPosition(104, 1070));

    const feitas = Object.keys(this.p.missoes).length;
    const resumo = [
      `${feitas} de ${MISSOES.length} missões`,
      `${estrelasTotais(this.p)} estrelas`,
      `${this.p.moedas} moedas`,
      `${this.p.broches.length} de ${MUNDOS.length} broches`,
    ].join('\n');
    textoEmPainel(this, W / 2, 910, resumo, 36, W - 200);

    botao(this, W / 2 + 60, 1080, 'Voltar ao mapa', () => irPara(this, 'Mapa'), {
      icone: '\u{1F5FA}\u{FE0F}',
      largura: 420,
    });

    narrador.falar(
      `Parabéns, {nome}! Você cuidou do seu dia inteirinho. Você é o Super Ajudante do Dia!`,
      'medalha_final',
    );
  }
}
