import Phaser from 'phaser';
import { carregar } from '../assets';
import { CONFIG } from '../config';
import { gastarFicha, podeJogar } from '../economia';
import { MINIGAMES, type MiniGame as Jogo, type ResultadoMiniGame } from '../minigames';
import { narrador } from '../narrador';
import { fale } from '../narracoes';
import { TEMA } from '../theme';
import { ativo, salvar, type Perfil } from '../storage';
import { balao, botao, botaoOuvir, botaoVoltar, figura, fundo, irPara, titulo } from '../ui';
import { musicaDoMundo } from '../musica';

const W = CONFIG.LARGURA;

/** Casa qualquer mini game: roda o modulo e mostra o resultado. Nunca ha derrota. */
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
    botaoVoltar(this, 'Mapa');
    botaoOuvir(this);
    const espera = titulo(this, 'Preparando...', 600);
    carregar(this, this.jogo.arte, () => {
      espera.destroy();
      this.jogo.iniciar(this, this.perfil.personagem, 1).then((r) => this.resultado(r));
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

    const motivo = podeJogar(this.perfil);
    botao(
      this,
      W / 2,
      1030,
      motivo === 'ok' ? 'Jogar de novo' : 'Voltar ao mapa',
      () => {
        if (motivo !== 'ok') {
          irPara(this, 'Mapa');
          return;
        }
        gastarFicha(this.perfil);
        salvar(this.perfil);
        this.scene.restart({ id: this.jogo.id });
      },
      { icone: motivo === 'ok' ? '\u{1F3AE}' : '\u{1F5FA}\u{FE0F}', cor: 0x7ddc8a, largura: 460 },
    );
    if (motivo === 'ok') {
      botao(this, W / 2, 1170, 'Voltar ao mapa', () => irPara(this, 'Mapa'), {
        icone: '\u{1F5FA}\u{FE0F}',
        largura: 460,
      });
    }
  }
}
