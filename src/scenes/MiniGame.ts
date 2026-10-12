import Phaser from 'phaser';
import { carregar } from '../assets';
import { CONFIG } from '../config';
import { MINIGAMES, type MiniGame as Jogo, type ResultadoMiniGame } from '../minigames';
import { narrador } from '../narrador';
import { fale } from '../narracoes';
import { TEMA } from '../theme';
import { ativo, type Perfil } from '../storage';
import { balao, botao, botaoOuvir, botaoVoltar, figura, fundo, irPara, titulo } from '../ui';
import { musicaDoMundo } from '../musica';
import { vigiarTempo } from '../tempoDeJogo';

const W = CONFIG.LARGURA;

/** O joguinho da corrida de kart: roda o modulo e mostra o resultado. Nunca ha derrota. */
export class MiniGame extends Phaser.Scene {
  private jogo!: Jogo;
  private perfil!: Perfil;

  constructor() {
    super('MiniGame');
  }

  init(dados: { id?: string }) {
    this.jogo = MINIGAMES.find((g) => g.id === dados?.id) ?? MINIGAMES[0];
  }

  create() {
    this.perfil = ativo()!;
    musicaDoMundo(this.jogo.mundo);
    narrador.setNome(this.perfil.nome);
    narrador.setVoz(this.perfil.voz ?? 'f');
    fundo(this, TEMA.ceu);
    botaoVoltar(this, 'Joguinhos');
    botaoOuvir(this);
    vigiarTempo(this);
    const espera = titulo(this, 'Preparando...', 600);
    carregar(this, this.jogo.arte, () => {
      espera.destroy();
      this.jogo
        .iniciar(this, this.perfil.personagem, 1, { infinito: true })
        .then((r) => this.resultado(r));
    });
  }

  private resultado(r: ResultadoMiniGame) {
    this.input.removeAllListeners();
    this.children.removeAll(true);
    this.tweens.killAll();
    fundo(this, TEMA.ceu);
    titulo(this, this.jogo.tituloFim, 300);
    const frase = fale(this.jogo.fraseFim);
    this.add
      .text(W / 2, 470, `${r.pontos}`, { fontSize: '150px', color: '#2b3a4a', fontStyle: 'bold' })
      .setOrigin(0.5)
      .setStroke('#ffffff', 12);
    figura(this, W / 2 - 150, 470, this.jogo.iconePonto, '\u{1FA99}', 120);
    balao(this, frase, 740);

    // jogar de novo e de graca, sempre
    botao(this, W / 2, 1030, 'Jogar de novo', () => this.scene.restart({ id: this.jogo.id }), {
      icone: '\u{1F3AE}',
      cor: 0x7ddc8a,
      largura: 460,
    });
    botao(this, W / 2, 1170, 'Voltar', () => irPara(this, 'Joguinhos'), { icone: '\u{1F3E0}', largura: 460 });
  }
}
